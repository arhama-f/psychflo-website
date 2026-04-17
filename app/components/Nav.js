"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const gold = "#c9a84c";

  const links = [
    { label: "Products", href: "/products" },
    { label: "Research", href: "/research" },
    { label: "Blog", href: "/blog" },
    { label: "Learn", href: "/learn" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.3)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => router.push("/")}>
        <img src="/logo.svg" alt="PsychFlo" style={{ width: "32px", height: "32px", objectFit: "contain", filter: "invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.85)" }} />
        <span style={{ color: "#f8fafc", fontWeight: "700", fontSize: "16px", letterSpacing: "-0.01em" }}>PsychFlo</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {links.map(link => (
          <button key={link.href} onClick={() => router.push(link.href)}
            style={{ background: pathname === link.href ? "rgba(201,168,76,0.12)" : "none", border: pathname === link.href ? `1px solid rgba(201,168,76,0.25)` : "1px solid transparent", color: pathname === link.href ? gold : "rgba(255,255,255,0.5)", padding: "7px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s" }}>
            {link.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={() => router.push("/tools/policy")}
          style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "9px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
          Try free
        </button>
      </div>
    </nav>
  );
}
