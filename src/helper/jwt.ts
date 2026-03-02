import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: { expiresIn: string },
) => {
  const token = jwt.sign(payload, secret, expiresIn as SignOptions);
  return token;
};

export const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const decodedToken = (token: string) => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const sendResponse = (res: any, result: any, message: string) => {
  res
    .cookie("better-auth.session_token", result?.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })
    .cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })
    .cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })
    .status(200)
    .json({
      success: true,
      message,
      data: result,
    });
};
