import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";
import { sendSlackWebhook, sendSlackMessage, buildCheckinPayload } from "../../../../lib/slack.js";

async function getOrgFromSession(db) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    if (!token) return null;
    const { data: { user } } = await db.auth.getUser(token);
    if (!user) return null;
    const { data: emp } = await db.from("employees").select("org_id").eq("auth_user_id", user.id).single();
    return emp?.org_id || null;
  } catch { return null; }
}

// POST /api/slack/connect — save Slack config and send test message
export async function POST(req) {
  try {
    const { webhookUrl, botToken, channelId, action } = await req.json();

    // Test-only mode — no auth needed for demo purposes
    if (action === "test_webhook") {
      if (!webhookUrl) return Response.json({ error: "webhookUrl required" }, { status: 400 });
      await sendSlackWebhook(webhookUrl, {
        text: "✅ PsychFlo is connected! You'll receive safety alerts here when flags are detected.",
      });
      return Response.json({ success: true });
    }

    if (action === "test_checkin") {
      if (!botToken || !channelId) return Response.json({ error: "botToken and channelId required" }, { status: 400 });
      const payload = buildCheckinPayload({
        message: "Time for your daily check-in! How are you feeling about your work and team today?",
        linkUrl: `${process.env.NEXT_PUBLIC_URL || "https://psychflo-website.vercel.app"}/tools/standup`,
      });
      await sendSlackMessage(botToken, channelId, payload);
      return Response.json({ success: true });
    }

    const db = getSupabaseServer();
    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ error: "Not authenticated" }, { status: 401 });

    await db.from("hris_connections").upsert({
      org_id: orgId,
      provider: "slack",
      api_key: webhookUrl || null,
      client_id: botToken || null,
      subdomain: channelId || null,
      status: "connected",
      last_synced_at: new Date().toISOString(),
    }, { onConflict: "org_id,provider" });

    if (webhookUrl) {
      await sendSlackWebhook(webhookUrl, {
        text: "✅ PsychFlo is connected! You'll receive safety alerts here when flags are detected.",
      });
    }

    if (botToken && channelId) {
      const payload = buildCheckinPayload({
        message: "PsychFlo check-in bot is active! Employees will receive daily check-in prompts here.",
        linkUrl: `${process.env.NEXT_PUBLIC_URL || "https://psychflo-website.vercel.app"}/tools/standup`,
      });
      await sendSlackMessage(botToken, channelId, payload);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Slack connect error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/slack/connect — get current Slack config for org
export async function GET() {
  try {
    const db = getSupabaseServer();
    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ connected: false });

    const { data: conn } = await db.from("hris_connections")
      .select("api_key,client_id,subdomain,status")
      .eq("org_id", orgId).eq("provider", "slack").single();

    if (!conn) return Response.json({ connected: false });
    return Response.json({
      connected: true,
      hasWebhook: !!conn.api_key,
      hasBot: !!conn.client_id,
      channelId: conn.subdomain,
    });
  } catch {
    return Response.json({ connected: false });
  }
}
