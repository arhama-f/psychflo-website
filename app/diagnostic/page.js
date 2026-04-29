"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import { calculateWorkforceRiskScores } from "../../lib/scoringUtils";

const gold = "#c9a84c";

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  {
    id: "basics",
    heading: "Tell us about your organisation",
    sub: "Helps us benchmark your scores against similar companies.",
    fields: [
      { id: "companyName", label: "COMPANY NAME", type: "text", placeholder: "Acme Corp", required: true },
      { id: "email", label: "WORK EMAIL", type: "email", placeholder: "you@company.com", required: true },
      {
        id: "size", label: "COMPANY SIZE", type: "pills",
        options: ["1–20", "21–50", "51–200", "201–500", "500+"],
      },
      {
        id: "industry", label: "INDUSTRY", type: "pills",
        options: ["Technology", "Financial Services", "Healthcare", "Professional Services", "Retail", "Manufacturing", "Other"],
      },
    ],
  },
  {
    id: "challenges",
    heading: "What are your biggest people challenges right now?",
    sub: "Select all that apply.",
    fields: [
      {
        id: "challenges", label: "", type: "multiselect",
        options: [
          { value: "turnover",    label: "High turnover or resignations",          icon: "🚪", scores: { burnoutRetention: 20 } },
          { value: "burnout",     label: "Burnout or low energy in teams",          icon: "🔥", scores: { burnoutRetention: 25 } },
          { value: "manager",     label: "Manager capability or confidence gaps",   icon: "👥", scores: { managerCulture: 25 } },
          { value: "policy",      label: "HR policies that feel outdated or risky", icon: "📄", scores: { workforceRisk: 25 } },
          { value: "compliance",  label: "Compliance or tribunal exposure",         icon: "⚖️", scores: { workforceRisk: 30 } },
          { value: "culture",     label: "Culture or psychological safety concerns",icon: "🧠", scores: { managerCulture: 20 } },
          { value: "onboarding",  label: "New hire retention in first 90 days",     icon: "📊", scores: { burnoutRetention: 15, workforceRisk: 10 } },
          { value: "conflict",    label: "Team conflict or communication breakdown", icon: "💬", scores: { managerCulture: 20 } },
        ],
      },
    ],
  },
  {
    id: "concern",
    heading: "Rate your concern level across these areas",
    sub: "1 = Not concerned · 5 = Critical priority right now",
    fields: [
      { id: "turnoverConcern",  label: "Turnover / resignation risk",   type: "slider", scoreKey: "burnoutRetention" },
      { id: "burnoutConcern",   label: "Burnout / team wellbeing",      type: "slider", scoreKey: "burnoutRetention" },
      { id: "managerConcern",   label: "Manager effectiveness",         type: "slider", scoreKey: "managerCulture" },
      { id: "policyConcern",    label: "Policy / compliance exposure",  type: "slider", scoreKey: "workforceRisk" },
    ],
  },
  {
    id: "urgency",
    heading: "How urgently do you need to act?",
    sub: "This shapes your recommended next step.",
    fields: [
      {
        id: "urgency", label: "", type: "choice_card",
        options: [
          { value: "immediate", label: "Immediate", desc: "We have active issues that need resolving now", icon: "🔴" },
          { value: "proactive", label: "Proactive",  desc: "We want to prevent problems before they occur", icon: "🟡" },
          { value: "planning",  label: "Planning",   desc: "Building a people strategy for the next 12 months", icon: "🟢" },
        ],
      },
    ],
  },
];

// Scoring logic lives in lib/scoringUtils.js — edit weights there.

// ── Result screen ─────────────────────────────────────────────────────────────

