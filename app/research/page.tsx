"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const ARTICLES = [
  {
    category: "Burnout Science",
    tag: "Research",
    title: "Behavioural signal latency: How early can burnout be predicted?",
    desc: "Analysis of signal-to-outcome timing across 14 organisational psychology frameworks. Burnout risk surfaces an average of 6–10 weeks before observable performance decline — giving HR leaders a structural window to intervene before attrition or sick leave follows.",
    readTime: "8 min",
    date: "Apr 2026",
    hot: true,
  },
  {
    category: "Attrition Modelling",
    tag: "Analysis",
    title: "The attrition signal stack: What language, behaviour and cadence reveal",
    desc: "Self-reported surveys systematically underperform against behavioural models for predicting voluntary attrition. This analysis examines the multi-signal stack that outperforms traditional engagement scoring by 3–4x.",
    readTime: "6 min",
    date: "Apr 2026",
    hot: false,
  },
  {
    category: "Leadership Science",
    tag: "Executive",
    title: "Leadership friction as a predictive variable: The underused signal",
    desc: "Manager-team alignment signals are among the highest-value predictors of downstream attrition, disengagement, and psychological safety collapse — yet most HR platforms capture none of them.",
    readTime: "10 min",
    date: "Mar 2026",
    hot: true,
  },
  {
    category: "Cognitive Science",
    tag: "Research",
    title: "Cognitive overload at scale: Detection, thresholds, and intervention timing",
    desc: "How sustained cognitive load patterns manifest in communication signals, and the intervention windows that prevent performance degradation in knowledge-intensive workforces.",
    readTime: "7 min",
    date: "Mar 2026",
    hot: false,
  },
  {
    category: "Psychological Safety",
    tag: "Methodology",
    title: "Measuring psychological safety without surveys: A signal-based approach",
    desc: "An alternative framework for measuring psychological safety using participation signals, communication asymmetry, and feedback frequency — without relying on annual survey cycles that lag reality by 6–12 months.",
    readTime: "9 min",
    date: "Feb 2026",
    hot: false,
  },
  {
    category: "AI + HR",
    tag: "Executive",
    title: "AI in organisational psychology: Decision-support vs. clinical diagnosis",
    desc: "A principled distinction between AI-powered decision-support tools and clinical diagnosis — and why the difference matters for HR, legal, board governance, and employee trust.",
    readTime: "5 min",
    date: "Feb 2026",
    hot: false,
  },
];

const TOPICS = ["All", "Burnout Science", "Attrition Modelling", "Leadership Science", "Cognitive Science", "Psychological Safety", "AI + HR"];

export default function ResearchPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filtered = topic === "All" ? ARTICLES : ARTICLES.filter(a => a.category === topic);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>
            EXECUTIVE RESEARCH · FREE ACCESS
          </div>
          <h1 style={{ fontSize: "38px", fontWeight: "800", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Workforce Intelligence Research
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.7", maxWidth: "580px" }}>
            Peer-reviewed organisational psychology translated for HR leaders, CHROs, and C-suite executives. The science behind prediction — published openly.
          </p>
        </div>

        {/* Newsletter */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "16px", padding: "28px 32px", marginBottom: "48px" }}>
          {subscribed ? (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <p style={{ fontSize: "15px", fontWeight: "700", color: gold, margin: "0 0 6px" }}>You&apos;re on the list.</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>New research lands in your inbox every two weeks.</p>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px" }}>Get research in your inbox</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>New articles every two weeks. No spam. Unsubscribe anytime.</p>
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

        {/* Topic filter */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
          {TOPICS.map(t => (
            <button key={t} onClick={() => setTopic(t)}
              style={{ background: t === topic ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)", border: t === topic ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(255,255,255,0.08)", color: t === topic ? gold : "rgba(255,255,255,0.4)", padding: "7px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "64px" }}>
          {filtered.map((a, i) => (
            <div key={i}
              style={{ background: "rgba(255,255,255,0.04)", border: a.hot ? "1px solid rgba(201,168,76,0.2)" : "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px", cursor: "default", position: "relative", display: "flex", flexDirection: "column", transition: "border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = a.hot ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
              {a.hot && (
                <div style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(239,68,68,0.15)", color: "#fca5a5", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>FEATURED</div>
              )}
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", color: gold, padding: "3px 10px", borderRadius: "999px" }}>{a.category}</span>
              </div>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", margin: "0 0 10px", lineHeight: "1.45", paddingRight: a.hot ? "60px" : "0", flex: 1 }}>{a.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", margin: "0 0 16px", lineHeight: "1.65" }}>{a.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{a.readTime} read</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>·</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{a.date}</span>
                </div>
                <span style={{ fontSize: "12px", color: gold, fontWeight: "600" }}>Read →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "36px", textAlign: "center" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Put the research into practice.
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.38)", margin: "0 0 24px", lineHeight: "1.7" }}>
            Run a free workforce behaviour audit and see which prediction signals apply to your organisation.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
            Get your free workforce audit →
          </button>
        </div>
      </div>
    </div>
  );
}
