import { JwtPayload } from "jsonwebtoken";
import { env } from "../config/config";
import { createToken } from "./jwt";

export const accessToken = (payload: JwtPayload) => {
  const token = createToken(payload, env.ACCESS_TOKEN, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });
  return token;
};

export const getRefreshToken = (payload: JwtPayload) => {
  const token = createToken(payload, env.REFRESH_TOKEN, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });
  return token;
};

// export const betterAuthToken = (payload: JwtPayload) => {
//   const token = createToken(payload, env.ACCESS_TOKEN, {
//     expiresIn: env.SESSION_TOKEN_EXPIRES_IN,
//   });
//   return token;
// };
