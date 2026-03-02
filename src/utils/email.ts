import nodemailer from "nodemailer";
import { env } from "../config/config";

export const sendMail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
      user: env.SMTP_USER_NAME,
      pass: env.SMTP_PASSWORD,
    },
  } as any);

  await transporter.sendMail({
    from: env.SMTP_USER_NAME,
    to,
    subject,
    text,
  });
};
