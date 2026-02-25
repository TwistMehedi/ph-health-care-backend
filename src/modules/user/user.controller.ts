import { ErrorHandler } from "../../utils/ErrorHandler";
import TryCatch from "../../utils/TryCatch";
import { createDoctorService, getDoctorsService } from "./user.service";

export const doctorCreate = TryCatch(async (req, res, next) => {
  const payload = req.body;

  console.log("Payload:", payload);
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
