import { getSupabaseServer } from "../../../lib/supabase.js";
import { getAnthropicClient } from "../../../lib/anthropic.js";

export const runtime = "nodejs";

async function getCoaching(anthropic, { mood, energy, workload, connection, note }) {
  try {
    const moodLabel = ["", "really struggling", "finding things tough", "getting by", "doing well", "thriving"][mood] || "doing ok";
    const prompt = `You are a compassionate workplace wellbeing coach giving a brief, warm micro-coaching message (2-3 sentences max) to an employee who just checked in.

Their check-in:
- Mood: ${mood}/5 (${moodLabel})
- Energy: ${energy}/5
- Workload: ${workload}/5 (1=manageable, 5=overwhelming)
- Team connection: ${connection}/5
- Note: "${note || "none"}"

Write a personalised, human response that:
1. Acknowledges how they're feeling without being patronising
2. Offers one concrete, small action they can take today
3. Is warm but brief — under 60 words

Do not use generic phrases like "I hear you" or "it's okay to feel this way". Be specific and actionable.`;

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    });
    return msg.content[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { mood, energy, workload, connection, note, employee_id, org_id } = body;

    if (!mood || !energy || !workload || !connection) {
      return Response.json({ error: "All ratings required" }, { status: 400 });
    }

    const anthropic = getAnthropicClient();
    const coaching = await getCoaching(anthropic, { mood, energy, workload, connection, note });

    const db = getSupabaseServer();

    let streak = 1;
    if (db && employee_id) {
      // Check yesterday's check-in for streak
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const { data: prev } = await db
        .from("pulse_checkins")
        .select("streak, created_at")
        .eq("employee_id", employee_id)
        .gte("created_at", twoDaysAgo.toISOString())
        .lte("created_at", yesterday.toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      streak = prev ? (prev.streak || 1) + 1 : 1;

      await db.from("pulse_checkins").insert({
        employee_id, org_id,
        mood, energy, workload, connection,
        note: note || null,
        ai_coaching: coaching,
        streak,
      });

      // Log compliance event
      await db.from("compliance_events").insert({
        org_id, employee_id,
        event_type: "assessment_completed",
        iso_clause: "4.2",
        severity: "info",
        event_data: { tool: "pulse", mood, energy, workload, connection },
      }).catch(() => null);
    }

    return Response.json({ coaching, streak, saved: !!(db && employee_id) });
  } catch (err) {
    console.error("Pulse error:", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}

// GET /api/pulse — return last 30 days of pulse for an employee
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employee_id");
    const orgId = searchParams.get("org_id");

    const db = getSupabaseServer();
    if (!db) return Response.json({ checkins: [] });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    if (employeeId) {
      const { data } = await db
        .from("pulse_checkins")
        .select("mood, energy, workload, connection, streak, created_at")
        .eq("employee_id", employeeId)
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: false });
      return Response.json({ checkins: data || [] });
    }

    if (orgId) {
      const { data } = await db
        .from("pulse_checkins")
        .select("mood, energy, workload, connection, created_at")
        .eq("org_id", orgId)
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: false });

      const checkins = data || [];
      const avg = key => checkins.length
        ? (checkins.reduce((a, c) => a + c[key], 0) / checkins.length).toFixed(1)
        : null;

      return Response.json({
        checkins: checkins.length,
        avg_mood: avg("mood"),
        avg_energy: avg("energy"),
        avg_workload: avg("workload"),
        avg_connection: avg("connection"),
      });
    }

    return Response.json({ checkins: [] });
  } catch (err) {
    console.error("Pulse GET error:", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
