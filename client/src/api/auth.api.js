import axiosClient from "./axiosClient";

export const loginUser = async (payload) => {
  const { data } = await axiosClient.post("/auth/login", payload);
  return data;
};

export const signupUser = async (payload) => {
  const { data } = await axiosClient.post("/auth/signup", payload);
  return data;
};
