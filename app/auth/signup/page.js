"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email:"", password:"", name:"", orgName:"", role:"manager", size:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inp = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"13px 16px", color:"#f8fafc", fontSize:"14px", outline:"none", boxSizing:"border-box" };
  const set = (k) => (e) => setForm(f=>({...f,[k]:e.target.value}));

  async function handleSubmit(e) {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/onboarding");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  const sizes = ["1–10","11–50","51–200","201–500","500+"];
  const roles = [
    { value:"manager", label:"👥 Manager", desc:"I want to monitor my team's wellbeing" },
    { value:"hr", label:"📊 HR / People", desc:"I manage wellbeing across the organisation" },
    { value:"employee", label:"👤 Employee", desc:"I want to track my own burnout score" },
  ];

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <Nav />
      <div style={{maxWidth:"460px", margin:"0 auto", padding:"60px 24px"}}>
        <div style={{display:"flex", gap:"8px", marginBottom:"32px"}}>
          {[1,2].map(n=>(
            <div key={n} style={{flex:1, height:"3px", borderRadius:"999px", background:step>=n?gold:"rgba(255,255,255,0.08)"}}/>
          ))}
        </div>

        <div style={{textAlign:"center", marginBottom:"28px"}}>
          <h1 style={{fontSize:"24px", fontWeight:"800", color:"#f8fafc", margin:"0 0 8px"}}>
            {step===1 ? "Start your free trial" : "Tell us about your organisation"}
          </h1>
          <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:0}}>
            {step===1 ? "7 days free · No credit card required" : "Helps us personalise your dashboard"}
          </p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"32px"}}>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div style={{marginBottom:"16px"}}>
                  <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>FULL NAME</label>
                  <input required value={form.name} onChange={set("name")} placeholder="Sarah Mitchell" style={inp}/>
                </div>
                <div style={{marginBottom:"16px"}}>
                  <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>WORK EMAIL</label>
                  <input type="email" required value={form.email} onChange={set("email")} placeholder="sarah@company.com" style={inp}/>
                </div>
                <div style={{marginBottom:"20px"}}>
                  <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>PASSWORD</label>
                  <input type="password" required minLength={8} value={form.password} onChange={set("password")} placeholder="8+ characters" style={inp}/>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{marginBottom:"16px"}}>
                  <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>I AM A...</label>
                  <div style={{display:"flex", flexDirection:"column", gap:"8px", marginBottom:"4px"}}>
                    {roles.map(r=>(
                      <div key={r.value} onClick={()=>setForm(f=>({...f,role:r.value}))}
                        style={{display:"flex", gap:"12px", alignItems:"center", padding:"12px 14px", borderRadius:"10px", border:form.role===r.value?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.08)", background:form.role===r.value?"rgba(201,168,76,0.08)":"rgba(255,255,255,0.03)", cursor:"pointer"}}>
                        <span style={{fontSize:"16px"}}>{r.label.split(" ")[0]}</span>
                        <div>
                          <div style={{fontSize:"13px", fontWeight:"600", color:form.role===r.value?gold:"#f8fafc"}}>{r.label.split(" ").slice(1).join(" ")}</div>
                          <div style={{fontSize:"11px", color:"rgba(255,255,255,0.35)"}}>{r.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:"16px"}}>
                  <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>ORGANISATION NAME</label>
                  <input required value={form.orgName} onChange={set("orgName")} placeholder="Acme Corp" style={inp}/>
                </div>
                <div style={{marginBottom:"20px"}}>
                  <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>COMPANY SIZE</label>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"6px"}}>
                    {sizes.map(s=>(
                      <button key={s} type="button" onClick={()=>setForm(f=>({...f,size:s}))}
                        style={{padding:"8px 4px", borderRadius:"8px", border:form.size===s?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.08)", background:form.size===s?"rgba(201,168,76,0.1)":"rgba(255,255,255,0.03)", color:form.size===s?gold:"rgba(255,255,255,0.5)", fontSize:"11px", fontWeight:"600", cursor:"pointer"}}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {error && <p style={{fontSize:"13px", color:"#fca5a5", margin:"0 0 16px", background:"rgba(239,68,68,0.08)", padding:"10px 14px", borderRadius:"8px"}}>{error}</p>}

            <button type="submit" disabled={loading} style={{width:"100%", background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:"pointer", opacity:loading?0.7:1}}>
              {loading ? "Creating account..." : step===1 ? "Continue →" : "Create account"}
            </button>
          </form>
        </div>

        <p style={{textAlign:"center", marginTop:"20px", fontSize:"13px", color:"rgba(255,255,255,0.3)"}}>
          Already have an account?{" "}
          <span onClick={()=>router.push("/auth/login")} style={{color:gold, cursor:"pointer", fontWeight:"600"}}>Sign in</span>
        </p>
        <p style={{textAlign:"center", marginTop:"8px", fontSize:"11px", color:"rgba(255,255,255,0.2)"}}>
          By signing up you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
