import express from "express";
import authRouter from "./src/routes/auth.router.js"
import cors from "cors"
import morgan from "morgan"

const app = express();

app.use(cors())

app.use(express.json());

app.use(morgan("dev"));

app.use("/v1/auth",authRouter);

export default app;