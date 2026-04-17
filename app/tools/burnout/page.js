"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "../../components/Nav";
import BurnoutGate from "../../components/BurnoutGate";

export default function BurnoutToolPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:"100vh", background:"#0a0f1e", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <div style={{color:"rgba(255,255,255,0.3)", fontSize:"14px"}}>Loading...</div>
      </div>
    }>
      <BurnoutTool />
    </Suspense>
  );
}

function BurnoutTool() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gold = "#c9a84c";
  const [view, setView] = useState("landing");
  const [role, setRole] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [managerTab, setManagerTab] = useState("overview");
  const [consentGiven, setConsentGiven] = useState(false);
  const [isPaid] = useState(false); // TODO: replace with real Stripe subscription check
  const employeeId = searchParams.get("employeeId") || null;

  const card = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"24px", marginBottom:"16px" };
  const lbl = { fontSize:"11px", fontWeight:"600", color:"rgba(255,255,255,0.35)", letterSpacing:"0.07em", marginBottom:"14px", display:"block" };
  const fmt = (n) => "£" + Number(n).toLocaleString();

  const Bar = ({value, color="#c9a84c", height=6}) => (
    <div style={{background:"rgba(255,255,255,0.07)", borderRadius:"999px", height, overflow:"hidden"}}>
      <div style={{width:`${Math.min(value,100)}%`, height:"100%", background:color, borderRadius:"999px"}}/>
    </div>
  );

  const questions = [
    {
      id: "exhaustion1",
      dimension: "Exhaustion",
      text: "How often do you feel emotionally drained by your work?",
      options: ["Never", "A few times a year", "Monthly", "A few times a week", "Every day"]
    },
    {
      id: "exhaustion2",
      dimension: "Exhaustion",
      text: "How often do you feel used up at the end of the working day?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      id: "exhaustion3",
      dimension: "Exhaustion",
      text: "How often do you feel fatigued when you get up to face another day at work?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      id: "cynicism1",
      dimension: "Cynicism",
      text: "How often do you feel less interested in your work than you used to be?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      id: "cynicism2",
      dimension: "Cynicism",
      text: "How often do you doubt the significance of your work?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
    },
    {
      id: "stressors",
      dimension: "Context",
      text: "Which of these are currently affecting you at work?",
      multiSelect: true,
      options: ["Meeting overload", "Unclear priorities", "Lack of recognition", "Poor work-life balance", "Insufficient autonomy", "Difficult relationships", "Excessive workload", "Lack of support"]
    },
    {
      id: "efficacy1",
      dimension: "Efficacy",
      text: "How often do you feel you are making an effective contribution to your organisation?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"]
    },
    {
      id: "efficacy2",
      dimension: "Efficacy",
      text: "In your opinion, how good are you at your job right now?",
      options: ["Excellent", "Good", "Adequate", "Below my usual standard", "Struggling significantly"]
    },
    {
      id: "support",
      dimension: "Context",
      text: "How supported do you feel by your manager right now?",
      options: ["Very supported", "Somewhat supported", "Neutral", "Somewhat unsupported", "Very unsupported"]
    },
    {
      id: "timeline",
      dimension: "Context",
      text: "How long have you been feeling this way?",
      options: ["Just this week", "2–4 weeks", "1–3 months", "3–6 months", "More than 6 months"]
    }
  ];

  const handleAnswer = (questionId, value, multiSelect) => {
    if (multiSelect) {
      const current = answers[questionId] || [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      setAnswers({ ...answers, [questionId]: updated });
    } else {
      setAnswers({ ...answers, [questionId]: value });
      setTimeout(() => {
        if (step < questions.length - 1) setStep(step + 1);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    if (!consentGiven) {
      alert("Please give consent before submitting.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/burnout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: answers, weekNumber: 1, consentGiven: true, employeeId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Fetch team data separately if manager
      if (role === "manager") {
        try {
          const teamRes = await fetch("/api/team");
          const teamData = await teamRes.json();
          data.team = teamData;
        } catch { /* team data optional */ }
      }

      setResult(data);
      setView("results");
      setActiveTab(role === "manager" ? "team" : "personal");
    } catch (e) {
      alert(e.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const progress = Math.round(((step + 1) / questions.length) * 100);
  const currentQ = questions[step];

  if (view === "landing") return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <Nav />
      <div style={{maxWidth:"820px", margin:"0 auto", padding:"60px 24px"}}>

        <div style={{textAlign:"center", marginBottom:"56px"}}>
          <div style={{display:"inline-flex", gap:"6px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#fca5a5", fontSize:"11px", fontWeight:"700", padding:"5px 14px", borderRadius:"999px", marginBottom:"18px", letterSpacing:"0.06em"}}>
            MASLACH BURNOUT INVENTORY · EVIDENCE-BASED
          </div>
          <h1 style={{fontSize:"42px", fontWeight:"800", color:"#f8fafc", margin:"0 0 16px", lineHeight:"1.15", letterSpacing:"-0.03em"}}>
            Burnout Early Warning<br/><span style={{color:gold}}>System</span>
          </h1>
          <p style={{fontSize:"16px", color:"rgba(255,255,255,0.45)", margin:"0 0 16px", lineHeight:"1.7", maxWidth:"560px", marginLeft:"auto", marginRight:"auto"}}>
            The only burnout platform grounded in Maslach's clinically validated 3-dimension model. Predicts burnout 6–8 weeks before it peaks. Gives managers specific conversation scripts, not just scores.
          </p>
          <p style={{fontSize:"13px", color:"rgba(255,255,255,0.25)", margin:"0 0 12px"}}>Fully anonymous · Employees control their data · GDPR compliant</p>
          <div style={{display:"inline-flex", gap:"6px", alignItems:"center", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:"999px", padding:"5px 14px", marginBottom:"32px"}}>
            <span style={{color:"#10b981", fontSize:"13px", fontWeight:"700"}}>No account needed · Free · 3 minutes</span>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", maxWidth:"580px", margin:"0 auto 40px"}}>
            <div onClick={()=>{setRole("employee"); setView("consent");}}
              style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"16px", padding:"28px", cursor:"pointer", transition:"all 0.15s", textAlign:"left"}}>
              <div style={{fontSize:"32px", marginBottom:"12px"}}>👤</div>
              <h3 style={{fontSize:"16px", fontWeight:"700", color:"#f8fafc", margin:"0 0 6px"}}>I am an employee</h3>
              <p style={{fontSize:"13px", color:"rgba(255,255,255,0.4)", margin:"0 0 16px", lineHeight:"1.5"}}>Take the weekly check-in. See your personal burnout score and recovery recommendations.</p>
              <span style={{fontSize:"12px", color:"#10b981", fontWeight:"600"}}>10 questions · 3 minutes →</span>
            </div>
            <div onClick={()=>{setRole("manager"); setView("consent");}}
              style={{background:"rgba(201,168,76,0.06)", border:`1px solid rgba(201,168,76,0.2)`, borderRadius:"16px", padding:"28px", cursor:"pointer", transition:"all 0.15s", textAlign:"left"}}>
              <div style={{fontSize:"32px", marginBottom:"12px"}}>👥</div>
              <h3 style={{fontSize:"16px", fontWeight:"700", color:"#f8fafc", margin:"0 0 6px"}}>I am a manager or HR</h3>
              <p style={{fontSize:"13px", color:"rgba(255,255,255,0.4)", margin:"0 0 16px", lineHeight:"1.5"}}>View team burnout dashboard, intervention scripts, and organisation-wide risk analysis.</p>
              <span style={{fontSize:"12px", color:gold, fontWeight:"600"}}>View team dashboard →</span>
            </div>
          </div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginBottom:"48px"}}>
          {[
            {icon:"🧬", title:"Maslach framework", desc:"Built on the world's most validated burnout model — 3 dimensions, clinically proven predictive accuracy"},
            {icon:"⏱️", title:"6–8 week early warning", desc:"ML trend analysis predicts burnout peak weeks before it happens — when intervention is still effective"},
            {icon:"💬", title:"Manager scripts", desc:"Not just scores — specific conversation openers, questions to ask, and what not to say"},
            {icon:"🔒", title:"Employee-controlled data", desc:"Employees see their own scores first. They choose what their manager sees. No surveillance."},
            {icon:"📊", title:"Org-wide risk map", desc:"HR sees anonymous department-level trends. Never individual scores without consent."},
            {icon:"🎯", title:"Specific interventions", desc:"Each risk level triggers specific, evidence-based actions — not generic wellness tips"},
          ].map((f,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"14px", padding:"20px"}}>
              <div style={{fontSize:"24px", marginBottom:"10px"}}>{f.icon}</div>
              <h3 style={{fontSize:"13px", fontWeight:"600", color:"#f8fafc", margin:"0 0 6px"}}>{f.title}</h3>
              <p style={{fontSize:"12px", color:"rgba(255,255,255,0.35)", margin:0, lineHeight:"1.5"}}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.12)", borderRadius:"16px", padding:"28px", textAlign:"center"}}>
          <h3 style={{fontSize:"18px", fontWeight:"700", color:"#f8fafc", margin:"0 0 8px"}}>The cost of missing burnout</h3>
          <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:"0 0 20px"}}>For a 100-person company at average burnout rates</p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px"}}>
            {[
              {value:"£112k", label:"Presenteeism loss"},
              {value:"£94k", label:"Absenteeism cost"},
              {value:"£54k", label:"Burnout turnover"},
              {value:"£260k", label:"Total annual cost"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.03)", borderRadius:"10px", padding:"14px", textAlign:"center"}}>
                <div style={{fontSize:"20px", fontWeight:"700", color:"#ef4444", marginBottom:"4px"}}>{s.value}</div>
                <div style={{fontSize:"11px", color:"rgba(255,255,255,0.3)"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (view === "consent") return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <Nav />
      <div style={{maxWidth:"560px", margin:"0 auto", padding:"80px 24px"}}>
        <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"20px", padding:"40px"}}>
          <div style={{fontSize:"32px", marginBottom:"16px"}}>🔒</div>
          <h2 style={{fontSize:"22px", fontWeight:"700", color:"#f8fafc", margin:"0 0 12px"}}>Before you begin</h2>
          <p style={{fontSize:"14px", color:"rgba(255,255,255,0.5)", margin:"0 0 24px", lineHeight:"1.7"}}>
            PsychFlo collects your check-in responses to calculate your burnout score and track trends over time.
          </p>
          <div style={{display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px"}}>
            {[
              "Your individual responses are never shared with your manager or employer",
              "Managers only ever see anonymised team-level averages (minimum 5 responses)",
              "You can delete all your data at any time from your account settings",
              "Data is stored securely and processed under GDPR Article 6(1)(a) — consent",
            ].map((point, i) => (
              <div key={i} style={{display:"flex", gap:"10px", alignItems:"flex-start"}}>
                <span style={{color:"#10b981", fontSize:"14px", flexShrink:0, marginTop:"1px"}}>✓</span>
                <span style={{fontSize:"13px", color:"rgba(255,255,255,0.5)", lineHeight:"1.5"}}>{point}</span>
              </div>
            ))}
          </div>
          <div
            onClick={() => setConsentGiven(c => !c)}
            style={{display:"flex", gap:"12px", alignItems:"center", marginBottom:"24px", cursor:"pointer", padding:"14px", borderRadius:"10px", background:consentGiven?"rgba(16,185,129,0.08)":"rgba(255,255,255,0.03)", border:consentGiven?"1px solid rgba(16,185,129,0.25)":"1px solid rgba(255,255,255,0.08)", transition:"all 0.15s"}}
          >
            <div style={{width:"20px", height:"20px", borderRadius:"5px", border:consentGiven?"2px solid #10b981":"2px solid rgba(255,255,255,0.2)", background:consentGiven?"#10b981":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s"}}>
              {consentGiven && <span style={{color:"#0f172a", fontSize:"12px", fontWeight:"800"}}>✓</span>}
            </div>
            <span style={{fontSize:"13px", color:consentGiven?"#f8fafc":"rgba(255,255,255,0.5)", lineHeight:"1.5"}}>
              I consent to PsychFlo processing my check-in responses as described above. I understand I can withdraw consent at any time.
            </span>
          </div>
          <button
            onClick={() => { if (consentGiven) setView("checkin"); }}
            disabled={!consentGiven}
            style={{width:"100%", background:consentGiven?`linear-gradient(135deg,${gold},#f0d080)`:"rgba(255,255,255,0.06)", color:consentGiven?"#0f172a":"rgba(255,255,255,0.3)", border:"none", padding:"14px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:consentGiven?"pointer":"not-allowed", transition:"all 0.2s"}}
          >
            Continue to check-in →
          </button>
          <p style={{fontSize:"11px", color:"rgba(255,255,255,0.2)", margin:"16px 0 0", textAlign:"center", lineHeight:"1.6"}}>
            Privacy policy · Data processing agreement · <span style={{cursor:"pointer", textDecoration:"underline"}} onClick={() => alert("Email privacy@psychflo.com to request data deletion")}>Delete my data</span>
          </p>
        </div>
      </div>
    </div>
  );

  if (view === "checkin") return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <Nav />
      <div style={{maxWidth:"600px", margin:"0 auto", padding:"60px 24px"}}>

        <div style={{marginBottom:"32px"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
            <span style={{fontSize:"12px", color:"rgba(255,255,255,0.35)"}}>Question {step+1} of {questions.length}</span>
            <span style={{fontSize:"12px", color:gold, fontWeight:"600"}}>{progress}% complete</span>
          </div>
          <div style={{background:"rgba(255,255,255,0.07)", borderRadius:"999px", height:"4px", overflow:"hidden"}}>
            <div style={{width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${gold},#f0d080)`, borderRadius:"999px", transition:"width 0.3s ease"}}/>
          </div>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"20px", padding:"36px", marginBottom:"16px"}}>
          <div style={{display:"inline-block", background:"rgba(201,168,76,0.1)", color:gold, fontSize:"10px", fontWeight:"700", padding:"3px 10px", borderRadius:"999px", marginBottom:"16px", letterSpacing:"0.05em"}}>{currentQ.dimension.toUpperCase()}</div>
          <h2 style={{fontSize:"20px", fontWeight:"700", color:"#f8fafc", margin:"0 0 28px", lineHeight:"1.4"}}>{currentQ.text}</h2>

          {currentQ.multiSelect ? (
            <div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"20px"}}>
                {currentQ.options.map((opt,i)=>{
                  const selected = (answers[currentQ.id]||[]).includes(opt);
                  return (
                    <button key={i} onClick={()=>handleAnswer(currentQ.id, opt, true)}
                      style={{padding:"12px 16px", borderRadius:"10px", border:selected?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.1)", background:selected?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.04)", color:selected?gold:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:selected?"600":"400", cursor:"pointer", textAlign:"left", transition:"all 0.15s"}}>
                      {selected ? "✓ " : ""}{opt}
                    </button>
                  );
                })}
              </div>
              <button onClick={()=>setStep(step+1)}
                style={{width:"100%", background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:"pointer"}}>
                Continue
              </button>
            </div>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
              {currentQ.options.map((opt,i)=>{
                const selected = answers[currentQ.id] === opt;
                return (
                  <button key={i} onClick={()=>handleAnswer(currentQ.id, opt, false)}
                    style={{padding:"14px 18px", borderRadius:"10px", border:selected?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.1)", background:selected?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.04)", color:selected?gold:"rgba(255,255,255,0.6)", fontSize:"14px", fontWeight:selected?"600":"400", cursor:"pointer", textAlign:"left", transition:"all 0.15s"}}>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {step === questions.length - 1 && (
          <button onClick={handleSubmit} disabled={loading}
            style={{width:"100%", background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"16px", borderRadius:"12px", fontSize:"15px", fontWeight:"800", cursor:"pointer", opacity:loading?0.7:1}}>
            {loading ? "Analysing your responses..." : "See my burnout analysis"}
          </button>
        )}

        <div style={{textAlign:"center", marginTop:"16px"}}>
          <p style={{fontSize:"12px", color:"rgba(255,255,255,0.2)", margin:0}}>Your responses are anonymous · Based on Maslach Burnout Inventory · Not a clinical diagnosis</p>
        </div>
      </div>
    </div>
  );

  if (view === "results" && result) {
    const emp = result.employee;
    const team = result.team;
    const org = result.organisation;

    const employeeTabs = [{id:"personal",label:"My Score"},{id:"dimensions",label:"3 Dimensions"},{id:"stressors",label:"My Stressors"},{id:"recovery",label:"Recovery Plan"},{id:"mood",label:"Mood Tracker"}];
    const managerTabsList = [{id:"overview",label:"Team Overview"},{id:"riskmap",label:"Risk Map"},{id:"script",label:"Conversation Script"},{id:"actions",label:"Weekly Actions"},{id:"orgview",label:"Org View"}];

    return (
      <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
        <Nav />
        <div style={{maxWidth:"820px", margin:"0 auto", padding:"48px 24px"}}>

          <div style={{display:"flex", gap:"8px", marginBottom:"24px", flexWrap:"wrap"}}>
            {role !== "manager" && (
              <button onClick={()=>setActiveTab("personal")}
                style={{padding:"8px 16px", borderRadius:"999px", border:activeTab==="personal"?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.1)", background:activeTab==="personal"?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.04)", color:activeTab==="personal"?gold:"rgba(255,255,255,0.5)", fontSize:"13px", fontWeight:"500", cursor:"pointer"}}>
                My results
              </button>
            )}
            <button onClick={()=>setActiveTab("team")}
              style={{padding:"8px 16px", borderRadius:"999px", border:activeTab==="team"?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.1)", background:activeTab==="team"?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.04)", color:activeTab==="team"?gold:"rgba(255,255,255,0.5)", fontSize:"13px", fontWeight:"500", cursor:"pointer"}}>
              {role === "manager" ? "Manager dashboard" : "Team view (anonymised)"}
            </button>
          </div>

          {activeTab === "personal" && (
            <div>
              <div style={{display:"flex", gap:"4px", marginBottom:"20px", overflowX:"auto", paddingBottom:"4px"}}>
                {employeeTabs.map(tab=>(
                  <button key={tab.id} onClick={()=>setManagerTab(tab.id)}
                    style={{padding:"7px 14px", borderRadius:"8px", border:managerTab===tab.id?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.07)", background:managerTab===tab.id?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.03)", color:managerTab===tab.id?gold:"rgba(255,255,255,0.4)", fontSize:"12px", fontWeight:"500", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0}}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {managerTab === "personal" && (
                <div>
                  <div style={card}>
                    <span style={lbl}>YOUR BURNOUT SCORE THIS WEEK</span>
                    <div style={{display:"flex", alignItems:"center", gap:"24px", marginBottom:"20px"}}>
                      <div style={{width:"100px", height:"100px", borderRadius:"50%", border:`5px solid ${emp.color}`, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", flexShrink:0}}>
                        <span style={{fontSize:"32px", fontWeight:"800", color:emp.color}}>{emp.burnoutScore}</span>
                        <span style={{fontSize:"10px", color:"rgba(255,255,255,0.3)"}}>/100</span>
                      </div>
                      <div>
                        <div style={{fontSize:"22px", fontWeight:"700", color:emp.color, marginBottom:"6px"}}>{emp.label}</div>
                        <div style={{fontSize:"13px", color:"rgba(255,255,255,0.45)", marginBottom:"4px"}}>Trend: <span style={{color: emp.trend==="worsening"?"#ef4444":"#10b981", fontWeight:"600"}}>{emp.trend==="worsening"?"↑ Worsening":"↓ Improving"}</span></div>
                        <div style={{fontSize:"13px", color:"rgba(255,255,255,0.45)", marginBottom:"4px"}}>Peak predicted: <span style={{color:"#f59e0b", fontWeight:"600"}}>Week {emp.peakPrediction?.week||8} ({emp.peakPrediction?.confidence||72}% confidence)</span></div>
                        {emp.highRiskAlertTriggered && <div style={{fontSize:"12px", color:"#fca5a5", fontWeight:"600"}}>⚠️ Manager has been notified</div>}
                      </div>
                    </div>
                    <span style={lbl}>6-WEEK TREND</span>
                    <div style={{display:"flex", gap:"8px", alignItems:"flex-end", height:"60px", marginBottom:"8px"}}>
                      {emp.weeklyScores.map((s,i)=>(
                        <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px"}}>
                          <div style={{width:"100%", background:i===emp.weeklyScores.length-1?emp.color:"rgba(255,255,255,0.15)", borderRadius:"3px 3px 0 0", height:`${s*0.6}px`}}/>
                          <span style={{fontSize:"10px", color:"rgba(255,255,255,0.3)"}}>W{i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {managerTab === "dimensions" && (
                <div>
                  {Object.entries(emp.dimensions).map(([key, dim])=>(
                    <div key={key} style={card}>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px"}}>
                        <h3 style={{fontSize:"16px", fontWeight:"700", color:"#f8fafc", margin:0, textTransform:"capitalize"}}>{key}</h3>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:"22px", fontWeight:"700", color:dim.color}}>{dim.score}/100</div>
                          <div style={{fontSize:"12px", color:dim.color}}>{dim.label}</div>
                        </div>
                      </div>
                      <Bar value={dim.score} color={dim.color} height={10}/>
                      <p style={{fontSize:"13px", color:"rgba(255,255,255,0.45)", margin:"14px 0 0", lineHeight:"1.6"}}>{dim.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {managerTab === "stressors" && (
                <div style={card}>
                  <span style={lbl}>YOUR TOP STRESSORS</span>
                  {emp.topStressors.map((s,i)=>(
                    <div key={i} style={{marginBottom:"14px"}}>
                      <div style={{display:"flex", justifyContent:"space-between", marginBottom:"5px"}}>
                        <span style={{fontSize:"13px", color:"rgba(255,255,255,0.6)"}}>{s.stressor}</span>
                        <div style={{display:"flex", gap:"8px", alignItems:"center"}}>
                          <span style={{fontSize:"11px", color:s.trend==="increasing"?"#ef4444":s.trend==="decreasing"?"#10b981":"#f59e0b"}}>{s.trend==="increasing"?"↑":s.trend==="decreasing"?"↓":"→"} {s.trend}</span>
                          <span style={{fontSize:"12px", fontWeight:"600", color:s.severity>70?"#ef4444":s.severity>50?"#f59e0b":"#10b981"}}>{s.severity}/100</span>
                        </div>
                      </div>
                      <Bar value={s.severity} color={s.severity>70?"#ef4444":s.severity>50?"#f59e0b":"#10b981"} height={6}/>
                    </div>
                  ))}
                </div>
              )}

              {managerTab === "recovery" && (
                <div style={card}>
                  <span style={lbl}>YOUR PERSONALISED RECOVERY PLAN</span>
                  {emp.recoveryRecommendations.map((r,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"16px", marginBottom:"10px", borderLeft:`3px solid ${r.priority==="Immediate"?"#ef4444":"#f59e0b"}`}}>
                      <div style={{display:"flex", gap:"8px", marginBottom:"8px"}}>
                        <span style={{fontSize:"10px", fontWeight:"700", padding:"2px 8px", borderRadius:"999px", background:r.priority==="Immediate"?"rgba(239,68,68,0.15)":"rgba(245,158,11,0.15)", color:r.priority==="Immediate"?"#fca5a5":"#fcd34d"}}>{r.priority}</span>
                      </div>
                      <p style={{fontSize:"13px", fontWeight:"600", color:"#f8fafc", margin:"0 0 6px"}}>{r.action}</p>
                      <p style={{fontSize:"12px", color:"rgba(255,255,255,0.35)", margin:0, lineHeight:"1.5", fontStyle:"italic"}}>{r.science}</p>
                    </div>
                  ))}
                </div>
              )}

              {managerTab === "mood" && (
                <div style={card}>
                  <span style={lbl}>THIS WEEK'S MOOD TRACKER</span>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"8px"}}>
                    {emp.moodTrajectory.map((day,i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,0.03)", borderRadius:"10px", padding:"12px", textAlign:"center"}}>
                        <div style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.5)", marginBottom:"10px"}}>{day.day}</div>
                        <div style={{marginBottom:"6px"}}>
                          <div style={{fontSize:"10px", color:"rgba(255,255,255,0.3)", marginBottom:"3px"}}>Energy</div>
                          <div style={{fontSize:"14px", fontWeight:"700", color:day.energy<40?"#ef4444":day.energy<60?"#f59e0b":"#10b981"}}>{day.energy}</div>
                        </div>
                        <div style={{marginBottom:"6px"}}>
                          <div style={{fontSize:"10px", color:"rgba(255,255,255,0.3)", marginBottom:"3px"}}>Stress</div>
                          <div style={{fontSize:"14px", fontWeight:"700", color:day.stress>70?"#ef4444":day.stress>50?"#f59e0b":"#10b981"}}>{day.stress}</div>
                        </div>
                        <div>
                          <div style={{fontSize:"10px", color:"rgba(255,255,255,0.3)", marginBottom:"3px"}}>Focus</div>
                          <div style={{fontSize:"14px", fontWeight:"700", color:day.focus<40?"#ef4444":day.focus<60?"#f59e0b":"#10b981"}}>{day.focus}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "team" && (
            <BurnoutGate tab="team" isPaid={isPaid}>
            <div>
              <div style={{display:"flex", gap:"4px", marginBottom:"20px", overflowX:"auto", paddingBottom:"4px"}}>
                {managerTabsList.map(tab=>(
                  <button key={tab.id} onClick={()=>setManagerTab(tab.id)}
                    style={{padding:"7px 14px", borderRadius:"8px", border:managerTab===tab.id?`1px solid ${gold}`:"1px solid rgba(255,255,255,0.07)", background:managerTab===tab.id?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.03)", color:managerTab===tab.id?gold:"rgba(255,255,255,0.4)", fontSize:"12px", fontWeight:"500", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0}}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {managerTab === "overview" && (
                <div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px", marginBottom:"16px"}}>
                    {[
                      {label:"Team risk score", value:`${team.overallRisk}/100`, color:team.color},
                      {label:"At high risk", value:team.atHighRisk, color:"#ef4444"},
                      {label:"At moderate risk", value:team.atModerateRisk, color:"#f59e0b"},
                      {label:"At low risk", value:team.atLowRisk, color:"#10b981"},
                    ].map((s,i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"14px", textAlign:"center"}}>
                        <div style={{fontSize:"22px", fontWeight:"700", color:s.color, marginBottom:"4px"}}>{s.value}</div>
                        <div style={{fontSize:"11px", color:"rgba(255,255,255,0.35)"}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={card}>
                    <span style={lbl}>TEAM BURNOUT TREND — 6 WEEKS</span>
                    <div style={{display:"flex", gap:"8px", alignItems:"flex-end", height:"80px", marginBottom:"16px"}}>
                      {team.weeklyTrend.map((s,i)=>(
                        <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px"}}>
                          <div style={{width:"100%", background:i===team.weeklyTrend.length-1?team.color:"rgba(255,255,255,0.15)", borderRadius:"3px 3px 0 0", height:`${s*1.2}px`}}/>
                          <span style={{fontSize:"10px", color:"rgba(255,255,255,0.3)"}}>W{i+1}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{fontSize:"13px", color:"rgba(255,255,255,0.4)", margin:0, lineHeight:"1.6"}}>Peak predicted at week {team.peakPrediction.week} with score {team.peakPrediction.score}/100 ({team.peakPrediction.confidence}% confidence). Intervention now reduces peak by an estimated 40%.</p>
                  </div>
                  <div style={card}>
                    <span style={lbl}>TEAM DIMENSIONS vs INDUSTRY BENCHMARK</span>
                    {Object.entries(team.dimensions).map(([key, dim])=>(
                      <div key={key} style={{marginBottom:"14px"}}>
                        <div style={{display:"flex", justifyContent:"space-between", marginBottom:"5px"}}>
                          <span style={{fontSize:"12px", color:"rgba(255,255,255,0.5)", textTransform:"capitalize"}}>{key}</span>
                          <span style={{fontSize:"12px", color:"rgba(255,255,255,0.35)"}}>
                            <span style={{color:dim.color, fontWeight:"600"}}>{dim.score}</span>
                            <span style={{color:"rgba(255,255,255,0.2)"}}> vs {dim.benchmark} avg</span>
                          </span>
                        </div>
                        <div style={{position:"relative"}}>
                          <Bar value={dim.score} color={dim.color} height={8}/>
                          <div style={{position:"absolute", top:0, left:`${dim.benchmark}%`, width:"2px", height:"8px", background:"rgba(255,255,255,0.3)", borderRadius:"1px"}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={card}>
                    <span style={lbl}>TOP TEAM STRESSORS (ANONYMISED)</span>
                    {team.topTeamStressors.map((s,i)=>(
                      <div key={i} style={{marginBottom:"12px"}}>
                        <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}>
                          <span style={{fontSize:"13px", color:"rgba(255,255,255,0.5)"}}>{s.stressor}</span>
                          <span style={{fontSize:"12px", fontWeight:"600", color:s.percentage>70?"#ef4444":s.percentage>50?"#f59e0b":"#10b981"}}>{s.percentage}% of team</span>
                        </div>
                        <Bar value={s.percentage} color={s.percentage>70?"#ef4444":s.percentage>50?"#f59e0b":"#10b981"} height={6}/>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {managerTab === "script" && (
                <div style={card}>
                  <span style={lbl}>CONVERSATION SCRIPT FOR HIGH-RISK TEAM MEMBERS</span>
                  <div style={{background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:"12px", padding:"18px", marginBottom:"16px"}}>
                    <div style={{fontSize:"11px", fontWeight:"600", color:"#6ee7b7", marginBottom:"8px", letterSpacing:"0.05em"}}>OPENING — USE THIS EXACT PHRASING</div>
                    <p style={{fontSize:"14px", color:"rgba(255,255,255,0.7)", margin:0, lineHeight:"1.7", fontStyle:"italic"}}>"{team.interventionScript.opening}"</p>
                  </div>
                  <span style={lbl}>EXPLORATION QUESTIONS</span>
                  {team.interventionScript.explorationQuestions.map((q,i)=>(
                    <div key={i} style={{display:"flex", gap:"10px", marginBottom:"10px"}}>
                      <div style={{width:"6px", height:"6px", borderRadius:"50%", background:gold, marginTop:"6px", flexShrink:0}}/>
                      <p style={{fontSize:"13px", color:"rgba(255,255,255,0.6)", margin:0, lineHeight:"1.6", fontStyle:"italic"}}>"{q}"</p>
                    </div>
                  ))}
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginTop:"20px"}}>
                    <div style={{background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:"12px", padding:"16px"}}>
                      <div style={{fontSize:"11px", fontWeight:"600", color:"#6ee7b7", marginBottom:"10px", letterSpacing:"0.05em"}}>DO SAY</div>
                      {team.interventionScript.doSay.map((s,i)=>(
                        <div key={i} style={{display:"flex", gap:"8px", marginBottom:"8px"}}>
                          <span style={{color:"#10b981", fontSize:"12px", flexShrink:0}}>✓</span>
                          <span style={{fontSize:"12px", color:"rgba(255,255,255,0.5)", lineHeight:"1.5"}}>"{s}"</span>
                        </div>
                      ))}
                    </div>
                    <div style={{background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:"12px", padding:"16px"}}>
                      <div style={{fontSize:"11px", fontWeight:"600", color:"#fca5a5", marginBottom:"10px", letterSpacing:"0.05em"}}>DO NOT SAY</div>
                      {team.interventionScript.doNotSay.map((s,i)=>(
                        <div key={i} style={{display:"flex", gap:"8px", marginBottom:"8px"}}>
                          <span style={{color:"#ef4444", fontSize:"12px", flexShrink:0}}>✗</span>
                          <span style={{fontSize:"12px", color:"rgba(255,255,255,0.5)", lineHeight:"1.5"}}>"{s}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{marginTop:"16px", background:"rgba(201,168,76,0.06)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:"12px", padding:"16px"}}>
                    <div style={{fontSize:"11px", fontWeight:"600", color:gold, marginBottom:"8px", letterSpacing:"0.05em"}}>CRITICAL FOLLOW-UP STEP</div>
                    <p style={{fontSize:"13px", color:"rgba(255,255,255,0.5)", margin:0, lineHeight:"1.6"}}>{team.interventionScript.followUp}</p>
                  </div>
                </div>
              )}

              {managerTab === "actions" && (
                <div style={card}>
                  <span style={lbl}>EVIDENCE-BASED WEEKLY ACTIONS</span>
                  {team.weeklyActions.map((a,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"16px", marginBottom:"10px"}}>
                      <div style={{display:"flex", gap:"8px", marginBottom:"8px"}}>
                        <span style={{fontSize:"11px", fontWeight:"700", padding:"2px 8px", borderRadius:"999px", background:a.week==="This week"?"rgba(239,68,68,0.15)":a.week==="Next week"?"rgba(245,158,11,0.15)":"rgba(107,114,128,0.15)", color:a.week==="This week"?"#fca5a5":a.week==="Next week"?"#fcd34d":"#9ca3af"}}>{a.week}</span>
                      </div>
                      <p style={{fontSize:"13px", fontWeight:"600", color:"#f8fafc", margin:"0 0 6px"}}>{a.action}</p>
                      <p style={{fontSize:"12px", color:"rgba(255,255,255,0.35)", margin:0, lineHeight:"1.5", fontStyle:"italic"}}>{a.impact}</p>
                    </div>
                  ))}
                </div>
              )}

              {managerTab === "orgview" && (
                <div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginBottom:"16px"}}>
                    {[
                      {label:"Org risk score", value:`${org.overallRisk}/100`, color:org.color},
                      {label:"Annual burnout cost", value:fmt(org.estimatedCostGBP), color:"#ef4444"},
                      {label:"vs industry avg", value:`+${org.overallRisk - org.industryBenchmark}pts`, color:"#ef4444"},
                    ].map((s,i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"14px", textAlign:"center"}}>
                        <div style={{fontSize:"20px", fontWeight:"700", color:s.color, marginBottom:"4px"}}>{s.value}</div>
                        <div style={{fontSize:"11px", color:"rgba(255,255,255,0.35)"}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={card}>
                    <span style={lbl}>RISK BY DEPARTMENT</span>
                    {org.departments.map((d,i)=>(
                      <div key={i} style={{marginBottom:"14px"}}>
                        <div style={{display:"flex", justifyContent:"space-between", marginBottom:"5px"}}>
                          <span style={{fontSize:"13px", color:"rgba(255,255,255,0.5)"}}>{d.name} <span style={{color:"rgba(255,255,255,0.25)", fontSize:"11px"}}>({d.employees} people)</span></span>
                          <span style={{fontSize:"12px", fontWeight:"600", color:d.color}}>{d.risk}/100</span>
                        </div>
                        <Bar value={d.risk} color={d.color} height={8}/>
                      </div>
                    ))}
                  </div>
                  <div style={card}>
                    <span style={lbl}>COST BREAKDOWN</span>
                    {org.costBreakdown.map((c,i)=>(
                      <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                        <span style={{fontSize:"13px", color:"rgba(255,255,255,0.5)"}}>{c.cause}</span>
                        <span style={{fontSize:"14px", fontWeight:"700", color:"#ef4444"}}>{fmt(c.cost)}</span>
                      </div>
                    ))}
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0 0"}}>
                      <span style={{fontSize:"14px", fontWeight:"600", color:"#f8fafc"}}>Total annual cost</span>
                      <span style={{fontSize:"18px", fontWeight:"800", color:"#ef4444"}}>{fmt(org.estimatedCostGBP)}</span>
                    </div>
                  </div>
                  <div style={card}>
                    <span style={lbl}>PRIORITY RECOMMENDATIONS</span>
                    {org.topRecommendations.map((r,i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"10px", padding:"14px", marginBottom:"8px"}}>
                        <div style={{display:"flex", gap:"8px", marginBottom:"6px"}}>
                          <span style={{fontSize:"10px", fontWeight:"700", padding:"2px 8px", borderRadius:"999px", background:r.priority==="Critical"?"rgba(239,68,68,0.15)":"rgba(245,158,11,0.15)", color:r.priority==="Critical"?"#fca5a5":"#fcd34d"}}>{r.priority}</span>
                          <span style={{fontSize:"11px", color:"rgba(255,255,255,0.3)"}}>{r.dept}</span>
                        </div>
                        <p style={{fontSize:"13px", color:"rgba(255,255,255,0.55)", margin:0, lineHeight:"1.6"}}>{r.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {managerTab === "riskmap" && (
                <div style={card}>
                  <span style={lbl}>TEAM RISK DISTRIBUTION</span>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginBottom:"20px"}}>
                    {team.riskDistribution.map((r,i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,0.03)", border:`1px solid ${r.color}30`, borderRadius:"12px", padding:"16px", textAlign:"center"}}>
                        <div style={{fontSize:"28px", fontWeight:"800", color:r.color, marginBottom:"4px"}}>{r.count}</div>
                        <div style={{fontSize:"12px", color:r.color, fontWeight:"600", marginBottom:"2px"}}>{r.label}</div>
                        <div style={{fontSize:"11px", color:"rgba(255,255,255,0.3)"}}>{r.percentage}% of team</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px"}}>
                    {Array.from({length:team.size}).map((_,i)=>{
                      const riskLevel = i < team.atHighRisk ? "high" : i < team.atHighRisk + team.atModerateRisk ? "moderate" : "low";
                      const color = riskLevel === "high" ? "#ef4444" : riskLevel === "moderate" ? "#f59e0b" : "#10b981";
                      return (
                        <div key={i} style={{background:`${color}15`, border:`1px solid ${color}30`, borderRadius:"8px", padding:"12px", textAlign:"center"}}>
                          <div style={{fontSize:"18px", marginBottom:"4px"}}>👤</div>
                          <div style={{fontSize:"10px", color, fontWeight:"600"}}>{riskLevel}</div>
                        </div>
                      );
                    })}
                  </div>
                  <p style={{fontSize:"12px", color:"rgba(255,255,255,0.2)", margin:"12px 0 0", textAlign:"center"}}>Individual identities are anonymised. Managers only see risk levels, not names.</p>
                </div>
              )}
            </div>
            </BurnoutGate>
          )}

          {/* Post-result conversion nudge */}
          <div style={{background:"rgba(201,168,76,0.06)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"14px", padding:"20px", marginTop:"16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px", flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:"14px", fontWeight:"700", color:"#f8fafc", marginBottom:"4px"}}>Track your burnout week over week</div>
              <div style={{fontSize:"12px", color:"rgba(255,255,255,0.4)"}}>Create a free account to see your trends, get weekly reminders, and share with your manager.</div>
            </div>
            <div style={{display:"flex", gap:"8px", flexShrink:0}}>
              <button onClick={()=>router.push("/auth/signup")}
                style={{background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"10px 20px", borderRadius:"9px", fontSize:"13px", fontWeight:"800", cursor:"pointer"}}>
                Create free account →
              </button>
              <button onClick={()=>router.push("/demo")}
                style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", padding:"10px 16px", borderRadius:"9px", fontSize:"12px", cursor:"pointer"}}>
                Book a demo
              </button>
            </div>
          </div>

          <div style={{display:"flex", gap:"10px", marginTop:"12px"}}>
            {!isPaid && (
              <button onClick={()=>router.push("/pricing")}
                style={{flex:1, background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", padding:"13px", borderRadius:"10px", fontSize:"13px", fontWeight:"800", border:"none", cursor:"pointer"}}>
                Unlock team features
              </button>
            )}
            <button onClick={()=>{setView("landing"); setStep(0); setAnswers({}); setResult(null); setConsentGiven(false);}}
              style={{flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", padding:"13px", borderRadius:"10px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
              Start over
            </button>
          </div>

          <div style={{textAlign:"center", marginTop:"24px"}}>
            <p style={{fontSize:"12px", color:"rgba(255,255,255,0.15)", margin:0}}>Based on Maslach Burnout Inventory · Not a clinical diagnosis · Data is anonymised and GDPR compliant</p>
          </div>
        </div>
      </div>
    );
  }
}
