"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const PROVIDERS = [
  {
    id: "bamboohr",
    name: "BambooHR",
    logo: "🎋",
    desc: "Sync employees, departments, and manager relationships from BambooHR.",
    fields: [
      { key: "subdomain", label: "Company subdomain", placeholder: "yourcompany (from yourcompany.bamboohr.com)", type: "text" },
      { key: "apiKey", label: "API key", placeholder: "Paste your BambooHR API key", type: "password" },
    ],
    helpUrl: "https://documentation.bamboohr.com/docs/getting-your-api-key",
    helpText: "Generate an API key in BambooHR → your profile → API Keys.",
  },
  {
    id: "hibob",
    name: "HiBob",
    logo: "👋",
    desc: "Import your people directory from HiBob using a service user token.",
    fields: [
      { key: "serviceToken", label: "Service user token", placeholder: "Paste your HiBob service token", type: "password" },
    ],
    helpUrl: "https://apidocs.hibob.com/docs/getting-started",
    helpText: "Create a service user in HiBob → Integrations → Service Users.",
  },
  {
    id: "personio",
    name: "Personio",
    logo: "🟠",
    desc: "Connect to Personio via API credentials to sync your employee list.",
    fields: [
      { key: "clientId", label: "Client ID", placeholder: "Your Personio client ID", type: "text" },
      { key: "clientSecret", label: "Client secret", placeholder: "Your Personio client secret", type: "password" },
    ],
    helpUrl: "https://developer.personio.de/docs/getting-started-with-the-personio-api",
    helpText: "Generate API credentials in Personio → Settings → Integrations → API.",
  },
  {
    id: "csv",
    name: "CSV Import",
    logo: "📄",
    desc: "Upload a spreadsheet of employees. Works with any HRIS that can export CSV.",
    fields: [],
    helpText: "Required columns: email, name (or first_name + last_name). Download template below.",
  },
];

