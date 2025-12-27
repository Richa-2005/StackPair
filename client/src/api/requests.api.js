import api from "./axios"; // your interceptor instance

export const getKanban = () =>
  api.get("/requests/kanban");

export const updateRequestStatus = (id, payload) =>
  api.patch(`/requests/${id}/status`, payload);

export const assignRequest = (id, assignedToUserId) =>
  api.patch(`/requests/${id}/assign`, { assignedToUserId });
