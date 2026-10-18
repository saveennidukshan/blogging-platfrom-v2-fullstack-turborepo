import { Kafka,Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth-api",
  brokers: ["localhost:9092"],
});


const producer = kafka.producer({
     createPartitioner: Partitioners.DefaultPartitioner,
});

await producer.connect();
console.log("Kafka connected")


export default producer;