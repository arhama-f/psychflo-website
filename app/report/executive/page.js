"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";
import ExecutiveWorkforceReport from "../../components/ExecutiveWorkforceReport";

const gold = "#c9a84c";

export default function ExecutiveReportPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check localStorage first (primary store), fall back to sessionStorage for
    // users who ran the diagnostic before this change was deployed.
    const raw = localStorage.getItem("diagnosticResult") || sessionStorage.getItem("diagnosticResult");
    if (raw) {
      try { setResult(JSON.parse(raw)); } catch {}
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "system-ui" }}>Loading report…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <Nav />
        <div style={{ maxWidth: "520px", margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>📋</div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#f8fafc", margin: "0 0 12px" }}>No diagnostic results found</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px", lineHeight: "1.6" }}>
            Complete the workforce risk diagnostic first to generate your Executive Report.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
            Run Diagnostic →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 32px 100px" }}>
        <ExecutiveWorkforceReport
          scores={result.scores}
          companyName={result.form?.companyName}
          onBook={() => router.push("/founding")}
          onGrowth={() => router.push("/founding")}
        />
      </div>
    </div>
  );
}
