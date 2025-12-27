export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};