"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

// ─── Data ──────────────────────────────────────────────────────────────────

const PREDICTION_CARDS = [
  {
    title: "Burnout Risk",
    value: "72%",
    change: "+18%",
    trend: "rising",
    insight: "Engineering cohort showing elevated cognitive fatigue signals",
    action: "Recommend workload redistribution within 7 days",
    color: "text-red-400",
    badge: "bg-red-500/10 text-red-300",
    bar: "bg-red-400",
    barW: "72%",
  },
  {
    title: "Attrition Probability",
    value: "31%",
    change: "+9%",
    trend: "rising",
    insight: "Retention risk elevated in high-performing employee segment",
    action: "Trigger manager check-in and growth conversation",
    color: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-300",
    bar: "bg-amber-400",
    barW: "31%",
  },
  {
    title: "Sentiment Drift",
    value: "−18 pts",
    change: "14-day decline",
    trend: "declining",
    insight: "Communication signals trending toward disengagement",
    action: "Review team rituals and psychological safety norms",
    color: "text-orange-400",
    badge: "bg-orange-500/10 text-orange-300",
    bar: "bg-orange-400",
    barW: "55%",
  },
  {
    title: "Cognitive Overload",
    value: "High",
    change: "+22%",
    trend: "rising",
    insight: "Sustained overload pattern detected across sprint cycles",
    action: "Protect focus time and reduce context-switching load",
    color: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-300",
    bar: "bg-purple-400",
    barW: "78%",
  },
  {
    title: "Psychological Safety",
    value: "52 / 100",
    change: "−16 pts vs benchmark",
    trend: "below",
    insight: "Below industry benchmark; signal of suppressed team voice",
    action: "Deploy structured psychological safety intervention",
    color: "text-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-300",
    bar: "bg-cyan-400",
    barW: "52%",
  },
  {
    title: "Leadership Friction",
    value: "Elevated",
    change: "3 managers flagged",
    trend: "flagged",
    insight: "Manager-team alignment signals below threshold in 3 units",
    action: "Initiate manager effectiveness review and coaching protocol",
    color: "text-rose-400",
    badge: "bg-rose-500/10 text-rose-300",
    bar: "bg-rose-400",
    barW: "68%",
  },
];

const ENGINE_STEPS = [
  {
    n: "01",
    title: "Signal ingestion",
    desc: "PsychFlo ingests behavioural signals from HR systems, communication platforms, onboarding workflows, and structured check-ins — without replacing any existing tools.",
    icon: "⬡",
    accent: "border-cyan-500/30 bg-cyan-500/5",
    num: "text-cyan-500",
  },
  {
    n: "02",
    title: "Behavioural modelling",
    desc: "Twelve proprietary prediction models process signals against validated organisational psychology frameworks — scoring burnout trajectories, attrition probability, and cognitive load in real time.",
    icon: "⬡",
    accent: "border-violet-500/30 bg-violet-500/5",
    num: "text-violet-400",
  },
  {
    n: "03",
    title: "Risk surface generation",
    desc: "Each signal cluster is ranked by predicted business impact and time-to-materialisation. Decision-support intelligence is generated per team, department, and organisation.",
    icon: "⬡",
    accent: "border-amber-500/30 bg-amber-500/5",
    num: "text-amber-400",
  },
  {
    n: "04",
    title: "Actionable recommendations",
    desc: "Each risk surface is paired with a named intervention, an owner, and a structured protocol — so HR and leadership teams act on intelligence, not spreadsheets.",
    icon: "⬡",
    accent: "border-emerald-500/30 bg-emerald-500/5",
    num: "text-emerald-400",
  },
];

