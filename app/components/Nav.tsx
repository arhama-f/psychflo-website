"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { label: "Platform",     href: "/platform" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Research",     href: "/research" },
  { label: "Pricing",      href: "/pricing" },
];

export default function Nav() {
  const router   = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const active = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">

        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-slate-950">
            Ψ
          </div>
          <span className="text-sm font-bold tracking-tight text-white">PsychFlo</span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((lk) => (
            <button
              key={lk.href}
              onClick={() => router.push(lk.href)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer border-0 bg-transparent ${
                active(lk.href)
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {lk.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/auth/login")}
            className="hidden rounded-lg border border-slate-800 bg-transparent px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:border-slate-700 hover:text-slate-300 cursor-pointer transition-colors md:block"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/diagnostic")}
            className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-1.5 text-xs font-bold text-slate-950 cursor-pointer border-0 transition-all hover:scale-[1.02]"
          >
            Free audit →
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="ml-1 flex flex-col gap-1 cursor-pointer border-0 bg-transparent p-1 md:hidden"
          >
            <span className={`block h-px w-5 bg-slate-500 transition-all ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-slate-500 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-slate-500 transition-all ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-800/60 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((lk) => (
              <button
                key={lk.href}
                onClick={() => { router.push(lk.href); setMenuOpen(false); }}
                className={`rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer border-0 ${
                  active(lk.href)
                    ? "bg-slate-800 text-white"
                    : "bg-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {lk.label}
              </button>
            ))}
            <button
              onClick={() => { router.push("/auth/login"); setMenuOpen(false); }}
              className="mt-2 rounded-lg border border-slate-800 bg-transparent px-3.5 py-2.5 text-left text-sm font-medium text-slate-500 cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
