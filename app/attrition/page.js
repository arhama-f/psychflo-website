"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const RISK_CONFIG = {
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", label: "CRITICAL", emoji: "🔴" },
  high:     { color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.25)", label: "HIGH",     emoji: "🟠" },
  medium:   { color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.2)",  label: "MEDIUM",   emoji: "🟡" },
  low:      { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)",  label: "LOW",      emoji: "🟢" },
  unscored: { color: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", label: "UNSCORED", emoji: "⚪" },
};

// Demo data so the page is useful without a live DB
const DEMO_EMPLOYEES = [
  { id: "1", name: "Sarah Chen", role: "Senior Engineer", tenure_months: 22, risk_score: 81, risk_level: "critical", drivers: ["Declining standup safety scores (3 consecutive weeks)", "Cognitive overload — 14 high-load days this month", "No 1:1 logged in 6 weeks"], recommendation: "Schedule an urgent skip-level conversation and reduce sprint scope by 30% immediately.", predicted_departure_days: 30, trend: 12, last_scored: new Date().toISOString() },
  { id: "2", name: "Marcus Williams", role: "Product Manager", tenure_months: 8, risk_score: 67, risk_level: "high", drivers: ["Low onboarding satisfaction (42/100)", "High meeting load limiting deep work", "Role scope unclear per self-reports"], recommendation: "Clarify OKRs and decision-making authority in writing; reduce meeting load by 40%.", predicted_departure_days: 60, trend: 8, last_scored: new Date().toISOString() },
  { id: "3", name: "Aisha Patel", role: "Data Scientist", tenure_months: 31, risk_score: 58, risk_level: "high", drivers: ["Stagnant growth trajectory for 8 months", "Low flow score average (38/100)", "Disengagement from team rituals"], recommendation: "Offer a stretch project or promotion pathway conversation within 2 weeks.", predicted_departure_days: 60, trend: 5, last_scored: new Date().toISOString() },
  { id: "4", name: "Tom Reeves", role: "UX Designer", tenure_months: 14, risk_score: 44, risk_level: "medium", drivers: ["Intermittent burnout spikes", "Cross-team friction flagged in standups", "Workload imbalance vs. peers"], recommendation: "Review workload distribution and facilitate a team retro on collaboration norms.", predicted_departure_days: 90, trend: -3, last_scored: new Date().toISOString() },
  { id: "5", name: "Priya Nair", role: "Engineering Manager", tenure_months: 19, risk_score: 31, risk_level: "medium", drivers: ["Manager cognitive load elevated", "Team morale dip last 2 weeks", "No recent coaching engagement"], recommendation: "Connect with manager coaching resources and discuss team support needs.", predicted_departure_days: 90, trend: 2, last_scored: new Date().toISOString() },
  { id: "6", name: "James Okafor", role: "Backend Engineer", tenure_months: 7, risk_score: 19, risk_level: "low", drivers: ["Strong onboarding scores (78/100)", "Consistent engagement with tools", "Positive standup sentiment"], recommendation: "Continue regular check-ins. Consider stretch assignment to maintain momentum.", predicted_departure_days: null, trend: -6, last_scored: new Date().toISOString() },
  { id: "7", name: "Elena Volkov", role: "Customer Success", tenure_months: 45, risk_score: 12, risk_level: "low", drivers: ["High psychological safety scores", "Stable cognitive load patterns", "Long tenure with positive trajectory"], recommendation: "Recognise tenure milestone. Explore mentorship role to deepen engagement.", predicted_departure_days: null, trend: -9, last_scored: new Date().toISOString() },
];

const DEMO_SUMMARY = {
  total: 7, scored: 7, critical: 1, high: 2, medium: 2, low: 2,
  avg_risk: 45, at_risk: 3, trending_up: 3,
};

function RiskBadge({ level, size = "sm" }) {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG.unscored;
  const pad = size === "lg" ? "6px 16px" : "3px 10px";
  const fontSize = size === "lg" ? "12px" : "10px";
  return (
    <span style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, padding: pad, borderRadius: "999px", fontSize, fontWeight: "700", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
      {cfg.emoji} {cfg.label}
    </span>
  );
}

