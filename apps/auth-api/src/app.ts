
import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { limiter } from "./middlewares/ratelimit.middleware.js";
import { notFound } from "./middlewares/notfound.middleware.js";
import { requestId } from "./middlewares/requestTracker.middleware.js";
import authRoutes from "./modules/auth/auth.router.js";

// Initialize Express application
const app: Application = express();

// Global middlewares
app.use(helmet());
app.use(cors());
app.use(requestId);
app.use(morgan("dev"));

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(limiter);

// Auth routes
app.use("/auth", authRoutes);

// Not found handler
app.use(notFound);

export default app;
