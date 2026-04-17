import { getSupabaseServer } from "../../../../lib/supabase.js";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return Response.json({ error: "Email required" }, { status: 400 });

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const { error } = await db.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      },
    });

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Failed to send magic link" }, { status: 500 });
  }
}
