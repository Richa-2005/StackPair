import { pool } from "../../config/db.js";

export async function createRequest({ userId, payload }) {
  const {
    equipmentId,
    requestType,
    title,
    description = null,
    priority = "MEDIUM",
    dueDate = null,
  } = payload;

  const { rows } = await pool.query(
  `INSERT INTO maintenance_requests
    (equipment_id, request_type, status, priority, title, subject, notes,
     created_by_user_id, assigned_to_user_id, scheduled_date)
   VALUES
    ($1, $2::request_type, 'NEW'::request_status, $3::request_priority,
     $4::text, $5::varchar(200), $6::text,
     $7::int, NULL, $8::date)
   RETURNING *`,
  [
    equipmentId,      // $1
    requestType,      // $2
    priority,         // $3
    title,            // $4 -> title
    title,            // $5 -> subject (same value, separate param)
    description,      // $6 -> notes
    userId,           // $7
    dueDate,          // $8
  ]
);

  return rows[0];
}

export async function listRequests({ user }) {
  let where = "";
  let params = [];

  if (user.role === "MANAGER") {
    where = "";
  } else if (user.role === "TECHNICIAN") {
    where = "WHERE mr.assigned_to_user_id = $1";
    params = [user.id];
  } else {
    where = "WHERE mr.created_by_user_id = $1";
    params = [user.id];
  }

  const { rows } = await pool.query(
    `SELECT
      mr.*,
      e.name as equipment_name,
      e.serial_number as equipment_serial,
      au.name as assigned_to_name,
      cu.name as created_by_name
     FROM maintenance_requests mr
     JOIN equipment e ON e.id = mr.equipment_id
     LEFT JOIN users au ON au.id = mr.assigned_to_user_id
     JOIN users cu ON cu.id = mr.created_by_user_id
     ${where}
     ORDER BY mr.created_at DESC`,
    params
  );

  return rows;
}


export async function getMyAssignedRequests({ userId }) {
  const { rows } = await pool.query(
    `SELECT
      mr.*,
      e.name as equipment_name,
      e.serial_number as equipment_serial,
      cu.name as created_by_name
     FROM maintenance_requests mr
     JOIN equipment e ON e.id = mr.equipment_id
     JOIN users cu ON cu.id = mr.created_by_user_id
     WHERE mr.assigned_to_user_id = $1
     ORDER BY mr.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function getRequestById({ id, user }) {
  const { rows } = await pool.query(
    `SELECT
      mr.*,
      e.name as equipment_name,
      e.serial_number as equipment_serial,
      e.location as equipment_location,
      au.name as assigned_to_name,
      cu.name as created_by_name
     FROM maintenance_requests mr
     JOIN equipment e ON e.id = mr.equipment_id
     LEFT JOIN users au ON au.id = mr.assigned_to_user_id
     JOIN users cu ON cu.id = mr.created_by_user_id
     WHERE mr.id = $1`,
    [id]
  );

  const reqRow = rows[0];
  if (!reqRow) return null;

  if (user.role === "MANAGER") return reqRow;
  if (user.role === "TECHNICIAN" && reqRow.assigned_to_user_id === user.id) return reqRow;
  if (user.role === "EMPLOYEE" && reqRow.created_by_user_id === user.id) return reqRow;

  throw { status: 403, message: "Forbidden" };
}

export async function assignRequest({ requestId, assignedToUserId }) {
  const { rows } = await pool.query(
    `UPDATE maintenance_requests
     SET assigned_to_user_id = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [assignedToUserId, requestId]
  );

  if (!rows.length) throw { status: 404, message: "Request not found" };
  return rows[0];
}

