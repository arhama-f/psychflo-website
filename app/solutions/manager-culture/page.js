"use client";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const engines = [
  { icon: "🎯", name: "Manager Coaching Engine", desc: "AI roleplay for difficult conversations — underperformance, conflict, burnout signals, PIPs. Scored feedback with psychological safety frameworks.", stat: "4 scenario types", href: "/tools/coaching" },
  { icon: "📊", name: "Manager Effectiveness Engine", desc: "Scores every manager on team burnout impact, psychological safety contribution, and attrition risk. A+ to D grading with coaching actions.", stat: "Objective manager scoring", href: "/manager-effectiveness" },
  { icon: "📓", name: "Onboarding Analytics Engine", desc: "90-day psychological safety tracker for new hires. Automated check-ins at days 7, 14, 30, 60, 90 with cohort benchmarking.", stat: "90-day new hire window", href: "/tools/onboarding" },
  { icon: "💔", name: "Grief & Loss Companion", desc: "Evidence-based bereavement support using attachment theory. Gives managers language and frameworks for supporting employees through loss.", stat: "Attachment-theory grounded", href: "/tools/grief" },
];

const outcomes = [
  { metric: "3×", label: "More likely to retain top performers under high-scoring managers" },
  { metric: "67%", label: "Of employees cite manager relationship as #1 reason for leaving" },
  { metric: "£28k", label: "Avg cost of replacing a mid-level manager" },
  { metric: "8 wks", label: "Time to first measurable culture improvement" },
];

export default function ManagerCulturePage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 60px" }}>

        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#c4b5fd", fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "24px", letterSpacing: "0.06em" }}>
            🧠 MANAGER & CULTURE INTELLIGENCE
          </div>
          <h1 style={{ fontSize: "44px", fontWeight: "800", color: "#f8fafc", margin: "0 0 20px", lineHeight: "1.1", letterSpacing: "-0.03em" }}>
            Culture is built or broken<br /><span style={{ color: gold }}>at the manager layer</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", margin: "0 0 36px", lineHeight: "1.7", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            67% of employees leave because of their manager, not the company. PsychFlo scores every manager objectively, identifies culture risk, and gives leaders a concrete coaching plan — not vague feedback.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Run Manager Diagnostic →
          </button>
        </div>

        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 24px", textAlign: "center" }}>What the data shows</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {outcomes.map((o, i) => (
              <div key={i} style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: "14px", padding: "22px", textAlign: "center" }}>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#c4b5fd", marginBottom: "8px" }}>{o.metric}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{o.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>AI Intelligence Engines in this solution</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>4 of 9 engines focused on manager effectiveness and culture</p>
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

        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px" }}>Score your managers. Fix your culture.</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>Get an objective manager effectiveness report with coaching priorities in 48 hours.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/diagnostic")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>Book Manager Audit →</button>
            <button onClick={() => router.push("/pricing")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>See Pricing →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