const ORG_TYPES = [
  {
    title: "High-growth technology companies",
    desc: "Predict attrition in engineering cohorts before sprint velocity collapses. Identify cognitive overload before it becomes a retention crisis.",
    icon: "🚀",
    signals: ["Sprint fatigue signals", "Attrition probability", "Burnout trajectories"],
  },
  {
    title: "Global professional services firms",
    desc: "Monitor psychological safety across geographies. Surface leadership friction and disengagement signals in distributed teams before they affect client delivery.",
    icon: "🌐",
    signals: ["Distributed team sentiment", "Leadership friction", "Disengagement signals"],
  },
  {
    title: "Enterprise financial services",
    desc: "Predict workforce behaviour risk across high-stakes, high-compliance environments. Generate executive-grade behavioural intelligence for board-level reporting.",
    icon: "🏦",
    signals: ["Compliance risk signals", "Cognitive load index", "Executive risk reports"],
  },
  {
    title: "Healthcare & life sciences organisations",
    desc: "Detect burnout risk in clinical and operational workforces with the precision required for safety-critical environments. Decision support, not diagnosis.",
    icon: "🧬",
    signals: ["Burnout risk scoring", "Shift fatigue signals", "Team safety index"],
  },
  {
    title: "Private equity portfolio companies",
    desc: "Rapidly assess workforce risk during acquisition integration. Identify cultural misalignment and retention risk in the first 90 days of post-merger operations.",
    icon: "📊",
    signals: ["M&A integration risk", "Cultural alignment signals", "Retention probability"],
  },
  {
    title: "Multinational manufacturing & logistics",
    desc: "Surface cognitive overload and psychological safety deficits across complex shift-based workforces. Build the data layer for proactive workforce management.",
    icon: "⚙️",
    signals: ["Shift overload index", "Safety culture signals", "Manager effectiveness"],
  },
];

