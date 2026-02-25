import TryCatch from "../../utils/TryCatch";
import { patientLoginService, registerPatientService } from "./auth.service";

export const registerPatient = TryCatch(async (req, res, next) => {
  const payload = req.body;

  const register = await registerPatientService(payload);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: register,
  });
});

export const loginPatient = TryCatch(async (req, res, next) => {
  const payload = req.body;

  const loginUser = await patientLoginService(payload);

  res.status(201).json({
    success: true,
    message: "User login successfully",
    data: loginUser,
  });
});
