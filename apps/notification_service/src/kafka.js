
import { Kafka } from "kafkajs";
import { sendMail } from "./service.js";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "notification-service-group",
});

async function startConsumer() {
  try {
    await consumer.connect();

    await consumer.subscribe({
      topic: "user-events",
      fromBeginning: false,
    });

    console.log("Kafka consumer connected and subscribed.");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        try {
          const event = JSON.parse(message.value.toString());

          if (event.eventType === "user.created") {
            const { email, name } = event.data;

            console.log("New user registered:", {
              email,
              name,
              eventId: event.eventId,
            });

            

            await sendMail(email, `Hello ${name || "User"} your account is created successfully..`);
          }

          if (event.eventType === "user.logged") {
            const { email, name } = event.data;

            console.log("New user registered:", {
              email,
              name,
              eventId: event.eventId,
            });

            

            await sendMail(email, `Hello ${name || "User"} you logged successfully at ${event.occurredAt}`);
          }
        } catch (error) {
          console.error("Failed to process Kafka message:", error);
        }
      },
    });
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
    throw error;
  }
}

async function stopConsumer() {
  await consumer.disconnect();
}

export { startConsumer, stopConsumer };
