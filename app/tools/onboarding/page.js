"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const hires = [
  { name: "Sarah Chen", role: "Senior Engineer", day: 67, score: 82, trend: "up", risk: "low", flags: [] },
  { name: "Marcus Webb", role: "Product Manager", day: 45, score: 54, trend: "down", risk: "medium", flags: ["Psychological safety dropping", "2 missed check-ins"] },
  { name: "Priya Nair", role: "Designer", day: 23, score: 71, trend: "stable", risk: "low", flags: [] },
  { name: "Tom Baines", role: "Data Analyst", day: 88, score: 38, trend: "down", risk: "high", flags: ["Disengagement signal", "Low belonging score", "Manager flagged"] },
];

const checkIns = [
  { day: "Day 7", q: "Do you feel welcomed by your team?", score: 4.2 },
  { day: "Day 14", q: "Do you understand what success looks like in your role?", score: 3.1 },
  { day: "Day 30", q: "Do you feel comfortable asking questions?", score: 3.8 },
  { day: "Day 60", q: "Do you feel like you belong here?", score: 3.4 },
  { day: "Day 90", q: "Are you proud to work at this organisation?", score: 4.0 },
];

const riskColor = (r) => r === "high" ? "#f87171" : r === "medium" ? "#fb923c" : "#6ee7b7";
const trendIcon = (t) => t === "up" ? "↑" : t === "down" ? "↓" : "→";
const trendColor = (t) => t === "up" ? "#6ee7b7" : t === "down" ? "#f87171" : gold;

const checkInQuestions = [
  "Do you feel welcomed by your team?",
  "Do you understand what success looks like in your role?",
  "Do you feel comfortable asking questions or raising concerns?",
  "Do you feel like you belong here?",
  "Do you have the tools and support you need to do your job?",
];

