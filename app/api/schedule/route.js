import { Resend } from "resend";
import { getSupabaseServer } from "../../../lib/supabase.js";

/**
 * POST /api/schedule
 * Called by a weekly cron job (e.g. Vercel Cron, GitHub Actions, or Supabase pg_cron).
 * Sends check-in reminder emails to all employees with active schedules.
 *
 * Secure this endpoint in production:
 * - Set CRON_SECRET env var
 * - Pass it as Authorization: Bearer <CRON_SECRET> header from your cron
 */
export async function POST(req) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const resend = new Resend(process.env.RESEND_API_KEY);
    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "RESEND_API_KEY not configured" }, { status: 503 });
    }

    const today = new Date().toLocaleDateString("en-GB", { weekday: "short" }); // "Mon", "Tue" etc.

    // Fetch employees scheduled for today
    const { data: reminders, error } = await db
      .from("scheduled_reminders")
      .select("employee_id, employees!inner(email, id)")
      .eq("send_day", today)
      .eq("active", true)
      .is("last_sent_at", null) // simple dedup — or use date comparison
      .limit(500); // batch cap

    if (error) throw error;
    if (!reminders || reminders.length === 0) {
      return Response.json({ sent: 0, message: "No reminders scheduled for today" });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://psychflo.com";
    let sent = 0;
    const errors = [];

    for (const r of reminders) {
      const email    = r.employees.email;
      const empId    = r.employees.id;
      const checkInUrl = `${baseUrl}/tools/burnout?employeeId=${empId}`;

      try {
        await resend.emails.send({
          from: "PsychFlo <checkin@psychflo.com>",
          to: email,
          subject: "Your weekly wellbeing check-in (3 minutes)",
          html: buildEmailHtml(checkInUrl),
        });

        // Update last_sent_at
        await db
          .from("scheduled_reminders")
          .update({ last_sent_at: new Date().toISOString() })
          .eq("employee_id", empId);

        sent++;
      } catch (emailErr) {
        errors.push({ email, error: emailErr.message });
      }
    }

    return Response.json({ sent, errors: errors.length, details: errors });
  } catch (err) {
    console.error("Schedule error:", err);
    return Response.json({ error: "Scheduling failed" }, { status: 500 });
  }
}

function buildEmailHtml(checkInUrl) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:520px;margin:40px auto;padding:40px 32px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
    <div style="margin-bottom:24px;">
      <span style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#0f172a;font-size:13px;font-weight:800;padding:5px 12px;border-radius:8px;">PsychFlo</span>
    </div>
    <h1 style="font-size:22px;font-weight:700;color:#f8fafc;margin:0 0 12px;line-height:1.3;">Your weekly wellbeing check-in</h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);margin:0 0 24px;line-height:1.7;">
      This takes 3 minutes. Your responses are anonymous — your manager only ever sees team-level trends, never individual scores.
    </p>
    <a href="${checkInUrl}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#0f172a;font-size:14px;font-weight:800;padding:14px 28px;border-radius:10px;text-decoration:none;">
      Start check-in →
    </a>
    <p style="font-size:11px;color:rgba(255,255,255,0.2);margin:24px 0 0;line-height:1.6;">
      You're receiving this because your organisation uses PsychFlo for wellbeing monitoring.
      <a href="${checkInUrl.split("?")[0]}/unsubscribe?id=${checkInUrl.split("employeeId=")[1]}" style="color:rgba(255,255,255,0.3);">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`.trim();
}
