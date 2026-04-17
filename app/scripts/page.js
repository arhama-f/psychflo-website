"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

// Demo employees — in prod these come from /api/team
const DEMO_EMPLOYEES = [
  { id: "1", name: "Sarah M.", score: 78, stressors: ["workload", "lack of recognition", "unclear expectations"], dimensions: { exhaustion: 82, cynicism: 71, efficacy: 38 } },
  { id: "2", name: "James K.", score: 65, stressors: ["work-life balance", "remote isolation"], dimensions: { exhaustion: 68, cynicism: 58, efficacy: 52 } },
  { id: "3", name: "Priya R.", score: 71, stressors: ["management pressure", "workload", "poor communication"], dimensions: { exhaustion: 74, cynicism: 65, efficacy: 44 } },
];

function RiskBadge({ score }) {
  const color = score >= 67 ? "#ef4444" : score >= 34 ? "#f59e0b" : "#10b981";
  const label = score >= 67 ? "High risk" : score >= 34 ? "Moderate" : "Low risk";
  return (
    <span style={{ background: `${color}18`, border: `1px solid ${color}40`, color, borderRadius: "999px", padding: "3px 10px", fontSize: "11px", fontWeight: "700" }}>
      {label} · {score}
    </span>
  );
}

export default function ScriptsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [activeSection, setActiveSection] = useState("opening");

  async function generateScript(emp) {
    setSelected(emp);
    setScript(null);
    setLoading(true);
    setActiveSection("opening");
    try {
      const res = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: emp.id,
          employeeName: emp.name,
          burnoutScore: emp.score,
          stressors: emp.stressors,
          dimensions: emp.dimensions,
        }),
      });
      const data = await res.json();
      setScript(data.script);
    } catch {
      setScript(null);
    }
    setLoading(false);
  }

  function copyText(text, key) {
    navigator.clipboard.writeText(text.replace(/"/g, ""));
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const SECTIONS = [
    { key: "opening", label: "Opening" },
    { key: "key_questions", label: "Questions" },
    { key: "phrases_to_use", label: "Phrases to use" },
    { key: "phrases_to_avoid", label: "Avoid" },
    { key: "suggested_actions", label: "Actions" },
    { key: "closing", label: "Closing" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "999px", padding: "5px 14px", marginBottom: "16px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", color: gold, letterSpacing: "0.08em" }}>AI MANAGER SCRIPTS</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px" }}>Conversation scripts</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.7 }}>
            Select a team member to generate a personalised script based on their burnout data. These conversations save relationships.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px", alignItems: "start" }}>

          {/* Left — employee list */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: "12px" }}>AT-RISK TEAM MEMBERS</div>
            {DEMO_EMPLOYEES.sort((a, b) => b.score - a.score).map(emp => (
              <button key={emp.id} onClick={() => generateScript(emp)}
                style={{
                  width: "100%", textAlign: "left", display: "block",
                  background: selected?.id === emp.id ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selected?.id === emp.id ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "12px", padding: "14px 16px", marginBottom: "8px", cursor: "pointer"
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{emp.name}</span>
                  <RiskBadge score={emp.score} />
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                  {emp.stressors.slice(0, 2).join(" · ")}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px", marginTop: "10px" }}>
                  {[["Ex", emp.dimensions.exhaustion, "#ef4444"], ["Cy", emp.dimensions.cynicism, "#f59e0b"], ["Ef", emp.dimensions.efficacy, "#10b981"]].map(([l, v, c]) => (
                    <div key={l} style={{ textAlign: "center", background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "4px" }}>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: c }}>{v}</div>
                      <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </button>
            ))}
            <button onClick={() => router.push("/dashboard")}
              style={{ width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "11px", color: "rgba(255,255,255,0.3)", fontSize: "12px", cursor: "pointer", marginTop: "8px" }}>
              ← Back to dashboard
            </button>
          </div>

          {/* Right — script */}
          <div>
            {!selected && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "60px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>💬</div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", margin: 0 }}>Select a team member to generate their conversation script</p>
              </div>
            )}

            {loading && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "60px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>Analysing {selected?.name}'s data...</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>Claude is personalising this script based on their stressors and scores</div>
              </div>
            )}

            {script && !loading && (
              <div>
                {/* Context banner */}
                <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "14px", padding: "16px 20px", marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(201,168,76,0.6)", letterSpacing: "0.08em", marginBottom: "6px" }}>SITUATION SUMMARY</div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.7 }}>{script.context}</p>
                </div>

                {/* Before the conversation */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px 20px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: "12px" }}>BEFORE THE CONVERSATION</div>
                  {(script.before_the_conversation || []).map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                      <span style={{ color: gold, fontSize: "13px", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Section tabs */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" }}>
                  {SECTIONS.map(s => (
                    <button key={s.key} onClick={() => setActiveSection(s.key)}
                      style={{
                        background: activeSection === s.key ? `rgba(201,168,76,0.15)` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${activeSection === s.key ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                        borderRadius: "8px", padding: "7px 14px", fontSize: "12px",
                        color: activeSection === s.key ? gold : "rgba(255,255,255,0.4)",
                        fontWeight: activeSection === s.key ? "700" : "400",
                        cursor: "pointer"
                      }}>
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Section content */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>

                  {(activeSection === "opening" || activeSection === "closing") && (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: "14px" }}>
                        {activeSection === "opening" ? "OPENING WORDS" : "CLOSING WORDS"}
                      </div>
                      <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "16px", marginBottom: "12px", position: "relative" }}>
                        <p style={{ fontSize: "15px", color: "#f8fafc", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
                          {script[activeSection]}
                        </p>
                      </div>
                      <button onClick={() => copyText(script[activeSection], activeSection)}
                        style={{ background: copied === activeSection ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${copied === activeSection ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: "8px", padding: "8px 16px", fontSize: "12px", color: copied === activeSection ? "#6ee7b7" : "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                        {copied === activeSection ? "Copied!" : "Copy to clipboard"}
                      </button>
                    </div>
                  )}

                  {activeSection === "key_questions" && (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: "14px" }}>KEY QUESTIONS TO ASK</div>
                      {(script.key_questions || []).map((q, i) => (
                        <div key={i} style={{ background: "rgba(0,0,0,0.15)", borderRadius: "10px", padding: "14px 16px", marginBottom: "10px" }}>
                          <div style={{ fontSize: "14px", color: "#f8fafc", lineHeight: 1.7, marginBottom: "6px", fontStyle: "italic" }}>"{q.question}"</div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Why: {q.why}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSection === "phrases_to_use" && (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(16,185,129,0.6)", letterSpacing: "0.08em", marginBottom: "14px" }}>PHRASES THAT BUILD TRUST</div>
                      {(script.phrases_to_use || []).map((p, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px", padding: "12px", background: "rgba(16,185,129,0.05)", borderRadius: "8px" }}>
                          <span style={{ color: "#10b981", fontSize: "14px", flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontStyle: "italic" }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSection === "phrases_to_avoid" && (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(239,68,68,0.6)", letterSpacing: "0.08em", marginBottom: "14px" }}>PHRASES THAT MAKE THINGS WORSE</div>
                      {(script.phrases_to_avoid || []).map((p, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px", padding: "12px", background: "rgba(239,68,68,0.05)", borderRadius: "8px" }}>
                          <span style={{ color: "#ef4444", fontSize: "14px", flexShrink: 0 }}>✗</span>
                          <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSection === "suggested_actions" && (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(201,168,76,0.6)", letterSpacing: "0.08em", marginBottom: "14px" }}>ACTIONS TO OFFER OR TAKE</div>
                      {(script.suggested_actions || []).map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                          <span style={{ color: gold, fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>→</span>
                          <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Print / export hint */}
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "12px", textAlign: "center" }}>
                  Script is personalised to {selected?.name}'s stressors and scores · Not stored or shared
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
