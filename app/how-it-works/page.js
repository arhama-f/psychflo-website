"use client";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

export default function HowItWorks() {
  const router = useRouter();

  const steps = [
    {
      num: "01", title: "Book a Workforce Risk Audit or run the free diagnostic",
      desc: "Start with a 5-minute diagnostic or book a full $750 audit. Tell us your company size, industry, and biggest people challenges. No credit card required for the diagnostic.",
      detail: ["Takes 3–5 minutes", "Covers 4 risk dimensions", "Immediate risk score on completion", "No credit card required"],
      icon: "📋",
    },
    {
      num: "02", title: "9 AI engines analyse your workforce signals",
      desc: "Behind the scenes, PsychFlo's 9 AI intelligence engines — each grounded in peer-reviewed organisational psychology — analyse your data across three outcome areas: workforce risk, burnout & retention, and manager & culture.",
      detail: ["Policy & compliance risk scoring", "Burnout signal detection", "Manager effectiveness grading", "Industry benchmark comparison"],
      icon: "🧠",
    },
    {
      num: "03", title: "You receive a scored Executive Workforce Report",
      desc: "Within 48 hours, you receive a board-ready Executive Workforce Report. It scores your organisation across three risk categories, identifies your top 3 business risks, and estimates the financial impact of each.",
      detail: ["Overall workforce risk score (0–100)", "Risk by category with financial impact", "Top 3 business risks with root causes", "Comparison to industry benchmarks"],
      icon: "📊",
    },
    {
      num: "04", title: "A 30-day priority action plan lands in your inbox",
      desc: "The report includes a concrete 30-day action plan — specific interventions, manager coaching scripts, policy rewrites, and compliance steps. Not generic recommendations. Specific actions for your organisation.",
      detail: ["Week-by-week action plan", "Manager coaching scripts included", "Policy rewrite recommendations", "Compliance steps with deadlines"],
      icon: "🎯",
    },
    {
      num: "05", title: "Optional: continuous monitoring via a monthly retainer",
      desc: "If you want ongoing intelligence rather than a one-time audit, our Growth ($2,000/mo) and Executive ($3,500/mo) plans give you continuous monitoring, weekly reports, and a dedicated success manager.",
      detail: ["Weekly risk reports", "Real-time burnout alerts", "Manager scorecards updated monthly", "Dedicated success manager"],
      icon: "🔄",
    },
  ];

  const engines = [
    { icon: "📄", name: "Policy Intelligence Engine", outcome: "Workforce Risk", desc: "Tribunal risk scoring, comprehension analysis, regulatory alerts" },
    { icon: "🔥", name: "Burnout Early Warning Engine", outcome: "Retention", desc: "Maslach Inventory, 6–8 week early detection, manager scripts" },
    { icon: "📓", name: "AI Journaling Engine", outcome: "Retention", desc: "CBT-grounded, pattern detection, sentiment trends" },
    { icon: "🎯", name: "Manager Coaching Engine", outcome: "Culture", desc: "AI roleplay, 4 scenario types, psychological safety scoring" },
    { icon: "🧠", name: "UX Research Copilot", outcome: "Culture", desc: "Interview synthesis, theme extraction, insight generation" },
    { icon: "📊", name: "Onboarding Analytics Engine", outcome: "Workforce Risk", desc: "90-day tracker, cohort benchmarking, early disengagement flags" },
    { icon: "💬", name: "Async Standup Safety Engine", outcome: "Workforce Risk", desc: "NLP blocker detection, frustration signals, safety scoring" },
    { icon: "💔", name: "Grief & Loss Companion", outcome: "Culture", desc: "Attachment theory, bereavement support, manager frameworks" },
    { icon: "🏃", name: "Cognitive Load Engine", outcome: "Retention", desc: "Flow state protection, meeting overload detection, scheduling" },
  ];

  const outcomeColor = { "Workforce Risk": "#fca5a5", "Retention": "#6ee7b7", "Culture": "#c4b5fd" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "80px 24px 80px" }}>

        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "20px", letterSpacing: "0.06em" }}>
            HOW IT WORKS
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#f8fafc", margin: "0 0 18px", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            From diagnostic to action plan<br /><span style={{ color: gold }}>in 48 hours</span>
          </h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.4)", margin: "0 0 32px", lineHeight: "1.7", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
            PsychFlo turns workforce signals into board-ready decisions — using 9 AI psychology engines and a structured 5-step process.
          </p>
          <button onClick={() => router.push("/diagnostic")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Start Free Diagnostic →
          </button>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: "80px" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "24px", marginBottom: "48px", alignItems: "start" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>{s.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: "800", color: gold, letterSpacing: "0.08em" }}>{s.num}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px", lineHeight: "1.3" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: "0 0 16px", lineHeight: "1.7" }}>{s.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {s.detail.map((d, j) => (
                    <span key={j} style={{ fontSize: "11px", color: gold, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", padding: "4px 10px", borderRadius: "999px", fontWeight: "600" }}>✓ {d}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 9 engines */}
        <div style={{ marginBottom: "72px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>9 AI Intelligence Engines</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: 0 }}>Each engine is grounded in peer-reviewed organisational psychology research.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
            {engines.map((e, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "18px" }}>
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>{e.icon}</div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: outcomeColor[e.outcome], marginBottom: "4px" }}>{e.outcome}</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", marginBottom: "6px" }}>{e.name}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{e.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px" }}>Ready to detect your workforce risk?</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>Start with the free diagnostic or book a full audit. Results in 48 hours.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/diagnostic")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
              Book Workforce Risk Audit — $750 →
            </button>
            <button onClick={() => router.push("/diagnostic")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              Run Free Diagnostic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
