"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface SolutionItem {
  label: string;
  href: string;
  icon: string;
  desc: string;
}

const gold = "#c9a84c";

const solutions: SolutionItem[] = [
  { label: "Workforce Risk Detection",      href: "/solutions/risk-detection",  icon: "⚠️", desc: "Policy, tribunal, compliance & HR risk" },
  { label: "Retention & Burnout Prevention", href: "/solutions/retention-burnout", icon: "🔥", desc: "Burnout, wellbeing & psychological safety" },
  { label: "Manager & Culture Intelligence", href: "/solutions/manager-culture",   icon: "🧠", desc: "Leadership, coaching & onboarding" },
];

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [solutionsOpen, setSolutionsOpen] = useState<boolean>(false);
  const isHome = pathname === "/";

  return (
    <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", background: "rgba(0,0,0,0.3)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>

      {/* Left: logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!isHome && (
          <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
            ← Back
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => router.push("/")}>
          <img src="/logo.svg" alt="PsychFlo" style={{ width: "32px", height: "32px", objectFit: "contain", filter: "invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.85)" }} />
          <span style={{ color: "#f8fafc", fontWeight: "700", fontSize: "16px", letterSpacing: "-0.01em" }}>PsychFlo</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", fontWeight: "500", letterSpacing: "0.02em", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "10px", marginLeft: "2px" }}>Workforce Intelligence Platform</span>
        </div>
      </div>

      {/* Centre: nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", flexWrap: "wrap" }}>

        <button onClick={() => router.push("/")}
          style={{ background: pathname === "/" ? "rgba(255,255,255,0.07)" : "none", border: "1px solid transparent", color: pathname === "/" ? "#f8fafc" : "rgba(255,255,255,0.45)", padding: "7px 13px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
          Home
        </button>

        <button onClick={() => router.push("/how-it-works")}
          style={{ background: pathname === "/how-it-works" ? "rgba(255,255,255,0.07)" : "none", border: "1px solid transparent", color: pathname === "/how-it-works" ? "#f8fafc" : "rgba(255,255,255,0.45)", padding: "7px 13px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
          How It Works
        </button>

        {/* Solutions dropdown */}
        <div style={{ position: "relative" }} onMouseEnter={() => setSolutionsOpen(true)} onMouseLeave={() => setSolutionsOpen(false)}>
          <button style={{ background: pathname.startsWith("/solutions") ? "rgba(255,255,255,0.07)" : "none", border: "1px solid transparent", color: pathname.startsWith("/solutions") ? "#f8fafc" : "rgba(255,255,255,0.45)", padding: "7px 13px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
            Solutions <span style={{ fontSize: "9px", opacity: 0.5 }}>▾</span>
          </button>
          {solutionsOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#0d1526", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "8px", minWidth: "300px", zIndex: 200, boxShadow: "0 24px 48px rgba(0,0,0,0.6)" }}>
              {solutions.map((s) => (
                <div key={s.href} onClick={() => { router.push(s.href); setSolutionsOpen(false); }}
                  style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "11px 13px", borderRadius: "9px", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ fontSize: "18px", marginTop: "1px", flexShrink: 0 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", marginBottom: "2px" }}>{s.label}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: "1.4" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => router.push("/report/executive")}
          style={{ background: pathname === "/report/executive" ? "rgba(255,255,255,0.07)" : "none", border: "1px solid transparent", color: pathname === "/report/executive" ? "#f8fafc" : "rgba(255,255,255,0.45)", padding: "7px 13px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
          Executive Report
        </button>

        <button onClick={() => router.push("/pricing")}
          style={{ background: pathname === "/pricing" ? "rgba(255,255,255,0.07)" : "none", border: "1px solid transparent", color: pathname === "/pricing" ? "#f8fafc" : "rgba(255,255,255,0.45)", padding: "7px 13px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
          Pricing
        </button>

        <button onClick={() => router.push("/book-audit")}
          style={{ background: pathname === "/book-audit" ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(201,168,76,0.12)", border: `1px solid ${pathname === "/book-audit" ? "transparent" : "rgba(201,168,76,0.35)"}`, color: pathname === "/book-audit" ? "#0f172a" : gold, padding: "7px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", marginLeft: "6px" }}>
          Book Audit →
        </button>
      </div>

      {/* Right: auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button onClick={() => router.push("/auth/login")}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          Login
        </button>
        <button onClick={() => router.push("/dashboard")}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          Dashboard
        </button>
      </div>
    </nav>
  );
}
