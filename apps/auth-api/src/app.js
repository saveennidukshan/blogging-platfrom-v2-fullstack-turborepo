import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { limiter } from "./middlewares/ratelimit.middleware.js";
import { notFound } from "./middlewares/notfound.middleware.js";
import { requestId } from "./middlewares/requestTracker.middleware.js";
import authRoutes from "./modules/auth/auth.router.js";

// init expess app
const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(requestId);
app.use(morgan("dev"));
app.use(express.json({
    limit: "16kb"
}));
app.use(limiter);

//setting auth routes
app.use("/auth", authRoutes);

//not found handler
app.use(notFound);


export default app;