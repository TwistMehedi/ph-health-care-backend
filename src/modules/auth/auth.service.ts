import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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
    //     await prisma
    // })

    return data;
  } catch (error) {
    console.error("User register error:", error);
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

    return data;
  } catch (error) {
    console.error("User login error:", error);
  }
};
