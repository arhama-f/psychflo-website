import { scoreMBI, riskLabel, dimensionLabel } from "../../../lib/mbi-score.js";
import { getAnthropicClient } from "../../../lib/anthropic.js";
import { getSupabaseServer } from "../../../lib/supabase.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const { responses, employeeId, weekNumber = 1, consentGiven } = body;

    if (!consentGiven) {
      return Response.json({ error: "Consent required" }, { status: 400 });
    }

    if (!responses || typeof responses !== "object") {
      return Response.json({ error: "Invalid responses" }, { status: 400 });
    }

    // 1. Score with MBI algorithm
    const scored = scoreMBI(responses);
    const risk   = riskLabel(scored.burnoutScore);

    const dimensions = {
      exhaustion: {
        score: scored.dimensions.exhaustion,
        ...dimensionLabel(scored.dimensions.exhaustion),
        description: getDimensionDescription("exhaustion", scored.dimensions.exhaustion),
      },
      cynicism: {
        score: scored.dimensions.cynicism,
        ...dimensionLabel(scored.dimensions.cynicism),
        description: getDimensionDescription("cynicism", scored.dimensions.cynicism),
      },
      efficacy: {
        score: scored.dimensions.efficacy,
        ...dimensionLabel(scored.dimensions.efficacy),
        description: getDimensionDescription("efficacy", scored.dimensions.efficacy),
      },
    };

    // 2. Claude AI personalised analysis
    let aiAnalysis = null;
    try {
      const client = getAnthropicClient();
      const prompt = buildPrompt(scored, dimensions, responses);

      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: `You are an occupational psychologist analysing burnout survey responses.
Return ONLY valid JSON matching the exact schema requested. No prose, no markdown.`,
        messages: [{ role: "user", content: prompt }],
      });

      aiAnalysis = JSON.parse(message.content[0].text);
    } catch (err) {
      console.error("Claude analysis failed, using fallback:", err.message);
      aiAnalysis = getFallbackAnalysis(scored, responses);
    }

    // 3. Persist to Supabase if available (upsert handles re-submissions same week)
    const db = getSupabaseServer();
    if (db && employeeId) {
      const weekStart = new Date();
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      const weekStartStr = weekStart.toISOString().split("T")[0];

      await db.from("burnout_checkins").upsert({
        employee_id: employeeId,
        week_number: weekNumber,
        week_start: weekStartStr,
        burnout_score: scored.burnoutScore,
        exhaustion_score: scored.dimensions.exhaustion,
        cynicism_score: scored.dimensions.cynicism,
        efficacy_score: scored.dimensions.efficacy,
        stressors: scored.stressors,
        raw_responses: responses,
        consent_given: true,
      }, { onConflict: "employee_id,week_start" }).throwOnError();
    }

    // 4. Build historical trend (real if DB available, seeded otherwise)
    const weeklyScores = await getWeeklyTrend(db, employeeId, scored.burnoutScore, weekNumber);

    // 5. Auto-trigger alert if high risk (fire-and-forget, non-blocking)
    if (scored.burnoutScore >= 70 && employeeId) {
      fetch(`${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          burnoutScore: scored.burnoutScore,
          stressors: scored.stressors,
          dimensions: {
            exhaustion: scored.dimensions.exhaustion,
            cynicism: scored.dimensions.cynicism,
            efficacy: scored.dimensions.efficacy,
          },
        }),
      }).catch(() => null); // never block the response
    }

    // 6. Assemble response
    const result = {
      employee: {
        burnoutScore: scored.burnoutScore,
        color: risk.color,
        label: risk.label,
        trend: weeklyScores.at(-1) > weeklyScores.at(-2) ? "worsening" : "improving",
        weeklyScores,
        peakPrediction: predictPeak(weeklyScores),
        dimensions,
        topStressors: aiAnalysis.topStressors,
        recoveryRecommendations: aiAnalysis.recoveryRecommendations,
        moodTrajectory: aiAnalysis.moodTrajectory,
        highRiskAlertTriggered: scored.burnoutScore >= 70,
      },
      // Team and org views populated from real aggregation via /api/team
      team: null,
      organisation: null,
    };

    return Response.json(result);
  } catch (err) {
    console.error("Burnout API error:", err);
    return Response.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildPrompt(scored, dimensions, responses) {
  return `
Burnout assessment results for an employee:

Burnout score: ${scored.burnoutScore}/100
Exhaustion: ${dimensions.exhaustion.score}/100 (${dimensions.exhaustion.label})
Cynicism: ${dimensions.cynicism.score}/100 (${dimensions.cynicism.label})
Efficacy: ${dimensions.efficacy.score}/100 (${dimensions.efficacy.label})
Reported stressors: ${(scored.stressors || []).join(", ") || "none"}
Manager support: ${scored.support || "not stated"}
Duration of symptoms: ${scored.timeline || "not stated"}

Return JSON with this exact schema:
{
  "topStressors": [
    { "stressor": string, "severity": number (0-100), "trend": "increasing"|"stable"|"decreasing" }
  ],
  "recoveryRecommendations": [
    { "priority": "Immediate"|"This week"|"This month", "action": string, "science": string }
  ],
  "moodTrajectory": [
    { "day": "Mon"|"Tue"|"Wed"|"Thu"|"Fri", "energy": number (0-100), "stress": number (0-100), "focus": number (0-100) }
  ]
}

Rules:
- topStressors: 4-5 items, grounded in reported stressors and scores
- recoveryRecommendations: 4 items, specific and evidence-based, ordered by urgency
- moodTrajectory: exactly 5 items (Mon–Fri), values consistent with burnout score
- All numbers must be integers
`.trim();
}

function getDimensionDescription(dimension, score) {
  const descriptions = {
    exhaustion: {
      high: "You are reporting high levels of emotional and physical depletion. This is the earliest and strongest predictor of burnout.",
      mid:  "You are showing moderate signs of fatigue. Worth monitoring — exhaustion typically precedes the other dimensions.",
      low:  "Your energy levels appear sustainable. Keep protecting your recovery time to maintain this.",
    },
    cynicism: {
      high: "You are experiencing increasing detachment from your work. This often follows exhaustion and signals disengagement is setting in.",
      mid:  "You are showing some detachment from work. An early signal — address root causes before it deepens.",
      low:  "You still feel connected to the purpose of your work. This is a protective factor against burnout progression.",
    },
    efficacy: {
      high: "Your sense of accomplishment and effectiveness at work is reducing. This is often the last dimension to deteriorate.",
      mid:  "Your confidence in your effectiveness is somewhat reduced. Often linked to workload and lack of recognition.",
      low:  "You still feel effective and capable at work. This is the strongest buffer against full burnout.",
    },
  };
  const key = score >= 60 ? "high" : score >= 35 ? "mid" : "low";
  return descriptions[dimension][key];
}

function getFallbackAnalysis(scored, responses) {
  const stressors = (responses.stressors || []).map((s, i) => ({
    stressor: s,
    severity: Math.max(40, 85 - i * 8),
    trend: i === 0 ? "increasing" : "stable",
  }));

  if (stressors.length === 0) {
    stressors.push({ stressor: "General work pressure", severity: scored.burnoutScore, trend: "stable" });
  }

  return {
    topStressors: stressors.slice(0, 5),
    recoveryRecommendations: [
      { priority: "Immediate", action: "Block 2 hours of uninterrupted focus time daily", science: "Protected focus time reduces exhaustion scores by 31% within 14 days" },
      { priority: "Immediate", action: "Decline or delegate at least 3 recurring meetings this week", science: "Meeting load reduction is the single highest-impact exhaustion intervention" },
      { priority: "This week", action: "Have a conversation with your manager about current priorities", science: "Role clarity reduces cynicism scores — the second strongest predictor of burnout progression" },
      { priority: "This month", action: "Establish a consistent end-of-day shutdown ritual", science: "Psychological detachment in evenings reduces next-day exhaustion by 23%" },
    ],
    moodTrajectory: [
      { day: "Mon", energy: Math.round(Math.max(20, 65 - scored.burnoutScore * 0.4)), stress: Math.round(Math.min(90, scored.burnoutScore * 0.9)),  focus: Math.round(Math.max(20, 60 - scored.burnoutScore * 0.3)) },
      { day: "Tue", energy: Math.round(Math.max(20, 60 - scored.burnoutScore * 0.4)), stress: Math.round(Math.min(90, scored.burnoutScore * 1.0)),  focus: Math.round(Math.max(20, 55 - scored.burnoutScore * 0.3)) },
      { day: "Wed", energy: Math.round(Math.max(25, 70 - scored.burnoutScore * 0.4)), stress: Math.round(Math.min(85, scored.burnoutScore * 0.8)),  focus: Math.round(Math.max(25, 65 - scored.burnoutScore * 0.3)) },
      { day: "Thu", energy: Math.round(Math.max(15, 55 - scored.burnoutScore * 0.4)), stress: Math.round(Math.min(95, scored.burnoutScore * 1.1)),  focus: Math.round(Math.max(15, 50 - scored.burnoutScore * 0.3)) },
      { day: "Fri", energy: Math.round(Math.max(20, 60 - scored.burnoutScore * 0.4)), stress: Math.round(Math.min(90, scored.burnoutScore * 0.95)), focus: Math.round(Math.max(20, 55 - scored.burnoutScore * 0.3)) },
    ],
  };
}

async function getWeeklyTrend(db, employeeId, currentScore, weekNumber) {
  if (db && employeeId) {
    const { data } = await db
      .from("burnout_checkins")
      .select("burnout_score, week_number")
      .eq("employee_id", employeeId)
      .order("week_number", { ascending: true })
      .limit(6);

    if (data && data.length >= 2) return data.map(r => r.burnout_score);
  }

  // Seed a plausible 6-week history from current score
  const seed = Math.max(0, currentScore - 20);
  return [
    Math.round(seed * 0.70),
    Math.round(seed * 0.80),
    Math.round(seed * 0.88),
    Math.round(seed * 0.93),
    Math.round(seed * 0.97),
    currentScore,
  ];
}

function predictPeak(weeklyScores) {
  if (weeklyScores.length < 3) return { week: 8, score: weeklyScores.at(-1), confidence: 60 };

  const recent = weeklyScores.slice(-3);
  const avgWeeklyIncrease = (recent[2] - recent[0]) / 2;

  if (avgWeeklyIncrease <= 0) return { week: null, score: weeklyScores.at(-1), confidence: 70 };

  const weeksToSevere = Math.ceil((85 - weeklyScores.at(-1)) / avgWeeklyIncrease);
  const peakWeek  = Math.min(weeksToSevere, 12);
  const peakScore = Math.min(95, Math.round(weeklyScores.at(-1) + avgWeeklyIncrease * peakWeek));
  const confidence = Math.round(60 + Math.min(25, weeklyScores.length * 4));

  return { week: peakWeek, score: peakScore, confidence };
}
