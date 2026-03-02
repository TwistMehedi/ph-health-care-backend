import { read } from "node:fs";
import { sendResponse } from "../../helper/jwt";
import { ErrorHandler } from "../../utils/ErrorHandler";
import TryCatch from "../../utils/TryCatch";
import {
  patientLoginService,
  registerPatientService,
  verifyOtpService,
} from "./auth.service";

export const registerPatient = TryCatch(async (req, res, next) => {
  const payload = req.body;

  const result = await registerPatientService(payload);

  if (!result) {
    return next(new ErrorHandler("Registration fails", 400));
  }

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: result,
  });
});

export const loginPatient = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const result = await patientLoginService(payload);

  if (!result) {
    return next(new ErrorHandler("Login in fail", 400));
  }

  sendResponse(res, result, "User login successfully");
});

export const verifyOtp = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const result = await verifyOtpService(payload);
  if (!result) {
    return next(new ErrorHandler("OTP verification failed", 400));
  }

  sendResponse(res, result, "OTP verified successfully");
});
