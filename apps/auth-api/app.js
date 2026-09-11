import express from "express";
import authRouter from "./src/routes/auth.router.js"

const app = express();

app.use(express.json());

app.use("/v1/auth",authRouter);

export default app;