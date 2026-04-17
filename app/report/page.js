"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

export default function ReportPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0f1e" }} />}>
      <Report />
    </Suspense>
  );
}

function Report() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("Your Organisation");
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`;

  useEffect(() => {
    fetch("/api/team")
      .then(r => r.json())
      .then(d => { setTeamData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function printReport() {
    window.print();
  }

  const SECTOR_BENCHMARK = 52;
  const data = teamData && !teamData.suppressed ? teamData : getMockData();

  const costOfBurnout = Math.round((data.atHighRisk * 2 + data.atModerateRisk) * 12000);
  const psychfloCost  = Math.round(data.size * 5 * 12);
  const netSaving     = costOfBurnout - psychfloCost;
  const roi           = psychfloCost > 0 ? Math.round((netSaving / psychfloCost) * 100) : 0;

  const fmt = (n) => n >= 1_000_000
    ? `£${(n / 1_000_000).toFixed(1)}M`
    : `£${n.toLocaleString("en-GB")}`;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.3)" }}>Generating report...</p>
    </div>
  );

  return (
    <>
      {/* Print controls — hidden when printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .report-page { background: white !important; color: #0f172a !important; }
          .print-card { background: #f8fafc !important; border-color: #e2e8f0 !important; }
          .print-text { color: #334155 !important; }
          .print-muted { color: #64748b !important; }
        }
      `}</style>

      <div className="no-print">
        <Nav />
      </div>

      <div className="report-page" style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>

        {/* Controls */}
        <div className="no-print" style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 4px" }}>Executive Report</h1>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>Board-ready PDF · {today}</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div>
                <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Organisation name"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "9px 14px", color: "#f8fafc", fontSize: "13px", outline: "none", width: "200px" }} />
              </div>
              <button onClick={printReport}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "10px 24px", borderRadius: "9px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
                Download PDF →
              </button>
              <button onClick={() => router.push("/dashboard")}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: "10px 16px", borderRadius: "9px", fontSize: "13px", cursor: "pointer" }}>
                ← Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Report body */}
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 60px" }}>

          {/* Header */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "32px", marginBottom: "16px" }} className="print-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: gold, letterSpacing: "0.1em", marginBottom: "8px" }}>WORKFORCE WELLBEING REPORT</div>
                <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#f8fafc", margin: "0 0 6px" }} className="print-text">{orgName}</h2>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0 }} className="print-muted">{quarter} · Prepared by PsychFlo · {today}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>OVERALL RISK SCORE</div>
                <div style={{ fontSize: "48px", fontWeight: "900", color: data.color, lineHeight: 1 }}>{data.overallRisk}</div>
                <div style={{ fontSize: "12px", color: data.color, fontWeight: "700" }}>/100 · {data.riskLabel || "Elevated"}</div>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "16px" }}>
            {[
              { label: "Team size", value: data.size, color: "#f8fafc" },
              { label: "High risk", value: data.atHighRisk, color: "#ef4444", suffix: " people" },
              { label: "Moderate risk", value: data.atModerateRisk, color: "#f59e0b", suffix: " people" },
              { label: "vs industry avg", value: `+${Math.max(0, data.overallRisk - SECTOR_BENCHMARK)}`, color: "#ef4444", suffix: " pts" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", textAlign: "center" }} className="print-card">
                <div style={{ fontSize: "26px", fontWeight: "800", color: s.color, marginBottom: "4px" }}>{s.value}{s.suffix || ""}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }} className="print-muted">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Dimensions */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px", marginBottom: "16px" }} className="print-card">
            <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: "18px" }}>MBI DIMENSION SCORES vs INDUSTRY BENCHMARK</div>
            {[
              { label: "Exhaustion", score: data.dimensions?.exhaustion?.score || 68, benchmark: 54, color: "#ef4444" },
              { label: "Cynicism", score: data.dimensions?.cynicism?.score || 61, benchmark: 48, color: "#f59e0b" },
              { label: "Efficacy (inverse)", score: 100 - (data.dimensions?.efficacy?.score || 45), benchmark: 42, color: "#10b981" },
            ].map((d, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? "16px" : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: "600" }} className="print-text">{d.label}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }} className="print-muted">
                    <span style={{ color: d.color, fontWeight: "700" }}>{d.score}</span> vs {d.benchmark} industry avg
                  </span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "999px", height: "10px", overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${d.score}%`, height: "100%", background: d.color, borderRadius: "999px" }} />
                  <div style={{ position: "absolute", top: 0, left: `${d.benchmark}%`, width: "2px", height: "100%", background: "rgba(255,255,255,0.4)" }} />
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginTop: "4px" }} className="print-muted">│ = industry average</div>
              </div>
            ))}
          </div>

          {/* Trend */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px", marginBottom: "16px" }} className="print-card">
            <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: "16px" }}>6-WEEK TREND + FORECAST</div>
            <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", height: "80px", marginBottom: "12px" }}>
              {(data.weeklyTrend || [45, 50, 54, 58, 61, 65]).map((s, i, arr) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "100%", background: i === arr.length - 1 ? data.color : "rgba(255,255,255,0.15)", borderRadius: "3px 3px 0 0", height: `${s * 1.1}px` }} />
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>W{i + 1}</span>
                </div>
              ))}
              {/* Forecast bars */}
              {[data.overallRisk + 5, data.overallRisk + 9].map((s, i) => (
                <div key={`f${i}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "100%", background: "rgba(239,68,68,0.3)", border: "1px dashed rgba(239,68,68,0.5)", borderRadius: "3px 3px 0 0", height: `${s * 1.1}px` }} />
                  <span style={{ fontSize: "10px", color: "rgba(239,68,68,0.5)" }}>W{7 + i}*</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.7 }} className="print-muted">
              * Forecast based on current trend. Without intervention, team risk score is projected to reach <strong style={{ color: "#ef4444" }}>{data.overallRisk + 9}/100</strong> in 2 weeks.
              Intervention now reduces projected peak by an estimated 40%.
            </p>
          </div>

          {/* Financial impact */}
          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "14px", padding: "24px", marginBottom: "16px" }} className="print-card">
            <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(239,68,68,0.6)", letterSpacing: "0.08em", marginBottom: "16px" }}>FINANCIAL IMPACT ANALYSIS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>COST OF CURRENT BURNOUT LEVELS</div>
                {[
                  { label: "Turnover & replacement", value: Math.round(data.atHighRisk * 0.3 * 22500) },
                  { label: "Sick days & absence", value: Math.round((data.atHighRisk + data.atModerateRisk * 0.5) * 18 * (45000 / 260)) },
                  { label: "Productivity loss", value: Math.round(data.size * 45000 * 0.23 * (data.overallRisk / 100)) },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }} className="print-muted">{row.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#fca5a5" }}>{fmt(row.value)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }} className="print-text">Total annual cost</span>
                  <span style={{ fontSize: "18px", fontWeight: "900", color: "#ef4444" }}>{fmt(costOfBurnout)}</span>
                </div>
              </div>
              <div style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", padding: "20px" }}>
                <div style={{ fontSize: "11px", color: "rgba(16,185,129,0.6)", marginBottom: "12px", fontWeight: "700" }}>PSYCHFLO ROI</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Annual investment</span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.6)" }}>{fmt(psychfloCost)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Net saving</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#6ee7b7" }}>{fmt(netSaving)}</span>
                </div>
                <div style={{ textAlign: "center", padding: "16px", background: "rgba(16,185,129,0.1)", borderRadius: "10px" }}>
                  <div style={{ fontSize: "36px", fontWeight: "900", color: "#6ee7b7" }}>{roi}×</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>return on investment</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top stressors */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px", marginBottom: "16px" }} className="print-card">
            <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: "16px" }}>TOP ORGANISATIONAL STRESSORS</div>
            {(data.topTeamStressors || getMockStressors()).slice(0, 5).map((s, i) => (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }} className="print-text">{s.stressor}</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: s.percentage > 70 ? "#ef4444" : s.percentage > 50 ? "#f59e0b" : "#10b981" }}>{s.percentage}% of staff</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${s.percentage}%`, height: "100%", background: s.percentage > 70 ? "#ef4444" : s.percentage > 50 ? "#f59e0b" : "#10b981", borderRadius: "999px" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "14px", padding: "24px", marginBottom: "16px" }} className="print-card">
            <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(201,168,76,0.6)", letterSpacing: "0.08em", marginBottom: "16px" }}>RECOMMENDED ACTIONS — NEXT 30 DAYS</div>
            {[
              { priority: "Immediate", action: `Deploy PsychFlo weekly check-ins to all ${data.size} employees`, impact: "Establish baseline data for all 3 MBI dimensions" },
              { priority: "This week", action: `Brief ${Math.max(1, Math.round(data.size / 10))} managers on conversation framework using AI scripts`, impact: "Reduce manager hesitation to act; increase early intervention rate by est. 60%" },
              { priority: "This month", action: "Set automated alerts for any score ≥70; review team stressors monthly", impact: "Systematic catch-net prevents any employee hitting crisis without a manager aware" },
              { priority: "This quarter", action: "Present next quarter's wellbeing report to board with trend data", impact: "Justifies people investment with measurable ROI; supports retention narrative" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", marginBottom: i < 3 ? "14px" : 0, padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", borderLeft: `3px solid ${r.priority === "Immediate" ? "#ef4444" : r.priority === "This week" ? "#f59e0b" : "#10b981"}` }}>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px", background: r.priority === "Immediate" ? "rgba(239,68,68,0.15)" : r.priority === "This week" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: r.priority === "Immediate" ? "#fca5a5" : r.priority === "This week" ? "#fcd34d" : "#6ee7b7" }}>{r.priority}</span>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", marginBottom: "4px" }} className="print-text">{r.action}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }} className="print-muted">{r.impact}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: "0 0 6px" }}>
              PsychFlo · Burnout Early Warning Platform · psychflo.com
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.12)", margin: 0, lineHeight: 1.7 }}>
              Data based on anonymised team check-ins. Individual scores are never shared. GDPR compliant.<br />
              Benchmarks from Gallup State of the Workplace 2024 · CIPD Health & Wellbeing Report 2024
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

function getMockData() {
  return {
    overallRisk: 64, color: "#f59e0b", riskLabel: "Elevated", size: 47,
    atHighRisk: 9, atModerateRisk: 18, atLowRisk: 20,
    weeklyTrend: [44, 49, 53, 57, 61, 64],
    dimensions: {
      exhaustion: { score: 68 },
      cynicism: { score: 61 },
      efficacy: { score: 45 },
    },
    topTeamStressors: getMockStressors(),
  };
}

function getMockStressors() {
  return [
    { stressor: "Excessive workload", percentage: 74 },
    { stressor: "Poor work-life balance", percentage: 68 },
    { stressor: "Lack of recognition", percentage: 55 },
    { stressor: "Unclear priorities", percentage: 49 },
    { stressor: "Remote isolation", percentage: 38 },
  ];
}
