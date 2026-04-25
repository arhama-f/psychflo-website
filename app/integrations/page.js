"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

function SlackSection() {
  const gold = "#c9a84c";
  const [tab, setTab] = useState("alerts");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [botToken, setBotToken] = useState("");
  const [channelId, setChannelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinResult, setCheckinResult] = useState(null);
  const [connected, setConnected] = useState({ hasWebhook: false, hasBot: false });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/slack/connect").then(r => r.json()).then(d => {
      if (d.connected) setConnected(d);
    }).catch(() => null);
  }, []);

  async function handleTestWebhook() {
    if (!webhookUrl) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/slack/connect", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_webhook", webhookUrl }),
      });
      const data = await res.json();
      setResult(data.error ? { error: data.error } : { ok: "Test message sent to Slack!" });
      if (!data.error) setConnected(c => ({ ...c, hasWebhook: true }));
    } catch (e) { setResult({ error: e.message }); }
    setLoading(false);
  }

  async function handleConnectBot() {
    if (!botToken || !channelId) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/slack/connect", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_checkin", botToken, channelId }),
      });
      const data = await res.json();
      setResult(data.error ? { error: data.error } : { ok: "Check-in bot connected! Test message sent." });
      if (!data.error) setConnected(c => ({ ...c, hasBot: true }));
    } catch (e) { setResult({ error: e.message }); }
    setLoading(false);
  }

  async function handleSendCheckin(type) {
    setCheckinLoading(true); setCheckinResult(null);
    try {
      const res = await fetch("/api/slack/checkin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      setCheckinResult(data.error ? { error: data.error } : { ok: "Check-in sent to Slack channel!" });
    } catch (e) { setCheckinResult({ error: e.message }); }
    setCheckinLoading(false);
  }

  const isConnected = connected.hasWebhook || connected.hasBot;

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: open ? "1px solid rgba(74,144,226,0.35)" : isConnected ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "28px" }}>💬</span>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px" }}>Slack</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Receive safety alerts in Slack and send check-in prompts to your team.</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {connected.hasWebhook && <span style={{ fontSize: "10px", fontWeight: "700", background: "rgba(16,185,129,0.15)", color: "#6ee7b7", padding: "3px 8px", borderRadius: "999px" }}>ALERTS ON</span>}
          {connected.hasBot && <span style={{ fontSize: "10px", fontWeight: "700", background: "rgba(74,144,226,0.15)", color: "#93c5fd", padding: "3px 8px", borderRadius: "999px" }}>BOT ON</span>}
          <button onClick={() => setOpen(o => !o)}
            style={{ background: open ? "rgba(74,144,226,0.15)" : isConnected ? "rgba(16,185,129,0.1)" : `linear-gradient(135deg,${gold},#f0d080)`, border: open ? "1px solid rgba(74,144,226,0.3)" : isConnected ? "1px solid rgba(16,185,129,0.2)" : "none", color: open ? "#93c5fd" : isConnected ? "#6ee7b7" : "#0f172a", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            {open ? "Close" : isConnected ? "Manage" : "Connect"}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", gap: "0", marginBottom: "24px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "3px", width: "fit-content" }}>
            {["alerts", "checkin"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ background: tab === t ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: tab === t ? "#f8fafc" : "rgba(255,255,255,0.35)", padding: "8px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                {t === "alerts" ? "Safety alerts" : "Check-in bot"}
              </button>
            ))}
          </div>

          {tab === "alerts" && (
            <div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.6" }}>
                  Paste an <strong style={{ color: "rgba(255,255,255,0.7)" }}>Incoming Webhook URL</strong> from your Slack app. PsychFlo will post here whenever a safety flag is detected.{" "}
                  <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noreferrer" style={{ color: gold }}>Create webhook →</a>
                </p>
              </div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px", letterSpacing: "0.04em" }}>SLACK WEBHOOK URL</label>
              <input type="password" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://hooks.slack.com/services/T.../B.../..."
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "#f8fafc", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: "14px" }} />
              {result && <div style={{ background: result.error ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${result.error ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`, borderRadius: "8px", padding: "10px 14px", marginBottom: "14px" }}>
                <p style={{ fontSize: "13px", color: result.error ? "#fca5a5" : "#6ee7b7", margin: 0 }}>{result.error || result.ok}</p>
              </div>}
              <button onClick={handleTestWebhook} disabled={loading || !webhookUrl}
                style={{ background: loading || !webhookUrl ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg,${gold},#f0d080)`, color: loading || !webhookUrl ? "rgba(255,255,255,0.3)" : "#0f172a", border: "none", padding: "11px 24px", borderRadius: "9px", fontSize: "13px", fontWeight: "800", cursor: loading || !webhookUrl ? "default" : "pointer" }}>
                {loading ? "Sending…" : "Test & save webhook"}
              </button>

              {connected.hasWebhook && (
                <div style={{ marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "12px", letterSpacing: "0.06em" }}>SEND CHECK-IN PROMPT VIA WEBHOOK</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["standup", "pulse"].map(type => (
                      <button key={type} onClick={() => handleSendCheckin(type)} disabled={checkinLoading}
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                        Send {type} check-in
                      </button>
                    ))}
                  </div>
                  {checkinResult && <p style={{ fontSize: "12px", color: checkinResult.error ? "#f87171" : "#6ee7b7", marginTop: "10px" }}>{checkinResult.error || checkinResult.ok}</p>}
                </div>
              )}
            </div>
          )}

          {tab === "checkin" && (
            <div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.6" }}>
                  Use a <strong style={{ color: "rgba(255,255,255,0.7)" }}>Bot Token</strong> to send interactive check-in prompts directly to a Slack channel. The bot posts standup and pulse survey links.{" "}
                  <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" style={{ color: gold }}>Create Slack app →</a>
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px", letterSpacing: "0.04em" }}>BOT TOKEN (xoxb-...)</label>
                  <input type="password" value={botToken} onChange={e => setBotToken(e.target.value)} placeholder="xoxb-your-bot-token"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "#f8fafc", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px", letterSpacing: "0.04em" }}>CHANNEL ID</label>
                  <input type="text" value={channelId} onChange={e => setChannelId(e.target.value)} placeholder="C0123456789 (right-click channel → Copy channel ID)"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "#f8fafc", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              </div>
              {result && <div style={{ background: result.error ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${result.error ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`, borderRadius: "8px", padding: "10px 14px", marginBottom: "14px" }}>
                <p style={{ fontSize: "13px", color: result.error ? "#fca5a5" : "#6ee7b7", margin: 0 }}>{result.error || result.ok}</p>
              </div>}
              <button onClick={handleConnectBot} disabled={loading || !botToken || !channelId}
                style={{ background: loading || !botToken || !channelId ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg,${gold},#f0d080)`, color: loading || !botToken || !channelId ? "rgba(255,255,255,0.3)" : "#0f172a", border: "none", padding: "11px 24px", borderRadius: "9px", fontSize: "13px", fontWeight: "800", cursor: loading || !botToken || !channelId ? "default" : "pointer" }}>
                {loading ? "Connecting…" : "Connect check-in bot"}
              </button>

              {connected.hasBot && (
                <div style={{ marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "12px", letterSpacing: "0.06em" }}>SEND NOW</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["standup", "pulse"].map(type => (
                      <button key={type} onClick={() => handleSendCheckin(type)} disabled={checkinLoading}
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                        Send {type} check-in
                      </button>
                    ))}
                  </div>
                  {checkinResult && <p style={{ fontSize: "12px", color: checkinResult.error ? "#f87171" : "#6ee7b7", marginTop: "10px" }}>{checkinResult.error || checkinResult.ok}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>INTEGRATIONS</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Connect your tools</h1>
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

        {/* Slack */}
        <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.25)", marginBottom: "12px", letterSpacing: "0.06em" }}>SLACK</p>
        <SlackSection />

        {/* HRIS providers */}
        <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.25)", margin: "32px 0 12px", letterSpacing: "0.06em" }}>HRIS / PEOPLE SYSTEMS</p>
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
