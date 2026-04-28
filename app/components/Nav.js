"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const gold = "#c9a84c";
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const isHome = pathname === "/";

  const solutions = [
    { label: "Workforce Risk Detection", href: "/solutions/workforce-risk", icon: "⚠️", desc: "Policy, tribunal, compliance & HR risk" },
    { label: "Retention & Burnout Prevention", href: "/solutions/retention", icon: "🔥", desc: "Burnout, wellbeing & psychological safety" },
    { label: "Manager & Culture Intelligence", href: "/solutions/manager-culture", icon: "🧠", desc: "Leadership, coaching & onboarding" },
  ];

  const links = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Executive Report", href: "/report/board" },
    { label: "Pricing", href: "/pricing" },
  ];

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
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>

        {/* Solutions dropdown */}
        <div style={{ position: "relative" }} onMouseEnter={() => setSolutionsOpen(true)} onMouseLeave={() => setSolutionsOpen(false)}>
          <button style={{ background: pathname.startsWith("/solutions") ? "rgba(201,168,76,0.12)" : "none", border: pathname.startsWith("/solutions") ? `1px solid rgba(201,168,76,0.25)` : "1px solid transparent", color: pathname.startsWith("/solutions") ? gold : "rgba(255,255,255,0.5)", padding: "7px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
            Solutions <span style={{ fontSize: "10px", opacity: 0.6 }}>▾</span>
          </button>
          {solutionsOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, marginTop: "8px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "8px", minWidth: "280px", zIndex: 200, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              {solutions.map(s => (
                <div key={s.href} onClick={() => { router.push(s.href); setSolutionsOpen(false); }} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: "18px", marginTop: "1px" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", marginBottom: "2px" }}>{s.label}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {links.map(link => (
          <button key={link.href} onClick={() => router.push(link.href)}
            style={{ background: pathname === link.href ? "rgba(201,168,76,0.12)" : "none", border: pathname === link.href ? `1px solid rgba(201,168,76,0.25)` : "1px solid transparent", color: pathname === link.href ? gold : "rgba(255,255,255,0.5)", padding: "7px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
            {link.label}
          </button>
        ))}
      </div>

      {/* Right: CTAs */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => router.push("/auth/login")}
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          Login
        </button>
        <button onClick={() => router.push("/diagnostic")}
          style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "9px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
          Book Audit →
        </button>
      </div>
    </nav>
  );
}
