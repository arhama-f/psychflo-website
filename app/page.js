"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

const predictionCards = [
  {
    label: "Burnout Risk",
    value: "72%",
    status: "Elevated",
    insight: "Sustained workload intensity detected across product teams.",
    action: "Recommend workload redistribution and manager check-ins.",
  },
  {
    label: "Attrition Probability",
    value: "34%",
    status: "Rising",
    insight: "High performers showing reduced engagement signals.",
    action: "Trigger retention conversation within 14 days.",
  },
  {
    label: "Cognitive Load",
    value: "High",
    status: "+21%",
    insight: "Teams are showing increased context-switching pressure.",
    action: "Protect deep-work blocks and reduce meeting density.",
  },
  {
    label: "Psychological Safety",
    value: "61/100",
    status: "Watch",
    insight: "Lower participation and reduced feedback activity detected.",
    action: "Run targeted leadership and team climate review.",
  },
];

const industries = [
  "Technology Companies",
  "Consulting Firms",
  "Financial Institutions",
  "Healthcare Systems",
  "Remote-First Organizations",
  "Enterprise HR Teams",
  "High-Growth Startups",
  "Global People Teams",
];

const features = [
  "Burnout early-warning signals",
  "Attrition prediction models",
  "Team sentiment drift detection",
  "Cognitive load monitoring",
  "Psychological safety scoring",
  "Manager action recommendations",
  "HR system intelligence layer",
  "Leadership risk dashboards",
];

const blogPosts = [
  {
    title: "Why burnout becomes predictable before it becomes visible",
    type: "Scientific Research",
  },
  {
    title: "How C-suite leaders can use behavioural signals to reduce attrition",
    type: "Executive Insight",
  },
  {
    title: "The future of AI in organisational psychology",
    type: "AI + Behaviour",
  },
];

