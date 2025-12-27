import { pool } from "../../config/db.js";

export async function listUsers({ role }) {
  // role is optional; if provided, filter
  if (role) {
    const { rows } = await pool.query(
      `SELECT id, name, email, role
       FROM users
       WHERE role = $1
       ORDER BY name ASC`,
      [role]
    );
    return rows;
  }

  const { rows } = await pool.query(
    `SELECT id, name, email, role
     FROM users
     ORDER BY name ASC`
  );
  return rows;
}