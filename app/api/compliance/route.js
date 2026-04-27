import { getSupabaseServer } from "../../../lib/supabase.js";

export const runtime = "nodejs";

// ISO 45003:2021 mapped to PsychFlo feature coverage
const ISO_45003_CLAUSES = [
  {
    clause: "4.1",
    title: "Understanding the organisation and its context",
    description: "Identify internal/external factors affecting psychological health at work",
    psychflo_feature: "Burnout Monitor + Policy Analyser",
    evidence_type: "assessment_completed",
    weight: 8,
  },
  {
    clause: "4.2",
    title: "Needs and expectations of workers",
    description: "Workers' wellbeing requirements understood and documented",
    psychflo_feature: "Daily Pulse + Standup Safety",
    evidence_type: "assessment_completed",
    weight: 7,
  },
  {
    clause: "5.1",
    title: "Leadership commitment",
    description: "Top management demonstrates commitment to psychological safety",
    psychflo_feature: "Manager Effectiveness Score + Board Report",
    evidence_type: "intervention_logged",
    weight: 9,
  },
  {
    clause: "5.4",
    title: "Worker consultation and participation",
    description: "Workers consulted on matters affecting psychological health",
    psychflo_feature: "Daily Pulse + Standup Safety",
    evidence_type: "assessment_completed",
    weight: 8,
  },
  {
    clause: "6.1.1",
    title: "Risk assessment — identification",
    description: "Hazards to psychological health systematically identified",
    psychflo_feature: "Burnout Monitor + Attrition Risk Engine",
    evidence_type: "risk_flag_raised",
    weight: 10,
  },
  {
    clause: "6.1.2",
    title: "Risk assessment — evaluation",
    description: "Risks evaluated and prioritised for intervention",
    psychflo_feature: "Flight Risk Dashboard + Manager Effectiveness",
    evidence_type: "risk_flag_raised",
    weight: 10,
  },
  {
    clause: "6.1.3",
    title: "Risk controls",
    description: "Controls applied to eliminate or reduce psychological hazards",
    psychflo_feature: "Manager Coaching + AI Scripts",
    evidence_type: "intervention_logged",
    weight: 9,
  },
  {
    clause: "7.2",
    title: "Competence",
    description: "Workers competent to manage psychosocial risks",
    psychflo_feature: "Manager Coaching + Learning Resources",
    evidence_type: "intervention_logged",
    weight: 6,
  },
  {
    clause: "8.1",
    title: "Operational planning and control",
    description: "Processes documented and implemented to manage psychological risk",
    psychflo_feature: "Policy Analyser + Compliance Audit Trail",
    evidence_type: "policy_reviewed",
    weight: 8,
  },
  {
    clause: "9.1",
    title: "Monitoring and measurement",
    description: "Performance against psychological safety objectives monitored",
    psychflo_feature: "All dashboards + Weekly Digest",
    evidence_type: "assessment_completed",
    weight: 9,
  },
  {
    clause: "9.3",
    title: "Management review",
    description: "Top management reviews psychological health management system",
    psychflo_feature: "Board Report + Benchmarking",
    evidence_type: "policy_reviewed",
    weight: 7,
  },
  {
    clause: "10.2",
    title: "Incident and nonconformity",
    description: "Psychological incidents investigated and corrected",
    psychflo_feature: "Risk Flags + Intervention Logging",
    evidence_type: "intervention_logged",
    weight: 8,
  },
];

