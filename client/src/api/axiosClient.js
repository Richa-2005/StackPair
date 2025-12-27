import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

export const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});