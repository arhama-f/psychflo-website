"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import { posts } from "./posts";

export default function Blog() {
  const router = useRouter();
  const gold = "#c9a84c";
  const [activeCategory, setActiveCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const categories = ["All", "HR Strategy", "Psychology", "Compliance", "Productivity", "Leadership", "DEI"];
  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>FREE BLOG</div>
          <h1 style={{ fontSize: "38px", fontWeight: "800", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>The PsychFlo Blog</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.7" }}>Practical HR strategy, organisational psychology, and compliance insights for people leaders.</p>
        </div>

        {/* Newsletter */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "16px", padding: "28px 32px", marginBottom: "40px" }}>
          {subscribed ? (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <p style={{ fontSize: "15px", fontWeight: "700", color: gold, margin: "0 0 6px" }}>You&apos;re on the list.</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>New posts land in your inbox every two weeks.</p>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px" }}>Get new posts in your inbox</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>Every two weeks. No spam. Unsubscribe anytime.</p>
              </div>
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", outline: "none", width: "220px" }}
                />
                <button type="submit"
                  style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                  Subscribe →
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "36px" }}>
          {categories.map((c) => {
            const active = c === activeCategory;
            return (
              <button key={c} onClick={() => setActiveCategory(c)}
                style={{ background: active ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)", border: active ? `1px solid rgba(201,168,76,0.3)` : "1px solid rgba(255,255,255,0.08)", color: active ? gold : "rgba(255,255,255,0.4)", padding: "7px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
                {c}
              </button>
            );
          })}
        </div>

        {/* Posts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {filtered.map((p) => (
            <div key={p.slug} onClick={() => router.push(`/blog/${p.slug}`)}
              style={{ background: "rgba(255,255,255,0.04)", border: p.hot ? `1px solid rgba(201,168,76,0.2)` : "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px", cursor: "pointer", position: "relative", transition: "border-color 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = p.hot ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
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
