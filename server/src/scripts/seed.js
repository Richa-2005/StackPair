import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

async function ensureDb() {
  // optional safety: ensure we are connected
  await pool.query("SELECT 1");
}

async function seed() {
  await ensureDb();

  // 1) Teams
  const teamNames = ["Mechanics", "Electricians", "IT Support"];

  const teamIds = {};
  for (const name of teamNames) {
    const { rows } = await pool.query(
      `INSERT INTO teams (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name`,
      [name]
    );
    teamIds[name] = rows[0].id;
  }

  // 2) Users (technicians + manager)
  // Note: your Admin already exists. We'll "upsert" by email.
  const usersToCreate = [
    { name: "Admin", email: "admin@test.com", password: "123456", role: "MANAGER", teamName: null },

    { name: "Tech Mech 1", email: "mech1@test.com", password: "123456", role: "TECHNICIAN", teamName: "Mechanics" },
    { name: "Tech Mech 2", email: "mech2@test.com", password: "123456", role: "TECHNICIAN", teamName: "Mechanics" },

    { name: "Tech Elec 1", email: "elec1@test.com", password: "123456", role: "TECHNICIAN", teamName: "Electricians" },
    { name: "Tech Elec 2", email: "elec2@test.com", password: "123456", role: "TECHNICIAN", teamName: "Electricians" },

    { name: "Tech IT 1", email: "it1@test.com", password: "123456", role: "TECHNICIAN", teamName: "IT Support" },
    { name: "Tech IT 2", email: "it2@test.com", password: "123456", role: "TECHNICIAN", teamName: "IT Support" },
  ];

  const userIds = {};
  for (const u of usersToCreate) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const teamId = u.teamName ? teamIds[u.teamName] : null;

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, team_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         role = EXCLUDED.role,
         team_id = EXCLUDED.team_id
       RETURNING id, email`,
      [u.name, u.email, passwordHash, u.role, teamId]
    );

    userIds[u.email] = rows[0].id;
  }

  // 3) Equipment (linked to teams, with optional default technician)
  const equipmentList = [
    {
      name: "CNC Machine 01",
      serial: "CNC-0001",
      category: "Mechanical",
      department: "Production",
      employee: null,
      location: "Plant Floor A",
      purchaseDate: "2024-01-10",
      warrantyEnd: "2026-01-10",
      teamName: "Mechanics",
      defaultTechEmail: "mech1@test.com",
    },
    {
      name: "Forklift 02",
      serial: "FL-0002",
      category: "Mechanical",
      department: "Warehouse",
      employee: null,
      location: "Warehouse Bay 2",
      purchaseDate: "2023-06-01",
      warrantyEnd: "2025-06-01",
      teamName: "Mechanics",
      defaultTechEmail: "mech2@test.com",
    },
    {
      name: "Generator Panel",
      serial: "ELEC-0099",
      category: "Electrical",
      department: "Utilities",
      employee: null,
      location: "Utility Room",
      purchaseDate: "2022-11-15",
      warrantyEnd: "2025-11-15",
      teamName: "Electricians",
      defaultTechEmail: "elec1@test.com",
    },
    {
      name: "Office Printer 01",
      serial: "IT-PR-0101",
      category: "IT",
      department: "Admin",
      employee: null,
      location: "Admin Office",
      purchaseDate: "2024-08-20",
      warrantyEnd: "2026-08-20",
      teamName: "IT Support",
      defaultTechEmail: "it1@test.com",
    },
    {
      name: "Laptop - Richa",
      serial: "IT-LAP-777",
      category: "IT",
      department: null,
      employee: "Richa",
      location: "CSE Lab",
      purchaseDate: "2025-02-02",
      warrantyEnd: "2027-02-02",
      teamName: "IT Support",
      defaultTechEmail: "it2@test.com",
    },
  ];

  for (const e of equipmentList) {
    const teamId = teamIds[e.teamName];
    const defaultTechId = e.defaultTechEmail ? userIds[e.defaultTechEmail] : null;

    await pool.query(
      `INSERT INTO equipment
        (name, serial_number, category, department, assigned_employee_name, location,
         purchase_date, warranty_end_date, maintenance_team_id, default_technician_id)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (serial_number) DO UPDATE SET
         name = EXCLUDED.name,
         category = EXCLUDED.category,
         department = EXCLUDED.department,
         assigned_employee_name = EXCLUDED.assigned_employee_name,
         location = EXCLUDED.location,
         purchase_date = EXCLUDED.purchase_date,
         warranty_end_date = EXCLUDED.warranty_end_date,
         maintenance_team_id = EXCLUDED.maintenance_team_id,
         default_technician_id = EXCLUDED.default_technician_id`,
      [
        e.name,
        e.serial,
        e.category,
        e.department,
        e.employee,
        e.location,
        e.purchaseDate,
        e.warrantyEnd,
        teamId,
        defaultTechId,
      ]
    );
  }

  console.log("✅ Seed complete!");
  console.log("Teams:", teamIds);
  console.log("Example logins:");
  console.log("- admin@test.com / 123456 (MANAGER)");
  console.log("- mech1@test.com / 123456 (TECHNICIAN - Mechanics)");
  console.log("- elec1@test.com / 123456 (TECHNICIAN - Electricians)");
  console.log("- it1@test.com / 123456 (TECHNICIAN - IT Support)");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });