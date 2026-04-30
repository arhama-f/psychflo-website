"use client";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

interface Article {
  category: string;
  title: string;
  desc: string;
  readTime: string;
  tag: string;
  tagColor: string;
}

interface Topic {
  title: string;
  desc: string;
  color: string;
}

const ARTICLES: Article[] = [
  {
    category: "Burnout Science",
    title: "Behavioural signal latency: How early can burnout be predicted?",
    desc: "Analysis of signal-to-outcome timing across 14 organisational psychology frameworks. Burnout risk surfaces an average of 6–10 weeks before observable performance decline.",
    readTime: "8 min",
    tag: "Research",
    tagColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  {
    category: "Attrition Modelling",
    title: "The attrition signal stack: What language, behaviour and cadence reveal",
    desc: "A multi-signal analysis of the variables that predict voluntary attrition — and why self-reported surveys systematically underperform against behavioural models.",
    readTime: "6 min",
    tag: "Analysis",
    tagColor: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  {
    category: "Leadership Science",
    title: "Leadership friction as a predictive variable: The underused signal",
    desc: "Quantifying the relationship between manager-team alignment signals and downstream attrition, disengagement, and psychological safety outcomes.",
    readTime: "10 min",
    tag: "Science",
    tagColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  {
    category: "Cognitive Science",
    title: "Cognitive overload at scale: Detection, thresholds, and intervention timing",
    desc: "How sustained cognitive load patterns manifest in communication signals, and the intervention windows that prevent performance degradation.",
    readTime: "7 min",
    tag: "Research",
    tagColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  {
    category: "Psychological Safety",
    title: "Measuring psychological safety without surveys: A signal-based approach",
    desc: "An alternative framework for measuring psychological safety using participation signals, communication asymmetry, and feedback frequency — without annual surveys.",
    readTime: "9 min",
    tag: "Methodology",
    tagColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  {
    category: "AI + HR",
    title: "The future of AI in organisational psychology: Prediction vs. diagnosis",
    desc: "A principled distinction between AI-powered decision-support tools and clinical diagnosis — and why the difference matters for HR, legal, and employee trust.",
    readTime: "5 min",
    tag: "Perspective",
    tagColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  },
];

const TOPICS: Topic[] = [
  { title: "Burnout prediction", desc: "Signal-based early warning before performance decline", color: "text-red-400" },
  { title: "Attrition modelling", desc: "Multi-variable probability frameworks for retention risk", color: "text-amber-400" },
  { title: "Cognitive load", desc: "Sustained overload detection in knowledge workers", color: "text-violet-400" },
  { title: "Psychological safety", desc: "Participation and voice signal analysis", color: "text-cyan-400" },
  { title: "Leadership friction", desc: "Manager-team alignment and decision bottleneck signals", color: "text-emerald-400" },
  { title: "Sentiment drift", desc: "Communication tone trajectory analysis", color: "text-rose-400" },
];

export default function ResearchPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#8b5cf622,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400">
            Research & Intelligence
          </p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl" style={{ letterSpacing: "-0.03em" }}>
            The science behind workforce behaviour prediction.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            PsychFlo's prediction models are grounded in peer-reviewed organisational psychology. We publish our methodology openly so practitioners, executives, and researchers can evaluate the foundations.
          </p>
        </div>
      </section>

      {/* Topics */}
      <section className="border-y border-slate-800/50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-600">Research areas</p>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {TOPICS.map((t, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <p className={`text-sm font-bold mb-1 ${t.color}`}>{t.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-2xl font-bold text-white">Latest research</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((a, i) => (
              <article key={i} className="group flex cursor-pointer flex-col rounded-3xl border border-slate-800 bg-slate-900/50 p-7 transition-all hover:border-slate-700 hover:bg-slate-900">
                <div className="mb-5 flex items-center justify-between">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${a.tagColor}`}>{a.tag}</span>
                  <span className="text-xs text-slate-700">{a.readTime} read</span>
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">{a.category}</p>
                <h3 className="mb-4 text-base font-bold text-white leading-snug flex-1">{a.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{a.desc}</p>
                <div className="mt-6 text-xs font-semibold text-slate-600 group-hover:text-slate-300 transition-colors">
                  Read article →
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Put the research into practice.
          </h2>
          <p className="text-slate-400 mb-8">
            Run a free workforce behaviour audit and see which prediction signals apply to your organisation.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            className="rounded-2xl px-8 py-4 text-sm font-bold text-slate-950 cursor-pointer border-0"
            style={{ background: "linear-gradient(135deg,#67e8f9,#818cf8)" }}>
            Get free workforce audit →
          </button>
        </div>
      </section>
    </main>
  );
}
