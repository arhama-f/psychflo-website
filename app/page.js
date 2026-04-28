"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

export default function Home() {
  const router = useRouter();
  const gold = "#c9a84c";

  const risks = [
    { icon: "💸", value: "£56bn", label: "Annual UK cost of poor mental health at work" },
    { icon: "👤", value: "£50–100k", label: "Cost of replacing one senior employee" },
    { icon: "⚖️", value: "£30–100k", label: "Average employment tribunal award" },
    { icon: "🚪", value: "67%", label: "Employees who leave because of their manager" },
  ];

  const outcomes = [
    {
      icon: "⚠️",
      color: "#fca5a5",
      bg: "rgba(239,68,68,0.07)",
      border: "rgba(239,68,68,0.18)",
      title: "Workforce Risk Detection",
      desc: "Surface policy gaps, tribunal exposure, compliance failures, and attrition signals before they become crises.",
      engines: ["Policy Intelligence", "Compliance Audit", "Onboarding Risk", "Standup Safety"],
      href: "/solutions/workforce-risk",
    },
    {
      icon: "🔥",
      color: "#6ee7b7",
      bg: "rgba(16,185,129,0.07)",
      border: "rgba(16,185,129,0.18)",
      title: "Retention & Burnout Prevention",
      desc: "Detect burnout 6–8 weeks early. Prevent the resignations, absenteeism, and productivity loss that follow.",
      engines: ["Burnout Early Warning", "AI Journaling", "Daily Pulse", "Cognitive Load"],
      href: "/solutions/retention",
    },
    {
      icon: "🧠",
      color: "#c4b5fd",
      bg: "rgba(139,92,246,0.07)",
      border: "rgba(139,92,246,0.18)",
      title: "Manager & Culture Intelligence",
      desc: "Score every manager objectively. Identify culture risk. Give leaders a coaching plan, not vague feedback.",
      engines: ["Manager Coaching", "Manager Effectiveness", "Onboarding Analytics", "Grief Support"],
      href: "/solutions/manager-culture",
    },
  ];

  const process = [
    { step: "01", title: "Diagnose", desc: "Complete a 5-minute workforce risk diagnostic. Tell us your company size, industry, and biggest people challenges." },
    { step: "02", title: "Analyse", desc: "9 AI intelligence engines analyse your workforce signals across risk, retention, and culture dimensions." },
    { step: "03", title: "Prioritise", desc: "Receive a scored Executive Workforce Report — overall risk score, top 3 business risks, estimated financial impact." },
    { step: "04", title: "Act", desc: "A 30-day priority action plan with specific interventions, manager scripts, and compliance steps." },
  ];

  const engines = [
    { icon: "📄", name: "Policy Intelligence", category: "Risk", color: "#fca5a5" },
    { icon: "🔥", name: "Burnout Early Warning", category: "Retention", color: "#6ee7b7" },
    { icon: "📓", name: "AI Journaling", category: "Retention", color: "#6ee7b7" },
    { icon: "🎯", name: "Manager Coaching", category: "Culture", color: "#c4b5fd" },
    { icon: "🧠", name: "UX Research Copilot", category: "Culture", color: "#c4b5fd" },
    { icon: "📊", name: "Onboarding Analytics", category: "Risk", color: "#fca5a5" },
    { icon: "💬", name: "Async Standup Safety", category: "Risk", color: "#fca5a5" },
    { icon: "💔", name: "Grief & Loss Companion", category: "Culture", color: "#c4b5fd" },
    { icon: "🏃", name: "Cognitive Load Monitor", category: "Retention", color: "#6ee7b7" },
  ];

  const testimonials = [
    { quote: "PsychFlo flagged a compliance gap that would have cost us £95,000 in tribunal fees. The ROI was immediate.", name: "Sarah M.", role: "HR Director, 400-person tech company" },
    { quote: "We replaced three separate HR tools with PsychFlo. The psychology-grounded insights are unlike anything else in the market.", name: "James T.", role: "CHRO, Professional Services firm" },
    { quote: "The policy translator turned a document our employees ignored into something they actually read and understood.", name: "Aisha K.", role: "People & Culture Manager" },
  ];

  const pricingPreview = [
    { name: "Workforce Risk Audit", price: "$750", period: "one-time", desc: "Board-ready risk report in 48 hours. Policy review, compliance gaps, 30-day action plan.", cta: "Book Audit", href: "/pricing", highlight: false },
    { name: "Growth Prevention System", price: "$2,000", period: "/month", desc: "Continuous monitoring across all 3 outcomes. Weekly reports, manager scorecards, Slack alerts.", cta: "Apply for Access", href: "/pricing", highlight: true },
    { name: "Executive Intelligence", price: "$3,500", period: "/month", desc: "Full platform, dedicated success manager, quarterly board presentations, custom integrations.", cta: "Book Executive Call", href: "/pricing", highlight: false },
  ];

  const section = { maxWidth: "900px", margin: "0 auto", padding: "0 24px" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />

      {/* ── Hero ── */}
      <div style={{ ...section, paddingTop: "90px", paddingBottom: "80px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "28px", letterSpacing: "0.07em" }}>
          EXECUTIVE WORKFORCE INTELLIGENCE SYSTEM
        </div>
        <h1 style={{ fontSize: "52px", fontWeight: "800", color: "#f8fafc", margin: "0 0 24px", lineHeight: "1.08", letterSpacing: "-0.03em", maxWidth: "780px", marginLeft: "auto", marginRight: "auto" }}>
          Prevent resignations, burnout,<br />conflict, and HR risk<br />
          <span style={{ color: gold }}>before they cost your business.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", margin: "0 auto 44px", lineHeight: "1.75", maxWidth: "640px" }}>
          PsychFlo combines 9 AI psychology engines into one Executive Workforce Intelligence System that detects people risk, explains the business impact, and gives leaders a clear action plan.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "18px" }}>
          <button onClick={() => router.push("/auth/signup")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "17px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}>
            Book a Workforce Risk Audit →
          </button>
          <button onClick={() => router.push("/how-it-works")}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "17px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
            See How It Works
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
          No credit card required · Free diagnostic · Results in 5 minutes
        </p>
      </div>

      {/* ── Hidden workforce risk is expensive ── */}
      <div style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Hidden workforce risk is expensive
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Most companies discover it in a resignation email or a solicitor's letter. PsychFlo finds it 6–12 weeks earlier.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
          {risks.map((r, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "28px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{r.icon}</div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: gold, marginBottom: "8px", letterSpacing: "-0.02em" }}>{r.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Three outcomes ── */}
      <div style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Three business outcomes. Nine AI engines.
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Every engine maps to a measurable business outcome — not just a feature.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
          {outcomes.map((o, i) => (
            <div key={i} onClick={() => router.push(o.href)}
              style={{ background: o.bg, border: `1px solid ${o.border}`, borderRadius: "16px", padding: "28px", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ fontSize: "32px", marginBottom: "14px" }}>{o.icon}</div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>{o.title}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 18px", lineHeight: "1.65" }}>{o.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                {o.engines.map((eng, j) => (
                  <span key={j} style={{ fontSize: "10px", fontWeight: "600", color: o.color, background: o.bg, border: `1px solid ${o.border}`, padding: "3px 8px", borderRadius: "999px" }}>
                    {eng}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: gold }}>Explore solution →</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Diagnose → Analyse → Prioritise → Act ── */}
      <div style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Diagnose → Analyse → Prioritise → Act
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            A structured process that turns people data into board-ready decisions.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
          {process.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: gold, letterSpacing: "0.1em", marginBottom: "14px" }}>{p.step}</div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>{p.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.65" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Executive report preview ── */}
      <div style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", overflow: "hidden" }}>
          <div style={{ padding: "40px 40px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>
                EXECUTIVE WORKFORCE REPORT
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: "1.2" }}>
                A board-ready risk report in 48 hours
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px", lineHeight: "1.7" }}>
                Every audit produces a scored Executive Workforce Report — not a dashboard you have to interpret, but a clear document your leadership team can act on immediately.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                {["Overall Workforce Risk Score (0–100)", "Risk by category with financial impact", "Top 3 business risks with root causes", "30-day priority action plan", "Intelligence engines used"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ color: gold, fontSize: "14px" }}>✓</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push("/report/board")}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
                See Sample Report →
              </button>
            </div>

            {/* Mock report card */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", marginBottom: "16px" }}>EXECUTIVE WORKFORCE REPORT · SAMPLE</div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>OVERALL RISK SCORE</div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "44px", fontWeight: "800", color: "#fcd34d" }}>72</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#fcd34d" }}>High Risk</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Immediate action recommended</div>
                  </div>
                </div>
              </div>
              {[
                { label: "Workforce Risk", score: 80, color: "#fca5a5" },
                { label: "Burnout & Retention", score: 68, color: "#fcd34d" },
                { label: "Manager & Culture", score: 58, color: "#6ee7b7" },
              ].map((cat, i) => (
                <div key={i} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{cat.label}</span>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: cat.color }}>{cat.score}/100</span>
                  </div>
                  <div style={{ height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "999px" }}>
                    <div style={{ height: "100%", width: `${cat.score}%`, background: cat.color, borderRadius: "999px" }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "18px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>TOP RISKS</div>
                {["Policy non-compliance: £45k tribunal exposure", "3 managers in burnout danger zone", "Onboarding failure rate: 2 of last 4 hires"].map((r, i) => (
                  <div key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "6px", display: "flex", gap: "8px" }}>
                    <span style={{ color: "#fca5a5" }}>▲</span>{r}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: "24px 40px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "32px", display: "flex", gap: "32px" }}>
            {[{ v: "48hrs", l: "Report delivery" }, { v: "$750", l: "One-time audit" }, { v: "9", l: "Engines analysing" }, { v: "30 days", l: "Action plan horizon" }].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "18px", fontWeight: "800", color: gold }}>{s.v}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 9 intelligence engines ── */}
      <div style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            9 AI Intelligence Engines powering the system
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Each engine is grounded in peer-reviewed organisational psychology research.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
          {engines.map((e, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "24px" }}>{e.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc" }}>{e.name}</div>
                <div style={{ fontSize: "10px", fontWeight: "700", color: e.color, marginTop: "3px", letterSpacing: "0.04em" }}>{e.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>What executives say</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px" }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.75", margin: "0 0 18px", fontStyle: "italic" }}>"{t.quote}"</p>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", margin: "0 0 2px" }}>{t.name}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pricing preview ── */}
      <div style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Start with an audit. Scale with a retainer.
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            No per-seat pricing. No annual lock-in. One price for your whole organisation.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "20px" }}>
          {pricingPreview.map((p, i) => (
            <div key={i} style={{ background: p.highlight ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.04)", border: p.highlight ? `1px solid rgba(201,168,76,0.3)` : "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "26px", display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px", lineHeight: "1.3" }}>{p.name}</h3>
              <div style={{ marginBottom: "10px" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", color: p.highlight ? gold : "#f8fafc" }}>{p.price}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginLeft: "4px" }}>{p.period}</span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 20px", lineHeight: "1.6", flex: 1 }}>{p.desc}</p>
              <button onClick={() => router.push(p.href)}
                style={{ width: "100%", background: p.highlight ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.07)", border: p.highlight ? "none" : "1px solid rgba(255,255,255,0.1)", color: p.highlight ? "#0f172a" : "rgba(255,255,255,0.7)", padding: "11px", borderRadius: "9px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                {p.cta} →
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <span onClick={() => router.push("/pricing")} style={{ fontSize: "13px", color: gold, cursor: "pointer", fontWeight: "600" }}>
            View full pricing →
          </span>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div style={{ ...section, paddingBottom: "80px" }}>
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "20px", padding: "56px 48px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "20px", letterSpacing: "0.07em" }}>
            ✦ FOUNDING CLIENT PROGRAMME — 5 SPOTS REMAINING
          </div>
          <h2 style={{ fontSize: "30px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Ready to understand your people?
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: "0 auto 32px", maxWidth: "500px", lineHeight: "1.7" }}>
            We are accepting 5 founding companies for discounted workforce risk audits in exchange for feedback and anonymised case study data.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/auth/signup")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
              Apply as Founding Client →
            </button>
            <button onClick={() => router.push("/pricing")}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "16px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
              View Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
          © 2026 PsychFlo · Organisational Psychology + AI Engineering ·
          <span onClick={() => router.push("/about")} style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer", marginLeft: "8px" }}>About</span> ·
          <span onClick={() => router.push("/pricing")} style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer", marginLeft: "8px" }}>Pricing</span> ·
          <span onClick={() => router.push("/blog")} style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer", marginLeft: "8px" }}>Blog</span> ·
          <span onClick={() => router.push("/status")} style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer", marginLeft: "8px" }}>Status</span>
        </p>
      </div>
    </div>
  );
}
