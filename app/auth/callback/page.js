"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../../../lib/supabase.js";

const gold = "#c9a84c";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Processing your sign-in...");

  useEffect(() => {
    async function handleCallback() {
      const db = getSupabaseBrowser();
      if (!db) { router.push("/auth/login"); return; }

      // Supabase puts the session in the URL hash on magic link click
      const { data: { session }, error } = await db.auth.getSession();

      if (error || !session) {
        // Try exchanging a code from query params (PKCE flow)
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { data, error: codeErr } = await db.auth.exchangeCodeForSession(code);
          if (codeErr || !data.session) {
            setStatus("Sign-in link expired or invalid. Redirecting...");
            setTimeout(() => router.push("/auth/login"), 2000);
            return;
          }
        } else {
          setStatus("Sign-in link expired or invalid. Redirecting...");
          setTimeout(() => router.push("/auth/login"), 2000);
          return;
        }
      }

      // Session established — store tokens in cookies via the login API
      const currentSession = session || (await db.auth.getSession()).data.session;
      if (currentSession) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: currentSession.access_token,
            refreshToken: currentSession.refresh_token,
            expiresIn: currentSession.expires_in,
          }),
        }).catch(() => null);
      }

      router.push("/dashboard");
    }

    handleCallback();
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: `3px solid rgba(201,168,76,0.3)`, borderTop: `3px solid ${gold}`, borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{status}</p>
      </div>
    </div>
  );
}
