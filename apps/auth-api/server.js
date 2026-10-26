import app from "./src/app.js";
import configs from "./src/config/dotenv.config.js";

import {
  connectDatabase,
  disconnectDatabase,
} from "./src/infrastructure/database/databaseConnection.js";

import {
  connectKafka,
  disconnectKafka,
} from "./src/infrastructure/kafka/kafkaProducer.js";

const PORT = configs.app_port;

let server;
let shuttingDown = false;

async function startServer() {
  try {

    await connectDatabase();
    await connectKafka();

    server = app.listen(PORT, () => {
      console.log(`🚀 Auth API running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("HTTP server error:", error);
      process.exitCode = 1;
      void shutdown();
    });
  } catch (error) {
    console.error("❌ Failed to start Auth API:", error);

    process.exitCode = 1;
    await shutdown();
  }
}

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log("🛑 Shutting down Auth API...");

  if (server) {
    await new Promise((resolve) => {
      server.close((error) => {
        if (error) {
          console.error("HTTP server shutdown error:", error);
          process.exitCode = 1;
        }

        resolve();
      });
    });
  }

  const results = await Promise.allSettled([
    disconnectKafka(),
    disconnectDatabase(),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("❌ Dependency shutdown failed:", result.reason);
      process.exitCode = 1;
    }
  }

  console.log("✅ Auth API shutdown complete");
}

process.once("SIGINT", () => {
  void shutdown();
});

process.once("SIGTERM", () => {
  void shutdown();
});

await startServer();
