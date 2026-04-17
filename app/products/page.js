"use client";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

export default function Products() {
  const router = useRouter();
  const gold = "#c9a84c";

  const products = [
    { icon: "📄", name: "HR Policy Translator", tag: "LIVE", tagColor: "#10b981", price: "From £49/mo", desc: "Upload any HR policy and get plain-language summaries, tribunal risk scores, DEI analysis, burnout forecasting, compliance flags, and board-ready reports — powered by 19 AI models.", features: ["Plain-language summary + FAQs", "Employment tribunal risk score", "ML turnover forecast", "Burnout prediction", "DEI scorecard", "Compliance flags", "Board report", "Policy rewriter"], href: "/tools/policy", cta: "Try free now" },
    { icon: "🔥", name: "Burnout Early Warning", tag: "NEW", tagColor: "#10b981", price: "From £5/user/mo", desc: "Opt-in weekly micro check-ins that surface team energy trends before they become crises. Manager gets a simple dashboard — no individual surveillance.", features: ["Weekly pulse check-ins", "Team energy trend dashboard", "Slack integration", "Manager coaching prompts", "Anonymised team reports", "Early intervention alerts"], href: "/tools/burnout", cta: "Try free now" },
    { icon: "📓", name: "AI Journaling App", tag: "COMING SOON", tagColor: "#f59e0b", price: "£7–12/mo", desc: "CBT and ACT-grounded journaling that applies clinical psychology frameworks to free-text entries. Surfaces cognitive distortions, mood patterns, and reflective prompts.", features: ["CBT & ACT frameworks", "Cognitive distortion detection", "Mood pattern analysis", "Reflective prompts", "Progress tracking", "Completely private"], href: "/products", cta: "Join waitlist" },
    { icon: "🎯", name: "Manager Coaching Platform", tag: "COMING SOON", tagColor: "#f59e0b", price: "£49/mo individual", desc: "AI roleplay for first-time managers — practice difficult conversations, receive feedback grounded in organisational psychology, and track growth over time.", features: ["AI conversation roleplay", "Psychology-grounded feedback", "Difficult conversation practice", "Growth tracking", "Team licence available", "360 feedback integration"], href: "/products", cta: "Join waitlist" },
    { icon: "🧠", name: "UX Research Copilot", tag: "COMING SOON", tagColor: "#f59e0b", price: "£99–299/mo", desc: "Auto-synthesise user interviews — transcription, thematic coding, emotional signal detection, and insight reports. Sells to product teams without dedicated researchers.", features: ["Auto transcription", "Thematic coding", "Emotional signal detection", "Insight report generation", "Team collaboration", "Export to Notion/Confluence"], href: "/products", cta: "Join waitlist" },
    { icon: "📊", name: "Onboarding Analytics", tag: "COMING SOON", tagColor: "#f59e0b", price: "£200–600/mo", desc: "Track new hire psychological safety, ramp confidence, and manager touchpoint quality in the first 90 days — the window with the highest attrition risk.", features: ["90-day journey tracking", "Psychological safety pulse", "Manager touchpoint quality", "HRIS integration", "Attrition risk alerts", "Cohort comparison"], href: "/products", cta: "Join waitlist" },
    { icon: "💬", name: "Async Standup + Psych Safety", tag: "COMING SOON", tagColor: "#f59e0b", price: "£6–10/user/mo", desc: "Async standup with NLP layer that scores psychological safety patterns across the team over time. Slack and Teams add-on — distribution built in.", features: ["Async standup collection", "Psych safety NLP scoring", "Slack & Teams integration", "Team trend dashboard", "Manager digest", "Historical analysis"], href: "/products", cta: "Join waitlist" },
    { icon: "💔", name: "Grief & Loss Companion", tag: "COMING SOON", tagColor: "#f59e0b", price: "£9–15/mo", desc: "Guided companion using Worden's tasks and continuing bonds theory. Evidence-based bereavement support for the massively underserved digital grief space.", features: ["Worden's tasks framework", "Continuing bonds model", "Daily check-ins", "Memory journaling", "Community support", "Crisis signposting"], href: "/products", cta: "Join waitlist" },
    { icon: "🏃", name: "Dev Cognitive Load Monitor", tag: "COMING SOON", tagColor: "#f59e0b", price: "£8–15/dev/mo", desc: "Surfaces context-switching cost, meeting overload, and flow state disruption from GitHub, Jira, and Calendar data. Engineering managers are the buyer.", features: ["GitHub integration", "Jira integration", "Calendar analysis", "Flow state tracking", "Context-switch scoring", "Team load dashboard"], href: "/products", cta: "Join waitlist" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>9 PRODUCTS</div>
          <h1 style={{ fontSize: "38px", fontWeight: "800", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>Everything your people team needs</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: "520px", marginLeft: "auto", marginRight: "auto", lineHeight: "1.7" }}>One platform built on organisational psychology. Each tool works alone — together they give you a complete picture of your workforce.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {products.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: p.tag === "LIVE" ? `1px solid rgba(201,168,76,0.25)` : "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", display: "grid", gridTemplateColumns: "1fr auto", gap: "24px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "24px" }}>{p.icon}</span>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>{p.name}</h3>
                  <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px", background: p.tag === "LIVE" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.12)", color: p.tag === "LIVE" ? "#6ee7b7" : "#fcd34d" }}>{p.tag}</span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 16px", lineHeight: "1.6", maxWidth: "520px" }}>{p.desc}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {p.features.map((f, j) => (
                    <span key={j} style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", padding: "3px 10px", borderRadius: "999px" }}>{f}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", minWidth: "140px" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: gold }}>{p.price}</div>
                </div>
                <button onClick={() => router.push(p.href)}
                  style={{ background: p.tag === "LIVE" ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.08)", border: p.tag === "LIVE" ? "none" : "1px solid rgba(255,255,255,0.12)", color: p.tag === "LIVE" ? "#0f172a" : "#f8fafc", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
