
import { Kafka } from "kafkajs";
import { sendMail } from "./service.js";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "notification-service-group",
  retry: {
    retries: 10,
    initialRetryTime: 1000,
  },
});

let isRunning = false;

async function sendMailWithRetry(email, content, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sendMail(email, content);
      return;
    } catch (error) {
      console.error(
        `Email attempt ${attempt}/${maxRetries} failed:`,
        error.message
      );

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 2000)
      );
    }
  }
}

async function processEvent(event) {
  switch (event.eventType) {
    case "user.created": {
      const { email, name } = event.data;

      await sendMailWithRetry(
        email,
        `Hello ${name || "User"}, your account has been created successfully.`
      );

      break;
    }

    case "user.logged": {
      const { email, name } = event.data;

      await sendMailWithRetry(
        email,
        `Hello ${name || "User"}, you logged in successfully at ${event.occurredAt}.`
      );

      break;
    }

    default:
      console.warn("Unknown event type:", event.eventType);
  }
}

async function startConsumer() {
  if (isRunning) return;

  try {
    await consumer.connect();

    await consumer.subscribe({
      topic: "user-events",
      fromBeginning: true,
    });

    console.log("Kafka consumer connected and subscribed.");

    isRunning = true;

    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        let event;

        try {
          if (!message.value) {
            throw new Error("Empty Kafka message");
          }

          event = JSON.parse(message.value.toString());

          console.log("Processing event:", {
            eventId: event.eventId,
            eventType: event.eventType,
            offset: message.offset,
          });

          await processEvent(event);

          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (BigInt(message.offset) + 1n).toString(),
            },
          ]);

          console.log("Event processed successfully:", event.eventId);

        } catch (error) {
          console.error("Failed to process Kafka message:", {
            eventId: event?.eventId,
            offset: message.offset,
            error: error.message,
          });

          throw error;
        }
      },
    });

  } catch (error) {
    isRunning = false;

    console.error("Kafka consumer error:", error);

    throw error;
  }
}

async function stopConsumer() {
  if (!isRunning) return;

  isRunning = false;

  try {
    await consumer.disconnect();
    console.log("Kafka consumer disconnected.");
  } catch (error) {
    console.error("Error disconnecting Kafka consumer:", error);
  }
}

process.on("SIGINT", async () => {
  await stopConsumer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await stopConsumer();
  process.exit(0);
});

export { startConsumer, stopConsumer };
