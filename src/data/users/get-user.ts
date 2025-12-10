import type { DbClient } from "@/db/create-db-client.js";
import { NotFoundError } from "@/utils/error.js";

type getUserDataArgs = {
  dbClient: DbClient;
  id: string;
};

export async function getUserData({ dbClient, id }: getUserDataArgs) {
  let user = await dbClient
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
