"use client";
import Nav from "../components/Nav";
import { useRouter } from "next/navigation";

const gold = "#c9a84c";

const TIERS = [
  {
    name: "Starter",
    uptime: "99.5%",
    supportResponse: "48 hours",
    incidentResponse: "24 hours",
    credits: "10%",
    channels: ["Email"],
    color: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.1)",
    textColor: "#f8fafc",
  },
  {
    name: "Growth",
    uptime: "99.9%",
    supportResponse: "8 hours",
    incidentResponse: "4 hours",
    credits: "25%",
    channels: ["Email", "Slack"],
    color: "rgba(201,168,76,0.06)",
    border: "rgba(201,168,76,0.3)",
    textColor: gold,
    highlight: true,
  },
  {
    name: "Enterprise",
    uptime: "99.99%",
    supportResponse: "1 hour",
    incidentResponse: "30 minutes",
    credits: "50%",
    channels: ["Email", "Slack", "Phone"],
    color: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.3)",
    textColor: "#a78bfa",
  },
];

const DEFINITIONS = [
  {
    term: "Monthly Uptime %",
    def: "The percentage of total minutes in a calendar month during which the PsychFlo service is available and operational, excluding scheduled maintenance windows.",
  },
  {
    term: "Downtime",
    def: "A period where the PsychFlo platform is completely unavailable or returning errors on >50% of requests, not caused by factors outside PsychFlo's reasonable control.",
  },
  {
    term: "Service Credit",
    def: "A percentage reduction applied to your next monthly invoice as compensation for downtime exceeding your tier's SLA commitment.",
  },
  {
    term: "Incident",
    def: "Any event causing unplanned degradation or unavailability of the PsychFlo service, classified as P1 (critical), P2 (high), or P3 (medium).",
  },
];

const EXCLUSIONS = [
  "Scheduled maintenance (communicated 48h in advance via status page)",
  "Force majeure events (natural disasters, war, government action)",
  "Third-party service outages beyond PsychFlo's control (AWS, Anthropic, Supabase global outages)",
  "Customer-caused issues (misconfiguration, API misuse, exceeding rate limits)",
  "Planned upgrades to improve service performance or security",
  "Issues caused by unsupported browsers or environments",
];

const INCIDENT_SEVERITY = [
  {
    level: "P1 — Critical",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    desc: "Full platform outage or data loss risk",
    response: "30 min (Enterprise) / 2h (Growth) / 4h (Starter)",
    resolution: "4h target",
  },
  {
    level: "P2 — High",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
    desc: "Core feature unavailable, significant impact",
    response: "2h (Enterprise) / 8h (Growth) / 24h (Starter)",
    resolution: "24h target",
  },
  {
    level: "P3 — Medium",
    color: "#facc15",
    bg: "rgba(250,204,21,0.08)",
    border: "rgba(250,204,21,0.2)",
    desc: "Non-critical degradation, workaround available",
    response: "8h (Enterprise) / 24h (Growth) / 48h (Starter)",
    resolution: "72h target",
  },
];

