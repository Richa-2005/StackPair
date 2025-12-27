import { listUsers } from "./users.service.js";

export async function listUsersController(req, res, next) {
  try {
    const { role } = req.query;
    const data = await listUsers({ role });
    res.json({ data });
  } catch (e) {
    next(e);
  }
}