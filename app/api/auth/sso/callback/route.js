import { getWorkOS, WORKOS_CLIENT_ID } from "../../../../../lib/workos.js";
import { getSupabaseServer } from "../../../../../lib/supabase.js";
import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_URL || "https://psychflo-website.vercel.app";

// GET /api/auth/sso/callback?code=...
// WorkOS redirects here after IdP authentication
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return Response.redirect(`${BASE}/auth/login?error=sso_cancelled`);
    }

    const workos = getWorkOS();

    // Exchange code for profile
    const { profile } = await workos.sso.getProfileAndToken({
      code,
      clientID: WORKOS_CLIENT_ID,
    });

    const email = profile.email?.toLowerCase();
    const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || email;
    const orgId = profile.organizationId; // WorkOS org ID

    if (!email) {
      return Response.redirect(`${BASE}/auth/login?error=no_email`);
    }

    const db = getSupabaseServer();
    if (!db) return Response.redirect(`${BASE}/auth/login?error=db_error`);

    // Find or create the employee record
    let { data: emp } = await db.from("employees").select("id,org_id,auth_user_id,role").eq("email", email).single();

    // Try to sign in via Supabase auth (or create account)
    let authUserId = emp?.auth_user_id;

    if (!authUserId) {
      // Create Supabase auth user via admin API
      const { data: created, error: createErr } = await db.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name, sso: true },
      });

      if (createErr && createErr.message?.includes("already registered")) {
        // User exists in auth but not linked — find by email
        const { data: { users } } = await db.auth.admin.listUsers();
        const found = users?.find(u => u.email === email);
        authUserId = found?.id;
      } else {
        authUserId = created?.user?.id;
      }
    }

    if (!emp && authUserId) {
      // Find org by WorkOS connection domain
      let supabaseOrgId = null;
      const { data: ssoConn } = await db.from("sso_connections")
        .select("org_id").eq("workos_org_id", orgId).single();
      supabaseOrgId = ssoConn?.org_id;

      // Upsert employee
      const { data: newEmp } = await db.from("employees").upsert({
        email, name, auth_user_id: authUserId,
        org_id: supabaseOrgId,
        role: "employee",
        consent_given: false,
      }, { onConflict: "email" }).select("id,org_id,role").single();
      emp = newEmp;
    } else if (emp && authUserId && !emp.auth_user_id) {
      await db.from("employees").update({ auth_user_id: authUserId, name }).eq("id", emp.id);
    }

    // Create a Supabase session token for this user
    const { data: session } = await db.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${BASE}/dashboard` },
    });

    // Set session cookie — use the access token from the magic link properties
    const accessToken = session?.properties?.hashed_token || session?.properties?.verification_token;

    if (accessToken) {
      const res = Response.redirect(`${BASE}/dashboard`);
      const cookieVal = `sb-access-token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`;
      res.headers.append("Set-Cookie", cookieVal);
      return res;
    }

    // Fallback — redirect to magic link flow
    return Response.redirect(`${BASE}/auth/login?sso=success&email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error("SSO callback error:", err);
    return Response.redirect(`${BASE}/auth/login?error=sso_failed`);
  }
}