const BAND_META = {
  High:   { color: "#fca5a5", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",   icon: "🔴", cta: "Book a Workforce Risk Audit — immediate action recommended" },
  Medium: { color: "#fcd34d", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  icon: "🟡", cta: "Run a full diagnostic audit to prevent these risks escalating" },
  Low:    { color: "#6ee7b7", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)",  icon: "🟢", cta: "Start proactive monitoring to keep risk low as you scale" },
};

const CATEGORY_META = [
  { key: "workforceRiskScore",    label: "Workforce Risk",        color: "#fca5a5", icon: "⚠️" },
  { key: "burnoutRetentionScore", label: "Burnout & Retention",   color: "#fcd34d", icon: "🔥" },
  { key: "managerCultureScore",   label: "Manager & Culture",     color: "#c4b5fd", icon: "🧠" },
];

function ResultScreen({ scores, form, onRetake }) {
  const router = useRouter();
  const meta = BAND_META[scores.band];

  // Persist for use by the executive report (Step 8)
  if (typeof window !== "undefined") {
    localStorage.setItem("diagnosticResult", JSON.stringify({ scores, form, ts: Date.now() }));
  }

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "60px 24px" }}>

      {/* Overall score */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ fontSize: "52px", marginBottom: "12px" }}>{meta.icon}</div>
        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", margin: "0 0 10px" }}>
          Workforce Risk Score: <span style={{ color: meta.color }}>{scores.overallRiskScore}</span>/100
        </h1>
        <div style={{ display: "inline-block", background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, fontSize: "13px", fontWeight: "700", padding: "5px 16px", borderRadius: "999px", marginBottom: "14px" }}>
          {scores.band} Risk
        </div>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.6" }}>
          {scores.band === "High"
            ? "Your organisation has significant workforce risks that require immediate attention."
            : scores.band === "Medium"
            ? "You have moderate risk signals. Proactive action now prevents costly problems later."
            : "Your workforce shows relatively low risk signals. Now is the time to build resilience."}
        </p>
      </div>

      {/* Category breakdown */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", margin: "0 0 20px" }}>RISK BY CATEGORY</p>
        {CATEGORY_META.map((cat, i) => {
          const val = scores[cat.key];
          return (
            <div key={i} style={{ marginBottom: i < CATEGORY_META.length - 1 ? "18px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{cat.icon} {cat.label}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: cat.color }}>{val}/100</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${val}%`, background: cat.color, borderRadius: "999px" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Next step CTA */}
      <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "16px", padding: "28px", marginBottom: "14px", textAlign: "center" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: gold, margin: "0 0 6px" }}>{meta.cta}</p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: "0 0 20px", lineHeight: "1.6" }}>
          Book a full audit and receive your board-ready Executive Workforce Report in 48 hours.
        </p>
        <button
          onClick={() => router.push("/report/executive")}
          style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", marginBottom: "10px" }}>
          View Executive Report →
        </button>
        <button
          onClick={() => router.push("/auth/signup")}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", marginBottom: "10px" }}>
          Book Workforce Risk Audit — $750 →
        </button>
        <button
          onClick={() => router.push("/pricing")}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.5)", padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          View all plans →
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.2)", marginBottom: "8px" }}>
        Your data is private and never shared with third parties.
      </p>
      <p style={{ textAlign: "center" }}>
        <button onClick={onRetake} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}>
          Retake diagnostic
        </button>
      </p>
    </div>
  );
}

// ── Field renderers ───────────────────────────────────────────────────────────

function TextField({ field, value, onChange }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em", display: "block", marginBottom: "7px" }}>{field.label}</label>
      <input
        type={field.type}
        value={value || ""}
        onChange={e => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "13px 16px", color: "#f8fafc", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );
}

function PillsField({ field, value, onChange }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em", display: "block", marginBottom: "8px" }}>{field.label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {field.options.map(opt => {
          const active = value === opt;
          return (
            <button key={opt} type="button" onClick={() => onChange(field.id, opt)}
              style={{ padding: "8px 16px", borderRadius: "8px", border: active ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.1)", background: active ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)", color: active ? gold : "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MultiselectField({ field, values, onToggle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {field.options.map(opt => {
        const active = (values || []).includes(opt.value);
        return (
          <div key={opt.value} onClick={() => onToggle(field.id, opt.value)}
            style={{ display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "10px", border: active ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.08)", background: active ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.03)", cursor: "pointer" }}>
            <span style={{ fontSize: "18px" }}>{opt.icon}</span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: active ? gold : "rgba(255,255,255,0.6)", flex: 1 }}>{opt.label}</span>
            {active && <span style={{ color: gold, fontSize: "15px" }}>✓</span>}
          </div>
        );
      })}
    </div>
  );
}

