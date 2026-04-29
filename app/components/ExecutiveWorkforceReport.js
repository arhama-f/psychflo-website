"use client";

const gold = "#c9a84c";

// ── Data derivation from scores ───────────────────────────────────────────────

function deriveRisks(scores) {
  const { workforceRiskScore: wr, burnoutRetentionScore: br, managerCultureScore: mc } = scores;
  const risks = [];

  if (wr >= 50)  risks.push({ icon: "⚖️", title: "Policy & compliance exposure", impact: `£${Math.round(wr * 900).toLocaleString("en-GB")} estimated tribunal risk`, category: "Workforce Risk", color: "#fca5a5" });
  if (br >= 50)  risks.push({ icon: "🔥", title: "Active burnout in leadership pipeline", impact: `£${Math.round(br * 1200).toLocaleString("en-GB")} annualised replacement exposure`, category: "Retention", color: "#fcd34d" });
  if (mc >= 50)  risks.push({ icon: "🧠", title: "Manager effectiveness gap", impact: `${Math.round(mc * 0.6)}% of team at elevated attrition risk`, category: "Culture", color: "#c4b5fd" });
  if (wr < 50 && risks.length < 3) risks.push({ icon: "📄", title: "Policy language creates comprehension risk", impact: "74% avg comprehension failure on standard HR policies", category: "Workforce Risk", color: "#fca5a5" });
  if (br < 50 && risks.length < 3) risks.push({ icon: "📉", title: "Subclinical burnout going undetected", impact: "Burnout costs £1,300 per employee per year in presenteeism", category: "Retention", color: "#fcd34d" });
  if (mc < 50 && risks.length < 3) risks.push({ icon: "👥", title: "Manager confidence gaps in difficult conversations", impact: "67% of departures cite manager relationship as primary cause", category: "Culture", color: "#c4b5fd" });

  return risks.slice(0, 3);
}

function deriveRootCauses(scores) {
  const { workforceRiskScore: wr, burnoutRetentionScore: br, managerCultureScore: mc } = scores;
  return [
    {
      category: "Workforce Risk",
      color: "#fca5a5",
      causes: wr >= 50
        ? ["Outdated HR policies not reviewed against 2024 employment law changes", "Tribunal risk from non-compliant language in employment contracts", "Compliance gaps in psychological safety obligations (ISO 45003)"]
        : ["HR policies broadly compliant but not optimised for comprehension", "Minor gaps in psychological safety documentation", "Low awareness of 2024 legislative updates among line managers"],
    },
    {
      category: "Burnout & Retention",
      color: "#fcd34d",
      causes: br >= 50
        ? ["High meeting density reducing deep work time below critical threshold", "Workload imbalance across team members going unaddressed", "Managers lacking tools to detect early burnout signals"]
        : ["Burnout signals present but below clinical threshold", "Onboarding risk: new hires not surveyed in first 90 days", "No structured check-in cadence for wellbeing signals"],
    },
    {
      category: "Manager & Culture",
      color: "#c4b5fd",
      causes: mc >= 50
        ? ["Managers avoiding difficult conversations due to lack of confidence", "No structured feedback loop between managers and leadership", "Culture inconsistencies between teams creating psychological safety disparity"]
        : ["Manager effectiveness not objectively measured or tracked", "No coaching support for managers handling conflict or underperformance", "New hire belonging scores declining in first 30 days"],
    },
  ];
}

function deriveActions(scores) {
  const { workforceRiskScore: wr, burnoutRetentionScore: br, managerCultureScore: mc } = scores;
  const actions = [];
  if (wr >= 40) actions.push({ week: "Week 1", icon: "📄", action: "Run a full policy audit through the Policy Intelligence Engine", engine: "Policy Intelligence", priority: "High" });
  if (br >= 40) actions.push({ week: "Week 1–2", icon: "🔥", action: "Deploy burnout check-ins to all team members via Slack or email", engine: "Burnout Early Warning", priority: "High" });
  if (mc >= 40) actions.push({ week: "Week 2", icon: "🎯", action: "Schedule manager coaching sessions starting with lowest-scoring managers", engine: "Manager Coaching", priority: "Medium" });
  actions.push({ week: "Week 2–3", icon: "📊", action: "Run onboarding safety check-ins for any employees hired in the last 90 days", engine: "Onboarding Analytics", priority: "Medium" });
  if (wr >= 50) actions.push({ week: "Week 3", icon: "⚖️", action: "Generate ISO 45003 compliance evidence pack and audit trail", engine: "Compliance Audit", priority: "High" });
  actions.push({ week: "Week 4", icon: "📈", action: "Run industry benchmarking to compare scores against sector peers", engine: "Industry Benchmarks", priority: "Low" });
  return actions.slice(0, 5);
}

