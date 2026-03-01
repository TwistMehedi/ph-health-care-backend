import { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/config";
import { Speciality } from "../../generated/prisma/client";
import { createToken, verifyToken } from "../../helper/jwt";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { IDoctor } from "./user.interface";
import { getRefreshToken, accessToken } from "../../helper/token";

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

export const aeccessTime = async (
  refreshToken: string,
  sessionToken: string,
) => {
  try {
    if (!refreshToken || !sessionToken) {
      throw new ErrorHandler("Refresh token or session token is missing", 400);
    }

    const session = await prisma.session.update({
      where: {
        token: sessionToken,
      },
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    if (!session) {
      throw new ErrorHandler("Session not found", 404);
    }

    const data = verifyToken(refreshToken, env.REFRESH_TOKEN) as JwtPayload;

    if (!data) {
      throw new ErrorHandler("Invalid refresh token", 401);
    }

    const accessToken = getRefreshToken({
      userId: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
    });

    const getRefreshTokenData = verifyToken(refreshToken, env.REFRESH_TOKEN);

    if (!getRefreshTokenData) {
      throw new ErrorHandler("Invalid refresh token", 401);
    }

    const refreshTokenn = getRefreshToken({
      userId: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
    });

    return {
      session,
      accessToken,
      refreshTokenn,
    };
  } catch (error) {
    console.error("Error in access time increase:", error);
  }
};

export const changePassword = async (
  sessionToken: string,
  currentPassword: string,
  newPassword: string,
) => {
  const session = await auth.api.getSession({
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!session || !session.user) {
    throw new ErrorHandler("Session not found", 404);
  }

  const data = await auth.api.changePassword({
    body: {
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    },
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  const token = accessToken({
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  });

  const refreshToken = getRefreshToken({
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  });

  return {
    ...data,
    accessToken: token,
    refreshToken,
  };
};
