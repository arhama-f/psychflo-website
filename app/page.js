"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

const gold = "#c9a84c";
const purple = "#c4b5fd";

const DASHBOARD_CARDS = [
  {
    label: "Burnout Risk",
    value: "84%",
    trend: "+12% this week",
    trendUp: true,
    color: "#fca5a5",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    icon: "🔥",
    sub: "3 employees in critical zone",
    badge: "HIGH RISK",
  },
  {
    label: "Attrition Probability",
    value: "31%",
    trend: "↑ from 22% last month",
    trendUp: true,
    color: "#fcd34d",
    bg: "rgba(251,191,36,0.07)",
    border: "rgba(251,191,36,0.2)",
    icon: "🚪",
    sub: "2 flight-risk employees flagged",
    badge: "ELEVATED",
  },
  {
    label: "Team Sentiment Drift",
    value: "−18pts",
    trend: "3-week downward trajectory",
    trendUp: true,
    color: "#fca5a5",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.15)",
    icon: "📉",
    sub: "Engineering team most affected",
    badge: "DECLINING",
  },
  {
    label: "Cognitive Load",
    value: "78 / 100",
    trend: "Above safe threshold",
    trendUp: true,
    color: "#fcd34d",
    bg: "rgba(251,191,36,0.06)",
    border: "rgba(251,191,36,0.15)",
    icon: "🧠",
    sub: "Sustained overload for 14+ days",
    badge: "ELEVATED",
  },
  {
    label: "Psychological Safety",
    value: "52 / 100",
    trend: "Stable but below benchmark",
    trendUp: false,
    color: purple,
    bg: "rgba(139,92,246,0.07)",
    border: "rgba(139,92,246,0.18)",
    icon: "🛡️",
    sub: "Q4 benchmark: 68. Gap: −16pts",
    badge: "MONITOR",
  },
  {
    label: "Recommended HR Action",
    value: "Act now",
    trend: "Priority #1 this sprint",
    trendUp: false,
    color: "#6ee7b7",
    bg: "rgba(16,185,129,0.07)",
    border: "rgba(16,185,129,0.2)",
    icon: "✅",
    sub: "Schedule 1:1s with 3 flagged managers",
    badge: "ACTION REQUIRED",
  },
];

const PREDICTION_STEPS = [
  {
    number: "01",
    title: "Ingest behavioural signals",
    desc: "PsychFlo continuously reads language patterns in standups, journals, onboarding responses, and policy documents — not survey answers.",
    icon: "📡",
    color: "#fca5a5",
  },
  {
    number: "02",
    title: "Run 12 prediction models",
    desc: "Each model is grounded in peer-reviewed organisational psychology. Burnout trajectories, attrition probability curves, and cognitive load thresholds are calculated in real time.",
    icon: "⚙️",
    color: gold,
  },
  {
    number: "03",
    title: "Surface risk 6–12 weeks early",
    desc: "Predictions are ranked by financial exposure and time-to-impact. You see the risk before the resignation email, the sick note, or the tribunal claim.",
    icon: "⏱️",
    color: purple,
  },
  {
    number: "04",
    title: "Generate the intervention",
    desc: "Each prediction comes with a named action, an owner, and a script. Not a vague recommendation — a specific conversation your manager can have on Monday.",
    icon: "🎯",
    color: "#6ee7b7",
  },
];

const INTEGRATIONS = [
  { name: "Slack", icon: "💬", desc: "Async standup language analysis" },
  { name: "BambooHR", icon: "🎋", desc: "Employee lifecycle signals" },
  { name: "Notion", icon: "📄", desc: "Documentation & policy review" },
  { name: "Google Workspace", icon: "📧", desc: "Communication pattern signals" },
  { name: "Personio", icon: "👥", desc: "HR data & onboarding flows" },
  { name: "Workday", icon: "🏢", desc: "Enterprise HRIS integration" },
  { name: "Jira", icon: "🔧", desc: "Cognitive load & sprint stress" },
  { name: "Microsoft Teams", icon: "🟦", desc: "Meeting & language behaviour" },
];

