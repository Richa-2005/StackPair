import { getStats } from "./dashboard.service.js";

export async function getStatsController(req, res, next) {
  try {
    const data = await getStats({ user: req.user });
    res.json({ data });
  } catch (e) {
    next(e);
  }
}