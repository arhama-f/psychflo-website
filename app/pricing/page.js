"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    period: "forever",
    desc: "For individuals tracking their own burnout.",
    features: ["Personal burnout score", "3-dimension MBI analysis", "Weekly check-in", "Recovery recommendations", "Mood tracker"],
    cta: "Get started",
    href: "/auth/signup",
    highlight: false,
  },
  {
    id: "team",
    name: "Team",
    price: "£5",
    period: "per user / month",
    desc: "For managers who want to protect their team.",
    features: ["Everything in Free", "Team burnout dashboard", "Anonymised risk map", "Manager conversation scripts", "Weekly action plans", "Email reminders", "Slack integration", "14-day free trial"],
    cta: "Start free trial",
    highlight: true,
    badge: "Most popular",
  },
  {
    id: "growth",
    name: "Growth",
    price: "£8",
    period: "per user / month",
    desc: "For HR teams managing multiple departments.",
    features: ["Everything in Team", "Org-wide risk dashboard", "Department breakdown", "Cost-of-burnout calculator", "HR admin panel", "Custom benchmarks", "Priority support"],
    cta: "Start free trial",
    highlight: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "annual contract",
    desc: "For organisations 500+ people.",
    features: ["Everything in Growth", "HRIS integration (BambooHR, Workday)", "SSO / SAML", "SOC 2 compliance", "Dedicated CSM", "Custom reporting", "SLA guarantee"],
    cta: "Talk to sales",
    href: "mailto:sales@psychflo.com",
    highlight: false,
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
          <h1 style={{fontSize:"38px", fontWeight:"800", color:"#f8fafc", margin:"0 0 12px", letterSpacing:"-0.03em"}}>
            Simple, transparent pricing
          </h1>
          <p style={{fontSize:"16px", color:"rgba(255,255,255,0.4)", margin:"0 0 8px"}}>
            Start free. Upgrade when your team is ready.
          </p>
          <p style={{fontSize:"13px", color:"rgba(255,255,255,0.25)"}}>14-day free trial · No credit card required · Cancel any time</p>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"48px"}}>
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
                  {plan.period !== "forever" && plan.price !== "Custom" && (
                    <span style={{fontSize:"11px", color:"rgba(255,255,255,0.35)"}}>{plan.period}</span>
                  )}
                  {plan.period === "forever" && <span style={{fontSize:"11px", color:"rgba(255,255,255,0.35)"}}>forever</span>}
                </div>
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

        <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px", padding:"32px", textAlign:"center"}}>
          <h3 style={{fontSize:"18px", fontWeight:"700", color:"#f8fafc", margin:"0 0 8px"}}>The ROI is immediate</h3>
          <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:"0 0 24px"}}>For a 50-person team at £5/user/month</p>
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
