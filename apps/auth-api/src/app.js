import express from "express";
import authRouter from "./routes/auth.router.js"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet";
import { limiter } from "./middlewares/ratelimit.js";
import { notFound } from "./middlewares/notfound.js";

const app = express();

app.use(helmet())
app.use(cors())

app.use(limiter)

app.use(express.json({
    limit: "16kb"
}));

app.use(morgan("dev"));

app.use(notFound);

app.use("/v1/auth",authRouter);

export default app;