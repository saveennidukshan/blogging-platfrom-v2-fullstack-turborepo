import dotenv from 'dotenv'
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "./../../.env");

const result = dotenv.config({
  path: envPath,
});

if (result.error) {
  throw new Error(
    `Failed to load environment variables from ${envPath}: ${result.error.message}`
  );
}

console.log("Environment loaded successfully");



const adapter = new PrismaPg({ 
    connectionString: process.env.DATABASE_URL
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
