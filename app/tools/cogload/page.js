"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const engineers = [
  { name: "Aisha K.", flowScore: 84, interruptions: 2, meetingHours: 3.5, deepWorkHours: 5.2, status: "flow", trend: "stable" },
  { name: "Dev P.", flowScore: 41, interruptions: 11, meetingHours: 6.8, deepWorkHours: 1.1, status: "fragmented", trend: "down" },
  { name: "Maya R.", flowScore: 67, interruptions: 4, meetingHours: 4.0, deepWorkHours: 4.0, status: "moderate", trend: "up" },
  { name: "Tom B.", flowScore: 55, interruptions: 7, meetingHours: 5.2, deepWorkHours: 2.8, status: "moderate", trend: "stable" },
];

const statusColor = (s) => s === "flow" ? "#6ee7b7" : s === "fragmented" ? "#f87171" : gold;
const trendIcon = (t) => t === "up" ? "↑" : t === "down" ? "↓" : "→";
const trendColor = (t) => t === "up" ? "#6ee7b7" : t === "down" ? "#f87171" : gold;

const teamDay = [
  { hour: "9am", load: 30, label: "Morning standup" },
  { hour: "10am", load: 85, label: "Deep work" },
  { hour: "11am", load: 70, label: "Deep work" },
  { hour: "12pm", load: 20, label: "Lunch" },
  { hour: "1pm", load: 55, label: "Reviews" },
  { hour: "2pm", load: 40, label: "Meetings" },
  { hour: "3pm", load: 45, label: "Meetings" },
  { hour: "4pm", load: 72, label: "Deep work" },
  { hour: "5pm", load: 60, label: "Wrap up" },
];

