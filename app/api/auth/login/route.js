import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return Response.json({ error: "Email and password required" }, { status: 400 });

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) return Response.json({ error: "Invalid email or password" }, { status: 401 });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("sb-access-token", data.session.access_token, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: data.session.expires_in,
      path: "/",
    });
    cookieStore.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
