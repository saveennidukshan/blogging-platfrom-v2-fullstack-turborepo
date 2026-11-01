
import { Kafka } from "kafkajs";
import { prisma, connectDatabase } from "./outboxDbConn.js";

const kafka = new Kafka({
  clientId: "auth-api",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const BATCH_SIZE = 10;
const POLL_INTERVAL = 3000;

let isRunning = true;

async function publishOutboxEvents() {
  const events = await prisma.auth_outbox.findMany({
    where: { isSended: false },
    orderBy: { id: "asc" },
    take: BATCH_SIZE,
  });

  for (const event of events) {
    if (!isRunning) break;

    try {
      const data = {
        eventId: event.id,
        eventType: "user.created",
        occurredAt: new Date().toISOString(),
        data: {
          email: event.email,
          name: "Test_name",
        },
      };

      await producer.send({
        topic: "user-events",
        messages: [
          {
            key: event.id,
            value: JSON.stringify(data),
          },
        ],
      });

      await prisma.auth_outbox.update({
        where: { id: event.id },
        data: { isSended: true },
      });

      console.log("Published:", event.id);

    } catch (error) {
      console.error(
        "Failed to publish:",
        event.id,
        error.message
      );
    }
  }
}

async function startWorker() {
  await connectDatabase();
  await producer.connect();

  console.log("Outbox worker started");

  while (isRunning) {
    try {
      await publishOutboxEvents();
    } catch (error) {
      console.error("Worker error:", error.message);
    }

    if (isRunning) {
      await new Promise(resolve =>
        setTimeout(resolve, POLL_INTERVAL)
      );
    }
  }
}

async function shutdown() {
  console.log("Shutting down outbox worker...");

  isRunning = false;

  await producer.disconnect();
  await prisma.$disconnect();

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startWorker().catch(async error => {
  console.error("Worker startup failed:", error);

  await producer.disconnect().catch(() => {});
  await prisma.$disconnect().catch(() => {});

  process.exit(1);
});
