"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const gold = "#c9a84c";

const MOOD_OPTIONS = [
  { value: 1, emoji: "😔", label: "Struggling" },
  { value: 2, emoji: "😕", label: "Tough" },
  { value: 3, emoji: "😐", label: "Getting by" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Thriving" },
];

const QUESTIONS = [
  { key: "energy",     label: "Energy level",      low: "Drained",      high: "Energised" },
  { key: "workload",   label: "Workload today",     low: "Manageable",   high: "Overwhelming" },
  { key: "connection", label: "Team connection",    low: "Isolated",     high: "Connected" },
];

function SliderQ({ question, value, onChange }) {
  const pct = ((value - 1) / 4) * 100;
  const color = question.key === "workload"
    ? (value <= 2 ? "#10b981" : value <= 3 ? gold : "#ef4444")
    : (value >= 4 ? "#10b981" : value >= 3 ? gold : "#fb923c");

  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc" }}>{question.label}</span>
        <span style={{ fontSize: "22px", fontWeight: "900", color }}>{value}</span>
      </div>
      <input type="range" min="1" max="5" value={value} onChange={e => onChange(parseInt(e.target.value))}
        style={{ width: "100%", appearance: "none", WebkitAppearance: "none", height: "6px", borderRadius: "999px", background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`, cursor: "pointer", outline: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{question.low}</span>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{question.high}</span>
      </div>
    </div>
  );
}

function StreakFlame({ streak }) {
  if (!streak || streak < 2) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "999px", padding: "5px 12px", fontSize: "13px" }}>
      <span>🔥</span>
      <span style={{ fontWeight: "700", color: "#fb923c" }}>{streak} day streak</span>
    </div>
  );
}

export default function PulsePage() {
  const router = useRouter();
  const [step, setStep] = useState("intro"); // intro | mood | sliders | note | result
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(3);
  const [workload, setWorkload] = useState(3);
  const [connection, setConnection] = useState(3);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    // PWA install prompt
    const handler = e => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);

    // Check if already checked in today
    const lastCheckin = localStorage.getItem("pf_last_pulse");
    if (lastCheckin) {
      const last = new Date(lastCheckin);
      const now = new Date();
      if (last.toDateString() === now.toDateString()) setAlreadyDone(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, energy, workload, connection, note }),
      });
      const data = await res.json();
      setResult(data);
      localStorage.setItem("pf_last_pulse", new Date().toISOString());
      setStep("result");
    } catch {
      setResult({ coaching: "Thank you for checking in. Your response has been recorded.", streak: 1 });
      setStep("result");
    }
    setSubmitting(false);
  }

  async function installPWA() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  }

  const bg = "linear-gradient(160deg,#0a0f1e 0%,#0f172a 50%,#1a0a2e 100%)";
  const containerStyle = { minHeight: "100svh", background: bg, fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc", display: "flex", flexDirection: "column", padding: "0" };

  // ── INTRO ──
  if (step === "intro") {
    return (
      <div style={containerStyle}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: `rgba(201,168,76,0.15)`, border: `1px solid rgba(201,168,76,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", marginBottom: "24px" }}>
            💛
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Daily Pulse</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", margin: "0 0 32px", lineHeight: "1.7", maxWidth: "300px" }}>
            30 seconds. How are you doing today? Your responses are confidential and help your team get the support it needs.
          </p>

          {alreadyDone && (
            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", padding: "12px 20px", marginBottom: "20px", fontSize: "13px", color: "#6ee7b7" }}>
              ✓ You&apos;ve already checked in today — but you can update your response.
            </div>
          )}

          <button onClick={() => setStep("mood")}
            style={{ width: "100%", maxWidth: "320px", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px", borderRadius: "14px", fontSize: "16px", fontWeight: "800", cursor: "pointer", marginBottom: "12px" }}>
            Check in now →
          </button>

          {installPrompt && (
            <button onClick={installPWA}
              style={{ width: "100%", maxWidth: "320px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", padding: "14px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginBottom: "12px" }}>
              📲 Add to Home Screen
            </button>
          )}

          <button onClick={() => router.push("/dashboard")}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", padding: "8px" }}>
            Manager dashboard →
          </button>
        </div>
        <div style={{ padding: "16px 24px 32px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", margin: 0 }}>PsychFlo · Your responses are anonymised at team level. We never share individual data.</p>
        </div>
      </div>
    );
  }

  // ── MOOD ──
  if (step === "mood") {
    return (
      <div style={containerStyle}>
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer" }}>← Back</button>
          <div style={{ display: "flex", gap: "6px" }}>
            {["mood", "sliders", "note"].map((s, i) => (
              <div key={i} style={{ width: "24px", height: "3px", borderRadius: "999px", background: step === s || (step === "mood" && i === 0) ? gold : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>
          <div style={{ width: "40px" }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.01em", textAlign: "center" }}>How are you feeling?</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 40px", textAlign: "center" }}>Right now, in this moment.</p>

          <div style={{ display: "flex", gap: "10px", marginBottom: "40px", flexWrap: "wrap", justifyContent: "center" }}>
            {MOOD_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => { setMood(opt.value); setStep("sliders"); }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", background: mood === opt.value ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)", border: `2px solid ${mood === opt.value ? gold : "rgba(255,255,255,0.08)"}`, borderRadius: "16px", padding: "20px 16px", cursor: "pointer", minWidth: "72px", transition: "all 0.15s" }}>
                <span style={{ fontSize: "40px", lineHeight: 1 }}>{opt.emoji}</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: mood === opt.value ? gold : "rgba(255,255,255,0.45)" }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── SLIDERS ──
  if (step === "sliders") {
    return (
      <div style={containerStyle}>
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setStep("mood")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer" }}>← Back</button>
          <div style={{ display: "flex", gap: "6px" }}>
            {["mood", "sliders", "note"].map((s, i) => (
              <div key={i} style={{ width: "24px", height: "3px", borderRadius: "999px", background: i <= 1 ? gold : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>
          <div style={{ width: "40px" }} />
        </div>

        <div style={{ flex: 1, padding: "32px 24px", overflowY: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "40px" }}>{MOOD_OPTIONS.find(m => m.value === mood)?.emoji}</span>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 32px", textAlign: "center", letterSpacing: "-0.01em" }}>A few more questions</h2>

          {QUESTIONS.map(q => (
            <SliderQ key={q.key} question={q}
              value={q.key === "energy" ? energy : q.key === "workload" ? workload : connection}
              onChange={v => q.key === "energy" ? setEnergy(v) : q.key === "workload" ? setWorkload(v) : setConnection(v)} />
          ))}

          <button onClick={() => setStep("note")}
            style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px", borderRadius: "14px", fontSize: "16px", fontWeight: "800", cursor: "pointer", marginTop: "8px" }}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // ── NOTE ──
  if (step === "note") {
    return (
      <div style={containerStyle}>
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setStep("sliders")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer" }}>← Back</button>
          <div style={{ display: "flex", gap: "6px" }}>
            {["mood", "sliders", "note"].map((_, i) => (
              <div key={i} style={{ width: "24px", height: "3px", borderRadius: "999px", background: gold }} />
            ))}
          </div>
          <div style={{ width: "40px" }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px", textAlign: "center", letterSpacing: "-0.01em" }}>Anything on your mind?</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px", textAlign: "center" }}>Optional. Never shared with your manager.</p>

          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What's on your mind today? (optional)"
            maxLength={500} rows={5}
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px", color: "#f8fafc", fontSize: "14px", outline: "none", fontFamily: "inherit", resize: "none", lineHeight: "1.6", boxSizing: "border-box", marginBottom: "16px" }} />

          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "right", margin: "0 0 24px" }}>{note.length}/500</p>

          <button onClick={submit} disabled={submitting}
            style={{ width: "100%", background: submitting ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg,${gold},#f0d080)`, color: submitting ? "rgba(255,255,255,0.4)" : "#0f172a", border: "none", padding: "16px", borderRadius: "14px", fontSize: "16px", fontWeight: "800", cursor: submitting ? "default" : "pointer" }}>
            {submitting ? "Saving…" : "Submit check-in →"}
          </button>

          <button onClick={submit} disabled={submitting}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", padding: "16px", marginTop: "4px" }}>
            Skip and submit
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (step === "result") {
    const moodEmoji = MOOD_OPTIONS.find(m => m.value === mood)?.emoji || "💛";
    return (
      <div style={containerStyle}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{moodEmoji}</div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <StreakFlame streak={result?.streak} />
          </div>
          <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Check-in complete</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>Your response has been recorded anonymously.</p>

          {result?.coaching && (
            <div style={{ background: "rgba(201,168,76,0.07)", border: `1px solid rgba(201,168,76,0.2)`, borderRadius: "16px", padding: "22px", marginBottom: "28px", maxWidth: "340px", textAlign: "left" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: gold, margin: "0 0 10px", letterSpacing: "0.06em" }}>YOUR AI COACH</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: "1.7" }}>{result.coaching}</p>
            </div>
          )}

          {installPrompt && (
            <button onClick={installPWA}
              style={{ width: "100%", maxWidth: "320px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", padding: "14px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginBottom: "12px" }}>
              📲 Add PsychFlo to Home Screen
            </button>
          )}

          <button onClick={() => setStep("intro")}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", padding: "8px" }}>
            Done
          </button>
        </div>
        <div style={{ padding: "16px 24px 32px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", margin: "0 0 8px" }}>Come back tomorrow to keep your streak going.</p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.1)", margin: 0 }}>Your note is private — never visible to managers or HR.</p>
        </div>
      </div>
    );
  }

  return null;
}
