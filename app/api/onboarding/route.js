import { getAnthropicClient } from "../../../lib/anthropic.js";

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
    return Response.json(json);
  } catch (err) {
    console.error("Onboarding analysis error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
