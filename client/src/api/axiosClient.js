import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050",
  headers: { "Content-Type": "application/json" },
});

// attach token automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});