export default function IntegrationsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [csvRows, setCsvRows] = useState(null);

  useEffect(() => {
    fetch("/api/integrations/sync")
      .then(r => r.json())
      .then(d => setConnections(d.connections || []))
      .catch(() => null);
  }, []);

  const getConnection = (id) => connections.find(c => c.provider === id);

  function handleCsvUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").filter(Boolean);
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));
      const rows = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
        const obj = {};
        headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
        return obj;
      }).filter(r => r.email);
      setCsvRows(rows);
    };
    reader.readAsText(file);
  }

  async function handleConnect(providerId) {
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (providerId === "csv") {
        if (!csvRows?.length) { setResult({ error: "Please upload a CSV file first." }); setLoading(false); return; }
        res = await fetch("/api/integrations/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employees: csvRows }),
        });
      } else {
        res = await fetch(`/api/integrations/${providerId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      const data = await res.json();
      setResult(data);
      if (!data.error) {
        setConnections(prev => {
          const filtered = prev.filter(c => c.provider !== providerId);
          return [...filtered, { provider: providerId, status: "connected", last_synced_at: new Date().toISOString(), employee_count: data.synced }];
        });
      }
    } catch { setResult({ error: "Connection failed. Check your credentials and try again." }); }
    setLoading(false);
  }

  async function handleSync(providerId) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/integrations/${providerId}`);
      const data = await res.json();
      setResult(data);
      if (!data.error) {
        setConnections(prev => prev.map(c => c.provider === providerId
          ? { ...c, last_synced_at: new Date().toISOString(), employee_count: data.synced }
          : c));
      }
    } catch { setResult({ error: "Sync failed." }); }
    setLoading(false);
  }

  function downloadTemplate() {
    const csv = "email,name,department\njohn.smith@company.com,John Smith,Engineering\njane.doe@company.com,Jane Doe,Product\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "psychflo-import-template.csv"; a.click();
  }

  const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", marginBottom: "12px" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px" }}>

        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>HRIS INTEGRATIONS</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Connect your people system</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.7" }}>Sync your employee directory so PsychFlo automatically knows your team structure. Employees are imported without consent — they only join the platform when they log in and consent.</p>
        </div>

        {/* Connected integrations summary */}
        {connections.length > 0 && (
          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "14px", padding: "20px", marginBottom: "32px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#6ee7b7", margin: "0 0 14px", letterSpacing: "0.06em" }}>ACTIVE CONNECTIONS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {connections.map((c) => {
                const p = PROVIDERS.find(pr => pr.id === c.provider);
                return (
                  <div key={c.provider} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "20px" }}>{p?.logo}</span>
                      <div>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc" }}>{p?.name}</span>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginLeft: "10px" }}>{c.employee_count} employees · synced {new Date(c.last_synced_at).toLocaleDateString("en-GB")}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", background: "rgba(16,185,129,0.15)", color: "#6ee7b7", padding: "3px 10px", borderRadius: "999px" }}>CONNECTED</span>
                      {c.provider !== "csv" && (
                        <button onClick={() => handleSync(c.provider)} disabled={loading} style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "4px 12px", borderRadius: "6px", cursor: "pointer" }}>
                          Sync now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Provider cards */}
        {PROVIDERS.map((provider) => {
          const conn = getConnection(provider.id);
          const isActive = active === provider.id;

          return (
            <div key={provider.id} style={{ ...card, border: isActive ? `1px solid rgba(201,168,76,0.3)` : conn ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "28px" }}>{provider.logo}</span>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px" }}>{provider.name}</h3>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.5" }}>{provider.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActive(isActive ? null : provider.id)}
                  style={{ flexShrink: 0, background: conn ? "rgba(16,185,129,0.1)" : isActive ? "rgba(201,168,76,0.15)" : `linear-gradient(135deg,${gold},#f0d080)`, border: conn ? "1px solid rgba(16,185,129,0.2)" : isActive ? `1px solid rgba(201,168,76,0.3)` : "none", color: conn ? "#6ee7b7" : isActive ? gold : "#0f172a", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {conn ? "Reconnect" : isActive ? "Cancel" : "Connect"}
                </button>
              </div>

              {isActive && (
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  {provider.helpText && (
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.6" }}>{provider.helpText}{" "}
                        {provider.helpUrl && <a href={provider.helpUrl} target="_blank" rel="noreferrer" style={{ color: gold, textDecoration: "underline" }}>View docs →</a>}
                      </p>
                    </div>
                  )}

                  {provider.id === "csv" ? (
                    <div>
                      <button onClick={downloadTemplate} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", marginBottom: "14px" }}>
                        Download CSV template
                      </button>
                      <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "10px", padding: "24px", textAlign: "center", marginBottom: "14px" }}>
                        <input type="file" accept=".csv" onChange={handleCsvUpload} style={{ display: "none" }} id="csv-upload" />
                        <label htmlFor="csv-upload" style={{ cursor: "pointer" }}>
                          <div style={{ fontSize: "28px", marginBottom: "8px" }}>📂</div>
                          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>Click to upload a CSV file</p>
                          {csvRows && <p style={{ fontSize: "12px", color: "#6ee7b7", margin: 0 }}>✓ {csvRows.length} employees found in file</p>}
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                      {provider.fields.map((field) => (
                        <div key={field.key}>
                          <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px", letterSpacing: "0.04em" }}>{field.label.toUpperCase()}</label>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={form[field.key] || ""}
                            onChange={(e) => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "#f8fafc", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {result && isActive && (
                    <div style={{ background: result.error ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${result.error ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`, borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
                      {result.error
                        ? <p style={{ fontSize: "13px", color: "#fca5a5", margin: 0 }}>{result.error}</p>
                        : <p style={{ fontSize: "13px", color: "#6ee7b7", margin: 0 }}>✓ Connected — {result.synced} employees synced to PsychFlo.</p>
                      }
                    </div>
                  )}

                  <button
                    onClick={() => handleConnect(provider.id)}
                    disabled={loading}
                    style={{ background: loading ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg,${gold},#f0d080)`, color: loading ? "rgba(255,255,255,0.3)" : "#0f172a", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: loading ? "default" : "pointer" }}>
                    {loading ? "Connecting…" : `Connect ${provider.name}`}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* What happens after sync */}
        <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "14px", padding: "24px", marginTop: "8px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: gold, margin: "0 0 14px", letterSpacing: "0.06em" }}>WHAT HAPPENS AFTER SYNC</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { icon: "📧", title: "Invite emails sent", desc: "Imported employees receive an invite to complete their first burnout check-in." },
              { icon: "🔒", title: "No data without consent", desc: "Employee data is stored securely. PsychFlo never processes wellbeing data without explicit opt-in." },
              { icon: "🔄", title: "Auto-sync available", desc: "On paid plans, PsychFlo re-syncs your HRIS weekly so leavers and new joiners update automatically." },
              { icon: "🏗️", title: "Team structure preserved", desc: "Departments and reporting lines are mapped to PsychFlo teams for anonymised aggregate reporting." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", margin: "0 0 3px" }}>{item.title}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: "1.5" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
