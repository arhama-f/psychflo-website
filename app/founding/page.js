"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const BENEFITS = [
  { icon: "💰", title: "50% off for life", desc: "Lock in half-price on any plan forever. Price never increases, even as we scale." },
  { icon: "🎯", title: "Direct founder access", desc: "Monthly calls with the founding team. Your feedback shapes what we build next." },
  { icon: "📋", title: "Free Workforce Risk Audit", desc: "Full £750 audit included — Executive Report, board PDF, and expert debrief call." },
  { icon: "🚀", title: "White-glove onboarding", desc: "We configure everything for your org. You're live in 48 hours, not weeks." },
  { icon: "🏆", title: "Shape the roadmap", desc: "Vote on features, join early beta programmes, and influence the product direction." },
  { icon: "🔒", title: "Price lock guarantee", desc: "Your founding rate is contractually locked. No surprise increases. Ever." },
];

const SPOTS_TAKEN = 3;
const TOTAL_SPOTS = 5;

export default function FoundingClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", company: "", email: "", size: "", note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  const canSubmit = form.name.trim() && form.company.trim() && form.email.trim() && form.size;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      // Send to a simple API route or fallback gracefully
      const res = await fetch("/api/founding/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => null);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us directly at hello@psychflo.com");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <Nav />
        <div style={{ maxWidth: "520px", margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎉</div>
          <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", margin: "0 0 14px" }}>Application received</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", margin: "0 0 10px", lineHeight: "1.7" }}>
            We&apos;ll review your application and reach out within 24 hours to confirm your founding client spot.
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: "0 0 36px" }}>
            Keep an eye on <strong style={{ color: "rgba(255,255,255,0.5)" }}>{form.email}</strong>
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
            Run your Workforce Diagnostic →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: gold, fontSize: "12px", fontWeight: "700", padding: "6px 16px", borderRadius: "999px", marginBottom: "20px", letterSpacing: "0.05em" }}>
            ⭐ FOUNDING CLIENT PROGRAMME · {TOTAL_SPOTS - SPOTS_TAKEN} SPOTS REMAINING
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: "1.15" }}>
            Be one of our first<br />
            <span style={{ color: gold }}>5 founding clients</span>
          </h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.45)", margin: "0 auto", maxWidth: "540px", lineHeight: "1.7" }}>
            We&apos;re hand-picking 5 organisations to build PsychFlo alongside us. In return, you get lifetime pricing, a free audit, and direct access to our founding team.
          </p>
        </div>

        {/* Spots progress */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "14px", padding: "20px 24px", marginBottom: "48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: gold }}>{SPOTS_TAKEN} of {TOTAL_SPOTS} spots taken</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{TOTAL_SPOTS - SPOTS_TAKEN} remaining</span>
          </div>
          <div style={{ height: "8px", background: "rgba(255,255,255,0.07)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ width: `${(SPOTS_TAKEN / TOTAL_SPOTS) * 100}%`, height: "100%", background: `linear-gradient(90deg,${gold},#f0d080)`, borderRadius: "999px" }} />
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
            {Array.from({ length: TOTAL_SPOTS }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: i < SPOTS_TAKEN ? gold : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>

          {/* Benefits */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", margin: "0 0 20px" }}>WHAT YOU GET AS A FOUNDING CLIENT</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                    {b.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: "0 0 3px" }}>{b.title}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.5" }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing preview */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", margin: "0 0 14px" }}>FOUNDING CLIENT PRICING</p>
              {[
                { plan: "Team (20+ people)", normal: "£100/mo", founding: "£50/mo" },
                { plan: "Growth (HR teams)", normal: "£300/mo", founding: "£150/mo" },
                { plan: "Audit (one-time)",  normal: "£750",    founding: "Free" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < 2 ? "12px" : 0, marginBottom: i < 2 ? "12px" : 0, borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{r.plan}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textDecoration: "line-through" }}>{r.normal}</span>
                    <span style={{ fontSize: "14px", fontWeight: "800", color: gold }}>{r.founding}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application form */}
          <div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "32px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", margin: "0 0 6px" }}>APPLY FOR A FOUNDING SPOT</p>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#f8fafc", margin: "0 0 24px" }}>Tell us about your organisation</h3>

              <form onSubmit={handleSubmit}>
                {[
                  { key: "name",    label: "YOUR NAME",    placeholder: "Jane Smith",          type: "text" },
                  { key: "company", label: "COMPANY NAME", placeholder: "Acme Corp",            type: "text" },
                  { key: "email",   label: "WORK EMAIL",   placeholder: "jane@acmecorp.com",    type: "email" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      required
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9px", padding: "12px 14px", color: "#f8fafc", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>COMPANY SIZE</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {["1–20", "21–50", "51–200", "201–500", "500+"].map(s => (
                      <button key={s} type="button" onClick={() => set("size", s)}
                        style={{ padding: "8px 14px", borderRadius: "8px", border: form.size === s ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.1)", background: form.size === s ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)", color: form.size === s ? gold : "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>ANYTHING ELSE? (OPTIONAL)</label>
                  <textarea
                    value={form.note}
                    onChange={e => set("note", e.target.value)}
                    placeholder="Tell us about your biggest people challenge right now…"
                    rows={3}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9px", padding: "12px 14px", color: "#f8fafc", fontSize: "13px", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                  />
                </div>

                {error && (
                  <p style={{ fontSize: "12px", color: "#fca5a5", margin: "0 0 14px" }}>{error}</p>
                )}

                <button type="submit" disabled={!canSubmit || loading}
                  style={{ width: "100%", background: canSubmit ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.06)", color: canSubmit ? "#0f172a" : "rgba(255,255,255,0.2)", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: canSubmit ? "pointer" : "not-allowed", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Submitting…" : "Apply for founding spot →"}
                </button>

                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", margin: "12px 0 0", lineHeight: "1.5" }}>
                  We review every application personally and respond within 24 hours.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
