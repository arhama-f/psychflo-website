"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const PLANS = [
  {
    id: "team",
    name: "Team",
    price: "£100",
    period: "per month",
    desc: "For teams of over 20 people that need weekly wellbeing visibility.",
    features: ["Best for teams with 20+ people", "Team burnout dashboard", "Anonymised risk map", "Manager conversation scripts", "Weekly action plans", "Email reminders", "Slack integration"],
    cta: "Start free 7-day trial",
    highlight: true,
    badge: "Most popular",
    trial: true,
  },
  {
    id: "growth",
    name: "Growth",
    price: "£300",
    period: "per month",
    desc: "For HR teams managing multiple departments.",
    features: ["Everything in Team", "Org-wide risk dashboard", "Department breakdown", "Cost-of-burnout calculator", "HR admin panel", "Custom benchmarks", "Priority support"],
    cta: "Start free 7-day trial",
    highlight: false,
    trial: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "per month",
    desc: "For larger organisations that need deeper support and rollout control.",
    features: ["Everything in Growth", "HRIS integration", "SSO / SAML", "Dedicated customer success", "Custom reporting", "99.99% SLA", "Priority implementation"],
    cta: "Book a demo",
    highlight: false,
    href: "/demo",
    trial: false,
  },
];

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  async function handlePlan(plan) {
    if (plan.href) { router.push(plan.href); return; }
    setLoading(plan.id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.error) alert(data.error);
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(null);
  }

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <Nav />
      <div style={{maxWidth:"960px", margin:"0 auto", padding:"60px 24px"}}>

        <div style={{textAlign:"center", marginBottom:"48px"}}>
          <div style={{display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", color:"#6ee7b7", fontSize:"12px", fontWeight:"700", padding:"6px 16px", borderRadius:"999px", marginBottom:"20px", letterSpacing:"0.05em"}}>
            ✦ FREE 7-DAY TRIAL — NO CARD REQUIRED
          </div>
          <h1 style={{fontSize:"38px", fontWeight:"800", color:"#f8fafc", margin:"0 0 12px", letterSpacing:"-0.03em"}}>
            Simple, transparent pricing
          </h1>
          <p style={{fontSize:"16px", color:"rgba(255,255,255,0.4)", margin:"0 0 8px"}}>
            Try any plan free for 7 days. Cancel anytime. No credit card needed to start.
          </p>
          <p style={{fontSize:"13px", color:"rgba(255,255,255,0.25)"}}>Full access · No commitment · Cancel before day 7 and pay nothing</p>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"48px"}}>
          {PLANS.map(plan=>(
            <div key={plan.id} style={{background:plan.highlight?"rgba(201,168,76,0.07)":"rgba(255,255,255,0.04)", border:plan.highlight?`1px solid rgba(201,168,76,0.3)`:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"24px", position:"relative", display:"flex", flexDirection:"column"}}>
              {plan.badge && (
                <div style={{position:"absolute", top:"-11px", left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", fontSize:"11px", fontWeight:"800", padding:"3px 14px", borderRadius:"999px", whiteSpace:"nowrap"}}>
                  {plan.badge}
                </div>
              )}
              <div style={{marginBottom:"20px"}}>
                <h3 style={{fontSize:"16px", fontWeight:"700", color:"#f8fafc", margin:"0 0 4px"}}>{plan.name}</h3>
                <div style={{display:"flex", alignItems:"baseline", gap:"4px", marginBottom:"6px"}}>
                  <span style={{fontSize:"28px", fontWeight:"800", color:plan.highlight?gold:"#f8fafc"}}>{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span style={{fontSize:"11px", color:"rgba(255,255,255,0.35)"}}>{plan.period}</span>
                  )}
                </div>
                {plan.trial && (
                  <div style={{display:"inline-flex", alignItems:"center", gap:"5px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", color:"#6ee7b7", fontSize:"10px", fontWeight:"700", padding:"3px 8px", borderRadius:"999px", marginBottom:"8px", letterSpacing:"0.04em"}}>
                    ✦ 7 days free · No card required
                  </div>
                )}
                <p style={{fontSize:"12px", color:"rgba(255,255,255,0.4)", margin:0, lineHeight:"1.5"}}>{plan.desc}</p>
              </div>

              <div style={{flex:1, marginBottom:"20px"}}>
                {plan.features.map((f,i)=>(
                  <div key={i} style={{display:"flex", gap:"8px", marginBottom:"8px"}}>
                    <span style={{color:plan.highlight?gold:"#10b981", fontSize:"12px", flexShrink:0, marginTop:"1px"}}>✓</span>
                    <span style={{fontSize:"12px", color:"rgba(255,255,255,0.5)", lineHeight:"1.5"}}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={()=>handlePlan(plan)}
                disabled={loading===plan.id}
                style={{width:"100%", background:plan.highlight?`linear-gradient(135deg,${gold},#f0d080)`:"rgba(255,255,255,0.07)", border:plan.highlight?"none":"1px solid rgba(255,255,255,0.1)", color:plan.highlight?"#0f172a":"rgba(255,255,255,0.7)", padding:"11px", borderRadius:"9px", fontSize:"13px", fontWeight:"700", cursor:"pointer", opacity:loading===plan.id?0.7:1}}>
                {loading===plan.id?"Loading...":plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* SLA guarantee strip */}
        <div style={{background:"rgba(201,168,76,0.04)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:"14px", padding:"20px 28px", marginBottom:"20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px"}}>
          <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
            <span style={{fontSize:"24px"}}>🛡️</span>
            <div>
              <p style={{fontSize:"13px", fontWeight:"700", color:gold, margin:"0 0 2px"}}>99.9% Uptime SLA — Growth & Enterprise plans</p>
              <p style={{fontSize:"12px", color:"rgba(255,255,255,0.4)", margin:0}}>Automatic service credits if we miss the mark. No questions asked.</p>
            </div>
          </div>
          <div style={{display:"flex", gap:"10px", flexShrink:0}}>
            <a href="/sla" style={{background:"rgba(201,168,76,0.12)", border:"1px solid rgba(201,168,76,0.25)", color:gold, padding:"8px 16px", borderRadius:"8px", fontSize:"12px", fontWeight:"700", textDecoration:"none"}}>View SLA →</a>
            <a href="/status" style={{background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", color:"#6ee7b7", padding:"8px 16px", borderRadius:"8px", fontSize:"12px", fontWeight:"700", textDecoration:"none", display:"flex", alignItems:"center", gap:"6px"}}>
              <span style={{width:"6px", height:"6px", borderRadius:"50%", background:"#10b981", display:"inline-block"}}></span>
              Status
            </a>
          </div>
        </div>

        <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px", padding:"32px", textAlign:"center"}}>
          <h3 style={{fontSize:"18px", fontWeight:"700", color:"#f8fafc", margin:"0 0 8px"}}>The ROI is immediate</h3>
          <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:"0 0 24px"}}>For a team of 20+ people on the Team plan at £100/month</p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px"}}>
            {[
              {value:"£3,000", label:"Annual platform cost"},
              {value:"£130k+", label:"Avg burnout cost prevented"},
              {value:"43x", label:"Typical ROI"},
              {value:"8 weeks", label:"To first intervention"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.03)", borderRadius:"10px", padding:"14px"}}>
                <div style={{fontSize:"20px", fontWeight:"800", color:gold, marginBottom:"4px"}}>{s.value}</div>
                <div style={{fontSize:"11px", color:"rgba(255,255,255,0.3)"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
