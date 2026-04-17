"use client";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

export default function Blog() {
  const router = useRouter();
  const gold = "#c9a84c";

  const categories = ["All", "HR Strategy", "Psychology", "Compliance", "Productivity", "Leadership", "DEI"];
  const posts = [
    { category: "HR Strategy", title: "How to Turn Your HR Policy Into a Retention Tool", desc: "Most HR policies drive employees away. Here's how to rewrite them so they build trust and reduce turnover.", readTime: "5 min", date: "Apr 2026", hot: true },
    { category: "Compliance", title: "4 UK Employment Laws That Changed in 2024 — Is Your Policy Compliant?", desc: "The Workers Act, Flexible Working Act, Carer's Leave Act, and Neonatal Leave Act all changed employer obligations. Check your exposure.", readTime: "7 min", date: "Apr 2026", hot: true },
    { category: "Psychology", title: "The Neuroscience of Punitive Management — Why Fear Doesn't Work", desc: "What happens in the brain when employees receive a formal warning — and why it makes the problem worse.", readTime: "6 min", date: "Mar 2026", hot: false },
    { category: "Leadership", title: "What Great HR Directors Do Differently in the First 90 Days", desc: "Interviews with 12 HR Directors on the policies they rewrote first and why it changed their organisation.", readTime: "8 min", date: "Mar 2026", hot: false },
    { category: "Productivity", title: "The Hidden Tax of Unclear Policies on Your Engineering Team", desc: "Cognitive load research applied to software teams — how ambiguous HR policies reduce code quality.", readTime: "5 min", date: "Feb 2026", hot: false },
    { category: "DEI", title: "Is Your Attendance Policy Discriminatory? A Checklist for HR Teams", desc: "Seven questions to audit your attendance policy for hidden bias against disabled, neurodivergent, and carer employees.", readTime: "6 min", date: "Feb 2026", hot: false },
    { category: "Psychology", title: "Psychological Safety Is Not a Buzzword — Here's the Business Case", desc: "The ROI data behind Amy Edmondson's research, translated into language your CFO will understand.", readTime: "7 min", date: "Jan 2026", hot: false },
    { category: "HR Strategy", title: "Why Your Employees Don't Read Your Policies — And How to Fix It", desc: "Readability science applied to HR documents. Three rewrite techniques that increase comprehension by 74%.", readTime: "5 min", date: "Jan 2026", hot: false },
    { category: "Compliance", title: "Employment Tribunal Claims Are Up 23% — Here's What's Driving It", desc: "New tribunal data analysis with the most common claim types and what policy gaps create the most exposure.", readTime: "9 min", date: "Dec 2025", hot: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>

        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>FREE BLOG</div>
          <h1 style={{ fontSize: "38px", fontWeight: "800", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>The PsychFlo Blog</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.7" }}>Practical HR strategy, organisational psychology, and compliance insights for people leaders.</p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "36px" }}>
          {categories.map((c, i) => (
            <button key={i} style={{ background: i === 0 ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)", border: i === 0 ? `1px solid rgba(201,168,76,0.3)` : "1px solid rgba(255,255,255,0.08)", color: i === 0 ? gold : "rgba(255,255,255,0.4)", padding: "7px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {posts.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: p.hot ? `1px solid rgba(201,168,76,0.2)` : "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px", cursor: "pointer", position: "relative" }}>
              {p.hot && (
                <div style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(239,68,68,0.15)", color: "#fca5a5", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>TRENDING</div>
              )}
              <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", color: gold, padding: "3px 10px", borderRadius: "999px", marginBottom: "12px", display: "inline-block" }}>{p.category}</span>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", margin: "0 0 8px", lineHeight: "1.4", paddingRight: p.hot ? "60px" : "0" }}>{p.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 14px", lineHeight: "1.6" }}>{p.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{p.readTime}</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>·</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{p.date}</span>
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
