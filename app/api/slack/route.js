import { getSupabaseServer } from "../../../lib/supabase.js";

/**
 * Slack integration — two purposes:
 *
 * POST /api/slack          — send check-in reminder to a Slack channel/user
 * GET  /api/slack?verify=1 — Slack URL verification challenge
 *
 * Setup:
 * 1. Create a Slack app at https://api.slack.com/apps
 * 2. Add "Incoming Webhooks" and "chat:write" bot scope
 * 3. Set SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET in .env.local
 * 4. Optionally set SLACK_DEFAULT_CHANNEL (e.g. "#burnout-checkins")
 */

const SLACK_BOT_TOKEN   = process.env.SLACK_BOT_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

// Slack URL verification
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get("challenge");
  if (challenge) return Response.json({ challenge });
  return Response.json({ status: "Slack integration active" });
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Slack event callback (slash command, event subscription, etc.)
    if (body.type === "url_verification") {
      return Response.json({ challenge: body.challenge });
    }

    const { action, employeeId, slackUserId, teamId } = body;

    if (action === "send_reminder") {
      return await sendReminder(slackUserId, employeeId);
    }

    if (action === "send_team_alert") {
      return await sendTeamAlert(teamId);
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Slack error:", err);
    return Response.json({ error: "Slack integration failed" }, { status: 500 });
  }
}

async function sendReminder(slackUserId, employeeId) {
  if (!SLACK_BOT_TOKEN) {
    return Response.json({ error: "SLACK_BOT_TOKEN not configured" }, { status: 503 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://psychflo.com";
  const checkInUrl = `${baseUrl}/tools/burnout?employeeId=${employeeId}`;

  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      channel: slackUserId, // DM to user
      text: "Your weekly wellbeing check-in is ready",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Your weekly wellbeing check-in* 🔥\n\nTakes 3 minutes. Fully anonymous — your manager only sees team trends, never your individual score.",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "Start check-in →" },
              style: "primary",
              url: checkInUrl,
            },
          ],
        },
      ],
    }),
  });

  const result = await response.json();
  if (!result.ok) throw new Error(result.error);

  // Update last_sent_at in DB
  const db = getSupabaseServer();
  if (db && employeeId) {
    await db
      .from("scheduled_reminders")
      .update({ last_sent_at: new Date().toISOString() })
      .eq("employee_id", employeeId)
      .eq("channel", "slack");
  }

  return Response.json({ success: true, ts: result.ts });
}

async function sendTeamAlert(teamId) {
  if (!SLACK_BOT_TOKEN) {
    return Response.json({ error: "SLACK_BOT_TOKEN not configured" }, { status: 503 });
  }

  const db = getSupabaseServer();
  if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

  // Get team + manager's Slack channel
  const { data: team } = await db
    .from("teams")
    .select("name, manager:employees!manager_id(email)")
    .eq("id", teamId)
    .single();

  if (!team) return Response.json({ error: "Team not found" }, { status: 404 });

  const channel = process.env.SLACK_DEFAULT_CHANNEL || "#people-ops";
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://psychflo.com";

  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      channel,
      text: `⚠️ High burnout risk alert for ${team.name}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `⚠️ *Burnout alert: ${team.name}*\n\nTeam burnout score has exceeded the high-risk threshold. Early intervention is recommended.`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "View team dashboard" },
              style: "danger",
              url: `${baseUrl}/tools/burnout?view=manager&teamId=${teamId}`,
            },
          ],
        },
      ],
    }),
  });

  return Response.json({ success: true });
}
