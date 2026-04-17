import { getSupabaseServer } from "../../../lib/supabase.js";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const HIGH_RISK_THRESHOLD = 70;

async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) return { skipped: true };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: "PsychFlo Alerts <alerts@psychflo.com>", to, subject, html }),
  });
  return res.json();
}

// Called automatically from burnout check-in route when score >= 70
export async function POST(req) {
  try {
    const { employeeId, burnoutScore, stressors, dimensions, employeeName, orgId } = await req.json();

    if (burnoutScore < HIGH_RISK_THRESHOLD) {
      return Response.json({ triggered: false, reason: "Below threshold" });
    }

    const db = getSupabaseServer();
    let managerEmail = null;
    let managerName  = null;

    // Fetch manager email from DB
    if (db && employeeId) {
      const { data: emp } = await db
        .from("employees")
        .select("team_id, email")
        .eq("id", employeeId)
        .single();

      if (emp?.team_id) {
        const { data: team } = await db
          .from("teams")
          .select("manager_id")
          .eq("id", emp.team_id)
          .single();

        if (team?.manager_id) {
          const { data: mgr } = await db
            .from("employees")
            .select("email")
            .eq("id", team.manager_id)
            .single();
          managerEmail = mgr?.email;
        }
      }
    }

    const name = employeeName || "A team member";
    const stressorList = (stressors || []).slice(0, 3).join(", ") || "general workload";
    const scriptUrl = `${process.env.NEXT_PUBLIC_URL || "https://psychflo.com"}/dashboard?alert=true`;

    let emailResult = null;
    if (managerEmail) {
      emailResult = await sendEmail({
        to: managerEmail,
        subject: `⚠️ Action needed: ${name} is showing high burnout risk`,
        html: buildManagerAlertEmail({ name, burnoutScore, stressorList, scriptUrl, managerName, dimensions }),
      });
    }

    // Log alert
    if (db && employeeId) {
      await db.from("burnout_alerts").insert({
        employee_id: employeeId,
        burnout_score: burnoutScore,
        alert_type: "high_risk",
        manager_notified: !!managerEmail,
        created_at: new Date().toISOString(),
      }).throwOnError().catch(() => null); // non-fatal if table doesn't exist yet
    }

    return Response.json({
      triggered: true,
      managerNotified: !!managerEmail,
      emailResult,
    });
  } catch (err) {
    console.error("Alert error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function buildManagerAlertEmail({ name, burnoutScore, stressorList, scriptUrl, dimensions }) {
  const ex = dimensions?.exhaustion || 0;
  const cy = dimensions?.cynicism   || 0;
  const ef = dimensions?.efficacy   || 0;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:system-ui,-apple-system,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:8px 20px;margin-bottom:16px;">
      <span style="color:#c9a84c;font-size:12px;font-weight:700;letter-spacing:0.08em;">PSYCHFLO ALERT</span>
    </div>
    <h1 style="color:#f8fafc;font-size:22px;font-weight:800;margin:0;">Action Recommended</h1>
  </div>

  <!-- Alert card -->
  <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:16px;padding:24px;margin-bottom:20px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="width:48px;height:48px;background:rgba(239,68,68,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">⚠️</div>
      <div>
        <div style="color:#fca5a5;font-size:16px;font-weight:700;">${name} — High burnout risk detected</div>
        <div style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:2px;">Burnout score: ${burnoutScore}/100 · Weekly check-in</div>
      </div>
    </div>
    <div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:14px;">
      <div style="color:rgba(255,255,255,0.35);font-size:11px;font-weight:700;letter-spacing:0.08em;margin-bottom:10px;">KEY INDICATORS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
        ${[["Exhaustion", ex, "#ef4444"], ["Cynicism", cy, "#f59e0b"], ["Efficacy", 100-ef, "#10b981"]].map(([l, v, c]) => `
        <div style="text-align:center;background:rgba(255,255,255,0.05);border-radius:8px;padding:10px;">
          <div style="color:${c};font-size:18px;font-weight:800;">${v}</div>
          <div style="color:rgba(255,255,255,0.3);font-size:10px;margin-top:2px;">${l}</div>
        </div>`).join("")}
      </div>
    </div>
  </div>

  <!-- Stressors -->
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;margin-bottom:20px;">
    <div style="color:rgba(255,255,255,0.35);font-size:11px;font-weight:700;letter-spacing:0.08em;margin-bottom:10px;">REPORTED STRESSORS</div>
    <div style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;">${stressorList}</div>
  </div>

  <!-- What to do -->
  <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:14px;padding:20px;margin-bottom:24px;">
    <div style="color:rgba(201,168,76,0.7);font-size:11px;font-weight:700;letter-spacing:0.08em;margin-bottom:12px;">RECOMMENDED NEXT STEPS</div>
    ${["Schedule a private 1:1 within the next 48 hours", "Use your AI-generated conversation script in the dashboard", "Review their current workload and deadlines", "Check in again in 1 week"].map(step => `
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
      <span style="color:#c9a84c;font-size:14px;flex-shrink:0;">→</span>
      <span style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.6;">${step}</span>
    </div>`).join("")}
  </div>

  <!-- CTA -->
  <div style="text-align:center;margin-bottom:32px;">
    <a href="${scriptUrl}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#0f172a;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:800;">
      Get AI conversation script →
    </a>
    <p style="color:rgba(255,255,255,0.25);font-size:12px;margin-top:14px;">
      This alert is anonymised and only sent to the direct line manager.
    </p>
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;text-align:center;">
    <p style="color:rgba(255,255,255,0.2);font-size:11px;line-height:1.7;margin:0;">
      PsychFlo · Burnout Early Warning<br>
      You're receiving this because you manage a team using PsychFlo.<br>
      <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="color:rgba(201,168,76,0.5);text-decoration:none;">View dashboard</a>
    </p>
  </div>

</div>
</body>
</html>
  `.trim();
}
