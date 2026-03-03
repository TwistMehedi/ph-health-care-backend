import { prisma } from "../../lib/prisma";
import { ErrorHandler } from "../../utils/ErrorHandler";
import TryCatch from "../../utils/TryCatch";
import { specialityService } from "./speciality.service";

const specialitiController = {
  createSpecialiti: TryCatch(async (req, res, next) => {
    const { title, experiance } = req.body;

    const image = req.file?.path;
    // const image = req.file;

    if (!image) {
      return next(new ErrorHandler("Image is required", 400));
    }

    if (!title || !experiance) {
      const missing = !title ? "title" : "experiance";
      return next(new ErrorHandler(`${missing} is required`, 400));
    }

    const speciality = await specialityService.createSpecialitiService({
      ...req.body,
      icon: image,
    });

    if (!speciality) {
      return next(new ErrorHandler("Failed to create Speciality", 500));
    }

    res.status(201).json({
      success: true,
      message: "Speciality Created Successfully",
      data: speciality,
    });
  }),

  specialities: TryCatch(async (req, res, next) => {
    const specialities = await prisma.speciality.findMany();

    res.status(200).json({
      success: true,
      message: "Specialities get successfully",
      data: specialities,
    });
  }),

  deleteSpeciality: TryCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("Speciality not found", 404));
    }

    const deletedSpeciality = await prisma.speciality.delete({
      where: {
        id: id as string,
      },
    });

    res.status(200).json({
      success: true,
      message: "Speciality deleted successfully",
      data: deletedSpeciality,
    });
  }),
};

export default specialitiController;
