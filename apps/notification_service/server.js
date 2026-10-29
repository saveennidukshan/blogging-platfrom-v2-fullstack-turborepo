import app from './app.js';
import { startConsumer } from './src/kafka.js';

startConsumer().catch((error) => {
  console.error("Kafka consumer startup failed:", error);
  process.exit(1);
});

app.listen(3004, () => console.log('Norification service is up and running in port 3004'));
