import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";

async function main() {
  try {
    const filePath = path.resolve("migrations/001_init.sql");
    console.log("📄 Running migration:", filePath);

    const sql = fs.readFileSync(filePath, "utf-8");

    if (!sql.trim()) {
      throw new Error("Migration file is empty.");
    }

    await pool.query(sql);

    console.log("✅ Migration applied successfully.");
    await pool.end();
    process.exit(0);
  } catch (e) {
    console.error("❌ Migration failed:", e.message);
    console.error(e);
    await pool.end();
    process.exit(1);
  }
}

main();