"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const sampleInterview = `Participant: Honestly the onboarding was really overwhelming. There was just so much information thrown at me in the first week.

Facilitator: Can you tell me more about what felt overwhelming?

Participant: Like, I had five different Slack channels to join, three tools to set up, and nobody really explained why any of it mattered. I just felt lost.

Facilitator: How did that affect your first month?

Participant: I was hesitant to ask questions because I didn't want to look stupid. So I just sort of muddled through. It took me probably six weeks to feel like I actually knew what I was doing.`;

const insights = [
  { theme: "Information overload", quote: "There was just so much information thrown at me in the first week.", sentiment: "negative", count: 8 },
  { theme: "Lack of context", quote: "Nobody really explained why any of it mattered.", sentiment: "negative", count: 6 },
  { theme: "Psychological safety barrier", quote: "I was hesitant to ask questions because I didn't want to look stupid.", sentiment: "negative", count: 11 },
  { theme: "Extended time-to-competence", quote: "It took me probably six weeks to feel like I actually knew what I was doing.", sentiment: "neutral", count: 7 },
];

const themes = [
  { name: "Psychological safety", count: 11, pct: 85, color: "#f87171" },
  { name: "Information overload", count: 8, pct: 62, color: "#fb923c" },
  { name: "Extended onboarding", count: 7, pct: 54, color: "#facc15" },
  { name: "Tool complexity", count: 5, pct: 38, color: "#86efac" },
  { name: "Manager support", count: 4, pct: 31, color: gold },
];

export default function UXResearchTool() {
  const router = useRouter();
  const [tab, setTab] = useState("paste");
  const [input, setInput] = useState("");
  const [analysed, setAnalysed] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleAnalyse() {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setAnalysed(true); }, 1800);
  }

  function useSample() {
    setInput(sampleInterview);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.06em" }}>🧠 UX RESEARCH COPILOT</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Auto-synthesise user interviews</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.7" }}>Paste a transcript or upload a recording. Get themes, verbatim quotes, and sentiment analysis in seconds.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: analysed ? "1fr 320px" : "1fr", gap: "20px", alignItems: "start" }}>
          <div>
            {!analysed ? (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ display: "flex", gap: "0", marginBottom: "20px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "3px" }}>
                  {["paste", "upload"].map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                      style={{ flex: 1, background: tab === t ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: tab === t ? "#f8fafc" : "rgba(255,255,255,0.35)", padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", textTransform: "capitalize" }}>
                      {t === "paste" ? "Paste transcript" : "Upload audio/text"}
                    </button>
                  ))}
                </div>

                {tab === "paste" ? (
                  <div>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your interview transcript here..."
                      style={{ width: "100%", minHeight: "200px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px", color: "#f8fafc", fontSize: "13px", lineHeight: "1.7", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                      <button onClick={handleAnalyse} disabled={!input.trim() || loading}
                        style={{ background: input.trim() && !loading ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.06)", color: input.trim() && !loading ? "#0f172a" : "rgba(255,255,255,0.3)", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: input.trim() && !loading ? "pointer" : "default" }}>
                        {loading ? "Analysing…" : "Analyse interview"}
                      </button>
                      <button onClick={useSample} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "12px 18px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                        Use sample
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
                    <div style={{ fontSize: "32px", marginBottom: "10px" }}>📂</div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 14px" }}>Drag & drop .mp3, .mp4, .txt, or .docx</p>
                    <button onClick={useSample} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "10px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                      Use sample transcript instead
                    </button>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", margin: "12px 0 0" }}>Full upload available on paid plan</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>Synthesis results</h2>
                  <button onClick={() => { setAnalysed(false); setInput(""); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>
                    New interview
                  </button>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "22px", marginBottom: "14px" }}>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>KEY INSIGHTS</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {insights.map((ins, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: ins.sentiment === "negative" ? "#fca5a5" : ins.sentiment === "positive" ? "#86efac" : gold }}>{ins.theme}</span>
                          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "999px" }}>×{ins.count} participants</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0, fontStyle: "italic", lineHeight: "1.5" }}>"{ins.quote}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "22px" }}>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>THEME FREQUENCY</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {themes.map((t, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{t.name}</span>
                          <span style={{ fontSize: "11px", color: t.color, fontWeight: "700" }}>{t.count} mentions</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${t.pct}%`, background: t.color, borderRadius: "999px", transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {analysed && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "12px", letterSpacing: "0.06em" }}>SUMMARY</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0 0 12px", lineHeight: "1.6" }}>
                  Psychological safety is the dominant friction point — appearing in <strong style={{ color: gold }}>85% of transcripts</strong>. Participants were reluctant to ask for help, leading to extended time-to-competence.
                </p>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>RECOMMENDED ACTIONS</p>
                {["Add a 'no stupid questions' onboarding norm", "Pair new hires with a buddy for week 1", "Reduce tool setup to a single checklist"].map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ color: gold }}>→</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "14px", padding: "18px" }}>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>Full plan includes</p>
                {["Unlimited interviews", "Audio transcription", "Multi-session cross-analysis", "Shareable insight reports", "Affinity mapping"].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "5px" }}>
                    <span style={{ color: gold, fontSize: "11px" }}>✓</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{f}</span>
                  </div>
                ))}
                <button onClick={() => router.push("/pricing")} style={{ marginTop: "14px", width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "11px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                  Upgrade
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
