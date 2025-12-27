import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db.js";
import { env } from "../../config/env.js";

export async function signupUser({ name, email, password, role }) {
  const hashed = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, hashed, role]
  );

  return rows[0];
}

export async function loginUser({ email, password }) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (!rows.length) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, teamId: user.team_id },
    env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      teamId: user.team_id
    }
  };
}