export default function OnboardingTool() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("checkin");
  const hire = hires.find((h) => h.name === selected);

  const [checkInForm, setCheckInForm] = useState({ role: "", dayNumber: "", scores: Array(checkInQuestions.length).fill(3) });
  const [checkInResult, setCheckInResult] = useState(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInError, setCheckInError] = useState(null);

  async function handleCheckIn() {
    setCheckInLoading(true);
    setCheckInError(null);
    try {
      const answers = checkInQuestions.map((q, i) => ({ question: q, score: checkInForm.scores[i] }));
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, role: checkInForm.role, dayNumber: checkInForm.dayNumber }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCheckInResult(data);
    } catch (e) {
      setCheckInError(e.message);
    }
    setCheckInLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.06em" }}>📊 ONBOARDING ANALYTICS</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>90-day psychological safety tracker</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.7" }}>Monitor every new hire's belonging, safety, and engagement through their first 90 days — automatically.</p>
        </div>

        <div style={{ display: "flex", gap: "0", marginBottom: "28px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "3px", width: "fit-content" }}>
          {["checkin", "demo"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ background: activeTab === t ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: activeTab === t ? "#f8fafc" : "rgba(255,255,255,0.35)", padding: "8px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
              {t === "checkin" ? "New hire check-in" : "Team demo"}
            </button>
          ))}
        </div>

        {activeTab === "checkin" && (
          <div style={{ maxWidth: "580px" }}>
            {!checkInResult ? (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "20px", letterSpacing: "0.06em" }}>ONBOARDING PULSE CHECK</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>Role / job title</label>
                    <input value={checkInForm.role} onChange={(e) => setCheckInForm({ ...checkInForm, role: e.target.value })} placeholder="e.g. Software Engineer"
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: "#f8fafc", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px" }}>Which day of onboarding?</label>
                    <input type="number" value={checkInForm.dayNumber} onChange={(e) => setCheckInForm({ ...checkInForm, dayNumber: e.target.value })} placeholder="e.g. 30"
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: "#f8fafc", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                </div>
                <p style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>Rate each statement 1 (strongly disagree) → 5 (strongly agree)</p>
                {checkInQuestions.map((q, i) => (
                  <div key={i} style={{ marginBottom: "18px" }}>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: "0 0 8px", lineHeight: "1.5" }}>{q}</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => {
                          const s = [...checkInForm.scores]; s[i] = n;
                          setCheckInForm({ ...checkInForm, scores: s });
                        }} style={{ flex: 1, padding: "8px 0", borderRadius: "8px", border: checkInForm.scores[i] === n ? `2px solid ${gold}` : "1px solid rgba(255,255,255,0.12)", background: checkInForm.scores[i] === n ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)", color: checkInForm.scores[i] === n ? gold : "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={handleCheckIn} disabled={checkInLoading} style={{ width: "100%", background: checkInLoading ? "rgba(201,168,76,0.4)" : `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: checkInLoading ? "not-allowed" : "pointer", marginTop: "4px" }}>
                  {checkInLoading ? "Analysing…" : "Get my wellbeing analysis"}
                </button>
                {checkInError && <p style={{ fontSize: "12px", color: "#f87171", marginTop: "8px", textAlign: "center" }}>{checkInError}</p>}
              </div>
            ) : (
              <div>
                <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${checkInResult.riskLevel === "high" ? "rgba(248,113,113,0.3)" : checkInResult.riskLevel === "medium" ? "rgba(251,146,60,0.3)" : "rgba(110,231,183,0.3)"}`, borderRadius: "16px", padding: "28px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 4px", letterSpacing: "0.06em" }}>ONBOARDING SAFETY SCORE</p>
                      <div style={{ fontSize: "48px", fontWeight: "800", color: checkInResult.riskLevel === "high" ? "#f87171" : checkInResult.riskLevel === "medium" ? "#fb923c" : "#6ee7b7", lineHeight: 1 }}>{checkInResult.safetyScore}</div>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "6px 16px", borderRadius: "999px", background: checkInResult.riskLevel === "high" ? "rgba(248,113,113,0.12)" : checkInResult.riskLevel === "medium" ? "rgba(251,146,60,0.12)" : "rgba(110,231,183,0.12)", color: checkInResult.riskLevel === "high" ? "#f87171" : checkInResult.riskLevel === "medium" ? "#fb923c" : "#6ee7b7" }}>
                      {checkInResult.riskLevel?.toUpperCase()} RISK
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: "1.7" }}>{checkInResult.insight}</p>
                </div>
                {checkInResult.flags?.length > 0 && (
                  <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "#fca5a5", margin: "0 0 10px", letterSpacing: "0.06em" }}>FLAGS</p>
                    {checkInResult.flags.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                        <span style={{ color: "#f87171" }}>⚠</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
                {checkInResult.managerAction && (
                  <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: gold, margin: "0 0 6px", letterSpacing: "0.06em" }}>RECOMMENDED MANAGER ACTION</p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: "1.6" }}>{checkInResult.managerAction}</p>
                  </div>
                )}
                <button onClick={() => { setCheckInResult(null); setCheckInForm({ role: "", dayNumber: "", scores: Array(checkInQuestions.length).fill(3) }); }}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                  New check-in
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "demo" && (
        <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
          {[{ label: "Active new hires", value: "4" }, { label: "Avg safety score", value: "61" }, { label: "At risk", value: "1", alert: true }, { label: "Completed 90 days", value: "12" }].map((s, i) => (
            <div key={i} style={{ background: s.alert ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.03)", border: s.alert ? "1px solid rgba(248,113,113,0.2)" : "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "18px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: s.alert ? "#f87171" : gold, marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: "20px", alignItems: "start" }}>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "12px", letterSpacing: "0.06em" }}>NEW HIRE COHORT</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {hires.map((h) => (
                <div key={h.name} onClick={() => setSelected(selected === h.name ? null : h.name)}
                  style={{ background: selected === h.name ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)", border: selected === h.name ? `1px solid rgba(201,168,76,0.3)` : `1px solid ${h.risk === "high" ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: "12px", padding: "18px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: gold }}>
                        {h.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", margin: "0 0 2px" }}>{h.name}</p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{h.role} · Day {h.day}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      {h.flags.length > 0 && (
                        <span style={{ fontSize: "10px", background: "rgba(248,113,113,0.12)", color: "#fca5a5", padding: "2px 8px", borderRadius: "999px", fontWeight: "700" }}>⚠ {h.flags.length} flag{h.flags.length > 1 ? "s" : ""}</span>
                      )}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "20px", fontWeight: "800", color: h.score >= 70 ? "#6ee7b7" : h.score >= 50 ? gold : "#f87171" }}>{h.score}</div>
                        <div style={{ fontSize: "11px", color: trendColor(h.trend), fontWeight: "700" }}>{trendIcon(h.trend)} {h.trend}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>AUTOMATED CHECK-IN SCHEDULE</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {checkIns.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: gold, background: "rgba(201,168,76,0.1)", padding: "3px 8px", borderRadius: "6px", minWidth: "48px", textAlign: "center" }}>{c.day}</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", flex: 1 }}>{c.q}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} style={{ width: "6px", height: "6px", borderRadius: "50%", background: n <= Math.round(c.score) ? gold : "rgba(255,255,255,0.1)" }} />
                      ))}
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginLeft: "4px" }}>{c.score}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selected && hire && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "12px", letterSpacing: "0.06em" }}>HIRE DETAIL — {hire.name.toUpperCase()}</p>
                <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: hire.score >= 70 ? "#6ee7b7" : hire.score >= 50 ? gold : "#f87171" }}>{hire.score}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>Safety score</div>
                  </div>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: gold }}>Day {hire.day}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>of 90</div>
                  </div>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", marginBottom: "14px" }}>
                  <div style={{ height: "100%", width: `${(hire.day / 90) * 100}%`, background: gold, borderRadius: "999px" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Risk level:</span>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: riskColor(hire.risk), background: `${riskColor(hire.risk)}18`, padding: "2px 10px", borderRadius: "999px" }}>{hire.risk.toUpperCase()}</span>
                </div>
                {hire.flags.length > 0 && (
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "#fca5a5", margin: "0 0 8px" }}>FLAGS</p>
                    {hire.flags.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "5px" }}>
                        <span style={{ color: "#f87171" }}>⚠</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
                {hire.flags.length === 0 && (
                  <p style={{ fontSize: "12px", color: "#6ee7b7", margin: 0 }}>✓ No flags — on track</p>
                )}
              </div>
              <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "14px", padding: "18px" }}>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>Full access includes</p>
                {["Unlimited new hire tracking", "Automated Slack/email check-ins", "Manager alert system", "90-day benchmark comparisons", "Cohort trend analysis"].map((f, i) => (
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
        )}

      </div>
    </div>
  );
}