function SliderField({ field, value, onChange }) {
  const val = value || 1;
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{field.label}</label>
        <span style={{ fontSize: "13px", fontWeight: "700", color: gold }}>{val} / 5</span>
      </div>
      <input type="range" min="1" max="5" step="1" value={val}
        onChange={e => onChange(field.id, Number(e.target.value))}
        style={{ width: "100%", accentColor: gold, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Not concerned</span>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Critical priority</span>
      </div>
    </div>
  );
}

function ChoiceCardField({ field, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {field.options.map(opt => {
        const active = value === opt.value;
        return (
          <div key={opt.value} onClick={() => onChange(field.id, opt.value)}
            style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px 18px", borderRadius: "12px", border: active ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.08)", background: active ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.03)", cursor: "pointer" }}>
            <span style={{ fontSize: "22px" }}>{opt.icon}</span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: active ? gold : "#f8fafc" }}>{opt.label}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{opt.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DiagnosticPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    companyName: "", email: "",
    size: "", industry: "",
    challenges: [],
    turnoverConcern: 1, burnoutConcern: 1, managerConcern: 1, policyConcern: 1,
    urgency: "",
  });
  const [scores, setScores] = useState(null);

  const current = STEPS[step];
  const progressPct = (step / STEPS.length) * 100;

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function toggle(key, val) {
    setForm(f => {
      const arr = f[key] || [];
      return { ...f, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
  }

  function canAdvance() {
    if (step === 0) return form.companyName.trim() && form.email.trim() && form.size && form.industry;
    if (step === 1) return (form.challenges || []).length > 0;
    if (step === 2) return true;
    if (step === 3) return !!form.urgency;
    return true;
  }

  function handleNext() {
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    const result = calculateWorkforceRiskScores(form);
    setScores({ ...result, band: result.riskLevel });
  }

  function retake() {
    setStep(0);
    setForm({ companyName: "", email: "", size: "", industry: "", challenges: [], turnoverConcern: 1, burnoutConcern: 1, managerConcern: 1, policyConcern: 1, urgency: "" });
    setScores(null);
  }

  if (scores) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <Nav />
        <ResultScreen scores={scores} form={form} onRetake={retake} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "56px 24px" }}>

        {/* Progress bar */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Step {step + 1} of {STEPS.length}</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Workforce Risk Diagnostic</span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "999px" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: gold, borderRadius: "999px", transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Heading */}
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 6px" }}>{current.heading}</h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "0 0 28px" }}>{current.sub}</p>

        {/* Fields */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          {current.fields.map(field => {
            if (field.type === "text" || field.type === "email")
              return <TextField key={field.id} field={field} value={form[field.id]} onChange={set} />;
            if (field.type === "pills")
              return <PillsField key={field.id} field={field} value={form[field.id]} onChange={set} />;
            if (field.type === "multiselect")
              return <MultiselectField key={field.id} field={field} values={form[field.id]} onToggle={toggle} />;
            if (field.type === "slider")
              return <SliderField key={field.id} field={field} value={form[field.id]} onChange={set} />;
            if (field.type === "choice_card")
              return <ChoiceCardField key={field.id} field={field} value={form[field.id]} onChange={set} />;
            return null;
          })}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: "10px" }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "13px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              ← Back
            </button>
          )}
          <button onClick={handleNext} disabled={!canAdvance()}
            style={{ flex: 1, background: canAdvance() ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.06)", color: canAdvance() ? "#0f172a" : "rgba(255,255,255,0.25)", border: "none", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: canAdvance() ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
            {step === STEPS.length - 1 ? "Get My Risk Score →" : "Continue →"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
          3–5 minutes · Private & confidential · No credit card required
        </p>
      </div>
    </div>
  );
}
