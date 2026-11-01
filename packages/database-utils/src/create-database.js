import { PrismaPg } from "@prisma/adapter-pg";

export function createDatabaseClient({
    connectionString,
    serviceName,
    createClient
}) {
    const adapter = new PrismaPg({
        connectionString
    });

    const prisma = createClient(adapter);

    async function connectDatabase() {
        await prisma.$connect();

        console.log(`✅ ${serviceName}: PostgreSQL connected`);
    }

    async function disconnectDatabase() {
        await prisma.$disconnect();

        console.log(`❌ ${serviceName}: PostgreSQL disconnected`);
    }

    return {
        prisma,
        connectDatabase,
        disconnectDatabase
    };
}
