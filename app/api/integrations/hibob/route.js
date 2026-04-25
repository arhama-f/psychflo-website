import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

async function fetchHibobEmployees(serviceToken) {
  const res = await fetch("https://api.hibob.com/v1/people", {
    headers: {
      Authorization: `Basic ${Buffer.from(serviceToken).toString("base64")}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`HiBob error: ${res.status}`);
  const data = await res.json();
  return data.employees || [];
}

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

export async function POST(req) {
  try {
    const { serviceToken } = await req.json();
    if (!serviceToken) return Response.json({ error: "serviceToken required" }, { status: 400 });

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const employees = await fetchHibobEmployees(serviceToken);

    await db.from("hris_connections").upsert({
      org_id: orgId,
      provider: "hibob",
      api_key: serviceToken,
      status: "connected",
      last_synced_at: new Date().toISOString(),
      employee_count: employees.length,
    }, { onConflict: "org_id,provider" });

    const synced = await syncEmployees(db, orgId, employees);
    return Response.json({ success: true, synced, total: employees.length });
  } catch (err) {
    console.error("HiBob connect error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const { data: conn } = await db.from("hris_connections")
      .select("*").eq("org_id", orgId).eq("provider", "hibob").single();
    if (!conn) return Response.json({ error: "No HiBob connection found" }, { status: 404 });

    const employees = await fetchHibobEmployees(conn.api_key);
    const synced = await syncEmployees(db, orgId, employees);

    await db.from("hris_connections").update({
      last_synced_at: new Date().toISOString(),
      employee_count: employees.length,
    }).eq("id", conn.id);

    return Response.json({ success: true, synced, total: employees.length });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function syncEmployees(db, orgId, hibobEmployees) {
  let { data: defaultTeam } = await db.from("teams")
    .select("id").eq("org_id", orgId).eq("name", "Imported from HRIS").single();

  if (!defaultTeam) {
    const { data: created } = await db.from("teams")
      .insert({ org_id: orgId, name: "Imported from HRIS" }).select("id").single();
    defaultTeam = created;
  }

  let synced = 0;
  for (const emp of hibobEmployees) {
    const email = emp.work?.email || emp.email;
    const name = emp.displayName || [emp.firstName, emp.surname].filter(Boolean).join(" ");
    if (!email) continue;

    const { data: existing } = await db.from("employees").select("id").eq("email", email).single();
    if (existing) {
      await db.from("employees").update({ name, team_id: defaultTeam.id }).eq("id", existing.id);
    } else {
      await db.from("employees").insert({
        email, name, org_id: orgId, team_id: defaultTeam.id, role: "employee", consent_given: false,
      }).onConflict("email").ignore();
    }
    synced++;
  }
  return synced;
}
