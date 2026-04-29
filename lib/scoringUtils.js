/**
 * PsychFlo Workforce Risk Scoring Utility
 *
 * Single source of truth for all diagnostic scoring.
 * The diagnostic page (app/diagnostic/page.js) imports this and passes
 * its form state directly. The executive report and dashboard read the
 * persisted sessionStorage object that was produced by this function.
 *
 * HOW TO ADJUST WEIGHTS
 * ---------------------
 * There are three independent weight surfaces:
 *
 *   1. CHALLENGE_SCORES  — per-challenge contribution to each category.
 *      Raise a number to make selecting that challenge drive a higher score.
 *
 *   2. SLIDER_WEIGHT     — points added per slider step above 1 (scale 1–5).
 *      Default: 8 (max slider contribution = 4 steps × 8 = 32 pts per category).
 *      Raise to make slider answers more influential; lower to reduce sensitivity.
 *
 *   3. URGENCY_MULTIPLIER — applied when urgency === "immediate".
 *      Default: 1.15 (a 15% uplift across all three categories).
 *
 * Scores are always clamped to 0–100 after all adjustments.
 */

// ── 1. Challenge contribution weights ────────────────────────────────────────
// Each challenge value maps to points contributed to each risk category.
// Challenges that signal cross-cutting risk contribute to multiple categories.
// To adjust: change the numbers. Do not add new keys here without adding the
// corresponding option.value in the diagnostic form's STEPS config.

const CHALLENGE_SCORES = {
  retention: {
    workforceRisk: 10,
    burnoutRetention: 25,
    managerCulture: 5,
  },
  burnout: {
    workforceRisk: 5,
    burnoutRetention: 30,
    managerCulture: 10,
  },
  manager_effectiveness: {
    workforceRisk: 5,
    burnoutRetention: 10,
    managerCulture: 30,
  },
  culture: {
    workforceRisk: 5,
    burnoutRetention: 10,
    managerCulture: 25,
  },
  compliance: {
    workforceRisk: 30,
    burnoutRetention: 5,
    managerCulture: 5,
  },
  onboarding: {
    workforceRisk: 10,
    burnoutRetention: 15,
    managerCulture: 15,
  },
  psychological_safety: {
    workforceRisk: 10,
    burnoutRetention: 15,
    managerCulture: 20,
  },
  conflict: {
    workforceRisk: 15,
    burnoutRetention: 10,
    managerCulture: 20,
  },
};

// ── 2. Slider weight ──────────────────────────────────────────────────────────
// Points added per step above 1 on a 1–5 scale.
// Max contribution per slider at default: (5 - 1) × 8 = 32 points.
const SLIDER_WEIGHT = 8;

// ── 3. Urgency multiplier ─────────────────────────────────────────────────────
// Applied when form.urgency === "immediate".
const URGENCY_MULTIPLIER = 1.15;

// ── Risk bands ────────────────────────────────────────────────────────────────
// Thresholds for the overallRiskScore (average of three category scores).
// To adjust: change the numbers. Low must be 0, High must be 100.
const BANDS = [
  { min: 66, max: 100, level: "High" },
  { min: 31, max: 65,  level: "Medium" },
  { min: 0,  max: 30,  level: "Low" },
];

function bandFromScore(score) {
  return BANDS.find(b => score >= b.min && score <= b.max)?.level ?? "Low";
}

// ── Top risks derivation ──────────────────────────────────────────────────────
// Returns up to 3 plain-English risk statements ranked by category score.
// To change the language: edit the strings in the arrays below.
// To add a new risk tier: add another else-if band.

function deriveTopRisks(workforceRisk, burnoutRetention, managerCulture) {
  const risks = [];

  if (workforceRisk >= 66) {
    risks.push({ category: "Workforce Risk", score: workforceRisk, statement: "Active policy exposure or compliance gap — tribunal risk elevated." });
  } else if (workforceRisk >= 31) {
    risks.push({ category: "Workforce Risk", score: workforceRisk, statement: "Policy language requires review before next regulatory cycle." });
  }

  if (burnoutRetention >= 66) {
    risks.push({ category: "Burnout & Retention", score: burnoutRetention, statement: "High-burnout trajectory detected — flight risk window is 6–8 weeks." });
  } else if (burnoutRetention >= 31) {
    risks.push({ category: "Burnout & Retention", score: burnoutRetention, statement: "Subclinical burnout present — early intervention will reduce attrition risk." });
  }

  if (managerCulture >= 66) {
    risks.push({ category: "Manager & Culture", score: managerCulture, statement: "Manager effectiveness gaps are driving team disengagement and safety deterioration." });
  } else if (managerCulture >= 31) {
    risks.push({ category: "Manager & Culture", score: managerCulture, statement: "Coaching gaps present — psychological safety scores will decline without intervention." });
  }

  // Sort highest score first, return top 3
  return risks.sort((a, b) => b.score - a.score).slice(0, 3);
}

// ── Recommended actions derivation ───────────────────────────────────────────
// Returns prioritised action strings based on which categories are High/Medium.
// Actions are ordered by urgency (High-risk categories first).

