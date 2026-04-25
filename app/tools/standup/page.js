"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const team = [
  { name: "Aisha K.", submitted: true, yesterday: "Finished the auth refactor and reviewed two PRs", today: "Starting the notification service, need to unblock Maya on API schema", blockers: "", safetyScore: 88, flags: [] },
  { name: "Dev P.", submitted: true, yesterday: "Spent most of the day on the memory leak — still not fixed", today: "Continuing the memory leak investigation, might need a second pair of eyes", blockers: "Could use pairing on the Redis config", safetyScore: 62, flags: ["Repeated blocker unacknowledged (2 days)"] },
  { name: "Maya R.", submitted: true, yesterday: "Blocked on API schema — sent 3 messages but no response", today: "Waiting on schema, will pick up docs in the meantime", blockers: "Still blocked on API schema from Aisha", safetyScore: 44, flags: ["Frustration signal detected", "Blocker unresolved 48h"] },
  { name: "Tom B.", submitted: false, yesterday: "", today: "", blockers: "", safetyScore: null, flags: ["No submission — 2nd day"] },
];

const safetyColor = (s) => s === null ? "rgba(255,255,255,0.3)" : s >= 75 ? "#6ee7b7" : s >= 50 ? gold : "#f87171";

export default function StandupTool() {
  const router = useRouter();
  const [view, setView] = useState("dashboard");
  const [form, setForm] = useState({ yesterday: "", today: "", blockers: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    if (!form.yesterday.trim() || !form.today.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/standup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.06em" }}>💬 ASYNC STANDUP</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Standup + psychological safety scoring</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.7" }}>Async standups with NLP analysis. Detect blockers, frustration signals, and safety trends — before they become problems.</p>
        </div>

        <div style={{ display: "flex", gap: "0", marginBottom: "28px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "3px", width: "fit-content" }}>
          {["dashboard", "submit", "insights"].map((v) => (
            <button key={v} onClick={() => setView(v)}
              style={{ background: view === v ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: view === v ? "#f8fafc" : "rgba(255,255,255,0.35)", padding: "8px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", textTransform: "capitalize" }}>
              {v === "dashboard" ? "Team dashboard" : v === "submit" ? "My standup" : "Safety insights"}
            </button>
          ))}
        </div>

        {view === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px" }}>
              {[{ label: "Submitted today", value: "3/4" }, { label: "Team safety avg", value: "65" }, { label: "Active blockers", value: "2", alert: true }, { label: "Flags this week", value: "3", alert: true }].map((s, i) => (
                <div key={i} style={{ background: s.alert ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.03)", border: s.alert ? "1px solid rgba(248,113,113,0.18)" : "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "26px", fontWeight: "800", color: s.alert ? "#f87171" : gold, marginBottom: "4px" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {team.map((m) => (
                <div key={m.name} style={{ background: "rgba(255,255,255,0.04)", border: m.flags.length ? "1px solid rgba(248,113,113,0.18)" : "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{m.name}</span>
                        {!m.submitted && <span style={{ fontSize: "10px", background: "rgba(248,113,113,0.12)", color: "#fca5a5", padding: "2px 8px", borderRadius: "999px", fontWeight: "700" }}>Not submitted</span>}
                        {m.flags.map((f, i) => (
                          <span key={i} style={{ fontSize: "10px", background: "rgba(248,113,113,0.1)", color: "#fca5a5", padding: "2px 8px", borderRadius: "999px" }}>⚠ {f}</span>
                        ))}
                      </div>
                      {m.submitted && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <p style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.25)", margin: "0 0 3px" }}>YESTERDAY</p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: "1.5" }}>{m.yesterday}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.25)", margin: "0 0 3px" }}>TODAY</p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: "1.5" }}>{m.today}</p>
                          </div>
                          {m.blockers && (
                            <div style={{ gridColumn: "span 2", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "8px", padding: "10px" }}>
                              <p style={{ fontSize: "10px", fontWeight: "700", color: "#fca5a5", margin: "0 0 3px" }}>BLOCKER</p>
                              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{m.blockers}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontSize: "22px", fontWeight: "800", color: safetyColor(m.safetyScore) }}>{m.safetyScore ?? "–"}</div>
                      <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", fontWeight: "600" }}>SAFETY</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "submit" && (
          <div style={{ maxWidth: "580px" }}>
            {!submitted ? (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "20px", letterSpacing: "0.06em" }}>TODAY'S STANDUP</p>
                {[{ key: "yesterday", label: "What did you work on yesterday?", placeholder: "Describe your work, outcomes, and anything that surprised you..." }, { key: "today", label: "What are you working on today?", placeholder: "Your plan for today..." }, { key: "blockers", label: "Any blockers or things you need? (optional)", placeholder: "Leave blank if none..." }].map((f) => (
                  <div key={f.key} style={{ marginBottom: "18px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>{f.label}</label>
                    <textarea value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      style={{ width: "100%", minHeight: "80px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: "#f8fafc", fontSize: "13px", lineHeight: "1.6", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                ))}
                <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: loading ? "rgba(201,168,76,0.4)" : `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Analysing…" : "Submit standup"}
                </button>
                {error && <p style={{ fontSize: "12px", color: "#f87171", marginTop: "8px", textAlign: "center" }}>{error}</p>}
              </div>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${result?.riskLevel === "high" ? "rgba(248,113,113,0.25)" : "rgba(16,185,129,0.2)"}`, borderRadius: "16px", padding: "32px" }}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>{result?.tone === "positive" ? "✓" : result?.tone === "frustrated" ? "⚠" : "✓"}</div>
                  <h3 style={{ color: "#6ee7b7", fontSize: "18px", fontWeight: "700", margin: "0 0 8px" }}>Standup submitted</h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
                    Psychological safety score: <strong style={{ color: result?.safetyScore >= 75 ? "#6ee7b7" : result?.safetyScore >= 50 ? gold : "#f87171", fontSize: "18px" }}>{result?.safetyScore ?? "—"}</strong>
                  </p>
                </div>
                {result?.insight && (
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: "1.7" }}>{result.insight}</p>
                  </div>
                )}
                {result?.flags && result.flags.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    {result.flags.map((f, i) => (
                      <div key={i} style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "8px 12px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#fca5a5" }}>⚠ {f}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result?.flags?.length === 0 && (
                  <p style={{ fontSize: "12px", color: "#6ee7b7", textAlign: "center", marginBottom: "16px" }}>No flags detected — keep it up.</p>
                )}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => { setSubmitted(false); setResult(null); setForm({ yesterday: "", today: "", blockers: "" }); }} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                    New standup
                  </button>
                  <button onClick={() => setView("dashboard")} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                    View team dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === "insights" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {[{ title: "Safety trend", desc: "Team safety score has dropped 12 points over 3 weeks. Maya and Dev show the steepest decline.", color: "#f87171", icon: "📉" }, { title: "Blocker resolution", desc: "2 blockers have been unresolved for more than 48 hours. Unresolved blockers correlate with frustration signals.", color: gold, icon: "🔒" }, { title: "Participation rate", desc: "Tom has missed 2 consecutive standups without acknowledgement. Non-participation predicts disengagement.", color: "#fb923c", icon: "👻" }, { title: "Positive signal", desc: "Aisha's entries show high agency and ownership language. Peer recognition mentioned twice this week.", color: "#6ee7b7", icon: "✨" }].map((ins, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{ins.icon}</div>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: ins.color, margin: "0 0 6px" }}>{ins.title}</h3>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: "1.6" }}>{ins.desc}</p>
              </div>
            ))}
            <div style={{ gridColumn: "span 2", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "14px", padding: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px" }}>Recommended manager action</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 16px", lineHeight: "1.6" }}>Maya's blocker has been unresolved for 48+ hours and her safety score is declining. A 10-minute 1:1 to acknowledge and unblock will prevent further disengagement.</p>
              <button onClick={() => router.push("/tools/coaching")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                Practice this conversation →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
