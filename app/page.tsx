"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
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

          <h1 className="text-5xl font-black leading-[1.05] md:text-[66px]" style={{ letterSpacing: "-0.04em" }}>
            Know which employees are at risk{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              6–10 weeks in advance.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">
            PsychFlo predicts burnout, attrition, and disengagement before they surface — giving HR and executive teams the intelligence to act early.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => router.push("/diagnostic")}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-3.5 text-sm font-bold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer border-0"
            >
              Get your free workforce audit
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="rounded-2xl border border-slate-800 px-8 py-3.5 text-sm font-semibold text-slate-400 hover:border-slate-600 hover:text-slate-200 cursor-pointer transition-colors bg-transparent"
            >
              Book a demo →
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-700">
            Decision-support only · Not clinical diagnosis · Employee tools are fully opt-in
          </p>
        </div>
      </section>

      {/* ── VALUE ────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <p className="mb-14 text-center text-xs font-semibold uppercase tracking-widest text-slate-700">
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
              <div key={i} className={`flex gap-10 py-10 ${i > 0 ? "border-t border-slate-800/50" : ""}`}>
                <span className={`text-xs font-black flex-shrink-0 pt-1 tabular-nums ${item.color}`}>{item.n}</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFER ────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 px-12 py-16 text-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[400px] w-[400px] rounded-full opacity-[0.07] blur-3xl"
                style={{ background: "radial-gradient(circle,#22d3ee,#818cf8)" }} />
            </div>
            <div className="relative">
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-600">
                Founding client programme · Limited availability
              </p>
              <h2 className="text-4xl font-black text-white md:text-5xl" style={{ letterSpacing: "-0.04em" }}>
                Start with a free audit.
              </h2>
              <p className="mx-auto mt-5 max-w-sm text-sm text-slate-400 leading-relaxed">
                Submit your organisation profile and receive a workforce prediction intelligence report for your leadership team within 48 hours.
              </p>
              <button
                onClick={() => router.push("/diagnostic")}
                className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-9 py-3.5 text-sm font-bold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer border-0"
              >
                Get your free workforce audit →
              </button>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
                {["Free · No commitment", "Report in 48 hours", "Decision-support only"].map((t, i) => (
                  <span key={i} className="text-xs text-slate-700">{t}</span>
                ))}
              </div>
            </div>
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
