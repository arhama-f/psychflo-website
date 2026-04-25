import { getAnthropicClient } from "../../../lib/anthropic.js";
import { getSupabaseServer } from "../../../lib/supabase.js";
import { cookies } from "next/headers";
import { sendSlackWebhook, buildAlertPayload } from "../../../lib/slack.js";

async function trySlackAlert(result, role) {
  try {
    if (result.riskLevel === "low") return;
    const db = getSupabaseServer();
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    if (!token) return;
    const { data: { user } } = await db.auth.getUser(token);
    if (!user) return;
    const { data: emp } = await db.from("employees").select("org_id").eq("auth_user_id", user.id).single();
    if (!emp?.org_id) return;
    const { data: conn } = await db.from("hris_connections")
      .select("api_key").eq("org_id", emp.org_id).eq("provider", "slack").single();
    if (!conn?.api_key) return;
    const payload = buildAlertPayload({ type: "onboarding", score: result.safetyScore, flags: result.flags, name: role || "New hire", tool: "Onboarding Check-in" });
    await sendSlackWebhook(conn.api_key, payload);
  } catch { /* silent */ }
}

export async function POST(req) {
  try {
    const { answers, role, dayNumber } = await req.json();
    if (!answers || answers.length === 0) return Response.json({ error: "No answers provided" }, { status: 400 });

    const client = getAnthropicClient();
    const answerText = answers.map((a) => `Q: ${a.question} — Score: ${a.score}/5`).join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 900,
      system: `You are an onboarding wellbeing specialist. You analyse check-in survey responses from new hires to detect psychological safety risks and belonging signals. Return a JSON object with:
- safetyScore: integer 0-100 derived from the average scores weighted by importance
- riskLevel: "low" (score>=70), "medium" (50-69), or "high" (<50)
- flags: array of specific concern strings (empty if all good)
- insight: 2-3 sentence warm, empathetic summary for the manager
- managerAction: one concrete recommended action for the manager to take this week`,
      messages: [{
        role: "user",
        content: `New hire check-in:
Role: ${role || "Team member"}
Day: ${dayNumber || "?"}

Responses:
${answerText}

Return only valid JSON.`
      }],
    });

    const raw = message.content[0].text.trim();
    const json = JSON.parse(raw.replace(/^```json\n?/, "").replace(/\n?```$/, ""));
    await trySlackAlert(json, role);
    return Response.json(json);
  } catch (err) {
    console.error("Onboarding analysis error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
