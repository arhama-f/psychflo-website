import { getSupabaseServer } from "../../../../lib/supabase.js";
import { cookies } from "next/headers";

// POST /api/schedule/preferences
// Saves the employee's reminder day and channel preference.
export async function POST(req) {
  try {
    const { sendDay, channel, employeeId: bodyEmpId } = await req.json();

    const db = getSupabaseServer();
    if (!db) return Response.json({ success: true, skipped: true });

    // Resolve employee from session if not provided in body
    let employeeId = bodyEmpId;
    if (!employeeId) {
      try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("sb-access-token")?.value;
        if (accessToken) {
          const { data: { user } } = await db.auth.getUser(accessToken);
          if (user) {
            const { data: emp } = await db
              .from("employees")
              .select("id")
              .eq("auth_user_id", user.id)
              .single();
            employeeId = emp?.id;
          }
        }
      } catch {}
    }

    if (!employeeId) {
      return Response.json({ success: true, skipped: true });
    }

    // Upsert reminder preference
    const { error } = await db
      .from("scheduled_reminders")
      .upsert(
        { employee_id: employeeId, send_day: sendDay || "Mon", channel: channel || "email", active: true },
        { onConflict: "employee_id" }
      );

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    console.error("Schedule preferences error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
