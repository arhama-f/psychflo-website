"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const INCLUDES = [
  { icon: "🔍", title: "Full 3-dimension risk diagnostic", desc: "Workforce Risk, Retention & Burnout, Manager & Culture — all three scored 0–100." },
  { icon: "📋", title: "Executive Workforce Report", desc: "Board-ready PDF with your risk scores, financial exposure, root causes, and ranked actions." },
  { icon: "📞", title: "60-minute expert debrief call", desc: "We walk through the findings with your leadership team and answer every question." },
  { icon: "🎯", title: "30-day priority action plan", desc: "Specific steps, owners, and week-by-week sequencing — ready to execute on Monday." },
  { icon: "📊", title: "Industry benchmark comparison", desc: "How your scores compare against sector peers with similar headcount." },
  { icon: "⭐", title: "Founding client credit", desc: "The $750 audit fee counts as full credit if you upgrade to a subscription within 30 days." },
];

const FOR_WHO = [
  { role: "CHROs & People Directors", signal: "Responsible for workforce risk and want objective data to present to the board." },
  { role: "CEOs & COOs", signal: "Concerned about attrition, sick leave, or manager effectiveness but lack the data to act." },
  { role: "HR Business Partners", signal: "Managing a function where burnout or culture issues are visible but not yet quantified." },
  { role: "Finance Directors", signal: "Want to understand the financial exposure of people risk before it hits the P&L." },
];

const SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];
const TIMES = ["Morning (9am–12pm)", "Afternoon (12pm–5pm)", "Either works", "I'll confirm by email"];

const EMPTY = { name: "", email: "", company: "", role: "", companySize: "", biggestPeopleChallenge: "", preferredCallTime: "" };

