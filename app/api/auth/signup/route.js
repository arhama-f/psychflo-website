import { getSupabaseServer } from "../../../../lib/supabase.js";

export async function POST(req) {
  try {
    const { email, password, name, orgName, role, size } = await req.json();

    if (!email || !password || !name || !orgName) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    // 1. Create Supabase auth user
    const { data: authData, error: authError } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // send confirmation email
      user_metadata: { name },
    });

    if (authError) throw new Error(authError.message);

    // 2. Create organisation
    const { data: org, error: orgError } = await db
      .from("organisations")
      .insert({ name: orgName, size })
      .select("id")
      .single();

    if (orgError) throw new Error(orgError.message);

    // 3. Create employee record
    const { error: empError } = await db.from("employees").insert({
      auth_user_id: authData.user.id,
      email,
      org_id: org.id,
      role: role || "manager",
      consent_given: false,
    });

    if (empError) throw new Error(empError.message);

    return Response.json({ success: true, orgId: org.id });
  } catch (err) {
    console.error("Signup error:", err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}
