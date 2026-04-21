"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const gold = "#c9a84c";
const TEAM_FEATURES = ["team", "riskmap", "script", "actions", "orgview"];

async function checkSubscription() {
  try {
    const res = await fetch("/api/subscription");
    if (!res.ok) return false;
    const data = await res.json();
    return data.plan && data.plan !== "free";
  } catch {
    return false;
  }
}

export default function BurnoutGate({ children, tab }) {
  const router = useRouter();
  const [isPaid, setIsPaid] = useState(null); // null = loading

  useEffect(() => {
    if (!TEAM_FEATURES.includes(tab)) { setIsPaid(true); return; }
    checkSubscription().then(setIsPaid);
  }, [tab]);

  if (!TEAM_FEATURES.includes(tab)) return children;
  if (isPaid === null) return (
    <div style={{padding:"40px", textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:"13px"}}>
      Checking access...
    </div>
  );
  if (isPaid) return children;

  return (
    <div style={{background:"rgba(201,168,76,0.05)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"16px", padding:"48px 32px", textAlign:"center"}}>
      <div style={{fontSize:"36px", marginBottom:"16px"}}>🔒</div>
      <h2 style={{fontSize:"20px", fontWeight:"700", color:"#f8fafc", margin:"0 0 10px"}}>
        Team features require a paid plan
      </h2>
      <p style={{fontSize:"14px", color:"rgba(255,255,255,0.45)", margin:"0 0 6px", lineHeight:"1.7", maxWidth:"420px", marginLeft:"auto", marginRight:"auto"}}>
        Manager dashboard, conversation scripts, org-wide risk map, and weekly actions are included on the Team plan.
      </p>
      <p style={{fontSize:"13px", color:"rgba(255,255,255,0.25)", margin:"0 0 28px"}}>
        Burnout Early Warning is £60/month. Free users only get a brief one-page summary.
      </p>
      <div style={{display:"flex", gap:"10px", justifyContent:"center"}}>
        <button onClick={()=>router.push("/pricing")}
          style={{background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"13px 28px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:"pointer"}}>
          See pricing →
        </button>
        <button onClick={()=>router.push("/auth/login")}
          style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", padding:"13px 20px", borderRadius:"10px", fontSize:"14px", fontWeight:"600", cursor:"pointer"}}>
          Sign in
        </button>
      </div>
    </div>
  );
}
