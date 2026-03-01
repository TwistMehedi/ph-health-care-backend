import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { UserStatus } from "../generated/prisma/enums";
import { ErrorHandler } from "../utils/ErrorHandler";
import { accessToken } from "../helper/token";
import { verifyToken } from "../helper/jwt";
import { env } from "../config/config";
import { User } from "../generated/prisma/client";

export const authorized =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = req.cookies["better-auth.session_token"];

      // console.log("Session Token:", sessionToken);
      if (!sessionToken) {
        return next(new Error("Unauthorized: No session token provided"));
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        // console.log("Session Exists:", sessionExists);
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);
          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeLeft = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeLeft / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expiry", expiresAt.toISOString());
            res.setHeader("X-Time-Left", timeLeft.toString());
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.SUSPEND
          ) {
            return next(
              new ErrorHandler(
                "Unauthorized: User is blocked or suspended",
                500,
              ),
            );
          }

          req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };

          if (roles.length > 0 && !roles.includes(user.role)) {
            return next(
              new ErrorHandler(
                "Forbidden: You don't have permission to access this resource",
                403,
              ),
            );
          }
        }
      }

      const accessToken = req.cookies["accessToken"];

      // console.log("Access Token:", accessToken);
      if (!accessToken) {
        return next(
          new ErrorHandler("Unauthorized: No access token provided", 401),
        );
      }

      const verify = verifyToken(accessToken, env.ACCESS_TOKEN);

      // console.log("Token Verify:", verify);
      if (!verify) {
        return next(
          new ErrorHandler("Unauthorized: Invalid access token", 401),
        );
      }

      if (roles.length > 0 && !roles.includes(verify.role)) {
        return next(
          new ErrorHandler(
            "Forbidden: You don't have permission to access this resource",
            403,
          ),
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
