"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const GRADE_CONFIG = {
  "A+": { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", label: "Exceptional" },
  "A":  { color: "#6ee7b7", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", label: "Strong" },
  "B":  { color: gold,      bg: "rgba(201,168,76,0.1)",  border: "rgba(201,168,76,0.25)", label: "Developing" },
  "C":  { color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.25)", label: "Needs Support" },
  "D":  { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)", label: "At Risk" },
};

function ScoreRing({ score, size = 64 }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#facc15" : score >= 40 ? "#fb923c" : "#ef4444";
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={color}>{score}</text>
    </svg>
  );
}

export default function ManagerEffectivenessPage() {
  const router = useRouter();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/manager-effectiveness?org_id=demo")
      .then(r => r.json())
      .then(d => {
        setManagers(d.managers || []);
        setIsDemo(d.is_demo !== false);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const orgAvg = managers.length
    ? Math.round(managers.reduce((a, m) => a + m.effectiveness_score, 0) / managers.length)
    : 0;

  const topPerformer = managers[0];
  const needsSupport = [...managers].sort((a, b) => a.effectiveness_score - b.effectiveness_score)[0];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
      <Nav />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "999px", marginBottom: "12px", letterSpacing: "0.06em" }}>
              MANAGER EFFECTIVENESS
            </div>
            <h1 style={{ fontSize: "34px", fontWeight: "900", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Manager Effectiveness Score</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Which managers are developing their teams — and which are burning them out.</p>
          </div>
          <button onClick={() => router.push("/report/board")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "11px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
            Export Board Report →
          </button>
        </div>

        {isDemo && (
          <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "12px", padding: "14px 20px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>✦</span>
            <p style={{ fontSize: "13px", color: gold, margin: 0 }}>Demo mode — add a <code style={{ background: "rgba(0,0,0,0.3)", padding: "1px 6px", borderRadius: "4px" }}>manager_id</code> field to your employees table to see live scores.</p>
          </div>
        )}

        {/* Org summary strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "12px", marginBottom: "32px" }}>
          {[
            { label: "Org Avg Effectiveness", value: `${orgAvg}/100`, color: orgAvg >= 70 ? "#10b981" : orgAvg >= 50 ? gold : "#fb923c" },
            { label: "Managers Tracked", value: managers.length, color: "#f8fafc" },
            { label: "Top Performer", value: topPerformer?.name?.split(" ")[0] || "—", color: "#10b981" },
            { label: "Needs Coaching", value: managers.filter(m => m.effectiveness_score < 55).length, color: "#fb923c" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px 20px" }}>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 8px", letterSpacing: "0.06em" }}>{s.label.toUpperCase()}</p>
              <div style={{ fontSize: "26px", fontWeight: "900", color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Loading effectiveness scores…</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {managers.map((mgr, rank) => {
              const cfg = GRADE_CONFIG[mgr.grade] || GRADE_CONFIG["B"];
              const isOpen = selected === mgr.id;

              return (
                <div key={mgr.id} style={{ background: isOpen ? cfg.bg : "rgba(255,255,255,0.03)", border: `1px solid ${isOpen ? cfg.border : "rgba(255,255,255,0.07)"}`, borderRadius: "14px", overflow: "hidden", transition: "all 0.2s" }}>
                  {/* Row */}
                  <div onClick={() => setSelected(isOpen ? null : mgr.id)}
                    style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto auto", gap: "16px", padding: "18px 22px", alignItems: "center", cursor: "pointer" }}>

                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: rank === 0 ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)", color: rank === 0 ? gold : "rgba(255,255,255,0.3)", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {rank + 1}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>{mgr.name}</span>
                        <span style={{ fontSize: "10px", fontWeight: "700", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: "2px 8px", borderRadius: "999px" }}>{mgr.grade} · {cfg.label}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{mgr.role} · {mgr.headcount} direct reports</p>
                    </div>

                    <ScoreRing score={mgr.effectiveness_score} size={56} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", minWidth: "240px" }}>
                      {[
                        { label: "Team burnout", value: mgr.team_avg_burnout, bad: true },
                        { label: "Safety score", value: mgr.team_avg_safety, bad: false },
                        { label: "Attrition risk", value: mgr.team_attrition_risk, bad: true },
                      ].map((m, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "15px", fontWeight: "800", color: m.bad ? (m.value > 60 ? "#ef4444" : m.value > 40 ? "#fb923c" : "#10b981") : (m.value > 70 ? "#10b981" : m.value > 50 ? gold : "#fb923c") }}>{m.value}</div>
                          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{m.label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {mgr.trend !== 0 && (
                        <span style={{ fontSize: "11px", color: mgr.trend > 0 ? "#10b981" : "#fb923c", fontWeight: "700" }}>
                          {mgr.trend > 0 ? "▲" : "▼"} {Math.abs(mgr.trend)}
                        </span>
                      )}
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▼</span>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div style={{ padding: "0 22px 22px", borderTop: `1px solid ${cfg.border}` }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "18px" }}>
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 10px", letterSpacing: "0.05em" }}>STRENGTHS</p>
                          {mgr.strengths.length ? mgr.strengths.map((s, i) => (
                            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                              <span style={{ color: "#10b981", fontWeight: "700", flexShrink: 0 }}>✓</span>
                              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>{s}</span>
                            </div>
                          )) : <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Insufficient data</p>}
                        </div>
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 10px", letterSpacing: "0.05em" }}>RISK SIGNALS</p>
                          {mgr.risks.length ? mgr.risks.map((r, i) => (
                            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                              <span style={{ color: "#fb923c", fontWeight: "700", flexShrink: 0 }}>!</span>
                              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>{r}</span>
                            </div>
                          )) : <p style={{ fontSize: "12px", color: "#10b981", margin: 0 }}>No active risk signals</p>}
                        </div>
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 10px", letterSpacing: "0.05em" }}>RECOMMENDED ACTION</p>
                          <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: "10px", padding: "12px" }}>
                            <p style={{ fontSize: "13px", color: "#f8fafc", margin: "0 0 12px", lineHeight: "1.6" }}>{mgr.recommendation}</p>
                            <button onClick={() => router.push("/tools/coaching")}
                              style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                              Start coaching session
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
        )}

        {/* Methodology note */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px 24px", marginTop: "28px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.25)", margin: "0 0 8px", letterSpacing: "0.06em" }}>HOW SCORES ARE CALCULATED</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: "1.7" }}>
            Manager Effectiveness Score = weighted composite of team burnout (35%), team psychological safety (35%), and team attrition risk (30%) across all direct reports. Scores are updated when employees complete AI tool assessments. All data is anonymised — individual scores are never attributed to specific employees in manager views.
          </p>
        </div>
      </div>
    </div>
  );
}
