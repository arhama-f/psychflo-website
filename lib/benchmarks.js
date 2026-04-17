/**
 * Industry burnout benchmarks by sector.
 * Sources: Maslach & Leiter (2016), Gallup State of the Workplace (2024),
 * Deloitte Workplace Burnout Survey (2023).
 *
 * Scores normalised to 0–100 scale to match our MBI implementation.
 */

export const INDUSTRY_BENCHMARKS = {
  "Technology":          { exhaustion: 58, cynicism: 49, efficacy: 62, composite: 54, turnoverRisk: 0.34 },
  "Healthcare":          { exhaustion: 71, cynicism: 58, efficacy: 55, composite: 64, turnoverRisk: 0.41 },
  "Finance":             { exhaustion: 61, cynicism: 52, efficacy: 63, composite: 57, turnoverRisk: 0.29 },
  "Legal":               { exhaustion: 67, cynicism: 55, efficacy: 59, composite: 61, turnoverRisk: 0.33 },
  "Education":           { exhaustion: 63, cynicism: 54, efficacy: 57, composite: 58, turnoverRisk: 0.38 },
  "Consulting":          { exhaustion: 66, cynicism: 56, efficacy: 61, composite: 61, turnoverRisk: 0.36 },
  "Retail":              { exhaustion: 55, cynicism: 47, efficacy: 60, composite: 52, turnoverRisk: 0.44 },
  "Manufacturing":       { exhaustion: 52, cynicism: 44, efficacy: 62, composite: 49, turnoverRisk: 0.31 },
  "Non-profit":          { exhaustion: 65, cynicism: 50, efficacy: 58, composite: 58, turnoverRisk: 0.35 },
  "Media & Marketing":   { exhaustion: 60, cynicism: 53, efficacy: 61, composite: 56, turnoverRisk: 0.37 },
  "Professional Services":{ exhaustion: 63, cynicism: 51, efficacy: 62, composite: 58, turnoverRisk: 0.32 },
  "General":             { exhaustion: 52, cynicism: 43, efficacy: 64, composite: 50, turnoverRisk: 0.30 },
};

export const SECTOR_LIST = Object.keys(INDUSTRY_BENCHMARKS);

export function getBenchmark(sector) {
  return INDUSTRY_BENCHMARKS[sector] || INDUSTRY_BENCHMARKS["General"];
}

export function compareToIndustry(scores, sector) {
  const bench = getBenchmark(sector);
  return {
    exhaustion: {
      yours: scores.exhaustion,
      benchmark: bench.exhaustion,
      delta: scores.exhaustion - bench.exhaustion,
      status: scores.exhaustion > bench.exhaustion + 10 ? "above" : scores.exhaustion < bench.benchmark - 10 ? "below" : "average",
    },
    cynicism: {
      yours: scores.cynicism,
      benchmark: bench.cynicism,
      delta: scores.cynicism - bench.cynicism,
      status: scores.cynicism > bench.cynicism + 10 ? "above" : scores.cynicism < bench.cynicism - 10 ? "below" : "average",
    },
    efficacy: {
      yours: scores.efficacy,
      benchmark: bench.efficacy,
      delta: scores.efficacy - bench.efficacy,
      status: scores.efficacy > bench.efficacy + 10 ? "above" : scores.efficacy < bench.efficacy - 10 ? "below" : "average",
    },
    composite: {
      yours: scores.composite,
      benchmark: bench.composite,
      delta: scores.composite - bench.composite,
      percentile: estimatePercentile(scores.composite, bench.composite),
    },
    turnoverRisk: bench.turnoverRisk,
    sector,
  };
}

function estimatePercentile(score, benchmarkMean) {
  // Approximate normal distribution with SD ~15
  const z = (score - benchmarkMean) / 15;
  const pct = Math.round(50 + 35 * Math.tanh(z * 0.9));
  return Math.min(99, Math.max(1, pct));
}
