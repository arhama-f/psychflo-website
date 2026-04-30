"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

const SIGNALS = [
  { label: "Burnout Risk",          color: "text-red-400",    border: "border-red-500/20",    value: "72%",      change: "↑ +18%",       desc: "Engineering cohort showing sustained cognitive fatigue." },
  { label: "Attrition Probability", color: "text-amber-400",  border: "border-amber-500/20",  value: "34%",      change: "↑ +9%",        desc: "High performers showing reduced engagement signals." },
  { label: "Cognitive Load",        color: "text-violet-400", border: "border-violet-500/20", value: "High",     change: "↑ +21%",       desc: "Elevated context-switching and reduced deep-work time." },
  { label: "Psychological Safety",  color: "text-cyan-400",   border: "border-cyan-500/20",   value: "61 / 100", change: "−16 pts",      desc: "Participation declining across three teams." },
  { label: "Sentiment Drift",       color: "text-orange-400", border: "border-orange-500/20", value: "Negative", change: "14-day trend", desc: "Communication tone trending toward disengagement." },
  { label: "Leadership Friction",   color: "text-rose-400",   border: "border-rose-500/20",   value: "Elevated", change: "3 flagged",    desc: "Manager-team alignment below threshold in three units." },
];

const HOW = [
  { n: "01", title: "Connect your HR stack",         desc: "PsychFlo integrates with your existing HRIS, communication tools, and onboarding workflows via API. No rip-and-replace.",          color: "text-cyan-400",   bg: "bg-cyan-500/5 border-cyan-500/20" },
  { n: "02", title: "12 models run continuously",    desc: "Proprietary prediction models process behavioural signals against peer-reviewed frameworks — scoring risk across six surfaces in real time.", color: "text-violet-400", bg: "bg-violet-500/5 border-violet-500/20" },
  { n: "03", title: "Executive intelligence output", desc: "Board-ready reports, ranked risk signals, and named interventions — delivered to your HR and leadership teams with no interpretation required.", color: "text-amber-400",  bg: "bg-amber-500/5 border-amber-500/20" },
];

