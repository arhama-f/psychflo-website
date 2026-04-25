import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

// Fetch employees from BambooHR directory API
async function fetchBambooEmployees(subdomain, apiKey) {
  const credentials = Buffer.from(`${apiKey}:x`).toString("base64");
  const res = await fetch(
    `https://api.bamboohr.com/api/gateway.php/${subdomain}/v1/employees/directory`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error(`BambooHR error: ${res.status}`);
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

// POST /api/integrations/bamboohr — connect and do first sync
export async function POST(req) {
  try {
    const { subdomain, apiKey } = await req.json();
    if (!subdomain || !apiKey) return Response.json({ error: "subdomain and apiKey required" }, { status: 400 });

    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ error: "Not authenticated" }, { status: 401 });

    // Test credentials + fetch
    const bambooEmployees = await fetchBambooEmployees(subdomain, apiKey);

    // Upsert connection record
    await db.from("hris_connections").upsert({
      org_id: orgId,
      provider: "bamboohr",
      api_key: apiKey,
      subdomain,
      status: "connected",
      last_synced_at: new Date().toISOString(),
      employee_count: bambooEmployees.length,
    }, { onConflict: "org_id,provider" });

    // Sync employees into PsychFlo
    const synced = await syncEmployees(db, orgId, bambooEmployees, "bamboohr");

    return Response.json({ success: true, synced, total: bambooEmployees.length });
  } catch (err) {
    console.error("BambooHR connect error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/integrations/bamboohr — re-sync existing connection
export async function GET(req) {
  try {
    const db = getSupabaseServer();
    if (!db) return Response.json({ error: "Database not configured" }, { status: 503 });

    const orgId = await getOrgFromSession(db);
    if (!orgId) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const { data: conn } = await db.from("hris_connections")
      .select("*").eq("org_id", orgId).eq("provider", "bamboohr").single();

    if (!conn) return Response.json({ error: "No BambooHR connection found" }, { status: 404 });

    const bambooEmployees = await fetchBambooEmployees(conn.subdomain, conn.api_key);
    const synced = await syncEmployees(db, orgId, bambooEmployees, "bamboohr");

    await db.from("hris_connections").update({
      last_synced_at: new Date().toISOString(),
      employee_count: bambooEmployees.length,
    }).eq("id", conn.id);

    return Response.json({ success: true, synced, total: bambooEmployees.length });
  } catch (err) {
    console.error("BambooHR sync error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function syncEmployees(db, orgId, bambooEmployees, source) {
  // Get or create a default team for HRIS-imported employees
  let { data: defaultTeam } = await db.from("teams")
    .select("id").eq("org_id", orgId).eq("name", "Imported from HRIS").single();

  if (!defaultTeam) {
    const { data: created } = await db.from("teams")
      .insert({ org_id: orgId, name: "Imported from HRIS" }).select("id").single();
    defaultTeam = created;
  }

  let synced = 0;
  for (const emp of bambooEmployees) {
    const email = emp.workEmail || emp.email;
    const name = [emp.firstName, emp.lastName].filter(Boolean).join(" ");
    if (!email) continue;

    // Upsert by email — don't overwrite auth_user_id if already exists
    const { data: existing } = await db.from("employees").select("id").eq("email", email).single();
    if (existing) {
      await db.from("employees").update({ name, team_id: defaultTeam.id }).eq("id", existing.id);
    } else {
      await db.from("employees").insert({
        email,
        name,
        org_id: orgId,
        team_id: defaultTeam.id,
        role: "employee",
        consent_given: false,
      }).onConflict("email").ignore();
    }
    synced++;
  }
  return synced;
}
