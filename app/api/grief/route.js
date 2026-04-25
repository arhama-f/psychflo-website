import { getAnthropicClient } from "../../../lib/anthropic.js";

export async function POST(req) {
  try {
    const { entry, prompt } = await req.json();
    if (!entry?.trim()) return Response.json({ error: "No entry provided" }, { status: 400 });

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: `You are a compassionate grief companion trained in Worden's tasks of mourning and continuing bonds theory.
Your response is gentle, human, and never clinical. You hold space without fixing.
Return ONLY valid JSON.`,
      messages: [{
        role: "user",
        content: `Grief prompt: "${prompt}"
Entry: "${entry}"

Return JSON:
{
  "response": string (3-4 warm, human sentences that acknowledge the feeling, validate the experience, and offer gentle companionship — not advice, not silver linings, just presence)
}`,
      }],
    });

    const result = JSON.parse(message.content[0].text);
    return Response.json(result);
  } catch (err) {
    console.error("Grief API error:", err);
    return Response.json({ error: "Unable to respond" }, { status: 500 });
  }
}
