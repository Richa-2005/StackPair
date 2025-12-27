import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/role.js";
import { listUsersController } from "./users.controller.js";

const router = Router();

// Only manager should assign, so manager-only is fine
router.get("/", requireAuth, requireRole("MANAGER"), listUsersController);

export default router;