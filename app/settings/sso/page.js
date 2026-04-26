"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const PROVIDERS = [
  { id: "okta", name: "Okta", icon: "🔵", desc: "SAML 2.0 via Okta Identity Cloud" },
  { id: "azure", name: "Microsoft Azure AD", icon: "🪟", desc: "SAML 2.0 via Microsoft Entra ID" },
  { id: "google", name: "Google Workspace", icon: "🔴", desc: "SAML 2.0 via Google Workspace" },
  { id: "onelogin", name: "OneLogin", icon: "🟣", desc: "SAML 2.0 via OneLogin" },
  { id: "generic_saml", name: "Generic SAML 2.0", icon: "🔒", desc: "Any SAML 2.0 compatible identity provider" },
];

export default function SSOSettingsPage() {
  const router = useRouter();
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState("");
  const [domain, setDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/sso")
      .then(r => r.json())
      .then(d => { setConnection(d.connection); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!domain || !provider) return;
    setSaving(true); setResult(null);
    try {
      const res = await fetch("/api/sso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, provider }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ ok: true, setupUrl: data.setupUrl, connectionId: data.connectionId });
      setConnection({ provider, domain, status: "pending", workos_connection_id: data.connectionId });
    } catch (e) {
      setResult({ error: e.message });
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Remove SSO connection? Users will need to sign in with password.")) return;
    setDeleting(true);
    await fetch("/api/sso", { method: "DELETE" }).catch(() => null);
    setConnection(null);
    setResult(null);
    setDeleting(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px" }}>

        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "13px", cursor: "pointer", marginBottom: "28px", padding: 0 }}>
          ← Back
        </button>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.06em" }}>ENTERPRISE SSO</div>
          <h1 style={{ fontSize: "30px", fontWeight: "800", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Single Sign-On (SAML)</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.7" }}>Let your team sign in using your company identity provider. Supports Okta, Azure AD, Google Workspace, OneLogin, and any SAML 2.0 provider.</p>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Loading…</div>
        ) : connection ? (
          // Active connection
          <div>
            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 4px", letterSpacing: "0.06em" }}>ACTIVE CONNECTION</p>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px" }}>
                    {PROVIDERS.find(p => p.id === connection.provider)?.icon} {PROVIDERS.find(p => p.id === connection.provider)?.name || connection.provider}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Domain: <strong style={{ color: "#f8fafc" }}>{connection.domain}</strong></p>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "700", padding: "5px 12px", borderRadius: "999px", background: connection.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(251,146,60,0.15)", color: connection.status === "active" ? "#6ee7b7" : "#fb923c" }}>
                  {connection.status?.toUpperCase() || "PENDING"}
                </span>
              </div>
              {connection.status !== "active" && (
                <div style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "#fb923c", margin: "0 0 6px" }}>SETUP REQUIRED</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 10px", lineHeight: "1.6" }}>Your SSO connection is created but your IT admin needs to complete the SAML configuration in your identity provider.</p>
                  {result?.setupUrl && (
                    <a href={result.setupUrl} target="_blank" rel="noreferrer"
                      style={{ display: "inline-block", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", padding: "8px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>
                      Open WorkOS setup →
                    </a>
                  )}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                {[
                  { label: "ACS URL (Assertion Consumer Service)", value: `${process.env.NEXT_PUBLIC_URL || "https://psychflo-website.vercel.app"}/api/auth/sso/callback` },
                  { label: "Entity ID / Audience", value: `urn:workos:${connection.workos_connection_id || "pending"}` },
                ].map((f, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 4px", letterSpacing: "0.04em" }}>{f.label.toUpperCase()}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0, wordBreak: "break-all", fontFamily: "monospace" }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleDelete} disabled={deleting}
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", padding: "9px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                {deleting ? "Removing…" : "Remove connection"}
              </button>
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 12px", letterSpacing: "0.06em" }}>HOW USERS SIGN IN</p>
              {["User visits psychflo-website.vercel.app/auth/login", `Clicks "Sign in with SSO" → enters ${connection.domain}`, "Redirected to your identity provider to authenticate", "Returned to PsychFlo dashboard automatically"].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(201,168,76,0.15)", color: gold, fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6", paddingTop: "2px" }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Setup form
          <div>
            {result?.error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#fca5a5", margin: 0 }}>{result.error}</p>
              </div>
            )}

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 20px", letterSpacing: "0.06em" }}>CHOOSE IDENTITY PROVIDER</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                {PROVIDERS.map(p => (
                  <button key={p.id} onClick={() => setProvider(p.id)}
                    style={{ background: provider === p.id ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${provider === p.id ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", padding: "14px", textAlign: "left", cursor: "pointer" }}>
                    <div style={{ fontSize: "20px", marginBottom: "6px" }}>{p.icon}</div>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: provider === p.id ? gold : "#f8fafc", margin: "0 0 2px" }}>{p.name}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{p.desc}</p>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "8px", letterSpacing: "0.04em" }}>COMPANY EMAIL DOMAIN</label>
                <input type="text" value={domain} onChange={e => setDomain(e.target.value)} placeholder="yourcompany.com"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", color: "#f8fafc", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: "6px 0 0" }}>Users with this email domain will be routed to SSO automatically.</p>
              </div>

              <button onClick={handleSave} disabled={saving || !domain || !provider}
                style={{ width: "100%", background: saving || !domain || !provider ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg,${gold},#f0d080)`, color: saving || !domain || !provider ? "rgba(255,255,255,0.3)" : "#0f172a", border: "none", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: saving || !domain || !provider ? "default" : "pointer" }}>
                {saving ? "Creating connection…" : "Create SSO connection →"}
              </button>
            </div>

            <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "14px", padding: "20px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: gold, margin: "0 0 12px", letterSpacing: "0.06em" }}>WHAT HAPPENS NEXT</p>
              {["We create a SAML connection via WorkOS", "You get setup instructions for your IT admin", "Admin configures SAML in your identity provider (10 min)", "Test the connection — users can sign in via SSO instantly"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ color: gold, fontWeight: "700", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
