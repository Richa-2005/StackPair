import "dotenv/config";

export const env = {
  PORT: process.env.PORT || 5050,
  JWT_SECRET: process.env.JWT_SECRET,
};