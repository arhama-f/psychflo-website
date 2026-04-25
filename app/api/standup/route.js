import { getAnthropicClient } from "../../../lib/anthropic.js";

export async function POST(req) {
  try {
    const { yesterday, today, blockers } = await req.json();
    if (!yesterday || !today) return Response.json({ error: "Missing standup content" }, { status: 400 });

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are a psychological safety analyst for engineering teams. Analyse standup entries for signals of wellbeing, frustration, blockers, and engagement. Return a JSON object with:
- safetyScore: integer 0-100 (100 = fully safe, 0 = high distress)
- flags: array of strings describing any concerns (empty if none)
- insight: 2-sentence summary of the psychological signals in the entry
- tone: one of "positive", "neutral", "stressed", "frustrated"
Be accurate — a happy, clear standup should score 80-95. Only flag genuine signals.`,
      messages: [{
        role: "user",
        content: `Standup entry:
Yesterday: ${yesterday}
Today: ${today}
Blockers: ${blockers || "None"}

Return only valid JSON.`
      }],
    });

    const raw = message.content[0].text.trim();
    const json = JSON.parse(raw.replace(/^```json\n?/, "").replace(/\n?```$/, ""));
    return Response.json(json);
  } catch (err) {
    console.error("Standup analysis error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
