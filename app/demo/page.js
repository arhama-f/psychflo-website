"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const OUTCOMES = [
  { icon: "📉", title: "Reduce turnover by 31%", desc: "Pilot companies report 31% fewer resignations in the 12 months after deploying PsychFlo" },
  { icon: "⚡", title: "18-day early warning", desc: "Detect burnout signals an average of 18 days before a crisis — when intervention still works" },
  { icon: "💬", title: "Managers have the conversation", desc: "87% of managers say AI scripts gave them confidence to have difficult wellbeing conversations" },
  { icon: "📊", title: "Board-ready reporting", desc: "One-click executive reports that justify the people investment to your CFO and board" },
];

const AGENDA = [
  { time: "0–5 min", item: "Live demo of the burnout check-in (you'll take it yourself)" },
  { time: "5–12 min", item: "Manager dashboard walkthrough — predictive scores, risk map, AI scripts" },
  { time: "12–17 min", item: "How a 90-day pilot works + what data you get" },
  { time: "17–20 min", item: "Pricing, integration, and your questions" },
];

export default function DemoPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "", role: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return;
    setLoading(true);

    try {
      await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => null); // fire and forget
    } catch { /* non-fatal */ }

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 600);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />

      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "64px 24px" }}>

        {!submitted ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>

            {/* Left — sell the demo */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "999px", padding: "5px 14px", marginBottom: "20px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: gold, letterSpacing: "0.08em" }}>BOOK A 20-MINUTE DEMO</span>
              </div>
              <h1 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: "900", color: "#f8fafc", margin: "0 0 16px", lineHeight: 1.15 }}>
                See how PsychFlo<br />
                <span style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  protects your team
                </span>
              </h1>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", margin: "0 0 32px", lineHeight: 1.7 }}>
                A live 20-minute walkthrough tailored to your industry and team size. No slides. You'll see real data, take the check-in yourself, and leave with a burnout cost estimate for your organisation.
              </p>

              {/* Outcomes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
                {OUTCOMES.map((o, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "22px", flexShrink: 0 }}>{o.icon}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", marginBottom: "3px" }}>{o.title}</div>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{o.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Agenda */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: "14px" }}>WHAT WE COVER</div>
                {AGENDA.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: i < AGENDA.length - 1 ? "12px" : 0 }}>
                    <span style={{ fontSize: "11px", color: gold, fontWeight: "700", flexShrink: 0, minWidth: "60px" }}>{a.time}</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{a.item}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "20px" }}>
                <button onClick={() => router.push("/tools/burnout")}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", padding: 0 }}>
                  Just want to explore first? → See pricing and book a demo
                </button>
              </div>
            </div>

            {/* Right — form */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#f8fafc", margin: "0 0 6px" }}>Request a demo</h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "0 0 24px" }}>We'll confirm within 2 hours during business hours.</p>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  {[
                    { key: "name", label: "Your name", placeholder: "Sarah Chen", type: "text" },
                    { key: "email", label: "Work email", placeholder: "sarah@company.com", type: "email" },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>{label}</label>
                      <input type={type} placeholder={placeholder} value={form[key]} onChange={e => update(key, e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: "#f8fafc", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>Company name</label>
                  <input type="text" placeholder="Acme Corp" value={form.company} onChange={e => update("company", e.target.value)}
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: "#f8fafc", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>Team size</label>
                    <select value={form.size} onChange={e => update("size", e.target.value)}
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: form.size ? "#f8fafc" : "rgba(255,255,255,0.3)", fontSize: "13px", outline: "none", boxSizing: "border-box" }}>
                      <option value="">Select...</option>
                      <option value="10-49">10–49</option>
                      <option value="50-199">50–199</option>
                      <option value="200-499">200–499</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>Your role</label>
                    <select value={form.role} onChange={e => update("role", e.target.value)}
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: form.role ? "#f8fafc" : "rgba(255,255,255,0.3)", fontSize: "13px", outline: "none", boxSizing: "border-box" }}>
                      <option value="">Select...</option>
                      <option value="HR Director">HR Director</option>
                      <option value="CHRO">CHRO / CPO</option>
                      <option value="People Manager">People Manager</option>
                      <option value="CEO / Founder">CEO / Founder</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>What's your biggest challenge right now? (optional)</label>
                  <textarea placeholder="e.g. High turnover in our tech team, manager confidence on wellbeing conversations..." value={form.message} onChange={e => update("message", e.target.value)} rows={3}
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", color: "#f8fafc", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                </div>

                <button type="submit" disabled={!form.name || !form.email || !form.company || loading}
                  style={{ width: "100%", background: form.name && form.email && form.company ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.06)", color: form.name && form.email && form.company ? "#0f172a" : "rgba(255,255,255,0.3)", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: form.name && form.email && form.company ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                  {loading ? "Sending..." : "Request demo →"}
                </button>

                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", margin: "12px 0 0", lineHeight: 1.6 }}>
                  No sales pressure. We'll send a calendar link and you pick a time.
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: "56px", marginBottom: "24px" }}>🎉</div>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px" }}>You're on the list</h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", margin: "0 0 32px", lineHeight: 1.7 }}>
              We'll send a calendar link to <strong style={{ color: "#f8fafc" }}>{form.email}</strong> within 2 hours.<br />
              While you wait, you can review the plans or try 1 HR policy page for free.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
              <button onClick={() => router.push("/tools/policy")}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
                Try 1 HR policy page free →
              </button>
              <button onClick={() => router.push("/roi")}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "13px", cursor: "pointer", padding: "8px" }}>
                Calculate your burnout cost first
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
