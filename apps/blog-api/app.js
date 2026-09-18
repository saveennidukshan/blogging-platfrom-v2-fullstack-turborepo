import express from "express";
import blogRouter from "./src/routes/blog.router.js"
import cors from "cors"
import morgan from "morgan"

const app = express();

app.use(cors())

app.use(express.json());

app.use(morgan("dev"));

app.use("/",blogRouter);

export default app;