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
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER_NAME: string;
  SMTP_PASSWORD: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
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
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER_NAME",
  "SMTP_PASSWORD",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
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
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_USER_NAME: process.env.SMTP_USER_NAME as string,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  };
};

export const env = envConfig();
