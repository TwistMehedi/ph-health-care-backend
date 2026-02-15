import { NextFunction, Request, Response } from "express";

type ControllerFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | void;

const TryCatch = (controllerFn: ControllerFn) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerFn(req, res, next);
    } catch (error: any) {
      console.error("Error in tryCatch", error);
      next(error);
    }
  };
};

export default TryCatch;
