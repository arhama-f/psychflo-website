import { getSupabaseServer } from "../../../lib/supabase.js";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const db = getSupabaseServer();
    if (!db) return Response.json({ plan: "free" });

    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    if (!token) return Response.json({ plan: "free" });

    const { data: { user }, error } = await db.auth.getUser(token);
    if (error || !user) return Response.json({ plan: "free" });

    const { data: employee } = await db
      .from("employees")
      .select("org_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!employee?.org_id) return Response.json({ plan: "free" });

    const { data: org } = await db
      .from("organisations")
      .select("plan, subscription_status")
      .eq("id", employee.org_id)
      .single();

    return Response.json({
      plan: org?.plan || "free",
      status: org?.subscription_status || "inactive",
    });
  } catch {
    return Response.json({ plan: "free" });
  }
}
