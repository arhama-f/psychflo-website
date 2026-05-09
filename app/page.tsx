"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Nav from "./components/Nav";

const gold = "#c9a84c";
const green = "#10b981";
const navy = "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)";

export default function Home() {
  const router = useRouter();
  const [calcSize, setCalcSize] = useState(75);
  const [calcSalary, setCalcSalary] = useState(50000);
  const [calcTurnover, setCalcTurnover] = useState(18);

  const annualExits = Math.round((calcSize * calcTurnover) / 100);
  const replacementCost = Math.round(calcSalary * 0.6);
  const attritionTotal = annualExits * replacementCost;
  const burnoutTotal = Math.round(calcSize * 0.1 * calcSalary * 0.4);
  const grandTotal = attritionTotal + burnoutTotal;

  return (
    <div style={{ minHeight: "100vh", background: navy, fontFamily: "system-ui,-apple-system,sans-serif", color: "#f8fafc" }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "96px 24px 72px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)", color: gold, fontSize: "11px", fontWeight: "700", padding: "6px 18px", borderRadius: "999px", marginBottom: "32px", letterSpacing: "0.08em" }}>
          ✦ WORKFORCE INTELLIGENCE FOR HR LEADERS &amp; FOUNDERS
        </div>

        <h1 style={{ fontSize: "clamp(38px,6vw,60px)", fontWeight: "800", color: "#f8fafc", margin: "0 0 24px", lineHeight: "1.08", letterSpacing: "-0.03em" }}>
          Know which employees are about to<br />
          <span style={{ color: gold }}>burn out, quit, or break your team.</span><br />
          Before it costs you.
        </h1>

        <p style={{ fontSize: "19px", color: "rgba(255,255,255,0.48)", margin: "0 auto 44px", lineHeight: "1.7", maxWidth: "620px" }}>
          PsychFlo delivers a structured workforce intelligence assessment grounded in 14 organisational psychology frameworks — then turns it into a board-ready Executive Report in 48 hours. No guessing. No exit interviews. No 90-day lag.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          <button onClick={() => router.push("/book-audit")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "18px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}>
            Book Workforce Risk Audit — £750 →
          </button>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#f8fafc", padding: "18px 30px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
            Run free diagnostic first
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
          Audit includes 48-hr Executive Report + 45-min founder debrief · GDPR compliant · No commitment required
        </p>
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "18px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "36px", flexWrap: "wrap" }}>
          {["🔒 GDPR Article 28", "🏛️ ISO 45003:2021", "⚖️ Employment Law Scored", "🧠 14 OB Frameworks", "🛡️ No Individual Surveillance"].map((t, i) => (
            <span key={i} style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── LIVE COST CALCULATOR ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 24px 0" }}>
        <SectionLabel text="WHAT WORKFORCE BLINDNESS COSTS YOUR ORGANISATION" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>

          {/* Inputs */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px" }}>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.6)", margin: "0 0 28px", letterSpacing: "0.04em" }}>YOUR ORGANISATION</p>

            <CalcSlider label="Employees" value={calcSize} min={20} max={500} step={5} format={v => v} onChange={setCalcSize} gold={gold} />
            <CalcSlider label="Average annual salary" value={calcSalary} min={25000} max={120000} step={5000} format={v => `£${(v/1000).toFixed(0)}k`} onChange={setCalcSalary} gold={gold} />
            <CalcSlider label="Annual turnover rate" value={calcTurnover} min={5} max={40} step={1} format={v => `${v}%`} onChange={setCalcTurnover} gold={gold} />

            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: "20px 0 0", lineHeight: "1.6" }}>
              Replacement cost = 60% of salary (Oxford Economics). Burnout drag = 10% of headcount × 40% output loss.
            </p>
          </div>

          {/* Output */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: `${annualExits} exits/year × £${Math.round(replacementCost/1000)}k replacement cost`, value: `£${(attritionTotal/1000).toFixed(0)}k`, sub: "Annual attrition cost", highlight: false },
              { label: `${Math.round(calcSize * 0.1)} burned-out employees × £${Math.round(calcSalary * 0.4 / 1000)}k output loss`, value: `£${(burnoutTotal/1000).toFixed(0)}k`, sub: "Annual burnout drag", highlight: false },
              { label: "Total annual people-risk exposure", value: `£${(grandTotal/1000).toFixed(0)}k`, sub: "Before compliance or tribunal costs", highlight: true },
            ].map((row, i) => (
              <div key={i} style={{ background: row.highlight ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${row.highlight ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: "14px", padding: "20px 24px" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "0 0 6px", lineHeight: "1.5" }}>{row.label}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "32px", fontWeight: "900", color: row.highlight ? gold : "#f8fafc", lineHeight: 1 }}>{row.value}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{row.sub}</span>
                </div>
              </div>
            ))}

            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "14px", padding: "18px 24px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>PsychFlo Intelligence costs <strong style={{ color: gold }}>£797/month</strong></p>
              <p style={{ fontSize: "13px", fontWeight: "700", color: green, margin: 0 }}>
                Break-even: {Math.max(1, Math.round(797 * 12 / replacementCost))} prevented {Math.round(797 * 12 / replacementCost) === 1 ? "exit" : "exits"} per year
              </p>
            </div>

            <button onClick={() => router.push("/roi")}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", padding: "12px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
              Get personalised ROI report →
            </button>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 24px 0" }}>
        <SectionLabel text="THE PROBLEM" />
        <h2 style={{ fontSize: "38px", fontWeight: "800", color: "#f8fafc", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: "1.2" }}>
          Three things happen when you can&apos;t<br />
          <span style={{ color: gold }}>see workforce risk early enough.</span>
        </h2>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: "0 0 44px", lineHeight: "1.8", maxWidth: "580px" }}>
          The signals that precede burnout, attrition, and team breakdown exist weeks before anyone hands in notice. Without a structured way to read them, organisations only find out once the cost is already locked in.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            {
              icon: "📉",
              label: "The expensive exit",
              cost: "£30k–£90k",
              desc: "A senior employee resigns. You had no signal. Recruitment takes 3 months, onboarding takes 6, and the team absorbs the gap for the whole period. The bill always outgrows the agency fee.",
            },
            {
              icon: "🔥",
              label: "The invisible drag",
              cost: "£18k/person/year",
              desc: "The burned-out employee who stays is more expensive than the one who leaves. Billing at full salary. Working at 40–60% capacity. Undetectable without a structured measurement layer.",
            },
            {
              icon: "⚖️",
              label: "The legal exposure",
              cost: "£8k–£50k+",
              desc: "Constructive dismissal. Stress-related duty-of-care claims. A contested tribunal runs £8–50k in legal costs before settlement. One prevented claim pays for years of workforce intelligence.",
            },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "28px" }}>
              <div style={{ fontSize: "30px", marginBottom: "14px" }}>{item.icon}</div>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", margin: "0 0 8px" }}>{item.label.toUpperCase()}</p>
              <p style={{ fontSize: "22px", fontWeight: "900", color: gold, margin: "0 0 10px", lineHeight: 1 }}>{item.cost}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.65" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "14px", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", margin: 0 }}>
            The employee who resigned last quarter gave you <strong style={{ color: "#f8fafc" }}>6–10 weeks of warning.</strong> You had no system reading it.
          </p>
          <button onClick={() => router.push("/diagnostic")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer", flexShrink: 0 }}>
            See your risk profile →
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 24px 0" }}>
        <SectionLabel text="HOW PSYCHFLO WORKS" />
        <h2 style={{ fontSize: "34px", fontWeight: "800", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Diagnosis first. Intelligence second.
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 44px", lineHeight: "1.7", maxWidth: "540px" }}>
          PsychFlo runs your organisation through a 9-dimension workforce risk framework, then turns the output into a board-ready report — with a live debrief from a founder who has read hundreds of these.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "32px" }}>
          {[
            { step: "01", title: "Run the diagnostic", time: "9 questions · 4 min", desc: "Answer 9 structured questions across burnout risk, attrition signals, manager culture, and compliance exposure. Grounded in JD-R, MBI, and Edmondson's safety framework." },
            { step: "02", title: "Receive your report", time: "48-hour delivery", desc: "A scored Executive Report: risk bands across 3 dimensions, financial exposure estimate, benchmark comparison, and a 30-day priority action plan." },
            { step: "03", title: "Debrief with a founder", time: "45-min call", desc: "Not a sales call. A working session on your specific report — what the scores mean for your organisation, and what you should do about it." },
            { step: "04", title: "Optional: ongoing intelligence", time: "From £297/month", desc: "Continue with monthly or weekly risk scoring, manager alerts, compliance evidence packs, and analyst support — scoped to your headcount and needs." },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", position: "relative" }}>
              <div style={{ position: "absolute", top: "16px", right: "16px", fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.04)", padding: "3px 8px", borderRadius: "999px" }}>{item.time}</div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: gold, opacity: 0.3, marginBottom: "14px", lineHeight: 1 }}>{item.step}</div>
              <p style={{ fontSize: "14px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px", paddingRight: "40px" }}>{item.title}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", margin: 0, lineHeight: "1.65" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => router.push("/book-audit")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Book Workforce Risk Audit — £750 →
          </button>
          <button onClick={() => router.push("/how-it-works")}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "16px 24px", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
            See full methodology →
          </button>
        </div>
      </section>

      {/* ── WHAT YOU RECEIVE ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 24px 0" }}>
        <SectionLabel text="WHAT YOU ACTUALLY RECEIVE" />
        <h2 style={{ fontSize: "34px", fontWeight: "800", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Not a dashboard. A delivered intelligence function.
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 40px", lineHeight: "1.7", maxWidth: "560px" }}>
          Every deliverable is produced and sent to you. No logging in to pull reports. No interpreting raw data. Value arrives in your inbox.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { freq: "EVERY WEEK", icon: "📊", title: "Executive Workforce Report", desc: "8–12 pages. Department risk scores, manager friction index, week-on-week trend, one named priority action per flagged team. Formatted for board presentation. Arrives Monday 08:00." },
            { freq: "EVERY MONTH", icon: "📝", title: "Intelligence Briefing", desc: "A 2-page authored narrative — what the month's data showed, what changed, what to watch next month. Written by a human analyst. Designed to be forwarded to leadership without translation." },
            { freq: "EVERY QUARTER", icon: "📋", title: "Board Intelligence Report", desc: "12–16 pages. Quarter-on-quarter risk trends, manager effectiveness summary, ISO 45003 compliance status, 90-day forecast. Board-ready. Includes a compliance evidence pack for insurers." },
            { freq: "ON DEMAND", icon: "🎯", title: "Intervention Briefs", desc: "When PsychFlo flags a high-risk signal, you receive a 1-page Intervention Brief: what to do, how to do it, what to monitor. Turns data into a specific management action within 24 hours." },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px 26px", display: "flex", gap: "18px" }}>
              <div style={{ fontSize: "28px", flexShrink: 0, marginTop: "2px" }}>{item.icon}</div>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "800", color: gold, letterSpacing: "0.08em", margin: "0 0 6px" }}>{item.freq}</p>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.65" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROOF ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 24px 0" }}>
        <SectionLabel text="PROOF — REAL OUTCOMES FROM ACTIVE CLIENTS" />
        <h2 style={{ fontSize: "34px", fontWeight: "800", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          What happens when organisations see early.
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 36px", lineHeight: "1.7" }}>
          All client details anonymised by agreement. Full case studies available under NDA.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {[
            {
              badge: "LOI SIGNED · £30,000 ACV",
              badgeColor: gold, badgeBg: "rgba(201,168,76,0.08)", badgeBorder: "rgba(201,168,76,0.2)",
              org: "Professional Services Firm · 140 employees",
              headline: "Compliance gap caught — potential tribunal claim avoided",
              body: "The Workforce Risk Audit surfaced an unenforceable disciplinary clause that had been in the firm's HR policy for 3 years. Legal confirmed the gap and updated the document before it was challenged. Estimated exposure avoided: £25,000–£50,000.",
              metric: "£25,000–£50,000 in avoided legal exposure",
            },
            {
              badge: "ACTIVE PILOT",
              badgeColor: green, badgeBg: "rgba(16,185,129,0.06)", badgeBorder: "rgba(16,185,129,0.18)",
              org: "Technology SME · 67 employees",
              headline: "Manager reassignment triggered within first scoring cycle",
              body: "The Leadership Friction Index flagged one team's manager as the primary driver of attrition risk. A reporting structure change was implemented within 30 days. No exits followed in the subsequent quarter. 74% improvement in policy comprehension measured pre/post assessment.",
              metric: "4 potential exits retained",
            },
            {
              badge: "ACTIVE PILOT",
              badgeColor: green, badgeBg: "rgba(16,185,129,0.06)", badgeBorder: "rgba(16,185,129,0.18)",
              org: "HR Consultancy · 28 employees",
              headline: "ISO 45003 compliance pack delivered to board within 6 weeks",
              body: "The Board asked for evidence of psychological safety governance. PsychFlo generated a continuous compliance evidence pack mapped to ISO 45003:2021 clauses, delivered as a board-ready PDF. Previously this would have required a £35,000+ consulting engagement.",
              metric: "£35,000 in consulting spend avoided",
            },
          ].map((item, i) => (
            <div key={i} style={{ background: item.badgeBg, border: `1px solid ${item.badgeBorder}`, borderRadius: "16px", padding: "24px 28px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", fontWeight: "800", color: item.badgeColor, background: item.badgeBg, border: `1px solid ${item.badgeBorder}`, padding: "4px 10px", borderRadius: "999px" }}>{item.badge}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>{item.org}</span>
              </div>
              <p style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px", lineHeight: "1.3" }}>{item.headline}</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 14px", lineHeight: "1.7" }}>{item.body}</p>
              <span style={{ display: "inline-flex", fontSize: "11px", fontWeight: "800", color: item.badgeColor, background: "rgba(255,255,255,0.04)", padding: "5px 14px", borderRadius: "999px" }}>{item.metric}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
          {[
            { quote: "PsychFlo surfaced a compliance gap our legal team had missed. The tribunal risk score made it impossible to ignore.", name: "HR Director", role: "Technology SME, 67 employees" },
            { quote: "We replaced three overlapping HR tools and gained the forward-looking intelligence none of them had. The executive report is what our board actually needed.", name: "People & Culture Lead", role: "Professional Services, 140 employees" },
            { quote: "The debrief call alone was worth the audit fee. We left with a specific action plan, not a generic dashboard.", name: "CHRO", role: "HR Consultancy, 28 employees" },
          ].map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px" }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.75", margin: "0 0 16px", fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc", margin: "0 0 3px" }}>{t.name}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", margin: "0 0 4px" }}>{t.role}</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)", margin: 0, fontStyle: "italic" }}>Anonymised at client request</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OFFER POSITIONING ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 24px 0" }}>
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "52px 48px" }}>
          <SectionLabel text="WHY THIS IS THE CHEAP OPTION" />
          <h2 style={{ fontSize: "34px", fontWeight: "800", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: "1.2" }}>
            Your CFO already approves<br />
            <span style={{ color: gold }}>more expensive alternatives that do less.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", margin: "0 0 36px", lineHeight: "1.8", maxWidth: "580px" }}>
            Every organisation at this scale already spends money on people risk. The question is whether that spend is reactive or preventive.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "32px" }}>
            {[
              { label: "Employment tribunal insurance (annual)", cost: "£8,000–£25,000", note: "Reactive. Pays legal fees after the claim is filed." },
              { label: "Retained HR consultancy", cost: "£24,000–£60,000", note: "Generalist. No predictive capability." },
              { label: "Annual engagement survey platform", cost: "£15,000–£40,000", note: "Lagging data. Tells you what already happened." },
              { label: "PsychFlo Intelligence (annual)", cost: "£9,564", note: "Predictive. ROI-positive from the first prevented exit.", highlight: true },
            ].map((row, i) => (
              <div key={i} style={{ background: row.highlight ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.02)", border: `1px solid ${row.highlight ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.06)"}`, borderRadius: "12px", padding: "20px" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", margin: "0 0 6px", lineHeight: "1.5" }}>{row.label}</p>
                <p style={{ fontSize: "20px", fontWeight: "900", color: row.highlight ? gold : "#f8fafc", margin: "0 0 6px", lineHeight: 1 }}>{row.cost}</p>
                <p style={{ fontSize: "11px", color: row.highlight ? gold : "rgba(255,255,255,0.25)", margin: 0, fontWeight: row.highlight ? "700" : "400" }}>{row.note}</p>
              </div>
            ))}
          </div>

          <button onClick={() => router.push("/book-audit")}
            style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
            Book a 45-minute executive demo →
          </button>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 24px 0" }}>
        <SectionLabel text="PRICING — FLAT-RATE · WHOLE ORGANISATION · NO PER-SEAT FEES" />
        <h2 style={{ fontSize: "34px", fontWeight: "800", color: "#f8fafc", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Start with an audit. Scale with intelligence.
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 36px", lineHeight: "1.7" }}>
          As your headcount grows, the value increases. Your cost doesn&apos;t.
        </p>

        {/* Audit — full width */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "18px", padding: "32px 36px", marginBottom: "16px", display: "grid", gridTemplateColumns: "1fr auto", gap: "36px", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "10px", fontWeight: "800", color: gold, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", padding: "4px 12px", borderRadius: "999px", letterSpacing: "0.06em" }}>START HERE</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>One-time · no subscription required</span>
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 8px" }}>Workforce Risk Audit</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 18px", lineHeight: "1.65", maxWidth: "480px" }}>A complete 9-dimension workforce risk assessment, delivered as a board-ready Executive Report in 48 hours. Includes a 45-minute founder debrief call.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
              {["9-dimension risk framework", "Executive Report (scored PDF)", "30-day priority action plan", "45-min founder debrief call"].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: gold, fontSize: "11px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", minWidth: "170px" }}>
            <p style={{ fontSize: "48px", fontWeight: "900", color: gold, lineHeight: 1, margin: "0 0 4px" }}>£750</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", margin: "0 0 18px" }}>one-time</p>
            <button onClick={() => router.push("/book-audit")}
              style={{ width: "100%", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
              Book Audit →
            </button>
          </div>
        </div>

        {/* Subscriptions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { name: "Signal", price: "£297", mo: "/month", size: "20–50 employees", desc: "Monthly risk scores and threshold alerts. Know where the fire is starting.", cta: "Start diagnostic", href: "/diagnostic", highlight: false },
            { name: "Intelligence", price: "£797", mo: "/month", size: "50–150 employees", desc: "Weekly scoring, manager friction index, dysfunction mapping, monthly strategy call.", cta: "Start diagnostic", href: "/diagnostic", highlight: true },
            { name: "Command", price: "£1,997", mo: "/month", size: "150–300 employees", desc: "Predictive attrition modelling, live dashboard, ISO 45003 pack, analyst access.", cta: "Book demo", href: "/book-audit", highlight: false },
            { name: "Executive", price: "£4,997+", mo: "/month", size: "300–500+ employees", desc: "Dedicated analyst, board reports, bespoke risk model, tribunal documentation.", cta: "Contact us", href: "/book-audit", highlight: false },
          ].map((t, i) => (
            <div key={i} style={{ background: t.highlight ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.03)", border: t.highlight ? "2px solid rgba(201,168,76,0.3)" : "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px", position: "relative", display: "flex", flexDirection: "column" }}>
              {t.highlight && <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", fontSize: "10px", fontWeight: "800", padding: "4px 14px", borderRadius: "999px", whiteSpace: "nowrap" }}>MOST POPULAR</div>}
              <p style={{ fontSize: "13px", fontWeight: "800", color: t.highlight ? gold : "rgba(255,255,255,0.6)", margin: "0 0 3px" }}>{t.name}</p>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.22)", margin: "0 0 12px" }}>{t.size}</p>
              <p style={{ fontSize: "26px", fontWeight: "900", color: t.highlight ? gold : "#f8fafc", lineHeight: 1, margin: 0 }}>{t.price}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", margin: "0 0 12px" }}>{t.mo}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", margin: "0 0 18px", lineHeight: "1.6", flex: 1 }}>{t.desc}</p>
              <button onClick={() => router.push(t.href)}
                style={{ width: "100%", background: t.highlight ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.06)", border: t.highlight ? "none" : "1px solid rgba(255,255,255,0.1)", color: t.highlight ? "#0f172a" : "#f8fafc", padding: "11px", borderRadius: "9px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>
                {t.cta}
              </button>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            All subscriptions include a 90-day pilot with no annual commitment and no exit penalty. Annual billing available: 2 months free.
          </p>
          <button onClick={() => router.push("/pricing")}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", padding: "9px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
            Full pricing details →
          </button>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 24px 100px" }}>
        <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "24px", padding: "60px 48px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: gold, letterSpacing: "0.08em", margin: "0 0 20px" }}>
            ✦ EVERY WEEK WITHOUT VISIBILITY IS A WEEK OF SIGNALS YOU CANNOT RECOVER
          </p>
          <h2 style={{ fontSize: "38px", fontWeight: "800", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: "1.15" }}>
            The decision to act is the only one<br />
            <span style={{ color: gold }}>that doesn&apos;t cost you money.</span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.42)", margin: "0 auto 40px", lineHeight: "1.8", maxWidth: "500px" }}>
            Start with the free diagnostic and see your risk profile in 4 minutes. Or go straight to the £750 audit and have a board-ready report in your inbox by Thursday.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
            <button onClick={() => router.push("/book-audit")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "18px 40px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}>
              Book Workforce Risk Audit — £750 →
            </button>
            <button onClick={() => router.push("/diagnostic")}
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#f8fafc", padding: "18px 30px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
              Run free diagnostic first
            </button>
          </div>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "View full pricing", href: "/pricing" },
              { label: "Read methodology", href: "/methodology" },
              { label: "Talk to a human", href: "mailto:info@psychflo.com" },
            ].map((l, i) => (
              <button key={i} onClick={() => l.href.startsWith("mailto") ? (window.location.href = l.href) : router.push(l.href)}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>
                {l.label} →
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 32px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "28px", marginBottom: "28px" }}>
            <div style={{ maxWidth: "240px" }}>
              <p style={{ fontSize: "15px", fontWeight: "800", color: "#f8fafc", margin: "0 0 6px" }}>PsychFlo</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)", margin: "0 0 10px", lineHeight: "1.6" }}>Workforce intelligence for HR leaders and founders who can&apos;t afford to find out too late.</p>
              <a href="mailto:info@psychflo.com" style={{ fontSize: "12px", color: gold, textDecoration: "none" }}>info@psychflo.com</a>
            </div>
            <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
              <FooterCol title="Product" links={[{ label: "How it works", href: "/how-it-works" }, { label: "Pricing", href: "/pricing" }, { label: "Integrations", href: "/integrations" }, { label: "Free diagnostic", href: "/diagnostic" }]} router={router} />
              <FooterCol title="Resources" links={[{ label: "Research", href: "/research" }, { label: "Blog", href: "/blog" }, { label: "ROI calculator", href: "/roi" }, { label: "Methodology", href: "/methodology" }]} router={router} />
              <FooterCol title="Legal" links={[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms-and-conditions" }, { label: "GDPR & DPA", href: "/gdpr" }, { label: "Security", href: "/security" }, { label: "AI Ethics", href: "/ai-ethics" }]} router={router} />
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", margin: 0 }}>© 2026 PsychFlo · Organisational Psychology + AI Engineering</p>
            <div style={{ display: "flex", gap: "20px" }}>
              {[{ label: "About", href: "/about" }, { label: "Investors", href: "/investor" }, { label: "Status", href: "/status" }].map((l, i) => (
                <a key={i} href={l.href} style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)", textDecoration: "none" }}>{l.label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.25)", letterSpacing: "0.09em", margin: "0 0 14px" }}>{text}</p>;
}

function CalcSlider({ label, value, min, max, step, format, onChange, gold }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void; gold: string;
}) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>{label.toUpperCase()}</span>
        <span style={{ fontSize: "16px", fontWeight: "900", color: gold }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: gold, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>{format(min)}</span>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>{format(max)}</span>
      </div>
    </div>
  );
}

function FooterCol({ title, links, router }: { title: string; links: { label: string; href: string }[]; router: ReturnType<typeof useRouter> }) {
  return (
    <div>
      <p style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", margin: "0 0 10px", letterSpacing: "0.06em" }}>{title.toUpperCase()}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {links.map((l, i) => (
          <span key={i} onClick={() => router.push(l.href)}
            style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", cursor: "pointer" }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.32)"; }}>
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
