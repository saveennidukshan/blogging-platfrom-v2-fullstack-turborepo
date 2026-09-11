import express from "express";
import authRouter from "./src/routes/auth.router.js"
import cors from "cors"

const app = express();

app.use(cors())

app.use(express.json());

app.use("/v1/auth",authRouter);

export default app;