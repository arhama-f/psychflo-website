"use client";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

// ── Tier data ─────────────────────────────────────────────────────────────────

const AUDIT = {
  name: "Workforce Risk Audit",
  price: "£750",
  period: "one-time",
  badge: "START HERE",
  desc: "A complete workforce risk assessment delivered in 48 hours. You receive an Executive Report, board-ready PDF, and a 60-minute expert debrief call.",
  features: [
    { icon: "📋", text: "Full diagnostic across all 3 risk dimensions" },
    { icon: "📄", text: "Executive Workforce Report (scored PDF)" },
    { icon: "📊", text: "Board-ready slide summary" },
    { icon: "📞", text: "60-min expert debrief call" },
    { icon: "🎯", text: "30-day priority action plan" },
    { icon: "⭐", text: "Counts as founding client credit if you upgrade" },
  ],
  cta: "Book Audit",
  href: "/founding",
};

const PLANS = [
  {
    id: "team",
    name: "Team Plan",
    price: "£500",
    period: "/month",
    desc: "Continuous workforce intelligence across all 3 outcomes. Weekly executive reports, manager scorecards, and Slack alerts.",
    badge: null,
    highlight: true,
    highlightLabel: "Most chosen",
    features: [
      "Everything in Workforce Risk Audit",
      "Continuous burnout monitoring (9 engines)",
      "Weekly Executive Workforce Report",
      "Manager effectiveness scorecards",
      "Predictive attrition dashboard",
      "Slack integration + real-time alerts",
      "30-day priority action plans",
      "HR admin panel",
    ],
    cta: "Apply for Growth Plan",
    href: "/founding",
  },
  {
    id: "growth",
    name: "Growth Plan",
    price: "£1,000",
    period: "/month",
    desc: "For organisations of 150–200 people. Org-wide risk dashboard, department breakdowns, cost-of-burnout calculator, and priority support.",
    badge: null,
    highlight: false,
    features: [
      "Everything in Team Plan",
      "Org-wide risk dashboard",
      "Department-level breakdowns",
      "Cost-of-burnout calculator",
      "Custom HRIS integration (BambooHR, HiBob, Personio)",
      "ISO 45003 compliance evidence pack",
      "Bespoke benchmarking against sector peers",
      "Priority implementation (live in 48 hrs)",
    ],
    cta: "Book Executive Call",
    href: "/demo",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "£2,000",
    period: "/month",
    desc: "Bespoke deployment for large organisations with complex structures, regulatory requirements, or multi-entity reporting.",
    badge: null,
    highlight: false,
    features: [
      "Everything in Growth Plan",
      "Dedicated customer success manager",
      "Quarterly board presentation (prepared for you)",
      "SSO / SAML for enterprise auth",
      "Multi-entity / multi-country reporting",
      "SLA: 99.99% uptime guarantee",
      "On-site executive workshops",
      "Negotiated annual contract",
    ],
    cta: "Contact Us",
    href: "/demo",
  },
];

const ROI_STATS = [
  { value: "£750",    label: "Entry point — one audit" },
  { value: "£130k+",  label: "Avg cost prevented per year" },
  { value: "43×",     label: "Typical ROI on Growth plan" },
  { value: "48 hrs",  label: "To your first Executive Report" },
];

