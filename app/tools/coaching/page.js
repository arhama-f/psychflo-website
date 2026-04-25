"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const scenarios = [
  {
    id: "underperformance",
    label: "Underperformance",
    icon: "📉",
    desc: "An employee is missing targets. How do you raise it without damaging the relationship?",
    employee: "Alex",
    context: "Alex has missed their sprint targets three times in a row. They're a strong engineer but seem disengaged.",
    exchange: [
      { role: "manager", text: "Alex, thanks for making time. I wanted to check in — how are you finding things at the moment?" },
      { role: "employee", text: "Fine. Busy, I guess." },
      { role: "manager", text: "I've noticed the last three sprints haven't quite landed where we'd hoped. I want to understand what's getting in the way before we talk about the work itself." },
      { role: "employee", text: "It's just been a lot. The requirements keep changing and I don't always feel like I know what 'done' looks like." },
      { role: "manager", text: "That's really helpful to hear. Unclear requirements — that's something we can fix together. What would help you feel more confident about what's expected?" },
    ],
  },
  {
    id: "conflict",
    label: "Team conflict",
    icon: "⚡",
    desc: "Two team members aren't getting along. You need to address it before it affects the whole team.",
    employee: "Sam & Jordan",
    context: "Sam and Jordan have had visible tension in standups. Other team members are noticing and disengaging.",
    exchange: [
      { role: "manager", text: "Sam, I wanted to speak with you privately. I've noticed some tension in the last few standups — I want to understand your perspective." },
      { role: "employee", text: "Jordan keeps interrupting me in meetings. I don't feel respected." },
      { role: "manager", text: "I hear that. Feeling interrupted is frustrating, especially when you're trying to contribute. Can you tell me about a specific moment?" },
      { role: "employee", text: "Last Tuesday, I was explaining the API issue and Jordan just talked over me. Again." },
      { role: "manager", text: "Thank you for being specific — that helps. I'm going to speak with Jordan separately. What outcome would feel right to you after this conversation?" },
    ],
  },
  {
    id: "burnout",
    label: "Burnout signals",
    icon: "🔥",
    desc: "You suspect a team member is burning out. How do you open the conversation safely?",
    employee: "Maya",
    context: "Maya was your strongest performer six months ago. She's now quieter in meetings, missing small things, and seems exhausted.",
    exchange: [
      { role: "manager", text: "Maya, how are you actually doing? Not the work — you, as a person." },
      { role: "employee", text: "I'm fine. Just tired." },
      { role: "manager", text: "I've noticed you've seemed quieter over the last couple of months. I'm not raising this as a performance concern — I'm raising it because I care about how you're doing." },
      { role: "employee", text: "Honestly? I'm exhausted. I don't feel like anything I do is ever enough." },
      { role: "manager", text: "Thank you for telling me that. That takes courage. I want you to know that your worth here is not measured by output. Can we talk about what's driving that feeling?" },
    ],
  },
  {
    id: "pip",
    label: "Performance plan",
    icon: "📋",
    desc: "You need to put someone on a formal performance improvement plan. How do you do it humanely?",
    employee: "Chris",
    context: "Chris has been underperforming for four months. Informal support hasn't worked. A PIP is now required.",
    exchange: [
      { role: "manager", text: "Chris, I want to be honest with you today, because I think you deserve that. We're at a point where I need to start a formal process." },
      { role: "employee", text: "A formal process? Am I being pushed out?" },
      { role: "manager", text: "No. A performance improvement plan is a structured way for us to define what success looks like and support you in getting there. It's not a precursor to dismissal — it's a last resort before that." },
      { role: "employee", text: "What happens if I can't meet it?" },
      { role: "manager", text: "Let's cross that bridge if we come to it. Right now, I want to focus on setting objectives you have a real chance of hitting. You'll have my support throughout." },
    ],
  },
];

