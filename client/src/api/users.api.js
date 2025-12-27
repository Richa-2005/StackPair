import { axiosClient } from "./axiosClient";

export const getTechnicians = () =>
  axiosClient.get("/users?role=TECHNICIAN");