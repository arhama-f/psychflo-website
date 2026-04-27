import { getSupabaseServer } from "../../../lib/supabase.js";
import { getAnthropicClient } from "../../../lib/anthropic.js";

export const runtime = "nodejs";

// Demo data used when no live DB data exists
const DEMO_MANAGERS = [
  {
    id: "m1", name: "Rachel Torres", role: "Engineering Manager", headcount: 8,
    effectiveness_score: 82, grade: "A",
    team_avg_burnout: 28, team_avg_safety: 78, team_attrition_risk: 15,
    strengths: ["Consistent psychological safety scores across reports", "Low cognitive overload patterns", "High standup engagement"],
    risks: ["One direct report showing early flight risk signals"],
    recommendation: "Continue current approach. Consider mentoring peers on team wellbeing practices.",
    trend: 5,
  },
  {
    id: "m2", name: "David Kim", role: "Product Manager", headcount: 5,
    effectiveness_score: 61, grade: "B",
    team_avg_burnout: 51, team_avg_safety: 55, team_attrition_risk: 38,
    strengths: ["Strong delivery metrics", "Clear goal-setting"],
    risks: ["Elevated cognitive load across 3 of 5 reports", "Declining standup safety trend (4 weeks)"],
    recommendation: "Reduce meeting frequency and introduce 1:1 coaching to address team stress signals.",
    trend: -4,
  },
  {
    id: "m3", name: "Sarah Obi", role: "Design Lead", headcount: 4,
    effectiveness_score: 44, grade: "C",
    team_avg_burnout: 67, team_avg_safety: 38, team_attrition_risk: 62,
    strengths: ["High creative output"],
    risks: ["2 direct reports at critical flight risk", "Safety scores declining 3 consecutive months", "Team burnout average in danger zone"],
    recommendation: "Urgent leadership coaching required. Escalate to CHRO. Consider team restructure.",
    trend: -11,
  },
  {
    id: "m4", name: "James Park", role: "Customer Success Lead", headcount: 6,
    effectiveness_score: 91, grade: "A+",
    team_avg_burnout: 18, team_avg_safety: 88, team_attrition_risk: 8,
    strengths: ["Exceptional team psychological safety", "Zero high-risk employees", "Strongest standup safety scores in org"],
    risks: [],
    recommendation: "Model for other managers. Invite to share practices in leadership forum.",
    trend: 8,
  },
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("org_id");
    const db = getSupabaseServer();

    if (!db || !orgId) {
      return Response.json({ managers: DEMO_MANAGERS, is_demo: true });
    }

    // Find employees who are managers (have direct reports linked via manager_id)
    const { data: managers } = await db
      .from("employees")
      .select("id, name, role")
      .eq("org_id", orgId)
      .in("role", ["manager", "admin", "lead"]);

    if (!managers?.length) {
      return Response.json({ managers: DEMO_MANAGERS, is_demo: true });
    }

    const results = [];
    for (const mgr of managers) {
      const { data: reports } = await db
        .from("employees")
        .select("id")
        .eq("org_id", orgId)
        .eq("manager_id", mgr.id);

      if (!reports?.length) continue;

      const reportIds = reports.map(r => r.id);
      const { data: scores } = await db
        .from("attrition_scores")
        .select("employee_id, risk_score, risk_level, created_at")
        .in("employee_id", reportIds)
        .order("created_at", { ascending: false });

      const { data: logs } = await db
        .from("assessment_logs")
        .select("employee_id, tool, score")
        .in("employee_id", reportIds)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const latestScores = {};
      scores?.forEach(s => { if (!latestScores[s.employee_id]) latestScores[s.employee_id] = s; });
      const scoreArr = Object.values(latestScores);

      const teamAvgRisk = scoreArr.length
        ? Math.round(scoreArr.reduce((a, s) => a + s.risk_score, 0) / scoreArr.length) : 50;

      const burnoutLogs = logs?.filter(l => l.tool === "burnout") ?? [];
      const teamAvgBurnout = burnoutLogs.length
        ? Math.round(burnoutLogs.reduce((a, l) => a + (100 - l.score), 0) / burnoutLogs.length) : 40;

      const safetyLogs = logs?.filter(l => l.tool === "standup") ?? [];
      const teamAvgSafety = safetyLogs.length
        ? Math.round(safetyLogs.reduce((a, l) => a + l.score, 0) / safetyLogs.length) : 60;

      const effectivenessScore = Math.round(
        (100 - teamAvgBurnout) * 0.35 +
        teamAvgSafety * 0.35 +
        (100 - teamAvgRisk) * 0.30
      );

      const grade = effectivenessScore >= 85 ? "A+" : effectivenessScore >= 70 ? "A" : effectivenessScore >= 55 ? "B" : effectivenessScore >= 40 ? "C" : "D";

      results.push({
        id: mgr.id, name: mgr.name, role: mgr.role,
        headcount: reports.length,
        effectiveness_score: effectivenessScore,
        grade,
        team_avg_burnout: teamAvgBurnout,
        team_avg_safety: teamAvgSafety,
        team_attrition_risk: teamAvgRisk,
        strengths: [],
        risks: scoreArr.filter(s => ["critical", "high"].includes(s.risk_level)).length > 0
          ? [`${scoreArr.filter(s => ["critical", "high"].includes(s.risk_level)).length} direct report(s) at high flight risk`]
          : [],
        recommendation: effectivenessScore >= 70
          ? "Performing well. Continue regular check-ins."
          : effectivenessScore >= 50
          ? "Review team workload and introduce structured 1:1s."
          : "Urgent coaching intervention required. Escalate to CHRO.",
        trend: 0,
      });
    }

    if (!results.length) return Response.json({ managers: DEMO_MANAGERS, is_demo: true });

    results.sort((a, b) => b.effectiveness_score - a.effectiveness_score);
    return Response.json({ managers: results, is_demo: false });
  } catch (err) {
    console.error("Manager effectiveness error:", err);
    return Response.json({ managers: DEMO_MANAGERS, is_demo: true });
  }
}