export async function updateRequestStatus({ requestId, status, durationHours, user }) {
  const ALLOWED = ["NEW", "IN_PROGRESS", "DONE"];
  if (!ALLOWED.includes(status)) throw { status: 400, message: "Invalid status" };

  // Fetch current request
  const check = await pool.query(
    `SELECT id, assigned_to_user_id, status
     FROM maintenance_requests
     WHERE id = $1`,
    [requestId]
  );

  const row = check.rows[0];
  if (!row) throw { status: 404, message: "Request not found" };

  // TECHNICIAN: must be assigned
  if (user.role === "TECHNICIAN" && row.assigned_to_user_id !== user.id) {
    throw { status: 403, message: "Not assigned to you" };
  }

  // DONE requires durationHours
  if (status === "DONE") {
    const dur = Number(durationHours);
    if (!Number.isFinite(dur) || dur <= 0) {
      throw { status: 400, message: "durationHours is required (must be > 0) when status is DONE" };
    }
  }

  // Perform update
  const { rows } = await pool.query(
    `UPDATE maintenance_requests
     SET status = $1::request_status,
         duration_hours = CASE
           WHEN $1 = 'DONE' THEN $2
           ELSE duration_hours
         END,
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [status, status === "DONE" ? Number(durationHours) : null, requestId]
  );

  return rows[0];
}

export async function getKanban({ user }) {
  let where = "";
  let params = [];

  if (user.role === "MANAGER") {
    where = "";
  } else if (user.role === "TECHNICIAN") {
    where = "WHERE mr.assigned_to_user_id = $1";
    params = [user.id];
  } else {
    where = "WHERE mr.created_by_user_id = $1";
    params = [user.id];
  }

  const { rows } = await pool.query(
    `SELECT
      mr.id, mr.title, mr.subject, mr.status, mr.priority, mr.scheduled_date,
      mr.equipment_id,
      e.name AS equipment_name,
      au.name AS assigned_to_name
     FROM maintenance_requests mr
     JOIN equipment e ON e.id = mr.equipment_id
     LEFT JOIN users au ON au.id = mr.assigned_to_user_id
     ${where}
     ORDER BY mr.updated_at DESC`,
    params
  );

  const grouped = { NEW: [], IN_PROGRESS: [], DONE: [] };
  for (const r of rows) {
    if (!grouped[r.status]) grouped[r.status] = [];
    grouped[r.status].push(r);
  }
  return grouped;
}

export async function getMyRequests({ user }) {
  // manager can optionally view their "my" too, but mostly technicians use it
  const { rows } = await pool.query(
    `SELECT
      mr.*,
      e.name AS equipment_name,
      e.serial_number AS equipment_serial,
      cu.name AS created_by_name
     FROM maintenance_requests mr
     JOIN equipment e ON e.id = mr.equipment_id
     JOIN users cu ON cu.id = mr.created_by_user_id
     WHERE mr.assigned_to_user_id = $1
     ORDER BY mr.updated_at DESC`,
    [user.id]
  );
  return rows;
}

export async function getRequestsByTechnician({ techId }) {
  const { rows } = await pool.query(
    `SELECT
      mr.*,
      e.name AS equipment_name,
      e.serial_number AS equipment_serial,
      cu.name AS created_by_name,
      au.name AS assigned_to_name
     FROM maintenance_requests mr
     JOIN equipment e ON e.id = mr.equipment_id
     JOIN users cu ON cu.id = mr.created_by_user_id
     LEFT JOIN users au ON au.id = mr.assigned_to_user_id
     WHERE mr.assigned_to_user_id = $1
     ORDER BY mr.updated_at DESC`,
    [techId]
  );
  return rows;
}

export async function updateRequest({ requestId, payload }) {
  const {
    scheduledDate = undefined, // "2025-12-30"
    priority = undefined,      // "LOW" | "MEDIUM" | "HIGH"
    notes = undefined,
    title = undefined,
    subject = undefined,
  } = payload;

  // Build dynamic update safely
  const sets = [];
  const vals = [];
  let i = 1;

  if (scheduledDate !== undefined) {
    sets.push(`scheduled_date = $${i}::date`); vals.push(scheduledDate); i++;
  }
  if (priority !== undefined) {
    sets.push(`priority = $${i}::request_priority`); vals.push(priority); i++;
  }
  if (notes !== undefined) {
    sets.push(`notes = $${i}::text`); vals.push(notes); i++;
  }
  if (title !== undefined) {
    sets.push(`title = $${i}::text`); vals.push(title); i++;
  }
  if (subject !== undefined) {
    sets.push(`subject = $${i}::varchar(200)`); vals.push(subject); i++;
  }

  if (sets.length === 0) {
    throw { status: 400, message: "No fields to update" };
  }

  sets.push(`updated_at = NOW()`);

  vals.push(requestId);

  const { rows } = await pool.query(
    `UPDATE maintenance_requests
     SET ${sets.join(", ")}
     WHERE id = $${i}
     RETURNING *`,
    vals
  );

  if (!rows.length) throw { status: 404, message: "Request not found" };
  return rows[0];
}

export async function getCalendarRequests({ user, from, to }) {
  // Defaults: current month range if not provided
  // (frontend can pass from/to explicitly)
  const params = [];
  let i = 1;

  // Role-based visibility (same logic as list/kanban)
  let roleWhere = "";
  if (user.role === "MANAGER") {
    roleWhere = "";
  } else if (user.role === "TECHNICIAN") {
    roleWhere = `AND mr.assigned_to_user_id = $${i++}`;
    params.push(user.id);
  } else {
    roleWhere = `AND mr.created_by_user_id = $${i++}`;
    params.push(user.id);
  }

  // Date filtering (only scheduled ones)
  // from/to can be null, but typically you pass both
  let dateWhere = "";
  if (from) {
    dateWhere += ` AND mr.scheduled_date >= $${i++}::date`;
    params.push(from);
  }
  if (to) {
    dateWhere += ` AND mr.scheduled_date <= $${i++}::date`;
    params.push(to);
  }

  const { rows } = await pool.query(
    `SELECT
      mr.id,
      mr.title,
      mr.subject,
      mr.status,
      mr.priority,
      mr.scheduled_date,
      mr.equipment_id,
      e.name AS equipment_name,
      e.serial_number AS equipment_serial,
      e.location AS equipment_location,
      au.name AS assigned_to_name,
      cu.name AS created_by_name
     FROM maintenance_requests mr
     JOIN equipment e ON e.id = mr.equipment_id
     LEFT JOIN users au ON au.id = mr.assigned_to_user_id
     JOIN users cu ON cu.id = mr.created_by_user_id
     WHERE mr.scheduled_date IS NOT NULL
     ${dateWhere}
     ${roleWhere}
     ORDER BY mr.scheduled_date ASC, mr.updated_at DESC`,
    params
  );

  return rows;
}