function deriveEngines(scores) {
  const { workforceRiskScore: wr, burnoutRetentionScore: br, managerCultureScore: mc } = scores;
  const all = [
    { icon: "📄", name: "Policy Intelligence Engine",    used: wr > 0 },
    { icon: "🔥", name: "Burnout Early Warning Engine",  used: br > 0 },
    { icon: "📓", name: "AI Journaling Engine",          used: br >= 30 },
    { icon: "🎯", name: "Manager Coaching Engine",       used: mc > 0 },
    { icon: "📊", name: "Onboarding Analytics Engine",   used: true },
    { icon: "💬", name: "Standup Safety Engine",         used: wr >= 20 },
    { icon: "⚖️", name: "Compliance Audit Engine",      used: wr >= 40 },
    { icon: "🏃", name: "Cognitive Load Engine",         used: br >= 40 },
    { icon: "📈", name: "Industry Benchmarks Engine",   used: true },
  ];
  return all;
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const card = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px 28px", marginBottom: "24px" };
const sectionLabel = { fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 18px", letterSpacing: "0.08em" };

const BAND_COLOR = { High: "#fca5a5", Medium: "#fcd34d", Low: "#6ee7b7" };
const BAND_BG    = { High: "rgba(239,68,68,0.08)", Medium: "rgba(245,158,11,0.08)", Low: "rgba(16,185,129,0.08)" };
const BAND_BORDER= { High: "rgba(239,68,68,0.2)",  Medium: "rgba(245,158,11,0.2)",  Low: "rgba(16,185,129,0.2)" };

const CATEGORY_META = [
  { key: "workforceRiskScore",    label: "Workforce Risk",      color: "#fca5a5", icon: "⚠️" },
  { key: "burnoutRetentionScore", label: "Burnout & Retention", color: "#fcd34d", icon: "🔥" },
  { key: "managerCultureScore",   label: "Manager & Culture",   color: "#c4b5fd", icon: "🧠" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ExecutiveWorkforceReport({ scores, companyName, onBook, onGrowth }) {
  if (!scores) return null;

  const { overallRiskScore, band } = scores;
  const bandColor  = BAND_COLOR[band];
  const bandBg     = BAND_BG[band];
  const bandBorder = BAND_BORDER[band];

  const risks   = deriveRisks(scores);
  const causes  = deriveRootCauses(scores);
  const actions = deriveActions(scores);
  const engines = deriveEngines(scores);

  const estImpact = Math.round(
    (scores.workforceRiskScore * 900 + scores.burnoutRetentionScore * 1200 + scores.managerCultureScore * 800) / 1000
  ) * 1000;

  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      {/* Report header */}
      <div style={{ borderBottom: `2px solid ${gold}`, paddingBottom: "24px", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: "700", color: gold, margin: "0 0 8px", letterSpacing: "0.1em" }}>
              EXECUTIVE WORKFORCE INTELLIGENCE REPORT · CONFIDENTIAL
            </p>
            <h1 style={{ fontSize: "30px", fontWeight: "900", color: "#f8fafc", margin: "0 0 6px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Workforce Risk Assessment
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
              {companyName || "Your Organisation"} · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · Powered by PsychFlo AI
            </p>
          </div>
          <div className="no-print" style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => window.print()}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "9px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
              Download PDF →
            </button>
            {onBook && (
              <button onClick={onBook}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "10px 18px", borderRadius: "9px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Book Audit →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. Overall Workforce Risk Score */}
      <div style={{ ...card, background: bandBg, border: `1px solid ${bandBorder}`, marginBottom: "24px" }}>
        <p style={sectionLabel}>01 · OVERALL WORKFORCE RISK SCORE</p>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ fontSize: "72px", fontWeight: "900", color: bandColor, lineHeight: 1, letterSpacing: "-0.04em" }}>
            {overallRiskScore}
          </div>
          <div>
            <div style={{ display: "inline-block", background: bandBg, border: `1px solid ${bandBorder}`, color: bandColor, fontSize: "14px", fontWeight: "700", padding: "5px 16px", borderRadius: "999px", marginBottom: "10px" }}>
              {band} Risk
            </div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: "1.6", maxWidth: "420px" }}>
              {band === "High"
                ? "Significant workforce risks detected. Immediate action is recommended to prevent financial exposure and talent loss."
                : band === "Medium"
                ? "Moderate risk signals present. Proactive intervention now prevents these from escalating into costly incidents."
                : "Low risk signals detected. Use this window to build resilience and maintain a healthy workforce baseline."}
            </p>
          </div>
          <div style={{ flex: 1, minWidth: "180px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>0 — No risk</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>100 — Critical</span>
            </div>
            <div style={{ height: "10px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${overallRiskScore}%`, background: `linear-gradient(90deg, #6ee7b7, #fcd34d, #fca5a5)`, borderRadius: "999px" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              {["Low", "Medium", "High"].map((l, i) => (
                <span key={i} style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", fontWeight: "600" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Risk by Category */}
      <div style={{ ...card }}>
        <p style={sectionLabel}>02 · RISK BY CATEGORY</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
          {CATEGORY_META.map((cat, i) => {
            const val = scores[cat.key];
            const catBand = val >= 66 ? "High" : val >= 31 ? "Medium" : "Low";
            return (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${cat.color}22`, borderRadius: "12px", padding: "18px" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{cat.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: cat.color, marginBottom: "4px", letterSpacing: "0.04em" }}>{cat.label}</div>
                <div style={{ fontSize: "32px", fontWeight: "800", color: cat.color, marginBottom: "8px", letterSpacing: "-0.02em" }}>{val}<span style={{ fontSize: "16px", opacity: 0.5 }}>/100</span></div>
                <div style={{ height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", marginBottom: "8px" }}>
                  <div style={{ height: "100%", width: `${val}%`, background: cat.color, borderRadius: "999px" }} />
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{catBand} Risk · {val >= 66 ? "Immediate action" : val >= 31 ? "Monitor & act" : "Maintain & build"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Top 3 Business Risks */}
      <div style={{ ...card }}>
        <p style={sectionLabel}>03 · TOP 3 BUSINESS RISKS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {risks.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px 18px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: `1px solid ${r.color}22` }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${r.color}22`, color: r.color, fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "16px" }}>{r.icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{r.title}</span>
                </div>
                <div style={{ fontSize: "12px", color: r.color, fontWeight: "600" }}>{r.impact}</div>
              </div>
              <span style={{ fontSize: "10px", fontWeight: "700", color: r.color, background: `${r.color}18`, padding: "3px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                {r.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Estimated Business Impact */}
      <div style={{ ...card, background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.18)" }}>
        <p style={sectionLabel}>04 · ESTIMATED BUSINESS IMPACT</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
          {[
            { label: "Estimated financial exposure", value: `£${estImpact.toLocaleString("en-GB")}`, sub: "if risks go unaddressed (12 months)", color: "#fca5a5" },
            { label: "Preventable with intervention", value: `£${Math.round(estImpact * 0.7).toLocaleString("en-GB")}`, sub: "estimated savings with PsychFlo monitoring", color: "#6ee7b7" },
            { label: "ROI on Growth Prevention plan", value: `${Math.max(3, Math.round(estImpact * 0.7 / 24000))}×`, sub: "vs £2,000/month platform cost", color: gold },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "18px" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "8px", letterSpacing: "0.04em" }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: s.color, marginBottom: "6px", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: "1.4" }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: "16px 0 0", fontStyle: "italic" }}>
          Estimates based on CIPD 2024 benchmarks: £65k avg replacement cost, £1,300/yr presenteeism per employee, £45k avg tribunal award.
        </p>
      </div>

      {/* 5. Root Causes */}
      <div style={{ ...card }}>
        <p style={sectionLabel}>05 · ROOT CAUSES BY CATEGORY</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {causes.map((cat, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: cat.color }} />
                <span style={{ fontSize: "12px", fontWeight: "700", color: cat.color, letterSpacing: "0.04em" }}>{cat.category.toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "18px" }}>
                {cat.causes.map((c, j) => (
                  <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: cat.color, fontSize: "12px", marginTop: "1px", flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: "1.5" }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Recommended Actions */}
      <div style={{ ...card }}>
        <p style={sectionLabel}>06 · RECOMMENDED ACTIONS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {actions.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center", padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "10px" }}>
              <span style={{ fontSize: "20px" }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", marginBottom: "2px" }}>{a.action}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Engine: {a.engine}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: a.priority === "High" ? "#fca5a5" : a.priority === "Medium" ? gold : "#6ee7b7", background: a.priority === "High" ? "rgba(239,68,68,0.1)" : a.priority === "Medium" ? "rgba(201,168,76,0.1)" : "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "999px", marginBottom: "4px" }}>
                  {a.priority}
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{a.week}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 30-Day Priority Plan */}
      <div style={{ ...card }}>
        <p style={sectionLabel}>07 · 30-DAY PRIORITY PLAN</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
          {[
            { week: "Week 1", focus: "Immediate risk triage", tasks: ["Run policy audit", "Deploy burnout check-ins", "Identify flight risk employees"] },
            { week: "Week 2", focus: "Data collection", tasks: ["Onboarding check-ins for recent hires", "Manager coaching sessions scheduled", "Standup safety baseline established"] },
            { week: "Week 3", focus: "Analysis & reporting", tasks: ["ISO 45003 compliance audit", "Manager effectiveness scorecards", "First executive risk report generated"] },
            { week: "Week 4", focus: "Strategic action", tasks: ["Industry benchmark comparison", "Board report presented", "90-day monitoring plan agreed"] },
          ].map((w, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: gold, letterSpacing: "0.08em", marginBottom: "6px" }}>{w.week.toUpperCase()}</div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc", marginBottom: "10px" }}>{w.focus}</div>
              {w.tasks.map((t, j) => (
                <div key={j} style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                  <span style={{ color: gold, fontSize: "11px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", lineHeight: "1.4" }}>{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 8. Intelligence Engines Used */}
      <div style={{ ...card }}>
        <p style={sectionLabel}>08 · INTELLIGENCE ENGINES USED IN THIS ASSESSMENT</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
          {deriveEngines(scores).map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: e.used ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.02)", border: e.used ? "1px solid rgba(201,168,76,0.15)" : "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", opacity: e.used ? 1 : 0.4 }}>
              <span style={{ fontSize: "18px" }}>{e.icon}</span>
              <span style={{ fontSize: "11px", fontWeight: "600", color: e.used ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}>{e.name}</span>
              {e.used && <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#6ee7b7", flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* 9. CTA */}
      <div className="no-print" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "20px", padding: "44px 40px", textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: gold, letterSpacing: "0.1em", marginBottom: "14px" }}>NEXT STEPS</div>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Turn this report into action
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 auto 28px", maxWidth: "480px", lineHeight: "1.7" }}>
          Book a full Workforce Risk Audit and receive a scored, board-ready Executive Report within 48 hours — with a 30-day plan your leadership team can execute immediately. Or move straight to continuous monitoring with the Growth Prevention System.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          {onBook && (
            <button onClick={onBook}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "15px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
              Book Audit — £750 →
            </button>
          )}
          {onGrowth && (
            <button onClick={onGrowth}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#f8fafc", padding: "15px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              Apply for Growth Prevention System →
            </button>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "28px", flexWrap: "wrap" }}>
          {[
            { icon: "⏱️", text: "48-hour delivery" },
            { icon: "📄", text: "Board-ready PDF" },
            { icon: "📋", text: "30-day action plan" },
            { icon: "🔒", text: "No lock-in" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "13px" }}>{s.icon}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: "500" }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
          Confidential · For executive and board-level review only.<br />
          Derived from diagnostic inputs. Individual data is never disclosed.
        </p>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: 0, textAlign: "right" }}>
          PsychFlo · psychflo.com<br />
          Executive Workforce Intelligence System
        </p>
      </div>
    </div>
  );
}
