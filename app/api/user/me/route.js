import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

// GET /api/user/me — returns the authenticated user's employee profile
export async function GET() {
  try {
    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const { data: { user }, error: authErr } = await db.auth.getUser(token);
    if (authErr || !user) return Response.json({ error: "Invalid session" }, { status: 401 });

    const { data: emp, error: empErr } = await db
      .from("employees")
      .select("id, email, name, org_id, team_id, role")
      .eq("auth_user_id", user.id)
      .single();

    if (empErr || !emp) return Response.json({ error: "Employee not found" }, { status: 404 });

    return Response.json({
      employeeId: emp.id,
      email: emp.email,
      name: emp.name || user.user_metadata?.name || "",
      orgId: emp.org_id,
      teamId: emp.team_id,
      role: emp.role,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
