import { axiosClient } from "./axiosClient";

export async function signup(payload) {
  // payload: { name, email, password, role }
  const res = await axiosClient.post("/auth/signup", payload);
  return res.data.data; // because server returns { data: ... }
}

export async function login(payload) {
  // payload: { email, password }
  const res = await axiosClient.post("/auth/login", payload);
  return res.data.data; // { token, user }
}