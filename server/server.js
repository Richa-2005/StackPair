import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import authRoutes from "./src/ modules/auth/auth.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { pool } from "./src/config/db.js";
import { requireAuth } from "./src/middleware/auth.js";
import { requireRole } from "./src/middleware/role.js";
import equipmentRoutes from "./src/ modules/equipment/equipment.routes.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());


app.use("/auth", authRoutes);
app.use(errorHandler);
app.get("/health", async (req, res) => {
  try {
    const r = await pool.query("SELECT 1 as ok");
    res.json({ status: "ok", db: r.rows[0].ok });
  } catch (e) {
    res.status(500).json({ status: "error", message: "DB not connected" });
  }
});
app.get("/me", requireAuth, (req, res) => {
  res.json({ data: { user: req.user } });
});
app.get("/admin-only", requireAuth, requireRole("MANAGER"), (req, res) => {
  res.json({ data: "Welcome, manager!" });
});
app.use("/equipment", equipmentRoutes);
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));