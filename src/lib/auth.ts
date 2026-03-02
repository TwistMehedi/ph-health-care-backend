import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "./../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendMail } from "../utils/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  plugins: [
    bearer(),
    emailOTP({
      otpLength: 6,
      expiresIn: 60 * 30,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await sendMail(
            email,
            "Verify Your OTP",
            `Your verification OTP is: ${otp}\n\nThis OTP will expire soon.`,
          );
        }
      },
    }),
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.PATIENT,
      },

      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },

      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
    },
  },

  session: {
    expiresIn: Number(process.env.SESSION_TOKEN_EXPIRES_IN),
    updateInterval: Number(process.env.SESSION_TOKEN_UPDATE_INTERVAL),
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 1000,
    },
  },
});
