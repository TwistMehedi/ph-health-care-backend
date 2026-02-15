import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { env } from "../config/config";

export const errorMiddleware = (
  err: Error | ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error caught by middleware:", err);

  const statusCode = err instanceof ErrorHandler ? err.statusCode : 500;

  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.node_env === "development" && {
      stack: err.stack,
    }),
  });
};
