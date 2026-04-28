"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const STEPS = [
  {
    id: "company",
    title: "Tell us about your organisation",
    subtitle: "This helps us benchmark your results against similar companies.",
    fields: [
      { id: "companyName", label: "COMPANY NAME", type: "text", placeholder: "Acme Corp" },
      { id: "email", label: "WORK EMAIL", type: "email", placeholder: "you@company.com" },
      {
        id: "size", label: "COMPANY SIZE", type: "choice",
        options: ["1–20", "21–50", "51–200", "201–500", "500+"],
      },
      {
        id: "industry", label: "INDUSTRY", type: "choice",
        options: ["Technology", "Financial Services", "Healthcare", "Professional Services", "Retail", "Manufacturing", "Other"],
      },
    ],
  },
  {
    id: "challenges",
    title: "What are your biggest people challenges right now?",
    subtitle: "Select all that apply. Be honest — this shapes your risk score.",
    fields: [
      {
        id: "challenges", label: "", type: "multiselect",
        options: [
          { value: "turnover", label: "High turnover / resignations", icon: "🚪", risk: "retention" },
          { value: "burnout", label: "Burnout or low energy in teams", icon: "🔥", risk: "retention" },
          { value: "manager", label: "Manager capability or confidence gaps", icon: "👥", risk: "culture" },
          { value: "policy", label: "HR policies that feel outdated or risky", icon: "📄", risk: "workforce" },
          { value: "compliance", label: "Compliance or tribunal exposure", icon: "⚖️", risk: "workforce" },
          { value: "culture", label: "Culture or psychological safety concerns", icon: "🧠", risk: "culture" },
          { value: "onboarding", label: "New hire retention in first 90 days", icon: "📊", risk: "retention" },
          { value: "conflict", label: "Team conflict or communication breakdown", icon: "💬", risk: "culture" },
        ],
      },
    ],
  },
  {
    id: "urgency",
    title: "Rate your concern level",
    subtitle: "1 = Not concerned · 5 = Critical priority",
    fields: [
      { id: "turnoverConcern", label: "Turnover / resignation risk", type: "slider", risk: "retention" },
      { id: "burnoutConcern", label: "Burnout / wellbeing risk", type: "slider", risk: "retention" },
      { id: "managerConcern", label: "Manager effectiveness", type: "slider", risk: "culture" },
      { id: "policyConcern", label: "Policy / compliance risk", type: "slider", risk: "workforce" },
    ],
  },
  {
    id: "urgency_level",
    title: "How urgently do you need to act?",
    subtitle: "This determines the report format and recommended next steps.",
    fields: [
      {
        id: "urgency", label: "", type: "choice_large",
        options: [
          { value: "immediate", label: "Immediate", desc: "We have active issues that need resolving now", icon: "🔴" },
          { value: "proactive", label: "Proactive", desc: "We want to prevent problems before they happen", icon: "🟡" },
          { value: "planning", label: "Planning", desc: "We're building a people strategy for the next 12 months", icon: "🟢" },
        ],
      },
    ],
  },
];

function scoreAnswers(form) {
  let workforceRisk = 0, burnoutRetention = 0, managerCulture = 0;
  const challenges = form.challenges || [];

  challenges.forEach(c => {
    if (["turnover", "burnout", "onboarding"].includes(c)) burnoutRetention += 20;
    if (["manager", "culture", "conflict"].includes(c)) managerCulture += 20;
    if (["policy", "compliance"].includes(c)) workforceRisk += 25;
  });

  workforceRisk += ((form.policyConcern || 1) - 1) * 10;
  burnoutRetention += ((form.turnoverConcern || 1) - 1) * 8 + ((form.burnoutConcern || 1) - 1) * 8;
  managerCulture += ((form.managerConcern || 1) - 1) * 10;

  if (form.urgency === "immediate") { workforceRisk += 10; burnoutRetention += 10; managerCulture += 10; }

  workforceRisk = Math.min(100, workforceRisk);
  burnoutRetention = Math.min(100, burnoutRetention);
  managerCulture = Math.min(100, managerCulture);
  const overall = Math.round((workforceRisk + burnoutRetention + managerCulture) / 3);

  const level = overall >= 66 ? "High" : overall >= 31 ? "Medium" : "Low";
  return { workforceRisk, burnoutRetention, managerCulture, overall, level };
}

