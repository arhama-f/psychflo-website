import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, company, email, size, note } = body;

    if (!name || !company || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Forward to Anthropic-powered email or just log for now
    // In production: send to a CRM / email service
    console.log("[founding-apply]", { name, company, email, size, note, ts: new Date().toISOString() });

    // Optional: send notification email via a simple fetch to an email API
    // e.g. Resend, Postmark, Mailgun

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[founding-apply]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
