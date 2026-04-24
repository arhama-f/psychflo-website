"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

const phases = [
  { name: "Shock & denial", icon: "🌫️", desc: "It doesn't feel real. This is normal — your mind is protecting you from being overwhelmed." },
  { name: "Pain & guilt", icon: "💔", desc: "The loss becomes real. Feelings of guilt ('I should have...') are common and don't reflect what's true." },
  { name: "Anger & bargaining", icon: "⚡", desc: "Anger at the loss, at yourself, at others. You may find yourself making deals to undo what happened." },
  { name: "Depression", icon: "🌧️", desc: "A deep sadness settles in. This is not weakness — it's the appropriate response to a real loss." },
  { name: "Acceptance", icon: "🌱", desc: "Not forgetting. Not 'getting over it.' Learning to carry the loss alongside a life that continues." },
];

const resources = [
  { label: "Cruse Bereavement Support", url: "#", desc: "Free bereavement counselling and support groups across the UK" },
  { label: "Mind — Grief and loss", url: "#", desc: "Evidence-based guidance on processing grief" },
  { label: "Samaritans (24/7)", url: "#", desc: "If you need to talk to someone right now — 116 123, free and confidential" },
];

const prompts = [
  "What do you want to say to them that you didn't get to say?",
  "What's the hardest part of today?",
  "What do you miss most right now?",
  "What are you angry about? You don't have to be fair.",
  "What would they want for you?",
  "What small thing helped today, even a little?",
];

export default function GriefTool() {
  const router = useRouter();
  const [phase, setPhase] = useState(null);
  const [promptIdx, setPromptIdx] = useState(0);
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: gold, fontSize: "11px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "16px", letterSpacing: "0.06em" }}>💔 GRIEF & LOSS COMPANION</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-0.02em" }}>You don't have to go through this alone</h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", margin: "0 0 12px", lineHeight: "1.7" }}>Evidence-based bereavement support, when you need it. Grounded in attachment theory and grief research.</p>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 16px" }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.6" }}>This tool is a support companion, not a substitute for therapy. If you're in crisis, please contact <strong style={{ color: gold }}>Samaritans on 116 123</strong> (free, 24/7).</p>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>WHERE ARE YOU RIGHT NOW?</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "16px", lineHeight: "1.6" }}>Grief doesn't move in a straight line. You might recognise yourself in one of these, or in several at once. There's no right answer.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
            {phases.map((p, i) => (
              <button key={i} onClick={() => setPhase(phase === i ? null : i)}
                style={{ background: phase === i ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.04)", border: phase === i ? `1px solid rgba(201,168,76,0.3)` : "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 8px", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>{p.icon}</div>
                <div style={{ fontSize: "10px", fontWeight: "600", color: phase === i ? gold : "rgba(255,255,255,0.4)", lineHeight: "1.3" }}>{p.name}</div>
              </button>
            ))}
          </div>
          {phase !== null && (
            <div style={{ marginTop: "14px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "10px", padding: "14px 16px" }}>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.7" }}>{phases[phase].desc}</p>
            </div>
          )}
        </div>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>A SPACE TO WRITE</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "14px", lineHeight: "1.6" }}>Writing about grief has measurable positive effects on processing and healing. There are no rules here. Write as much or as little as you need.</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
            {prompts.map((p, i) => (
              <button key={i} onClick={() => setPromptIdx(i)}
                style={{ background: promptIdx === i ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)", border: promptIdx === i ? "1px solid rgba(201,168,76,0.25)" : "1px solid rgba(255,255,255,0.07)", color: promptIdx === i ? gold : "rgba(255,255,255,0.35)", padding: "5px 12px", borderRadius: "999px", fontSize: "11px", cursor: "pointer", fontWeight: "500" }}>
                Prompt {i + 1}
              </button>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "14px 16px", marginBottom: "12px" }}>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: 0, fontStyle: "italic" }}>{prompts[promptIdx]}</p>
          </div>
          {!saved ? (
            <>
              <textarea value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="Write here — this is private and only visible to you..."
                style={{ width: "100%", minHeight: "160px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px", color: "#f8fafc", fontSize: "14px", lineHeight: "1.8", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <button onClick={() => { if (entry.trim()) setSaved(true); }}
                style={{ marginTop: "10px", background: entry.trim() ? `linear-gradient(135deg,${gold},#f0d080)` : "rgba(255,255,255,0.06)", color: entry.trim() ? "#0f172a" : "rgba(255,255,255,0.3)", border: "none", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: entry.trim() ? "pointer" : "default" }}>
                Save this entry
              </button>
            </>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "10px", padding: "18px" }}>
              <p style={{ color: "#6ee7b7", fontSize: "14px", fontWeight: "600", margin: "0 0 6px" }}>Saved.</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 14px" }}>Writing about loss is one of the most evidence-supported ways to process grief. You did something good today.</p>
              <button onClick={() => { setSaved(false); setEntry(""); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>Write again</button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "14px", letterSpacing: "0.06em" }}>PROFESSIONAL SUPPORT</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {resources.map((r, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", margin: "0 0 3px" }}>{r.label}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{r.desc}</p>
                </div>
                <span style={{ fontSize: "12px", color: gold, fontWeight: "600", flexShrink: 0 }}>Visit →</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)", marginBottom: "10px", letterSpacing: "0.06em" }}>FOR HR AND PEOPLE TEAMS</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 14px", lineHeight: "1.6" }}>PsychFlo's bereavement module gives your employees a private, supported space to process loss — without needing to disclose to their manager. Available on all paid plans.</p>
          <button onClick={() => router.push("/pricing")} style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "11px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            Add to your team plan
          </button>
        </div>
      </div>
    </div>
  );
}
