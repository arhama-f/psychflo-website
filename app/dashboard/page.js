"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const TOOLS = [
  { id: "burnout",      icon: "🔥", name: "Burnout Monitor",       desc: "Team risk scores & trends",        href: "/tools/burnout?view=manager" },
  { id: "standup",      icon: "💬", name: "Standup Safety",         desc: "AI-scored async standups",         href: "/tools/standup" },
  { id: "coaching",     icon: "🎯", name: "Manager Coaching",       desc: "Practice hard conversations",      href: "/tools/coaching" },
  { id: "cogload",      icon: "🧠", name: "Cognitive Load",         desc: "Flow state & interruptions",       href: "/tools/cogload" },
  { id: "onboarding",   icon: "📊", name: "Onboarding Tracker",     desc: "90-day belonging score",           href: "/tools/onboarding" },
  { id: "journaling",   icon: "📓", name: "Reflective Journal",     desc: "CBT-powered journaling",           href: "/tools/journaling" },
  { id: "grief",        icon: "💛", name: "Grief Support",          desc: "Compassionate guidance",           href: "/tools/grief" },
  { id: "ux",           icon: "🔬", name: "UX Research",            desc: "Transcript & insight analysis",    href: "/tools/ux-research" },
  { id: "policy",       icon: "📋", name: "Policy Analyser",        desc: "Mental health policy audit",       href: "/tools/policy" },
  { id: "benchmarks",   icon: "📈", name: "Industry Benchmarks",    desc: "How you compare to peers",         href: "/benchmarks" },
  { id: "compliance",   icon: "🏛️", name: "ISO 45003 Compliance",   desc: "Audit trail & evidence pack",      href: "/compliance" },
  { id: "pulse",        icon: "💗", name: "Daily Pulse",            desc: "Employee 30-sec check-in",         href: "/pulse" },
];

