"use client";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

export default function Research() {
  const router = useRouter();
  const gold = "#c9a84c";

  const featured = {
    title: "The True Cost of a Bad HR Policy: A UK Analysis",
    desc: "We analysed 1,200 UK employment tribunal cases and 400 HR policy documents to quantify the financial and psychological cost of poorly written workplace policies. The findings are striking.",
    tags: ["Tribunal Risk", "Policy Design", "Organisational Psychology"],
    readTime: "12 min read",
    date: "April 2026",
  };

  const articles = [
    { title: "Psychological Safety at Work: What the Research Actually Says", desc: "Amy Edmondson's framework explained for HR practitioners — and how to measure it in your organisation.", tags: ["Psych Safety", "Research"], readTime: "8 min", date: "Mar 2026" },
    { title: "The Burnout Epidemic: UK Workplace Data 2025–2026", desc: "New data on burnout prevalence across UK industries, with sector-by-sector breakdown and intervention evidence.", tags: ["Burnout", "Data"], readTime: "10 min", date: "Mar 2026" },
    { title: "DEI Policy Benchmarks by UK Industry", desc: "How does your DEI policy compare to industry peers? Benchmarks across 8 sectors with scoring methodology.", tags: ["DEI", "Benchmarks"], readTime: "7 min", date: "Feb 2026" },
    { title: "Why Employees Don't Read HR Policies — And What To Do About It", desc: "Cognitive load theory applied to workplace policy design. Evidence-based strategies for improving comprehension.", tags: ["Cognitive Load", "Policy Design"], readTime: "6 min", date: "Feb 2026" },
    { title: "The Psychology of Punitive vs Supportive Management Language", desc: "How the words in your policies shape employee behaviour, trust, and psychological safety — with rewrite examples.", tags: ["Language", "Psychology"], readTime: "9 min", date: "Jan 2026" },
    { title: "Employment Tribunal Prevention: What HR Directors Need to Know in 2026", desc: "The most common tribunal claim types, what triggers them, and how policy gaps create legal exposure.", tags: ["Legal", "Compliance"], readTime: "11 min", date: "Jan 2026" },
    { title: "Cognitive Load and Productivity: The Hidden Cost of Unclear Policies", desc: "Research on how policy complexity affects decision-making quality and output — with quantified impact estimates.", tags: ["Cognitive Load", "Productivity"], readTime: "7 min", date: "Dec 2025" },
    { title: "The First 90 Days: Psychological Safety and New Hire Retention", desc: "Why onboarding is the highest-risk period for attrition and what the research says about preventing it.", tags: ["Onboarding", "Retention"], readTime: "8 min", date: "Dec 2025" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>

        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>FREE RESEARCH</div>
          <h1 style={{ fontSize: "38px", fontWeight: "800", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>Research hub</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.7", maxWidth: "520px" }}>Evidence-based research on organisational psychology, workplace policy, and people analytics. Free for everyone.</p>
        </div>

        <div style={{ background: `linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))`, border: `1px solid rgba(201,168,76,0.2)`, borderRadius: "20px", padding: "36px", marginBottom: "40px", cursor: "pointer" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.15)", color: gold, fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px", marginBottom: "14px" }}>FEATURED RESEARCH</div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.01em" }}>{featured.title}</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: "0 0 16px", lineHeight: "1.7" }}>{featured.desc}</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {featured.tags.map((t, i) => (
              <span key={i} style={{ fontSize: "11px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", padding: "3px 10px", borderRadius: "999px" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{featured.readTime}</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{featured.date}</span>
            <button style={{ marginLeft: "auto", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "9px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Read research</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {articles.map((a, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                {a.tags.map((t, j) => (
                  <span key={j} style={{ fontSize: "10px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", padding: "2px 8px", borderRadius: "999px" }}>{t}</span>
                ))}
              </div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", margin: "0 0 8px", lineHeight: "1.4" }}>{a.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 14px", lineHeight: "1.6" }}>{a.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{a.readTime}</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>·</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{a.date}</span>
                </div>
                <span style={{ fontSize: "12px", color: gold, fontWeight: "600" }}>Read →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
