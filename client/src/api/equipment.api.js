import { axiosClient } from "./axiosClient";

// list
export const listEquipment = async ({ search = "", groupBy = "" } = {}) => {
  const res = await axiosClient.get("/equipment", {
    params: { search, groupBy },
  });
  return res.data.data; // rows
};

// detail
export const getEquipment = async (id) => {
  const res = await axiosClient.get(`/equipment/${id}`);
  return res.data.data;
};

// requests for equipment
export const getEquipmentRequests = async (id) => {
  const res = await axiosClient.get(`/equipment/${id}/requests`);
  return res.data.data; // { rows, openCount }
};

// manager actions
export const createEquipment = async (payload) => {
  const res = await axiosClient.post("/equipment", payload);
  return res.data.data;
};

export const updateEquipment = async (id, payload) => {
  const res = await axiosClient.patch(`/equipment/${id}`, payload);
  return res.data.data;
};