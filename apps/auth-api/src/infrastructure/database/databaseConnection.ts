import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.ts";
import configs from "../../config/dotenv.config.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: configs.db_connection_string
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export async function connectDatabase({ retries = 5, delayMs = 2000 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ PostgreSQL connected and healthy");
      return;
    } catch (error) {
      console.error(`❌ Database connection failed (Attempt ${attempt}/${retries})`);
      if (attempt === retries) {
        throw new Error("Could not establish a verified connection to PostgreSQL.");
      }
      await new Promise((res) => setTimeout(res, delayMs * Math.pow(1.5, attempt - 1)));
    }
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    await pool.end();
    console.log("❌ PostgreSQL pool and client disconnected");
  } catch (error) {
    console.error("Error during database disconnection:", error);
  }
}