export default function DiagnosticPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    companyName: "", email: "", size: "", industry: "",
    challenges: [], turnoverConcern: 3, burnoutConcern: 3, managerConcern: 3, policyConcern: 3,
    urgency: "",
  });
  const [done, setDone] = useState(false);
  const [scores, setScores] = useState(null);

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function toggle(key, val) {
    setForm(f => {
      const arr = f[key] || [];
      return { ...f, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
  }

  function next() {
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    const s = scoreAnswers(form);
    setScores(s);
    setDone(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("diagnosticScores", JSON.stringify({ ...s, form }));
    }
  }

  const levelColor = { High: "#fca5a5", Medium: "#fcd34d", Low: "#6ee7b7" };
  const levelBg = { High: "rgba(239,68,68,0.08)", Medium: "rgba(245,158,11,0.08)", Low: "rgba(16,185,129,0.08)" };

  if (done && scores) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <Nav />
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              {scores.level === "High" ? "🔴" : scores.level === "Medium" ? "🟡" : "🟢"}
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px" }}>
              Your Workforce Risk Score: {scores.overall}/100
            </h1>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: levelBg[scores.level], border: `1px solid ${levelColor[scores.level]}33`, color: levelColor[scores.level], fontSize: "13px", fontWeight: "700", padding: "6px 16px", borderRadius: "999px", marginBottom: "12px" }}>
              {scores.level} Risk
            </div>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
              {scores.level === "High" ? "Your organisation has significant workforce risks that require immediate attention." : scores.level === "Medium" ? "You have moderate risk signals. Proactive action now prevents costly problems later." : "Your workforce shows relatively low risk signals. Now is the time to build resilience."}
            </p>
          </div>

          {/* Score breakdown */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.5)", margin: "0 0 20px", letterSpacing: "0.05em" }}>RISK BY CATEGORY</h3>
            {[
              { label: "Workforce Risk", score: scores.workforceRisk, color: "#fca5a5", icon: "⚠️" },
              { label: "Burnout & Retention", score: scores.burnoutRetention, color: "#6ee7b7", icon: "🔥" },
              { label: "Manager & Culture", score: scores.managerCulture, color: "#c4b5fd", icon: "🧠" },
            ].map((cat, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? "16px" : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{cat.icon} {cat.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: cat.color }}>{cat.score}/100</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${cat.score}%`, background: cat.color, borderRadius: "999px", transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "16px", padding: "28px", textAlign: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>Get your full Executive Workforce Report</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 20px", lineHeight: "1.6" }}>
              Your detailed report includes top 3 business risks, estimated financial impact, root causes, 30-day action plan, and recommended intelligence engines.
            </p>
            <button onClick={() => router.push("/report/board")} style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", marginBottom: "10px" }}>
              View Executive Report →
            </button>
            <button onClick={() => router.push("/pricing")} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "12px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              Book a Workforce Risk Audit — $750
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
            Your data is private and never shared. Results are for diagnostic purposes only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "580px", margin: "0 auto", padding: "60px 24px" }}>

        {/* Progress */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Step {step + 1} of {STEPS.length}</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Workforce Risk Diagnostic</span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "999px" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: gold, borderRadius: "999px", transition: "width 0.3s ease" }} />
          </div>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px" }}>{current.title}</h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 32px" }}>{current.subtitle}</p>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
          {current.fields.map(field => (
            <div key={field.id} style={{ marginBottom: "20px" }}>
              {field.label && <label style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em", display: "block", marginBottom: "8px" }}>{field.label}</label>}

              {field.type === "text" || field.type === "email" ? (
                <input type={field.type} value={form[field.id] || ""} onChange={e => set(field.id, e.target.value)} placeholder={field.placeholder}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "13px 16px", color: "#f8fafc", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
              ) : null}

              {field.type === "choice" ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {field.options.map(opt => (
                    <button key={opt} type="button" onClick={() => set(field.id, opt)}
                      style={{ padding: "8px 16px", borderRadius: "8px", border: form[field.id] === opt ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.1)", background: form[field.id] === opt ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)", color: form[field.id] === opt ? gold : "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : null}

              {field.type === "multiselect" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {field.options.map(opt => {
                    const selected = (form[field.id] || []).includes(opt.value);
                    return (
                      <div key={opt.value} onClick={() => toggle(field.id, opt.value)}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", border: selected ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.08)", background: selected ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)", cursor: "pointer" }}>
                        <span style={{ fontSize: "18px" }}>{opt.icon}</span>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: selected ? gold : "rgba(255,255,255,0.6)" }}>{opt.label}</span>
                        {selected && <span style={{ marginLeft: "auto", color: gold, fontSize: "16px" }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {field.type === "slider" ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{field.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: gold }}>{form[field.id] || 3}/5</span>
                  </div>
                  <input type="range" min="1" max="5" value={form[field.id] || 3} onChange={e => set(field.id, Number(e.target.value))}
                    style={{ width: "100%", accentColor: gold }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Not concerned</span>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Critical</span>
                  </div>
                </div>
              ) : null}

              {field.type === "choice_large" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {field.options.map(opt => (
                    <div key={opt.value} onClick={() => set(field.id, opt.value)}
                      style={{ display: "flex", gap: "14px", alignItems: "center", padding: "16px 18px", borderRadius: "12px", border: form[field.id] === opt.value ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.08)", background: form[field.id] === opt.value ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)", cursor: "pointer" }}>
                      <span style={{ fontSize: "22px" }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: form[field.id] === opt.value ? gold : "#f8fafc" }}>{opt.label}</div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "13px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              ← Back
            </button>
          )}
          <button onClick={next} style={{ flex: 1, background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
            {step === STEPS.length - 1 ? "Get My Risk Score →" : "Continue →"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
          Takes 3–5 minutes · Private & confidential · No credit card required
        </p>
      </div>
    </div>
  );
}
