import { axiosClient } from "./axiosClient";

export const getCalendarRequests = async ({ from, to } = {}) => {
  const res = await axiosClient.get("/requests/calendar", {
    params: { from, to },
  });
  return res.data.data; // must be array
};