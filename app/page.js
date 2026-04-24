"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

export default function Home() {
  const router = useRouter();
  const gold = "#c9a84c";

  const products = [
    { icon: "📄", name: "Policy Translator", desc: "Plain-language summaries + tribunal risk scoring", href: "/tools/policy", live: true },
    { icon: "🔥", name: "Burnout Early Warning", desc: "Opt-in pulse checks that surface team energy trends", href: "/tools/burnout", live: true },
    { icon: "📓", name: "AI Journaling", desc: "CBT-grounded journaling with pattern detection", href: "/tools/journaling", live: true },
    { icon: "🎯", name: "Manager Coaching", desc: "AI roleplay for difficult conversations", href: "/tools/coaching", live: true },
    { icon: "🧠", name: "UX Research Copilot", desc: "Auto-synthesise user interviews into insights", href: "/tools/ux-research", live: true },
    { icon: "📊", name: "Onboarding Analytics", desc: "90-day new hire psychological safety tracker", href: "/tools/onboarding", live: true },
    { icon: "💬", name: "Async Standup + Psych Safety", desc: "Standup scorer with NLP safety analysis", href: "/tools/standup", live: true },
    { icon: "💔", name: "Grief & Loss Companion", desc: "Evidence-based bereavement support app", href: "/tools/grief", live: true },
    { icon: "🏃", name: "Dev Cognitive Load Monitor", desc: "Flow state protection for engineering teams", href: "/tools/cogload", live: true },
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
  const blogPosts = [
    { slug: "hr-policy-retention-tool", category: "HR Strategy", title: "How to Turn Your HR Policy Into a Retention Tool", desc: "Most HR policies drive employees away. Here's how to rewrite them so they build trust and reduce turnover.", readTime: "5 min", date: "Apr 2026" },
    { slug: "uk-employment-laws-2024", category: "Compliance", title: "4 UK Employment Laws That Changed in 2024 — Is Your Policy Compliant?", desc: "The Workers Act, Flexible Working Act, Carer's Leave Act, and Neonatal Leave Act all changed employer obligations. Check your exposure.", readTime: "7 min", date: "Apr 2026" },
    { slug: "psychological-safety-business-case", category: "Psychology", title: "Psychological Safety Is Not a Buzzword — Here's the Business Case", desc: "The ROI data behind Amy Edmondson's research, translated into language your CFO will understand.", readTime: "7 min", date: "Jan 2026" },
  ];
  const liveProducts = products.filter((product) => product.live);

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
            Try 1 HR policy page free
          </button>
          <button onClick={() => router.push("/learn")}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "16px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
            Explore Microlearn
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>Free access includes 1 HR policy page only</p>
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
          <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Find live apps fast</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Live products are shown first so visitors can jump straight into what is already available.</p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#6ee7b7", fontSize: "11px", fontWeight: "700", padding: "6px 12px", borderRadius: "999px", letterSpacing: "0.06em", marginBottom: "16px" }}>
            LIVE NOW
            <span style={{ color: "rgba(255,255,255,0.45)" }}>{liveProducts.length} APPS</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "28px" }}>
            {liveProducts.map((p, i) => (
              <div key={i} onClick={() => router.push(p.href)}
                style={{ background: "rgba(201,168,76,0.06)", border: `1px solid rgba(16,185,129,0.25)`, borderRadius: "14px", padding: "22px", cursor: "pointer", transition: "all 0.15s", position: "relative" }}>
                <div style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>LIVE</div>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{p.icon}</div>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px", paddingRight: "52px" }}>{p.name}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 16px", lineHeight: "1.5" }}>{p.desc}</p>
                <div style={{ fontSize: "12px", fontWeight: "700", color: gold }}>Open app →</div>
              </div>
            ))}
          </div>
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

        <div style={{ marginBottom: "80px" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
            <div>
              <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "14px", letterSpacing: "0.06em" }}>FROM THE BLOG</div>
              <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Practical insights for HR and people leaders</h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.7", maxWidth: "560px" }}>Make the blog visible right from the homepage with strategy, compliance, and psychology articles your visitors can open immediately.</p>
            </div>
            <button onClick={() => router.push("/blog")}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "12px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              View all blog posts
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
            {blogPosts.map((post, i) => (
              <div key={i} onClick={() => router.push(`/blog/${post.slug}`)}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px", cursor: "pointer" }}>
                <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", color: gold, padding: "3px 10px", borderRadius: "999px", marginBottom: "12px", display: "inline-block" }}>{post.category}</span>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px", lineHeight: "1.5" }}>{post.title}</h3>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 14px", lineHeight: "1.6" }}>{post.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{post.readTime}</span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>·</span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{post.date}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: gold, fontWeight: "700" }}>Read →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Ready to understand your people?</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>Start with one free HR policy page, then upgrade for full access.</p>
          <button onClick={() => router.push("/tools/policy")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Try 1 page free
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
