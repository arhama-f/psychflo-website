import Stripe from "stripe";
import { getSupabaseServer } from "../../../../lib/supabase.js";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");
  const stripe = getStripe();
  if (!stripe) return new Response("Stripe not configured", { status: 503 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  const db = getSupabaseServer();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { orgId, plan } = session.metadata || {};
      if (db && orgId) {
        await db.from("organisations").update({
          plan,
          stripe_subscription_id: session.subscription,
        }).eq("id", orgId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object;
      const orgId = sub.metadata?.orgId;
      if (db && orgId) {
        await db.from("organisations").update({
          plan: sub.status === "active" ? sub.metadata?.plan : "free",
          subscription_status: sub.status,
        }).eq("id", orgId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const orgId = sub.metadata?.orgId;
      if (db && orgId) {
        await db.from("organisations").update({
          plan: "free",
          subscription_status: "cancelled",
        }).eq("id", orgId);
      }
      break;
    }
  }

  return Response.json({ received: true });
}
