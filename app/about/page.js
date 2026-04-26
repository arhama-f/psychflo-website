"use client";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

export default function About() {
  const router = useRouter();
  const gold = "#c9a84c";

  const values = [
    { icon: "🧠", title: "Psychology first", desc: "Every feature is grounded in peer-reviewed organisational psychology research. We don't build tools that sound good — we build tools that work." },
    { icon: "📊", title: "Evidence over intuition", desc: "Our models are trained on real data. Our recommendations cite real research. We never give you an insight we cannot back up." },
    { icon: "🛡️", title: "Employee dignity", desc: "We build tools that help organisations treat people better — not tools that surveil or score employees without their knowledge or consent." },
    { icon: "🎯", title: "Measurable impact", desc: "Every tool we build has a measurable outcome — tribunal cases prevented, retention improved, comprehension lifted. If we cannot measure it, we do not ship it." },
  ];

  const team = [
    { initials: "PF", name: "PsychFlo Founder", role: "Psychology + AI Engineering", bio: "Background in organisational psychology, software engineering, HR operations, data science, and product design. Built PsychFlo to bridge the gap between people science and practical HR tooling." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "60px 24px" }}>

        <div style={{ marginBottom: "56px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "18px", letterSpacing: "0.06em" }}>OUR STORY</div>
          <h1 style={{ fontSize: "38px", fontWeight: "800", color: "#f8fafc", margin: "0 0 20px", letterSpacing: "-0.02em", lineHeight: "1.2" }}>Built by a psychologist<br />who learned to code</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", margin: "0 0 16px", lineHeight: "1.8" }}>PsychFlo was born from a simple observation: the gap between what organisational psychology research tells us works and what HR teams actually have access to is enormous.</p>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", margin: "0 0 16px", lineHeight: "1.8" }}>Large consultancies charge £20,000 for a psychological safety assessment. Employment lawyers charge £500 an hour to review a policy. Leadership coaches charge £300 per session. All of this knowledge exists — it is just locked behind price points that only FTSE 100 companies can access.</p>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: "1.8" }}>PsychFlo exists to democratise that access. Every tool we build takes something that was previously only available to organisations with large budgets and makes it available to any HR team in the world.</p>
        </div>

        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#f8fafc", margin: "0 0 28px", letterSpacing: "-0.01em" }}>What we believe</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {values.map((v, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px" }}>
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>{v.icon}</div>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", margin: "0 0 6px" }}>{v.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.6" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#f8fafc", margin: "0 0 28px", letterSpacing: "-0.01em" }}>The team</h2>
          {team.map((member, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `linear-gradient(135deg,${gold},#f0d080)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "800", color: "#0f172a", flexShrink: 0 }}>{member.initials}</div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", margin: "0 0 3px" }}>{member.name}</h3>
                <p style={{ fontSize: "13px", color: gold, margin: "0 0 10px" }}>{member.role}</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.6" }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0 0 10px" }}>Want to work with us?</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px" }}>We're always looking for psychologists, engineers, and HR practitioners who want to build the future of people science.</p>
          <button onClick={() => router.push("/demo")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
            Get in touch
          </button>
        </div>
      </div>
    </div>
  );
}