const RESEARCH_ARTICLES = [
  {
    category: "Prediction Research",
    title: "Behavioural signal latency: How early can burnout be predicted?",
    desc: "Analysis of signal-to-outcome timing across 14 organisational psychology frameworks. Our models surface burnout risk an average of 6–10 weeks before observable performance decline.",
    readTime: "8 min read",
    tag: "Research",
    tagColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  {
    category: "Workforce Intelligence",
    title: "The attrition signal stack: What language, behaviour and cadence reveal",
    desc: "A deep analysis of the multi-signal model PsychFlo uses to generate attrition probability scores — and why self-reported surveys systematically underperform.",
    readTime: "6 min read",
    tag: "Analysis",
    tagColor: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  {
    category: "Leadership Science",
    title: "Leadership friction as a predictive variable: The underused signal",
    desc: "Quantifying the relationship between manager-team alignment signals and downstream team performance, attrition, and psychological safety outcomes.",
    readTime: "10 min read",
    tag: "Science",
    tagColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
];

const CASE_STUDIES = [
  {
    quote: "PsychFlo's prediction signals gave us decision support we didn't know we were missing. We identified retention risk in two senior engineering teams eight weeks before either manager raised a concern.",
    role: "Chief People Officer",
    org: "Series C technology company, 400 employees",
    metric: "8 weeks early",
    metricLabel: "Ahead of observable signals",
  },
  {
    quote: "The cognitive load index surfaced something our employee survey had missed for three cycles. The decision-support output was specific enough for our HR team to act on immediately.",
    role: "VP People & Culture",
    org: "Global professional services firm",
    metric: "3 survey cycles",
    metricLabel: "Earlier than traditional methods",
  },
  {
    quote: "What distinguishes PsychFlo is the scientific grounding. This is not a mood tracker. The prediction models produce board-ready intelligence — not vague wellbeing scores.",
    role: "CHRO",
    org: "Enterprise financial services organisation",
    metric: "Board-ready",
    metricLabel: "Executive intelligence output",
  },
];

const FEATURES = [
  {
    title: "Real-time behavioural risk scoring",
    desc: "Six prediction surfaces updated continuously across burnout, attrition, sentiment, cognitive load, psychological safety, and leadership friction.",
    icon: "◈",
    color: "text-cyan-400",
  },
  {
    title: "12-model prediction engine",
    desc: "Proprietary models grounded in peer-reviewed organisational psychology. Configured per industry, workforce size, and signal availability.",
    icon: "◈",
    color: "text-violet-400",
  },
  {
    title: "Executive intelligence reports",
    desc: "Board-ready PDF reports delivered on demand. Risk scores, signal explanations, financial exposure estimates, and recommended actions.",
    icon: "◈",
    color: "text-amber-400",
  },
  {
    title: "HR system integration layer",
    desc: "Native integrations with major HRIS platforms, communication tools, and onboarding workflows. Behavioural intelligence without replacing existing infrastructure.",
    icon: "◈",
    color: "text-emerald-400",
  },
  {
    title: "Manager decision-support protocols",
    desc: "Each risk signal comes with a named intervention protocol, a structured conversation guide, and success metrics — not vague recommendations.",
    icon: "◈",
    color: "text-rose-400",
  },
  {
    title: "Enterprise-grade security & privacy",
    desc: "SOC 2-aligned architecture. Employee-facing tools are fully opt-in and transparent. No covert monitoring. GDPR and global data compliance by design.",
    icon: "◈",
    color: "text-sky-400",
  },
  {
    title: "Organisational benchmarking",
    desc: "Compare risk scores against industry benchmarks and historical baselines. Track intervention effectiveness over time with longitudinal trend data.",
    icon: "◈",
    color: "text-pink-400",
  },
  {
    title: "C-suite workforce intelligence dashboard",
    desc: "A single executive view of workforce behavioural risk across all teams, departments, and geographies — updated in real time.",
    icon: "◈",
    color: "text-indigo-400",
  },
];

const TRUST_STATS = [
  { value: "6–10 wks", label: "Earlier than observable performance signals" },
  { value: "12", label: "Proprietary prediction models" },
  { value: "6", label: "Behavioural risk surfaces monitored" },
  { value: "48 hrs", label: "From diagnostic to executive intelligence report" },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(160deg,#04081a 0%,#080f24 45%,#0d0820 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />

      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-10">
          AI Workforce Behaviour Prediction Platform
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight md:text-7xl leading-[1.02]" style={{ letterSpacing: "-0.04em" }}>
          Predict burnout, attrition and disengagement
          <span style={{ background: "linear-gradient(135deg,#67e8f9,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> before they become business risks.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 leading-relaxed">
          PsychFlo is an AI-powered workforce behaviour prediction platform that turns HR, communication and wellbeing signals into real-time behavioural intelligence.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => router.push("/diagnostic")}
            className="rounded-xl px-8 py-4 text-base font-bold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer border-0"
            style={{ background: "linear-gradient(135deg,#67e8f9,#818cf8)" }}
          >
            Get your free workforce behaviour audit
          </button>
          <button
            onClick={() => router.push("/book-audit")}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-base font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-800 cursor-pointer"
          >
            Book executive demo →
          </button>
        </div>

        <p className="mt-5 text-xs text-slate-600">
          Decision-support intelligence only · No clinical diagnosis · Employee-facing tools are fully opt-in
        </p>
      </section>

      {/* ── 2. GLOBAL TRUST STATEMENT ─────────────────────────────── */}
      <section className="border-y border-slate-800/60 bg-slate-900/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-12 text-center text-xs font-semibold uppercase tracking-widest text-slate-600">
            Behavioural intelligence built on peer-reviewed organisational psychology
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {TRUST_STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black tracking-tight md:text-5xl" style={{ background: "linear-gradient(135deg,#67e8f9,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-slate-500 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 opacity-30">
            {["ISO 27001 Aligned", "GDPR Compliant", "SOC 2 Architecture", "Enterprise SSO", "99.9% Uptime SLA"].map((t, i) => (
              <span key={i} className="text-xs font-semibold uppercase tracking-widest text-slate-400">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PREDICTION DASHBOARD PREVIEW ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Live Prediction Dashboard
          </p>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-white leading-tight" style={{ letterSpacing: "-0.03em" }}>
            Six behavioural risk surfaces.<br />Updated continuously.
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            PsychFlo monitors burnout, attrition, sentiment drift, cognitive overload, psychological safety, and leadership friction — simultaneously, in real time. Each signal comes with a recommended decision-support action.
          </p>
        </div>

        {/* Dashboard shell */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-2xl">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-slate-700" />
                <div className="h-3 w-3 rounded-full bg-slate-700" />
                <div className="h-3 w-3 rounded-full bg-slate-700" />
              </div>
              <span className="text-sm font-semibold text-slate-400">PsychFlo · Executive Risk Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600">Sample data · For illustration only</span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-bold text-cyan-400">LIVE</span>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid gap-px bg-slate-800/40 md:grid-cols-2 lg:grid-cols-3">
            {PREDICTION_CARDS.map((card, i) => (
              <div key={i} className="bg-slate-950 p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{card.title}</p>
                    <p className={`mt-2 text-3xl font-black tracking-tight ${card.color}`} style={{ letterSpacing: "-0.03em" }}>{card.value}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${card.badge}`}>{card.change}</span>
                </div>
                {/* Mini bar */}
                <div className="h-1 w-full rounded-full bg-slate-800">
                  <div className={`h-full rounded-full ${card.bar}`} style={{ width: card.barW }} />
                </div>
                <p className="text-sm text-slate-400">{card.insight}</p>
                <div className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Recommended action</p>
                  <p className="text-sm text-slate-300">{card.action}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 bg-slate-950/60 px-6 py-4">
            <span className="text-xs text-slate-600">12 prediction models · 6 risk surfaces · Updated every 24 hours · Decision-support only, not clinical diagnosis</span>
            <button
              onClick={() => router.push("/diagnostic")}
              className="rounded-lg px-4 py-2 text-sm font-bold text-slate-950 cursor-pointer border-0"
              style={{ background: "linear-gradient(135deg,#67e8f9,#818cf8)" }}
            >
              Get your dashboard →
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. HOW THE PREDICTION ENGINE WORKS ────────────────────── */}
      <section className="border-t border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400">
              The Prediction Engine
            </p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl text-white leading-tight" style={{ letterSpacing: "-0.03em" }}>
              From workforce signal to executive decision support
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400 leading-relaxed">
              A four-stage pipeline that converts raw behavioural signals into ranked risk intelligence — without replacing any existing HR infrastructure.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ENGINE_STEPS.map((s, i) => (
              <div key={i} className={`relative rounded-2xl border p-6 ${s.accent}`}>
                <div className={`mb-4 text-5xl font-black opacity-20 ${s.num}`} style={{ letterSpacing: "-0.05em" }}>{s.n}</div>
                <h3 className="mb-3 text-base font-bold text-white">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                {i < ENGINE_STEPS.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-slate-700 lg:block text-xl">→</div>
                )}
              </div>
            ))}
          </div>

          {/* Stat strip */}
          <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:grid-cols-4">
            {[
              { v: "6–10 wks", l: "Ahead of observable decline" },
              { v: "12", l: "Prediction models" },
              { v: "<24 hrs", l: "Signal-to-intelligence latency" },
              { v: "48 hrs", l: "Diagnostic to executive report" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-white md:text-3xl" style={{ letterSpacing: "-0.03em" }}>{s.v}</div>
                <div className="mt-1 text-xs text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. BEHAVIOURAL INTELLIGENCE LAYER ────────────────────── */}
      <section className="border-t border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Behavioural Intelligence Layer
              </p>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-white leading-tight" style={{ letterSpacing: "-0.03em" }}>
                We don't replace your HR systems.<br />We make them predictive.
              </h2>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                PsychFlo is a behavioural intelligence layer — not a replacement for your HRIS. It ingests signals from the platforms your workforce already uses, then generates the predictive intelligence your existing systems cannot produce.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  "Connects to HRIS, communication, and onboarding platforms",
                  "No rip-and-replace of existing infrastructure",
                  "API-first architecture for enterprise integrations",
                  "Employee-facing components are fully opt-in and transparent",
                  "Global data compliance by design — GDPR, CCPA, and beyond",
                ].map((pt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 text-cyan-400 text-sm">✓</span>
                    <span className="text-sm text-slate-300">{pt}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/book-audit")}
                className="mt-8 rounded-xl px-6 py-3 text-sm font-bold text-slate-950 cursor-pointer border-0"
                style={{ background: "linear-gradient(135deg,#67e8f9,#818cf8)" }}
              >
                Book integration scoping call →
              </button>
            </div>

            {/* Signal flow diagram */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
              <p className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-600">Signal sources</p>
              <div className="space-y-3">
                {[
                  { label: "HRIS & people data", icon: "👥" },
                  { label: "Slack / Microsoft Teams", icon: "💬" },
                  { label: "Onboarding & feedback workflows", icon: "📋" },
                  { label: "Manager observation inputs", icon: "🔍" },
                  { label: "Structured pulse surveys", icon: "📊" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3.5">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                    <div className="ml-auto flex gap-1">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-1.5 w-1.5 rounded-full bg-cyan-500/40" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs font-semibold text-slate-600">AI behavioural modelling</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="rounded-2xl border p-6" style={{ borderColor: "rgba(103,232,249,0.15)", background: "linear-gradient(135deg,rgba(103,232,249,0.05),rgba(129,140,248,0.05))" }}>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-sm font-bold text-white">PsychFlo Prediction Engine</span>
                </div>
                <p className="text-sm text-slate-400">Converts behavioural signals into ranked risk scores, causal explanations, and decision-support recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. ORGANISATIONS THAT NEED PSYCHFLO ──────────────────── */}
      <section className="border-t border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-400">
              Built for Enterprise
            </p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl text-white leading-tight" style={{ letterSpacing: "-0.03em" }}>
              Organisations that operate at scale<br />need predictive workforce intelligence
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
              Retrospective surveys and annual reviews cannot move fast enough. PsychFlo predicts workforce risk in real time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ORG_TYPES.map((org, i) => (
              <div key={i} className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition-all hover:border-slate-700 hover:bg-slate-900">
                <div className="mb-5 text-3xl">{org.icon}</div>
                <h3 className="mb-3 text-base font-bold text-white leading-snug">{org.title}</h3>
                <p className="mb-5 text-sm text-slate-400 leading-relaxed">{org.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {org.signals.map((sig, j) => (
                    <span key={j} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                      {sig}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. RESEARCH HUB ──────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400">
                Research & Intelligence
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-white" style={{ letterSpacing: "-0.03em" }}>
                The science behind the platform
              </h2>
              <p className="mt-4 max-w-xl text-lg text-slate-400">
                Our prediction models are grounded in peer-reviewed organisational psychology. We publish our methodology openly.
              </p>
            </div>
            <button
              onClick={() => router.push("/blog")}
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              View all research →
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {RESEARCH_ARTICLES.map((a, i) => (
              <div key={i} className="group flex cursor-pointer flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition-all hover:border-slate-700 hover:bg-slate-900"
                onClick={() => router.push("/blog")}>
                <div className="mb-6 flex items-center justify-between">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${a.tagColor}`}>{a.tag}</span>
                  <span className="text-xs text-slate-600">{a.readTime}</span>
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">{a.category}</p>
                <h3 className="mb-3 text-base font-bold text-white leading-snug flex-1">{a.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{a.desc}</p>
                <div className="mt-6 text-xs font-semibold text-slate-500 group-hover:text-slate-300 transition-colors">
                  Read article →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. C-SUITE CASE STUDIES ───────────────────────────────── */}
      <section className="border-t border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Decision-Maker Perspectives
            </p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white" style={{ letterSpacing: "-0.03em" }}>
              How executive teams use<br />PsychFlo intelligence
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-500 text-sm">
              Illustrative perspectives based on modelled outcomes. PsychFlo provides decision-support intelligence, not clinical diagnosis or guaranteed results.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {CASE_STUDIES.map((c, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
                <div className="mb-6 text-3xl text-slate-700">"</div>
                <p className="flex-1 text-base text-slate-300 leading-relaxed italic">{c.quote}</p>
                <div className="mt-8 border-t border-slate-800 pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">{c.role}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{c.org}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-400" style={{ letterSpacing: "-0.02em" }}>{c.metric}</p>
                      <p className="text-xs text-slate-600">{c.metricLabel}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. PRODUCT FEATURES ───────────────────────────────────── */}
      <section className="border-t border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-sky-400">
              Platform Capabilities
            </p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white" style={{ letterSpacing: "-0.03em" }}>
              Everything an enterprise needs<br />to operationalise workforce intelligence
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition-all hover:border-slate-700 hover:bg-slate-900">
                <div className={`mb-4 text-2xl font-black ${f.color}`}>{f.icon}</div>
                <h3 className="mb-2 text-sm font-bold text-white leading-snug">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/30 p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Enterprise deployment ready</h3>
                <p className="text-sm text-slate-400">SSO, audit logs, custom data residency, dedicated success management, and SLA-backed uptime.</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => router.push("/pricing")}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer">
                  View pricing
                </button>
                <button onClick={() => router.push("/book-audit")}
                  className="rounded-xl px-5 py-3 text-sm font-bold text-slate-950 cursor-pointer border-0"
                  style={{ background: "linear-gradient(135deg,#67e8f9,#818cf8)" }}>
                  Talk to enterprise team →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. ENTERPRISE CTA ────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 p-16 text-center" style={{ background: "linear-gradient(135deg,#060d1f,#0a0d20,#080618)" }}>
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-96 w-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle,#67e8f9,#818cf8)" }} />
            </div>

            <div className="relative">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                ✦ Founding Client Programme · 3 Spots Remaining
              </div>

              <h2 className="mx-auto max-w-3xl text-5xl font-black tracking-tight text-white md:text-6xl" style={{ letterSpacing: "-0.04em" }}>
                Start predicting.
                <span style={{ background: "linear-gradient(135deg,#67e8f9,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> Stop reacting.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">
                Run a free workforce behaviour audit. Receive a prediction intelligence report for your leadership team within 48 hours. No commitment required to begin.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => router.push("/diagnostic")}
                  className="rounded-xl px-10 py-4 text-base font-bold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer border-0"
                  style={{ background: "linear-gradient(135deg,#67e8f9,#818cf8)" }}
                >
                  Get your free workforce behaviour audit
                </button>
                <button
                  onClick={() => router.push("/book-audit")}
                  className="rounded-xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-base font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800 cursor-pointer"
                >
                  Book £750 executive audit →
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
                {["Free diagnostic", "48-hour report delivery", "Decision-support only", "No lock-in contract"].map((t, i) => (
                  <span key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="text-cyan-500">✓</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <p className="text-sm font-bold text-white mb-1">PsychFlo</p>
              <p className="text-xs text-slate-600">AI-Powered Workforce Behaviour Prediction Platform</p>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { label: "About",              href: "/about" },
                { label: "Pricing",            href: "/pricing" },
                { label: "Research",           href: "/blog" },
                { label: "Founding Programme", href: "/founding" },
                { label: "SLA",                href: "/sla" },
              ].map((l, i) => (
                <button key={i} onClick={() => router.push(l.href)}
                  className="bg-transparent border-0 text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors p-0">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800/60 pt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-slate-700">© 2026 PsychFlo · Workforce Behavioural Intelligence · All rights reserved</p>
            <p className="text-xs text-slate-700">Decision-support intelligence only. Not a medical device. Not clinical diagnosis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
