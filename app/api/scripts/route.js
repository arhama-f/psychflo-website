import { getAnthropicClient } from "../../../lib/anthropic.js";
import { getSupabaseServer } from "../../../lib/supabase.js";

export async function POST(req) {
  try {
    const { employeeId, employeeName, burnoutScore, stressors, dimensions, managerName } = await req.json();

    if (!burnoutScore) {
      return Response.json({ error: "burnoutScore required" }, { status: 400 });
    }

    const riskLevel = burnoutScore >= 67 ? "high" : burnoutScore >= 34 ? "moderate" : "low";
    const stressorList = (stressors || []).join(", ") || "general workload pressure";
    const name = employeeName || "your team member";
    const manager = managerName || "the manager";

    // Try Claude for personalised script
    let script = null;
    try {
      const client = getAnthropicClient();
      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        system: `You are an expert occupational psychologist and executive coach.
You write practical, empathetic conversation scripts for managers to have with employees showing signs of burnout.
Return ONLY valid JSON. No prose, no markdown outside the JSON.`,
        messages: [{
          role: "user",
          content: `Generate a manager conversation script for this situation:
- Employee: ${name}
- Burnout score: ${burnoutScore}/100 (${riskLevel} risk)
- Primary stressors: ${stressorList}
- Exhaustion score: ${dimensions?.exhaustion || "unknown"}/100
- Cynicism score: ${dimensions?.cynicism || "unknown"}/100
- Efficacy score: ${dimensions?.efficacy || "unknown"}/100

Return JSON with this exact structure:
{
  "context": "1-2 sentence summary of what the data suggests about this employee's situation",
  "before_the_conversation": ["3 bullet points of what to do before the meeting"],
  "opening": "Exact opening words to say (2-3 sentences, warm, not clinical)",
  "key_questions": [
    { "question": "exact question to ask", "why": "why this question helps" },
    { "question": "exact question to ask", "why": "why this question helps" },
    { "question": "exact question to ask", "why": "why this question helps" }
  ],
  "phrases_to_use": ["3-4 exact phrases that show empathy and psychological safety"],
  "phrases_to_avoid": ["3-4 phrases that could make things worse with explanation"],
  "suggested_actions": ["3-4 concrete things the manager can offer or do after the conversation"],
  "closing": "Exact closing words (2-3 sentences, affirming, sets next steps)"
}`
        }]
      });
      script = JSON.parse(message.content[0].text);
    } catch (err) {
      console.error("Claude script generation failed:", err.message);
      script = getFallbackScript(name, riskLevel, stressorList, dimensions);
    }

    // Log that script was generated (audit trail)
    const db = getSupabaseServer();
    if (db && employeeId) {
      await db.from("manager_scripts").insert({
        employee_id: employeeId,
        generated_at: new Date().toISOString(),
        risk_level: riskLevel,
        burnout_score: burnoutScore,
      }).throwOnError().catch(() => null); // non-fatal if table doesn't exist yet
    }

    return Response.json({ script, riskLevel, employeeName: name });
  } catch (err) {
    console.error("Script generation error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function getFallbackScript(name, riskLevel, stressors, dimensions) {
  const isHigh = riskLevel === "high";
  return {
    context: isHigh
      ? `${name}'s data shows ${riskLevel} burnout risk with significant signs of exhaustion and disengagement. This conversation is time-sensitive.`
      : `${name}'s data shows early-to-moderate burnout indicators. A proactive check-in now can prevent escalation.`,
    before_the_conversation: [
      "Book a private 30-minute slot — not a rushed hallway chat",
      "Review any recent changes in their workload, deadlines, or team dynamics",
      "Come with curiosity, not a performance agenda — this is a support conversation"
    ],
    opening: `"${name}, I wanted to set aside some time just for you — not about projects or deadlines, just to see how you're genuinely doing. I've noticed a few things lately and I care about making sure you're okay."`,
    key_questions: [
      { question: "How are you feeling about your work right now — honestly?", why: "Opens the conversation without pressure, signals psychological safety" },
      { question: "What's been weighing on you most recently?", why: "Surfaces real stressors without assuming you already know the answer" },
      { question: "What would make the biggest difference to how you're feeling at work?", why: "Moves toward solutions and shows you're willing to act" }
    ],
    phrases_to_use: [
      `"I hear you, and that makes complete sense given what you've been dealing with."`,
      `"You don't have to have it all figured out — we can work through this together."`,
      `"What would feel most supportive to you right now?"`,
      `"I want to help — what would actually help?"`
    ],
    phrases_to_avoid: [
      `"Everyone is under pressure" — minimises their experience`,
      `"You just need to push through" — dismissive and counterproductive`,
      `"I need you to maintain performance" — this is a support conversation, not a review`,
      `"Have you tried just switching off on weekends?" — oversimplifies a systemic problem`
    ],
    suggested_actions: [
      "Temporarily reduce non-critical deadlines or redistribute 1-2 tasks",
      "Agree a specific check-in date in 1-2 weeks to follow up",
      "Explore whether EAP (Employee Assistance Programme) or flexible working could help",
      "Share that the organisation takes wellbeing seriously and won't penalise them for struggling"
    ],
    closing: `"Thank you for being open with me — it takes courage. I want you to know this conversation stays between us. Let's [specific next step you agreed]. I'll check in with you on [date]. You're valued here and I want us to find a way through this together."`
  };
}
