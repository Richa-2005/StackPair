import { axiosClient } from "./axiosClient";

export async function signup(payload) {
  const res = await axiosClient.post("/auth/signup", payload);
  return res.data.data;
}

export async function login(form) {
  const res = await axiosClient.post("/auth/login", form);
  return res.data.data; // { token, user }
}