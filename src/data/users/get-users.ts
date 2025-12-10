import type { DbClient } from "@/db/create-db-client.js";

type getUsersDataArgs = {
  dbClient: DbClient;
  limit?: number;
  page?: number;
  orderBy?: "asc" | "desc";
};

export async function getUsersData({
  dbClient,
  limit = 10,
  page = 1,
  orderBy = "desc",
}: getUsersDataArgs) {
  let baseQuery = dbClient.selectFrom("users");

  const records = await baseQuery
    .select([
      "id",
      "first_name",
      "middle_name",
      "last_name",
      "role",
      "is_active",
      "email",
      "created_at",
      "updated_at",
    ])
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy("created_at", orderBy)
    .execute();

  const totalRecords = await baseQuery
    .select((eb) => eb.fn.count("id").as("total_records"))
    .executeTakeFirst();

  const totalPages = totalRecords?.total_records
    ? Math.ceil(Number(totalRecords?.total_records) / limit)
    : 0;

  return {
    records,
    total_records: Number(totalRecords?.total_records) ?? 0,
    total_pages: totalPages,
    current_page: page,
    next_page: page < totalPages ? page + 1 : null,
    previous_page: page > 1 ? page - 1 : null,
  };
}