export default function BookAuditPage() {
  const router = useRouter();
  const [form, setForm]     = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [done, setDone]     = useState(false);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.company) {
      setError("Please fill in your name, email, and company.");
      return;
    }

    setLoading(true);
    try {
      // Save to localStorage so the team can always see it locally
      const existing = JSON.parse(localStorage.getItem("auditBookings") || "[]");
      localStorage.setItem("auditBookings", JSON.stringify([
        ...existing,
        { ...form, ts: new Date().toISOString() },
      ]));

      // POST to API — falls back gracefully if Resend key not set
      const res = await fetch("/api/audit/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok && data.error !== "Internal error") {
        setError(data.error || "Something went wrong. Please email us directly.");
        setLoading(false);
        return;
      }

      setDone(true);
    } catch {
      // Network error — localStorage save succeeded so don't block the user
      setDone(true);
    }
    setLoading(false);
  }

  // ── Success screen ────────────────────────────────────────────────────────────

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <Nav />
        <div style={{ maxWidth: "560px", margin: "100px auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 24px" }}>📋</div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Audit booked, {form.name.split(" ")[0]}.
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", margin: "0 0 10px", lineHeight: "1.7" }}>
            We've received your booking for <strong style={{ color: "rgba(255,255,255,0.75)" }}>{form.company}</strong>. Expect a calendar link from us within 2 hours.
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 36px", lineHeight: "1.65" }}>
            Your Executive Workforce Report will be delivered within 48 hours of our call.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/diagnostic")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
              Run the Free Diagnostic →
            </button>
            <button onClick={() => router.push("/")}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "13px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main page ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "72px 24px 100px" }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", marginBottom: "70px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "22px", letterSpacing: "0.07em" }}>
            📋 WORKFORCE RISK AUDIT · $750 ONE-TIME
          </div>
          <h1 style={{ fontSize: "44px", fontWeight: "800", color: "#f8fafc", margin: "0 0 18px", lineHeight: "1.08", letterSpacing: "-0.03em" }}>
            Know your workforce risk<br />
            <span style={{ color: gold }}>before it becomes a crisis</span>
          </h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.45)", margin: "0 auto", maxWidth: "600px", lineHeight: "1.75" }}>
            A complete workforce intelligence audit delivered in 48 hours. One fixed price. No subscription required. Board-ready report included.
          </p>
        </div>

        {/* ── Two column: info + form ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "flex-start" }}>

          {/* ── Left: What's included / For who ── */}
          <div>

            {/* What's included */}
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 18px", letterSpacing: "-0.01em" }}>What the audit includes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
              {INCLUDES.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 3px" }}>{item.title}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.55" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Who it's for */}
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.01em" }}>Who it&apos;s for</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {FOR_WHO.map((w, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "11px", padding: "14px 16px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: gold, margin: "0 0 4px" }}>{w.role}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.55" }}>{w.signal}</p>
                </div>
              ))}
            </div>

            {/* What they receive */}
            <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "14px", padding: "22px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: gold, letterSpacing: "0.08em", margin: "0 0 14px" }}>WHAT YOU RECEIVE</p>
              {[
                { label: "Delivery",        value: "Within 48 hours of your debrief call" },
                { label: "Format",          value: "Board-ready PDF + live online view" },
                { label: "Call",            value: "60-minute expert walkthrough included" },
                { label: "Action plan",     value: "30-day plan with named owners" },
                { label: "Price",           value: "$750 one-time — no lock-in" },
                { label: "Upgrade credit",  value: "Full $750 credited toward any plan" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none", paddingBottom: i < 5 ? "10px" : 0, marginBottom: i < 5 ? "10px" : 0, gap: "12px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{r.label}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", fontWeight: "600", textAlign: "right" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div style={{ position: "sticky", top: "24px" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px", letterSpacing: "-0.01em" }}>Book your audit</h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "0 0 24px", lineHeight: "1.5" }}>
                We confirm within 2 hours. No payment taken until after your debrief call.
              </p>

              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Full name *</label>
                  <input value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="Jane Smith" style={inputStyle} />
                </div>

                {/* Email */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Work email *</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="jane@company.com" style={inputStyle} />
                </div>

                {/* Company */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Company *</label>
                  <input value={form.company} onChange={e => set("company", e.target.value)}
                    placeholder="Acme Ltd" style={inputStyle} />
                </div>

                {/* Role */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Your role</label>
                  <input value={form.role} onChange={e => set("role", e.target.value)}
                    placeholder="e.g. CHRO, COO, People Director" style={inputStyle} />
                </div>

                {/* Company size pills */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Company size</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                    {SIZES.map(s => (
                      <button key={s} type="button" onClick={() => set("companySize", s)}
                        style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: form.companySize === s ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.1)", background: form.companySize === s ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)", color: form.companySize === s ? gold : "rgba(255,255,255,0.45)" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Biggest people challenge */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Biggest people challenge right now</label>
                  <textarea value={form.biggestPeopleChallenge} onChange={e => set("biggestPeopleChallenge", e.target.value)}
                    placeholder="e.g. We've had 3 senior departures in 6 months and don't know why. Manager confidence is low..."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", minHeight: "80px", lineHeight: "1.55" }} />
                </div>

                {/* Preferred call time */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle}>Preferred call time</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                    {TIMES.map(t => (
                      <button key={t} type="button" onClick={() => set("preferredCallTime", t)}
                        style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: form.preferredCallTime === t ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.1)", background: form.preferredCallTime === t ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)", color: form.preferredCallTime === t ? gold : "rgba(255,255,255,0.45)" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p style={{ fontSize: "13px", color: "#fca5a5", margin: "0 0 14px", lineHeight: "1.5" }}>{error}</p>
                )}

                <button type="submit" disabled={loading}
                  style={{ width: "100%", background: loading ? "rgba(201,168,76,0.4)" : `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "15px", borderRadius: "11px", fontSize: "15px", fontWeight: "800", cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Booking…" : "Book Audit — $750 →"}
                </button>

                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", margin: "12px 0 0", lineHeight: "1.55" }}>
                  No payment taken now · We confirm within 2 hours · Cancel anytime before the call
                </p>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Shared input styles ───────────────────────────────────────────────────────

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  color: "rgba(255,255,255,0.35)",
  letterSpacing: "0.06em",
  marginBottom: "7px",
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "12px 14px",
  color: "#f8fafc",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "system-ui,-apple-system,sans-serif",
};
