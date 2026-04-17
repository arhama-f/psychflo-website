"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import { SECTOR_LIST } from "../../lib/benchmarks.js";

const gold = "#c9a84c";

const STEPS = ["Your sector", "Invite your team", "Set reminders", "You're ready"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [sector, setSector] = useState("");
  const [emails, setEmails] = useState("");
  const [reminderDay, setReminderDay] = useState("Mon");
  const [channel, setChannel] = useState("email");
  const [loading, setLoading] = useState(false);
  const [inviteResults, setInviteResults] = useState(null);

  const days = ["Mon","Tue","Wed","Thu","Fri"];

  async function handleInvites() {
    const list = emails.split(/[\n,]+/).map(e=>e.trim()).filter(Boolean);
    if (!list.length) { setStep(2); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/org", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: list, orgId: null, orgName: "Your Organisation" }),
      });
      const data = await res.json();
      setInviteResults(data.results);
    } catch {}
    setLoading(false);
    setStep(2);
  }

  async function handleReminders() {
    setLoading(true);
    try {
      await fetch("/api/schedule/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendDay: reminderDay, channel }),
      });
    } catch {}
    setLoading(false);
    setStep(3);
  }

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <Nav />
      <div style={{maxWidth:"560px", margin:"0 auto", padding:"60px 24px"}}>

        {/* Progress */}
        <div style={{display:"flex", gap:"6px", marginBottom:"40px"}}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{flex:1, textAlign:"center"}}>
              <div style={{height:"3px", borderRadius:"999px", background:step>=i?gold:"rgba(255,255,255,0.08)", marginBottom:"8px"}}/>
              <span style={{fontSize:"10px", color:step>=i?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.2)", fontWeight:"500"}}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step 0 — Sector */}
        {step === 0 && (
          <div>
            <h2 style={{fontSize:"24px", fontWeight:"800", color:"#f8fafc", margin:"0 0 8px"}}>What industry are you in?</h2>
            <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:"0 0 28px", lineHeight:"1.6"}}>This lets us compare your team's scores against industry benchmarks.</p>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"24px"}}>
              {SECTOR_LIST.map(s=>(
                <div key={s} onClick={()=>setSector(s)}
                  style={{padding:"12px 14px", borderRadius:"10px", border:sector===s?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.08)", background:sector===s?"rgba(201,168,76,0.1)":"rgba(255,255,255,0.03)", color:sector===s?gold:"rgba(255,255,255,0.55)", fontSize:"13px", cursor:"pointer", fontWeight:sector===s?"600":"400"}}>
                  {s}
                </div>
              ))}
            </div>
            <button onClick={()=>setStep(1)} disabled={!sector}
              style={{width:"100%", background:sector?`linear-gradient(135deg,${gold},#f0d080)`:"rgba(255,255,255,0.06)", color:sector?"#0f172a":"rgba(255,255,255,0.3)", border:"none", padding:"14px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:sector?"pointer":"not-allowed"}}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 1 — Invite team */}
        {step === 1 && (
          <div>
            <h2 style={{fontSize:"24px", fontWeight:"800", color:"#f8fafc", margin:"0 0 8px"}}>Invite your team</h2>
            <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:"0 0 24px", lineHeight:"1.6"}}>
              Add email addresses — one per line, or comma-separated. Each person gets an invite with full anonymity guarantees.
            </p>
            <textarea
              value={emails}
              onChange={e=>setEmails(e.target.value)}
              placeholder={"sarah@company.com\njames@company.com\naisha@company.com"}
              rows={8}
              style={{width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"14px 16px", color:"#f8fafc", fontSize:"13px", outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"monospace", lineHeight:"1.7"}}
            />
            <div style={{display:"flex", gap:"10px", marginTop:"16px"}}>
              <button onClick={()=>setStep(2)}
                style={{flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", padding:"13px", borderRadius:"10px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                Skip for now
              </button>
              <button onClick={handleInvites} disabled={loading}
                style={{flex:2, background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:"pointer", opacity:loading?0.7:1}}>
                {loading ? "Sending invites..." : `Send ${emails.split(/[\n,]+/).filter(e=>e.trim()).length || 0} invites →`}
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Reminders */}
        {step === 2 && (
          <div>
            <h2 style={{fontSize:"24px", fontWeight:"800", color:"#f8fafc", margin:"0 0 8px"}}>Set weekly reminders</h2>
            <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:"0 0 24px", lineHeight:"1.6"}}>
              Consistent weekly check-ins are what make the trend data meaningful. Pick a day that works for your team.
            </p>
            <div style={{marginBottom:"20px"}}>
              <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"10px"}}>REMINDER DAY</label>
              <div style={{display:"flex", gap:"8px"}}>
                {days.map(d=>(
                  <button key={d} onClick={()=>setReminderDay(d)}
                    style={{flex:1, padding:"10px 0", borderRadius:"9px", border:reminderDay===d?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.08)", background:reminderDay===d?"rgba(201,168,76,0.12)":"rgba(255,255,255,0.04)", color:reminderDay===d?gold:"rgba(255,255,255,0.5)", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:"24px"}}>
              <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"10px"}}>REMIND VIA</label>
              <div style={{display:"flex", gap:"8px"}}>
                {[{value:"email",label:"📧 Email"},{value:"slack",label:"💬 Slack"}].map(c=>(
                  <button key={c.value} onClick={()=>setChannel(c.value)}
                    style={{flex:1, padding:"12px", borderRadius:"9px", border:channel===c.value?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.08)", background:channel===c.value?"rgba(201,168,76,0.12)":"rgba(255,255,255,0.04)", color:channel===c.value?gold:"rgba(255,255,255,0.5)", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                    {c.label}
                  </button>
                ))}
              </div>
              {channel === "slack" && (
                <p style={{fontSize:"12px", color:"rgba(255,255,255,0.3)", margin:"8px 0 0", lineHeight:"1.5"}}>
                  You'll connect Slack in your dashboard settings.
                </p>
              )}
            </div>
            <button onClick={handleReminders} disabled={loading}
              style={{width:"100%", background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"14px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:"pointer", opacity:loading?0.7:1}}>
              {loading ? "Saving..." : "Save & continue →"}
            </button>
          </div>
        )}

        {/* Step 3 — Done */}
        {step === 3 && (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"48px", marginBottom:"16px"}}>🎉</div>
            <h2 style={{fontSize:"26px", fontWeight:"800", color:"#f8fafc", margin:"0 0 12px"}}>You're all set</h2>
            <p style={{fontSize:"15px", color:"rgba(255,255,255,0.45)", margin:"0 0 32px", lineHeight:"1.7"}}>
              Your team will receive invites shortly. The first check-in reminder goes out on <strong style={{color:"#f8fafc"}}>{reminderDay}</strong>. You'll start seeing team trends once 5+ people have completed their first check-in.
            </p>
            <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"14px", padding:"20px", marginBottom:"24px", textAlign:"left"}}>
              {[
                "Invite sent to team ✓",
                `Weekly reminders set for ${reminderDay} ✓`,
                `Industry: ${sector} ✓`,
                "First results appear after 5+ check-ins",
              ].map((p,i)=>(
                <div key={i} style={{display:"flex", gap:"8px", marginBottom:i<3?"10px":0}}>
                  <span style={{color: i<3 ? "#10b981":"rgba(255,255,255,0.3)", fontSize:"13px"}}>{i<3?"✓":"○"}</span>
                  <span style={{fontSize:"13px", color:i<3?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.3)"}}>{p}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>router.push("/dashboard")}
              style={{width:"100%", background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"14px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:"pointer"}}>
              Go to dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
