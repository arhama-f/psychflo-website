import { getSupabaseServer } from "../../../../lib/supabase.js";
import { sendSlackWebhook, buildAlertPayload } from "../../../../lib/slack.js";

export const runtime = "nodejs";

const BASE = process.env.NEXT_PUBLIC_URL || "https://psychflo-website.vercel.app";

// POST /api/attrition/digest — send weekly flight risk summary via Slack + email
export async function POST(req) {
  try {
    const { org_id } = await req.json();
    if (!org_id) return Response.json({ error: "org_id required" }, { status: 400 });

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "db_error" }, { status: 500 });

    // Get org details + Slack config
    const [{ data: org }, { data: slackConn }] = await Promise.all([
      db.from("organisations").select("name").eq("id", org_id).single(),
      db.from("hris_connections").select("webhook_url, bot_token, channel_id").eq("org_id", org_id).eq("provider", "slack").single(),
    ]);

    // Get latest attrition scores for org
    const { data: employees } = await db
      .from("employees")
      .select("id, name, role")
      .eq("org_id", org_id);

    if (!employees?.length) return Response.json({ sent: false, reason: "no_employees" });

    const empIds = employees.map(e => e.id);
    const { data: scores } = await db
      .from("attrition_scores")
      .select("*")
      .in("employee_id", empIds)
      .order("created_at", { ascending: false });

    // Latest score per employee
    const latestMap = {};
    scores?.forEach(s => { if (!latestMap[s.employee_id]) latestMap[s.employee_id] = s; });

    const enriched = employees
      .map(emp => ({ ...emp, score: latestMap[emp.id] }))
      .filter(e => e.score)
      .sort((a, b) => b.score.risk_score - a.score.risk_score);

    const critical = enriched.filter(e => e.score.risk_level === "critical");
    const high = enriched.filter(e => e.score.risk_level === "high");
    const atRisk = [...critical, ...high];
    const avgRisk = enriched.length
      ? Math.round(enriched.reduce((a, e) => a + e.score.risk_score, 0) / enriched.length)
      : 0;

    // Build Slack Block Kit digest
    const blocks = [
      {
        type: "header",
        text: { type: "plain_text", text: "🚨 Weekly Flight Risk Digest", emoji: true },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${org?.name || "Your Org"}* · Week ending ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}\n\n*${atRisk.length}* employee${atRisk.length !== 1 ? "s" : ""} at high or critical flight risk · Org avg risk score: *${avgRisk}/100*`,
        },
      },
      { type: "divider" },
    ];

    if (atRisk.length === 0) {
      blocks.push({
        type: "section",
        text: { type: "mrkdwn", text: "✅ *No employees at high or critical risk this week.* Keep it up." },
      });
    } else {
      atRisk.slice(0, 5).forEach(emp => {
        const levelEmoji = emp.score.risk_level === "critical" ? "🔴" : "🟠";
        const drivers = (emp.score.drivers || []).slice(0, 2).join(", ");
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${levelEmoji} *${emp.name}* · ${emp.role || "Employee"}\nRisk: *${emp.score.risk_score}/100* · ${emp.score.risk_level?.toUpperCase()}\nKey signals: ${drivers || "See dashboard"}\n_Recommended action: ${emp.score.recommendation || "Review with 1:1"}_`,
          },
        });
      });

      if (atRisk.length > 5) {
        blocks.push({
          type: "section",
          text: { type: "mrkdwn", text: `_…and ${atRisk.length - 5} more at-risk employees. View full report in PsychFlo._` },
        });
      }
    }

    blocks.push(
      { type: "divider" },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View Full Dashboard →", emoji: true },
            style: "primary",
            url: `${BASE}/attrition`,
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Run New Assessment", emoji: true },
            url: `${BASE}/attrition`,
          },
        ],
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: "PsychFlo Predictive Attrition · Powered by AI · <" + BASE + "/sla|SLA 99.9%>" }],
      }
    );

    const payload = { blocks };
    let slackSent = false;

    if (slackConn?.webhook_url) {
      await sendSlackWebhook(slackConn.webhook_url, payload);
      slackSent = true;
    }

    return Response.json({
      sent: true,
      slack: slackSent,
      at_risk_count: atRisk.length,
      critical_count: critical.length,
      high_count: high.length,
      avg_risk: avgRisk,
    });
  } catch (err) {
    console.error("Attrition digest error:", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
