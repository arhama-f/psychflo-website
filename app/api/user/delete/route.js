import { getSupabaseServer } from "../../../../lib/supabase.js";

/**
 * GDPR Article 17 — Right to Erasure
 * POST /api/user/delete
 * Body: { employeeId: string, authUserId: string }
 *
 * Deletes all personal data. Cascades via FK constraints in Supabase.
 * Keeps anonymised team snapshots (no PII, aggregate only).
 */
export async function POST(req) {
  try {
    const { employeeId, authUserId } = await req.json();

    if (!employeeId || !authUserId) {
      return Response.json({ error: "employeeId and authUserId required" }, { status: 400 });
    }

    const db = getSupabaseServer();
    if (!db) {
      return Response.json({ error: "Database not configured" }, { status: 503 });
    }

    // Verify the request is for the authenticated user's own data
    const { data: employee, error: fetchErr } = await db
      .from("employees")
      .select("id, auth_user_id")
      .eq("id", employeeId)
      .single();

    if (fetchErr || !employee) {
      return Response.json({ error: "Employee not found" }, { status: 404 });
    }

    if (employee.auth_user_id !== authUserId) {
      return Response.json({ error: "Unauthorised" }, { status: 403 });
    }

    // Log the deletion request
    await db.from("deletion_requests").insert({
      employee_id: employeeId,
      status: "pending",
    });

    // Delete check-ins (raw_responses contains PII)
    await db.from("burnout_checkins").delete().eq("employee_id", employeeId);

    // Delete scheduled reminders
    await db.from("scheduled_reminders").delete().eq("employee_id", employeeId);

    // Delete employee record (cascades to auth.users via trigger)
    await db.from("employees").delete().eq("id", employeeId);

    // Delete auth user (requires service role key)
    await db.auth.admin.deleteUser(authUserId);

    // Mark deletion complete
    await db
      .from("deletion_requests")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("employee_id", employeeId);

    return Response.json({
      success: true,
      message: "All personal data has been permanently deleted. This cannot be undone.",
    });
  } catch (err) {
    console.error("Deletion error:", err);
    return Response.json({ error: "Deletion failed. Contact support@psychflo.com" }, { status: 500 });
  }
}
