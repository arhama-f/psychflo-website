"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const EVENT_META = {
  assessment_completed: { label: "Assessment Completed",  icon: "✓", color: "#10b981" },
  risk_flag_raised:     { label: "Risk Flag Raised",      icon: "⚠", color: "#fb923c" },
  intervention_logged:  { label: "Intervention Logged",   icon: "🎯", color: "#a78bfa" },
  policy_reviewed:      { label: "Policy Reviewed",       icon: "📋", color: "#60a5fa" },
  consent_given:        { label: "Consent Given",         icon: "✅", color: "#10b981" },
  consent_withdrawn:    { label: "Consent Withdrawn",     icon: "❌", color: "#ef4444" },
  sso_login:            { label: "SSO Authentication",    icon: "🔒", color: "rgba(255,255,255,0.4)" },
  data_export:          { label: "Data Export (GDPR)",    icon: "📤", color: "#facc15" },
};

const FRAMEWORK_STATUS = {
  compliant:     { label: "Compliant",      color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)" },
  partial:       { label: "Partial",        color: gold,      bg: "rgba(201,168,76,0.1)",  border: "rgba(201,168,76,0.25)" },
  non_compliant: { label: "Non-Compliant",  color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)" },
};

function ComplianceRing({ score, size = 100 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#10b981" : score >= 60 ? gold : "#ef4444";
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: "stroke-dasharray 0.8s ease" }} />
      <text x={size/2} y={size/2 - 4} textAnchor="middle" fontSize="22" fontWeight="900" fill={color}>{score}</text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)">/ 100</text>
    </svg>
  );
}

