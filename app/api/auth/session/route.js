import { cookies } from "next/headers";

// POST /api/auth/session — store Supabase session tokens as httpOnly cookies
// Called by the magic link callback page after client-side session exchange
export async function POST(req) {
  try {
    const { accessToken, refreshToken, expiresIn } = await req.json();
    if (!accessToken || !refreshToken) {
      return Response.json({ error: "Tokens required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set("sb-access-token", accessToken, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: expiresIn || 3600,
      path: "/",
    });
    cookieStore.set("sb-refresh-token", refreshToken, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
