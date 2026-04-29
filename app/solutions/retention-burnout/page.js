"use client";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";
const green = "#6ee7b7";
const greenBg = "rgba(16,185,129,0.06)";
const greenBorder = "rgba(16,185,129,0.18)";

const DETECTS = [
  { signal: "Burnout trajectories 6–8 weeks before resignation or sick leave", example: "Exhaustion and cynicism scores rising while efficacy drops over 4 consecutive weeks" },
  { signal: "Subclinical burnout going undetected in high performers", example: "High output masking unsustainable cognitive load — the 'quiet burnout' pattern" },
  { signal: "Flight risk signals before departure decisions are made", example: "Low daily pulse scores combined with declining onboarding satisfaction at week 8" },
  { signal: "Workload imbalances creating invisible pressure across teams", example: "Meeting density above threshold reducing deep work time below 2 hours/day" },
  { signal: "Emotional load patterns from journaling that precede absence", example: "Recurring stress themes over 3+ weeks with no management intervention" },
  { signal: "New hire disengagement in the critical first 90 days", example: "Belonging score below 60 at day 30 — predicts 3× higher attrition by day 90" },
];

const IMPACT = [
  { value: "£50–100k", label: "Cost of one senior resignation and replacement", icon: "💸" },
  { value: "6–8 wks",  label: "How early PsychFlo detects burnout signals", icon: "⏱️" },
  { value: "74%",      label: "Reduction in undetected burnout cases", icon: "📉" },
  { value: "£287k",    label: "Average annual prevention value per organisation", icon: "🛡️" },
];

const OUTPUTS = [
  {
    label: "Burnout Score",
    title: "Team Burnout Report",
    desc: "Anonymised risk distribution across your team",
    color: "#fcd34d",
    items: [
      "3 employees in high-risk zone (score ≥ 67)",
      "Exhaustion dimension elevated across 60% of team",
      "Predicted burnout peak: 6–8 weeks at current trajectory",
    ],
  },
  {
    label: "Attrition Risk",
    title: "Flight Risk Dashboard",
    desc: "Predictive departure timeline with named drivers",
    color: "#fca5a5",
    items: [
      "2 employees: critical flight risk (30-day window)",
      "Primary drivers: workload imbalance + manager relationship",
      "Replacement cost exposure: £130,000",
    ],
  },
  {
    label: "Action Plan",
    title: "Retention Priority Actions",
    desc: "30-day plan to reduce identified burnout risk",
    color: green,
    items: [
      "Week 1: Deploy burnout check-ins to flagged employees",
      "Week 2: Manager conversation scripts for at-risk individuals",
      "Week 3: Workload rebalancing recommendations",
    ],
  },
];

export default function RetentionBurnoutPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 80px" }}>

        {/* ── Hero ── */}
        <section style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: greenBg, border: `1px solid ${greenBorder}`, color: green, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "24px", letterSpacing: "0.07em" }}>
            🔥 RETENTION & BURNOUT PREVENTION
          </div>
          <h1 style={{ fontSize: "46px", fontWeight: "800", color: "#f8fafc", margin: "0 0 20px", lineHeight: "1.08", letterSpacing: "-0.03em" }}>
            Stop losing your best people<br />
            <span style={{ color: gold }}>to invisible burnout</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", margin: "0 auto 36px", lineHeight: "1.75", maxWidth: "620px" }}>
            Burnout doesn't announce itself. It accumulates quietly over weeks until the resignation letter lands. PsychFlo detects the signal 6–8 weeks early — when there is still time to intervene.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Book a Workforce Risk Audit →
          </button>
        </section>

        {/* ── Business problem ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>Burnout doesn't look like burnout — until it's too late</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 32px", lineHeight: "1.7", maxWidth: "680px" }}>
            High performers are the most dangerous burnout cases. They keep delivering while their exhaustion, cynicism, and sense of efficacy deteriorate below the surface. By the time you notice — when they resign, go on sick leave, or start underperforming — the cost is already locked in.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            {[
              { icon: "🔇", title: "The silent resignation", desc: "Your best engineer stops volunteering ideas. Their daily pulse score has been declining for 6 weeks. They have already decided to leave — they just haven't told you yet." },
              { icon: "🏥", title: "The sick note surprise", desc: "A senior manager takes stress leave with 2 weeks' notice. The burnout signals were visible in their standup language and journal patterns for 10 weeks." },
              { icon: "📉", title: "The productivity collapse", desc: "A previously high-performing team starts missing deadlines. Subclinical burnout has been compounding across 4 team members simultaneously for 2 months." },
            ].map((item, i) => (
              <div key={i} style={{ background: greenBg, border: `1px solid ${greenBorder}`, borderRadius: "14px", padding: "22px" }}>
                <div style={{ fontSize: "26px", marginBottom: "12px" }}>{item.icon}</div>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: green, margin: "0 0 8px" }}>{item.title}</h3>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.65" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What PsychFlo detects ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>What PsychFlo detects</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>
            Four intelligence engines monitor burnout and retention signals continuously — across every layer of your workforce.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {DETECTS.map((d, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "18px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: green, fontSize: "14px", marginTop: "2px", flexShrink: 0 }}>▲</span>
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
            Powered by Burnout Early Warning · AI Journaling · Daily Pulse · Cognitive Load Monitor engines
          </p>
        </section>

        {/* ── Business impact ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 24px", letterSpacing: "-0.02em" }}>The cost of burnout you didn't catch</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {IMPACT.map((s, i) => (
              <div key={i} style={{ background: greenBg, border: `1px solid ${greenBorder}`, borderRadius: "14px", padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{s.icon}</div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: green, marginBottom: "6px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Example outputs ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>What you receive</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>
            Three outputs per cycle — not data to interpret, but decisions your leadership team can act on immediately.
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
              We assess your burnout and retention risk, deliver a scored Executive Report in 48 hours, and give your leadership team a 30-day action plan to act on immediately.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "14px" }}>
              <button onClick={() => router.push("/founding")}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "15px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
                Book Audit — $750 →
              </button>
              <button onClick={() => router.push("/solutions/manager-culture")}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", padding: "15px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                See Manager Solution →
              </button>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>48-hour delivery · Board-ready PDF · 30-day action plan included</p>
          </div>
        </section>

      </div>
    </div>
  );
}