// Demo audit log
const DEMO_EVENTS = [
  { id: "e1", event_type: "assessment_completed", severity: "info",   iso_clause: "6.1.1", created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),  event_data: { tool: "burnout", employee: "Sarah Chen", score: 28 } },
  { id: "e2", event_type: "risk_flag_raised",     severity: "warning",iso_clause: "6.1.2", created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),  event_data: { employee: "Sarah Chen", risk_level: "critical", score: 81 } },
  { id: "e3", event_type: "intervention_logged",  severity: "info",   iso_clause: "6.1.3", created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),  event_data: { manager: "Rachel Torres", action: "1:1 scheduled with Sarah Chen" } },
  { id: "e4", event_type: "assessment_completed", severity: "info",   iso_clause: "4.2",   created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), event_data: { tool: "standup", employee: "Marcus Williams", score: 62 } },
  { id: "e5", event_type: "policy_reviewed",      severity: "info",   iso_clause: "8.1",   created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), event_data: { policy: "Mental Health at Work Policy", gaps: 2 } },
  { id: "e6", event_type: "risk_flag_raised",     severity: "warning",iso_clause: "6.1.1", created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), event_data: { employee: "Aisha Patel", risk_level: "high", score: 67 } },
  { id: "e7", event_type: "assessment_completed", severity: "info",   iso_clause: "4.2",   created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), event_data: { tool: "pulse", responses: 14, avg_mood: 3.2 } },
  { id: "e8", event_type: "consent_given",        severity: "info",   iso_clause: "4.2",   created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), event_data: { employee: "James Okafor" } },
  { id: "e9", event_type: "intervention_logged",  severity: "info",   iso_clause: "7.2",   created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), event_data: { manager: "David Kim", action: "Completed manager coaching session" } },
  { id: "e10", event_type: "policy_reviewed",     severity: "info",   iso_clause: "9.3",   created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), event_data: { report: "Q2 Board Psychological Safety Report generated" } },
];

function calcComplianceScore(events, clauses) {
  const coveredTypes = new Set(events.map(e => e.event_type));
  let totalWeight = 0;
  let earnedWeight = 0;

  clauses.forEach(c => {
    totalWeight += c.weight;
    if (coveredTypes.has(c.evidence_type)) {
      earnedWeight += c.weight;
    }
  });

  return Math.round((earnedWeight / totalWeight) * 100);
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("org_id");
    const db = getSupabaseServer();

    let events = DEMO_EVENTS;
    let isDemo = true;

    if (db && orgId) {
      const { data: dbEvents } = await db
        .from("compliance_events")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (dbEvents?.length) {
        events = dbEvents;
        isDemo = false;
      }
    }

    const score = calcComplianceScore(events, ISO_45003_CLAUSES);
    const coveredTypes = new Set(events.map(e => e.event_type));

    const clauses = ISO_45003_CLAUSES.map(c => ({
      ...c,
      met: coveredTypes.has(c.evidence_type),
      evidence_count: events.filter(e => e.iso_clause === c.clause).length,
    }));

    const metCount = clauses.filter(c => c.met).length;
    const nextReview = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    return Response.json({
      compliance_score: score,
      clauses_met: metCount,
      clauses_total: clauses.length,
      clauses,
      audit_log: events.slice(0, 50),
      next_review: nextReview.toISOString(),
      frameworks: [
        { id: "iso_45003", label: "ISO 45003:2021", score, status: score >= 80 ? "compliant" : score >= 60 ? "partial" : "non_compliant" },
        { id: "hse_msd",   label: "UK HSE Management Standards", score: Math.min(100, score + 5), status: score >= 75 ? "compliant" : "partial" },
        { id: "eu_mhaw",   label: "EU Mental Health at Work Directive", score: Math.max(0, score - 8), status: score >= 85 ? "compliant" : "partial" },
      ],
      is_demo: isDemo,
    });
  } catch (err) {
    console.error("Compliance error:", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}

// POST /api/compliance — log a compliance event
export async function POST(req) {
  try {
    const body = await req.json();
    const { org_id, event_type, event_data, iso_clause, severity, employee_id } = body;
    if (!org_id || !event_type) return Response.json({ error: "missing fields" }, { status: 400 });

    const db = getSupabaseServer();
    if (!db) return Response.json({ logged: false, reason: "no_db" });

    await db.from("compliance_events").insert({
      org_id, event_type, event_data: event_data || {},
      iso_clause, severity: severity || "info",
      employee_id: employee_id || null,
    });

    return Response.json({ logged: true });
  } catch (err) {
    console.error("Log compliance event error:", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
