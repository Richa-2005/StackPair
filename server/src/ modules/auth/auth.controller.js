import { signupUser, loginUser } from "./auth.service.js";
import { success } from "../../utils/response.js";

export async function signup(req, res, next) {
  try {
    const user = await signupUser(req.body);
    success(res, user, 201);
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    success(res, result);
  } catch (e) {
    next(e);
  }
}