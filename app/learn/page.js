"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

export default function Learn() {
  const router = useRouter();
  const gold = "#c9a84c";
  const [activeCategory, setActiveCategory] = useState("All");

  const plans = [
    { name: "Per course", price: "£29–79", period: "one-off", desc: "Buy individual courses as you need them", color: "#6b7280" },
    { name: "Team", price: "£199", period: "/mo", desc: "Up to 20 learners, access to all courses", color: gold, popular: true },
    { name: "Company", price: "£599", period: "/mo", desc: "Unlimited learners + admin dashboard", color: "#7f77dd" },
    { name: "Enterprise", price: "£1,499", period: "/mo", desc: "Custom courses, branded, API access", color: "#10b981" },
  ];

  const categories = ["All", "For Managers", "For HR Teams", "For All Staff", "For Leaders"];

  const courses = [
    { icon: "🛡️", title: "Psychological Safety for Managers", modules: 6, duration: "2.5 hrs", price: 49, level: "Intermediate", category: "For Managers", desc: "Learn to build teams where people feel safe to speak up, take risks, and be themselves — based on Amy Edmondson's research.", outcomes: ["Measure psych safety in your team", "Run safety-building conversations", "Respond to vulnerability without dismissing it", "Create norms that sustain safety over time"], hot: true },
    { icon: "💬", title: "How to Have Difficult Conversations", modules: 5, duration: "2 hrs", price: 49, level: "All levels", category: "For Managers", desc: "A psychology-grounded framework for navigating performance issues, conflict, and sensitive topics without damaging relationships.", outcomes: ["Prepare for high-stakes conversations", "Manage emotional activation in yourself and others", "Use non-violent communication techniques", "Follow up effectively"], hot: true },
    { icon: "🔥", title: "Preventing Burnout in Your Team", modules: 4, duration: "1.5 hrs", price: 39, level: "Managers", category: "For Managers", desc: "Identify the six drivers of burnout before they become crises. Practical intervention strategies grounded in occupational psychology.", outcomes: ["Spot early warning signs", "Address workload and autonomy imbalances", "Have burnout conversations", "Build sustainable team rhythms"], hot: false },
    { icon: "📄", title: "Writing HR Policies That People Read", modules: 6, duration: "2.5 hrs", price: 59, level: "HR Teams", category: "For HR Teams", desc: "Cognitive load theory, plain language techniques, and psychology-based frameworks for writing policies that actually change behaviour.", outcomes: ["Apply readability science to HR documents", "Use plain language rewriting techniques", "Test comprehension before publishing", "Measure policy effectiveness"], hot: true },
    { icon: "⚖️", title: "DEI Fundamentals for People Managers", modules: 5, duration: "2 hrs", price: 49, level: "All levels", category: "For Managers", desc: "Practical DEI skills grounded in psychology — not performative training but real behavioural change techniques.", outcomes: ["Identify unconscious bias in decisions", "Run inclusive recruitment processes", "Build equitable team norms", "Navigate DEI conversations confidently"], hot: false },
    { icon: "🧩", title: "Cognitive Load and Productivity", modules: 4, duration: "1.5 hrs", price: 39, level: "All staff", category: "For All Staff", desc: "Understand how your brain manages information load and how to design your work environment for maximum output.", outcomes: ["Understand working memory limits", "Reduce cognitive switching cost", "Design a low-load work environment", "Help your team protect focus time"], hot: false },
    { icon: "📋", title: "Understanding Employment Law Basics", modules: 7, duration: "3 hrs", price: 69, level: "HR Teams", category: "For HR Teams", desc: "The employment law knowledge every HR professional needs — tribunal claims, protected characteristics, disciplinary process, and more.", outcomes: ["Navigate key UK employment legislation", "Identify policy compliance gaps", "Understand tribunal claim triggers", "Run legally sound disciplinary processes"], hot: false },
    { icon: "👥", title: "Running Psychologically Safe 1-to-1s", modules: 4, duration: "1.5 hrs", price: 39, level: "Managers", category: "For Managers", desc: "Transform your one-to-ones from status updates into conversations that build trust, surface problems early, and develop people.", outcomes: ["Structure 1-to-1s for psychological safety", "Ask questions that surface real issues", "Give and receive feedback effectively", "Track employee wellbeing over time"], hot: false },
    { icon: "🚀", title: "Onboarding Psychology — First 90 Days", modules: 5, duration: "2 hrs", price: 49, level: "HR + Managers", category: "For HR Teams", desc: "The research on why employees leave in the first 90 days and the evidence-based interventions that prevent it.", outcomes: ["Design a psychologically safe onboarding journey", "Measure new hire confidence and safety", "Build manager touchpoint quality", "Reduce early attrition by up to 40%"], hot: false },
    { icon: "❤️", title: "Emotional Intelligence at Work", modules: 4, duration: "1.5 hrs", price: 39, level: "All staff", category: "For All Staff", desc: "Evidence-based EQ development — not soft skills fluff but neuroscience-grounded techniques for managing emotions in the workplace.", outcomes: ["Understand your emotional triggers", "Regulate emotional responses under pressure", "Read others' emotions accurately", "Build stronger working relationships"], hot: false },
  ];

  const filtered = activeCategory === "All" ? courses : courses.filter(c => c.category === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>

        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>MICRO-LEARNING PLATFORM</div>
          <h1 style={{ fontSize: "38px", fontWeight: "800", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em" }}>Psychology-grounded<br /><span style={{ color: gold }}>workplace learning</span></h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 32px", lineHeight: "1.7", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>10 courses built on real organisational psychology research. Not soft skills fluff — evidence-based techniques that change behaviour and show measurable results.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {[{ v: "10", l: "courses" }, { v: "4–7", l: "modules each" }, { v: "CPD", l: "accredited" }, { v: "Certificate", l: "on completion" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: "700", color: gold }}>{s.v}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "48px" }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: plan.popular ? `2px solid ${gold}` : "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px", textAlign: "center", position: "relative" }}>
              {plan.popular && (
                <div style={{ position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", fontSize: "9px", fontWeight: "800", padding: "3px 12px", borderRadius: "999px", whiteSpace: "nowrap" }}>MOST POPULAR</div>
              )}
              <div style={{ fontSize: "13px", fontWeight: "600", color: plan.color, marginBottom: "6px" }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "2px", marginBottom: "6px" }}>
                <span style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc" }}>{plan.price}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "0 0 14px", lineHeight: "1.5" }}>{plan.desc}</p>
              <button style={{ width: "100%", background: plan.popular ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.08)", border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.12)", color: plan.popular ? "#0f172a" : "#f8fafc", padding: "9px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                Get started
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {categories.map((c, i) => (
            <button key={i} onClick={() => setActiveCategory(c)}
              style={{ background: activeCategory === c ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)", border: activeCategory === c ? `1px solid rgba(201,168,76,0.3)` : "1px solid rgba(255,255,255,0.08)", color: activeCategory === c ? gold : "rgba(255,255,255,0.4)", padding: "7px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {filtered.map((course, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: course.hot ? `1px solid rgba(201,168,76,0.2)` : "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", cursor: "pointer", position: "relative", display: "flex", flexDirection: "column" }}>
              {course.hot && (
                <div style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(201,168,76,0.15)", color: gold, fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px" }}>BESTSELLER</div>
              )}
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{course.icon}</div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px", lineHeight: "1.3", paddingRight: course.hot ? "80px" : "0" }}>{course.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 14px", lineHeight: "1.6", flex: 1 }}>{course.desc}</p>
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "6px", fontWeight: "600", letterSpacing: "0.04em" }}>YOU WILL LEARN</div>
                {course.outcomes.slice(0, 3).map((o, j) => (
                  <div key={j} style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "4px" }}>
                    <span style={{ color: "#10b981", fontSize: "11px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: "1.5" }}>{o}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", padding: "3px 8px", borderRadius: "999px" }}>{course.modules} modules</span>
                <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", padding: "3px 8px", borderRadius: "999px" }}>{course.duration}</span>
                <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", padding: "3px 8px", borderRadius: "999px" }}>{course.level}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "18px", fontWeight: "800", color: gold }}>£{course.price}</span>
                <button style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>
                  Enrol now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "48px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>Need custom training for your organisation?</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px", lineHeight: "1.7" }}>We build bespoke micro-learning programmes grounded in your organisation's psychology challenges — branded, integrated, and measured.</p>
          <button style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
            Talk to us about custom training
          </button>
        </div>
      </div>
    </div>
  );
}
