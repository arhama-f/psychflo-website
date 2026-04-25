import { getAnthropicClient } from "../../../lib/anthropic.js";

export async function POST(req) {
  try {
    const { managerMessage, scenario, context, history } = await req.json();
    if (!managerMessage?.trim()) return Response.json({ error: "No message provided" }, { status: 400 });

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: `You are an expert organisational psychologist coaching managers.
Evaluate the manager's response in a difficult conversation and give concise, specific feedback.
Return ONLY valid JSON. No markdown, no prose outside the JSON.`,
      messages: [{
        role: "user",
        content: `Scenario: ${scenario}
Context: ${context}
Conversation so far: ${JSON.stringify(history)}
Manager just said: "${managerMessage}"

Return JSON:
{
  "label": string (3-6 word verdict like "Strong — psychologically safe" or "Too directive — leaves no space"),
  "tip": string (1-2 sentences of specific coaching advice grounded in psychology),
  "score": number (1-10, psychological safety quality of this response),
  "employeeReply": string (how the employee might realistically respond to this — 1-2 sentences, authentic and human)
}`,
      }],
    });

    const result = JSON.parse(message.content[0].text);
    return Response.json(result);
  } catch (err) {
    console.error("Coaching API error:", err);
    return Response.json({ error: "Feedback unavailable" }, { status: 500 });
  }
}
