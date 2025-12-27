import { axiosClient } from "./axiosClient";

export const listRequests = async () => {
  const res = await axiosClient.get("/requests");
  return res.data.data; // array
};

import api from "./api";

export const getKanban = async () => {
  const res = await api.get("/requests/kanban");
  return res.data.data; // { NEW:[], IN_PROGRESS:[], DONE:[] }
};

export const updateRequestStatus = async (id, payload) => {
  const res = await api.patch(`/requests/${id}/status`, payload);
  return res.data.data;
};

export const assignRequest = async (id, assignedToUserId) => {
  const res = await api.patch(`/requests/${id}/assign`, { assignedToUserId });
  return res.data.data;
};