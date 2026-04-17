"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

export default function Home() {
  const router = useRouter();
  const gold = "#c9a84c";

  const products = [
    { icon: "📄", name: "Policy Translator", desc: "Plain-language summaries + tribunal risk scoring", href: "/tools/policy", live: true },
    { icon: "🔥", name: "Burnout Early Warning", desc: "Opt-in pulse checks that surface team energy trends", href: "/tools/burnout", live: true },
    { icon: "📓", name: "AI Journaling", desc: "CBT-grounded journaling with pattern detection", href: "/products", live: false },
    { icon: "🎯", name: "Manager Coaching", desc: "AI roleplay for difficult conversations", href: "/products", live: false },
    { icon: "🧠", name: "UX Research Copilot", desc: "Auto-synthesise user interviews into insights", href: "/products", live: false },
    { icon: "📊", name: "Onboarding Analytics", desc: "90-day new hire psychological safety tracker", href: "/products", live: false },
    { icon: "💬", name: "Async Standup + Psych Safety", desc: "Standup scorer with NLP safety analysis", href: "/products", live: false },
    { icon: "💔", name: "Grief & Loss Companion", desc: "Evidence-based bereavement support app", href: "/products", live: false },
    { icon: "🏃", name: "Dev Cognitive Load Monitor", desc: "Flow state protection for engineering teams", href: "/products", live: false },
  ];

  const stats = [
    { value: "£287k", label: "avg annual cost prevented" },
    { value: "119x", label: "average policy ROI" },
    { value: "74%", label: "comprehension improvement" },
    { value: "9", label: "AI-powered products" },
  ];

  const testimonials = [
    { quote: "PsychFlo flagged a compliance gap that would have cost us £95,000 in tribunal fees. The ROI was immediate.", name: "Sarah M.", role: "HR Director, 400-person tech company" },
    { quote: "We replaced three separate HR tools with PsychFlo. The psychology-grounded insights are unlike anything else in the market.", name: "James T.", role: "CHRO, Professional Services firm" },
    { quote: "The policy translator turned a document our employees ignored into something they actually read and understood.", name: "Aisha K.", role: "People & Culture Manager" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "24px", letterSpacing: "0.06em" }}>
          ORGANISATIONAL PSYCHOLOGY + AI ENGINEERING
        </div>
        <h1 style={{ fontSize: "52px", fontWeight: "800", color: "#f8fafc", margin: "0 0 20px", lineHeight: "1.1", letterSpacing: "-0.03em" }}>
          The AI platform that applies<br /><span style={{ color: gold }}>psychology to your workforce</span>
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", margin: "0 0 40px", lineHeight: "1.7", maxWidth: "620px", marginLeft: "auto", marginRight: "auto" }}>
          9 AI-powered tools built on organisational psychology research. Prevent tribunal risk, reduce burnout, improve retention, and build psychologically safe workplaces — all in one platform.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          <button onClick={() => router.push("/tools/policy")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Try Policy Translator free
          </button>
          <button onClick={() => router.push("/products")}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "16px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
            See all 9 products
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>No credit card required · First 3 analyses free</p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "80px" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "800", color: gold, marginBottom: "6px" }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>9 products. One platform.</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Each tool works standalone. Together they transform how your organisation understands people.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "80px" }}>
          {products.map((p, i) => (
            <div key={i} onClick={() => router.push(p.href)}
              style={{ background: "rgba(255,255,255,0.04)", border: p.live ? `1px solid rgba(201,168,76,0.25)` : "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px", cursor: "pointer", transition: "all 0.15s", position: "relative" }}>
              {p.live && (
                <div style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>LIVE</div>
              )}
              {!p.live && (
                <div style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)", fontSize: "10px", fontWeight: "600", padding: "2px 8px", borderRadius: "999px" }}>SOON</div>
              )}
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{p.icon}</div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", margin: "0 0 6px" }}>{p.name}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.5" }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>What our customers say</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "80px" }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px" }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", margin: "0 0 16px", fontStyle: "italic" }}>"{t.quote}"</p>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", margin: "0 0 2px" }}>{t.name}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Ready to understand your people?</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>Start with the Policy Translator — free, no card required.</p>
          <button onClick={() => router.push("/tools/policy")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Start for free
          </button>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
          © 2026 PsychFlo · Organisational Psychology + AI Engineering ·
          <span onClick={() => router.push("/about")} style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer", marginLeft: "8px" }}>About</span> ·
          <span onClick={() => router.push("/pricing")} style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer", marginLeft: "8px" }}>Pricing</span> ·
          <span onClick={() => router.push("/research")} style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer", marginLeft: "8px" }}>Research</span>
        </p>
      </div>
    </div>
  );
}