export default function CoachingTool() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const scenario = scenarios.find((s) => s.id === selected);

  const [practiceLoading, setPracticeLoading] = useState(false);

  async function handlePracticeSubmit() {
    if (!userInput.trim() || practiceLoading) return;
    const msg = userInput;
    setUserInput("");
    setPracticeLoading(true);
    const newHistory = [...practiceHistory, { role: "manager", text: msg }];
    setPracticeHistory(newHistory);
    try {
      const res = await fetch("/api/coaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerMessage: msg, scenario: scenario?.label, context: scenario?.context, history: newHistory }),
      });
      const data = await res.json();
      if (!data.error) {
        setFeedback({ label: data.label, tip: data.tip, score: data.score });
        if (data.employeeReply) setPracticeHistory([...newHistory, { role: "employee", text: data.employeeReply }]);
      }
    } catch { /* non-fatal */ }
    setPracticeLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.06em" }}>🎯 MANAGER COACHING</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>AI roleplay for difficult conversations</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.7" }}>Practice the conversations that matter most. See how a psychologically safe manager handles each scenario — then try it yourself.</p>
        </div>

        {!selected ? (
          <div>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "16px", letterSpacing: "0.06em" }}>CHOOSE A SCENARIO</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {scenarios.map((s) => (
                <div key={s.id} onClick={() => { setSelected(s.id); setStep(0); setPracticeMode(false); setFeedback(null); setPracticeHistory([]); }}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "22px", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                  <div style={{ fontSize: "28px", marginBottom: "10px" }}>{s.icon}</div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px" }}>{s.label}</h3>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.6" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "24px" }}>
              ← Back to scenarios
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>
              <div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 6px", letterSpacing: "0.06em" }}>CONTEXT</p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: "1.6" }}>{scenario.context}</p>
                </div>

                {!practiceMode ? (
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>EXAMPLE CONVERSATION — Step {step + 1} of {scenario.exchange.length}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                      {scenario.exchange.slice(0, step + 1).map((line, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", justifyContent: line.role === "manager" ? "flex-start" : "flex-end" }}>
                          <div style={{ maxWidth: "85%", background: line.role === "manager" ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.06)", border: line.role === "manager" ? "1px solid rgba(201,168,76,0.2)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 14px" }}>
                            <p style={{ fontSize: "11px", fontWeight: "700", color: line.role === "manager" ? gold : "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>{line.role === "manager" ? "You (Manager)" : scenario.employee}</p>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.6" }}>{line.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {step < scenario.exchange.length - 1 ? (
                        <button onClick={() => setStep(step + 1)} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                          Next line →
                        </button>
                      ) : (
                        <button onClick={() => { setPracticeMode(true); setStep(0); }} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                          Now you try →
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>YOUR TURN — How would you open this conversation?</p>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px", marginBottom: "14px", minHeight: "80px" }}>
                      {practiceHistory.map((h, i) => (
                        <p key={i} style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0 0 6px", lineHeight: "1.6" }}>
                          <strong style={{ color: h.role === "manager" ? gold : "rgba(255,255,255,0.4)" }}>{h.role === "manager" ? "You:" : `${scenario.employee}:`}</strong> {h.text}
                        </p>
                      ))}
                      {practiceLoading && <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Analysing your response…</p>}
                    </div>
                    {feedback && (
                      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                          <p style={{ fontSize: "11px", fontWeight: "700", color: gold, margin: 0 }}>AI FEEDBACK</p>
                          {feedback.score && <span style={{ fontSize: "12px", fontWeight: "700", color: feedback.score >= 7 ? "#10b981" : feedback.score >= 5 ? "#f59e0b" : "#ef4444" }}>{feedback.score}/10</span>}
                        </div>
                        <p style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px" }}>{feedback.label}</p>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: "1.6" }}>{feedback.tip}</p>
                      </div>
                    )}
                    <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={`How would you respond to ${scenario.employee}?`}
                      style={{ width: "100%", minHeight: "100px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px", color: "#f8fafc", fontSize: "13px", lineHeight: "1.7", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: "10px" }} />
                    <button onClick={handlePracticeSubmit} disabled={practiceLoading || !userInput.trim()} style={{ background: practiceLoading || !userInput.trim() ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg,${gold},#f0d080)`, color: practiceLoading || !userInput.trim() ? "rgba(255,255,255,0.3)" : "#0f172a", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: practiceLoading || !userInput.trim() ? "default" : "pointer" }}>
                      {practiceLoading ? "Analysing…" : "Get AI feedback"}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px" }}>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "12px", letterSpacing: "0.06em" }}>PSYCHOLOGY NOTES</p>
                  {[{ label: "Psychological safety", note: "Open with curiosity, not accusation. The brain's threat response shuts down honest dialogue." }, { label: "Separation principle", note: "Separate the person from the performance. 'The output missed' vs 'You failed'." }, { label: "GROW framework", note: "Goal → Reality → Options → Will. Structure the conversation around their agency." }].map((n, i) => (
                    <div key={i} style={{ marginBottom: "12px" }}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: gold, margin: "0 0 3px" }}>{n.label}</p>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.5" }}>{n.note}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "14px", padding: "18px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>Full library includes</p>
                  {["12 scenario types", "Live AI roleplay mode", "Team coaching dashboard", "Manager skill scoring", "Custom scenarios"].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "5px" }}>
                      <span style={{ color: gold, fontSize: "11px" }}>✓</span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{f}</span>
                    </div>
                  ))}
                  <button onClick={() => router.push("/pricing")} style={{ marginTop: "14px", width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "11px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                    Unlock full library
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
