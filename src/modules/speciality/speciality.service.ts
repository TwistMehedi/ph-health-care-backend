import { Speciality } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const specialityService = {
  createSpecialitiService: async (payload: Speciality) => {
    const create = await prisma.speciality.create({
      data: payload,
    });

    return create;
  },
};
