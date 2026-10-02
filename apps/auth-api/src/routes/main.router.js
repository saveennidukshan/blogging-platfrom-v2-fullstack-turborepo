import { Router } from "express"
import { setAuthRoutes } from "./auth.router.js"

export const setRouters = (app) => {
    const authRouter = Router();
    app.use("/auth", authRouter);
    setAuthRoutes(authRouter);
}