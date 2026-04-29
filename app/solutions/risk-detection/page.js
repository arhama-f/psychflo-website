"use client";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";
const red = "#fca5a5";
const redBg = "rgba(239,68,68,0.06)";
const redBorder = "rgba(239,68,68,0.18)";

const DETECTS = [
  { signal: "HR policy language that creates tribunal exposure", example: "Disciplinary clauses that contradict 2024 employment law amendments" },
  { signal: "Compliance gaps against ISO 45003 and UK HSE frameworks", example: "Missing psychological safety obligations in employee handbooks" },
  { signal: "New hire disengagement in the first 90 days", example: "Onboarding satisfaction dropping below threshold at week 6" },
  { signal: "Team communication patterns signalling conflict or safety deterioration", example: "Blocker language and frustration signals in async standups over 3+ weeks" },
  { signal: "Attrition signals before resignation decisions are made", example: "Declining engagement scores combined with low cognitive load index" },
  { signal: "Comprehension failures in critical people documents", example: "Policy language scoring below readability threshold for non-legal audiences" },
];

const IMPACT = [
  { value: "£30k–£100k", label: "Average employment tribunal award", icon: "⚖️" },
  { value: "£56bn",       label: "Annual UK cost of poor mental health at work", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { value: "6–12 wks",   label: "Earlier detection vs reactive discovery", icon: "⏱️" },
  { value: "119×",        label: "ROI on proactive policy review", icon: "📈" },
];

const OUTPUTS = [
  {
    label: "Risk Score",
    title: "Workforce Risk Score: 78/100",
    desc: "High Risk — Immediate action recommended",
    color: red,
    items: ["Policy compliance: 3 critical gaps identified", "Tribunal exposure: estimated £45,000", "Onboarding risk: 2 of 4 recent hires disengaging"],
  },
  {
    label: "Compliance Report",
    title: "ISO 45003 Gap Analysis",
    desc: "Audit-ready evidence pack with remediation steps",
    color: gold,
    items: ["12 clauses assessed", "4 gaps requiring immediate remediation", "Evidence pack downloadable as PDF"],
  },
  {
    label: "Action Plan",
    title: "30-Day Risk Reduction Plan",
    desc: "Specific steps, owners, and deadlines",
    color: "#6ee7b7",
    items: ["Week 1: Update disciplinary policy language", "Week 2: Run onboarding safety check-ins", "Week 3: Generate compliance evidence pack"],
  },
];

export default function RiskDetectionPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 80px" }}>

        {/* ── Hero ── */}
        <section style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: redBg, border: `1px solid ${redBorder}`, color: red, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "24px", letterSpacing: "0.07em" }}>
            ⚠️ WORKFORCE RISK DETECTION
          </div>
          <h1 style={{ fontSize: "46px", fontWeight: "800", color: "#f8fafc", margin: "0 0 20px", lineHeight: "1.08", letterSpacing: "-0.03em" }}>
            Detect hidden HR risk<br />
            <span style={{ color: gold }}>before it becomes a crisis</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", margin: "0 auto 36px", lineHeight: "1.75", maxWidth: "620px" }}>
            Most organisations discover workforce risk in a solicitor's letter, a resignation email, or a tribunal claim. PsychFlo surfaces the signals 6–12 weeks earlier — when there is still time to act.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Book a Workforce Risk Audit →
          </button>
        </section>

        {/* ── Business problem ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>The problem companies discover too late</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 32px", lineHeight: "1.7", maxWidth: "680px" }}>
            HR risk is invisible until it isn't. A policy reviewed two years ago now creates tribunal exposure under updated employment law. A new hire who seemed engaged at week four has quietly decided to leave. A manager's language in standups has been eroding team psychological safety for months.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            {[
              { icon: "📬", title: "The resignation lands", desc: "You find out your best performer is leaving. The signals were there for 8 weeks. Replacement will cost £65,000 and take 6 months." },
              { icon: "⚖️", title: "The tribunal claim arrives", desc: "A discrimination claim is filed. The policy clause that created the exposure hasn't been reviewed since 2021. The legal bill starts at £30,000." },
              { icon: "🏥", title: "The sick note runs to months", desc: "A senior employee goes on long-term stress leave. The team communication data showed deterioration 12 weeks earlier. No-one was reading it." },
            ].map((item, i) => (
              <div key={i} style={{ background: redBg, border: `1px solid ${redBorder}`, borderRadius: "14px", padding: "22px" }}>
                <div style={{ fontSize: "26px", marginBottom: "12px" }}>{item.icon}</div>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: red, margin: "0 0 8px" }}>{item.title}</h3>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.65" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What PsychFlo detects ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>What PsychFlo detects</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>
            Four intelligence engines analyse your workforce signals continuously — not just when you remember to check.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {DETECTS.map((d, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "18px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: red, fontSize: "14px", marginTop: "2px", flexShrink: 0 }}>▲</span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.75)" }}>{d.signal}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: gold, fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>e.g.</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{d.example}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: "14px 0 0", textAlign: "center" }}>
            Powered by Policy Intelligence · Compliance Audit · Onboarding Risk · Async Standup Safety engines
          </p>
        </section>

        {/* ── Business impact ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 24px", letterSpacing: "-0.02em" }}>The cost of undetected risk</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {IMPACT.map((s, i) => (
              <div key={i} style={{ background: redBg, border: `1px solid ${redBorder}`, borderRadius: "14px", padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{s.icon}</div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: red, marginBottom: "6px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Example outputs ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>What you receive</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>
            Every audit produces three outputs — not dashboards to interpret yourself, but documents your leadership team can act on immediately.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
            {OUTPUTS.map((o, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: o.color, letterSpacing: "0.08em", marginBottom: "10px" }}>{o.label.toUpperCase()}</div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px" }}>{o.title}</h3>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: "0 0 16px", lineHeight: "1.5" }}>{o.desc}</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px" }}>
                  {o.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "7px", alignItems: "flex-start" }}>
                      <span style={{ color: o.color, fontSize: "11px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", lineHeight: "1.5" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "20px", padding: "52px 48px", textAlign: "center" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
              Book a Workforce Risk Audit
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 auto 32px", maxWidth: "480px", lineHeight: "1.7" }}>
              We review your policies, analyse your people signals, and deliver a board-ready Executive Report in 48 hours — with a 30-day action plan your leadership team can execute immediately.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "14px" }}>
              <button onClick={() => router.push("/founding")}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "15px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
                Book Audit — £750 →
              </button>
              <button onClick={() => router.push("/solutions/retention-burnout")}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", padding: "15px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                See Retention Solution →
              </button>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>48-hour delivery · Board-ready PDF · 30-day action plan included</p>
          </div>
        </section>

      </div>
    </div>
  );
}
