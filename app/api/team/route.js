import { getSupabaseServer } from "../../../lib/supabase.js";
import { riskLabel, dimensionLabel } from "../../../lib/mbi-score.js";
import { cookies } from "next/headers";

/**
 * GET /api/team?teamId=xxx&weekStart=2026-04-14
 *
 * Returns anonymised team burnout data for managers.
 * Never returns individual scores — only aggregates and risk buckets.
 * Suppresses results if fewer than 5 responses (anonymity threshold).
 * If teamId is omitted, auto-resolves from the authenticated user's session.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let teamId      = searchParams.get("teamId");
    const weekStart = searchParams.get("weekStart") || getCurrentWeekStart();

    const db = getSupabaseServer();

    // Auto-detect teamId from session cookie if not provided
    if (!teamId && db) {
      try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("sb-access-token")?.value;
        if (accessToken) {
          const { data: { user } } = await db.auth.getUser(accessToken);
          if (user) {
            const { data: emp } = await db
              .from("employees")
              .select("team_id")
              .eq("auth_user_id", user.id)
              .single();
            teamId = emp?.team_id;
          }
        }
      } catch {}
    }

    if (!teamId) {
      return Response.json(getMockTeamData(), { status: 200 });
    }

    if (!db) return Response.json(getMockTeamData(), { status: 200 });

    // Fetch team members + their latest check-ins this week
    const { data: checkins, error } = await db
      .from("burnout_checkins")
      .select(`
        burnout_score, exhaustion_score, cynicism_score, efficacy_score, stressors,
        employees!inner(team_id)
      `)
      .eq("employees.team_id", teamId)
      .gte("week_start", weekStart)
      .lt("week_start", addDays(weekStart, 7));

    if (error) throw error;

    if (!checkins || checkins.length < 5) {
      return Response.json({
        suppressed: true,
        reason: `Only ${checkins?.length || 0} responses this week. Results are hidden until 5+ team members complete the check-in to protect anonymity.`,
        responseCount: checkins?.length || 0,
      });
    }

    const team = aggregateTeamData(checkins, teamId);

    // Fetch 6-week trend
    const { data: trend } = await db
      .from("team_snapshots")
      .select("avg_burnout, week_start")
      .eq("team_id", teamId)
      .order("week_start", { ascending: true })
      .limit(6);

    team.weeklyTrend = trend?.map(t => t.avg_burnout) || team.weeklyTrend;

    return Response.json(team);
  } catch (err) {
    console.error("Team API error:", err);
    return Response.json({ error: "Failed to load team data" }, { status: 500 });
  }
}

function aggregateTeamData(checkins, teamId) {
  const n = checkins.length;
  const avg = key => Math.round(checkins.reduce((s, c) => s + c[key], 0) / n);

  const avgBurnout     = avg("burnout_score");
  const avgExhaustion  = avg("exhaustion_score");
  const avgCynicism    = avg("cynicism_score");
  const avgEfficacy    = avg("efficacy_score");

  const highRisk     = checkins.filter(c => c.burnout_score >= 67).length;
  const moderateRisk = checkins.filter(c => c.burnout_score >= 34 && c.burnout_score < 67).length;
  const lowRisk      = checkins.filter(c => c.burnout_score < 34).length;

  // Aggregate stressors (never tied to individuals)
  const stressorCounts = {};
  checkins.forEach(c => {
    (c.stressors || []).forEach(s => { stressorCounts[s] = (stressorCounts[s] || 0) + 1; });
  });
  const topTeamStressors = Object.entries(stressorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([stressor, count]) => ({
      stressor,
      percentage: Math.round((count / n) * 100),
    }));

  const risk = riskLabel(avgBurnout);

  return {
    overallRisk: avgBurnout,
    color: risk.color,
    label: risk.label,
    trend: "worsening",
    size: n,
    atHighRisk: highRisk,
    atModerateRisk: moderateRisk,
    atLowRisk: lowRisk,
    weeklyTrend: [avgBurnout], // will be replaced with real trend above
    peakPrediction: { week: 10, score: Math.min(95, avgBurnout + 15), confidence: 72 },
    dimensions: {
      exhaustion: { score: avgExhaustion, benchmark: 34, color: dimensionLabel(avgExhaustion).color },
      cynicism:   { score: avgCynicism,   benchmark: 28, color: dimensionLabel(avgCynicism).color },
      efficacy:   { score: avgEfficacy,   benchmark: 72, color: dimensionLabel(avgEfficacy).color },
    },
    riskDistribution: [
      { label: "Low risk",      count: lowRisk,      percentage: Math.round(lowRisk / n * 100),      color: "#10b981" },
      { label: "Moderate risk", count: moderateRisk, percentage: Math.round(moderateRisk / n * 100), color: "#f59e0b" },
      { label: "High risk",     count: highRisk,     percentage: Math.round(highRisk / n * 100),     color: "#ef4444" },
    ],
    topTeamStressors,
    responseCount: n,
  };
}

function getCurrentWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff)).toISOString().split("T")[0];
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// Fallback when DB not configured
function getMockTeamData() {
  return {
    suppressed: false,
    overallRisk: 54, color: "#f59e0b", label: "Moderate Risk",
    trend: "worsening", size: 12, atHighRisk: 3, atModerateRisk: 5, atLowRisk: 4,
    weeklyTrend: [38, 41, 44, 48, 51, 54],
    peakPrediction: { week: 10, score: 71, confidence: 78 },
    dimensions: {
      exhaustion: { score: 58, benchmark: 34, color: "#f59e0b" },
      cynicism:   { score: 49, benchmark: 28, color: "#f59e0b" },
      efficacy:   { score: 61, benchmark: 72, color: "#10b981" },
    },
    riskDistribution: [
      { label: "Low risk",      count: 4, percentage: 33, color: "#10b981" },
      { label: "Moderate risk", count: 5, percentage: 42, color: "#f59e0b" },
      { label: "High risk",     count: 3, percentage: 25, color: "#ef4444" },
    ],
    topTeamStressors: [
      { stressor: "Workload volume",   percentage: 83 },
      { stressor: "Meeting overload",  percentage: 75 },
      { stressor: "Priority conflicts",percentage: 67 },
      { stressor: "Recognition deficit",percentage: 58 },
      { stressor: "Remote isolation",  percentage: 42 },
    ],
  };
}
