import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL   = process.env.DEMO_NOTIFY_EMAIL || "arhamafaridi@gmail.com";
const SITE_URL       = process.env.NEXT_PUBLIC_URL   || "https://psychflo.com";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, company, role, companySize, biggestPeopleChallenge, preferredCallTime } = body;

    if (!name || !email || !company) {
      return NextResponse.json({ error: "name, email, and company are required" }, { status: 400 });
    }

    console.log("[audit-book]", { name, email, company, role, companySize, biggestPeopleChallenge, preferredCallTime, ts: new Date().toISOString() });

    if (RESEND_API_KEY) {
      const rows = [
        ["Name",             name],
        ["Email",            email],
        ["Company",          company],
        ["Role",             role             || "—"],
        ["Company size",     companySize      || "—"],
        ["Preferred time",   preferredCallTime|| "—"],
      ].map(([k, v]) => `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
          <td style="padding:10px 0;color:rgba(255,255,255,0.4);font-size:13px;width:140px;">${k}</td>
          <td style="padding:10px 0;color:#f8fafc;font-size:14px;font-weight:600;">${v}</td>
        </tr>`).join("");

      const challengeBlock = biggestPeopleChallenge
        ? `<div style="margin-top:20px;background:rgba(255,255,255,0.05);border-radius:10px;padding:16px;">
             <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.06em;">Biggest People Challenge</p>
             <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">${biggestPeopleChallenge}</p>
           </div>`
        : "";

      // ── Team notification ──────────────────────────────────────────────────
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from:    "PsychFlo <noreply@psychflo.com>",
          to:      [NOTIFY_EMAIL],
          subject: `📋 New Audit Booking — ${company} (${companySize || "?"})`,
          html: `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0f172a;color:#f8fafc;border-radius:12px;">
  <h2 style="color:#c9a84c;margin:0 0 6px;">New Workforce Risk Audit Booking</h2>
  <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 24px;">Book confirmation received — respond within 2 hours to confirm call time.</p>
  <table style="width:100%;border-collapse:collapse;">${rows}</table>
  ${challengeBlock}
  <div style="margin-top:24px;padding:16px;background:rgba(201,168,76,0.08);border-radius:10px;border:1px solid rgba(201,168,76,0.2);">
    <p style="color:#c9a84c;font-size:13px;font-weight:700;margin:0 0 6px;">Reply to confirm booking:</p>
    <a href="mailto:${email}" style="color:#c9a84c;font-size:14px;">${email}</a>
  </div>
</div>`,
        }),
      });

      // ── Auto-reply to prospect ─────────────────────────────────────────────
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from:    "Arhama at PsychFlo <arhama@psychflo.com>",
          to:      [email],
          subject: `Your Workforce Risk Audit — booking confirmed`,
          html: `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0f172a;color:#f8fafc;border-radius:12px;">
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:8px 20px;">
      <span style="color:#c9a84c;font-size:12px;font-weight:700;letter-spacing:0.08em;">PSYCHFLO</span>
    </div>
  </div>
  <h2 style="font-size:22px;font-weight:800;color:#f8fafc;margin:0 0 12px;">Hi ${name}, your audit is booked.</h2>
  <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;margin:0 0 20px;">
    We've received your Workforce Risk Audit request for ${company}. I'll send a calendar link within 2 hours to confirm your preferred call time.
  </p>
  <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:20px;margin:0 0 24px;">
    <p style="color:#c9a84c;font-size:12px;font-weight:700;margin:0 0 12px;letter-spacing:0.06em;text-transform:uppercase;">What happens next</p>
    ${["We review your diagnostic inputs and start your risk analysis.", "You receive your scored Executive Workforce Report within 48 hours of our call.", "We walk through the findings together and hand over your 30-day action plan."].map((s, i) =>
      `<div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;">
         <span style="color:#c9a84c;font-size:12px;font-weight:800;width:20px;flex-shrink:0;">${i + 1}.</span>
         <span style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;">${s}</span>
       </div>`).join("")}
  </div>
  <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.7;margin:0 0 8px;">
    While you wait, run the free diagnostic to get your preliminary risk scores:
  </p>
  <div style="text-align:center;margin:20px 0 28px;">
    <a href="${SITE_URL}/diagnostic"
      style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f0d080);color:#0f172a;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:800;">
      Run the Free Diagnostic →
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[audit-book]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