const QUICK_ACTIONS = [
  { label: "Flight Risk Dashboard", icon: "🚨", href: "/attrition",          highlight: true },
  { label: "Board Report",          icon: "📄", href: "/report/board" },
  { label: "Benchmarks",            icon: "📈", href: "/benchmarks" },
  { label: "Compliance / ISO 45003",icon: "🏛️", href: "/compliance" },
  { label: "Invite team",           icon: "✉️", href: "/onboarding" },
];

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0f1e" }} />}>
      <Dashboard />
    </Suspense>
  );
}

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded") === "true";

  const [teamData, setTeamData] = useState(null);
  const [teamLoading, setTeamLoading] = useState(true);
  const [integrations, setIntegrations] = useState([]);
  const [slackConnected, setSlackConnected] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinSent, setCheckinSent] = useState(false);
  const [attritionSummary, setAttritionSummary] = useState({ at_risk: 3, critical: 1, avg_risk: 45 });
  const [roi, setRoi] = useState(null);

  useEffect(() => {
    fetch("/api/team")
      .then(r => r.json())
      .then(d => { setTeamData(d); setTeamLoading(false); })
      .catch(() => setTeamLoading(false));

    fetch("/api/integrations/sync")
      .then(r => r.json())
      .then(d => setIntegrations(d.connections || []))
      .catch(() => null);

    fetch("/api/slack/connect")
      .then(r => r.json())
      .then(d => setSlackConnected(d.connected || false))
      .catch(() => null);

    fetch("/api/attrition?org_id=demo")
      .then(r => r.json())
      .then(d => { if (d.summary) setAttritionSummary(d.summary); })
      .catch(() => null);

    fetch("/api/report/board?org_id=demo")
      .then(r => r.json())
      .then(d => { if (d.financials) setRoi(d.financials); })
      .catch(() => null);
  }, []);

  async function sendCheckin(type) {
    setCheckinLoading(true);
    await fetch("/api/slack/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    }).catch(() => null);
    setCheckinLoading(false);
    setCheckinSent(true);
    setTimeout(() => setCheckinSent(false), 3000);
  }

  const Bar = ({ value, color = gold, height = 5 }) => (
    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "999px", height, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", background: color, borderRadius: "999px" }} />
    </div>
  );

  const riskColor = (score) => score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Trial banner — shown during 7-day trial */}
        {!upgraded && (
          <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "14px", padding: "14px 20px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>⏳</span>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", color: gold, margin: "0 0 2px" }}>You&apos;re on a free 7-day trial — 6 days remaining</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Full access to all features. No charge until day 7. Cancel anytime.</p>
              </div>
            </div>
            <button onClick={() => router.push("/pricing")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "9px 20px", borderRadius: "9px", fontSize: "13px", fontWeight: "800", cursor: "pointer", whiteSpace: "nowrap" }}>
              Upgrade now →
            </button>
          </div>
        )}

        {upgraded && (
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", padding: "14px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>🎉</span>
            <span style={{ fontSize: "14px", color: "#6ee7b7", fontWeight: "600" }}>Plan upgraded — team features unlocked.</span>
          </div>
        )}

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Manager Dashboard</h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>Team wellbeing overview · Updated weekly</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {slackConnected && (
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => sendCheckin("standup")} disabled={checkinLoading}
                  style={{ background: checkinSent ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)", border: `1px solid ${checkinSent ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`, color: checkinSent ? "#6ee7b7" : "rgba(255,255,255,0.6)", padding: "9px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {checkinSent ? "✓ Sent" : "💬 Send check-in"}
                </button>
              </div>
            )}
            <button onClick={() => router.push("/report")}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              📄 Export report
            </button>
            <button onClick={() => router.push("/tools/burnout")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "9px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
              Take check-in →
            </button>
          </div>
        </div>

        {/* Team metrics */}
        {teamLoading ? (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "40px", textAlign: "center", marginBottom: "24px" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: 0 }}>Loading team data…</p>
          </div>
        ) : teamData?.suppressed ? (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "32px", textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 6px" }}>Waiting for more responses</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 16px", lineHeight: "1.6" }}>{teamData.reason}</p>
            <div style={{ width: "200px", margin: "0 auto 16px", background: "rgba(255,255,255,0.07)", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: `${(teamData.responseCount / 5) * 100}%`, height: "100%", background: gold, borderRadius: "999px" }} />
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", margin: "0 0 20px" }}>{teamData.responseCount} / 5 responses this week</p>
            <button onClick={() => router.push("/onboarding")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "11px 24px", borderRadius: "9px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
              Invite team members →
            </button>
          </div>
        ) : teamData ? (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "14px" }}>
              {[
                { label: "Team risk score", value: `${teamData.overallRisk}/100`, color: riskColor(teamData.overallRisk) },
                { label: "High risk", value: teamData.atHighRisk, color: "#ef4444" },
                { label: "Moderate risk", value: teamData.atModerateRisk, color: "#f59e0b" },
                { label: "Low risk", value: teamData.atLowRisk, color: "#10b981" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: s.color, marginBottom: "4px" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 12px", letterSpacing: "0.06em" }}>6-WEEK TREND</p>
                <div style={{ display: "flex", gap: "5px", alignItems: "flex-end", height: "60px" }}>
                  {(teamData.weeklyTrend || []).map((s, i, arr) => (
                    <div key={i} style={{ flex: 1, background: i === arr.length - 1 ? riskColor(teamData.overallRisk) : "rgba(255,255,255,0.12)", borderRadius: "3px 3px 0 0", height: `${s * 1.1}px` }} />
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 12px", letterSpacing: "0.06em" }}>TOP STRESSORS</p>
                {(teamData.topTeamStressors || []).slice(0, 3).map((s, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{s.stressor}</span>
                      <span style={{ fontSize: "10px", color: s.percentage > 70 ? "#ef4444" : s.percentage > 50 ? "#f59e0b" : "#10b981", fontWeight: "700" }}>{s.percentage}%</span>
                    </div>
                    <Bar value={s.percentage} color={s.percentage > 70 ? "#ef4444" : s.percentage > 50 ? "#f59e0b" : "#10b981"} />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => router.push("/tools/burnout?view=manager")}
              style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "12px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
              Full team dashboard →
            </button>
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "40px", textAlign: "center", marginBottom: "24px" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: "0 0 16px" }}>No team data yet. Take the first check-in to get started.</p>
            <button onClick={() => router.push("/tools/burnout")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "11px 24px", borderRadius: "9px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
              Take check-in →
            </button>
          </div>
        )}

        {/* Attrition risk widget */}
        <div onClick={() => router.push("/attrition")}
          style={{ background: attritionSummary.critical > 0 ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${attritionSummary.critical > 0 ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: "14px", padding: "18px 22px", marginBottom: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: attritionSummary.critical > 0 ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🚨</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 2px" }}>Predictive Attrition</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                <span style={{ color: attritionSummary.at_risk > 0 ? "#fb923c" : "#10b981", fontWeight: "700" }}>{attritionSummary.at_risk} employees</span> at high or critical flight risk · Org avg risk: {attritionSummary.avg_risk}/100
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            {attritionSummary.critical > 0 && (
              <span style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "999px" }}>
                🔴 {attritionSummary.critical} CRITICAL
              </span>
            )}
            <span style={{ color: gold, fontSize: "13px", fontWeight: "700" }}>View →</span>
          </div>
        </div>

        {/* Live ROI widget + Manager Effectiveness */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
          {/* ROI Widget */}
          <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "14px", padding: "20px 22px" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: gold, margin: "0 0 14px", letterSpacing: "0.08em" }}>LIVE ROI CALCULATOR</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
              {[
                { label: "Cost exposure", value: roi ? `£${(roi.attrition_exposure || 0).toLocaleString("en-GB")}` : "£120,000", color: "#fb923c" },
                { label: "Cost prevented", value: roi ? `£${(roi.cost_prevented || 0).toLocaleString("en-GB")}` : "£104,000", color: "#10b981" },
                { label: "Platform cost", value: roi ? `£${(roi.psychflo_cost || 0).toLocaleString("en-GB")}/yr` : "£3,600/yr", color: "rgba(255,255,255,0.45)" },
                { label: "Your ROI", value: roi ? `${roi.roi || 0}x` : "29x", color: gold },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "10px 12px" }}>
                  <p style={{ fontSize: "9px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 4px", letterSpacing: "0.05em" }}>{s.label.toUpperCase()}</p>
                  <div style={{ fontSize: "18px", fontWeight: "900", color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <button onClick={() => router.push("/report/board")}
              style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "9px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>
              Generate Board Report →
            </button>
          </div>

          {/* Manager Effectiveness */}
          <div onClick={() => router.push("/manager-effectiveness")}
            style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "14px", padding: "20px 22px", cursor: "pointer" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#a78bfa", margin: "0 0 14px", letterSpacing: "0.08em" }}>MANAGER EFFECTIVENESS</p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              {[{ name: "J. Park", grade: "A+", color: "#10b981" }, { name: "R. Torres", grade: "A", color: "#6ee7b7" }, { name: "D. Kim", grade: "B", color: gold }, { name: "S. Obi", grade: "C", color: "#fb923c" }].map((m, i) => (
                <div key={i} style={{ flex: 1, background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: "900", color: m.color }}>{m.grade}</div>
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "3px" }}>{m.name}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 12px", lineHeight: "1.5" }}>1 manager needs urgent coaching. 1 is a model to replicate.</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "12px", color: "#a78bfa", fontWeight: "700" }}>View all managers →</span>
            </div>
          </div>
        </div>

        {/* Tools grid */}
        <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.25)", marginBottom: "12px", letterSpacing: "0.07em" }}>AI TOOLS</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "28px" }}>
          {TOOLS.map(tool => (
            <button key={tool.id} onClick={() => router.push(tool.href)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", textAlign: "left", cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>{tool.icon}</div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", margin: "0 0 3px" }}>{tool.name}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{tool.desc}</p>
            </button>
          ))}
        </div>

        {/* Bottom row: integrations + quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

          {/* Integrations status */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: 0, letterSpacing: "0.06em" }}>INTEGRATIONS</p>
              <button onClick={() => router.push("/integrations")}
                style={{ fontSize: "11px", color: gold, background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>
                Manage →
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Slack", connected: slackConnected, icon: "💬" },
                ...["bamboohr", "hibob", "personio", "csv"].map(p => ({
                  label: p === "csv" ? "CSV Import" : p.charAt(0).toUpperCase() + p.slice(1),
                  connected: integrations.some(c => c.provider === p),
                  icon: p === "bamboohr" ? "🎋" : p === "hibob" ? "👋" : p === "personio" ? "🟠" : "📄",
                })),
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px" }}>{item.icon}</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: item.connected ? "#6ee7b7" : "rgba(255,255,255,0.2)", background: item.connected ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "999px" }}>
                    {item.connected ? "CONNECTED" : "NOT SET"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 14px", letterSpacing: "0.06em" }}>QUICK ACTIONS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {QUICK_ACTIONS.map((a, i) => (
                <button key={i} onClick={() => router.push(a.href)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", background: a.highlight ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.04)", border: `1px solid ${a.highlight ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: "9px", padding: "10px 14px", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: "16px" }}>{a.icon}</span>
                  <span style={{ fontSize: "13px", color: a.highlight ? "#fca5a5" : "rgba(255,255,255,0.6)", fontWeight: a.highlight ? "700" : "500" }}>{a.label}</span>
                </button>
              ))}
              {slackConnected && (
                <button onClick={() => sendCheckin("pulse")} disabled={checkinLoading}
                  style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "9px", padding: "10px 14px", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: "16px" }}>💬</span>
                  <span style={{ fontSize: "13px", color: gold, fontWeight: "600" }}>{checkinSent ? "✓ Sent!" : "Send Slack pulse check-in"}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
