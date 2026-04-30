"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  teamSize: string;
  message: string;
}

const ROLES = ["CHRO / CPO", "CEO / COO", "CTO / VP Engineering", "VP People", "HR Director", "Other"];
const TEAM_SIZES = ["50–200", "200–500", "500–2,000", "2,000+"];

export default function DemoPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ name: "", email: "", company: "", role: "", teamSize: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />

      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#22d3ee22,transparent_40%),radial-gradient(circle_at_bottom_left,#8b5cf622,transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">

            {/* Left: copy */}
            <div className="pt-4">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Enterprise Demo
              </p>
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl" style={{ letterSpacing: "-0.03em" }}>
                See PsychFlo in action.
              </h1>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                Book a 45-minute executive walkthrough. We'll show you how PsychFlo ingests behavioural signals, generates risk predictions, and produces decision-support intelligence for your leadership team.
              </p>

              <div className="mt-10 flex flex-col gap-5">
                {[
                  { icon: "◈", title: "Live prediction dashboard", desc: "See real-time risk signals across burnout, attrition, cognitive load and psychological safety." },
                  { icon: "◈", title: "Behavioural intelligence layer", desc: "Understand how PsychFlo connects to your existing HR stack without replacing any tools." },
                  { icon: "◈", title: "Executive report walkthrough", desc: "We walk through a sample board-ready intelligence report built from your organisation profile." },
                  { icon: "◈", title: "ROI and deployment model", desc: "Get a clear picture of implementation timeline, integration requirements, and expected outcomes." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="mt-0.5 text-cyan-400 text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-3">What to expect</p>
                <div className="flex flex-col gap-2">
                  {["45-minute video call", "Tailored to your industry and org size", "No sales pressure", "Follow-up report summary provided"].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="text-cyan-500 text-xs">✓</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
                  <div className="text-5xl">✓</div>
                  <h2 className="text-2xl font-bold text-white">Demo request received.</h2>
                  <p className="text-slate-400 max-w-sm">We'll be in touch within one business day to confirm your slot and send a calendar invite.</p>
                  <button onClick={() => router.push("/")} className="mt-4 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer bg-transparent">
                    Return to homepage
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white mb-2">Book your demo</h2>
                  <p className="text-sm text-slate-500 mb-8">Fill in your details and we'll confirm a time within one business day.</p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Full name *</label>
                        <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                          placeholder="Jane Smith" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Work email *</label>
                        <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                          placeholder="jane@company.com" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Company *</label>
                      <input required value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                        placeholder="Company name" />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Your role</label>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map(r => (
                          <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${form.role === r ? "border-cyan-500 bg-cyan-500/10 text-cyan-300" : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"}`}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Organisation size</label>
                      <div className="flex flex-wrap gap-2">
                        {TEAM_SIZES.map(s => (
                          <button key={s} type="button" onClick={() => setForm(f => ({ ...f, teamSize: s }))}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${form.teamSize === s ? "border-cyan-500 bg-cyan-500/10 text-cyan-300" : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Biggest people challenge (optional)</label>
                      <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        rows={3}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
                        placeholder="e.g. rising attrition in engineering, manager effectiveness, distributed team disengagement…" />
                    </div>

                    <button type="submit"
                      className="w-full rounded-xl py-4 text-sm font-bold text-slate-950 transition-all hover:opacity-90 cursor-pointer border-0"
                      style={{ background: "linear-gradient(135deg,#67e8f9,#818cf8)" }}>
                      Book enterprise demo →
                    </button>

                    <p className="text-center text-xs text-slate-600">
                      No commitment required · Confirmation within 1 business day
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
