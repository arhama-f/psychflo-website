"use client";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

interface CaseStudy {
  role: string;
  org: string;
  challenge: string;
  approach: string;
  signal: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  tag: string;
  tagColor: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    role: "Chief People Officer",
    org: "Global technology company · 600 employees",
    challenge: "Rising attrition in senior engineering cohort with no early warning from existing HR tools.",
    approach: "PsychFlo ingested communication and onboarding signals across the engineering division. Attrition probability models flagged two teams eight weeks before either manager escalated a concern.",
    signal: "Attrition Probability",
    outcome: "Manager check-ins were restructured and growth conversations initiated. Both at-risk employees remained with the organisation through the following performance cycle.",
    metric: "8 weeks",
    metricLabel: "Ahead of manager escalation",
    tag: "Attrition",
    tagColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  {
    role: "CTO",
    org: "Series C product company · 280 employees",
    challenge: "Engineering burnout during an accelerated product delivery sprint. Sick leave was increasing and sprint velocity declining.",
    approach: "Cognitive load index surfaced sustained overload patterns across three engineering squads. The signal appeared three weeks before the first formal sick leave was filed.",
    signal: "Cognitive Load Index",
    outcome: "Sprint planning was restructured. Deep-work blocks were protected. Meeting density reduced by 40%. Sick leave stabilised within six weeks of intervention.",
    metric: "3 weeks",
    metricLabel: "Before first sick leave filed",
    tag: "Burnout",
    tagColor: "bg-red-500/10 text-red-300 border-red-500/20",
  },
  {
    role: "CEO",
    org: "Private equity-backed services firm · 450 employees",
    challenge: "Executive team friction following a merger integration. Decision-making was slowing and cross-functional alignment had deteriorated.",
    approach: "Leadership friction signals were identified across two executive teams. Behavioural intelligence pinpointed communication bottlenecks and decision-authority ambiguity as root causes.",
    signal: "Leadership Friction",
    outcome: "Targeted facilitation sessions were deployed using the decision-support protocol. Executive team alignment scores improved within 60 days.",
    metric: "60 days",
    metricLabel: "To measurable alignment improvement",
    tag: "Leadership",
    tagColor: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  {
    role: "VP People & Culture",
    org: "Remote-first SaaS company · 190 employees",
    challenge: "Psychological safety scores declining in distributed teams. Survey data was insufficient to identify root cause.",
    approach: "Sentiment drift and participation signals were analysed across async communication channels. The model identified a management communication pattern suppressing team voice.",
    signal: "Psychological Safety Index",
    outcome: "Manager coaching protocol deployed with weekly behavioural check-ins. Psychological safety index improved 22 points over one quarter.",
    metric: "+22 pts",
    metricLabel: "Psychological safety improvement",
    tag: "Culture",
    tagColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  {
    role: "CHRO",
    org: "Global financial services organisation · 2,400 employees",
    challenge: "High-value employee retention declining across regional offices. Annual engagement survey showed no meaningful signal.",
    approach: "PsychFlo was deployed as a behavioural intelligence layer above the existing HRIS. Attrition and disengagement signals were surfaced at department and manager level.",
    signal: "Attrition + Disengagement",
    outcome: "Targeted retention interventions were deployed across three regions. Flight-risk employees were identified and engaged before resignation decisions were finalised.",
    metric: "31%",
    metricLabel: "Average predicted attrition risk at intervention",
    tag: "Retention",
    tagColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  {
    role: "COO",
    org: "Healthcare systems operator · 800 employees",
    challenge: "Burnout risk in clinical support staff reaching unsustainable levels. Traditional wellbeing programmes were not producing measurable results.",
    approach: "Burnout early-warning signals were deployed across shift-based teams. Cognitive load and sentiment drift were tracked without disrupting clinical workflows.",
    signal: "Burnout Risk Score",
    outcome: "Workload redistribution and structured recovery periods were deployed. Burnout risk scores reduced across all flagged teams within eight weeks.",
    metric: "8 weeks",
    metricLabel: "To measurable burnout risk reduction",
    tag: "Burnout",
    tagColor: "bg-red-500/10 text-red-300 border-red-500/20",
  },
];

export default function CaseStudiesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#22d3ee1a,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Executive Case Studies
          </p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl" style={{ letterSpacing: "-0.03em" }}>
            How organisations use PsychFlo to predict and prevent workforce risk.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Illustrative case studies based on modelled outcomes. PsychFlo provides decision-support intelligence, not clinical diagnosis or guaranteed results.
          </p>
          <div className="mt-4 inline-flex rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-600">
            All scenarios are illustrative · No real client data is represented
          </div>
        </div>
      </section>

      {/* Case studies grid */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2">
          {CASE_STUDIES.map((cs, i) => (
            <div key={i} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm font-bold text-white">{cs.role}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{cs.org}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${cs.tagColor}`}>{cs.tag}</span>
              </div>

              <div className="flex flex-col gap-5 flex-1">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">Challenge</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{cs.challenge}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">Approach</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{cs.approach}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Signal surface</p>
                  <p className="text-sm font-bold text-cyan-400">{cs.signal}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">Outcome</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{cs.outcome}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-emerald-400" style={{ letterSpacing: "-0.03em" }}>{cs.metric}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{cs.metricLabel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 px-6 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-cyan-400 p-12 text-center text-slate-950">
          <h2 className="text-3xl font-bold md:text-4xl" style={{ letterSpacing: "-0.02em" }}>
            See what PsychFlo surfaces for your organisation.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base">
            Run a free workforce behaviour audit or book an executive demo tailored to your industry and team size.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button onClick={() => router.push("/diagnostic")}
              className="rounded-2xl bg-slate-950 px-7 py-3.5 font-semibold text-white cursor-pointer border-0">
              Get free audit →
            </button>
            <button onClick={() => router.push("/demo")}
              className="rounded-2xl border-2 border-slate-950/20 px-7 py-3.5 font-semibold cursor-pointer bg-transparent">
              Book demo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
