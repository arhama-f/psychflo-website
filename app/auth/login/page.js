"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "../../components/Nav";

const gold = "#c9a84c";

export default function LoginPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0f1e" }} />}><Login /></Suspense>;
}

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const inp = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"13px 16px", color:"#f8fafc", fontSize:"14px", outline:"none", boxSizing:"border-box" };

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(next);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleMagicLink() {
    if (!email) { setError("Enter your email first"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMagicSent(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <Nav />
      <div style={{maxWidth:"420px", margin:"0 auto", padding:"80px 24px"}}>
        <div style={{textAlign:"center", marginBottom:"32px"}}>
          <h1 style={{fontSize:"26px", fontWeight:"800", color:"#f8fafc", margin:"0 0 8px"}}>Welcome back</h1>
          <p style={{fontSize:"14px", color:"rgba(255,255,255,0.4)", margin:0}}>Sign in to your PsychFlo account</p>
        </div>

        {magicSent ? (
          <div style={{background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:"14px", padding:"28px", textAlign:"center"}}>
            <div style={{fontSize:"32px", marginBottom:"12px"}}>📬</div>
            <h3 style={{fontSize:"16px", fontWeight:"700", color:"#f8fafc", margin:"0 0 8px"}}>Check your inbox</h3>
            <p style={{fontSize:"13px", color:"rgba(255,255,255,0.45)", margin:0, lineHeight:"1.6"}}>We sent a magic link to <strong style={{color:"#f8fafc"}}>{email}</strong>. Click it to sign in instantly.</p>
          </div>
        ) : (
          <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"32px"}}>
            <form onSubmit={handleLogin}>
              <div style={{marginBottom:"16px"}}>
                <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>EMAIL</label>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" style={inp}/>
              </div>
              <div style={{marginBottom:"8px"}}>
                <label style={{fontSize:"12px", fontWeight:"600", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"6px"}}>PASSWORD</label>
                <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp}/>
              </div>
              <div style={{textAlign:"right", marginBottom:"20px"}}>
                <span onClick={()=>router.push("/auth/reset")} style={{fontSize:"12px", color:"rgba(255,255,255,0.3)", cursor:"pointer"}}>Forgot password?</span>
              </div>
              {error && <p style={{fontSize:"13px", color:"#fca5a5", margin:"0 0 16px", background:"rgba(239,68,68,0.08)", padding:"10px 14px", borderRadius:"8px"}}>{error}</p>}
              <button type="submit" disabled={loading} style={{width:"100%", background:`linear-gradient(135deg,${gold},#f0d080)`, color:"#0f172a", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:"800", cursor:"pointer", opacity:loading?0.7:1}}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <div style={{display:"flex", alignItems:"center", gap:"12px", margin:"20px 0"}}>
              <div style={{flex:1, height:"1px", background:"rgba(255,255,255,0.08)"}}/>
              <span style={{fontSize:"12px", color:"rgba(255,255,255,0.25)"}}>or</span>
              <div style={{flex:1, height:"1px", background:"rgba(255,255,255,0.08)"}}/>
            </div>
            <button onClick={handleMagicLink} disabled={loading} style={{width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:"600", cursor:"pointer"}}>
              Send magic link instead
            </button>
          </div>
        )}

        <p style={{textAlign:"center", marginTop:"20px", fontSize:"13px", color:"rgba(255,255,255,0.3)"}}>
          No account?{" "}
          <span onClick={()=>router.push("/auth/signup")} style={{color:gold, cursor:"pointer", fontWeight:"600"}}>Create account</span>
        </p>
      </div>
    </div>
  );
}