const USE_CASES = [
  {
    title: "Pre-empt a key resignation",
    scenario: "A senior engineer's language in standups has shifted. Sentiment drift detected over 3 weeks. Attrition probability: 71%.",
    outcome: "Manager alerted 8 weeks before they hand in notice. Retention conversation happens. They stay.",
    color: "#fca5a5",
    icon: "🚪",
  },
  {
    title: "Catch burnout before sick leave",
    scenario: "Cognitive load index crosses 80 for a team lead. Journaling frequency drops. Burnout risk: High.",
    outcome: "Workload redistributed. 1:1 scheduled with script. Sick leave avoided. Cost saved: £18,000.",
    color: "#fcd34d",
    icon: "🔥",
  },
  {
    title: "Prevent an employment tribunal",
    scenario: "Policy language audit flags 3 clauses that contradict current UK employment law. Tribunal exposure: £45,000.",
    outcome: "Policy updated in 48 hours. Compliance risk eliminated before any claim is filed.",
    color: purple,
    icon: "⚖️",
  },
  {
    title: "Fix a failing onboarding cohort",
    scenario: "Two of four Q3 hires show disengagement signals by week 6. Belonging score: 38/100. Predicted attrition: 60%.",
    outcome: "Structured 30-day onboarding reset deployed. Both hires reach 6-month milestone.",
    color: "#6ee7b7",
    icon: "🧭",
  },
];

const STATS = [
  { value: "6–12 wks", label: "Earlier than any survey" },
  { value: "£130k+",   label: "Avg financial risk detected per org" },
  { value: "12",       label: "AI prediction models running" },
  { value: "48 hrs",   label: "From diagnostic to board report" },
];

