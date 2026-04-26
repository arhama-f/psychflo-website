import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

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

// GET /api/slack/oauth — Slack redirects here after user authorizes
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const base = process.env.NEXT_PUBLIC_URL || "https://psychflo-website.vercel.app";

  if (error || !code) {
    return Response.redirect(`${base}/integrations?slack=cancelled`);
  }

  try {
    // Exchange code for access token
    const res = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: `${base}/api/slack/oauth`,
      }),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.error);

    const botToken = data.access_token;
    const webhookUrl = data.incoming_webhook?.url;
    const channelId = data.incoming_webhook?.channel_id;
    const teamName = data.team?.name;

    const db = getSupabaseServer();
    const orgId = await getOrgFromSession(db);

    if (orgId) {
      await db.from("hris_connections").upsert({
        org_id: orgId,
        provider: "slack",
        api_key: webhookUrl || null,
        client_id: botToken,
        subdomain: channelId || null,
        status: "connected",
        last_synced_at: new Date().toISOString(),
        employee_count: 0,
      }, { onConflict: "org_id,provider" });
    }

    // Send welcome message to the connected channel
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `✅ *PsychFlo is now connected to ${teamName || "your workspace"}!*\n\nYou'll receive safety alerts here when flags are detected in standups or onboarding check-ins. Managers can also trigger check-in prompts from the PsychFlo dashboard.`,
        }),
      });
    }

    return Response.redirect(`${base}/integrations?slack=connected`);
  } catch (err) {
    console.error("Slack OAuth error:", err);
    return Response.redirect(`${base}/integrations?slack=error&msg=${encodeURIComponent(err.message)}`);
  }
}
