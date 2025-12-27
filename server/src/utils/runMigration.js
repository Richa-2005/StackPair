import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runSqlFile(relativePath) {
  const fullPath = path.join(__dirname, "../../", relativePath);
  const sql = fs.readFileSync(fullPath, "utf-8");
  await pool.query(sql);
}