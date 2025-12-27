import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/role.js";

import { list, create, getOne, update, requests } from "./equipment.controller.js";

const router = express.Router();

// View (all logged-in users)
router.get("/", requireAuth, list);
router.get("/:id", requireAuth, getOne);
router.get("/:id/requests", requireAuth, requests);

// Create/Update (Manager only)
router.post("/", requireAuth, requireRole("MANAGER"), create);
router.patch("/:id", requireAuth, requireRole("MANAGER"), update);

export default router;