import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";
import { sendSlackMessage, sendSlackWebhook, buildCheckinPayload } from "../../../../lib/slack.js";

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

// POST /api/slack/checkin — send a check-in prompt to Slack
export async function POST(req) {
  try {
    const { type, customMessage } = await req.json();
    const db = getSupabaseServer();
    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const { data: conn } = await db.from("hris_connections")
      .select("api_key,client_id,subdomain")
      .eq("org_id", orgId).eq("provider", "slack").single();

    if (!conn) return Response.json({ error: "No Slack connection found" }, { status: 404 });

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://psychflo-website.vercel.app";

    const messages = {
      standup: {
        text: "Time for your daily standup! Share what you worked on yesterday, what you're doing today, and any blockers. Your entries are analysed for psychological safety signals.",
        link: `${baseUrl}/tools/standup`,
      },
      pulse: {
        text: "Quick pulse check — how are you feeling about your work and wellbeing today? Takes 30 seconds.",
        link: `${baseUrl}/tools/burnout`,
      },
      custom: {
        text: customMessage || "Your manager has sent you a check-in request via PsychFlo.",
        link: `${baseUrl}/tools/standup`,
      },
    };

    const { text, link } = messages[type] || messages.standup;
    const payload = buildCheckinPayload({ message: text, linkUrl: link });

    if (conn.client_id && conn.subdomain) {
      await sendSlackMessage(conn.client_id, conn.subdomain, payload);
    } else if (conn.api_key) {
      await sendSlackWebhook(conn.api_key, payload);
    } else {
      return Response.json({ error: "No Slack bot token or webhook configured" }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Slack check-in error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
