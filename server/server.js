import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

import { pool } from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { requireAuth } from "./src/middleware/auth.js";
import { requireRole } from "./src/middleware/role.js";

import authRoutes from "./src/modules/auth/auth.routes.js";
import equipmentRoutes from "./src/modules/equipment/equipment.routes.js";
import requestRoutes from "./src/modules/requests/requests.routes.js";
import dashboardRoutes from "./src/modules/dashboard/dashboard.routes.js";

import usersRoutes from "./src/modules/users/users.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    const r = await pool.query("SELECT 1 as ok");
    res.json({ status: "ok", db: r.rows[0].ok });
  } catch {
    res.status(500).json({ status: "error", message: "DB not connected" });
  }
});

app.get("/me", requireAuth, (req, res) => {
  res.json({ data: { user: req.user } });
});

// Routes
app.use("/auth", authRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/requests", requestRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users", usersRoutes);

// Error handler LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

