import { NotFoundError } from "@/utils/error.js";
import type { DbClient } from "@/db/create-db-client.js";
import type { UserRoleType } from "@/db/types.js";
import type { UpdateUser } from "./schema.js";

type UpdateUserDataArgs = {
  dbClient: DbClient;
  id: string;
  payload: UpdateUser;
};

export async function updateUserData({
  dbClient,
  id,
  payload,
}: UpdateUserDataArgs) {
  const user = dbClient
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return await dbClient
    .updateTable("users")
    .set(payload)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
