/**
 * Maslach Burnout Inventory (MBI) scoring engine.
 *
 * Dimensions:
 *   Exhaustion  — 3 questions, scored 0–4 each (Never→Every day). Higher = worse.
 *   Cynicism    — 2 questions, scored 0–4 each. Higher = worse.
 *   Efficacy    — 2 questions, scored 0–4 each, REVERSED (Always = best, Never = worst).
 *
 * Composite score weighted: Exhaustion 40%, Cynicism 30%, Efficacy 30%.
 */

const EXHAUSTION_MAP = {
  "Never": 0, "A few times a year": 1, "Monthly": 2, "A few times a week": 3, "Every day": 4,
  "Rarely": 1, "Sometimes": 2, "Often": 3, "Always": 4,
};

const CYNICISM_MAP = {
  "Never": 0, "Rarely": 1, "Sometimes": 2, "Often": 3, "Always": 4,
};

// Efficacy is reversed — feeling effective = low burnout
const EFFICACY_MAP = {
  "Always": 0, "Often": 1, "Sometimes": 2, "Rarely": 3, "Never": 4,
  "Excellent": 0, "Good": 1, "Adequate": 2, "Below my usual standard": 3, "Struggling significantly": 4,
};

const SUPPORT_MOD = {
  "Very supported": -4, "Somewhat supported": -2, "Neutral": 0,
  "Somewhat unsupported": 3, "Very unsupported": 6,
};

const TIMELINE_MOD = {
  "Just this week": 0, "2–4 weeks": 3, "1–3 months": 7,
  "3–6 months": 12, "More than 6 months": 18,
};

function clamp(val, min = 0, max = 100) {
  return Math.round(Math.min(max, Math.max(min, val)));
}

function toScore(raw, maxRaw, weight = 100) {
  return (raw / maxRaw) * weight;
}

export function scoreMBI(responses) {
  const e1 = EXHAUSTION_MAP[responses.exhaustion1] ?? 2;
  const e2 = EXHAUSTION_MAP[responses.exhaustion2] ?? 2;
  const e3 = EXHAUSTION_MAP[responses.exhaustion3] ?? 2;
  const c1 = CYNICISM_MAP[responses.cynicism1] ?? 2;
  const c2 = CYNICISM_MAP[responses.cynicism2] ?? 2;
  const f1 = EFFICACY_MAP[responses.efficacy1] ?? 2;
  const f2 = EFFICACY_MAP[responses.efficacy2] ?? 2;

  const exhaustionRaw = toScore(e1 + e2 + e3, 12, 100);
  const cynicismRaw   = toScore(c1 + c2, 8, 100);
  const efficacyRaw   = toScore(f1 + f2, 8, 100);

  // Context modifiers
  const supportMod  = SUPPORT_MOD[responses.support] ?? 0;
  const timelineMod = TIMELINE_MOD[responses.timeline] ?? 0;

  const exhaustion = clamp(exhaustionRaw + supportMod * 0.5 + timelineMod * 0.3);
  const cynicism   = clamp(cynicismRaw   + timelineMod * 0.2);
  const efficacy   = clamp(efficacyRaw);

  // Stressor severity
  const stressors = responses.stressors || [];
  const stressorMod = Math.min(stressors.length * 2.5, 15);

  const composite = clamp(
    exhaustion * 0.40 + cynicism * 0.30 + efficacy * 0.30 + stressorMod
  );

  return {
    burnoutScore: composite,
    dimensions: { exhaustion, cynicism, efficacy },
    stressors,
    support: responses.support,
    timeline: responses.timeline,
  };
}

export function riskLabel(score) {
  if (score >= 67) return { label: "High Risk",      color: "#ef4444" };
  if (score >= 34) return { label: "Moderate Risk",  color: "#f59e0b" };
  return               { label: "Low Risk",          color: "#10b981" };
}

export function dimensionLabel(score) {
  if (score >= 75) return { label: "Severe",          color: "#ef4444" };
  if (score >= 55) return { label: "Moderate-High",   color: "#f59e0b" };
  if (score >= 35) return { label: "Moderate",        color: "#f59e0b" };
  if (score >= 15) return { label: "Low-Moderate",    color: "#10b981" };
  return               { label: "Low",               color: "#10b981" };
}
