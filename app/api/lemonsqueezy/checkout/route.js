import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

const PLANS = {
  team:       { variantId: process.env.LS_VARIANT_TEAM,       name: "Team" },
  growth:     { variantId: process.env.LS_VARIANT_GROWTH,     name: "Growth" },
  enterprise: { variantId: process.env.LS_VARIANT_ENTERPRISE, name: "Enterprise" },
};

async function lsPost(path, body) {
  const res = await fetch(`https://api.lemonsqueezy.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function POST(req) {
  try {
    if (!process.env.LEMONSQUEEZY_API_KEY) {
      return Response.json({ error: "Payments not configured" }, { status: 503 });
    }

    const { plan, email, orgId } = await req.json();
    const planConfig = PLANS[plan];
    if (!planConfig?.variantId) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://psychflo.com";

    let resolvedOrgId = orgId;
    let resolvedEmail = email;
    const db = getSupabaseServer();

    if (db && !resolvedOrgId) {
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get("sb-access-token")?.value;
        if (token) {
          const { data: { user } } = await db.auth.getUser(token);
          if (user) {
            resolvedEmail = resolvedEmail || user.email;
            const { data: emp } = await db.from("employees").select("org_id").eq("auth_user_id", user.id).single();
            resolvedOrgId = emp?.org_id;
          }
        }
      } catch {}
    }

    const data = await lsPost("checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_options: { embed: false },
          checkout_data: {
            email: resolvedEmail || undefined,
            custom: { orgId: resolvedOrgId || "", plan },
          },
          expires_at: null,
          preview: false,
          test_mode: process.env.NODE_ENV !== "production",
        },
        relationships: {
          store: { data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID } },
          variant: { data: { type: "variants", id: planConfig.variantId } },
        },
      },
    });

    const url = data?.data?.attributes?.url;
    if (!url) throw new Error(data?.errors?.[0]?.detail || "Failed to create checkout");

    return Response.json({ url });
  } catch (err) {
    console.error("LemonSqueezy checkout error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