const FOUNDING_BENEFITS = [
  { icon: "💰", title: "50% off for life",        desc: "Lock in half-price on any subscription plan. Price never increases." },
  { icon: "📋", title: "Free Audit included",     desc: "The £750 Workforce Risk Audit is included at no charge." },
  { icon: "🎯", title: "Direct founder access",   desc: "Monthly calls with our founding team. You shape what we build." },
  { icon: "🚀", title: "White-glove onboarding",  desc: "We configure everything. You are live in 48 hours." },
  { icon: "🏆", title: "Roadmap influence",        desc: "Vote on features and join early beta programmes." },
  { icon: "🔒", title: "Price lock guarantee",     desc: "Your founding rate is contractually locked. No surprises." },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Pricing() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "1020px", margin: "0 auto", padding: "64px 24px 100px" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "12px", fontWeight: "700", padding: "6px 16px", borderRadius: "999px", marginBottom: "20px", letterSpacing: "0.06em" }}>
            ✦ EXECUTIVE WORKFORCE INTELLIGENCE — PRICING
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            Start with an audit.<br />Scale with intelligence.
          </h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.4)", margin: "0 auto", maxWidth: "520px", lineHeight: "1.7" }}>
            No per-seat fees. No annual lock-in. One price for your whole organisation — from first risk scan to board-level workforce intelligence.
          </p>
        </div>

        {/* ── Tier 1: Audit (full width) ── */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.28)", borderRadius: "20px", padding: "36px 40px", marginBottom: "16px", display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: gold, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", padding: "3px 12px", borderRadius: "999px", letterSpacing: "0.06em" }}>
                {AUDIT.badge}
              </span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>One-time · no subscription required</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px" }}>{AUDIT.name}</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: "0 0 22px", lineHeight: "1.65", maxWidth: "540px" }}>{AUDIT.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
              {AUDIT.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px" }}>{f.icon}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", minWidth: "180px" }}>
            <div style={{ fontSize: "48px", fontWeight: "900", color: gold, lineHeight: 1, marginBottom: "4px" }}>{AUDIT.price}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>{AUDIT.period}</div>
            <button onClick={() => router.push(AUDIT.href)}
              style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 24px", borderRadius: "10px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
              {AUDIT.cta} →
            </button>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: "10px 0 0" }}>48-hour report delivery</p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "32px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontWeight: "700", whiteSpace: "nowrap", letterSpacing: "0.06em" }}>OR CHOOSE CONTINUOUS INTELLIGENCE</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* ── Tiers 2–4: Subscription plans ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "40px" }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: plan.highlight ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.04)", border: plan.highlight ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "28px", display: "flex", flexDirection: "column", position: "relative" }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", fontSize: "11px", fontWeight: "800", padding: "4px 16px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                  {plan.highlightLabel}
                </div>
              )}

              {/* Name + price */}
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px", lineHeight: "1.3" }}>{plan.name}</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "10px" }}>
                <span style={{ fontSize: "32px", fontWeight: "900", color: plan.highlight ? gold : "#f8fafc", lineHeight: 1 }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{plan.period}</span>
                )}
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 22px", lineHeight: "1.6" }}>{plan.desc}</p>

              {/* Features */}
              <div style={{ flex: 1, marginBottom: "24px" }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "9px", alignItems: "flex-start" }}>
                    <span style={{ color: plan.highlight ? gold : "#10b981", fontSize: "12px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.5" }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button onClick={() => router.push(plan.href)}
                style={{ width: "100%", background: plan.highlight ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.08)", border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.12)", color: plan.highlight ? "#0f172a" : "rgba(255,255,255,0.75)", padding: "12px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
                {plan.cta} →
              </button>
            </div>
          ))}
        </div>

        {/* ── ROI strip ── */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "32px 40px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
            <div style={{ maxWidth: "280px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px" }}>The ROI is immediate</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: "1.6" }}>A single prevented resignation pays for the Growth plan for over a year.</p>
            </div>
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {ROI_STATS.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: gold, marginBottom: "4px" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SLA strip ── */}
        <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)", borderRadius: "14px", padding: "18px 24px", marginBottom: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "22px" }}>🛡️</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: gold, margin: "0 0 2px" }}>99.9% Uptime SLA — Executive & Enterprise plans</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>Automatic service credits if we miss the mark. No questions asked.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <a href="/sla" style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: gold, padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>View SLA →</a>
            <a href="/status" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#6ee7b7", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              Status
            </a>
          </div>
        </div>

        {/* ── Founding Client Programme ── */}
        <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.22)", borderRadius: "22px", overflow: "hidden" }}>

          {/* Section header */}
          <div style={{ background: "rgba(201,168,76,0.06)", borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.15)", color: gold, fontSize: "11px", fontWeight: "800", padding: "4px 12px", borderRadius: "999px", marginBottom: "10px", letterSpacing: "0.06em" }}>
                ⭐ FOUNDING CLIENT PROGRAMME
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                5 founding company spots available
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 10px", maxWidth: "520px", lineHeight: "1.65" }}>
                We are accepting 5 founding companies for discounted workforce risk audits in exchange for feedback and anonymised case study data.
              </p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0, maxWidth: "500px", lineHeight: "1.6" }}>
                Founding companies receive lifetime discounted pricing, direct access to the founding team, and influence over what we build next.
              </p>
            </div>

            {/* Spots meter */}
            <div style={{ minWidth: "160px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", fontWeight: "900", color: gold, lineHeight: 1 }}>2<span style={{ fontSize: "18px", color: "rgba(255,255,255,0.25)", fontWeight: "400" }}>/5</span></div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>spots taken · 3 remaining</div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: "40%", height: "100%", background: `linear-gradient(90deg,${gold},#f0d080)`, borderRadius: "999px" }} />
              </div>
            </div>
          </div>

          {/* Benefits grid */}
          <div style={{ padding: "36px 40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginBottom: "36px" }}>
              {FOUNDING_BENEFITS.map((b, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", flexShrink: 0 }}>
                    {b.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px" }}>{b.title}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.55" }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Founding pricing comparison */}
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "14px", padding: "24px", marginBottom: "28px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", margin: "0 0 16px" }}>FOUNDING CLIENT PRICING vs STANDARD</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
                {[
                  { plan: "Workforce Risk Audit",  standard: "£750",        founding: "Included free",  saving: "Save £750" },
                  { plan: "Team Plan",             standard: "£500/mo",     founding: "£250/mo",        saving: "Save 50%" },
                  { plan: "Growth Plan",           standard: "£1,000/mo",   founding: "£500/mo",        saving: "Save 50%" },
                  { plan: "Enterprise",            standard: "£2,000/mo",   founding: "£1,000/mo",      saving: "Save 50%" },
                ].map((r, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "0 0 10px", lineHeight: "1.4" }}>{r.plan}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", textDecoration: "line-through", margin: "0 0 4px" }}>{r.standard}</p>
                    <p style={{ fontSize: "16px", fontWeight: "800", color: gold, margin: "0 0 8px" }}>{r.founding}</p>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#6ee7b7", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "999px" }}>{r.saving}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => router.push("/founding")}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
                Apply for a Founding Spot →
              </button>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
                We review every application personally and respond within 24 hours.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
