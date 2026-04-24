import { getAnthropicClient } from "../../../lib/anthropic.js";

// POST /api/policy
// Accepts { text, fileName, companyName, industry, employees }
// Returns comprehensive policy intelligence analysis
export async function POST(req) {
  try {
    const { text, fileName, companyName, industry, employees } = await req.json();

    if (!text || text.trim().length < 50) {
      return Response.json({ error: "Policy text is too short or could not be read. Please try a .txt file." }, { status: 400 });
    }

    const truncated = text.slice(0, 12000); // Claude context limit buffer
    const company = companyName || "the organisation";
    const emp = parseInt(employees) || 100;

    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: `You are an expert employment lawyer and organisational psychologist analysing HR policies for UK organisations.
You combine legal expertise, behavioural science, and financial modelling.
Return ONLY valid JSON. No prose, no markdown, no explanation outside the JSON object.`,
      messages: [{
        role: "user",
        content: `Analyse this HR policy for ${company} (${industry}, ${emp} employees):

---
${truncated}
---

Return JSON with this EXACT schema (all fields required, use realistic UK-specific values):
{
  "summary": "3-4 sentence plain-language summary of what this policy says and its key risks",
  "jargonDensity": { "score": 0-100, "label": "string", "examples": ["word1", "word2"] },
  "emotionalTone": { "dominant": "string", "score": 0-100, "description": "string" },
  "tribunalRisk": {
    "score": 0-100,
    "color": "#ef4444 or #f59e0b or #10b981",
    "label": "string",
    "estimatedCost": number,
    "topRisks": [{ "risk": "string", "likelihood": "string", "mitigation": "string" }]
  },
  "productivityLoss": {
    "annualCostGBP": number,
    "daysLostPerEmployee": number,
    "cause": "string"
  },
  "retentionCalculator": {
    "turnoverRisk": 0-100,
    "estimatedLeavers": number,
    "replacementCostPerHead": number,
    "totalExposure": number
  },
  "policyROI": {
    "currentCost": number,
    "improvedCost": number,
    "roiMultiplier": "string e.g. 4.2x",
    "timeToROI": "string e.g. 3 months"
  },
  "psychologicalSafety": {
    "score": 0-100,
    "color": "#ef4444 or #f59e0b or #10b981",
    "issues": ["issue1", "issue2"],
    "recommendations": ["rec1", "rec2"]
  },
  "deiScorecard": {
    "overall": 0-100,
    "color": "#ef4444 or #f59e0b or #10b981",
    "dimensions": [
      { "name": "string", "score": 0-100, "flag": "string" }
    ]
  },
  "comprehensionPredictor": {
    "overallScore": 0-100,
    "color": "#ef4444 or #f59e0b or #10b981",
    "readingAge": number,
    "segments": [
      { "group": "string", "comprehension": 0-100, "barrier": "string" }
    ]
  },
  "boardReport": {
    "executiveSummary": "string",
    "keyRisks": [
      { "risk": "string", "financial": "string", "urgency": "High|Medium|Low" }
    ],
    "recommendation": "string"
  },
  "faqs": [
    { "q": "string", "a": "string" },
    { "q": "string", "a": "string" },
    { "q": "string", "a": "string" }
  ],
  "rewrite": "Rewritten version of the policy opening paragraph in plain English, warm tone, jargon-free",
  "complianceFlags": [
    { "issue": "string", "law": "string", "severity": "Critical|High|Medium" }
  ],
  "burnoutRisk": {
    "score": 0-100,
    "color": "#ef4444 or #f59e0b or #10b981",
    "drivers": ["string"],
    "trajectory": "string"
  },
  "cognitiveLoad": {
    "score": 0-100,
    "sentenceComplexity": "string",
    "recommendation": "string"
  },
  "improvements": [
    { "priority": "Immediate|This quarter|This year", "change": "string", "impact": "string" }
  ]
}`
      }]
    });

    const result = JSON.parse(message.content[0].text);
    return Response.json(result);
  } catch (err) {
    console.error("Policy analysis error:", err);
    if (err.message?.includes("JSON")) {
      return Response.json({ error: "Analysis failed — please try a shorter document or plain text file." }, { status: 500 });
    }
    return Response.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
