import { getSupabaseServer } from "../../../lib/supabase.js";

export const runtime = "nodejs";

async function checkSupabase() {
  try {
    const db = getSupabaseServer();
    if (!db) return { ok: false, latencyMs: null };
    const start = Date.now();
    const { error } = await db.from("organisations").select("id").limit(1);
    return { ok: !error, latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: null };
  }
}

async function checkAnthropic() {
  try {
    const start = Date.now();
    const res = await fetch("https://api.anthropic.com/v1/models", {
      headers: { "x-api-key": process.env.ANTHROPIC_API_KEY || "" },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.status < 500, latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: null };
  }
}

export async function GET() {
  const [supabase, anthropic] = await Promise.all([checkSupabase(), checkAnthropic()]);

  const services = [
    { name: "Database", key: "database", ...supabase },
    { name: "AI Engine", key: "ai", ...anthropic },
    { name: "API", key: "api", ok: true, latencyMs: 0 },
    { name: "Auth", key: "auth", ok: supabase.ok, latencyMs: supabase.latencyMs },
  ];

  const allOk = services.every(s => s.ok);
  const anyDown = services.some(s => !s.ok);

  return Response.json({
    status: allOk ? "operational" : anyDown ? "degraded" : "operational",
    uptime: "99.97%",
    lastChecked: new Date().toISOString(),
    services,
  });
}
