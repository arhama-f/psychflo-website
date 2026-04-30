"use client";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

interface Capability {
  title: string;
  desc: string;
  signals: string[];
  color: string;
  border: string;
}

interface Integration {
  name: string;
  icon: string;
  category: string;
}

const CAPABILITIES: Capability[] = [
  {
    title: "Burnout Early Warning",
    desc: "Detects sustained cognitive fatigue and workload intensity signals 6–10 weeks before observable performance impact. Triggers structured workload redistribution protocols.",
    signals: ["Cognitive load index", "Workload intensity", "Recovery time signals"],
    color: "text-red-400",
    border: "border-red-500/20",
  },
  {
    title: "Attrition Probability Model",
    desc: "Multi-variable model scoring voluntary attrition risk across engagement, communication, growth, and manager-relationship signals.",
    signals: ["Engagement drift", "Growth signal absence", "Manager friction index"],
    color: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    title: "Team Sentiment Drift",
    desc: "Tracks the trajectory of communication tone across teams and time periods. Surfaces 14-day and 30-day drift patterns for HR review.",
    signals: ["Communication tone", "Participation trends", "Collaboration frequency"],
    color: "text-orange-400",
    border: "border-orange-500/20",
  },
  {
    title: "Cognitive Load Index",
    desc: "Measures context-switching pressure, meeting density, and focus-time erosion. Generates intervention protocols when sustained overload is detected.",
    signals: ["Meeting load", "Context switching", "Deep-work availability"],
    color: "text-violet-400",
    border: "border-violet-500/20",
  },
  {
    title: "Psychological Safety Score",
    desc: "Evaluates team voice, feedback participation, and communication asymmetry to generate a continuous psychological safety index.",
    signals: ["Voice participation", "Feedback frequency", "Communication asymmetry"],
    color: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    title: "Leadership Friction Detection",
    desc: "Identifies manager-team alignment gaps, decision-authority ambiguity, and communication bottlenecks before they affect team performance.",
    signals: ["Manager alignment signals", "Decision velocity", "Team voice suppression"],
    color: "text-rose-400",
    border: "border-rose-500/20",
  },
];

const INTEGRATIONS: Integration[] = [
  { name: "Slack",             icon: "💬", category: "Communication" },
  { name: "Microsoft Teams",  icon: "🟦", category: "Communication" },
  { name: "BambooHR",         icon: "🎋", category: "HRIS" },
  { name: "Workday",          icon: "🏢", category: "HRIS" },
  { name: "Personio",         icon: "👥", category: "HRIS" },
  { name: "Google Workspace", icon: "📧", category: "Productivity" },
  { name: "Jira",             icon: "🔧", category: "Productivity" },
  { name: "Notion",           icon: "📄", category: "Productivity" },
];

const ENTERPRISE_FEATURES = [
  "SOC 2-aligned security architecture",
  "Single sign-on (SAML 2.0 / OIDC)",
  "Custom data residency options",
  "Audit logs and access controls",
  "Dedicated customer success management",
  "99.9% uptime SLA",
  "GDPR and CCPA compliance",
  "API-first integration architecture",
];

export default function PlatformPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#22d3ee1a,transparent_40%),radial-gradient(circle_at_bottom_left,#8b5cf61a,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            The Platform
          </p>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-6xl" style={{ letterSpacing: "-0.03em" }}>
            One platform. Six behavioural risk surfaces. Continuous prediction.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            PsychFlo is an AI-powered workforce behaviour prediction platform built on twelve proprietary models — grounded in peer-reviewed organisational psychology and designed for enterprise deployment.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button onClick={() => router.push("/demo")}
              className="rounded-2xl px-7 py-4 font-semibold text-slate-950 cursor-pointer border-0"
              style={{ background: "linear-gradient(135deg,#67e8f9,#818cf8)" }}>
              Book platform demo →
            </button>
            <button onClick={() => router.push("/diagnostic")}
              className="rounded-2xl border border-slate-700 px-7 py-4 font-semibold text-white hover:bg-slate-900 cursor-pointer bg-transparent transition-colors">
              Get free audit
            </button>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-slate-800/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">Platform capabilities</p>
            <h2 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Six prediction surfaces. Running simultaneously.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className={`rounded-2xl border bg-slate-900/40 p-7 transition-all hover:bg-slate-900 ${cap.border}`}>
                <h3 className={`text-base font-bold mb-3 ${cap.color}`}>{cap.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{cap.desc}</p>
                <div className="flex flex-col gap-2">
                  {cap.signals.map((sig, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-slate-500">
                      <span className={`text-xs ${cap.color}`}>→</span> {sig}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence layer */}
      <section className="border-t border-slate-800/50 bg-white px-6 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-700">Integration architecture</p>
            <h2 className="text-4xl font-bold" style={{ letterSpacing: "-0.02em" }}>
              Sits above your HR stack. Doesn't replace it.
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              PsychFlo is a behavioural intelligence layer. It connects to HRIS platforms, communication tools, and onboarding workflows via API — then generates the predictive intelligence your existing systems cannot produce.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {["API-first, no rip-and-replace", "Employee-facing tools are fully opt-in", "GDPR and CCPA compliant by design", "Enterprise SSO and audit log support"].map((pt, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-cyan-600">✓</span> {pt}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-100 p-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Connected platforms</p>
            <div className="grid grid-cols-2 gap-3">
              {INTEGRATIONS.map((intg, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <span className="text-xl">{intg.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{intg.name}</p>
                    <p className="text-xs text-slate-400">{intg.category}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm font-bold mb-2">PsychFlo Prediction Engine</p>
              <p className="text-xs text-slate-400">Risk scores, explanations and decision-support recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="border-t border-slate-800/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">Enterprise deployment</p>
            <h2 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Built for enterprise security and compliance.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ENTERPRISE_FEATURES.map((feat, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <span className="mt-0.5 text-cyan-500 text-sm flex-shrink-0">✓</span>
                <span className="text-sm text-slate-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 px-6 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-cyan-400 p-12 text-center text-slate-950">
          <h2 className="text-3xl font-bold md:text-4xl" style={{ letterSpacing: "-0.02em" }}>
            Ready to deploy workforce behavioural intelligence?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base">
            Book an enterprise demo or start with a free workforce behaviour audit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={() => router.push("/demo")}
              className="rounded-2xl bg-slate-950 px-7 py-3.5 font-semibold text-white cursor-pointer border-0">
              Book enterprise demo →
            </button>
            <button onClick={() => router.push("/diagnostic")}
              className="rounded-2xl border-2 border-slate-950/20 px-7 py-3.5 font-semibold cursor-pointer bg-transparent">
              Get free audit
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
