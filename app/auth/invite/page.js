"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

export default function InvitePage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",background:"#0a0f1e"}}/>}>
      <AcceptInvite />
    </Suspense>
  );
}

function AcceptInvite() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const orgName = searchParams.get("org") || "your organisation";

  const [form, setForm] = useState({ name:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inp = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"13px 16px", color:"#f8fafc", fontSize:"14px", outline:"none", boxSizing:"border-box" };

  async function handleAccept(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/tools/burnout");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (!token) {
    return (
      <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <p style={{color:"rgba(255,255,255,0.4)"}}>Invalid invite link.</p>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <Nav />
      <div style={{maxWidth:"420px", margin:"0 auto", padding:"80px 24px"}}>
        <div style={{textAlign:"center", marginBottom:"32px"}}>
          <div style={{fontSize:"36px", marginBottom:"12px"}}>👋</div>
          <h1 style={{fontSize:"24px", fontWeight:"800", color:"#f8fafc", margin:"0 0 8px"}}>You've been invited</h1>
          <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:0}}>
            <strong style={{color:"#f8fafc"}}>{decodeURIComponent(orgName)}</strong> uses PsychFlo to monitor team wellbeing. Your responses are always anonymous.
          </p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"32px", marginBottom:"16px"}}>
          <form onSubmit={handleAccept}>
            <div style={{marginBottom:"16px"}}>
              <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>YOUR NAME</label>
              <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="First name only is fine" style={inp}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>CREATE A PASSWORD</label>
              <input type="password" required minLength={8} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="8+ characters" style={inp}/>
            </div>
            {error && <p style={{fontSize:"13px", color:"#fca5a5", margin:"0 0 16px", background:"rgba(239,68,68,0.08)", padding:"10px 14px", borderRadius:"8px"}}>{error}</p>}
            <button type="submit" disabled={loading} style={{width:"100%", background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:"pointer", opacity:loading?0.7:1}}>
              {loading ? "Setting up your account..." : "Accept invite & continue →"}
            </button>
          </form>
        </div>

        <div style={{background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"16px"}}>
          {["Your individual scores are never shared with your manager","Managers only see anonymised team averages","You can delete your data at any time"].map((p,i)=>(
            <div key={i} style={{display:"flex", gap:"8px", marginBottom:i<2?"10px":0}}>
              <span style={{color:"#10b981", fontSize:"12px", flexShrink:0}}>✓</span>
              <span style={{fontSize:"12px", color:"rgba(255,255,255,0.4)"}}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
