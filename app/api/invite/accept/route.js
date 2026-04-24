import { getSupabaseServer } from "../../../../lib/supabase.js";

export async function POST(req) {
  try {
    const { token, name, password } = await req.json();
    if (!token || !name || !password) return Response.json({ error: "All fields required" }, { status: 400 });

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    // Validate token
    const { data: invite, error: inviteErr } = await db
      .from("invite_tokens")
      .select("email, org_id, used, expires_at")
      .eq("id", token)
      .single();

    if (inviteErr || !invite) return Response.json({ error: "Invalid invite link" }, { status: 400 });
    if (invite.used) return Response.json({ error: "This invite has already been used" }, { status: 400 });
    if (new Date(invite.expires_at) < new Date()) return Response.json({ error: "This invite has expired" }, { status: 400 });

    // Create auth user
    const { data: authData, error: authError } = await db.auth.admin.createUser({
      email: invite.email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) throw new Error(authError.message);

    // Assign to the org's default (first) team
    const { data: defaultTeam } = await db
      .from("teams")
      .select("id")
      .eq("org_id", invite.org_id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    // Create employee record
    await db.from("employees").insert({
      auth_user_id: authData.user.id,
      email: invite.email,
      name,
      org_id: invite.org_id,
      team_id: defaultTeam?.id || null,
      role: "employee",
      consent_given: false,
    });

    // Mark token used
    await db.from("invite_tokens").update({ used: true }).eq("id", token);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Accept invite error:", err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}