function RiskBar({ score }) {
  const color = score >= 76 ? "#ef4444" : score >= 51 ? "#fb923c" : score >= 26 ? "#facc15" : "#10b981";
  return (
    <div style={{ position: "relative", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden", width: "100%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${score}%`, background: color, borderRadius: "999px", transition: "width 0.6s ease" }} />
    </div>
  );
}

function TrendPill({ trend }) {
  if (trend === 0) return <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>— stable</span>;
  const up = trend > 0;
  return (
    <span style={{ fontSize: "11px", color: up ? "#fb923c" : "#10b981", fontWeight: "600" }}>
      {up ? "↑" : "↓"} {Math.abs(trend)} pts
    </span>
  );
}

export default function AttritionPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState(DEMO_EMPLOYEES);
  const [summary, setSummary] = useState(DEMO_SUMMARY);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [scoring, setScoring] = useState(false);
  const [digestSent, setDigestSent] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/attrition?org_id=demo");
      if (!res.ok) return;
      const data = await res.json();
      if (data.employees?.length) {
        setEmployees(data.employees);
        setSummary(data.summary);
        setIsDemo(false);
      }
    } catch {}
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function runScoring() {
    setScoring(true);
    try {
      await fetch("/api/attrition", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ org_id: "demo" }) });
      await loadData();
    } catch {}
    setScoring(false);
  }

  async function sendDigest() {
    try {
      await fetch("/api/attrition/digest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ org_id: "demo" }) });
      setDigestSent(true);
      setTimeout(() => setDigestSent(false), 4000);
    } catch {}
  }

  const filtered = employees.filter(e => {
    if (filter !== "all" && e.risk_level !== filter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.role?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statCards = [
    { label: "Employees Tracked", value: summary.total, color: "#f8fafc", sub: `${summary.scored} scored` },
    { label: "At Risk (High+)", value: summary.at_risk, color: "#fb923c", sub: `${summary.critical} critical`, alert: summary.critical > 0 },
    { label: "Avg Risk Score", value: `${summary.avg_risk}/100`, color: summary.avg_risk > 60 ? "#ef4444" : summary.avg_risk > 40 ? "#fb923c" : "#10b981", sub: "org-wide" },
    { label: "Risk Trending Up", value: summary.trending_up, color: "#facc15", sub: "this week" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
      <Nav />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "999px", marginBottom: "12px", letterSpacing: "0.06em" }}>
              PREDICTIVE ATTRITION · BETA
            </div>
            <h1 style={{ fontSize: "36px", fontWeight: "900", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Flight Risk Dashboard</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0 }}>AI-powered attrition prediction. Know who's leaving before they hand in their notice.</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={sendDigest} disabled={digestSent}
              style={{ background: digestSent ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${digestSent ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`, color: digestSent ? "#6ee7b7" : "rgba(255,255,255,0.6)", padding: "10px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              {digestSent ? "✓ Digest Sent" : "Send Slack Digest"}
            </button>
            <button onClick={runScoring} disabled={scoring}
              style={{ background: scoring ? "rgba(201,168,76,0.1)" : `linear-gradient(135deg,${gold},#f0d080)`, color: scoring ? gold : "#0f172a", border: scoring ? `1px solid rgba(201,168,76,0.3)` : "none", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: scoring ? "default" : "pointer" }}>
              {scoring ? "Scoring…" : "Run AI Assessment →"}
            </button>
          </div>
        </div>

        {isDemo && (
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "12px", padding: "14px 20px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>✦</span>
            <p style={{ fontSize: "13px", color: gold, margin: 0 }}>Demo mode — showing sample data. Connect your HRIS or invite your team to see live flight risk scores.</p>
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "36px" }}>
          {statCards.map((s, i) => (
            <div key={i} style={{ background: s.alert ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.04)", border: `1px solid ${s.alert ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`, borderRadius: "14px", padding: "20px 22px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 8px", letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</p>
              <div style={{ fontSize: "32px", fontWeight: "900", color: s.color, letterSpacing: "-0.02em", marginBottom: "4px" }}>{s.value}</div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Risk breakdown bar */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px 24px", marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 14px", letterSpacing: "0.06em" }}>RISK DISTRIBUTION</p>
          <div style={{ display: "flex", gap: "4px", height: "10px", borderRadius: "999px", overflow: "hidden", marginBottom: "12px" }}>
            {[
              { count: summary.critical, color: "#ef4444" },
              { count: summary.high, color: "#fb923c" },
              { count: summary.medium, color: "#facc15" },
              { count: summary.low, color: "#10b981" },
            ].map((seg, i) => summary.scored > 0 && (
              <div key={i} style={{ flex: seg.count / summary.scored, background: seg.color, minWidth: seg.count > 0 ? "4px" : "0" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[
              { label: "Critical", count: summary.critical, color: "#ef4444" },
              { label: "High", count: summary.high, color: "#fb923c" },
              { label: "Medium", count: summary.medium, color: "#facc15" },
              { label: "Low", count: summary.low, color: "#10b981" },
            ].map(seg => (
              <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{seg.label}: <strong style={{ color: "#f8fafc" }}>{seg.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters + search */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or role…"
            style={{ flex: 1, minWidth: "180px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#f8fafc", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: "6px" }}>
            {["all", "critical", "high", "medium", "low"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ background: filter === f ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${filter === f ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.08)"}`, color: filter === f ? gold : "rgba(255,255,255,0.4)", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", textTransform: "capitalize" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Employee cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
              No employees match this filter.
            </div>
          )}
          {filtered.map(emp => {
            const cfg = RISK_CONFIG[emp.risk_level] || RISK_CONFIG.unscored;
            const isOpen = selected === emp.id;
            return (
              <div key={emp.id} style={{ background: isOpen ? cfg.bg : "rgba(255,255,255,0.03)", border: `1px solid ${isOpen ? cfg.border : "rgba(255,255,255,0.07)"}`, borderRadius: "14px", overflow: "hidden", transition: "all 0.2s" }}>
                {/* Row */}
                <div onClick={() => setSelected(isOpen ? null : emp.id)}
                  style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "16px", padding: "18px 22px", alignItems: "center", cursor: "pointer" }}>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{emp.name}</span>
                      <RiskBadge level={emp.risk_level} />
                    </div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{emp.role} · {emp.tenure_months}mo tenure</p>
                  </div>

                  <div style={{ textAlign: "right", minWidth: "120px" }}>
                    <div style={{ fontSize: "22px", fontWeight: "900", color: cfg.color, letterSpacing: "-0.01em" }}>{emp.risk_score ?? "—"}</div>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", margin: 0 }}>risk score</p>
                  </div>

                  <div style={{ minWidth: "100px" }}>
                    <RiskBar score={emp.risk_score ?? 0} />
                    <div style={{ marginTop: "6px" }}>
                      <TrendPill trend={emp.trend} />
                    </div>
                  </div>

                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▼</span>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ padding: "0 22px 22px", borderTop: `1px solid ${cfg.border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "18px" }}>
                      <div>
                        <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 10px", letterSpacing: "0.05em" }}>TOP RISK DRIVERS</p>
                        {(emp.drivers || []).map((d, i) => (
                          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                            <span style={{ color: cfg.color, fontWeight: "700", flexShrink: 0 }}>{i + 1}.</span>
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>{d}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 10px", letterSpacing: "0.05em" }}>MANAGER ACTION</p>
                        <div style={{ background: `${cfg.bg}`, border: `1px solid ${cfg.border}`, borderRadius: "10px", padding: "12px" }}>
                          <p style={{ fontSize: "13px", color: "#f8fafc", margin: "0 0 8px", lineHeight: "1.6" }}>{emp.recommendation}</p>
                          {emp.predicted_departure_days && (
                            <p style={{ fontSize: "11px", color: cfg.color, margin: 0, fontWeight: "700" }}>
                              ⚠ Predicted departure window: within {emp.predicted_departure_days} days
                            </p>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                          <button onClick={() => router.push("/tools/coaching")}
                            style={{ flex: 1, background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "9px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                            Start coaching session
                          </button>
                          <button onClick={() => router.push("/scripts")}
                            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "9px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                            Generate script
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scale callout */}
        <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "16px", padding: "28px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💰</div>
          <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Every prevented resignation saves £50–100k</h3>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: "0 0 20px", lineHeight: "1.7", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            Replacement cost for a senior employee is 1.5–2× annual salary. PsychFlo surfaces the signal 30–90 days before they resign — giving you time to act.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/demo" style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", textDecoration: "none" }}>Book enterprise demo</a>
            <a href="/pricing" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>See pricing</a>
          </div>
        </div>
      </div>
    </div>
  );
}
