"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

export default function HomePage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <main className="bg-slate-950 text-white">
      <Nav />

      {/* Explore bar */}
      <div className="border-b border-slate-800/40">
        <div className="mx-auto max-w-5xl px-6">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex w-full items-center gap-3 border-0 bg-transparent py-2.5 text-left cursor-pointer"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-700">Explore</span>
            <span className="text-[10px] text-slate-800">/</span>
            {["Case Studies", "Research", "Platform", "Pricing"].map((l, i) => (
              <span key={i} className="text-[11px] text-slate-700">{l}</span>
            ))}
            <span className={`ml-auto text-[10px] text-slate-700 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>▾</span>
          </button>

          {open && (
            <div className="grid grid-cols-2 gap-2 pb-3 md:grid-cols-4">
              {[
                { l: "Case Studies", h: "/case-studies", d: "How executives acted on risk early." },
                { l: "Research",     h: "/research",     d: "Peer-reviewed psychology behind the models." },
                { l: "Platform",     h: "/platform",     d: "Six risk surfaces, enterprise architecture." },
                { l: "Pricing",      h: "/pricing",      d: "Founding client plans, no surprises." },
              ].map((e, i) => (
                <button
                  key={i}
                  onClick={() => { router.push(e.h); setOpen(false); }}
                  className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-3.5 text-left hover:bg-slate-900 cursor-pointer transition-colors border-0 group"
                  style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <p className="mb-1 text-xs font-semibold text-white">{e.l}</p>
                  <p className="text-[11px] leading-relaxed text-slate-600">{e.d}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <section className="flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-xl">

          <h1
            className="text-4xl font-black leading-[1.08] text-white sm:text-5xl md:text-[3.5rem]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Predict workforce risk{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              before it surfaces.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-slate-500">
            AI-powered behavioural intelligence for HR and executive teams. Burnout, attrition, and disengagement — detected weeks early.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => router.push("/diagnostic")}
              className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-[13px] font-bold text-slate-950 transition-opacity hover:opacity-90 cursor-pointer border-0"
            >
              Free workforce audit
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="rounded-lg border border-slate-800 bg-transparent px-5 py-2.5 text-[13px] font-medium text-slate-500 hover:border-slate-700 hover:text-slate-300 cursor-pointer transition-colors"
            >
              Book a demo →
            </button>
          </div>

          <p className="mt-4 text-[11px] text-slate-800">
            Decision-support only · Not clinical diagnosis · Fully opt-in
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-slate-800/40 px-6 py-20">
        <div className="mx-auto max-w-lg">
          {[
            {
              n: "01",
              title: "Prediction, not reporting",
              desc: "Twelve AI models surface burnout, attrition, and overload risk weeks before they become visible — grounded in peer-reviewed organisational psychology.",
              color: "text-cyan-500",
            },
            {
              n: "02",
              title: "Signals with clear next steps",
              desc: "Every risk flag comes with a named intervention and action protocol. Your team acts — it never just reads a number.",
              color: "text-violet-400",
            },
            {
              n: "03",
              title: "Board-ready reports in 48 hours",
              desc: "Risk scores, financial exposure, and recommendations formatted for leadership — from audit submission to report delivery.",
              color: "text-amber-400",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex gap-7 py-9 ${i > 0 ? "border-t border-slate-800/40" : ""}`}
            >
              <span className={`mt-0.5 shrink-0 text-[10px] font-black tabular-nums tracking-widest ${item.color}`}>
                {item.n}
              </span>
              <div>
                <h3 className="mb-2 text-[15px] font-bold leading-snug text-white">{item.title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/40 px-6 py-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] font-bold text-slate-500">PsychFlo</span>
          <div className="flex gap-5">
            {[
              { l: "Platform",     h: "/platform" },
              { l: "Pricing",      h: "/pricing" },
              { l: "Research",     h: "/research" },
              { l: "Case Studies", h: "/case-studies" },
            ].map((lk, i) => (
              <button key={i} onClick={() => router.push(lk.h)}
                className="border-0 bg-transparent p-0 text-[11px] text-slate-700 hover:text-slate-500 cursor-pointer transition-colors">
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