export default function SLAPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
      <Nav />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "20px", letterSpacing: "0.06em" }}>SERVICE LEVEL AGREEMENT</div>
          <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.03em" }}>Our Commitment<br />to Reliability</h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "560px", margin: "0 auto 28px", lineHeight: "1.7" }}>PsychFlo guarantees platform availability by tier. When we miss the mark, you receive automatic service credits — no questions asked.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/status" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7", padding: "10px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
              View Live Status
            </a>
            <a href="mailto:support@psychflo.io" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "10px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
              Report an Incident
            </a>
          </div>
        </div>

        {/* Uptime tiers */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", margin: "0 0 24px", letterSpacing: "-0.01em" }}>Uptime Guarantees by Plan</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {TIERS.map(tier => (
              <div key={tier.name} style={{ background: tier.color, border: `1px solid ${tier.border}`, borderRadius: "16px", padding: "28px", position: "relative" }}>
                {tier.highlight && (
                  <div style={{ position: "absolute", top: "-1px", right: "20px", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", fontSize: "10px", fontWeight: "800", padding: "4px 12px", borderRadius: "0 0 8px 8px", letterSpacing: "0.05em" }}>MOST POPULAR</div>
                )}
                <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.4)", margin: "0 0 8px", letterSpacing: "0.06em" }}>{tier.name.toUpperCase()}</p>
                <div style={{ fontSize: "42px", fontWeight: "900", color: tier.textColor, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{tier.uptime}</div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px" }}>monthly uptime guarantee</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { label: "Support response", value: tier.supportResponse },
                    { label: "Incident response", value: tier.incidentResponse },
                    { label: "Service credit", value: `Up to ${tier.credits} of monthly fee` },
                    { label: "Support channels", value: tier.channels.join(", ") },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{row.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#f8fafc", textAlign: "right" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident severity */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Incident Severity Levels</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px" }}>All response times are measured from the time PsychFlo acknowledges the incident.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {INCIDENT_SEVERITY.map(inc => (
              <div key={inc.level} style={{ background: inc.bg, border: `1px solid ${inc.border}`, borderRadius: "14px", padding: "20px 24px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ minWidth: "160px" }}>
                    <p style={{ fontSize: "13px", fontWeight: "800", color: inc.color, margin: "0 0 4px" }}>{inc.level}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{inc.desc}</p>
                  </div>
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", minWidth: "260px" }}>
                    <div>
                      <p style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 4px", letterSpacing: "0.05em" }}>INITIAL RESPONSE</p>
                      <p style={{ fontSize: "12px", color: "#f8fafc", margin: 0 }}>{inc.response}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 4px", letterSpacing: "0.05em" }}>RESOLUTION TARGET</p>
                      <p style={{ fontSize: "12px", color: "#f8fafc", margin: 0 }}>{inc.resolution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to claim credits */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "32px", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.01em" }}>How Service Credits Work</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px", lineHeight: "1.7" }}>If PsychFlo fails to meet the monthly uptime commitment for your plan, you are eligible for service credits applied to your next invoice.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            {[
              { range: "99.0% – SLA threshold", credit: "10% credit" },
              { range: "95.0% – 98.99%", credit: "25% credit" },
              { range: "Below 95%", credit: "50% credit" },
            ].map((row, i) => (
              <div key={i} style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "10px", padding: "16px" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 6px" }}>{row.range}</p>
                <p style={{ fontSize: "18px", fontWeight: "800", color: gold, margin: 0 }}>{row.credit}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "Credits are applied automatically within 5 business days of a qualifying incident closing.",
              "Credits are capped at 50% of your monthly subscription fee.",
              "Credits do not apply to one-time fees, setup costs, or overage charges.",
              "You must report the downtime incident within 30 days of occurrence to be eligible.",
              "Credits cannot be converted to cash or transferred between accounts.",
            ].map((note, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: gold, fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>→</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Definitions */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", margin: "0 0 24px", letterSpacing: "-0.01em" }}>Definitions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {DEFINITIONS.map(d => (
              <div key={d.term} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "18px 22px" }}>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px" }}>{d.term}</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.7" }}>{d.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.01em" }}>SLA Exclusions</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 20px" }}>The following are not counted as downtime for SLA purposes:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {EXCLUSIONS.map((ex, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 0", borderBottom: i < EXCLUSIONS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>{i + 1}</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>{ex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & CTA */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "16px", padding: "28px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: gold, margin: "0 0 8px", letterSpacing: "0.06em" }}>REPORT AN INCIDENT</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 16px", lineHeight: "1.6" }}>Experiencing an outage? Contact us immediately — Enterprise customers get a dedicated on-call line.</p>
            <a href="mailto:support@psychflo.io" style={{ display: "inline-block", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>Email Support</a>
          </div>
          <div style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "16px", padding: "28px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#a78bfa", margin: "0 0 8px", letterSpacing: "0.06em" }}>CUSTOM ENTERPRISE SLA</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 16px", lineHeight: "1.6" }}>Need 99.99% uptime, dedicated infrastructure, or a bespoke SLA agreement? Talk to our enterprise team.</p>
            <a href="/demo" style={{ display: "inline-block", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>Book a Demo</a>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: "1.8" }}>
          This SLA is incorporated into and subject to the PsychFlo Terms of Service. Effective date: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}.<br />
          PsychFlo reserves the right to update this SLA with 30 days notice via email and the status page.
        </p>
      </div>
    </div>
  );
}
