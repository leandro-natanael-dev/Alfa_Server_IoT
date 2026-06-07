import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODEMCU_URL: process.env.NODEMCU_URL || "http://192.168.100.200",
};
