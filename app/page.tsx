"use client";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ background: "#07090f", color: "#fff", fontFamily: "inherit" }}>
      <Nav />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "calc(100svh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center", overflow: "hidden" }}>

        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "72px 72px", maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%,black,transparent)" }} />

        {/* Glow */}
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(124,58,237,0.18),transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "720px", width: "100%" }}>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "6px 14px", marginBottom: "32px", background: "rgba(255,255,255,0.03)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22d3ee", flexShrink: 0 }} />
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>AI Workforce Intelligence Platform</span>
          </div>

          {/* H1 */}
          <h1 style={{ fontSize: "clamp(2.8rem,6vw,4.5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.04em", margin: "0 0 24px" }}>
            Predict workforce risk<br />
            <span style={{ background: "linear-gradient(90deg,#67e8f9 0%,#a78bfa 50%,#67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              weeks before it surfaces.
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: "16px", lineHeight: 1.75, color: "rgba(255,255,255,0.4)", maxWidth: "480px", margin: "0 auto 40px" }}>
            PsychFlo turns behavioural signals from your HR stack into real-time intelligence — surfacing burnout, attrition, and disengagement before they affect performance.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/diagnostic")}
              style={{ background: "#fff", color: "#07090f", border: "none", borderRadius: "8px", padding: "11px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "opacity .15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Free workforce audit →
            </button>
            <button onClick={() => router.push("/demo")}
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", padding: "11px 24px", fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
              Book a demo
            </button>
          </div>

          <p style={{ marginTop: "20px", fontSize: "12px", color: "rgba(255,255,255,0.18)" }}>
            Decision-support only · Not clinical diagnosis · Fully opt-in
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { v: "6–10 wks", l: "Before observable decline" },
            { v: "12",       l: "Prediction models" },
            { v: "6",        l: "Risk surfaces monitored" },
            { v: "48 hrs",   l: "Audit to executive report" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "36px 32px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <p style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", margin: "0 0 6px" }}>{s.v}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.5 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          WHAT IT DOES
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "120px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "64px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "16px" }}>Platform</p>
          <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0, maxWidth: "480px", lineHeight: 1.2 }}>
            Six behavioural risk surfaces. Running simultaneously.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
          {[
            { icon: "◎", accent: "#22d3ee", title: "Burnout Early Warning",      desc: "Detects sustained cognitive fatigue signals 6–10 weeks before observable performance decline." },
            { icon: "◈", accent: "#a78bfa", title: "Attrition Probability",      desc: "Scores voluntary attrition risk across engagement, growth, and manager-relationship signals." },
            { icon: "◇", accent: "#f59e0b", title: "Cognitive Load Index",       desc: "Measures meeting density, context-switching pressure, and focus-time erosion in real time." },
            { icon: "○", accent: "#34d399", title: "Psychological Safety Score", desc: "Tracks team voice, feedback participation, and communication asymmetry — without annual surveys." },
            { icon: "◉", accent: "#f87171", title: "Sentiment Drift",            desc: "Surfaces 14-day and 30-day communication tone trajectories across teams and departments." },
            { icon: "◐", accent: "#fb923c", title: "Leadership Friction",        desc: "Identifies manager-team alignment gaps and decision-authority ambiguity before they escalate." },
          ].map((f, i) => (
            <div key={i}
              style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", padding: "28px", transition: "background .2s", cursor: "default" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}>
              <span style={{ fontSize: "20px", color: f.accent }}>{f.icon}</span>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#fff", margin: "16px 0 10px", lineHeight: 1.3 }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "120px 24px" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "16px" }}>How it works</p>
          <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "64px", lineHeight: 1.2 }}>
            From signal to intelligence in three steps.
          </h2>

          {[
            { n: "01", title: "Connect your HR stack",      desc: "PsychFlo integrates with your HRIS, Slack, Microsoft Teams, and onboarding workflows via API — no rip-and-replace of existing tools." },
            { n: "02", title: "12 models run continuously", desc: "Proprietary prediction models process behavioural signals against peer-reviewed organisational psychology frameworks — updated in real time." },
            { n: "03", title: "Executive report delivered", desc: "Board-ready intelligence with ranked risk signals, named interventions, financial exposure estimates, and structured action protocols." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "32px", padding: "36px 0", borderTop: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.2)", paddingTop: "3px", flexShrink: 0, letterSpacing: "0.05em" }}>{s.n}</span>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#fff", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.38)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIAL
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "22px", fontWeight: 500, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontStyle: "italic", margin: "0 0 36px" }}>
            &ldquo;PsychFlo surfaced attrition risk in two senior engineering teams eight weeks before either manager escalated a concern. The decision-support output was specific enough to act on immediately.&rdquo;
          </p>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>Chief People Officer</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Series C technology company · 400 employees</p>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "24px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "99px", padding: "6px 14px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#34d399" }}>8 weeks early · Ahead of manager escalation</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px 120px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ borderRadius: "16px", padding: "80px 48px", textAlign: "center", background: "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(6,182,212,0.15))", border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>
                Founding client programme · Limited availability
              </p>
              <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
                Start predicting.<br />Stop reacting.
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "420px", margin: "0 auto 36px", lineHeight: 1.7 }}>
                Submit your organisation profile and receive a workforce intelligence report within 48 hours. Free, no commitment.
              </p>
              <button onClick={() => router.push("/diagnostic")}
                style={{ background: "#fff", color: "#07090f", border: "none", borderRadius: "8px", padding: "13px 28px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                Get your free workforce audit →
              </button>
              <div style={{ display: "flex", gap: "28px", justifyContent: "center", marginTop: "24px" }}>
                {["Free · No commitment", "Report in 48 hours", "Decision-support only"].map((t, i) => (
                  <span key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg,#67e8f9,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 900, color: "#07090f" }}>Ψ</div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>PsychFlo</span>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", lineHeight: 1.7, maxWidth: "220px", margin: 0 }}>
                AI-powered workforce behaviour prediction for HR and executive teams.
              </p>
            </div>

            {/* Cols */}
            {[
              { heading: "Product",   links: [{ l: "Platform", h: "/platform" }, { l: "Pricing", h: "/pricing" }, { l: "How it works", h: "/how-it-works" }] },
              { heading: "Company",   links: [{ l: "Case Studies", h: "/case-studies" }, { l: "Research", h: "/research" }, { l: "Book Demo", h: "/demo" }] },
              { heading: "Legal",     links: [{ l: "Privacy", h: "/privacy" }, { l: "Terms", h: "/terms" }, { l: "SLA", h: "/sla" }] },
            ].map((col, i) => (
              <div key={i}>
                <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "16px" }}>{col.heading}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {col.links.map((lk, j) => (
                    <button key={j} onClick={() => router.push(lk.h)}
                      style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "13px", color: "rgba(255,255,255,0.35)", cursor: "pointer", transition: "color .15s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                      {lk.l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 PsychFlo. All rights reserved.</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>Decision-support intelligence only · Not a medical device · Not clinical diagnosis</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
