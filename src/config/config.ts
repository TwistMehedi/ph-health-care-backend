import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "production" | "test";

interface IEnvConfig {
  PORT: string;
  NODE_ENV: string;
}

const envArray = ["PORT", "NODE_ENV"] as const;

envArray.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const envConfig = (): IEnvConfig => {
  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as NodeEnv,
  };
};

export const env = envConfig();
