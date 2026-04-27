"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const INDUSTRIES = [
  { id: "saas", label: "SaaS / Software" },
  { id: "finance", label: "Financial Services" },
  { id: "healthcare", label: "Healthcare" },
  { id: "legal", label: "Legal & Professional Services" },
  { id: "retail", label: "Retail & Hospitality" },
  { id: "tech", label: "Deep Tech / Engineering" },
  { id: "nonprofit", label: "Non-Profit & Education" },
];

const HEADCOUNT_BANDS = ["1-25", "26-100", "101-500", "500+"];

const METRIC_META = {
  "Psychological Safety":   { icon: "🛡️", higherBetter: true,  desc: "How safe employees feel speaking up, disagreeing, and taking risks" },
  "Team Burnout Level":     { icon: "🔥", higherBetter: false, desc: "Aggregate burnout signals across your workforce" },
  "Cognitive Load":         { icon: "🧠", higherBetter: false, desc: "Meeting overhead, interruptions, and deep work fragmentation" },
  "Attrition Risk":         { icon: "🚨", higherBetter: false, desc: "Predictive flight risk across your employee base" },
  "Manager Effectiveness":  { icon: "📊", higherBetter: true,  desc: "How well managers develop and retain their direct reports" },
};

function PercentileBar({ orgScore, p25, p50, p75, p90, higherBetter, percentileRank }) {
  const orgPct = (orgScore / 100) * 100;
  const rankColor = percentileRank >= 75 ? "#10b981" : percentileRank >= 40 ? gold : "#ef4444";

  return (
    <div style={{ position: "relative", marginTop: "10px" }}>
      {/* Track */}
      <div style={{ position: "relative", height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "visible" }}>
        {/* Shaded industry band (p25–p75) */}
        <div style={{ position: "absolute", left: `${p25}%`, width: `${p75 - p25}%`, top: 0, height: "100%", background: "rgba(255,255,255,0.08)", borderRadius: "4px" }} />
        {/* Median tick */}
        <div style={{ position: "absolute", left: `${p50}%`, top: "-3px", width: "2px", height: "16px", background: "rgba(255,255,255,0.3)", borderRadius: "1px" }} />
        {/* Org score dot */}
        <div style={{ position: "absolute", left: `${orgPct}%`, top: "-5px", width: "20px", height: "20px", borderRadius: "50%", background: rankColor, border: "3px solid #0f172a", transform: "translateX(-50%)", zIndex: 2 }} />
      </div>
      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>0</span>
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>Industry range: {p25}–{p75}</span>
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>100</span>
      </div>
    </div>
  );
}