export default function HomePage() {
  const router = useRouter();
  const [dashOpen, setDashOpen] = useState(false);
  const [howOpen, setHowOpen]   = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-0 h-[600px] w-[600px] rounded-full opacity-[0.07] blur-3xl"
            style={{ background: "radial-gradient(circle,#22d3ee,transparent 70%)" }} />
          <div className="absolute -top-16 left-0 h-[500px] w-[500px] rounded-full opacity-[0.06] blur-3xl"
            style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)" }} />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            AI Workforce Behaviour Prediction
          </div>

          <h1 className="text-5xl font-black leading-[1.02] md:text-[68px]" style={{ letterSpacing: "-0.04em" }}>
            Predict workforce risk{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
              before it hits performance.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            PsychFlo turns HR, communication and wellbeing signals into real-time intelligence — surfacing burnout, attrition, and disengagement 6–10 weeks before they become business risk.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => router.push("/diagnostic")}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-4 text-base font-bold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer border-0"
            >
              Get your free workforce audit
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-base font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Book enterprise demo →
            </button>
          </div>

          <p className="mt-5 text-xs text-slate-700">
            Decision-support intelligence only · Not clinical diagnosis · Employee tools are fully opt-in
          </p>
        </div>
      </section>

      {/* ── KEY METRICS ──────────────────────────────────────────────────── */}
      <section className="border-y border-slate-800/60">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-slate-800/60 md:grid-cols-4">
          {[
            { v: "6–10 wks", l: "Ahead of observable decline" },
            { v: "12",       l: "Proprietary prediction models" },
            { v: "6",        l: "Behavioural risk surfaces" },
            { v: "48 hrs",   l: "Diagnostic to executive report" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-2 bg-slate-950 px-6 py-10 text-center">
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-4xl font-black text-transparent" style={{ letterSpacing: "-0.04em" }}>
                {s.v}
              </span>
              <span className="text-xs text-slate-600 leading-snug max-w-[110px]">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU GET ─────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl" style={{ letterSpacing: "-0.03em" }}>
              Six risk surfaces. Continuously monitored.
            </h2>
            <p className="mt-3 text-slate-500">
              Every signal comes with a recommended action — not just a number.
            </p>
          </div>

          {/* Signal grid */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {SIGNALS.map((s, i) => (
              <div key={i} className={`rounded-2xl border bg-slate-900/40 p-5 ${s.border}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className={`text-xs font-bold uppercase tracking-widest ${s.color}`}>{s.label}</p>
                  <span className="text-xs text-slate-600">{s.change}</span>
                </div>
                <p className={`text-2xl font-black mb-2 ${s.color}`} style={{ letterSpacing: "-0.03em" }}>{s.value}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Toggle — dashboard preview */}
          <div className="mt-6">
            <button
              onClick={() => setDashOpen(o => !o)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-4 text-sm font-semibold text-slate-400 hover:bg-slate-900 cursor-pointer transition-colors"
            >
              <span>See full dashboard preview</span>
              <span className="text-slate-600 text-lg leading-none">{dashOpen ? "−" : "+"}</span>
            </button>
            {dashOpen && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                <div className="flex items-center justify-between border-b border-slate-800/60 bg-slate-900/60 px-6 py-3">
                  <span className="text-xs font-semibold text-slate-500">PsychFlo · Executive Risk Dashboard</span>
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">LIVE</span>
                  </div>
                </div>
                <div className="grid gap-px bg-slate-800/40 md:grid-cols-2 lg:grid-cols-3">
                  {SIGNALS.map((s, i) => (
                    <div key={i} className="bg-slate-950 p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">{s.label}</p>
                        <span className="text-xs text-slate-700">{s.change}</span>
                      </div>
                      <p className={`text-2xl font-black ${s.color}`} style={{ letterSpacing: "-0.03em" }}>{s.value}</p>
                      <p className="text-xs text-slate-400">{s.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-800/60 bg-slate-900/40 px-6 py-3 text-center">
                  <p className="text-xs text-slate-700">Sample data · For illustration only · Decision-support, not clinical diagnosis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => setHowOpen(o => !o)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-5 text-left cursor-pointer hover:bg-slate-900 transition-colors"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1">How it works</p>
              <p className="text-base font-bold text-white">From signal to executive intelligence — in three steps</p>
            </div>
            <span className="ml-4 flex-shrink-0 text-slate-600 text-2xl leading-none">{howOpen ? "−" : "+"}</span>
          </button>

          {howOpen && (
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {HOW.map((h, i) => (
                <div key={i} className={`rounded-2xl border p-7 ${h.bg}`}>
                  <div className={`mb-4 text-5xl font-black leading-none opacity-20 ${h.color}`} style={{ letterSpacing: "-0.05em" }}>{h.n}</div>
                  <h3 className={`mb-3 text-sm font-bold ${h.color}`}>{h.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 px-10 py-16 text-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[400px] w-[400px] rounded-full opacity-[0.07] blur-3xl"
                style={{ background: "radial-gradient(circle,#22d3ee,#818cf8)" }} />
            </div>

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                ✦ Founding client programme · Limited availability
              </div>

              <h2 className="mx-auto max-w-2xl text-4xl font-black text-white md:text-5xl" style={{ letterSpacing: "-0.04em" }}>
                Start predicting.{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  Stop reacting.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-lg text-slate-400 leading-relaxed">
                Run a free workforce behaviour audit. Receive a prediction intelligence report for your leadership team within 48 hours. No commitment required.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => router.push("/diagnostic")}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-10 py-4 text-base font-bold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer border-0"
                >
                  Get your free workforce audit
                </button>
                <button
                  onClick={() => router.push("/demo")}
                  className="rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-base font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Book enterprise demo →
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
                {["Free diagnostic", "48-hour report", "Decision-support only", "No lock-in"].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                    <span className="text-cyan-600">✓</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 px-6 py-10">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-white">PsychFlo</p>
            <p className="mt-0.5 text-xs text-slate-700">AI-Powered Workforce Behaviour Prediction</p>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { l: "Platform",   h: "/platform" },
              { l: "Pricing",    h: "/pricing" },
              { l: "Research",   h: "/research" },
              { l: "Case Studies", h: "/case-studies" },
              { l: "Book Demo",  h: "/demo" },
            ].map((lk, i) => (
              <button key={i} onClick={() => router.push(lk.h)}
                className="bg-transparent border-0 p-0 text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">
                {lk.l}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-800">Decision-support only · Not clinical diagnosis · © 2026 PsychFlo</p>
        </div>
      </footer>
    </main>
  );
}
