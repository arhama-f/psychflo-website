"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const PLANS = [
  {
    id: "audit",
    name: "Workforce Risk Audit",
    price: "$750",
    period: "one-time",
    badge: null,
    highlight: false,
    desc: "A complete workforce risk assessment delivered in 48 hours. Board-ready report with scored risks, financial impact, and a 30-day action plan.",
    features: [
      "Full workforce risk diagnostic",
      "Policy & compliance gap analysis",
      "Scored Executive Workforce Report",
      "Top 3 business risks identified",
      "Estimated financial impact",
      "30-day priority action plan",
      "1× strategy call with our team",
    ],
    cta: "Book Audit",
    href: "/diagnostic",
  },
  {
    id: "growth",
    name: "Growth Prevention System",
    price: "$2,000",
    period: "per month",
    badge: "Most popular",
    highlight: true,
    desc: "Continuous workforce intelligence across all 3 outcomes. Weekly risk reports, manager scorecards, and priority intervention actions.",
    features: [
      "Everything in Workforce Risk Audit",
      "All 9 AI intelligence engines",
      "Weekly executive risk report",
      "Manager effectiveness scorecards",
      "Burnout early warning monitoring",
      "Slack digest + alerts",
      "Industry benchmarking",
      "ISO 45003 compliance tracking",
      "Priority support",
    ],
    cta: "Apply for Access",
    href: "/diagnostic",
  },
  {
    id: "executive",
    name: "Executive Workforce Intelligence",
    price: "$3,500",
    period: "per month",
    badge: null,
    highlight: false,
    desc: "Full platform with a dedicated success manager, quarterly board presentations, and deep custom integrations.",
    features: [
      "Everything in Growth Prevention",
      "Dedicated customer success manager",
      "Quarterly board report presentation",
      "HRIS integration (BambooHR, HiBob, Personio)",
      "SSO / SAML",
      "Custom benchmarks & reporting",
      "99.99% uptime SLA",
      "Priority implementation",
    ],
    cta: "Book Executive Call",
    href: "/diagnostic",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    badge: null,
    highlight: false,
    desc: "For organisations with 500+ employees or specific compliance, data residency, or integration requirements.",
    features: [
      "Everything in Executive Intelligence",
      "Custom data residency options",
      "Multi-entity / multi-region support",
      "White-label reporting",
      "Procurement & legal support",
      "Dedicated security review",
    ],
    cta: "Contact Us",
    href: "/diagnostic",
  },
];

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  async function handlePlan(plan) {
    if (plan.href) { router.push(plan.href); return; }
    setLoading(plan.id);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.error) alert(data.error);
    } catch { alert("Something went wrong. Please try again."); }
    setLoading(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "1020px", margin: "0 auto", padding: "60px 24px" }}>

        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: gold, fontSize: "12px", fontWeight: "700", padding: "6px 16px", borderRadius: "999px", marginBottom: "20px", letterSpacing: "0.05em" }}>
            ✦ START WITH AN AUDIT. SCALE WITH A RETAINER.
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: "800", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.03em" }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>
            No per-seat pricing. No annual lock-in. One price for your whole organisation.
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>Start with a one-time audit · Upgrade when you're ready · Cancel monthly retainers anytime</p>
        </div>

        {/* Founding client banner */}
        <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "14px", padding: "18px 24px", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: gold, margin: "0 0 3px" }}>✦ Founding Client Programme — 5 spots remaining</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Discounted audit in exchange for feedback and an anonymised case study.</p>
          </div>
          <button onClick={() => router.push("/diagnostic")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", whiteSpace: "nowrap" }}>
            Apply Now →
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "48px" }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: plan.highlight ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.04)", border: plan.highlight ? `1px solid rgba(201,168,76,0.3)` : "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", position: "relative", display: "flex", flexDirection: "column" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", fontSize: "11px", fontWeight: "800", padding: "3px 14px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px", lineHeight: "1.3" }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "26px", fontWeight: "800", color: plan.highlight ? gold : "#f8fafc" }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.5" }}>{plan.desc}</p>
              </div>

              <div style={{ flex: 1, marginBottom: "18px" }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px" }}>
                    <span style={{ color: plan.highlight ? gold : "#10b981", fontSize: "12px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: "1.4" }}>{f}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => handlePlan(plan)} disabled={loading === plan.id}
                style={{ width: "100%", background: plan.highlight ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.07)", border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)", color: plan.highlight ? "#0f172a" : "rgba(255,255,255,0.7)", padding: "11px", borderRadius: "9px", fontSize: "13px", fontWeight: "700", cursor: "pointer", opacity: loading === plan.id ? 0.7 : 1 }}>
                {loading === plan.id ? "Loading..." : `${plan.cta} →`}
              </button>
            </div>
          ))}
        </div>

        {/* ROI table */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px" }}>The ROI is immediate</h3>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "0 0 24px" }}>Preventing one senior resignation pays for an entire year of the Growth plan.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {[
              { value: "$750", label: "Cost of one audit" },
              { value: "$50–100k", label: "Cost of one prevented resignation" },
              { value: "67×+", label: "Minimum audit ROI" },
              { value: "48hrs", label: "Time to first report" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: "800", color: gold, marginBottom: "4px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "14px", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>🛡️</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: gold, margin: "0 0 2px" }}>99.9% Uptime SLA — Growth & Executive plans</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Automatic service credits if we miss the mark.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
            <a href="/sla" style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: gold, padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>View SLA →</a>
            <a href="/status" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#6ee7b7", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
