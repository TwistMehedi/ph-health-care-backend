import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "./../generated/prisma/enums";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [bearer()],

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
