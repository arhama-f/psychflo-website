import { getSupabaseServer } from "../../../lib/supabase.js";
import { getAnthropicClient } from "../../../lib/anthropic.js";

export const runtime = "nodejs";

// GET /api/attrition — return latest risk scores for the org
export async function GET(req) {
  try {
    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "db_error" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("org_id");
    if (!orgId) return Response.json({ error: "org_id required" }, { status: 400 });

    // Get all employees for this org
    const { data: employees } = await db
      .from("employees")
      .select("id, name, email, role, created_at")
      .eq("org_id", orgId);

    if (!employees?.length) return Response.json({ employees: [], summary: buildSummary([]) });

    // Get latest risk score per employee
    const employeeIds = employees.map(e => e.id);
    const { data: scores } = await db
      .from("attrition_scores")
      .select("*")
      .in("employee_id", employeeIds)
      .order("created_at", { ascending: false });

    // Get previous scores for trend (7 days ago)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: oldScores } = await db
      .from("attrition_scores")
      .select("employee_id, risk_score, created_at")
      .in("employee_id", employeeIds)
      .lte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false });

    // Build latest score map + previous score map
    const latestMap = {};
    const prevMap = {};
    scores?.forEach(s => { if (!latestMap[s.employee_id]) latestMap[s.employee_id] = s; });
    oldScores?.forEach(s => { if (!prevMap[s.employee_id]) prevMap[s.employee_id] = s; });

    const result = employees.map(emp => {
      const latest = latestMap[emp.id];
      const prev = prevMap[emp.id];
      const tenureMonths = Math.floor((Date.now() - new Date(emp.created_at)) / (1000 * 60 * 60 * 24 * 30));
      const trend = latest && prev
        ? latest.risk_score - prev.risk_score
        : 0;

      return {
        id: emp.id,
        name: emp.name,
        role: emp.role,
        tenure_months: tenureMonths,
        risk_score: latest?.risk_score ?? null,
        risk_level: latest?.risk_level ?? "unscored",
        drivers: latest?.drivers ?? [],
        recommendation: latest?.recommendation ?? null,
        predicted_departure_days: latest?.predicted_departure_days ?? null,
        trend,
        last_scored: latest?.created_at ?? null,
      };
    });

    // Sort by risk_score desc
    result.sort((a, b) => (b.risk_score ?? -1) - (a.risk_score ?? -1));

    return Response.json({ employees: result, summary: buildSummary(result) });
  } catch (err) {
    console.error("GET /api/attrition error:", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}

// POST /api/attrition — run AI scoring for all employees in an org
export async function POST(req) {
  try {
    const { org_id, employee_id } = await req.json();
    if (!org_id) return Response.json({ error: "org_id required" }, { status: 400 });

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "db_error" }, { status: 500 });

    // Fetch employees (single or all)
    let query = db.from("employees").select("id, name, email, role, created_at").eq("org_id", org_id);
    if (employee_id) query = query.eq("id", employee_id);
    const { data: employees } = await query;
    if (!employees?.length) return Response.json({ scored: 0 });

    const anthropic = getAnthropicClient();
    const results = [];

    for (const emp of employees) {
      const tenureMonths = Math.floor((Date.now() - new Date(emp.created_at)) / (1000 * 60 * 60 * 24 * 30));

      // Pull last 30 days of assessment logs for this employee
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: logs } = await db
        .from("assessment_logs")
        .select("tool, score, flags, created_at")
        .eq("employee_id", emp.id)
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: false });

      // Aggregate signals by tool
      const signals = aggregateSignals(logs ?? [], tenureMonths, emp.role);

      // Score with Claude
      const score = await scoreWithClaude(anthropic, emp, tenureMonths, signals);
      if (!score) continue;

      // Store the score
      await db.from("attrition_scores").insert({
        employee_id: emp.id,
        org_id,
        risk_score: score.risk_score,
        risk_level: score.risk_level,
        drivers: score.drivers,
        recommendation: score.recommendation,
        predicted_departure_days: score.predicted_departure_days,
        signals_snapshot: signals,
      });

      results.push({ employee_id: emp.id, name: emp.name, ...score });
    }

    return Response.json({ scored: results.length, results });
  } catch (err) {
    console.error("POST /api/attrition error:", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}

function aggregateSignals(logs, tenureMonths, role) {
  const byTool = {};
  logs.forEach(l => {
    if (!byTool[l.tool]) byTool[l.tool] = [];
    byTool[l.tool].push(l.score);
  });

  const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;
  const trend = arr => {
    if (arr.length < 2) return "insufficient_data";
    const mid = Math.floor(arr.length / 2);
    const recent = avg(arr.slice(0, mid));
    const older = avg(arr.slice(mid));
    const diff = recent - older;
    if (diff < -10) return "declining";
    if (diff > 10) return "improving";
    return "stable";
  };

  return {
    tenure_months: tenureMonths,
    role,
    standup: { avg: avg(byTool.standup ?? []), trend: trend(byTool.standup ?? []), count: (byTool.standup ?? []).length },
    cogload: { avg: avg(byTool.cogload ?? []), trend: trend(byTool.cogload ?? []), count: (byTool.cogload ?? []).length },
    burnout: { avg: avg(byTool.burnout ?? []), trend: trend(byTool.burnout ?? []), count: (byTool.burnout ?? []).length },
    onboarding: { avg: avg(byTool.onboarding ?? []), trend: trend(byTool.onboarding ?? []), count: (byTool.onboarding ?? []).length },
    total_assessments: logs.length,
  };
}

async function scoreWithClaude(anthropic, emp, tenureMonths, signals) {
  try {
    const prompt = `You are an expert people analytics engine specialising in employee attrition prediction. Analyse the signals below and return a flight risk assessment.

Employee profile:
- Name: ${emp.name}
- Role: ${emp.role || "unknown"}
- Tenure: ${tenureMonths} months

Behavioural signals (last 30 days, scores are 0-100 where higher = healthier):
- Standup psychological safety: avg ${signals.standup.avg ?? "no data"}/100, trend: ${signals.standup.trend}, samples: ${signals.standup.count}
- Cognitive load / flow: avg ${signals.cogload.avg ?? "no data"}/100, trend: ${signals.cogload.trend}, samples: ${signals.cogload.count}
- Burnout risk: avg ${signals.burnout.avg ?? "no data"}/100, trend: ${signals.burnout.trend}, samples: ${signals.burnout.count}
- Onboarding satisfaction: avg ${signals.onboarding.avg ?? "no data"}/100, trend: ${signals.onboarding.trend}, samples: ${signals.onboarding.count}
- Total tool engagement in 30 days: ${signals.total_assessments} assessments

Attrition risk factors to consider:
- Declining scores across multiple tools = strong signal
- Low standup safety + high cogload = burnout trajectory
- Very new employees (< 3 months) with low onboarding scores = early attrition risk
- Disengagement from tools (low assessment count) = withdrawal signal
- Role + tenure patterns (senior ICs at 18-24 months often face growth ceiling frustration)

Return ONLY valid JSON (no markdown fences):
{
  "risk_score": <integer 0-100>,
  "risk_level": "<low|medium|high|critical>",
  "drivers": ["<top driver>", "<second driver>", "<third driver>"],
  "recommendation": "<specific, actionable manager intervention in one sentence>",
  "predicted_departure_days": <30|60|90|null>
}

risk_score guide: 0-25 = low, 26-50 = medium, 51-75 = high, 76-100 = critical`;

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = msg.content[0]?.text?.trim() ?? "";
    const json = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(json);
  } catch (err) {
    console.error("Claude scoring failed for", emp.name, err.message);
    return null;
  }
}

function buildSummary(employees) {
  const scored = employees.filter(e => e.risk_score !== null);
  return {
    total: employees.length,
    scored: scored.length,
    critical: scored.filter(e => e.risk_level === "critical").length,
    high: scored.filter(e => e.risk_level === "high").length,
    medium: scored.filter(e => e.risk_level === "medium").length,
    low: scored.filter(e => e.risk_level === "low").length,
    avg_risk: scored.length ? Math.round(scored.reduce((a, e) => a + e.risk_score, 0) / scored.length) : 0,
    at_risk: scored.filter(e => ["high", "critical"].includes(e.risk_level)).length,
    trending_up: scored.filter(e => e.trend > 5).length,
  };
}
