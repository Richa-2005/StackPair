import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/role.js";
import {
  createRequestController,
  listRequestsController,
  getRequestController,
  assignRequestController,
  updateStatusController,
  myRequestsController,
  assignedByTechController,
  updateRequestController,
} from "./requests.controller.js";
import { kanbanController } from "./requests.controller.js";
import { calendarController } from "./requests.controller.js";

const router = Router();

router.use(requireAuth);


router.get("/calendar", requireRole("MANAGER", "TECHNICIAN", "EMPLOYEE"), calendarController);
// Create
router.post("/", createRequestController);

// List (role-based)
router.get("/", listRequestsController);

router.get("/kanban", requireAuth, kanbanController);
router.get("/my", requireRole("TECHNICIAN", "MANAGER"), myRequestsController);
router.get(
  "/assigned/:techId",
  requireRole("MANAGER"),
  assignedByTechController
);
router.patch("/:id", requireRole("MANAGER"), updateRequestController);
// Detail
router.get("/:id", getRequestController);

// Assign (MANAGER only)
router.patch("/:id/assign", requireRole("MANAGER"), assignRequestController);

// Status update (MANAGER or TECHNICIAN)
router.patch("/:id/status", requireRole("MANAGER", "TECHNICIAN"), updateStatusController);

export default router;