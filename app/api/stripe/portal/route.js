import Stripe from "stripe";
import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// POST /api/stripe/portal — redirect to Stripe customer billing portal
export async function POST(req) {
  try {
    const stripe = getStripe();
    if (!stripe) return Response.json({ error: "Stripe not configured" }, { status: 503 });

    const db = getSupabaseServer();
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://psychflo.com";
    let customerId = null;

    // Try to find the customer ID from the authenticated user's org
    if (db) {
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get("sb-access-token")?.value;
        if (token) {
          const { data: { user } } = await db.auth.getUser(token);
          if (user) {
            const { data: emp } = await db.from("employees").select("org_id").eq("auth_user_id", user.id).single();
            if (emp?.org_id) {
              const { data: org } = await db.from("organisations").select("stripe_customer_id").eq("id", emp.org_id).single();
              customerId = org?.stripe_customer_id;
            }
          }
        }
      } catch {}
    }

    // Also allow passing customerId directly from request body
    if (!customerId) {
      try {
        const body = await req.json().catch(() => ({}));
        customerId = body.customerId;
      } catch {}
    }

    if (!customerId) {
      return Response.json({ error: "No billing account found. Please subscribe first." }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/tools/policy`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
