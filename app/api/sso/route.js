import { getSupabaseServer } from "../../../lib/supabase.js";
import { getWorkOS } from "../../../lib/workos.js";
import { cookies } from "next/headers";

async function getAdminOrg(db) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    if (!token) return null;
    const { data: { user } } = await db.auth.getUser(token);
    if (!user) return null;
    const { data: emp } = await db.from("employees")
      .select("org_id, role").eq("auth_user_id", user.id).single();
    if (!emp || emp.role !== "admin") return null;
    return emp.org_id;
  } catch { return null; }
}

// GET /api/sso — get current SSO connection for org
export async function GET() {
  try {
    const db = getSupabaseServer();
    const orgId = await getAdminOrg(db);
    if (!orgId) return Response.json({ error: "Admin access required" }, { status: 403 });

    const { data: conn } = await db.from("sso_connections")
      .select("id, provider, domain, status, workos_connection_id, workos_org_id, created_at")
      .eq("org_id", orgId).single();

    return Response.json({ connection: conn || null });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/sso — create or update SSO connection
export async function POST(req) {
  try {
    const { domain, provider } = await req.json();
    if (!domain || !provider) {
      return Response.json({ error: "domain and provider required" }, { status: 400 });
    }

    const db = getSupabaseServer();
    const orgId = await getAdminOrg(db);
    if (!orgId) return Response.json({ error: "Admin access required" }, { status: 403 });

    if (!process.env.WORKOS_API_KEY) {
      return Response.json({ error: "SSO not configured on this instance" }, { status: 503 });
    }

    const workos = getWorkOS();

    // Get org name from Supabase
    const { data: org } = await db.from("organisations").select("name").eq("id", orgId).single();

    // Create WorkOS organisation if needed
    let { data: existingConn } = await db.from("sso_connections")
      .select("workos_org_id").eq("org_id", orgId).single();

    let workosOrgId = existingConn?.workos_org_id;

    if (!workosOrgId) {
      const workosOrg = await workos.organizations.createOrganization({
        name: org?.name || `PsychFlo Org ${orgId.slice(0, 8)}`,
        domains: [domain],
      });
      workosOrgId = workosOrg.id;
    }

    // Create the SSO connection
    const connection = await workos.sso.createConnection({
      source: "generic_saml",
      organizationId: workosOrgId,
    });

    // Store in Supabase
    await db.from("sso_connections").upsert({
      org_id: orgId,
      provider,
      domain,
      workos_connection_id: connection.id,
      workos_org_id: workosOrgId,
      status: "pending",
    }, { onConflict: "org_id" });

    return Response.json({
      success: true,
      connectionId: connection.id,
      setupUrl: `https://dashboard.workos.com/sso/${connection.id}`,
      status: "pending",
    });
  } catch (err) {
    console.error("SSO create error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/sso — remove SSO connection
export async function DELETE() {
  try {
    const db = getSupabaseServer();
    const orgId = await getAdminOrg(db);
    if (!orgId) return Response.json({ error: "Admin access required" }, { status: 403 });

    const { data: conn } = await db.from("sso_connections")
      .select("workos_connection_id").eq("org_id", orgId).single();

    if (conn?.workos_connection_id && process.env.WORKOS_API_KEY) {
      const workos = getWorkOS();
      await workos.sso.deleteConnection(conn.workos_connection_id).catch(() => null);
    }

    await db.from("sso_connections").delete().eq("org_id", orgId);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
