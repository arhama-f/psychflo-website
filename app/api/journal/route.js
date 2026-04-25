import { getAnthropicClient } from "../../../lib/anthropic.js";

export async function POST(req) {
  try {
    const { entry, prompt, mood } = await req.json();
    if (!entry?.trim()) return Response.json({ error: "No entry provided" }, { status: 400 });

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: `You are a compassionate CBT-trained therapist reviewing a private journal entry.
Your response should be warm, non-judgmental, and grounded in cognitive behavioural therapy and acceptance and commitment therapy principles.
Return ONLY valid JSON.`,
      messages: [{
        role: "user",
        content: `Journaling prompt: "${prompt}"
Mood rating: ${mood}/4 (0=Struggling, 4=Thriving)
Entry: "${entry}"

Return JSON:
{
  "reflection": string (2-3 sentences acknowledging what the person wrote, without judgement),
  "pattern": string (1 sentence identifying a cognitive pattern or theme, framed gently — e.g. 'all-or-nothing thinking' or 'catastrophising'),
  "reframe": string (1-2 sentences offering a CBT reframe or ACT defusion technique),
  "question": string (one open question to deepen reflection, not advice)
}`,
      }],
    });

    const result = JSON.parse(message.content[0].text);
    return Response.json(result);
  } catch (err) {
    console.error("Journal API error:", err);
    return Response.json({ error: "Feedback unavailable" }, { status: 500 });
  }
}