export default function CompliancePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedClause, setExpandedClause] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    fetch("/api/compliance?org_id=demo")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function generateEvidencePack() {
    setGeneratingReport(true);
    await new Promise(r => setTimeout(r, 1200));
    window.print();
    setGeneratingReport(false);
  }

  const score = data?.compliance_score ?? 0;
  const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? gold : "#ef4444";

  return (
    <>
      <style>{`
        @media print {
          nav, .no-print { display: none !important; }
          .print-section { page-break-inside: avoid; }
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
        <div className="no-print"><Nav /></div>

        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px 100px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "inline-block", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", color: "#60a5fa", fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "999px", marginBottom: "12px", letterSpacing: "0.06em" }}>
                COMPLIANCE & AUDIT
              </div>
              <h1 style={{ fontSize: "34px", fontWeight: "900", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>ISO 45003 Compliance</h1>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Real-time compliance status, audit trail, and evidence pack generation for psychological safety standards.</p>
            </div>
            <div className="no-print" style={{ display: "flex", gap: "10px" }}>
              <button onClick={generateEvidencePack} disabled={generatingReport}
                style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "11px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
                {generatingReport ? "Generating…" : "Export Evidence Pack →"}
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "80px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading compliance data…</div>
          ) : (
            <>
              {/* Framework score cards */}
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", marginBottom: "28px", alignItems: "center" }}>
                <ComplianceRing score={score} size={120} />
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 6px" }}>
                    {score >= 80 ? "Compliant" : score >= 60 ? "Partially Compliant" : "Action Required"}
                  </h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 14px" }}>
                    {data?.clauses_met} of {data?.clauses_total} ISO 45003:2021 clauses evidenced · Next review: {data?.next_review ? new Date(data.next_review).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                  </p>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {(data?.frameworks || []).map(fw => {
                      const cfg = FRAMEWORK_STATUS[fw.status] || FRAMEWORK_STATUS.partial;
                      return (
                        <div key={fw.id} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: "10px", padding: "10px 16px" }}>
                          <p style={{ fontSize: "10px", fontWeight: "700", color: cfg.color, margin: "0 0 2px", letterSpacing: "0.05em" }}>{fw.label}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "18px", fontWeight: "900", color: cfg.color }}>{fw.score}%</span>
                            <span style={{ fontSize: "10px", fontWeight: "700", color: cfg.color, background: "rgba(0,0,0,0.2)", padding: "2px 6px", borderRadius: "999px" }}>{cfg.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="no-print" style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "4px", width: "fit-content" }}>
                {[
                  { id: "overview", label: "ISO 45003 Checklist" },
                  { id: "audit",    label: "Audit Trail" },
                  { id: "gdpr",     label: "GDPR & Privacy" },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ background: activeTab === tab.id ? "rgba(255,255,255,0.1)" : "none", border: activeTab === tab.id ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent", color: activeTab === tab.id ? "#f8fafc" : "rgba(255,255,255,0.4)", padding: "8px 18px", borderRadius: "9px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ISO 45003 Checklist */}
              {(activeTab === "overview") && (
                <div className="print-section" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
                  {(data?.clauses || []).map((c, i) => (
                    <div key={c.clause} style={{ background: c.met ? "rgba(16,185,129,0.04)" : "rgba(239,68,68,0.04)", border: `1px solid ${c.met ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`, borderRadius: "12px", overflow: "hidden" }}>
                      <div onClick={() => setExpandedClause(expandedClause === c.clause ? null : c.clause)}
                        style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: "14px", padding: "16px 20px", alignItems: "center", cursor: "pointer" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: c.met ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                          {c.met ? "✓" : "✗"}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                            <span style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>§{c.clause}</span>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>{c.title}</span>
                          </div>
                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{c.description}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", margin: "0 0 2px" }}>PsychFlo feature</p>
                          <p style={{ fontSize: "11px", color: c.met ? "#10b981" : "rgba(255,255,255,0.3)", margin: 0, fontWeight: "600" }}>{c.psychflo_feature}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: c.met ? "#10b981" : "#ef4444", background: c.met ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", padding: "3px 9px", borderRadius: "999px" }}>
                            {c.met ? `${c.evidence_count} events` : "No evidence"}
                          </span>
                          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", transform: expandedClause === c.clause ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                        </div>
                      </div>
                      {expandedClause === c.clause && (
                        <div style={{ padding: "0 20px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "14px", lineHeight: "1.7" }}>
                            <strong style={{ color: "#f8fafc" }}>Clause weight:</strong> {c.weight}/10 · <strong style={{ color: "#f8fafc" }}>Evidence required:</strong> {c.evidence_type.replace(/_/g, " ")} · <strong style={{ color: "#f8fafc" }}>Events logged:</strong> {c.evidence_count}
                          </p>
                          {!c.met && (
                            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "12px 14px", marginTop: "10px" }}>
                              <p style={{ fontSize: "12px", color: "#fca5a5", margin: 0 }}>
                                <strong>Action required:</strong> Use {c.psychflo_feature} to generate the required evidence. This clause contributes {c.weight} points to your compliance score.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Audit Trail */}
              {activeTab === "audit" && (
                <div style={{ marginBottom: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{data?.audit_log?.length || 0} events · Immutable audit log</p>
                    <button onClick={generateEvidencePack}
                      style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                      Export log →
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {(data?.audit_log || []).map((event, i) => {
                      const meta = EVENT_META[event.event_type] || { label: event.event_type, icon: "•", color: "rgba(255,255,255,0.4)" };
                      const payload = event.event_data || {};
                      return (
                        <div key={event.id || i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "14px 18px", display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: "14px", alignItems: "center" }}>
                          <span style={{ fontSize: "16px" }}>{meta.icon}</span>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: "600", color: meta.color, margin: "0 0 2px" }}>{meta.label}</p>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
                              {payload.employee ? `Employee: ${payload.employee}` : ""}
                              {payload.tool ? `Tool: ${payload.tool}` : ""}
                              {payload.manager ? `Manager: ${payload.manager}` : ""}
                              {payload.action ? ` · ${payload.action}` : ""}
                              {payload.policy ? `Policy: ${payload.policy}` : ""}
                              {payload.report ? payload.report : ""}
                              {payload.score !== undefined ? ` · Score: ${payload.score}` : ""}
                              {payload.risk_level ? ` · Risk: ${payload.risk_level}` : ""}
                              {payload.gaps !== undefined ? ` · ${payload.gaps} gaps found` : ""}
                            </p>
                          </div>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: "999px" }}>§{event.iso_clause}</span>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
                            {new Date(event.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} {new Date(event.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GDPR tab */}
              {activeTab === "gdpr" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                  {[
                    { article: "Art. 5", title: "Data minimisation", status: "met", desc: "PsychFlo only collects data necessary for psychological safety assessment. No unnecessary personal data is processed." },
                    { article: "Art. 6", title: "Lawful basis for processing", status: "met", desc: "Processing is based on legitimate interests (employee wellbeing) and, where required, explicit consent recorded in the audit trail." },
                    { article: "Art. 7", title: "Conditions for consent", status: "met", desc: "Employee consent is obtained and logged before any personal data is processed. Withdrawal can be exercised at any time." },
                    { article: "Art. 13", title: "Transparency & privacy notice", status: "action", desc: "Ensure your privacy notice references PsychFlo as a data processor. Template available in your compliance pack." },
                    { article: "Art. 17", title: "Right to erasure", status: "met", desc: "Employees can request full data deletion via your admin panel. All data removed within 30 days." },
                    { article: "Art. 25", title: "Privacy by design", status: "met", desc: "All data anonymised at team level (<5 employees). No individual data visible to managers. Row-level security enforced." },
                    { article: "Art. 28", title: "Data processor agreements", status: "action", desc: "Ensure DPA is signed with PsychFlo before processing personal data. Contact support@psychflo.io." },
                    { article: "Art. 32", title: "Security of processing", status: "met", desc: "Data encrypted at rest (AES-256) and in transit (TLS 1.3). Supabase SOC 2 Type II certified infrastructure." },
                  ].map((item, i) => (
                    <div key={i} style={{ background: item.status === "met" ? "rgba(16,185,129,0.04)" : "rgba(251,146,60,0.05)", border: `1px solid ${item.status === "met" ? "rgba(16,185,129,0.15)" : "rgba(251,146,60,0.2)"}`, borderRadius: "12px", padding: "18px 22px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "14px", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "16px", marginTop: "2px" }}>{item.status === "met" ? "✅" : "⚠️"}</span>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>{item.article}</span>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>{item.title}</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.6" }}>{item.desc}</p>
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px", whiteSpace: "nowrap", color: item.status === "met" ? "#10b981" : "#fb923c", background: item.status === "met" ? "rgba(16,185,129,0.1)" : "rgba(251,146,60,0.1)" }}>
                        {item.status === "met" ? "Satisfied" : "Action needed"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upgrade CTA for regulated industries */}
              <div style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.18)", borderRadius: "16px", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "#60a5fa", margin: "0 0 4px" }}>Regulated industry? Get full compliance coverage</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Enterprise plan includes quarterly compliance reviews, dedicated audit support, and custom evidence packs for regulators.</p>
                </div>
                <a href="/demo" style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", textDecoration: "none", whiteSpace: "nowrap" }}>
                  Book enterprise demo →
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
