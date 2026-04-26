const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req) {
  try {
    const { name, email, company, size, role, message } = await req.json();
    if (!name || !email || !company) {
      return Response.json({ error: "name, email, company required" }, { status: 400 });
    }

    // Notify the PsychFlo team
    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "PsychFlo <noreply@psychflo.com>",
          to: [process.env.DEMO_NOTIFY_EMAIL || "arhamafaridi@gmail.com"],
          subject: `🎯 New demo request — ${company} (${size || "unknown size"})`,
          html: `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0f172a;color:#f8fafc;border-radius:12px;">
  <h2 style="color:#c9a84c;margin:0 0 20px;">New Demo Request</h2>
  <table style="width:100%;border-collapse:collapse;">
    ${[["Name", name], ["Email", email], ["Company", company], ["Team size", size || "—"], ["Role", role || "—"]].map(([k, v]) => `
    <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
      <td style="padding:10px 0;color:rgba(255,255,255,0.4);font-size:13px;width:120px;">${k}</td>
      <td style="padding:10px 0;color:#f8fafc;font-size:14px;font-weight:600;">${v}</td>
    </tr>`).join("")}
  </table>
  ${message ? `<div style="margin-top:20px;background:rgba(255,255,255,0.05);border-radius:10px;padding:16px;"><p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.06em;">Their challenge</p><p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;line-height:1.7;">${message}</p></div>` : ""}
  <div style="margin-top:24px;padding:16px;background:rgba(201,168,76,0.08);border-radius:10px;border:1px solid rgba(201,168,76,0.2);">
    <p style="color:#c9a84c;font-size:13px;font-weight:700;margin:0 0 6px;">Reply to confirm a time:</p>
    <a href="mailto:${email}" style="color:#c9a84c;font-size:14px;">${email}</a>
  </div>
</div>`,
        }),
      });

      // Auto-reply to the prospect
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Arhama at PsychFlo <arhama@psychflo.com>",
          to: [email],
          subject: `Your PsychFlo demo — confirming shortly`,
          html: `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0f172a;color:#f8fafc;border-radius:12px;">
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:8px 20px;">
      <span style="color:#c9a84c;font-size:12px;font-weight:700;letter-spacing:0.08em;">PSYCHFLO</span>
    </div>
  </div>
  <h2 style="font-size:22px;font-weight:800;color:#f8fafc;margin:0 0 12px;">Hi ${name},</h2>
  <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 20px;">
    Thanks for requesting a demo — I'll send you a calendar link within 2 hours so you can pick a time that works.
  </p>
  <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 28px;">
    While you're waiting, you can take the burnout check-in yourself — no account needed. It takes 3 minutes and gives you a personalised AI analysis.
  </p>
  <div style="text-align:center;margin-bottom:28px;">
    <a href="${process.env.NEXT_PUBLIC_URL || "https://psychflo.com"}/tools/burnout"
      style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#0f172a;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:800;">
      Take the free check-in →
    </a>
  </div>
  <p style="color:rgba(255,255,255,0.35);font-size:13px;line-height:1.7;margin:0;">
    Talk soon,<br/><strong style="color:#f8fafc;">Arhama</strong><br/>
    <span style="color:rgba(255,255,255,0.25);">Founder, PsychFlo</span>
  </p>
</div>`,
        }),
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Demo request error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
