import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.ts";
import configs from "../../config/dotenv.config.js";


const adapter = new PrismaPg({ 
    connectionString: configs.db_connection_string 
});

export const prisma = new PrismaClient({ adapter });

export async function connectDatabase() {
  await prisma.$connect();
  console.log("✅ PostgreSQL connected");
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log("❌ PostgreSQL disconnected");
}
