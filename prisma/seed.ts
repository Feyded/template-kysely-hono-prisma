import { createUsers } from "./data/users.js";
import { createDbClient } from "@/db/create-db-client.js";

const dbClient = createDbClient();

async function main() {
  const users = await createUsers(dbClient);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await dbClient.destroy();
  });
