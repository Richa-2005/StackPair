import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getStatsController } from "./dashboard.controller.js";

const router = Router();

router.get("/stats", requireAuth, getStatsController);

export default router;