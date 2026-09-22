import { PrismaClient } from "@prisma/client";
import { env } from "@repo/env/web";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const createClient = () => {
  if (globalThis.prisma) {
    return globalThis.prisma;
  }

  const URL = env.DATABASE_URL;

  const prisma = new PrismaClient({
    datasourceUrl: URL,
  });

  globalThis.prisma = prisma;
  return prisma;
};

export const client = {
  get db() {
    return createClient();
  },
};
//prisma client is a singleton that is created once and reused throughout the application. It is used to interact with the database.
//The createClient function checks if a PrismaClient instance already exists in the global scope, and if so, it returns that instance. 
//If not, it creates a new instance of PrismaClient with the database URL from the environment variables and stores it in the global scope for future use.