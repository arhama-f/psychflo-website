import { getSupabaseServer } from "../../../../lib/supabase.js";

export const runtime = "nodejs";

const AVG_SALARY = 65000;
const REPLACEMENT_MULTIPLIER = 1.6;
const TURNOVER_RATE = 0.15;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("org_id");

    const db = getSupabaseServer();

    let orgName = "Your Organisation";
    let headcount = 0;
    let attritionData = { at_risk: 3, critical: 1, avg_risk: 45, total: 7, scored: 7 };
    let prevAttritionRisk = 52;

    if (db && orgId) {
      const [{ data: org }, { data: emps }] = await Promise.all([
        db.from("organisations").select("name").eq("id", orgId).single(),
        db.from("employees").select("id").eq("org_id", orgId),
      ]);
      orgName = org?.name || orgName;
      headcount = emps?.length || 0;

      const empIds = (emps || []).map(e => e.id);
      if (empIds.length) {
        const { data: scores } = await db
          .from("attrition_scores")
          .select("employee_id, risk_score, risk_level, created_at")
          .in("employee_id", empIds)
          .order("created_at", { ascending: false });

        const latestMap = {};
        scores?.forEach(s => { if (!latestMap[s.employee_id]) latestMap[s.employee_id] = s; });
        const latest = Object.values(latestMap);
        attritionData = {
          total: headcount,
          scored: latest.length,
          critical: latest.filter(s => s.risk_level === "critical").length,
          high: latest.filter(s => s.risk_level === "high").length,
          medium: latest.filter(s => s.risk_level === "medium").length,
          low: latest.filter(s => s.risk_level === "low").length,
          at_risk: latest.filter(s => ["critical", "high"].includes(s.risk_level)).length,
          avg_risk: latest.length ? Math.round(latest.reduce((a, s) => a + s.risk_score, 0) / latest.length) : 0,
        };
      }
    } else {
      headcount = 47;
    }

    const attritionExposure = Math.round(attritionData.at_risk * AVG_SALARY * REPLACEMENT_MULTIPLIER);
    const baselineExposure = Math.round(headcount * TURNOVER_RATE * AVG_SALARY * REPLACEMENT_MULTIPLIER);
    const prevented = Math.max(0, baselineExposure - attritionExposure);
    const psychfloAnnualCost = headcount <= 25 ? 1800 : headcount <= 100 ? 3600 : 9600;
    const roi = prevented > 0 ? Math.round(prevented / psychfloAnnualCost) : 0;
    const safetyScore = Math.max(0, 100 - attritionData.avg_risk);
    const prevSafetyScore = Math.max(0, 100 - prevAttritionRisk);
    const scoreDelta = safetyScore - prevSafetyScore;

    const interventions = [
      attritionData.critical > 0
        ? `Conduct urgent retention conversations with ${attritionData.critical} critical-risk employee${attritionData.critical > 1 ? "s" : ""} within 7 days`
        : null,
      attritionData.high > 0
        ? `Review workload and growth trajectory for ${attritionData.high} high-risk employee${attritionData.high > 1 ? "s" : ""}`
        : null,
      "Launch structured manager effectiveness programme to reduce team-level burnout signals",
      "Implement weekly pulse check-ins via Slack to maintain real-time visibility",
      "Schedule CHRO review of psychological safety benchmarks vs. industry peers",
    ].filter(Boolean).slice(0, 3);

    return Response.json({
      org_name: orgName,
      generated_at: new Date().toISOString(),
      period: `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`,
      headcount,
      safety_score: safetyScore,
      prev_safety_score: prevSafetyScore,
      score_delta: scoreDelta,
      attrition: attritionData,
      financials: {
        avg_salary: AVG_SALARY,
        attrition_exposure: attritionExposure,
        baseline_exposure: baselineExposure,
        cost_prevented: prevented,
        psychflo_cost: psychfloAnnualCost,
        roi,
      },
      interventions,
    });
  } catch (err) {
    console.error("Board report error:", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
