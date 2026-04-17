import { getSupabaseServer } from "../../../lib/supabase.js";
import { Resend } from "resend";

// POST /api/org — update org settings
export async function POST(req) {
  try {
    const { orgId, sector, name } = await req.json();
    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const { error } = await db
      .from("organisations")
      .update({ sector, name })
      .eq("id", orgId);

    if (error) throw error;
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/org/invite — send invite emails to team
export async function PUT(req) {
  try {
    const { emails, orgId, orgName } = await req.json();

    if (!emails?.length || !orgId) {
      return Response.json({ error: "emails and orgId required" }, { status: 400 });
    }

    const db = getSupabaseServer();
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://psychflo.com";

    const results = [];

    for (const email of emails) {
      // Generate invite token
      const { data: token, error: tokenErr } = await db
        .from("invite_tokens")
        .insert({ email, org_id: orgId, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() })
        .select("id")
        .single();

      if (tokenErr) { results.push({ email, error: tokenErr.message }); continue; }

      const inviteUrl = `${baseUrl}/auth/invite?token=${token.id}&org=${encodeURIComponent(orgName)}`;

      if (resend) {
        await resend.emails.send({
          from: "PsychFlo <noreply@psychflo.com>",
          to: email,
          subject: `${orgName} invited you to PsychFlo`,
          html: buildInviteEmail(orgName, inviteUrl),
        });
      }

      results.push({ email, inviteUrl, sent: !!resend });
    }

    return Response.json({ results });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function buildInviteEmail(orgName, inviteUrl) {
  return `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0a0f1e;font-family:system-ui,sans-serif;">
<div style="max-width:520px;margin:40px auto;padding:40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
  <div style="margin-bottom:24px;"><span style="background:linear-gradient(135deg,#c9a84c,#f0d080);color:#0f172a;font-size:13px;font-weight:800;padding:5px 12px;border-radius:8px;">PsychFlo</span></div>
  <h2 style="font-size:20px;font-weight:700;color:#f8fafc;margin:0 0 12px;">${orgName} invited you to their wellbeing platform</h2>
  <p style="font-size:14px;color:rgba(255,255,255,0.5);margin:0 0 24px;line-height:1.7;">Takes 3 minutes per week. Your individual scores are completely private — your manager only ever sees team-level trends.</p>
  <a href="${inviteUrl}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#0f172a;font-size:14px;font-weight:800;padding:14px 28px;border-radius:10px;text-decoration:none;">Accept invite →</a>
  <p style="font-size:11px;color:rgba(255,255,255,0.2);margin:24px 0 0;">This invite expires in 7 days.</p>
</div></body></html>`.trim();
}
