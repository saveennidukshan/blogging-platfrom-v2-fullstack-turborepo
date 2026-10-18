import app from "./src/app.js";
import { connectDatabase } from "./src/infrastructure/database/databaseConnection.js";
import { connectKafka } from "./src/infrastructure/kafka/kafkaProducer.js";

const PORT = process.env.PORT || 4000;

await connectKafka()
await connectDatabase()

app.listen(PORT, () => {
  console.log(`🚀 Auth API running on http://localhost:${PORT}`);
});

