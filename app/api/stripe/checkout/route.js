import Stripe from "stripe";
import { getSupabaseServer } from "../../../../lib/supabase.js";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

const PLANS = {
  team:       { priceId: process.env.STRIPE_TEAM_PRICE_ID,       name: "Team",       maxUsers: 50  },
  growth:     { priceId: process.env.STRIPE_GROWTH_PRICE_ID,     name: "Growth",     maxUsers: 200 },
  enterprise: { priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID, name: "Enterprise", maxUsers: null },
};

export async function POST(req) {
  try {
    const { plan, orgId, email } = await req.json();

    if (!PLANS[plan]) return Response.json({ error: "Invalid plan" }, { status: 400 });
    const stripe = getStripe();
    if (!stripe) return Response.json({ error: "Stripe not configured" }, { status: 503 });

    const db = getSupabaseServer();
    let customerId = null;

    if (db && orgId) {
      const { data: org } = await db.from("organisations").select("stripe_customer_id").eq("id", orgId).single();
      customerId = org?.stripe_customer_id;
    }

    if (!customerId && email) {
      const customer = await stripe.customers.create({ email, metadata: { orgId: orgId || "" } });
      customerId = customer.id;
      if (db && orgId) {
        await db.from("organisations").update({ stripe_customer_id: customerId }).eq("id", orgId);
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://psychflo.com";

    const session = await stripe.checkout.sessions.create({
      customer: customerId || undefined,
      customer_email: customerId ? undefined : email,
      mode: "subscription",
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?upgraded=true`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { orgId: orgId || "", plan },
      subscription_data: {
        metadata: { orgId: orgId || "", plan },
        trial_period_days: 14,
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