const caseStudies = [
  {
    role: "Chief People Officer",
    problem: "Rising disengagement across distributed teams",
    solution:
      "Used behavioural risk signals to redesign manager check-ins and reduce communication overload.",
  },
  {
    role: "CTO",
    problem: "Engineering burnout during rapid product delivery",
    solution:
      "Identified cognitive load spikes and rebalanced sprint planning before delivery quality dropped.",
  },
  {
    role: "CEO",
    problem: "Leadership team friction during scale-up",
    solution:
      "Used behavioural intelligence to detect decision bottlenecks and improve executive alignment.",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#22d3ee33,transparent_35%),radial-gradient(circle_at_top_left,#8b5cf633,transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
              Global Workforce Behaviour Intelligence
            </p>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl" style={{ letterSpacing: "-0.03em" }}>
              Predict workforce behaviour before it becomes business risk.
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-8 text-slate-300">
              PsychFlo is an AI-powered workforce behaviour prediction platform
              that helps organizations detect burnout, attrition,
              disengagement, cognitive overload and psychological safety risk
              before they affect performance.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/book-audit")}
                className="rounded-2xl bg-cyan-400 px-7 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 cursor-pointer border-0"
              >
                Book enterprise demo
              </button>
              <button
                onClick={() => router.push("/blog")}
                className="rounded-2xl border border-slate-700 px-7 py-4 font-semibold text-white transition hover:bg-slate-900 cursor-pointer bg-transparent"
              >
                Explore research hub
              </button>
            </div>
          </div>

          <div className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Workforce Prediction Dashboard</h2>
                <p className="text-sm text-slate-400">Live behavioural risk signals across teams</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                AI monitoring active
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {predictionCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{card.label}</p>
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300">
                      {card.status}
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-bold">{card.value}</p>
                  <p className="mt-4 text-sm text-slate-300">{card.insight}</p>
                  <div className="mt-5 rounded-xl bg-cyan-400/10 p-4 text-sm text-cyan-200">
                    {card.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL TRUST */}
      <section className="border-y border-slate-800 bg-slate-900 px-6 py-10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-slate-300">
            Built for global organizations that need better visibility into
            workforce behaviour, leadership risk and team performance.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Prediction Engine
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl" style={{ letterSpacing: "-0.02em" }}>
              From workplace signals to intelligent action.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Collect Signals",
                text: "Connect HR data, surveys, communication patterns and manager observations.",
              },
              {
                step: "02",
                title: "Model Behaviour",
                text: "Apply AI and organisational psychology to detect behavioural patterns.",
              },
              {
                step: "03",
                title: "Predict Risk",
                text: "Surface early indicators of burnout, churn, overload and disengagement.",
              },
              {
                step: "04",
                title: "Recommend Action",
                text: "Guide leaders with practical interventions and measurable next steps.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm font-bold text-cyan-300">{item.step}</p>
                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
                <p className="mt-4 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HR INTELLIGENCE LAYER */}
      <section className="bg-white px-6 py-24 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
              Behavioural Intelligence Layer
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl" style={{ letterSpacing: "-0.02em" }}>
              We do not replace HR systems. We make them predictive.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              PsychFlo sits above existing HR tools and converts people data
              into behavioural intelligence for leaders, HR teams and executive
              decision-makers.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-100 p-8">
            {[
              "HRIS platforms",
              "Pulse surveys",
              "Slack and Microsoft Teams",
              "Performance reviews",
              "Manager feedback",
            ].map((source) => (
              <div key={source} className="mb-4 rounded-2xl bg-white p-4 font-semibold shadow-sm">
                {source}
              </div>
            ))}

            <div className="my-8 text-center font-bold text-slate-500">
              ↓ PsychFlo AI Behaviour Engine ↓
            </div>

            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <h3 className="text-2xl font-bold">Predictive Workforce Intelligence</h3>
              <p className="mt-4 text-slate-300">
                Risk scores, explanations, alerts and recommended leadership actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO NEEDS IT */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Global Demand
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl" style={{ letterSpacing: "-0.02em" }}>
              Built for organizations where people risk becomes business risk.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <div key={industry} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 font-semibold">
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold md:text-5xl" style={{ letterSpacing: "-0.02em" }}>
            One platform. Multiple behavioural intelligence capabilities.
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-300">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH HUB */}
      <section className="bg-white px-6 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
                Behaviour Intelligence Journal
              </p>
              <h2 className="mt-4 text-4xl font-bold md:text-5xl" style={{ letterSpacing: "-0.02em" }}>
                A scientific blog for leaders building healthier, smarter teams.
              </h2>
            </div>
            <button
              onClick={() => router.push("/blog")}
              className="rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white cursor-pointer border-0 whitespace-nowrap"
            >
              Read journal
            </button>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.title} className="rounded-3xl border border-slate-200 p-6 shadow-sm">
                <p className="text-sm font-semibold text-cyan-700">{post.type}</p>
                <h3 className="mt-4 text-2xl font-bold">{post.title}</h3>
                <p className="mt-4 text-slate-600">
                  Evidence-informed insight for executives, HR leaders and people teams.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Executive Case Studies
          </p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl" style={{ letterSpacing: "-0.02em" }}>
            How leaders can solve workforce problems before they escalate.
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {caseStudies.map((study) => (
              <div key={study.role} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-cyan-300">{study.role}</p>
                <h3 className="mt-4 text-xl font-bold">{study.problem}</h3>
                <p className="mt-4 text-slate-400">{study.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-cyan-400 p-10 text-center text-slate-950 md:p-16">
          <h2 className="text-4xl font-bold md:text-5xl" style={{ letterSpacing: "-0.02em" }}>
            Build the behavioural intelligence layer for your organization.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg">
            Use PsychFlo to predict workforce risk, support better leadership
            decisions and create healthier high-performing teams.
          </p>
          <div className="mt-10">
            <button
              onClick={() => router.push("/book-audit")}
              className="rounded-2xl bg-slate-950 px-8 py-4 font-semibold text-white cursor-pointer border-0"
            >
              Book enterprise demo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 px-6 py-12">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-white">PsychFlo</p>
            <p className="mt-1 text-xs text-slate-600">AI-Powered Workforce Behaviour Prediction Platform</p>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { label: "About",              href: "/about" },
              { label: "Pricing",            href: "/pricing" },
              { label: "Research",           href: "/blog" },
              { label: "Founding Programme", href: "/founding" },
              { label: "SLA",                href: "/sla" },
            ].map((l) => (
              <button key={l.label} onClick={() => router.push(l.href)}
                className="bg-transparent border-0 text-xs text-slate-600 hover:text-slate-400 cursor-pointer p-0 transition-colors">
                {l.label}
              </button>
            ))}
          </div>
          <p className="w-full border-t border-slate-800 pt-8 text-xs text-slate-700">
            © 2026 PsychFlo · Decision-support intelligence only. Not a medical device. Not clinical diagnosis.
          </p>
        </div>
      </footer>
    </main>
  );
}
