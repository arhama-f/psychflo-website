"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

const gold = "#c9a84c";

export default function ROIPage() {
  const router = useRouter();
  const [headcount, setHeadcount] = useState(100);
  const [avgSalary, setAvgSalary] = useState(45000);
  const [sector, setSector] = useState("tech");

  // Industry burnout prevalence rates
  const SECTOR_RATES = {
    tech: { burnout: 0.52, label: "Technology" },
    healthcare: { burnout: 0.63, label: "Healthcare" },
    finance: { burnout: 0.46, label: "Finance" },
    education: { burnout: 0.44, label: "Education" },
    retail: { burnout: 0.41, label: "Retail" },
    legal: { burnout: 0.58, label: "Legal" },
    other: { burnout: 0.45, label: "Other" },
  };

  const rate = SECTOR_RATES[sector]?.burnout || 0.45;

  // Calculations
  const burnedOutPeople    = Math.round(headcount * rate);
  const turnoverCost       = Math.round(avgSalary * 0.5);          // 50% salary to replace
  const turnoverRisk       = Math.round(burnedOutPeople * 0.3);    // 30% of burned-out leave
  const totalTurnoverCost  = turnoverRisk * turnoverCost;
  const sickDaysPerPerson  = 18;                                   // avg extra sick days
  const dailySalary        = Math.round(avgSalary / 260);
  const sickDayCost        = Math.round(burnedOutPeople * sickDaysPerPerson * dailySalary);
  const productivityLoss   = Math.round(headcount * avgSalary * 0.23 * rate); // 23% productivity drop
  const totalCostOfBurnout = totalTurnoverCost + sickDayCost + productivityLoss;

  // PsychFlo cost (Burnout Early Warning at £60/month)
  const psychfloCostPerYear = 60 * 12;
  const netSaving           = totalCostOfBurnout - psychfloCostPerYear;
  const roi                 = Math.round((netSaving / psychfloCostPerYear) * 100);

  const fmt = (n) => n >= 1000000
    ? `£${(n / 1000000).toFixed(1)}M`
    : `£${n.toLocaleString("en-GB")}`;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0f172a 40%,#1a0a2e 100%)", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Nav />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "64px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "999px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: gold, letterSpacing: "0.08em" }}>BURNOUT COST CALCULATOR</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: "900", color: "#f8fafc", margin: "0 0 16px", lineHeight: 1.1 }}>
            How much is burnout<br />
            <span style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              costing your company?
            </span>
          </h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            Adjust the sliders below. Most companies are shocked by the number.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

          {/* Left — inputs */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: "0 0 24px" }}>Your organisation</h2>

            {/* Headcount */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Number of employees</label>
                <span style={{ fontSize: "15px", fontWeight: "700", color: gold }}>{headcount.toLocaleString()}</span>
              </div>
              <input type="range" min="10" max="5000" step="10" value={headcount}
                onChange={e => setHeadcount(Number(e.target.value))}
                style={{ width: "100%", accentColor: gold, cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>10</span>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>5,000</span>
              </div>
            </div>

            {/* Avg salary */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Average salary</label>
                <span style={{ fontSize: "15px", fontWeight: "700", color: gold }}>£{avgSalary.toLocaleString()}</span>
              </div>
              <input type="range" min="20000" max="120000" step="1000" value={avgSalary}
                onChange={e => setAvgSalary(Number(e.target.value))}
                style={{ width: "100%", accentColor: gold, cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>£20k</span>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>£120k</span>
              </div>
            </div>

            {/* Sector */}
            <div>
              <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "10px" }}>Industry</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {Object.entries(SECTOR_RATES).map(([key, val]) => (
                  <button key={key} onClick={() => setSector(key)}
                    style={{
                      background: sector === key ? `rgba(201,168,76,0.15)` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${sector === key ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: "8px", padding: "8px 12px", fontSize: "12px",
                      color: sector === key ? gold : "rgba(255,255,255,0.4)",
                      fontWeight: sector === key ? "700" : "400",
                      cursor: "pointer", textAlign: "left"
                    }}>
                    {val.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "10px" }}>
                Burnout prevalence in {SECTOR_RATES[sector]?.label}: <strong style={{ color: "rgba(255,255,255,0.4)" }}>{Math.round(rate * 100)}%</strong> of staff
              </p>
            </div>
          </div>

          {/* Right — results */}
          <div>
            {/* Big number */}
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "20px", padding: "28px", marginBottom: "12px", textAlign: "center" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(239,68,68,0.7)", letterSpacing: "0.08em", margin: "0 0 8px" }}>ANNUAL COST OF BURNOUT</p>
              <div style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: "900", color: "#fca5a5", lineHeight: 1 }}>{fmt(totalCostOfBurnout)}</div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: "8px 0 0" }}>
                {burnedOutPeople} of your {headcount} employees are burning out right now
              </p>
            </div>

            {/* Breakdown */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: "14px" }}>COST BREAKDOWN</div>
              {[
                { label: "Turnover & replacement", value: totalTurnoverCost, note: `${turnoverRisk} people leave × £${turnoverCost.toLocaleString()} to replace` },
                { label: "Sick days & absence", value: sickDayCost, note: `${sickDaysPerPerson} extra days × ${burnedOutPeople} people` },
                { label: "Productivity loss", value: productivityLoss, note: "23% output drop in burned-out staff" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>{row.label}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "2px" }}>{row.note}</div>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#fca5a5", marginLeft: "12px", flexShrink: 0 }}>{fmt(row.value)}</div>
                </div>
              ))}
            </div>

            {/* ROI */}
            <div style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(16,185,129,0.6)", letterSpacing: "0.08em", marginBottom: "12px" }}>PSYCHFLO ROI</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>PsychFlo Team plan</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>{fmt(psychfloCostPerYear)}/yr</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Net saving in year 1</span>
                <span style={{ fontSize: "13px", color: "#6ee7b7", fontWeight: "700" }}>{fmt(netSaving)}</span>
              </div>
              <div style={{ textAlign: "center", padding: "14px", background: "rgba(16,185,129,0.08)", borderRadius: "10px" }}>
                <span style={{ fontSize: "28px", fontWeight: "900", color: "#6ee7b7" }}>{roi}×</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginLeft: "8px" }}>return on investment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sources */}
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", margin: "24px 0 40px", lineHeight: 1.7 }}>
          Sources: Gallup State of the Workplace 2024 · Deloitte Workplace Burnout Survey · CIPD Health & Wellbeing Report 2024<br />
          Turnover cost estimated at 50% of annual salary · Productivity loss based on Gallup engagement meta-analysis
        </p>

        {/* CTA */}
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
          <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 10px" }}>
            Stop losing {fmt(totalCostOfBurnout)} a year
          </h3>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: "0 0 28px", lineHeight: 1.7 }}>
            PsychFlo detects burnout 3–4 weeks before it becomes a crisis.<br />
            No free trial. Free access is limited to 1 HR policy page in the Policy Translator.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/auth/signup")}
              style={{ background: `linear-gradient(135deg,${gold},#f0d080)`, color: "#0f172a", border: "none", padding: "14px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
              Create account — protect your team →
            </button>
            <button onClick={() => router.push("/pricing")}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "14px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              See pricing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
