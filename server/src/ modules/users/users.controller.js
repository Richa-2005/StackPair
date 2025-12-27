export function getMe(req, res) {
  res.json({ data: req.user });
}