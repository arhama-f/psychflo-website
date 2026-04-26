import { getWorkOS, WORKOS_CLIENT_ID } from "../../../../lib/workos.js";

const BASE = process.env.NEXT_PUBLIC_URL || "https://psychflo-website.vercel.app";

// GET /api/auth/sso?domain=company.com
// Initiates SSO — redirects user to their identity provider
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain")?.toLowerCase().trim();

    if (!domain) {
      return Response.redirect(`${BASE}/auth/login?error=missing_domain`);
    }

    if (!process.env.WORKOS_API_KEY || !WORKOS_CLIENT_ID) {
      return Response.redirect(`${BASE}/auth/login?error=sso_not_configured`);
    }

    const workos = getWorkOS();

    const authorizationUrl = workos.sso.getAuthorizationURL({
      domain,
      clientID: WORKOS_CLIENT_ID,
      redirectURI: `${BASE}/api/auth/sso/callback`,
    });

    return Response.redirect(authorizationUrl);
  } catch (err) {
    console.error("SSO initiation error:", err);
    const msg = err.message?.includes("No connection") ? "no_connection" : "sso_error";
    return Response.redirect(`${BASE}/auth/login?error=${msg}`);
  }
}
