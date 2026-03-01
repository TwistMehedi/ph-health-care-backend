import { ErrorHandler } from "../../utils/ErrorHandler";
import TryCatch from "../../utils/TryCatch";
import { patientLoginService, registerPatientService } from "./auth.service";

export const registerPatient = TryCatch(async (req, res, next) => {
  const payload = req.body;

  const result = await registerPatientService(payload);

  if (!result) {
    return next(new ErrorHandler("Registration fails", 400));
  }

  const { accessToken, refreshToken, ...register } = result;

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie("better-auth.session_token", register.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json({
      success: true,
      message: "User created successfully",
      data: register,
    });
});

export const loginPatient = TryCatch(async (req, res, next) => {
  const payload = req.body;
  // console.log(payload);
  const result = await patientLoginService(payload);

  // console.log(result);
  if (!result) {
    return next(new ErrorHandler("Login in fail", 400));
  }

  const { accessToken, refreshToken, ...login } = result;

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie("better-auth.session_token", login.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json({
      success: true,
      message: "User login successfully",
      data: {
        accessToken,
        refreshToken,
        token: login.token,
        login,
      },
    });
});
