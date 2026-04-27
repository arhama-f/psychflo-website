"use client";
import { useState, useEffect } from "react";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const fmt = (n) => n?.toLocaleString("en-GB") ?? "—";
const fmtGbp = (n) => n != null ? `£${n.toLocaleString("en-GB")}` : "—";

function ScoreDelta({ delta }) {
  if (!delta) return null;
  const up = delta > 0;
  return (
    <span style={{ fontSize: "14px", fontWeight: "700", color: up ? "#10b981" : "#ef4444", marginLeft: "8px" }}>
      {up ? "▲" : "▼"} {Math.abs(delta)} pts vs last quarter
    </span>
  );
}

export default function BoardReportPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/report/board?org_id=demo")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "system-ui" }}>Generating report…</p>
      </div>
    );
  }

  const d = data || {};
  const riskColor = (score) => score >= 70 ? "#10b981" : score >= 50 ? "#facc15" : "#ef4444";

  return (
    <>
      <style>{`
        @media print {
          nav, .no-print { display: none !important; }
          body { background: white !important; }
          .print-page { background: white !important; color: #1a1a2e !important; }
          .report-card { background: #f8fafc !important; border-color: #e2e8f0 !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      <div className="print-page" style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
        <div className="no-print"><Nav /></div>

        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 32px 100px" }}>

          {/* Print / download bar */}
          <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "32px" }}>
            <button onClick={() => window.print()}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
              Download PDF →
            </button>
            <button onClick={() => window.history.back()}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "11px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              ← Back
            </button>
          </div>

          {/* Report header */}
          <div style={{ borderBottom: `2px solid ${gold}`, paddingBottom: "28px", marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: "700", color: gold, margin: "0 0 8px", letterSpacing: "0.1em" }}>BOARD REPORT · CONFIDENTIAL</p>
                <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#f8fafc", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Psychological Safety<br />& Workforce Risk Report</h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: 0 }}>{d.org_name} · {d.period} · {d.headcount} employees</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: "0 0 4px" }}>Generated</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0 }}>
                  {d.generated_at ? new Date(d.generated_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: "8px 0 0" }}>Powered by PsychFlo AI</p>
              </div>
            </div>
          </div>

          {/* Executive summary */}
          <div className="report-card" style={{ background: "rgba(201,168,76,0.05)", border: `1px solid rgba(201,168,76,0.2)`, borderRadius: "16px", padding: "28px", marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: gold, margin: "0 0 14px", letterSpacing: "0.08em" }}>EXECUTIVE SUMMARY</p>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: "1.8", margin: 0 }}>
              {d.org_name}&apos;s psychological safety score stands at <strong style={{ color: "#f8fafc" }}>{d.safety_score}/100</strong>
              <ScoreDelta delta={d.score_delta} /> this quarter.
              {" "}<strong style={{ color: "#f8fafc" }}>{d.attrition?.at_risk || 0} employee{d.attrition?.at_risk !== 1 ? "s" : ""}</strong> are
              currently at high or critical flight risk, representing a potential attrition cost of{" "}
              <strong style={{ color: gold }}>{fmtGbp(d.financials?.attrition_exposure)}</strong>.
              PsychFlo has identified early intervention opportunities that, if acted upon, could prevent an estimated{" "}
              <strong style={{ color: "#10b981" }}>{fmtGbp(d.financials?.cost_prevented)}</strong> in replacement costs —
              a <strong style={{ color: "#f8fafc" }}>{d.financials?.roi}x return</strong> on the annual platform investment.
            </p>
          </div>

          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "28px" }}>
            {[
              { label: "Safety Score", value: `${d.safety_score}/100`, color: riskColor(d.safety_score), sub: d.score_delta > 0 ? `▲ ${d.score_delta} pts` : d.score_delta < 0 ? `▼ ${Math.abs(d.score_delta)} pts` : "Stable" },
              { label: "At-Risk Employees", value: d.attrition?.at_risk ?? "—", color: (d.attrition?.at_risk || 0) > 0 ? "#fb923c" : "#10b981", sub: `${d.attrition?.critical || 0} critical` },
              { label: "Cost Exposure", value: fmtGbp(d.financials?.attrition_exposure), color: "#fb923c", sub: "replacement cost" },
              { label: "Platform ROI", value: `${d.financials?.roi || 0}x`, color: gold, sub: "annualised" },
            ].map((k, i) => (
              <div key={i} className="report-card" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "18px", textAlign: "center" }}>
                <p style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 8px", letterSpacing: "0.06em" }}>{k.label.toUpperCase()}</p>
                <div style={{ fontSize: "26px", fontWeight: "900", color: k.color, marginBottom: "4px", letterSpacing: "-0.02em" }}>{k.value}</div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Safety score visual */}
          <div className="report-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px 28px", marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 20px", letterSpacing: "0.06em" }}>ORGANISATIONAL SAFETY SCORE</p>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ fontSize: "56px", fontWeight: "900", color: riskColor(d.safety_score), letterSpacing: "-0.03em", lineHeight: 1 }}>{d.safety_score}</div>
              <div style={{ flex: 1 }}>
                <div style={{ position: "relative", height: "12px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden", marginBottom: "10px" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${d.safety_score}%`, background: riskColor(d.safety_score), borderRadius: "999px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {["0 — Crisis", "25 — Low", "50 — Moderate", "75 — Good", "100 — Excellent"].map((l, i) => (
                    <span key={i} style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Attrition risk breakdown */}
          <div className="report-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px 28px", marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 20px", letterSpacing: "0.06em" }}>FLIGHT RISK DISTRIBUTION · {d.headcount} EMPLOYEES</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "16px" }}>
              {[
                { label: "Critical", count: d.attrition?.critical || 0, color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", note: "Departure within 30 days" },
                { label: "High Risk", count: d.attrition?.high || 0, color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.2)", note: "Departure within 60 days" },
                { label: "Medium Risk", count: d.attrition?.medium || 0, color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.2)", note: "Departure within 90 days" },
                { label: "Low Risk", count: d.attrition?.low || 0, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", note: "Stable, monitor quarterly" },
              ].map((seg, i) => (
                <div key={i} style={{ background: seg.bg, border: `1px solid ${seg.border}`, borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", fontWeight: "900", color: seg.color, marginBottom: "4px" }}>{seg.count}</div>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: seg.color, margin: "0 0 4px" }}>{seg.label}</p>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{seg.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Financial analysis */}
          <div className="report-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px 28px", marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 20px", letterSpacing: "0.06em" }}>FINANCIAL IMPACT ANALYSIS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { label: "Baseline attrition exposure (industry avg 15% turnover)", value: fmtGbp(d.financials?.baseline_exposure), color: "rgba(255,255,255,0.5)" },
                { label: "Current exposure (PsychFlo-identified at-risk employees)", value: fmtGbp(d.financials?.attrition_exposure), color: "#fb923c" },
                { label: "Cost prevented through early intervention", value: fmtGbp(d.financials?.cost_prevented), color: "#10b981" },
                { label: "Annual PsychFlo platform investment", value: fmtGbp(d.financials?.psychflo_cost), color: "rgba(255,255,255,0.4)" },
                { label: "Net return on investment (annualised)", value: `${d.financials?.roi || 0}x ROI`, color: gold },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{row.label}</span>
                  <span style={{ fontSize: "15px", fontWeight: "800", color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended interventions */}
          <div className="report-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px 28px", marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 20px", letterSpacing: "0.06em" }}>RECOMMENDED BOARD-LEVEL INTERVENTIONS</p>
            {(d.interventions || []).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: `rgba(201,168,76,0.15)`, color: gold, fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.6", paddingTop: "2px" }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
              This report is confidential and intended for board-level review only.<br />
              Data is derived from anonymised employee assessments. Individual data is never disclosed.
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: 0, textAlign: "right" }}>
              PsychFlo · psychflo.io<br />
              <a href="/sla" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>SLA 99.9%</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
