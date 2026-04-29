"use client";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const engines = [
  { icon: "📄", name: "Policy Intelligence Engine", desc: "Scans HR policies for tribunal risk, compliance gaps, and comprehension failures before they become legal exposure.", stat: "119x ROI on policy review", href: "/tools/policy" },
  { icon: "⚖️", name: "Compliance Audit Engine", desc: "Maps your people practices against ISO 45003, UK HSE, and EU Mental Health at Work frameworks. Generates audit-ready evidence packs.", stat: "12 compliance clauses tracked", href: "/compliance" },
  { icon: "📊", name: "Onboarding Risk Engine", desc: "Tracks new hire psychological safety across the critical 90-day window. Flags early disengagement before attrition happens.", stat: "90-day risk window", href: "/tools/onboarding" },
  { icon: "💬", name: "Async Standup Safety Engine", desc: "Analyses standup language for blocker patterns, frustration signals, and team psychological safety deterioration.", stat: "Real-time NLP scoring", href: "/tools/standup" },
];

const risks = [
  { cost: "£30k–£100k", label: "Average employment tribunal award", icon: "⚖️" },
  { cost: "£50k–£150k", label: "Cost of replacing a senior employee", icon: "👤" },
  { cost: "£1,300/yr", label: "Per employee cost of presenteeism", icon: "📉" },
  { cost: "£56bn", label: "Annual UK cost of poor mental health at work", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
];

export default function WorkforceRiskPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "24px", letterSpacing: "0.06em" }}>
            ⚠️ WORKFORCE RISK DETECTION
          </div>
          <h1 style={{ fontSize: "44px", fontWeight: "800", color: "#f8fafc", margin: "0 0 20px", lineHeight: "1.1", letterSpacing: "-0.03em" }}>
            Detect hidden HR risk<br /><span style={{ color: gold }}>before it becomes a crisis</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", margin: "0 0 36px", lineHeight: "1.7", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            Most companies discover workforce risk in a solicitor's letter or a resignation email. PsychFlo's risk detection engines surface legal exposure, compliance gaps, and attrition signals 6–12 weeks before they escalate.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Run Workforce Risk Diagnostic →
          </button>
        </div>

        {/* Cost of risk */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 24px", textAlign: "center" }}>The cost of undetected risk</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {risks.map((r, i) => (
              <div key={i} style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "14px", padding: "22px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{r.icon}</div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#fca5a5", marginBottom: "6px" }}>{r.cost}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Engines */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>AI Intelligence Engines in this solution</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>4 of 9 engines focused on risk detection and compliance</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "14px" }}>
            {engines.map((e, i) => (
              <div key={i} onClick={() => router.push(e.href)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "24px", cursor: "pointer" }}
                onMouseEnter={el => el.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"}
                onMouseLeave={el => el.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{e.icon}</div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>{e.name}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 14px", lineHeight: "1.6" }}>{e.desc}</p>
                <div style={{ fontSize: "11px", fontWeight: "700", color: gold }}>{e.stat}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px" }}>Book a Workforce Risk Audit</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>We review your policies, processes, and people data. You get a board-ready risk report in 48 hours.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/diagnostic")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>Book Audit — £750 →</button>
            <button onClick={() => router.push("/solutions/retention-burnout")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>See Retention Solution →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
