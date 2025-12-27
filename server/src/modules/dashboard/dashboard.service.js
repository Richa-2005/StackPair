import { pool } from "../../config/db.js";

export async function getStats({ user }) {
  // Scope: MANAGER sees all; TECH sees assigned; EMP sees created
  let where = "";
  let params = [];

  if (user.role === "MANAGER") {
    where = "";
  } else if (user.role === "TECHNICIAN") {
    where = "WHERE assigned_to_user_id = $1";
    params = [user.id];
  } else {
    where = "WHERE created_by_user_id = $1";
    params = [user.id];
  }

  // IMPORTANT: your enum might not include DONE yet.
  // We'll treat "DONE" only if it exists; otherwise you can switch to whatever your enum uses.
  // For now keep it as DONE to match our flow once you add the enum value.
  const q = `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'NEW')::int AS new_count,
      COUNT(*) FILTER (WHERE status = 'IN_PROGRESS')::int AS in_progress_count,
      COUNT(*) FILTER (WHERE status = 'DONE')::int AS done_count,
      COUNT(*) FILTER (
        WHERE scheduled_date IS NOT NULL
          AND scheduled_date < CURRENT_DATE
          AND status <> 'DONE'
      )::int AS overdue_count,
      COALESCE(AVG(duration_hours) FILTER (WHERE status = 'DONE'), 0)::float AS avg_duration_hours
    FROM maintenance_requests
    ${where};
  `;

  const { rows } = await pool.query(q, params);
  return rows[0];
}