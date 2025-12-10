import type { DbClient } from "@/db/create-db-client.js";
import { ConflictError } from "@/utils/error.js";
import { hash } from "@node-rs/bcrypt";

export type CreateUserDataArgs = {
  dbClient: DbClient;
  payload: {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    password: string;
  };
};
export async function createUserData({
  dbClient,
  payload,
}: CreateUserDataArgs) {
  let baseQuery = dbClient.selectFrom("users");

  const emailExist = await baseQuery
    .where("email", "=", payload.email)
    .executeTakeFirst();

  if (emailExist) {
    throw new ConflictError("Email already exist.");
  }

  const hashPassword = await hash(payload.password, 10);

  const createdUser = await dbClient
    .insertInto("users")
    .values({ ...payload, password: hashPassword })
    .returningAll()
    .executeTakeFirstOrThrow();

  const { password, ...safeUser } = createdUser;

  return safeUser;
}
