import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "production" | "test";

interface IEnvConfig {
  PORT: string;
  NODE_ENV: string;
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  SESSION_TOKEN_EXPIRES_IN: string;
  SESSION_TOKEN_UPDATE_INTERVAL: string;
  BETTER_AUTH_SECRET: string;
}

const envArray = [
  "PORT",
  "NODE_ENV",
  "ACCESS_TOKEN",
  "REFRESH_TOKEN",
  "ACCESS_TOKEN_EXPIRES_IN",
  "REFRESH_TOKEN_EXPIRES_IN",
  "SESSION_TOKEN_EXPIRES_IN",
  "SESSION_TOKEN_UPDATE_INTERVAL",
  "BETTER_AUTH_SECRET",
] as const;

envArray.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const envConfig = (): IEnvConfig => {
  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as NodeEnv,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN as string,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    SESSION_TOKEN_EXPIRES_IN: process.env.SESSION_TOKEN_EXPIRES_IN as string,
    SESSION_TOKEN_UPDATE_INTERVAL: process.env
      .SESSION_TOKEN_UPDATE_INTERVAL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
  };
};

export const env = envConfig();
