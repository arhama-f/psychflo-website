import { getSupabaseServer } from "../../../../lib/supabase.js";
import crypto from "crypto";

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("x-signature");
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (secret) {
    const hash = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (hash !== sig) return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  const eventName = req.headers.get("x-event-name");
  const db = getSupabaseServer();

  const meta = event?.meta?.custom_data || {};
  const orgId = meta.orgId;
  const plan = meta.plan;

  if (!db || !orgId) return Response.json({ received: true });

  switch (eventName) {
    case "order_created":
    case "subscription_created": {
      await db.from("organisations").update({
        plan,
        subscription_status: "active",
        ls_subscription_id: event?.data?.id,
      }).eq("id", orgId);
      break;
    }
    case "subscription_updated": {
      const status = event?.data?.attributes?.status;
      await db.from("organisations").update({
        plan: status === "active" ? plan : "free",
        subscription_status: status,
      }).eq("id", orgId);
      break;
    }
    case "subscription_cancelled":
    case "subscription_expired": {
      await db.from("organisations").update({
        plan: "free",
        subscription_status: "cancelled",
      }).eq("id", orgId);
      break;
    }
  }

  return Response.json({ received: true });
}
