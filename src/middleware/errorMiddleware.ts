import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { env } from "../config/config";
import { deleteCloudinaryImage } from "../config/cloudinary";

export const errorMiddleware = async (
  err: Error | ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error caught by middleware:", err);

  if (req.file) {
    const publicId = req.file?.filename;
    await deleteCloudinaryImage(publicId);
    console.log("Deleted uploaded file due to error:", publicId);
  }

  const statusCode = err instanceof ErrorHandler ? err.statusCode : 500;

  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
