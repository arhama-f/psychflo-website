import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

async function getPersonioToken(clientId, clientSecret) {
  const res = await fetch("https://api.personio.de/v1/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
  });
  if (!res.ok) throw new Error(`Personio auth error: ${res.status}`);
  const data = await res.json();
  return data.data?.token;
}

async function fetchPersonioEmployees(token) {
  const res = await fetch("https://api.personio.de/v1/company/employees?limit=200", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Personio fetch error: ${res.status}`);
  const data = await res.json();
  return data.data || [];
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
    const { clientId, clientSecret } = await req.json();
    if (!clientId || !clientSecret) return Response.json({ error: "clientId and clientSecret required" }, { status: 400 });

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const token = await getPersonioToken(clientId, clientSecret);
    const employees = await fetchPersonioEmployees(token);

    await db.from("hris_connections").upsert({
      org_id: orgId,
      provider: "personio",
      client_id: clientId,
      client_secret: clientSecret,
      status: "connected",
      last_synced_at: new Date().toISOString(),
      employee_count: employees.length,
    }, { onConflict: "org_id,provider" });

    const synced = await syncEmployees(db, orgId, employees);
    return Response.json({ success: true, synced, total: employees.length });
  } catch (err) {
    console.error("Personio connect error:", err);
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
      .select("*").eq("org_id", orgId).eq("provider", "personio").single();
    if (!conn) return Response.json({ error: "No Personio connection found" }, { status: 404 });

    const token = await getPersonioToken(conn.client_id, conn.client_secret);
    const employees = await fetchPersonioEmployees(token);
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

async function syncEmployees(db, orgId, personioEmployees) {
  let { data: defaultTeam } = await db.from("teams")
    .select("id").eq("org_id", orgId).eq("name", "Imported from HRIS").single();

  if (!defaultTeam) {
    const { data: created } = await db.from("teams")
      .insert({ org_id: orgId, name: "Imported from HRIS" }).select("id").single();
    defaultTeam = created;
  }

  let synced = 0;
  for (const record of personioEmployees) {
    const attrs = record.attributes || {};
    const email = attrs.email?.value;
    const firstName = attrs.first_name?.value || "";
    const lastName = attrs.last_name?.value || "";
    const name = [firstName, lastName].filter(Boolean).join(" ");
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
