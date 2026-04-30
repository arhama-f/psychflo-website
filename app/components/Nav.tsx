"use client";
import { useRouter, usePathname } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const gold = "#c9a84c";
  const isHome = pathname === "/";
  const links = [
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", background: "rgba(0,0,0,0.3)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>

      {/* Left: logo + optional back button */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!isHome && (
          <button
            onClick={() => router.back()}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
          >
            ← Back
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => router.push("/")}>
          <img src="/logo.svg" alt="PsychFlo" style={{ width: "32px", height: "32px", objectFit: "contain", filter: "invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.85)" }} />
          <span style={{ color: "#f8fafc", fontWeight: "700", fontSize: "16px", letterSpacing: "-0.01em" }}>PsychFlo</span>
        </div>
      </div>

      {/* Centre: nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
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
        <button onClick={() => router.push("/auth/signup")}
          style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "9px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
          Sign up
        </button>
      </div>
    </nav>
  );
}