function deriveRecommendedActions(workforceRisk, burnoutRetention, managerCulture) {
  const actions = [];

  // High-priority actions (score >= 66)
  if (workforceRisk >= 66) {
    actions.push("Conduct immediate HR policy audit against current employment law.");
    actions.push("Generate ISO 45003 compliance evidence pack for legal review.");
  }
  if (burnoutRetention >= 66) {
    actions.push("Deploy burnout early-warning check-ins to all flagged employees this week.");
    actions.push("Brief line managers on flight-risk conversation frameworks immediately.");
  }
  if (managerCulture >= 66) {
    actions.push("Initiate manager effectiveness scoring across all people managers.");
    actions.push("Schedule psychological safety workshops for lowest-scoring teams.");
  }

  // Medium-priority actions (score 31–65)
  if (workforceRisk >= 31 && workforceRisk < 66) {
    actions.push("Schedule policy language review before next board reporting cycle.");
  }
  if (burnoutRetention >= 31 && burnoutRetention < 66) {
    actions.push("Launch daily pulse monitoring for teams with elevated workload signals.");
  }
  if (managerCulture >= 31 && managerCulture < 66) {
    actions.push("Run manager coaching sessions for C/D-graded managers this quarter.");
  }

  // Universal baseline — always included
  actions.push("Book a Workforce Risk Audit to receive a scored Executive Report within 48 hours.");

  return actions;
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * calculateWorkforceRiskScores(formData)
 *
 * @param {Object} formData
 *   formData.challenges      string[]  — array of selected challenge values
 *   formData.turnoverConcern number    — slider 1–5
 *   formData.burnoutConcern  number    — slider 1–5
 *   formData.policyConcern   number    — slider 1–5
 *   formData.managerConcern  number    — slider 1–5
 *   formData.urgency         string    — "immediate" | "soon" | "planning"
 *
 * @returns {Object}
 *   workforceRiskScore    number   0–100
 *   burnoutRetentionScore number   0–100
 *   managerCultureScore   number   0–100
 *   overallRiskScore      number   0–100 (average of three)
 *   riskLevel             string   "Low" | "Medium" | "High"
 *   topRisks              Array<{ category, score, statement }>
 *   recommendedActions    string[]
 */
export function calculateWorkforceRiskScores(formData) {
  let workforceRisk = 0;
  let burnoutRetention = 0;
  let managerCulture = 0;

  // ── Step 1: Challenge multiselect contributions ──────────────────────────
  // Each selected challenge adds points to one or more categories via
  // CHALLENGE_SCORES above. Adjust CHALLENGE_SCORES to change weighting.
  (formData.challenges || []).forEach(value => {
    const weights = CHALLENGE_SCORES[value];
    if (!weights) return;
    workforceRisk    += weights.workforceRisk    ?? 0;
    burnoutRetention += weights.burnoutRetention ?? 0;
    managerCulture   += weights.managerCulture   ?? 0;
  });

  // ── Step 2: Slider contributions ─────────────────────────────────────────
  // Each slider runs 1–5. Contribution = (value - 1) × SLIDER_WEIGHT.
  // A slider at 1 contributes 0; at 5 contributes 4 × SLIDER_WEIGHT = 32.
  // Adjust SLIDER_WEIGHT above to change overall slider sensitivity.
  workforceRisk    += ((formData.policyConcern   ?? 1) - 1) * SLIDER_WEIGHT;
  burnoutRetention += ((formData.turnoverConcern ?? 1) - 1) * SLIDER_WEIGHT;
  burnoutRetention += ((formData.burnoutConcern  ?? 1) - 1) * SLIDER_WEIGHT;
  managerCulture   += ((formData.managerConcern  ?? 1) - 1) * SLIDER_WEIGHT;

  // ── Step 3: Urgency multiplier ───────────────────────────────────────────
  // Adjust URGENCY_MULTIPLIER above to change the uplift amount.
  if (formData.urgency === "immediate") {
    workforceRisk    = Math.round(workforceRisk    * URGENCY_MULTIPLIER);
    burnoutRetention = Math.round(burnoutRetention * URGENCY_MULTIPLIER);
    managerCulture   = Math.round(managerCulture   * URGENCY_MULTIPLIER);
  }

  // ── Step 4: Clamp all scores to 0–100 ───────────────────────────────────
  const clamp = v => Math.min(100, Math.max(0, v));
  workforceRisk    = clamp(workforceRisk);
  burnoutRetention = clamp(burnoutRetention);
  managerCulture   = clamp(managerCulture);

  const overallRiskScore = Math.round((workforceRisk + burnoutRetention + managerCulture) / 3);
  const riskLevel = bandFromScore(overallRiskScore);

  return {
    workforceRiskScore:    workforceRisk,
    burnoutRetentionScore: burnoutRetention,
    managerCultureScore:   managerCulture,
    overallRiskScore,
    riskLevel,
    topRisks:              deriveTopRisks(workforceRisk, burnoutRetention, managerCulture),
    recommendedActions:    deriveRecommendedActions(workforceRisk, burnoutRetention, managerCulture),
  };
}
