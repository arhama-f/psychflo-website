"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{minHeight:"100vh",background:"#0a0f1e"}}/>}>
      <Dashboard />
    </Suspense>
  );
}

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded") === "true";
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then(r => r.json())
      .then(d => { setTeamData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const Bar = ({value, color="#c9a84c", height=6}) => (
    <div style={{background:"rgba(255,255,255,0.07)", borderRadius:"999px", height, overflow:"hidden"}}>
      <div style={{width:`${Math.min(value,100)}%`, height:"100%", background:color, borderRadius:"999px"}}/>
    </div>
  );

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <Nav />
      <div style={{maxWidth:"860px", margin:"0 auto", padding:"48px 24px"}}>

        {upgraded && (
          <div style={{background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:"12px", padding:"14px 20px", marginBottom:"24px", display:"flex", alignItems:"center", gap:"10px"}}>
            <span style={{fontSize:"18px"}}>🎉</span>
            <span style={{fontSize:"14px", color:"#6ee7b7", fontWeight:"600"}}>Plan upgraded successfully. Team features are now unlocked.</span>
          </div>
        )}

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"28px"}}>
          <div>
            <h1 style={{fontSize:"24px", fontWeight:"800", color:"#f8fafc", margin:"0 0 4px"}}>Manager Dashboard</h1>
            <p style={{fontSize:"13px", color:"rgba(255,255,255,0.35)", margin:0}}>Team wellbeing overview · Updated weekly</p>
          </div>
          <button onClick={()=>router.push("/tools/burnout")}
            style={{background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"10px 20px", borderRadius:"9px", fontSize:"13px", fontWeight:"800", cursor:"pointer"}}>
            Take check-in →
          </button>
        </div>

        {loading ? (
          <div style={{textAlign:"center", padding:"60px", color:"rgba(255,255,255,0.3)"}}>Loading team data...</div>
        ) : teamData?.suppressed ? (
          <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"48px", textAlign:"center"}}>
            <div style={{fontSize:"36px", marginBottom:"16px"}}>⏳</div>
            <h3 style={{fontSize:"18px", fontWeight:"700", color:"#f8fafc", margin:"0 0 8px"}}>Waiting for more responses</h3>
            <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:"0 0 8px", lineHeight:"1.6"}}>{teamData.reason}</p>
            <div style={{fontSize:"13px", color:"rgba(255,255,255,0.25)"}}>{teamData.responseCount} / 5 responses received this week</div>
            <div style={{marginTop:"20px", background:"rgba(255,255,255,0.03)", borderRadius:"10px", padding:"12px", display:"inline-block"}}>
              <div style={{width:"200px", background:"rgba(255,255,255,0.07)", borderRadius:"999px", height:"6px", overflow:"hidden"}}>
                <div style={{width:`${(teamData.responseCount/5)*100}%`, height:"100%", background:gold, borderRadius:"999px"}}/>
              </div>
            </div>
            <div style={{marginTop:"20px"}}>
              <button onClick={()=>router.push("/onboarding")}
                style={{background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"11px 24px", borderRadius:"9px", fontSize:"13px", fontWeight:"800", cursor:"pointer"}}>
                Invite more team members →
              </button>
            </div>
          </div>
        ) : teamData ? (
          <div>
            {/* Stats row */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px", marginBottom:"16px"}}>
              {[
                {label:"Team risk score", value:`${teamData.overallRisk}/100`, color:teamData.color},
                {label:"High risk", value:teamData.atHighRisk, color:"#ef4444"},
                {label:"Moderate risk", value:teamData.atModerateRisk, color:"#f59e0b"},
                {label:"Low risk", value:teamData.atLowRisk, color:"#10b981"},
              ].map((s,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"16px", textAlign:"center"}}>
                  <div style={{fontSize:"24px", fontWeight:"700", color:s.color, marginBottom:"4px"}}>{s.value}</div>
                  <div style={{fontSize:"11px", color:"rgba(255,255,255,0.35)"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Trend + stressors */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"16px"}}>
              <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"20px"}}>
                <div style={{fontSize:"11px", fontWeight:"600", color:"rgba(255,255,255,0.35)", letterSpacing:"0.07em", marginBottom:"14px"}}>6-WEEK TEAM TREND</div>
                <div style={{display:"flex", gap:"6px", alignItems:"flex-end", height:"70px", marginBottom:"8px"}}>
                  {(teamData.weeklyTrend||[]).map((s,i,arr)=>(
                    <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px"}}>
                      <div style={{width:"100%", background:i===arr.length-1?teamData.color:"rgba(255,255,255,0.15)", borderRadius:"3px 3px 0 0", height:`${s*1.1}px`}}/>
                      <span style={{fontSize:"9px", color:"rgba(255,255,255,0.3)"}}>W{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"20px"}}>
                <div style={{fontSize:"11px", fontWeight:"600", color:"rgba(255,255,255,0.35)", letterSpacing:"0.07em", marginBottom:"14px"}}>TOP STRESSORS</div>
                {(teamData.topTeamStressors||[]).slice(0,4).map((s,i)=>(
                  <div key={i} style={{marginBottom:"10px"}}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}>
                      <span style={{fontSize:"12px", color:"rgba(255,255,255,0.5)"}}>{s.stressor}</span>
                      <span style={{fontSize:"11px", color:s.percentage>70?"#ef4444":s.percentage>50?"#f59e0b":"#10b981", fontWeight:"600"}}>{s.percentage}%</span>
                    </div>
                    <Bar value={s.percentage} color={s.percentage>70?"#ef4444":s.percentage>50?"#f59e0b":"#10b981"} height={5}/>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div style={{display:"flex", gap:"10px"}}>
              <button onClick={()=>router.push("/tools/burnout?view=manager")}
                style={{flex:1, background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"13px", borderRadius:"10px", fontSize:"13px", fontWeight:"800", cursor:"pointer"}}>
                Full team dashboard →
              </button>
              <button onClick={()=>router.push("/onboarding")}
                style={{flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", padding:"13px", borderRadius:"10px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                Invite more people
              </button>
            </div>
          </div>
        ) : (
          <div style={{textAlign:"center", padding:"60px"}}>
            <p style={{color:"rgba(255,255,255,0.3)", fontSize:"14px"}}>No data yet. Take the first check-in to get started.</p>
            <button onClick={()=>router.push("/tools/burnout")} style={{marginTop:"16px", background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"12px 28px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:"pointer"}}>
              Take check-in →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
