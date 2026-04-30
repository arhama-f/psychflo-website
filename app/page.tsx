"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

// ─── Types ─────────────────────────────────────────────────────────────────

interface RiskCard {
  label: string;
  value: string;
  change: string;
  insight: string;
  action: string;
  valueColor: string;
  badgeColor: string;
  barColor: string;
  barWidth: string;
}

interface EngineStep {
  n: string;
  title: string;
  desc: string;
  accentBorder: string;
  accentNum: string;
}

interface OrgType {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
}

interface ResearchArticle {
  tag: string;
  tagStyle: string;
  category: string;
  title: string;
  desc: string;
  readTime: string;
}

interface CaseStudy {
  quote: string;
  role: string;
  org: string;
  metric: string;
  metricLabel: string;
  metricColor: string;
}

interface Feature {
  title: string;
  desc: string;
  accent: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────

const RISK_CARDS: RiskCard[] = [
  {
    label: "Burnout Risk",
    value: "72%",
    change: "↑ +18%",
    insight: "Engineering cohort showing sustained cognitive fatigue signals.",
    action: "Redistribute workload and schedule manager check-ins within 7 days.",
    valueColor: "text-red-400",
    badgeColor: "bg-red-500/10 text-red-300 border-red-500/20",
    barColor: "bg-red-400",
    barWidth: "72%",
  },
  {
    label: "Attrition Probability",
    value: "34%",
    change: "↑ +9%",
    insight: "High performers showing reduced engagement and growth signals.",
    action: "Trigger structured retention conversation within 14 days.",
    valueColor: "text-amber-400",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    barColor: "bg-amber-400",
    barWidth: "34%",
  },
  {
    label: "Cognitive Load",
    value: "High",
    change: "↑ +21%",
    insight: "Teams showing elevated context-switching and reduced deep-work time.",
    action: "Protect focus blocks and reduce meeting density immediately.",
    valueColor: "text-violet-400",
    badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    barColor: "bg-violet-400",
    barWidth: "78%",
  },
  {
    label: "Psychological Safety",
    value: "61 / 100",
    change: "−16 pts",
    insight: "Participation and feedback frequency declining across three teams.",
    action: "Deploy targeted leadership and team climate review protocol.",
    valueColor: "text-cyan-400",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    barColor: "bg-cyan-400",
    barWidth: "61%",
  },
  {
    label: "Sentiment Drift",
    value: "Negative",
    change: "14-day decline",
    insight: "Communication tone trending toward disengagement across two departments.",
    action: "Review team rituals and async communication norms.",
    valueColor: "text-orange-400",
    badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    barColor: "bg-orange-400",
    barWidth: "58%",
  },
  {
    label: "Leadership Friction",
    value: "Elevated",
    change: "3 flagged",
    insight: "Manager-team alignment below threshold in three business units.",
    action: "Initiate manager effectiveness review and coaching protocol.",
    valueColor: "text-rose-400",
    badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    barColor: "bg-rose-400",
    barWidth: "66%",
  },
];

const ENGINE_STEPS: EngineStep[] = [
  {
    n: "01",
    title: "Ingest behavioural signals",
    desc: "PsychFlo connects to HR systems, communication platforms, onboarding workflows, and manager inputs — reading language and behaviour, not just headcount data.",
    accentBorder: "border-cyan-500/25 bg-cyan-500/5",
    accentNum: "text-cyan-500/30",
  },
  {
    n: "02",
    title: "Run 12 prediction models",
    desc: "Twelve proprietary models process signals against validated organisational psychology frameworks — scoring burnout trajectories, attrition probability curves, and cognitive load thresholds in real time.",
    accentBorder: "border-violet-500/25 bg-violet-500/5",
    accentNum: "text-violet-400/30",
  },
  {
    n: "03",
    title: "Generate risk intelligence",
    desc: "Each signal cluster is ranked by predicted business impact and time-to-materialisation. Decision-support intelligence is generated per team, department, and organisation — not just aggregate scores.",
    accentBorder: "border-amber-500/25 bg-amber-500/5",
    accentNum: "text-amber-400/30",
  },
  {
    n: "04",
    title: "Deliver actionable recommendations",
    desc: "Every risk surface is paired with a named intervention, an owner, and a structured action protocol. Your HR and leadership teams act on intelligence — not raw data.",
    accentBorder: "border-emerald-500/25 bg-emerald-500/5",
    accentNum: "text-emerald-400/30",
  },
];

const ORG_TYPES: OrgType[] = [
  {
    icon: "🚀",
    title: "High-growth technology companies",
    desc: "Predict attrition in engineering cohorts before sprint velocity collapses. Identify cognitive overload before it triggers a retention crisis.",
    tags: ["Attrition prediction", "Sprint fatigue signals", "Burnout trajectories"],
  },
  {
    icon: "🌐",
    title: "Global professional services firms",
    desc: "Monitor psychological safety across geographies. Surface leadership friction and disengagement in distributed teams before they affect client delivery.",
    tags: ["Distributed sentiment", "Leadership friction", "Disengagement signals"],
  },
  {
    icon: "🏦",
    title: "Enterprise financial services",
    desc: "Predict workforce behaviour risk across high-stakes, compliance-sensitive environments. Generate executive-grade intelligence for board-level reporting.",
    tags: ["Compliance risk signals", "Cognitive load index", "Board intelligence"],
  },
  {
    icon: "🧬",
    title: "Healthcare & life sciences",
    desc: "Detect burnout risk in clinical and operational workforces with the precision required for safety-critical environments. Decision support, not diagnosis.",
    tags: ["Burnout risk scoring", "Shift fatigue signals", "Team safety index"],
  },
  {
    icon: "📊",
    title: "Private equity portfolio companies",
    desc: "Assess workforce risk during acquisition integration. Identify cultural misalignment and retention risk in the first 90 days of post-merger operations.",
    tags: ["M&A integration risk", "Cultural alignment", "Retention probability"],
  },
  {
    icon: "⚙️",
    title: "Multinational operations & logistics",
    desc: "Surface cognitive overload and psychological safety deficits across complex shift-based workforces. Build the data layer for proactive workforce management.",
    tags: ["Shift overload index", "Safety culture signals", "Manager effectiveness"],
  },
];

const RESEARCH_ARTICLES: ResearchArticle[] = [
  {
    tag: "Research",
    tagStyle: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    category: "Burnout Science",
    title: "Behavioural signal latency: How early can burnout be predicted?",
    desc: "Analysis of signal-to-outcome timing across organisational psychology frameworks. Burnout risk surfaces 6–10 weeks before observable performance decline.",
    readTime: "8 min",
  },
  {
    tag: "Analysis",
    tagStyle: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    category: "Attrition Modelling",
    title: "The attrition signal stack: What language, behaviour and cadence reveal",
    desc: "A multi-signal analysis of the variables that predict voluntary attrition — and why self-reported surveys systematically underperform against behavioural models.",
    readTime: "6 min",
  },
  {
    tag: "Perspective",
    tagStyle: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    category: "AI + Organisational Psychology",
    title: "The future of AI in workforce behaviour: Prediction vs. diagnosis",
    desc: "A principled distinction between AI-powered decision-support tools and clinical diagnosis — and why the difference matters for HR, legal, and employee trust.",
    readTime: "5 min",
  },
];

const CASE_STUDIES: CaseStudy[] = [
  {
    quote: "PsychFlo's prediction signals gave us decision support we didn't know we were missing. We identified retention risk in two senior engineering teams eight weeks before either manager escalated a concern.",
    role: "Chief People Officer",
    org: "Series C technology company · 400 employees",
    metric: "8 weeks",
    metricLabel: "Earlier than manager escalation",
    metricColor: "text-cyan-400",
  },
  {
    quote: "The cognitive load index surfaced something our employee survey had missed for three cycles. The decision-support output was specific enough for our HR team to act on immediately — without waiting for a quarterly review.",
    role: "VP People & Culture",
    org: "Global professional services firm · 1,200 employees",
    metric: "3 cycles",
    metricLabel: "Earlier than survey detection",
    metricColor: "text-violet-400",
  },
  {
    quote: "What distinguishes PsychFlo is the scientific grounding. This is not a mood tracker. The prediction models produce board-ready intelligence — not vague wellbeing scores that HR has to interpret alone.",
    role: "CHRO",
    org: "Enterprise financial services organisation · 3,000 employees",
    metric: "Board-ready",
    metricLabel: "Executive intelligence output",
    metricColor: "text-emerald-400",
  },
];

const FEATURES: Feature[] = [
  {
    title: "Real-time risk scoring across 6 surfaces",
    desc: "Burnout, attrition, sentiment drift, cognitive overload, psychological safety, and leadership friction — monitored simultaneously and continuously.",
    accent: "text-cyan-400",
  },
  {
    title: "12-model proprietary prediction engine",
    desc: "Each model is grounded in peer-reviewed organisational psychology and configured per industry, workforce size, and signal availability.",
    accent: "text-violet-400",
  },
  {
    title: "Executive intelligence reports",
    desc: "Board-ready PDF reports delivered on demand. Risk scores, signal explanations, financial exposure estimates, and recommended actions.",
    accent: "text-amber-400",
  },
  {
    title: "HR system integration layer",
    desc: "Native integrations with major HRIS platforms, communication tools, and onboarding workflows. No rip-and-replace of existing infrastructure.",
    accent: "text-emerald-400",
  },
  {
    title: "Manager decision-support protocols",
    desc: "Each risk signal comes with a named intervention, a structured conversation guide, and success metrics — not vague, untimely recommendations.",
    accent: "text-rose-400",
  },
  {
    title: "Enterprise security & compliance",
    desc: "SOC 2-aligned architecture. GDPR and CCPA compliant by design. Employee-facing tools are fully opt-in and transparent. No covert monitoring.",
    accent: "text-sky-400",
  },
  {
    title: "Organisational benchmarking",
    desc: "Compare risk scores against industry benchmarks and historical baselines. Track intervention effectiveness over time with longitudinal trend data.",
    accent: "text-pink-400",
  },
  {
    title: "C-suite workforce intelligence dashboard",
    desc: "A single executive view of workforce behavioural risk across all teams, departments, and geographies — updated in real time.",
    accent: "text-indigo-400",
  },
];

const TRUST_STATS = [
  { value: "6–10 wks", label: "Ahead of observable performance signals" },
  { value: "12",       label: "Proprietary prediction models" },
  { value: "6",        label: "Behavioural risk surfaces monitored" },
  { value: "48 hrs",   label: "From diagnostic to executive report" },
];

const COMPLIANCE_BADGES = [
  "ISO 27001 Aligned", "SOC 2 Architecture", "GDPR Compliant",
  "CCPA Compliant", "Enterprise SSO", "99.9% Uptime SLA",
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-28 pb-24 md:pt-36 md:pb-32">
        {/* Background radial glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-0 h-[600px] w-[600px] rounded-full opacity-[0.07] blur-3xl" style={{ background: "radial-gradient(circle,#22d3ee,transparent 70%)" }} />
          <div className="absolute -top-16 left-0 h-[500px] w-[500px] rounded-full opacity-[0.06] blur-3xl" style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)" }} />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Eyebrow */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            AI Workforce Behaviour Prediction Platform
          </div>

          {/* Headline */}
          <h1 className="max-w-5xl text-5xl font-black leading-[1.02] tracking-tight md:text-[72px]" style={{ letterSpacing: "-0.04em" }}>
            Predict workforce behaviour{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
              before it becomes business risk.
            </span>
          </h1>

          {/* Sub */}
          <p className="mt-7 max-w-2xl text-xl text-slate-400 leading-relaxed">
            PsychFlo is an AI-powered workforce behaviour prediction platform that turns HR, communication and wellbeing signals into real-time behavioural intelligence — surfacing burnout, attrition, cognitive overload, and psychological safety risk before they affect performance.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push("/diagnostic")}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-4 text-base font-bold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer border-0"
            >
              Get your free workforce audit
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-base font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-800 cursor-pointer"
            >
              Book enterprise demo →
            </button>
          </div>

          <p className="mt-5 text-xs text-slate-700">
            Decision-support intelligence only · Not clinical diagnosis · Employee-facing tools are fully opt-in
          </p>
        </div>
      </section>

      {/* ── 2. GLOBAL TRUST STATEMENT ─────────────────────────────────────── */}
      <section className="border-y border-slate-800/60 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="mb-12 text-center text-xs font-semibold uppercase tracking-widest text-slate-700">
            Built on peer-reviewed organisational psychology · Global deployment · Enterprise-grade
          </p>

          {/* Stats */}
          <div className="mb-14 grid grid-cols-2 gap-px rounded-2xl border border-slate-800 bg-slate-800 overflow-hidden md:grid-cols-4">
            {TRUST_STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-2 bg-slate-950 px-8 py-10 text-center">
                <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-4xl font-black text-transparent md:text-5xl" style={{ letterSpacing: "-0.04em" }}>
                  {s.value}
                </span>
                <span className="text-xs text-slate-600 leading-snug max-w-[120px]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Compliance */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {COMPLIANCE_BADGES.map((b, i) => (
              <span key={i} className="text-xs font-semibold uppercase tracking-widest text-slate-800">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PREDICTION DASHBOARD PREVIEW ───────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Live prediction dashboard
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
              Six behavioural risk surfaces.<br />Updated continuously.
            </h2>
            <p className="mt-4 text-lg text-slate-400 leading-relaxed">
              Every surface comes with a recommended decision-support action. You never see a red number without knowing exactly what to do about it.
            </p>
          </div>

          {/* Dashboard shell */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-slate-800/60 bg-slate-900/60 px-6 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-slate-800" />
                  <div className="h-3 w-3 rounded-full bg-slate-800" />
                  <div className="h-3 w-3 rounded-full bg-slate-800" />
                </div>
                <span className="text-xs font-semibold text-slate-500">PsychFlo · Executive Risk Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-slate-700 sm:block">Sample data · For illustration only</span>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">LIVE</span>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid gap-px bg-slate-800/40 md:grid-cols-2 lg:grid-cols-3">
              {RISK_CARDS.map((card, i) => (
                <div key={i} className="flex flex-col gap-4 bg-slate-950 p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">{card.label}</p>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${card.badgeColor}`}>{card.change}</span>
                  </div>
                  {/* Value */}
                  <p className={`text-3xl font-black tracking-tight ${card.valueColor}`} style={{ letterSpacing: "-0.03em" }}>{card.value}</p>
                  {/* Bar */}
                  <div className="h-1 w-full rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${card.barColor} transition-all`} style={{ width: card.barWidth }} />
                  </div>
                  {/* Insight */}
                  <p className="text-sm text-slate-400">{card.insight}</p>
                  {/* Action */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">Recommended action</p>
                    <p className="text-sm text-slate-300">{card.action}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 bg-slate-900/40 px-6 py-4">
              <p className="text-xs text-slate-700">12 prediction models · 6 risk surfaces · Decision-support only, not clinical diagnosis</p>
              <button
                onClick={() => router.push("/diagnostic")}
                className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-xs font-bold text-slate-950 cursor-pointer border-0"
              >
                Get your dashboard →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. HOW THE PREDICTION ENGINE WORKS ────────────────────────────── */}
      <section className="border-t border-slate-800/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">
              The prediction engine
            </p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
              From workforce signal to executive decision support.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              A four-stage pipeline that converts raw behavioural signals into ranked risk intelligence — without replacing existing HR infrastructure.
            </p>
          </div>

          <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Connector line */}
            <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent lg:block" />

            {ENGINE_STEPS.map((s, i) => (
              <div key={i} className={`relative rounded-2xl border p-7 ${s.accentBorder}`}>
                <div className={`mb-4 text-6xl font-black leading-none ${s.accentNum}`} style={{ letterSpacing: "-0.05em" }}>{s.n}</div>
                <h3 className="mb-3 text-base font-bold text-white leading-snug">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-8 md:grid-cols-4">
            {[
              { v: "6–10 wks", l: "Ahead of observable decline" },
              { v: "12",       l: "Prediction models" },
              { v: "<24 hrs",  l: "Signal-to-intelligence latency" },
              { v: "48 hrs",   l: "Diagnostic to executive report" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-white md:text-3xl" style={{ letterSpacing: "-0.03em" }}>{s.v}</p>
                <p className="mt-1 text-xs text-slate-600">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. BEHAVIOURAL INTELLIGENCE LAYER ─────────────────────────────── */}
      <section className="border-t border-slate-800/50 bg-white px-6 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left copy */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-700">
              Behavioural intelligence layer
            </p>
            <h2 className="text-4xl font-bold leading-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
              We don&apos;t replace your HR systems.<br />We make them predictive.
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              PsychFlo sits above existing HR tools and converts people data into behavioural intelligence for leaders, HR teams and executive decision-makers — without requiring you to change the tools your teams already use.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {[
                "Connects to HRIS, communication, and onboarding platforms",
                "API-first architecture — no rip-and-replace",
                "Employee-facing tools are fully opt-in and transparent",
                "Global data compliance: GDPR, CCPA, and beyond",
                "Enterprise SSO and audit log support",
              ].map((pt, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 flex-shrink-0 text-cyan-600">✓</span> {pt}
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/demo")}
              className="mt-8 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white cursor-pointer border-0 hover:bg-slate-800 transition-colors"
            >
              Book integration scoping call →
            </button>
          </div>

          {/* Right: signal flow */}
          <div className="rounded-3xl bg-slate-100 p-8">
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-500">Signal sources</p>
            <div className="space-y-3">
              {[
                { label: "HRIS & people data",              icon: "👥" },
                { label: "Slack / Microsoft Teams",         icon: "💬" },
                { label: "Onboarding & feedback workflows", icon: "📋" },
                { label: "Structured pulse surveys",        icon: "📊" },
                { label: "Manager observation inputs",      icon: "🔍" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl bg-white px-5 py-3.5 shadow-sm">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  <div className="ml-auto flex gap-1">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-300" />
              <span className="text-xs font-bold text-slate-400">AI behavioural modelling</span>
              <div className="h-px flex-1 bg-slate-300" />
            </div>

            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-sm font-bold">PsychFlo Prediction Engine</span>
              </div>
              <p className="text-sm text-slate-400">Converts signals into risk scores, causal explanations, and decision-support recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. ORGANISATIONS THAT NEED PSYCHFLO ───────────────────────────── */}
      <section className="border-t border-slate-800/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-400">
              Global demand
            </p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
              Organisations that operate at scale need predictive workforce intelligence.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Retrospective surveys and annual reviews cannot move fast enough. PsychFlo predicts risk in real time.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ORG_TYPES.map((org, i) => (
              <div key={i} className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-7 transition-all hover:border-slate-700 hover:bg-slate-900">
                <div className="mb-5 text-3xl">{org.icon}</div>
                <h3 className="mb-3 text-base font-bold text-white leading-snug">{org.title}</h3>
                <p className="mb-5 text-sm text-slate-400 leading-relaxed">{org.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {org.tags.map((tag, j) => (
                    <span key={j} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. RESEARCH HUB ───────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 bg-white px-6 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-700">
                Behaviour intelligence journal
              </p>
              <h2 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
                The science behind the platform.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-slate-600">
                Our prediction models are grounded in peer-reviewed organisational psychology. We publish our methodology openly.
              </p>
            </div>
            <button
              onClick={() => router.push("/research")}
              className="rounded-2xl bg-slate-950 px-6 py-3.5 font-semibold text-white cursor-pointer border-0 hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              View all research →
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {RESEARCH_ARTICLES.map((a, i) => (
              <article
                key={i}
                onClick={() => router.push("/research")}
                className="group flex cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${a.tagStyle}`}>{a.tag}</span>
                  <span className="text-xs text-slate-400">{a.readTime} read</span>
                </div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{a.category}</p>
                <h3 className="mb-3 flex-1 text-base font-bold text-slate-900 leading-snug">{a.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{a.desc}</p>
                <div className="mt-6 text-xs font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                  Read article →
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. C-SUITE CASE STUDIES ───────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Decision-maker perspectives
            </p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
              How executive teams use PsychFlo intelligence.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
              Illustrative perspectives based on modelled outcomes. PsychFlo provides decision-support intelligence, not clinical diagnosis or guaranteed results.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {CASE_STUDIES.map((c, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
                <div className="mb-6 text-4xl font-black text-slate-800 leading-none">&ldquo;</div>
                <p className="flex-1 text-base italic text-slate-300 leading-relaxed">{c.quote}</p>
                <div className="mt-8 border-t border-slate-800 pt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-white">{c.role}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{c.org}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xl font-black ${c.metricColor}`} style={{ letterSpacing: "-0.02em" }}>{c.metric}</p>
                    <p className="text-xs text-slate-600">{c.metricLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. PRODUCT FEATURES ───────────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 bg-slate-900/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-400">
              Platform capabilities
            </p>
            <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
              Everything an enterprise needs to operationalise workforce intelligence.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950 p-6 transition-all hover:border-slate-700">
                <div className={`mb-4 text-xl font-black ${f.accent}`}>◈</div>
                <h3 className="mb-2 text-sm font-bold text-white leading-snug">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Enterprise deployment ready</h3>
                <p className="text-sm text-slate-500">SSO, audit logs, custom data residency, dedicated success management, and SLA-backed uptime.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => router.push("/pricing")}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer transition-colors">
                  View pricing
                </button>
                <button onClick={() => router.push("/platform")}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer transition-colors">
                  Explore platform →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. ENTERPRISE CTA ────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 p-14 text-center md:p-20">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[500px] w-[500px] rounded-full opacity-[0.08] blur-3xl" style={{ background: "radial-gradient(circle,#22d3ee,#818cf8)" }} />
            </div>

            <div className="relative">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                ✦ Founding client programme · Limited availability
              </div>

              <h2 className="mx-auto max-w-3xl text-5xl font-black text-white md:text-6xl" style={{ letterSpacing: "-0.04em" }}>
                Start predicting.{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  Stop reacting.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">
                Run a free workforce behaviour audit. Receive a prediction intelligence report for your leadership team within 48 hours. No commitment required to begin.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => router.push("/diagnostic")}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-10 py-4 text-base font-bold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer border-0"
                >
                  Get your free workforce audit
                </button>
                <button
                  onClick={() => router.push("/demo")}
                  className="rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-base font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-800 cursor-pointer"
                >
                  Book enterprise demo →
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
                {["Free diagnostic", "48-hour report delivery", "Decision-support only", "No lock-in"].map((t, i) => (
                  <span key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-cyan-600">✓</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <p className="text-sm font-bold text-white">PsychFlo</p>
              <p className="mt-1 text-xs text-slate-700">AI-Powered Workforce Behaviour Prediction Platform</p>
            </div>
            <div className="flex flex-wrap gap-8">
              {[
                { heading: "Product", links: [{ l: "Platform", h: "/platform" }, { l: "Pricing", h: "/pricing" }, { l: "How It Works", h: "/how-it-works" }] },
                { heading: "Company", links: [{ l: "About", h: "/about" }, { l: "Case Studies", h: "/case-studies" }, { l: "Founding Programme", h: "/founding" }] },
                { heading: "Resources", links: [{ l: "Research", h: "/research" }, { l: "Blog", h: "/blog" }, { l: "SLA", h: "/sla" }] },
              ].map((col, i) => (
                <div key={i}>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">{col.heading}</p>
                  <div className="flex flex-col gap-2">
                    {col.links.map((lk, j) => (
                      <button key={j} onClick={() => router.push(lk.h)}
                        className="bg-transparent border-0 p-0 text-left text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">
                        {lk.l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-8">
            <p className="text-xs text-slate-800">© 2026 PsychFlo · All rights reserved</p>
            <p className="text-xs text-slate-800">Decision-support intelligence only · Not a medical device · Not clinical diagnosis</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
