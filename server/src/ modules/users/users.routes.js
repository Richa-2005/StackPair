import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getMe } from "./users.controller.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);

export default router;