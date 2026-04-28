"use client";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const engines = [
  { icon: "🔥", name: "Burnout Early Warning Engine", desc: "Detects burnout 6–8 weeks before it becomes absenteeism or resignation. Uses the Maslach Burnout Inventory across 3 dimensions.", stat: "6–8 week early warning", href: "/tools/burnout" },
  { icon: "📓", name: "AI Journaling Engine", desc: "CBT-grounded private journaling with pattern detection. Surfaces stress themes and emotional load trends across your workforce.", stat: "Sentiment pattern detection", href: "/tools/journaling" },
  { icon: "💬", name: "Daily Pulse Engine", desc: "60-second daily check-ins with AI micro-coaching. Tracks mood, energy, workload, and connection across the team.", stat: "Daily wellbeing signal", href: "/pulse" },
  { icon: "🏃", name: "Cognitive Load Engine", desc: "Measures deep work fragmentation and flow state for engineering and knowledge workers. Prevents invisible burnout from meeting overload.", stat: "Flow state protection", href: "/tools/cogload" },
];

const stats = [
  { value: "£50–100k", label: "Cost of one senior resignation", icon: "💸" },
  { value: "6–8 wks", label: "How early PsychFlo detects burnout", icon: "⏱️" },
  { value: "74%", label: "Reduction in undetected burnout cases", icon: "📉" },
  { value: "£287k", label: "Avg annual prevention value", icon: "🛡️" },
];

export default function RetentionPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 60px" }}>

        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7", fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "24px", letterSpacing: "0.06em" }}>
            🔥 RETENTION & BURNOUT PREVENTION
          </div>
          <h1 style={{ fontSize: "44px", fontWeight: "800", color: "#f8fafc", margin: "0 0 20px", lineHeight: "1.1", letterSpacing: "-0.03em" }}>
            Stop losing your best people<br /><span style={{ color: gold }}>to invisible burnout</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", margin: "0 0 36px", lineHeight: "1.7", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            Burnout doesn't announce itself. It accumulates quietly over weeks until the resignation letter lands. PsychFlo's retention engines detect the signal 6–8 weeks early — giving leaders time to act.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Run Retention Diagnostic →
          </button>
        </div>

        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 24px", textAlign: "center" }}>The numbers companies ignore</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "14px", padding: "22px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#6ee7b7", marginBottom: "6px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>AI Intelligence Engines in this solution</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>4 of 9 engines focused on burnout detection and retention</p>
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
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px" }}>Start preventing burnout this week</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>Run a retention diagnostic and get your burnout risk score in under 5 minutes.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/diagnostic")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>Run Free Diagnostic →</button>
            <button onClick={() => router.push("/solutions/manager-culture")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>See Manager Solution →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
