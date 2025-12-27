import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Missing or invalid token" },
      });
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; 
    next();
  } catch (e) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
    });
  }
}