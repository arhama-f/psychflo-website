import { getAnthropicClient } from "../../../lib/anthropic.js";

export async function POST(req) {
  try {
    const { meetingHours, deepWorkHours, interruptions, note } = await req.json();

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 900,
      system: `You are a cognitive load and flow state expert for software engineers. Given a developer's day metrics, return a JSON object with:
- flowScore: integer 0-100 (based on deep work hours, interruptions, meeting load)
- status: "flow" (score>=75), "moderate" (50-74), or "fragmented" (<50)
- summary: 2-sentence personalised assessment
- recommendations: array of 3 specific, actionable strings to improve flow tomorrow
- warning: string or null — if something is especially concerning (e.g. >8 interruptions or >6h meetings)
Base flowScore on: deepWorkHours>=4 is excellent, <=1 is fragmented; interruptions<=3 is excellent, >=10 is critical; meetingHours>5 is high.`,
      messages: [{
        role: "user",
        content: `Today's metrics:
Meeting hours: ${meetingHours}h
Deep work hours: ${deepWorkHours}h
Interruptions: ${interruptions}
Additional note: ${note || "None"}

Return only valid JSON.`
      }],
    });

    const raw = message.content[0].text.trim();
    const json = JSON.parse(raw.replace(/^```json\n?/, "").replace(/\n?```$/, ""));
    return Response.json(json);
  } catch (err) {
    console.error("Cogload analysis error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
