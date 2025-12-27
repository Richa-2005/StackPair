import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

async function getApplied() {
  const { rows } = await pool.query(`SELECT name FROM migrations;`);
  return new Set(rows.map((r) => r.name));
}

async function applyMigration(name, sql) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query(`INSERT INTO migrations (name) VALUES ($1);`, [name]);
    await client.query("COMMIT");
    console.log(`✅ Applied: ${name}`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(`❌ Failed: ${name}`);
    throw e;
  } finally {
    client.release();
  }
}

async function main() {
  const migrationsDir = path.resolve(__dirname, "../../migrations");

  await ensureMigrationsTable();
  const applied = await getApplied();

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`↪️ Skipping: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`➡️ Running: ${file}`);
    await applyMigration(file, sql);
  }

  console.log("🎉 All migrations applied.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});