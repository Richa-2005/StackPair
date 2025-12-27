export const success = (res, data, status = 200) => {
  res.status(status).json({ data });
};