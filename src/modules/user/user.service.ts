import { Speciality } from "../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IDoctor } from "./user.interface";

export const createDoctorService = async (payload: IDoctor) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const singUpUser = await auth.api.signUpEmail({
    body: {
      name: payload.doctor.name,
      email: payload.doctor.email,
      password: payload.password,
      role: "DOCTOR",
      needPasswordChange: true,
    },
  });

  const specialities: Speciality[] = [];

  for (const specialitiId of payload.specialitie) {
    const speciality = await prisma.speciality.findUnique({
      where: {
        id: specialitiId,
      },
    });

    if (!speciality) {
      throw new Error(`Speciality with id ${specialitiId} not found`);
    }

    specialities.push(speciality);
  }

  try {
    const doctorData = await prisma.$transaction(async (tx) => {
      const doctor = await tx.doctor.create({
        data: {
          userId: singUpUser.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialityData = specialities.map((speciality) => ({
        doctorId: doctor.id,
        specialtyId: speciality.id,
      }));

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialityData,
      });

      const doctorInfo = await tx.doctor.findUnique({
        where: {
          id: doctor.id,
        },
      });

      return doctorInfo;
    });
    return doctorData;
  } catch (error) {
    console.error("Error creating doctor:", error);
    await prisma.user.delete({
      where: {
        id: singUpUser.user.id,
      },
    });
    throw new Error("Failed to create doctor");
  }
};

export const getDoctorsService = async () => {
  const doctors = await prisma.doctor.findMany();
  return doctors;
};
