import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
};