export default function CogLoadTool() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("myday");
  const eng = engineers.find((e) => e.name === selected);

  const [form, setForm] = useState({ meetingHours: "", deepWorkHours: "", interruptions: "", note: "" });
  const [myResult, setMyResult] = useState(null);
  const [myLoading, setMyLoading] = useState(false);
  const [myError, setMyError] = useState(null);

  async function handleAssess() {
    if (!form.meetingHours || !form.deepWorkHours || !form.interruptions) return;
    setMyLoading(true);
    setMyError(null);
    try {
      const res = await fetch("/api/cogload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMyResult(data);
    } catch (e) {
      setMyError(e.message);
    }
    setMyLoading(false);
  }

  const statusColor = (s) => s === "flow" ? "#6ee7b7" : s === "fragmented" ? "#f87171" : gold;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.06em" }}>🏃 DEV COGNITIVE LOAD MONITOR</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Protect flow state for your engineering team</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.7" }}>Track deep work time, interruption frequency, and cognitive load across your team. Surface fragmentation before it hits code quality.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px" }}>
          {[{ label: "Team flow score", value: "62" }, { label: "Avg deep work/day", value: "3.3h" }, { label: "Avg interruptions", value: "6" }, { label: "Fragmented engineers", value: "1", alert: true }].map((s, i) => (
            <div key={i} style={{ background: s.alert ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.03)", border: s.alert ? "1px solid rgba(248,113,113,0.18)" : "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "26px", fontWeight: "800", color: s.alert ? "#f87171" : gold, marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0", marginBottom: "24px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "3px", width: "fit-content" }}>
          {["myday", "team", "day-view", "recommendations"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ background: activeTab === t ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: activeTab === t ? "#f8fafc" : "rgba(255,255,255,0.35)", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
              {t === "myday" ? "My day" : t === "team" ? "Team demo" : t === "day-view" ? "Day heatmap" : "Recommendations"}
            </button>
          ))}
        </div>

        {activeTab === "myday" && (
          <div style={{ maxWidth: "560px" }}>
            {!myResult ? (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "20px", letterSpacing: "0.06em" }}>TODAY'S COGNITIVE LOAD ASSESSMENT</p>
                {[
                  { key: "meetingHours", label: "Meeting hours today", placeholder: "e.g. 3.5", type: "number" },
                  { key: "deepWorkHours", label: "Deep work / focus hours", placeholder: "e.g. 4", type: "number" },
                  { key: "interruptions", label: "Number of interruptions / context switches", placeholder: "e.g. 7", type: "number" },
                ].map((f) => (
                  <div key={f.key} style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: "#f8fafc", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                ))}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>Anything else? (optional)</label>
                  <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. had back-to-back calls, felt scattered after lunch..."
                    style={{ width: "100%", minHeight: "70px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: "#f8fafc", fontSize: "13px", lineHeight: "1.6", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <button onClick={handleAssess} disabled={myLoading} style={{ width: "100%", background: myLoading ? "rgba(201,168,76,0.4)" : `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: myLoading ? "not-allowed" : "pointer" }}>
                  {myLoading ? "Analysing your day…" : "Analyse my cognitive load"}
                </button>
                {myError && <p style={{ fontSize: "12px", color: "#f87171", marginTop: "8px", textAlign: "center" }}>{myError}</p>}
              </div>
            ) : (
              <div>
                <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${myResult.status === "fragmented" ? "rgba(248,113,113,0.25)" : myResult.status === "flow" ? "rgba(110,231,183,0.25)" : "rgba(201,168,76,0.25)"}`, borderRadius: "16px", padding: "28px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 4px", letterSpacing: "0.06em" }}>FLOW SCORE</p>
                      <div style={{ fontSize: "48px", fontWeight: "800", color: statusColor(myResult.status), lineHeight: 1 }}>{myResult.flowScore}</div>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: statusColor(myResult.status), background: `${statusColor(myResult.status)}18`, padding: "6px 16px", borderRadius: "999px", border: `1px solid ${statusColor(myResult.status)}44` }}>
                      {myResult.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: "1.7" }}>{myResult.summary}</p>
                  {myResult.warning && (
                    <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "10px", marginTop: "12px" }}>
                      <p style={{ fontSize: "12px", color: "#fca5a5", margin: 0 }}>⚠ {myResult.warning}</p>
                    </div>
                  )}
                </div>
                {myResult.recommendations && (
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>RECOMMENDATIONS FOR TOMORROW</p>
                    {myResult.recommendations.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "start", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ color: gold, fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>{i + 1}.</span>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: "1.6" }}>{r}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => { setMyResult(null); setForm({ meetingHours: "", deepWorkHours: "", interruptions: "", note: "" }); }}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                  Assess another day
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "team" && (
          <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 300px" : "1fr", gap: "20px", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {engineers.map((e) => (
                <div key={e.name} onClick={() => setSelected(selected === e.name ? null : e.name)}
                  style={{ background: selected === e.name ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)", border: selected === e.name ? "1px solid rgba(201,168,76,0.3)" : e.status === "fragmented" ? "1px solid rgba(248,113,113,0.2)" : "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: gold }}>
                        {e.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", margin: "0 0 2px" }}>{e.name}</p>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: statusColor(e.status), background: `${statusColor(e.status)}18`, padding: "1px 8px", borderRadius: "999px" }}>{e.status}</span>
                          <span style={{ fontSize: "11px", color: trendColor(e.trend) }}>{trendIcon(e.trend)}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", textAlign: "center" }}>
                      {[{ label: "Flow", value: e.flowScore }, { label: "Deep work", value: `${e.deepWorkHours}h` }, { label: "Interruptions", value: e.interruptions }].map((m, i) => (
                        <div key={i}>
                          <div style={{ fontSize: "16px", fontWeight: "700", color: i === 0 ? statusColor(e.status) : i === 2 && e.interruptions > 8 ? "#f87171" : "rgba(255,255,255,0.7)" }}>{m.value}</div>
                          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selected && eng && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px" }}>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>DETAIL — {eng.name.toUpperCase()}</p>
                  {[{ label: "Flow score", value: eng.flowScore, color: statusColor(eng.status) }, { label: "Deep work hours", value: `${eng.deepWorkHours}h`, color: eng.deepWorkHours >= 4 ? "#6ee7b7" : gold }, { label: "Meeting hours", value: `${eng.meetingHours}h`, color: eng.meetingHours > 5 ? "#f87171" : "rgba(255,255,255,0.6)" }, { label: "Interruptions", value: eng.interruptions, color: eng.interruptions > 8 ? "#f87171" : eng.interruptions > 4 ? gold : "#6ee7b7" }].map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{m.label}</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: m.color }}>{m.value}</span>
                    </div>
                  ))}
                  {eng.status === "fragmented" && (
                    <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "10px", marginTop: "8px" }}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: "#fca5a5", margin: "0 0 4px" }}>FRAGMENTATION ALERT</p>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: "1.5" }}>11 interruptions with only 1.1h deep work. This pattern correlates with defect rate increases in 78% of cases.</p>
                    </div>
                  )}
                </div>
                <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "14px", padding: "16px" }}>
                  <button onClick={() => router.push("/pricing")} style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "11px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                    Upgrade for full alerts
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "day-view" && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "20px", letterSpacing: "0.06em" }}>TEAM COGNITIVE LOAD — TODAY</p>
            <div style={{ display: "flex", gap: "8px", alignItems: "end", height: "140px", marginBottom: "8px" }}>
              {teamDay.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ width: "100%", background: h.load >= 70 ? "#6ee7b7" : h.load >= 45 ? gold : "rgba(255,255,255,0.15)", borderRadius: "4px 4px 0 0", height: `${h.load}%`, minHeight: "4px" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {teamDay.map((h, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>{h.hour}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
              {[{ color: "#6ee7b7", label: "High flow (70%+)" }, { color: gold, label: "Moderate (45–69%)" }, { color: "rgba(255,255,255,0.15)", label: "Low load (<45%)" }].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: l.color }} />
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "16px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "8px", padding: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#fca5a5", margin: "0 0 4px" }}>SCHEDULING INSIGHT</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: "1.6" }}>2–3pm shows a 2.3h meeting block for Dev P. — overlapping with their peak cognitive window. Suggest moving to post-4pm or async where possible.</p>
            </div>
          </div>
        )}

        {activeTab === "recommendations" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[{ icon: "🚫", title: "Protect 10am–12pm as deep work", priority: "High", desc: "This 2-hour window is when your team's focus scores are highest. Block it from recurring meetings across all calendars.", impact: "Est. +1.4h deep work/engineer/day" }, { icon: "📅", title: "Move team syncs to post-3pm", priority: "High", desc: "Moving standups and planning meetings to 3–4pm reduces cognitive switching during peak creative hours.", impact: "Est. +22% flow score improvement" }, { icon: "💬", title: "Set async-first norms for Slack", priority: "Medium", desc: "Dev P. is averaging 11 interruptions per day. Introducing response-time windows (e.g. within 90 minutes) reduces context-switching.", impact: "Est. –6 interruptions/day for fragmented engineers" }, { icon: "📊", title: "Review Dev P.'s sprint load", priority: "High", desc: "Dev P. shows the highest meeting-to-deep-work ratio on the team (6:1). This is unsustainable and is reflected in their defect rate.", impact: "Flag for 1:1 conversation with manager" }].map((r, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${r.priority === "High" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: "14px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "14px" }}>
                  <span style={{ fontSize: "24px", flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>{r.title}</h3>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: r.priority === "High" ? gold : "rgba(255,255,255,0.4)", background: r.priority === "High" ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "999px" }}>{r.priority}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px", lineHeight: "1.6" }}>{r.desc}</p>
                    <span style={{ fontSize: "11px", color: "#6ee7b7", fontWeight: "600" }}>{r.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
