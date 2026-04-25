"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const prompts = [
  { label: "Today's pressure", q: "What's weighing on you most at work right now? Describe it without judging yourself." },
  { label: "Energy check", q: "On a scale of 1–10, how energised do you feel today — and what's driving that number?" },
  { label: "A win", q: "What went well recently, even if it felt small? What did you contribute to that outcome?" },
  { label: "Inner critic", q: "What would you say to a colleague who was struggling the way you are right now?" },
  { label: "Values alignment", q: "Does your work feel meaningful today? What would make it feel more aligned with what matters to you?" },
  { label: "Boundaries", q: "Where did you say yes when you wanted to say no this week? What stopped you?" },
];

const moods = ["😔", "😟", "😐", "🙂", "😊"];
const moodLabels = ["Struggling", "Low", "Neutral", "Good", "Thriving"];

export default function JournalingTool() {
  const router = useRouter();
  const [mood, setMood] = useState(null);
  const [promptIdx, setPromptIdx] = useState(0);
  const [entry, setEntry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [entries, setEntries] = useState([
    { date: "Mon 21 Apr", mood: 3, text: "Had a tough 1:1 with my manager. Felt like I couldn't be honest about being overwhelmed. Need to find a way to raise this.", prompt: "Boundaries" },
    { date: "Thu 17 Apr", mood: 4, text: "Shipped the new onboarding flow. The team celebrated. It's easy to forget how good it feels when something lands well.", prompt: "A win" },
    { date: "Tue 15 Apr", mood: 2, text: "Running on empty. Three back-to-back sprint reviews and no time to think. This pace isn't sustainable.", prompt: "Energy check" },
  ]);

  async function handleSubmit() {
    if (!entry.trim() || mood === null) return;
    setEntries([{ date: "Today", mood, text: entry, prompt: prompts[promptIdx].label }, ...entries]);
    setSubmitted(true);
    setFeedbackLoading(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry, prompt: prompts[promptIdx].q, mood }),
      });
      const data = await res.json();
      if (!data.error) setAiFeedback(data);
    } catch { /* non-fatal */ }
    setFeedbackLoading(false);
  }

  const moodColor = (m) => m <= 1 ? "#f87171" : m === 2 ? "#fb923c" : m === 3 ? "#facc15" : m === 4 ? "#86efac" : "#34d399";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.06em" }}>📓 AI JOURNALING</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>CBT-grounded journaling</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.7" }}>Private, structured reflection with evidence-based prompts. Patterns surface automatically — no analysis required.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "start" }}>

          <div>
            {!submitted ? (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>HOW ARE YOU FEELING?</p>
                <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
                  {moods.map((m, i) => (
                    <button key={i} onClick={() => setMood(i)}
                      style={{ flex: 1, background: mood === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)", border: mood === i ? `1px solid ${moodColor(i)}` : "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px 6px", cursor: "pointer", textAlign: "center" }}>
                      <div style={{ fontSize: "22px", marginBottom: "4px" }}>{m}</div>
                      <div style={{ fontSize: "9px", color: mood === i ? moodColor(i) : "rgba(255,255,255,0.3)", fontWeight: "600" }}>{moodLabels[i]}</div>
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "12px", letterSpacing: "0.06em" }}>TODAY'S PROMPT</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {prompts.map((p, i) => (
                    <button key={i} onClick={() => setPromptIdx(i)}
                      style={{ background: promptIdx === i ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)", border: promptIdx === i ? `1px solid rgba(201,168,76,0.3)` : "1px solid rgba(255,255,255,0.08)", color: promptIdx === i ? gold : "rgba(255,255,255,0.4)", padding: "5px 12px", borderRadius: "999px", fontSize: "11px", cursor: "pointer", fontWeight: "500" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.6", fontStyle: "italic" }}>"{prompts[promptIdx].q}"</p>
                </div>
                <textarea value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="Write freely — this is private..."
                  style={{ width: "100%", minHeight: "140px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px", color: "#f8fafc", fontSize: "14px", lineHeight: "1.7", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                <button onClick={handleSubmit}
                  style={{ marginTop: "14px", width: "100%", background: mood !== null && entry.trim() ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.06)", color: mood !== null && entry.trim() ? "#0f172a" : "rgba(255,255,255,0.3)", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: mood !== null && entry.trim() ? "pointer" : "default", transition: "all 0.2s" }}>
                  Save entry
                </button>
              </div>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ textAlign: "center", marginBottom: aiFeedback || feedbackLoading ? "24px" : "0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>✓</div>
                  <h3 style={{ color: "#6ee7b7", fontSize: "18px", fontWeight: "700", margin: "0 0 8px" }}>Entry saved</h3>
                  {feedbackLoading && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 8px", fontStyle: "italic" }}>Generating your CBT reflection…</p>}
                </div>
                {aiFeedback && (
                  <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: gold, margin: "0 0 12px", letterSpacing: "0.06em" }}>AI REFLECTION</p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: "0 0 12px", lineHeight: "1.7" }}>{aiFeedback.reflection}</p>
                    {aiFeedback.pattern && <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 10px", lineHeight: "1.6" }}><strong style={{ color: "rgba(255,255,255,0.6)" }}>Pattern noticed:</strong> {aiFeedback.pattern}</p>}
                    {aiFeedback.reframe && <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 10px", lineHeight: "1.6" }}><strong style={{ color: "rgba(255,255,255,0.6)" }}>Reframe:</strong> {aiFeedback.reframe}</p>}
                    {aiFeedback.question && <p style={{ fontSize: "13px", color: gold, margin: "0", lineHeight: "1.6", fontStyle: "italic" }}>"{aiFeedback.question}"</p>}
                  </div>
                )}
                <div style={{ textAlign: "center" }}>
                  <button onClick={() => { setSubmitted(false); setEntry(""); setMood(null); setAiFeedback(null); }}
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                    New entry
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "12px", letterSpacing: "0.06em" }}>RECENT ENTRIES</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {entries.map((e, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "18px" }}>{moods[e.mood]}</span>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{e.date}</span>
                        <span style={{ fontSize: "10px", background: "rgba(201,168,76,0.08)", color: gold, padding: "2px 8px", borderRadius: "999px" }}>{e.prompt}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: "1.6" }}>{e.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>YOUR PATTERN SNAPSHOT</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[{ label: "Avg mood (7 days)", value: "😐 Neutral", color: "#facc15" }, { label: "Most common theme", value: "Boundaries", color: gold }, { label: "Entries this month", value: "4", color: "#86efac" }, { label: "Streak", value: "3 days", color: gold }].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{s.label}</span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "12px", letterSpacing: "0.06em" }}>AI PATTERN DETECTED</p>
              <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "8px", padding: "12px" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: "1.6" }}>You've mentioned <strong style={{ color: gold }}>boundaries</strong> and <strong style={{ color: gold }}>saying yes when you mean no</strong> across 3 of your last 5 entries. This pattern is linked to emotional exhaustion in the Maslach framework.</p>
              </div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "10px", margin: "10px 0 0", lineHeight: "1.5" }}>Insight unlocked after 5 entries</p>
            </div>

            <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "14px", padding: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>Full access includes</p>
              {["Unlimited entries", "Weekly mood report", "Manager sharing (opt-in)", "Anonymous team aggregates", "Export to PDF"].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ color: gold, fontSize: "11px" }}>✓</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{f}</span>
                </div>
              ))}
              <button onClick={() => router.push("/pricing")} style={{ marginTop: "14px", width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                Upgrade for full access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
