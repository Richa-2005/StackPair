import api from "./axios";

export const getTechnicians = () =>
  api.get("/users?role=TECHNICIAN");

