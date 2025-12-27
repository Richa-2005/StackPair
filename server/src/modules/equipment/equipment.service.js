import { pool } from "../../config/db.js";

export async function listEquipment({ search = "", groupBy = "" }) {
  const q = search.trim();

  // Simple search across common fields
  const where = q
    ? `WHERE
        e.name ILIKE $1 OR
        e.serial_number ILIKE $1 OR
        e.category ILIKE $1 OR
        COALESCE(e.department,'') ILIKE $1 OR
        COALESCE(e.assigned_employee_name,'') ILIKE $1 OR
        e.location ILIKE $1`
    : "";

  const params = q ? [`%${q}%`] : [];

  // groupBy is a UI feature; backend returns same rows (frontend can group)
  // but we can expose a computed "groupKey" to help client.
  let groupKeySQL = "NULL::text as group_key";
  if (groupBy === "department") groupKeySQL = "COALESCE(e.department,'Unassigned') as group_key";
  if (groupBy === "employee") groupKeySQL = "COALESCE(e.assigned_employee_name,'Unassigned') as group_key";
  if (groupBy === "category") groupKeySQL = "COALESCE(e.category,'Uncategorized') as group_key";

  const sql = `
    SELECT
      e.*,
      t.name as maintenance_team_name,
      u.name as default_technician_name,
      ${groupKeySQL}
    FROM equipment e
    LEFT JOIN teams t ON t.id = e.maintenance_team_id
    LEFT JOIN users u ON u.id = e.default_technician_id
    ${where}
    ORDER BY e.id DESC
  `;

  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function createEquipment(payload) {
  const {
    name,
    serialNumber,
    category,
    department = null,
    assignedEmployeeName = null,
    location,
    purchaseDate = null,
    warrantyEndDate = null,
    maintenanceTeamId,
    defaultTechnicianId = null,
  } = payload;

  const { rows } = await pool.query(
    `INSERT INTO equipment
      (name, serial_number, category, department, assigned_employee_name, location,
       purchase_date, warranty_end_date, maintenance_team_id, default_technician_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      name,
      serialNumber,
      category,
      department,
      assignedEmployeeName,
      location,
      purchaseDate,
      warrantyEndDate,
      maintenanceTeamId,
      defaultTechnicianId,
    ]
  );

  return rows[0];
}

export async function getEquipmentById(id) {
  const { rows } = await pool.query(
    `SELECT
      e.*,
      t.name as maintenance_team_name,
      u.name as default_technician_name
     FROM equipment e
     JOIN teams t ON t.id = e.maintenance_team_id
     LEFT JOIN users u ON u.id = e.default_technician_id
     WHERE e.id = $1`,
    [id]
  );

  return rows[0] || null;
}

export async function updateEquipment(id, payload) {
  // allow partial updates safely
  const fields = [];
  const values = [];
  let i = 1;

  const map = {
    name: "name",
    serialNumber: "serial_number",
    category: "category",
    department: "department",
    assignedEmployeeName: "assigned_employee_name",
    location: "location",
    purchaseDate: "purchase_date",
    warrantyEndDate: "warranty_end_date",
    maintenanceTeamId: "maintenance_team_id",
    defaultTechnicianId: "default_technician_id",
    isScrapped: "is_scrapped",
  };

  for (const key of Object.keys(map)) {
    if (payload[key] !== undefined) {
      fields.push(`${map[key]} = $${i++}`);
      values.push(payload[key]);
    }
  }

  if (fields.length === 0) return await getEquipmentById(id);

  values.push(id);

  const { rows } = await pool.query(
    `UPDATE equipment
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${i}
     RETURNING *`,
    values
  );

  return rows[0] || null;
}

export async function getEquipmentRequests(equipmentId) {
  const { rows } = await pool.query(
    `SELECT
      mr.*,
      u.name as assigned_to_name,
      cu.name as created_by_name
     FROM maintenance_requests mr
     LEFT JOIN users u ON u.id = mr.assigned_to_user_id
     JOIN users cu ON cu.id = mr.created_by_user_id
     WHERE mr.equipment_id = $1
     ORDER BY mr.created_at DESC`,
    [equipmentId]
  );

  const openCount = rows.filter(
    (r) => r.status === "NEW" || r.status === "IN_PROGRESS"
  ).length;

  return { rows, openCount };
}