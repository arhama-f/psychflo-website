import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

async function getOrgFromSession(db) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    if (!token) return null;
    const { data: { user } } = await db.auth.getUser(token);
    if (!user) return null;
    const { data: emp } = await db.from("employees").select("org_id").eq("auth_user_id", user.id).single();
    return emp?.org_id || null;
  } catch { return null; }
}

// GET /api/integrations/sync — list all connections for this org
export async function GET() {
  try {
    const db = getSupabaseServer();
    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ connections: [] });

    const { data: connections } = await db.from("hris_connections")
      .select("provider, status, last_synced_at, employee_count")
      .eq("org_id", orgId);

    return Response.json({ connections: connections || [] });
  } catch (err) {
    return Response.json({ connections: [] });
  }
}

// POST /api/integrations/sync — import employees from CSV
export async function POST(req) {
  try {
    const { employees } = await req.json();
    if (!Array.isArray(employees) || employees.length === 0) {
      return Response.json({ error: "No employees provided" }, { status: 400 });
    }

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ error: "Not authenticated" }, { status: 401 });

    let { data: defaultTeam } = await db.from("teams")
      .select("id").eq("org_id", orgId).eq("name", "Imported from HRIS").single();

    if (!defaultTeam) {
      const { data: created } = await db.from("teams")
        .insert({ org_id: orgId, name: "Imported from HRIS" }).select("id").single();
      defaultTeam = created;
    }

    let synced = 0;
    for (const emp of employees) {
      const email = (emp.email || "").trim().toLowerCase();
      const name = (emp.name || emp.full_name || [emp.first_name, emp.last_name].filter(Boolean).join(" ")).trim();
      if (!email || !email.includes("@")) continue;

      const { data: existing } = await db.from("employees").select("id").eq("email", email).single();
      if (existing) {
        await db.from("employees").update({ name: name || existing.name, team_id: defaultTeam.id }).eq("id", existing.id);
      } else {
        await db.from("employees").insert({
          email, name, org_id: orgId, team_id: defaultTeam.id, role: "employee", consent_given: false,
        }).onConflict("email").ignore();
      }
      synced++;
    }

    await db.from("hris_connections").upsert({
      org_id: orgId,
      provider: "csv",
      status: "connected",
      last_synced_at: new Date().toISOString(),
      employee_count: synced,
    }, { onConflict: "org_id,provider" });

    return Response.json({ success: true, synced, total: employees.length });
  } catch (err) {
    console.error("CSV sync error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
