import { userAc } from "better-auth/plugins/admin/access";
import {
  accessToken,

  // betterAuthToken,
  getRefreshToken,
} from "../../helper/token";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ErrorHandler } from "../../utils/ErrorHandler";
// import { accessToken } from "../../helper/token";

interface IUser {
  name: string;
  email: string;
  password: string;
}

export const registerPatientService = async (payload: IUser) => {
  try {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!data.user) {
      throw new Error("User create fail");
    }

    // const patient = await prisma.$transaction( async(tx)=>{

    // });

    const session = await prisma.session.findFirst({
      where: {
        userId: data.user.id,
      },
    });

    console.log("Session data:", session);

    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "email-verification",
      },
    });

    const token = accessToken({
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    });

    const refreshToken = getRefreshToken({
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    });

    const result = {
      ...data,
      token: data.token,
      accessToken: token,
      refreshToken,
    };

    return result;
  } catch (error) {
    await prisma.user.delete({
      where: {
        email: payload.email,
      },
    });
    throw new ErrorHandler(`Registration failed: ${error}`, 400);
  }
};

export const patientLoginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const data = await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: true,
      },
    });

    // console.log(data);
    const token = accessToken({
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    });

    const refreshToken = getRefreshToken({
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    });

    const result = {
      ...data,
      token: data.token,
      accessToken: token,
      refreshToken,
    };

    return result;
  } catch (error) {
    throw new ErrorHandler(`Login failed: ${error}`, 400);
  }
};

export const verifyOtpService = async (payload: {
  email: string;
  otp: string;
}) => {
  const { email, otp } = payload;

  if (!email || !otp) {
    throw new ErrorHandler("Email and OTP are required", 400);
  }

  try {
    const data = await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
    });

    // console.log("OTP verification data:", data);

    if (!data.user) {
      throw new Error("OTP verification failed");
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });

    const tokenAccess = accessToken({
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    });

    const refreshToken = getRefreshToken({
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
    });

    return { ...data, accessToken: tokenAccess, refreshToken };
  } catch (error) {
    throw new ErrorHandler(`OTP verification failed: ${error}`, 400);
  }
};
