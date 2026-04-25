import { getAnthropicClient } from "../../../lib/anthropic.js";

export async function POST(req) {
  try {
    const { transcript } = await req.json();
    if (!transcript?.trim()) return Response.json({ error: "No transcript provided" }, { status: 400 });

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: `You are a UX research analyst. Analyse interview transcripts and return structured insights.
Return ONLY valid JSON. No prose, no markdown fences.`,
      messages: [{
        role: "user",
        content: `Analyse this user interview transcript and return JSON:

${transcript.slice(0, 8000)}

Return this exact schema:
{
  "summary": string (2-3 sentences on the key finding),
  "insights": [
    { "theme": string, "quote": string (verbatim from transcript), "sentiment": "positive"|"negative"|"neutral", "count": number (1-10 scale of frequency) }
  ],
  "themes": [
    { "name": string, "count": number (1-15), "pct": number (0-100), "color": "#f87171"|"#fb923c"|"#facc15"|"#86efac"|"#c9a84c" }
  ],
  "recommendation": string (one actionable design recommendation)
}

Rules:
- 3-5 insights, grounded in the transcript
- 3-5 themes with decreasing frequency
- Quotes must be paraphrased from the actual transcript text
- sentiment reflects the emotional valence of the theme`,
      }],
    });

    const result = JSON.parse(message.content[0].text);
    return Response.json(result);
  } catch (err) {
    console.error("UX research API error:", err);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
