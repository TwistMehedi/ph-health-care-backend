import { ErrorHandler } from "../../utils/ErrorHandler";
import TryCatch from "../../utils/TryCatch";
import {
  aeccessTime,
  changePassword,
  createDoctorService,
  getDoctorsService,
} from "./user.service";
import { sendResponse } from "../../helper/jwt";

export const doctorCreate = TryCatch(async (req, res, next) => {
  const payload = req.body;

  const create = await createDoctorService(payload);
  if (!create) {
    next(new ErrorHandler("Doctor created problem", 400));
  }

  res.status(201).json({
    success: true,
    message: "Doctor created successfully",
    data: create,
  });
});

export const doctors = TryCatch(async (req, res, next) => {
  const doctors = await getDoctorsService();
  res.status(200).json({
    success: true,
    message: "Doctors retrieved successfully",
    data: doctors,
  });
});

export const tokenTimeIncrease = TryCatch(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  const sessionToken = req.cookies["better-auth.session_token"];

  const result = await aeccessTime(refreshToken, sessionToken);

  if (!result) {
    return next(new ErrorHandler("Failed to increase access time", 400));
  }

  const { session, accessToken, refreshTokenn } = result;

  sendResponse(
    res,
    { session, accessToken, refreshTokenn },
    "Access time increased successfully",
  );
});

export const passwordChange = TryCatch(async (req, res, next) => {
  const sessionToken = req.cookies["better-auth.session_token"];
  const { currentPassword, newPassword } = req.body;

  const result = await changePassword(
    sessionToken,
    currentPassword,
    newPassword,
  );

  const { accessToken, refreshToken, ...data } = result;

  sendResponse(
    res,
    { session: data.token, accessToken, refreshToken },
    "Password Changed successfully",
  );
});
