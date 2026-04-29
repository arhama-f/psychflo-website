"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

export default function Home() {
  const router = useRouter();
  const gold = "#c9a84c";
  const section = { maxWidth: "920px", margin: "0 auto", padding: "0 24px" };

  // ── Data ──────────────────────────────────────────────────────────────────

  const problems = [
    { icon: "💸", value: "£56bn",      label: "Annual UK cost of poor mental health at work" },
    { icon: "👤", value: "£50–100k",   label: "Cost of replacing one senior employee" },
    { icon: "⚖️", value: "£30–100k",   label: "Average employment tribunal award" },
    { icon: "🚪", value: "67%",        label: "Employees who leave because of their manager" },
  ];

  const outcomes = [
    {
      icon: "⚠️", accentColor: "#fca5a5",
      bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.18)",
      title: "Workforce Risk Detection",
      desc: "Surface policy gaps, tribunal exposure, compliance failures, and attrition signals before they escalate into legal or financial crises.",
      engines: ["Policy Intelligence", "Compliance Audit", "Onboarding Risk", "Standup Safety"],
      href: "/solutions/risk-detection",
      stat: "£45k avg tribunal exposure detected",
    },
    {
      icon: "🔥", accentColor: "#6ee7b7",
      bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.18)",
      title: "Retention & Burnout Prevention",
      desc: "Detect burnout 6–8 weeks before it becomes absenteeism or a resignation. Prevent the £50–100k replacement cost that follows.",
      engines: ["Burnout Early Warning", "AI Journaling", "Daily Pulse", "Cognitive Load"],
      href: "/solutions/retention-burnout",
      stat: "6–8 weeks earlier detection",
    },
    {
      icon: "🧠", accentColor: "#c4b5fd",
      bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.18)",
      title: "Manager & Culture Intelligence",
      desc: "Score every manager objectively. Identify culture risk. Give leaders a coaching plan and conversation scripts — not vague feedback.",
      engines: ["Manager Coaching", "Manager Effectiveness", "Onboarding Analytics", "Grief Support"],
      href: "/solutions/manager-culture",
      stat: "3× more effective than surveys",
    },
  ];

  const process = [
    {
      step: "01", title: "Diagnose",
      desc: "Complete a 5-minute workforce risk diagnostic. Tell us your company size, industry, and biggest people challenges.",
      icon: "🔍",
    },
    {
      step: "02", title: "Analyse",
      desc: "9 AI psychology engines cross-reference your signals across risk, retention, and culture — mapped to financial exposure.",
      icon: "🧬",
    },
    {
      step: "03", title: "Prioritise",
      desc: "Receive a scored Executive Workforce Report. Overall risk score, top 3 business risks, root causes, and estimated cost.",
      icon: "📋",
    },
    {
      step: "04", title: "Act",
      desc: "A 30-day priority action plan with specific interventions, manager scripts, compliance steps, and success metrics.",
      icon: "🎯",
    },
  ];

  const engines = [
    { icon: "📄", name: "Policy Intelligence",       category: "Risk Detection",          color: "#fca5a5", href: "/tools/policy" },
    { icon: "⚖️", name: "Compliance Audit",          category: "Risk Detection",          color: "#fca5a5", href: "/compliance" },
    { icon: "📊", name: "Onboarding Analytics",      category: "Risk Detection",          color: "#fca5a5", href: "/tools/onboarding" },
    { icon: "🔥", name: "Burnout Early Warning",     category: "Retention & Burnout",     color: "#6ee7b7", href: "/tools/burnout" },
    { icon: "📓", name: "AI Journaling",             category: "Retention & Burnout",     color: "#6ee7b7", href: "/tools/journaling" },
    { icon: "🏃", name: "Cognitive Load Monitor",    category: "Retention & Burnout",     color: "#6ee7b7", href: "/tools/cogload" },
    { icon: "🎯", name: "Manager Coaching",          category: "Manager & Culture",       color: "#c4b5fd", href: "/tools/coaching" },
    { icon: "💬", name: "Standup Safety",            category: "Manager & Culture",       color: "#c4b5fd", href: "/tools/standup" },
    { icon: "💛", name: "Grief & Loss Companion",   category: "Manager & Culture",       color: "#c4b5fd", href: "/tools/grief" },
  ];

  const reportItems = [
    "Overall Workforce Risk Score (0–100)",
    "Risk breakdown by category with financial exposure",
    "Top 3 business risks with identified root causes",
    "Estimated cost to business if unaddressed",
    "30-day prioritised action plan",
    "9-engine intelligence breakdown",
  ];

  const mockCategories = [
    { label: "Workforce Risk",      score: 80, color: "#fca5a5" },
    { label: "Burnout & Retention", score: 68, color: "#fcd34d" },
    { label: "Manager & Culture",   score: 58, color: "#c4b5fd" },
  ];

  const testimonials = [
    {
      quote: "PsychFlo flagged a compliance gap that would have cost us £95,000 in tribunal fees. The ROI was immediate.",
      name: "Sarah M.", role: "HR Director, 400-person tech company",
    },
    {
      quote: "We replaced three separate HR tools with PsychFlo. The psychology-grounded insights are unlike anything else on the market.",
      name: "James T.", role: "CHRO, Professional Services firm",
    },
    {
      quote: "The policy audit turned a document our employees ignored into something they actually read and understood.",
      name: "Aisha K.", role: "People & Culture Manager",
    },
  ];

  const pricingPreview = [
    {
      name: "Workforce Risk Audit",
      price: "£750", period: "one-time",
      desc: "Board-ready risk report delivered in 48 hours. Policy review, compliance gaps, executive report, 30-day action plan.",
      cta: "Book Audit", href: "/founding", highlight: false,
    },
    {
      name: "Team Plan",
      price: "£100", period: "/month",
      desc: "Continuous monitoring across all 3 outcomes. Weekly reports, manager scorecards, Slack alerts. 7-day free trial.",
      cta: "Start Free Trial", href: "/pricing", highlight: true,
    },
    {
      name: "Growth Plan",
      price: "£300", period: "/month",
      desc: "Org-wide risk dashboard, department breakdowns, cost-of-burnout calculator, HR admin panel, and priority support.",
      cta: "Start Free Trial", href: "/pricing", highlight: false,
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
      <Nav />

      {/* ────────────────────────────────────────────────────────
          1. HERO
      ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingTop: "100px", paddingBottom: "96px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 16px", borderRadius: "999px", marginBottom: "32px", letterSpacing: "0.08em" }}>
          ✦ EXECUTIVE WORKFORCE INTELLIGENCE SYSTEM
        </div>

        <h1 style={{ fontSize: "54px", fontWeight: "800", color: "#f8fafc", margin: "0 0 28px", lineHeight: "1.07", letterSpacing: "-0.03em", maxWidth: "820px", marginLeft: "auto", marginRight: "auto" }}>
          Prevent resignations, burnout,<br />conflict, and HR risk<br />
          <span style={{ color: gold }}>before they cost your business.</span>
        </h1>

        <p style={{ fontSize: "19px", color: "rgba(255,255,255,0.45)", margin: "0 auto 20px", lineHeight: "1.75", maxWidth: "620px" }}>
          PsychFlo combines 9 AI psychology engines into one Executive Workforce Intelligence System — detecting people risk, explaining the business impact, and giving leaders a clear action plan.
        </p>

        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.25)", margin: "0 auto 44px", maxWidth: "480px" }}>
          Used by HR Directors, CHROs, and CEOs who need more than a wellbeing app.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "18px" }}>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "18px 40px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer", letterSpacing: "-0.01em" }}>
            Book a Workforce Risk Audit →
          </button>
          <button onClick={() => router.push("/report/executive")}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "18px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
            See Executive Report
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
          Free 5-minute diagnostic · No credit card required · Board-ready report in 48 hours
        </p>
      </section>

      {/* ────────────────────────────────────────────────────────
          2. PROBLEM — Hidden workforce risk is expensive
      ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "34px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Hidden workforce risk is expensive
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.35)", margin: "0 auto", maxWidth: "560px", lineHeight: "1.6" }}>
            Most companies discover it in a resignation email, a sick note, or a solicitor's letter. PsychFlo finds it 6–12 weeks earlier — when there is still time to act.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "40px" }}>
          {problems.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "30px", marginBottom: "12px" }}>{p.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: gold, marginBottom: "8px", letterSpacing: "-0.02em" }}>{p.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: "1.55" }}>{p.label}</div>
            </div>
          ))}
        </div>

        {/* Problem narrative strip */}
        <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "14px", padding: "24px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
            {[
              { icon: "📬", title: "The resignation lands", desc: "You find out your best performer is leaving. Replacement will take 6 months and cost £65,000." },
              { icon: "⚖️", title: "The solicitor's letter arrives", desc: "A tribunal claim lands on your desk. The policy gap that caused it was fixable for £750." },
              { icon: "🏥", title: "The sick note runs to weeks", desc: "A manager burned out silently for months. The signals were there — no-one was reading them." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "22px", marginTop: "2px" }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "#fca5a5", margin: "0 0 5px" }}>{item.title}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.6" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          3. THREE OUTCOMES
      ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "34px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Three outcomes. Nine AI engines.
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.35)", margin: "0 auto", maxWidth: "500px" }}>
            Every engine maps to a measurable business outcome — not just a feature.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
          {outcomes.map((o, i) => (
            <div key={i} onClick={() => router.push(o.href)} style={{ background: o.bg, border: `1px solid ${o.border}`, borderRadius: "18px", padding: "30px", cursor: "pointer", transition: "transform 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ fontSize: "34px", marginBottom: "14px" }}>{o.icon}</div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>{o.title}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 18px", lineHeight: "1.65" }}>{o.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
                {o.engines.map((eng, j) => (
                  <span key={j} style={{ fontSize: "10px", fontWeight: "600", color: o.accentColor, background: o.bg, border: `1px solid ${o.border}`, padding: "3px 9px", borderRadius: "999px" }}>
                    {eng}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: o.accentColor }}>{o.stat}</span>
                <span style={{ fontSize: "12px", fontWeight: "700", color: gold }}>Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          4. HOW IT WORKS
      ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "34px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Diagnose → Analyse → Prioritise → Act
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.35)", margin: "0 auto", maxWidth: "500px" }}>
            A structured process that turns workforce data into board-ready decisions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", position: "relative" }}>
          {/* Connector line */}
          <div style={{ position: "absolute", top: "36px", left: "12.5%", right: "12.5%", height: "1px", background: "rgba(201,168,76,0.2)", zIndex: 0 }} />

          {process.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px", position: "relative", zIndex: 1 }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "14px" }}>
                {p.icon}
              </div>
              <div style={{ fontSize: "10px", fontWeight: "800", color: gold, letterSpacing: "0.1em", marginBottom: "8px" }}>STEP {p.step}</div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>{p.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.65" }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
            Start Your Diagnostic →
          </button>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          5. EXECUTIVE REPORT PREVIEW
      ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", overflow: "hidden" }}>

          <div style={{ padding: "48px 48px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>

            {/* Left: copy */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "999px", marginBottom: "20px", letterSpacing: "0.06em" }}>
                EXECUTIVE WORKFORCE REPORT
              </div>
              <h2 style={{ fontSize: "30px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: "1.2" }}>
                A board-ready risk report in 48 hours
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px", lineHeight: "1.75" }}>
                Every audit produces a scored Executive Workforce Report — not a dashboard you have to interpret yourself, but a clear document your leadership team can act on immediately.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                {reportItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: gold, fontSize: "13px", marginTop: "1px" }}>✓</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={() => router.push("/diagnostic")}
                  style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
                  Get Your Report →
                </button>
                <button onClick={() => router.push("/report/executive")}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", padding: "13px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  See Sample
                </button>
              </div>
            </div>

            {/* Right: mock report card */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.25)", letterSpacing: "0.09em", marginBottom: "20px" }}>
                EXECUTIVE WORKFORCE REPORT · SAMPLE
              </div>

              {/* Overall score */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginBottom: "8px", letterSpacing: "0.07em" }}>OVERALL RISK SCORE</div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "52px", fontWeight: "900", color: "#fcd34d", lineHeight: 1 }}>72</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#fcd34d" }}>High Risk</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Immediate action recommended</div>
                  </div>
                </div>
              </div>

              {/* Category bars */}
              <div style={{ marginBottom: "20px" }}>
                {mockCategories.map((cat, i) => (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{cat.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: cat.color }}>{cat.score}/100</span>
                    </div>
                    <div style={{ height: "5px", background: "rgba(255,255,255,0.07)", borderRadius: "999px" }}>
                      <div style={{ height: "100%", width: `${cat.score}%`, background: cat.color, borderRadius: "999px" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Top risks */}
              <div style={{ paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", marginBottom: "10px" }}>TOP RISKS IDENTIFIED</div>
                {[
                  "Policy non-compliance: £45k tribunal exposure",
                  "3 managers in burnout danger zone",
                  "Onboarding failure rate: 2 of 4 recent hires",
                ].map((r, i) => (
                  <div key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "7px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ color: "#fca5a5", marginTop: "1px" }}>▲</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              {/* Estimated impact */}
              <div style={{ marginTop: "16px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "10px", padding: "14px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: gold, letterSpacing: "0.07em", marginBottom: "6px" }}>ESTIMATED BUSINESS IMPACT</div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: gold }}>£187,000</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>if unaddressed over 12 months</div>
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div style={{ padding: "24px 48px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "36px", display: "flex", gap: "40px" }}>
            {[
              { v: "48 hrs",  l: "Report delivery" },
              { v: "£750",    l: "One-time audit" },
              { v: "9",       l: "Engines analysing" },
              { v: "30 days", l: "Action plan horizon" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "20px", fontWeight: "800", color: gold }}>{s.v}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          6. 9 INTELLIGENCE ENGINES
      ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "34px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            9 AI Intelligence Engines
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.35)", margin: "0 auto", maxWidth: "500px" }}>
            Each engine is grounded in peer-reviewed organisational psychology research and mapped to a financial outcome.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
          {engines.map((e, i) => (
            <div key={i} onClick={() => router.push(e.href)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={el => el.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"}
              onMouseLeave={el => el.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
              <span style={{ fontSize: "26px", flexShrink: 0 }}>{e.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", marginBottom: "3px" }}>{e.name}</div>
                <div style={{ fontSize: "10px", fontWeight: "700", color: e.color, letterSpacing: "0.04em" }}>{e.category}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          TESTIMONIALS
      ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: 0, letterSpacing: "-0.02em" }}>What executives say</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "26px" }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.8", margin: "0 0 20px", fontStyle: "italic" }}>"{t.quote}"</p>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", margin: "0 0 3px" }}>{t.name}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          7. PRICING PREVIEW
      ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "96px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "34px", fontWeight: "700", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Start with an audit. Scale with a retainer.
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            No per-seat pricing. No annual lock-in. One price for your whole organisation.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
          {pricingPreview.map((p, i) => (
            <div key={i} style={{ background: p.highlight ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.04)", border: p.highlight ? `1px solid rgba(201,168,76,0.3)` : "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", position: "relative" }}>
              {p.highlight && (
                <div style={{ position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", fontSize: "11px", fontWeight: "800", padding: "3px 14px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                  Most popular
                </div>
              )}
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>{p.name}</h3>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "30px", fontWeight: "800", color: p.highlight ? gold : "#f8fafc" }}>{p.price}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginLeft: "5px" }}>{p.period}</span>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 22px", lineHeight: "1.65", flex: 1 }}>{p.desc}</p>
              <button onClick={() => router.push(p.href)}
                style={{ width: "100%", background: p.highlight ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.07)", border: p.highlight ? "none" : "1px solid rgba(255,255,255,0.1)", color: p.highlight ? "#0f172a" : "rgba(255,255,255,0.7)", padding: "12px", borderRadius: "9px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                {p.cta} →
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => router.push("/pricing")}
            style={{ background: "none", border: "none", color: gold, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
            View full pricing including Enterprise →
          </button>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          8. FINAL CTA — BOOK AUDIT
      ──────────────────────────────────────────────────────── */}
      <section style={{ ...section, paddingBottom: "80px" }}>
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "22px", padding: "64px 48px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 16px", borderRadius: "999px", marginBottom: "24px", letterSpacing: "0.08em" }}>
            ⭐ FOUNDING CLIENT PROGRAMME · 7 SPOTS REMAINING
          </div>

          <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: "1.15" }}>
            Ready to understand your people?
          </h2>

          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.4)", margin: "0 auto 36px", maxWidth: "500px", lineHeight: "1.75" }}>
            Book a Workforce Risk Audit. We review your policies, analyse your people signals, and deliver a board-ready Executive Report in 48 hours — with a 30-day action plan your leadership team can execute immediately.
          </p>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
            <button onClick={() => router.push("/diagnostic")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "18px 40px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}>
              Book a Workforce Risk Audit →
            </button>
            <button onClick={() => router.push("/founding")}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "18px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
              See Founding Offer
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
            £750 one-time · 48-hour delivery · Board-ready PDF included
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "36px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: "0 0 10px" }}>
          © 2026 PsychFlo · Organisational Psychology + AI Engineering
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "About", href: "/about" },
            { label: "Pricing", href: "/pricing" },
            { label: "Blog", href: "/blog" },
            { label: "Founding Programme", href: "/founding" },
            { label: "Status", href: "/status" },
            { label: "SLA", href: "/sla" },
          ].map((l, i) => (
            <button key={i} onClick={() => router.push(l.href)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: "12px", cursor: "pointer", padding: 0 }}>
              {l.label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
