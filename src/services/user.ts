import { createUserData } from "@/data/user.js";
import { ConflictError } from "@/utils/error.js";
import { PrismaClient } from "@prisma/client";
import { Session } from "inspector";

const prisma = new PrismaClient();

type CreateUserServiceArgs = {
  payload: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
  };
};

export async function createUserService({ payload }: CreateUserServiceArgs) {
  const emailExist = await prisma.users.findUnique({
    where: { email: payload.email },
  });

  if (emailExist) {
    throw new ConflictError("Email already exist.");
  }

  // return await createUserData(payload);
  return;
}