export default function Home() {
  const router = useRouter();
  const section = { maxWidth: "960px", margin: "0 auto", padding: "0 24px" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
      <Nav />

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section style={{ ...section, paddingTop: "108px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 18px", borderRadius: "999px", marginBottom: "36px", letterSpacing: "0.08em" }}>
          ✦ AI-POWERED WORKFORCE BEHAVIOUR PREDICTION · UK
        </div>

        <h1 style={{ fontSize: "58px", fontWeight: "900", color: "#f8fafc", margin: "0 0 28px", lineHeight: "1.04", letterSpacing: "-0.035em", maxWidth: "880px", marginLeft: "auto", marginRight: "auto" }}>
          Predict burnout, attrition,<br />and disengagement
          <span style={{ color: gold }}> before they<br />damage performance.</span>
        </h1>

        <p style={{ fontSize: "19px", color: "rgba(255,255,255,0.45)", margin: "0 auto 16px", lineHeight: "1.75", maxWidth: "640px" }}>
          PsychFlo is an AI behavioural intelligence layer that reads workforce signals continuously — surfacing psychological safety risk, cognitive overload, and attrition probability 6–12 weeks before they become business problems.
        </p>

        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.22)", margin: "0 auto 48px", maxWidth: "440px", lineHeight: "1.6" }}>
          Built for HR Directors, CHROs, and People VPs who need predictive data — not retrospective surveys.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "18px 42px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer", letterSpacing: "-0.01em" }}>
            Run Workforce Prediction →
          </button>
          <button onClick={() => router.push("/report/executive")}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "18px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
            See Sample Report
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.18)", margin: 0 }}>
          Free diagnostic · No credit card · Board-ready report in 48 hours
        </p>
      </section>

      {/* ── 2. PREDICTION DASHBOARD PREVIEW ──────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "700", padding: "4px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.07em" }}>
            LIVE PREDICTION DASHBOARD · SAMPLE DATA
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.025em" }}>
            Your workforce intelligence, live
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.35)", margin: "0 auto", maxWidth: "520px", lineHeight: "1.65" }}>
            Six prediction surfaces updated continuously. Each card is a signal — not a metric to monitor, but a risk to act on.
          </p>
        </div>

        {/* Dashboard frame */}
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "28px", backdropFilter: "blur(10px)" }}>
          {/* Dashboard header bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
              <span style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.6)" }}>PsychFlo · Executive Dashboard</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>Last updated: 2 minutes ago</span>
              <div style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: gold, fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px", letterSpacing: "0.06em" }}>
                LIVE
              </div>
            </div>
          </div>

          {/* 6 prediction cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
            {DASHBOARD_CARDS.map((card, i) => (
              <div key={i} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: "16px", padding: "20px 22px", position: "relative", overflow: "hidden" }}>
                {/* Badge */}
                <div style={{ position: "absolute", top: "14px", right: "14px", fontSize: "9px", fontWeight: "800", color: card.color, background: `${card.bg}`, border: `1px solid ${card.border}`, padding: "2px 8px", borderRadius: "999px", letterSpacing: "0.06em" }}>
                  {card.badge}
                </div>

                <div style={{ fontSize: "22px", marginBottom: "10px" }}>{card.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.35)", marginBottom: "6px", letterSpacing: "0.04em" }}>{card.label.toUpperCase()}</div>
                <div style={{ fontSize: "28px", fontWeight: "900", color: card.color, lineHeight: 1, marginBottom: "6px", letterSpacing: "-0.02em" }}>{card.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>{card.trend}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "6px 10px" }}>
                  {card.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom action bar */}
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>12 AI prediction models · Updated every 24 hours · Signals from 4 data sources</span>
            <button onClick={() => router.push("/diagnostic")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "10px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
              Get your dashboard →
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. HOW PSYCHFLO PREDICTS BEHAVIOUR ───────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", color: gold, fontSize: "11px", fontWeight: "700", padding: "4px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.07em" }}>
            THE PREDICTION ENGINE
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.025em" }}>
            How PsychFlo predicts<br />workforce behaviour
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.35)", margin: "0 auto", maxWidth: "520px", lineHeight: "1.65" }}>
            Not a survey. Not a mood tracker. A continuous behavioural signal reader — grounded in organisational psychology and built to surface risk before it becomes cost.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" }}>
          {PREDICTION_STEPS.map((step, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "32px 36px", display: "flex", gap: "24px", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${step.color}15`, border: `1px solid ${step.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "10px" }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: "11px", fontWeight: "800", color: step.color, letterSpacing: "0.08em" }}>{step.number}</div>
              </div>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", margin: 0, lineHeight: "1.75" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div style={{ marginTop: "28px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "16px", padding: "28px 36px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", paddingRight: "12px", paddingLeft: "12px" }}>
              <div style={{ fontSize: "28px", fontWeight: "900", color: gold, letterSpacing: "-0.02em", marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: "1.4" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. HR INTEGRATIONS LAYER ─────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          {/* Left: copy */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(196,181,253,0.08)", border: "1px solid rgba(196,181,253,0.18)", color: purple, fontSize: "11px", fontWeight: "700", padding: "4px 14px", borderRadius: "999px", marginBottom: "20px", letterSpacing: "0.07em" }}>
              INTEGRATIONS LAYER
            </div>
            <h2 style={{ fontSize: "34px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.025em", lineHeight: "1.2" }}>
              Sits on top of<br />your existing HR stack
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px", lineHeight: "1.75" }}>
              PsychFlo is a behavioural intelligence layer, not a replacement for your HRIS. It reads signals from the tools your team already uses — then surfaces what your HR system cannot see.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {[
                "Reads language and behaviour — not just headcount",
                "No rip-and-replace of existing systems",
                "Enterprise HRIS integrations via API",
                "GDPR-compliant signal processing",
                "Employee-facing tools are fully opt-in",
              ].map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: gold, fontSize: "13px", marginTop: "1px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{pt}</span>
                </div>
              ))}
            </div>
            <button onClick={() => router.push("/book-audit")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
              Book Integration Scoping Call →
            </button>
          </div>

          {/* Right: integration grid */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px" }}>
              {INTEGRATIONS.map((intg, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "24px", flexShrink: 0 }}>{intg.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "3px" }}>{intg.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: "1.45" }}>{intg.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>Enterprise integrations available on Growth & Enterprise plans</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. USE CASES ─────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "700", padding: "4px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.07em" }}>
            USE CASES
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.025em" }}>
            What PsychFlo predicts —<br />and what happens next
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.35)", margin: "0 auto", maxWidth: "500px", lineHeight: "1.65" }}>
            Each prediction comes with a named intervention. You never just see a red number — you see what to do about it.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" }}>
          {USE_CASES.map((uc, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "32px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${uc.color}66, transparent)` }} />
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>{uc.icon}</div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.01em" }}>{uc.title}</h3>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.25)", letterSpacing: "0.07em", marginBottom: "8px" }}>SCENARIO</div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.65" }}>{uc.scenario}</p>
              </div>

              <div style={{ background: `${uc.color}0d`, border: `1px solid ${uc.color}25`, borderRadius: "10px", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: uc.color, letterSpacing: "0.07em", marginBottom: "6px" }}>OUTCOME</div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: "1.6" }}>{uc.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. FOUNDER / INNOVATION SECTION ─────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "56px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" }}>
          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "4px 14px", borderRadius: "999px", marginBottom: "20px", letterSpacing: "0.07em" }}>
              UK INNOVATION · BUILT IN BRITAIN
            </div>
            <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.025em", lineHeight: "1.2" }}>
              Closing the gap between organisational psychology and enterprise AI
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px", lineHeight: "1.8" }}>
              PsychFlo is the first platform to operationalise evidence-based organisational psychology at scale — making behavioural prediction accessible to organisations that cannot afford a clinical workforce psychologist on staff.
            </p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 32px", lineHeight: "1.8" }}>
              We are building a new category: <strong style={{ color: "rgba(255,255,255,0.65)" }}>Workforce Behavioural Intelligence</strong> — distinct from HR software, distinct from wellbeing apps, and distinct from engagement surveys. It is predictive, actionable, and grounded in science.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={() => router.push("/diagnostic")}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
                Run the Diagnostic →
              </button>
              <button onClick={() => router.push("/book-audit")}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", padding: "13px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Book Audit Call
              </button>
            </div>
          </div>

          {/* Right: innovation credentials */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                icon: "🧬",
                title: "Evidence-based prediction models",
                desc: "All 12 models are built on peer-reviewed organisational psychology research — burnout theory, attrition modelling, cognitive load frameworks.",
              },
              {
                icon: "🇬🇧",
                title: "Built for the UK employment environment",
                desc: "UK employment law, ACAS guidelines, and tribunal risk frameworks are embedded directly into the compliance and policy engines.",
              },
              {
                icon: "🔒",
                title: "Privacy-by-design architecture",
                desc: "GDPR-compliant from the ground up. Employee data is processed with full transparency. No covert monitoring — ever.",
              },
              {
                icon: "📈",
                title: "New category: Workforce Behavioural Intelligence",
                desc: "Not HR software. Not a wellbeing app. A prediction platform that turns people signals into board-ready risk intelligence.",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "18px 20px" }}>
                <span style={{ fontSize: "22px", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", marginBottom: "4px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: "1.6" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FINAL CTA ─────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "80px" }}>
        <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "24px", padding: "72px 48px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 16px", borderRadius: "999px", marginBottom: "28px", letterSpacing: "0.08em" }}>
            ✦ FOUNDING CLIENT PROGRAMME · 3 SPOTS REMAINING
          </div>

          <h2 style={{ fontSize: "42px", fontWeight: "800", color: "#f8fafc", margin: "0 0 18px", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            Start predicting.<br />
            <span style={{ color: gold }}>Stop reacting.</span>
          </h2>

          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.38)", margin: "0 auto 40px", maxWidth: "520px", lineHeight: "1.8" }}>
            Run a free 5-minute diagnostic. Get your workforce risk prediction score. Book a full audit — delivered to your leadership team in 48 hours.
          </p>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
            <button onClick={() => router.push("/diagnostic")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "18px 44px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}>
              Run Workforce Prediction — Free →
            </button>
            <button onClick={() => router.push("/book-audit")}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "18px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
              Book £750 Audit →
            </button>
          </div>

          <div style={{ display: "flex", gap: "28px", justifyContent: "center", flexWrap: "wrap" }}>
            {["Free 5-min diagnostic", "Board-ready report in 48hrs", "No credit card required", "Cancel anytime"].map((t, i) => (
              <span key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ color: gold }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "36px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.18)", margin: "0 0 12px" }}>
          © 2026 PsychFlo · Workforce Behavioural Intelligence · Built in the UK
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "About",               href: "/about" },
            { label: "Pricing",             href: "/pricing" },
            { label: "Blog",                href: "/blog" },
            { label: "Founding Programme",  href: "/founding" },
            { label: "SLA",                 href: "/sla" },
          ].map((l, i) => (
            <button key={i} onClick={() => router.push(l.href)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.22)", fontSize: "12px", cursor: "pointer", padding: 0 }}>
              {l.label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
