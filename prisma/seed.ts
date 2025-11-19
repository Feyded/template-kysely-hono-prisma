import { PrismaClient } from "@prisma/client";
import { createUsers } from "./data/createUsers.js";

const prisma = new PrismaClient();

async function main() {
 const users = await createUsers();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
