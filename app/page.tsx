"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

const STATS = [
  { value: "6–10 wks",  label: "Before observable decline" },
  { value: "12",        label: "Prediction models" },
  { value: "6",         label: "Risk surfaces" },
  { value: "48 hrs",    label: "Audit to report" },
];

const FEATURES = [
  {
    icon: "◎",
    title: "Burnout & Attrition Prediction",
    desc: "Detects sustained fatigue and attrition signals weeks before they affect performance or headcount.",
    accent: "text-cyan-400",
  },
  {
    icon: "◈",
    title: "Cognitive Load Index",
    desc: "Measures meeting density, context-switching, and focus-time erosion across teams in real time.",
    accent: "text-violet-400",
  },
  {
    icon: "◇",
    title: "Psychological Safety Score",
    desc: "Tracks team voice, feedback participation, and communication patterns — without annual surveys.",
    accent: "text-amber-400",
  },
];

const STEPS = [
  { n: "01", title: "Connect your HR stack",       desc: "API integrations with HRIS, Slack, and onboarding workflows. No rip-and-replace." },
  { n: "02", title: "Models run continuously",      desc: "12 proprietary models score behavioural signals across six risk surfaces, updated in real time." },
  { n: "03", title: "Executive report delivered",   desc: "Board-ready intelligence with ranked risks, named interventions, and financial exposure estimates." },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: "#080c14", color: "#fff" }}>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-6 text-center">

        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.15]"
            style={{ background: "radial-gradient(ellipse,#7c3aed,transparent 65%)" }} />
          <div className="absolute left-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle,#06b6d4,transparent 70%)" }} />
        </div>

        <div className="relative max-w-3xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-medium tracking-widest text-white/50 uppercase">Workforce Behaviour Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-[2.8rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-[4rem]">
            Know which employees<br className="hidden sm:block" /> are at risk{" "}
            <span style={{ background: "linear-gradient(90deg,#67e8f9,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              weeks in advance.
            </span>
          </h1>

          {/* Sub */}
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-7 text-white/40">
            PsychFlo turns HR signals into real-time behavioural intelligence — surfacing burnout, attrition, and disengagement before they affect your organisation.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => router.push("/diagnostic")}
              className="rounded-lg bg-white px-6 py-2.5 text-[13px] font-semibold text-[#080c14] hover:bg-white/90 cursor-pointer border-0 transition-colors"
            >
              Free workforce audit →
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-6 py-2.5 text-[13px] font-medium text-white/50 hover:bg-white/[0.08] hover:text-white/70 cursor-pointer transition-colors"
            >
              Book a demo
            </button>
          </div>

          <p className="mt-5 text-[11px] text-white/20">
            Decision-support only · Not clinical diagnosis · Employee tools are fully opt-in
          </p>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.06]">
        <div className="mx-auto grid max-w-4xl grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className={`px-8 py-10 ${i > 0 ? "border-l border-white/[0.06]" : ""}`}>
              <p className="text-2xl font-bold tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>{s.value}</p>
              <p className="mt-1 text-[12px] text-white/30">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 max-w-md">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-white/30">Platform capabilities</p>
            <h2 className="text-3xl font-bold leading-snug tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>
              Six risk surfaces.<br />Running simultaneously.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7 transition-colors hover:bg-white/[0.05]">
                <span className={`text-2xl ${f.accent}`}>{f.icon}</span>
                <h3 className="mt-5 mb-3 text-[15px] font-semibold text-white leading-snug">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/40">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold text-white">+ Sentiment Drift · Leadership Friction · Psychological Safety</p>
                <p className="mt-1 text-[12px] text-white/30">All six surfaces active simultaneously across your organisation.</p>
              </div>
              <button
                onClick={() => router.push("/platform")}
                className="shrink-0 rounded-lg border border-white/10 bg-transparent px-4 py-2 text-[12px] font-medium text-white/50 hover:text-white/70 cursor-pointer transition-colors"
              >
                View platform →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 max-w-md">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-white/30">How it works</p>
            <h2 className="text-3xl font-bold leading-snug tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>
              Signal to intelligence<br />in three steps.
            </h2>
          </div>

          <div className="flex flex-col gap-0">
            {STEPS.map((s, i) => (
              <div key={i} className={`flex gap-8 py-8 ${i > 0 ? "border-t border-white/[0.06]" : ""}`}>
                <span className="shrink-0 text-[11px] font-bold tabular-nums text-white/20 pt-0.5">{s.n}</span>
                <div>
                  <h3 className="mb-2 text-[15px] font-semibold text-white">{s.title}</h3>
                  <p className="text-[13px] leading-relaxed text-white/40">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl p-px"
            style={{ background: "linear-gradient(135deg,rgba(103,232,249,0.3),rgba(167,139,250,0.3),rgba(103,232,249,0.1))" }}>
            <div className="rounded-2xl px-10 py-16 text-center" style={{ background: "#0e1320" }}>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-white/30">
                Founding client programme
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ letterSpacing: "-0.02em" }}>
                Start predicting. Stop reacting.
              </h2>
              <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-white/40">
                Submit your organisation profile and receive a workforce intelligence report within 48 hours. Free. No commitment.
              </p>
              <button
                onClick={() => router.push("/diagnostic")}
                className="mt-8 rounded-lg bg-white px-7 py-2.5 text-[13px] font-semibold text-[#080c14] hover:bg-white/90 cursor-pointer border-0 transition-colors"
              >
                Free workforce audit →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 text-[11px] font-black text-white">Ψ</div>
            <span className="text-[12px] font-semibold text-white/60">PsychFlo</span>
          </div>
          <div className="flex gap-6">
            {[
              { l: "Platform",     h: "/platform" },
              { l: "Pricing",      h: "/pricing" },
              { l: "Research",     h: "/research" },
              { l: "Case Studies", h: "/case-studies" },
            ].map((lk, i) => (
              <button key={i} onClick={() => router.push(lk.h)}
                className="border-0 bg-transparent p-0 text-[12px] text-white/25 hover:text-white/50 cursor-pointer transition-colors">
                {lk.l}
              </button>
            ))}
          </div>
          <span className="text-[12px] text-white/20">© 2026 PsychFlo</span>
        </div>
      </footer>
    </div>
  );
}
