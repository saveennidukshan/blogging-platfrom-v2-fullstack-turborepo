import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { limiter } from "./middlewares/ratelimit.js";
import { notFound } from "./middlewares/notfound.js";
import { requestId } from "./middlewares/request.js";
import { setRouters } from "./routes/main.router.js";

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

//setting routes
setRouters(app);

//not found handler
app.use(notFound);



export default app;