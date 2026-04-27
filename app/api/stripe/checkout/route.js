import Stripe from "stripe";
import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

const PLANS = {
  team:         { priceId: process.env.STRIPE_TEAM_PRICE_ID,       name: "Team",       mode: "subscription" },
  growth:       { priceId: process.env.STRIPE_GROWTH_PRICE_ID,     name: "Growth",     mode: "subscription" },
  enterprise:   { priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID, name: "Enterprise", mode: "subscription" },
  policy_once:  { priceId: process.env.STRIPE_POLICY_ONCE_PRICE_ID, name: "Policy Report", mode: "payment" },
};

export async function POST(req) {
  try {
    const { plan, priceId: directPriceId, orgId, email } = await req.json();

    const stripe = getStripe();
    if (!stripe) return Response.json({ error: "Stripe not configured" }, { status: 503 });

    const db = getSupabaseServer();
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://psychflo.com";
    let customerId = null;
    let resolvedOrgId = orgId;

    // Infer orgId from session if not provided
    if (!resolvedOrgId && db) {
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get("sb-access-token")?.value;
        if (token) {
          const { data: { user } } = await db.auth.getUser(token);
          if (user) {
            const { data: emp } = await db.from("employees").select("org_id").eq("auth_user_id", user.id).single();
            resolvedOrgId = emp?.org_id;
          }
        }
      } catch {}
    }

    if (db && resolvedOrgId) {
      const { data: org } = await db.from("organisations").select("stripe_customer_id").eq("id", resolvedOrgId).single();
      customerId = org?.stripe_customer_id;
    }

    if (!customerId && email) {
      const customer = await stripe.customers.create({ email, metadata: { orgId: resolvedOrgId || "" } });
      customerId = customer.id;
      if (db && resolvedOrgId) {
        await db.from("organisations").update({ stripe_customer_id: customerId }).eq("id", resolvedOrgId);
      }
    }

    // Resolve which price and mode to use
    let priceId = directPriceId;
    let mode = "subscription";

    if (plan && PLANS[plan]) {
      priceId = PLANS[plan].priceId;
      mode = PLANS[plan].mode;
    } else if (directPriceId) {
      // Caller passed a Stripe priceId directly (e.g. from policy tool plan cards)
      mode = "subscription";
    }

    if (!priceId) return Response.json({ error: "Invalid plan or price" }, { status: 400 });

    const sessionParams = {
      customer: customerId || undefined,
      customer_email: customerId ? undefined : email,
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/tools/policy?upgraded=true`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { orgId: resolvedOrgId || "", plan: plan || "custom" },
    };

    if (mode === "subscription") {
      sessionParams.success_url = `${baseUrl}/dashboard?upgraded=true`;
      sessionParams.subscription_data = {
        metadata: { orgId: resolvedOrgId || "", plan: plan || "custom" },
        trial_period_days: 7,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
