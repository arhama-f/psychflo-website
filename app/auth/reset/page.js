"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";
import { getSupabaseBrowser } from "../../../lib/supabase.js";

const gold = "#c9a84c";

export default function PasswordReset() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const inp = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "13px 16px", color: "#f8fafc", fontSize: "14px", outline: "none", boxSizing: "border-box" };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    const db = getSupabaseBrowser();
    if (!db) { setError("Service not configured"); setLoading(false); return; }

    const { error: resetErr } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (resetErr) { setError(resetErr.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "420px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "36px" }}>
          {!sent ? (
            <>
              <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px" }}>Reset your password</h1>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px", lineHeight: "1.6" }}>Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "6px" }}>EMAIL</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={inp} />
                </div>
                {error && <p style={{ fontSize: "13px", color: "#fca5a5", margin: "0 0 16px", background: "rgba(239,68,68,0.08)", padding: "10px 14px", borderRadius: "8px" }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
              <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
                <span onClick={() => router.push("/auth/login")} style={{ color: gold, cursor: "pointer" }}>Back to sign in</span>
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>📧</div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>Check your email</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: "0 0 24px", lineHeight: "1.6" }}>We sent a reset link to <strong style={{ color: "#f8fafc" }}>{email}</strong>. It expires in 10 minutes.</p>
              <button onClick={() => router.push("/auth/login")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "11px 24px", borderRadius: "9px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
