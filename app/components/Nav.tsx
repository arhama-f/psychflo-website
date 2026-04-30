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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080c14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <button onClick={() => router.push("/")} className="flex items-center gap-3 border-0 bg-transparent p-0 cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-[15px] font-black text-white select-none">
            Ψ
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">PsychFlo</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((lk) => (
            <button
              key={lk.href}
              onClick={() => router.push(lk.href)}
              className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors cursor-pointer border-0 bg-transparent ${
                pathname === lk.href ? "text-white bg-white/[0.07]" : "text-white/40 hover:text-white/70"
              }`}
            >
              {lk.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/auth/login")}
            className="hidden rounded-md px-3.5 py-1.5 text-[13px] font-medium text-white/40 hover:text-white/70 cursor-pointer border-0 bg-transparent transition-colors md:block"
          >
            Log in
          </button>
          <button
            onClick={() => router.push("/diagnostic")}
            className="rounded-md bg-white px-4 py-1.5 text-[13px] font-semibold text-[#080c14] hover:bg-white/90 cursor-pointer border-0 transition-colors"
          >
            Get started
          </button>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="ml-1 flex h-8 w-8 flex-col items-center justify-center gap-[5px] cursor-pointer border-0 bg-transparent md:hidden"
          >
            <span className={`h-[1.5px] w-5 bg-white/40 transition-all duration-200 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-white/40 transition-all duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-white/40 transition-all duration-200 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/[0.06] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((lk) => (
              <button
                key={lk.href}
                onClick={() => { router.push(lk.href); setOpen(false); }}
                className={`rounded-md px-3.5 py-2.5 text-left text-[13px] font-medium cursor-pointer border-0 transition-colors ${
                  pathname === lk.href ? "bg-white/[0.07] text-white" : "bg-transparent text-white/40"
                }`}
              >
                {lk.label}
              </button>
            ))}
            <div className="mt-2 border-t border-white/[0.06] pt-3">
              <button
                onClick={() => { router.push("/auth/login"); setOpen(false); }}
                className="w-full rounded-md px-3.5 py-2.5 text-left text-[13px] font-medium text-white/40 cursor-pointer border-0 bg-transparent"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
