import { Kafka } from "kafkajs";
import configs from "../../config/dotenv.config.js";

const kafka = new Kafka({
  clientId: "auth-api",
  brokers: [configs.kafka_url],
});


export const producer = kafka.producer();

export async function connectKafka() {
  await producer.connect();
  console.log("✅ Kafka connected");
}

export async function disconnectKafka() {
  await producer.disconnect();
  console.log("❌ Kafka disconnected");
}

export async function produceEvent(topic, key, event) {

  return producer.send({
    topic,
    acks: -1,
    messages: [
      {
        key: String(key),
        value: JSON.stringify(event),
        headers: {
          "event-id": event.eventId,
          "event-type": event.type,
          "schema-version": String(event.version ?? 1),
        },
      },
    ],
  });
  
}