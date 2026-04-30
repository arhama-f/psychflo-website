"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

const EXPLORE = [
  { label: "Case Studies", route: "/case-studies", desc: "How executives used PsychFlo to act on workforce risk early." },
  { label: "Research",     route: "/research",     desc: "The peer-reviewed psychology behind the prediction models." },
  { label: "Platform",     route: "/platform",     desc: "Six risk surfaces, 12 models, enterprise-grade architecture." },
  { label: "Pricing",      route: "/pricing",      desc: "Founding client plans. Fixed annual pricing, no surprises." },
];

const VALUE = [
  {
    n: "01",
    title: "Prediction, not reporting",
    desc: "Twelve AI models surface burnout, attrition, and cognitive overload risk weeks before they become visible — grounded in peer-reviewed organisational psychology.",
    color: "text-cyan-400",
  },
  {
    n: "02",
    title: "Intelligence your team can act on",
    desc: "Every risk signal comes paired with a named intervention and structured action protocol. Not a score to interpret — a decision to make.",
    color: "text-violet-400",
  },
  {
    n: "03",
    title: "Board-ready executive reports",
    desc: "Risk scores, financial exposure estimates, and recommendations — formatted for leadership and delivered within 48 hours of your audit.",
    color: "text-amber-400",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <main className="bg-slate-950 text-white">
      <Nav />

      {/* ── EXPLORE BAR ──────────────────────────────────────────────────── */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-5xl px-6">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex w-full items-center gap-4 py-3 text-left bg-transparent border-0 cursor-pointer group"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">Explore</span>
            <div className="flex gap-5">
              {EXPLORE.map((e, i) => (
                <span key={i} className="hidden text-[11px] text-slate-700 group-hover:text-slate-500 transition-colors sm:block">
                  {e.label}
                </span>
              ))}
            </div>
            <span className={`ml-auto text-[10px] text-slate-700 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>▾</span>
          </button>

          {open && (
            <div className="grid grid-cols-2 gap-2 pb-4 md:grid-cols-4">
              {EXPLORE.map((e, i) => (
                <button
                  key={i}
                  onClick={() => { router.push(e.route); setOpen(false); }}
                  className="flex flex-col gap-2 rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 text-left hover:bg-slate-900 hover:border-slate-700 cursor-pointer transition-all group"
                >
                  <span className="text-xs font-semibold text-white">{e.label}</span>
                  <span className="text-[11px] leading-relaxed text-slate-600">{e.desc}</span>
                  <span className="text-[10px] text-slate-700 group-hover:text-slate-500 transition-colors mt-auto">View →</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-7rem)] items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-[0.07] blur-3xl"
            style={{ background: "radial-gradient(circle,#22d3ee,transparent 70%)" }} />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
            style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)" }} />
        </div>

        <div className="relative w-full max-w-2xl text-center">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Workforce Behaviour Intelligence
          </p>

          <h1
            className="text-[2.75rem] font-black leading-[1.06] md:text-[3.75rem]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Know which employees<br className="hidden sm:block" /> are at risk{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              weeks in advance.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base text-slate-400 leading-relaxed">
            PsychFlo predicts burnout, attrition, and disengagement before they surface — giving HR and executive teams the intelligence to act early.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => router.push("/diagnostic")}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:opacity-90 cursor-pointer border-0"
            >
              Free workforce audit
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="rounded-xl border border-slate-800 px-6 py-2.5 text-sm font-medium text-slate-500 hover:border-slate-700 hover:text-slate-300 cursor-pointer transition-colors bg-transparent"
            >
              Book a demo →
            </button>
          </div>

          <p className="mt-5 text-[11px] text-slate-700">
            Decision-support only · Not clinical diagnosis · Fully opt-in
          </p>
        </div>
      </section>

      {/* ── DIVIDER STATS ────────────────────────────────────────────────── */}
      <div className="border-y border-slate-800/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-4">
          {[
            { v: "6–10 wks", l: "Before observable decline" },
            { v: "12",       l: "Prediction models" },
            { v: "6",        l: "Risk surfaces monitored" },
            { v: "48 hrs",   l: "Audit to executive report" },
          ].map((s, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1.5 px-8 py-8 ${i > 0 ? "border-l border-slate-800/50" : ""}`}
            >
              <span
                className="text-2xl font-black text-white md:text-3xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                {s.v}
              </span>
              <span className="text-[11px] text-slate-600">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── VALUE ────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-xl">
          <p className="mb-14 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            What you get
          </p>
          {VALUE.map((item, i) => (
            <div
              key={i}
              className={`flex gap-8 py-10 ${i > 0 ? "border-t border-slate-800/40" : ""}`}
            >
              <span className={`mt-0.5 flex-shrink-0 text-[10px] font-black tabular-nums tracking-widest ${item.color}`}>
                {item.n}
              </span>
              <div>
                <h3 className="mb-2.5 text-base font-bold leading-snug text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-800/50 px-6 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Founding client programme · Limited availability
          </p>
          <h2 className="text-2xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
            Start predicting. Stop reacting.
          </h2>
          <p className="max-w-sm text-sm text-slate-500 leading-relaxed">
            Submit your organisation profile and receive a workforce intelligence report within 48 hours.
          </p>
          <button
            onClick={() => router.push("/diagnostic")}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-7 py-2.5 text-sm font-bold text-slate-950 transition-all hover:opacity-90 cursor-pointer border-0"
          >
            Get your free workforce audit →
          </button>
          <p className="text-[11px] text-slate-700">Free · No commitment · Report in 48 hours</p>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/50 px-6 py-7">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-bold text-white">PsychFlo</span>
          <div className="flex flex-wrap gap-6">
            {[
              { l: "Platform",     h: "/platform" },
              { l: "Pricing",      h: "/pricing" },
              { l: "Research",     h: "/research" },
              { l: "Case Studies", h: "/case-studies" },
            ].map((lk, i) => (
              <button key={i} onClick={() => router.push(lk.h)}
                className="border-0 bg-transparent p-0 text-[11px] text-slate-700 hover:text-slate-400 cursor-pointer transition-colors">
                {lk.l}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-800">© 2026 PsychFlo</span>
        </div>
      </footer>
    </main>
  );
}
