"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

const EXPLORE = [
  {
    label: "Case Studies",
    route: "/case-studies",
    tag: "Executive",
    tagColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    summary: "How CPOs, CHROs and CTOs used PsychFlo to predict attrition and burnout before their teams escalated.",
    stat: "8 weeks ahead of manager escalation",
  },
  {
    label: "Research",
    route: "/research",
    tag: "Science",
    tagColor: "text-violet-400 border-violet-500/20 bg-violet-500/10",
    summary: "Peer-reviewed organisational psychology underpinning the 12 prediction models — published openly.",
    stat: "6 research areas · Burnout to leadership friction",
  },
  {
    label: "Platform",
    route: "/platform",
    tag: "Product",
    tagColor: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
    summary: "Six behavioural risk surfaces running simultaneously. Enterprise security, HRIS integrations, SSO.",
    stat: "SOC 2 · GDPR · 99.9% uptime SLA",
  },
  {
    label: "Pricing",
    route: "/pricing",
    tag: "Plans",
    tagColor: "text-amber-400 border-amber-500/20 bg-amber-500/10",
    summary: "Founding client pricing available now. Fixed annual plans with no per-seat surprises.",
    stat: "Founding programme · Limited availability",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [exploreOpen, setExploreOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {/* ── EXPLORE TOGGLE — directly below nav ──────────────────────────── */}
      <div className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6">
          <button
            onClick={() => setExploreOpen(o => !o)}
            className="flex w-full items-center justify-between py-3.5 cursor-pointer bg-transparent border-0 text-left group"
          >
            <div className="flex items-center gap-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-600">Explore</span>
              <div className="hidden items-center gap-4 sm:flex">
                {EXPLORE.map((item, i) => (
                  <span key={i} className="text-xs text-slate-700 group-hover:text-slate-600 transition-colors">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <span className={`text-slate-700 text-xs transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {exploreOpen && (
            <div className="grid gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-4">
              {EXPLORE.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { router.push(item.route); setExploreOpen(false); }}
                  className="group flex flex-col items-start rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition-all"
                >
                  <div className="mb-3 flex items-center justify-between w-full">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <span className="text-slate-700 text-xs group-hover:text-slate-400 transition-colors">→</span>
                  </div>
                  <p className="text-xs font-bold text-white mb-1.5">{item.label}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{item.summary}</p>
                  <p className="text-[10px] text-slate-700 mt-auto">{item.stat}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-120px)] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[700px] w-[700px] -translate-y-1/4 translate-x-1/4 rounded-full opacity-[0.06] blur-3xl"
            style={{ background: "radial-gradient(circle,#22d3ee,transparent 70%)" }} />
          <div className="absolute left-0 bottom-0 h-[600px] w-[600px] translate-y-1/4 -translate-x-1/4 rounded-full opacity-[0.05] blur-3xl"
            style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)" }} />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Workforce Behaviour Intelligence
          </div>

          <h1 className="text-5xl font-black leading-[1.05] md:text-[64px]" style={{ letterSpacing: "-0.04em" }}>
            Know which employees are at risk{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              6–10 weeks in advance.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg text-slate-400 leading-relaxed">
            PsychFlo predicts burnout, attrition, and disengagement before they surface — giving HR and executive teams the intelligence to act early.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => router.push("/diagnostic")}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-7 py-3 text-sm font-bold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer border-0"
            >
              Get your free workforce audit
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="rounded-xl border border-slate-800 px-7 py-3 text-sm font-semibold text-slate-400 hover:border-slate-600 hover:text-slate-200 cursor-pointer transition-colors bg-transparent"
            >
              Book a demo →
            </button>
          </div>

          <p className="mt-5 text-xs text-slate-700">
            Decision-support only · Not clinical diagnosis · Employee tools are fully opt-in
          </p>
        </div>
      </section>

      {/* ── VALUE ────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 px-6 py-28">
        <div className="mx-auto max-w-2xl">
          <p className="mb-16 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            What PsychFlo gives you
          </p>
          <div className="flex flex-col">
            {[
              {
                n: "01",
                title: "Prediction, not reporting",
                desc: "Twelve AI models monitor behavioural signals and surface burnout, attrition, and cognitive overload risk before they become visible problems.",
                color: "text-cyan-400",
              },
              {
                n: "02",
                title: "Intelligence your HR team can act on",
                desc: "Every risk signal comes with a named intervention and a structured action protocol — not a score your team has to interpret alone.",
                color: "text-violet-400",
              },
              {
                n: "03",
                title: "Board-ready executive reports",
                desc: "Risk scores, financial exposure estimates, and recommended actions — delivered within 48 hours of your audit.",
                color: "text-amber-400",
              },
            ].map((item, i) => (
              <div key={i} className={`flex gap-10 py-12 ${i > 0 ? "border-t border-slate-800/40" : ""}`}>
                <span className={`text-[11px] font-black flex-shrink-0 pt-1.5 tabular-nums tracking-wider ${item.color}`}>{item.n}</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 px-6 py-8">
        <div className="mx-auto max-w-2xl flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-bold text-white">PsychFlo</p>
          <div className="flex flex-wrap gap-6">
            {[
              { l: "Platform",     h: "/platform" },
              { l: "Pricing",      h: "/pricing" },
              { l: "Research",     h: "/research" },
              { l: "Case Studies", h: "/case-studies" },
            ].map((lk, i) => (
              <button key={i} onClick={() => router.push(lk.h)}
                className="bg-transparent border-0 p-0 text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">
                {lk.l}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-800">© 2026 PsychFlo</p>
        </div>
      </footer>
    </main>
  );
}