function PercentileBadge({ rank }) {
  const color = rank >= 75 ? "#10b981" : rank >= 40 ? gold : "#ef4444";
  const bg = rank >= 75 ? "rgba(16,185,129,0.1)" : rank >= 40 ? "rgba(201,168,76,0.1)" : "rgba(239,68,68,0.1)";
  const border = rank >= 75 ? "rgba(16,185,129,0.25)" : rank >= 40 ? "rgba(201,168,76,0.25)" : "rgba(239,68,68,0.25)";
  const label = rank >= 90 ? "Top 10%" : rank >= 75 ? "Top 25%" : rank >= 50 ? "Above Median" : rank >= 25 ? "Below Median" : "Bottom 25%";
  return (
    <span style={{ background: bg, border: `1px solid ${border}`, color, fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px" }}>
      {label}
    </span>
  );
}

export default function BenchmarksPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState("saas");
  const [headcountBand, setHeadcountBand] = useState("26-100");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/benchmarks?org_id=demo&industry=${industry}&headcount_band=${encodeURIComponent(headcountBand)}`);
      const d = await res.json();
      setData(d);
    } catch {}
    setLoading(false);
  }, [industry, headcountBand]);

  useEffect(() => { load(); }, [load]);

  const overallColor = !data ? gold
    : data.overall_percentile >= 75 ? "#10b981"
    : data.overall_percentile >= 40 ? gold
    : "#ef4444";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
      <Nav />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa", fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "999px", marginBottom: "12px", letterSpacing: "0.06em" }}>
            INDUSTRY BENCHMARKING
          </div>
          <h1 style={{ fontSize: "34px", fontWeight: "900", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>How Do You Compare?</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: "560px" }}>
            Anonymised scores from {data?.industry_context?.orgs_in_pool || "80+"} organisations in your industry. Where you rank tells you exactly where to invest.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 8px", letterSpacing: "0.06em" }}>YOUR INDUSTRY</p>
            <select value={industry} onChange={e => setIndustry(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "11px 14px", color: "#f8fafc", fontSize: "13px", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
              {INDUSTRIES.map(i => <option key={i.id} value={i.id} style={{ background: "#0f172a" }}>{i.label}</option>)}
            </select>
          </div>
          <div style={{ minWidth: "160px" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 8px", letterSpacing: "0.06em" }}>HEADCOUNT</p>
            <div style={{ display: "flex", gap: "6px" }}>
              {HEADCOUNT_BANDS.map(b => (
                <button key={b} onClick={() => setHeadcountBand(b)}
                  style={{ flex: 1, background: headcountBand === b ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${headcountBand === b ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.08)"}`, color: headcountBand === b ? gold : "rgba(255,255,255,0.4)", padding: "10px 6px", borderRadius: "8px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Calculating percentiles…</div>
        ) : (
          <>
            {/* Overall percentile hero */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", minWidth: "140px" }}>
                <div style={{ fontSize: "72px", fontWeight: "900", color: overallColor, lineHeight: 1, letterSpacing: "-0.04em" }}>{data?.overall_percentile}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>overall percentile</div>
              </div>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", margin: "0 0 10px" }}>
                  {data?.overall_percentile >= 75 ? "Outperforming your industry" : data?.overall_percentile >= 40 ? "Tracking with your industry" : "Below industry benchmarks"}
                </h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 16px", lineHeight: "1.7" }}>
                  Compared to <strong style={{ color: "#f8fafc" }}>{data?.industry_context?.orgs_in_pool || 80}+ organisations</strong> in {data?.industry_label} with {headcountBand} employees.
                  Industry average turnover: <strong style={{ color: "#f8fafc" }}>{Math.round((data?.industry_context?.turnover_rate || 0.18) * 100)}%</strong> · Avg tenure: <strong style={{ color: "#f8fafc" }}>{data?.industry_context?.avg_tenure_months}mo</strong>.
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {(data?.strengths || []).length > 0 && (
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "8px", padding: "8px 14px" }}>
                      <p style={{ fontSize: "10px", fontWeight: "700", color: "#6ee7b7", margin: "0 0 4px", letterSpacing: "0.05em" }}>STRENGTHS</p>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>{data.strengths.join(", ")}</p>
                    </div>
                  )}
                  {(data?.improvements || []).length > 0 && (
                    <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "8px", padding: "8px 14px" }}>
                      <p style={{ fontSize: "10px", fontWeight: "700", color: "#fca5a5", margin: "0 0 4px", letterSpacing: "0.05em" }}>FOCUS AREAS</p>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>{data.improvements.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => router.push("/report/board")}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "12px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer", whiteSpace: "nowrap" }}>
                Add to Board Report →
              </button>
            </div>

            {/* Metric comparisons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
              {(data?.comparisons || []).map((c, i) => {
                const meta = METRIC_META[c.metric] || {};
                const rankColor = c.percentile_rank >= 75 ? "#10b981" : c.percentile_rank >= 40 ? gold : "#ef4444";
                const statusLabel = c.status === "above" ? "Above benchmark" : c.status === "on_par" ? "On par" : "Below benchmark";
                const deltaLabel = c.delta > 0 ? `+${c.delta} pts vs median` : `${c.delta} pts vs median`;

                return (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "22px 26px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "22px" }}>{meta.icon}</span>
                        <div>
                          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: "0 0 3px" }}>{c.metric}</h3>
                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{meta.desc}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: c.delta > 0 ? "#10b981" : "#ef4444" }}>{deltaLabel}</span>
                        <PercentileBadge rank={c.percentile_rank} />
                      </div>
                    </div>

                    {/* Score comparison row */}
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "16px", alignItems: "center", marginBottom: "14px" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: "900", color: rankColor }}>{c.org_score}</div>
                        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>YOUR SCORE</div>
                      </div>
                      <PercentileBar
                        orgScore={c.org_score}
                        p25={c.industry_p25}
                        p50={c.industry_median}
                        p75={c.industry_p75}
                        p90={c.industry_p90}
                        higherBetter={meta.higherBetter}
                        percentileRank={c.percentile_rank}
                      />
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: "900", color: "rgba(255,255,255,0.35)" }}>{c.industry_median}</div>
                        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>INDUSTRY MEDIAN</div>
                      </div>
                    </div>

                    {/* Percentile band reference */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[
                        { label: `Bottom 25% ≤${c.industry_p25}`, color: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.2)" },
                        { label: `Median ${c.industry_p25}–${c.industry_p75}`, color: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)" },
                        { label: `Top 25% ≥${c.industry_p75}`, color: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" },
                        { label: `Top 10% ≥${c.industry_p90}`, color: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.25)" },
                      ].map((band, bi) => (
                        <div key={bi} style={{ flex: 1, background: band.color, border: `1px solid ${band.border}`, borderRadius: "6px", padding: "6px 8px", textAlign: "center" }}>
                          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>{band.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Data pool callout */}
            <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.18)", borderRadius: "14px", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#a78bfa", margin: "0 0 4px" }}>Contribute to the benchmark pool</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Your anonymised scores help all organisations. All data is aggregated — no individual or org data is ever identifiable.</p>
              </div>
              <button onClick={async () => { await fetch("/api/benchmarks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ org_id: "demo", industry, headcount_band: headcountBand, scores: data?.org_scores }) }); alert("Contributed — thank you!"); }}
                style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
                Contribute scores →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
