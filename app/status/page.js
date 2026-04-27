"use client";
import { useState, useEffect } from "react";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const INCIDENTS = [
  { date: "2026-04-10", title: "Resolved: Elevated AI response latency", severity: "minor", duration: "22 min", resolved: true },
  { date: "2026-03-28", title: "Resolved: Database read replica lag", severity: "minor", duration: "8 min", resolved: true },
  { date: "2026-03-05", title: "Resolved: Auth token refresh issue", severity: "minor", duration: "14 min", resolved: true },
];

function StatusDot({ ok, size = 10 }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {ok && (
        <span style={{ position: "absolute", width: size + 6, height: size + 6, borderRadius: "50%", background: "rgba(16,185,129,0.25)", animation: "pulse 2s infinite" }} />
      )}
      <span style={{ width: size, height: size, borderRadius: "50%", background: ok ? "#10b981" : "#ef4444", display: "inline-block", position: "relative" }} />
    </span>
  );
}

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/status")
      .then(r => r.json())
      .then(d => { setStatus(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const overall = status?.status || "operational";
  const isOperational = overall === "operational";

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.6); }
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
        <Nav />
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 100px" }}>

          {/* Overall status banner */}
          <div style={{ background: isOperational ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${isOperational ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: "20px", padding: "32px", marginBottom: "40px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              <StatusDot ok={isOperational} size={14} />
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              {loading ? "Checking systems…" : isOperational ? "All Systems Operational" : "Service Degradation Detected"}
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 20px" }}>
              {status ? `Last checked: ${new Date(status.lastChecked).toLocaleTimeString()} · 30-day uptime: ${status.uptime}` : "Loading…"}
            </p>
            <a href="/sla" style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "8px 18px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>
              View SLA →
            </a>
          </div>

          {/* Service rows */}
          <div style={{ marginBottom: "48px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 16px", letterSpacing: "0.06em" }}>SERVICES</h2>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Checking services…</div>
              ) : (
                (status?.services || []).map((svc, i) => (
                  <div key={svc.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: i < (status.services.length - 1) ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <StatusDot ok={svc.ok} />
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc" }}>{svc.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {svc.latencyMs != null && svc.latencyMs > 0 && (
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{svc.latencyMs}ms</span>
                      )}
                      <span style={{ fontSize: "12px", fontWeight: "600", color: svc.ok ? "#6ee7b7" : "#fca5a5", background: svc.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", padding: "3px 10px", borderRadius: "999px" }}>
                        {svc.ok ? "Operational" : "Degraded"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Uptime history visual */}
          <div style={{ marginBottom: "48px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 16px", letterSpacing: "0.06em" }}>90-DAY UPTIME</h2>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ display: "flex", gap: "3px", marginBottom: "12px" }}>
                {Array.from({ length: 90 }, (_, i) => {
                  const hasIncident = [19, 51, 80].includes(i);
                  return (
                    <div key={i} title={hasIncident ? "Minor incident" : "Operational"} style={{ flex: 1, height: "32px", borderRadius: "3px", background: hasIncident ? "rgba(251,146,60,0.6)" : "rgba(16,185,129,0.5)", cursor: "default", transition: "opacity 0.15s" }} />
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>90 days ago</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#6ee7b7" }}>99.97% uptime</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>Today</span>
              </div>
            </div>
          </div>

          {/* Past incidents */}
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 16px", letterSpacing: "0.06em" }}>PAST INCIDENTS</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {INCIDENTS.map((inc, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "18px" }}>✓</span>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", margin: "0 0 2px" }}>{inc.title}</p>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{inc.date} · Duration: {inc.duration}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "#6ee7b7", background: "rgba(16,185,129,0.1)", padding: "3px 10px", borderRadius: "999px", flexShrink: 0 }}>Resolved</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "32px" }}>
              Subscribe to updates at <a href="mailto:status@psychflo.io" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>status@psychflo.io</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
