"use client";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";
const purple = "#c4b5fd";
const purpleBg = "rgba(139,92,246,0.06)";
const purpleBorder = "rgba(139,92,246,0.18)";

const DETECTS = [
  { signal: "Manager effectiveness gaps that drive attrition and disengagement", example: "Manager scoring C or D grade across 3 consecutive team burnout cycles" },
  { signal: "Psychological safety deterioration within specific teams", example: "Team members avoiding conflict disclosure in standups — safety score below 40" },
  { signal: "Managers avoiding difficult conversations they are not equipped to have", example: "No coaching interactions logged in 6 weeks despite elevated team stress signals" },
  { signal: "Culture inconsistencies creating disparity between teams in the same org", example: "Burnout rates 3× higher in Team A vs Team B under different manager styles" },
  { signal: "New hire belonging risk in the first 30 days", example: "Onboarding satisfaction dropping to 48/100 at day 14 — predicts early departure" },
  { signal: "Bereavement and personal crisis situations requiring manager support", example: "Employee disclosed loss in journal — no manager support framework in place" },
];

const IMPACT = [
  { value: "67%",  label: "Of resignations cite manager as primary reason", icon: "🚪" },
  { value: "3×",   label: "Higher retention under high-scoring managers", icon: "📈" },
  { value: "£28k", label: "Average cost of replacing a mid-level manager", icon: "💸" },
  { value: "8 wks", label: "Time to first measurable culture improvement", icon: "⏱️" },
];

const OUTPUTS = [
  {
    label: "Manager Scorecard",
    title: "Manager Effectiveness Report",
    desc: "Objective A–D grading across all managers in your org",
    color: purple,
    items: [
      "J. Park: A+ — model to replicate across teams",
      "S. Obi: C — burnout risk in direct reports elevated",
      "Coaching priority: difficult conversation capability",
    ],
  },
  {
    label: "Culture Risk",
    title: "Psychological Safety Index",
    desc: "Team-level safety scores with root cause identification",
    color: "#fcd34d",
    items: [
      "Engineering team: safety score 38/100 — intervention required",
      "Primary cause: conflict avoidance under current manager",
      "Recommended: manager coaching + standup restructure",
    ],
  },
  {
    label: "Action Plan",
    title: "30-Day Culture Plan",
    desc: "Specific steps to improve manager and culture outcomes",
    color: gold,
    items: [
      "Week 1: Manager coaching sessions for C/D-graded managers",
      "Week 2: Psychological safety workshops with flagged teams",
      "Week 3: Onboarding check-ins for all hires within 90 days",
    ],
  },
];

export default function ManagerCulturePage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 80px" }}>

        {/* ── Hero ── */}
        <section style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: purpleBg, border: `1px solid ${purpleBorder}`, color: purple, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "24px", letterSpacing: "0.07em" }}>
            🧠 MANAGER & CULTURE INTELLIGENCE
          </div>
          <h1 style={{ fontSize: "46px", fontWeight: "800", color: "#f8fafc", margin: "0 0 20px", lineHeight: "1.08", letterSpacing: "-0.03em" }}>
            Culture is built or broken<br />
            <span style={{ color: gold }}>at the manager layer</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", margin: "0 auto 36px", lineHeight: "1.75", maxWidth: "620px" }}>
            67% of employees leave because of their manager, not the company. PsychFlo scores every manager objectively, identifies culture risk early, and gives leaders a concrete coaching plan — not vague feedback or annual reviews.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Book a Workforce Risk Audit →
          </button>
        </section>

        {/* ── Business problem ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>The manager problem no-one is measuring</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 32px", lineHeight: "1.7", maxWidth: "680px" }}>
            Most organisations have no objective way to measure manager effectiveness. Performance reviews are subjective, annual, and backward-looking. By the time a manager's impact on team burnout and attrition becomes visible, the damage is already done.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            {[
              { icon: "🗣️", title: "The conversation that didn't happen", desc: "A team member disclosed burnout symptoms to a colleague. Their manager was not equipped to have the conversation — and didn't. They resigned 6 weeks later." },
              { icon: "📊", title: "The team that looked fine on paper", desc: "Output metrics were green. But psychological safety scores across the team had been declining for 3 months. Three of six members were actively job-hunting." },
              { icon: "🔄", title: "The culture that forked between teams", desc: "Two teams in the same org, same headcount, same role. One had 12% attrition. The other had 41%. The only variable was manager style and effectiveness." },
            ].map((item, i) => (
              <div key={i} style={{ background: purpleBg, border: `1px solid ${purpleBorder}`, borderRadius: "14px", padding: "22px" }}>
                <div style={{ fontSize: "26px", marginBottom: "12px" }}>{item.icon}</div>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: purple, margin: "0 0 8px" }}>{item.title}</h3>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.65" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What PsychFlo detects ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>What PsychFlo detects</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>
            Four intelligence engines monitor manager effectiveness and culture health continuously — replacing subjective reviews with objective, real-time intelligence.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {DETECTS.map((d, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "18px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: purple, fontSize: "14px", marginTop: "2px", flexShrink: 0 }}>▲</span>
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
            Powered by Manager Coaching · Manager Effectiveness · Onboarding Analytics · Grief Support engines
          </p>
        </section>

        {/* ── Business impact ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 24px", letterSpacing: "-0.02em" }}>The business case for manager intelligence</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {IMPACT.map((s, i) => (
              <div key={i} style={{ background: purpleBg, border: `1px solid ${purpleBorder}`, borderRadius: "14px", padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{s.icon}</div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: purple, marginBottom: "6px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Example outputs ── */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>What you receive</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>
            Three outputs per cycle — replacing subjective reviews with objective intelligence your leadership team can act on.
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
              We assess your manager effectiveness and culture health, deliver a scored Executive Report in 48 hours, and give your leadership team a 30-day plan to act on immediately.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "14px" }}>
              <button onClick={() => router.push("/founding")}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "15px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
                Book Audit — £750 →
              </button>
              <button onClick={() => router.push("/solutions/risk-detection")}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", padding: "15px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                See Risk Detection →
              </button>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>48-hour delivery · Board-ready PDF · 30-day action plan included</p>
          </div>
        </section>

      </div>
    </div>
  );
}
