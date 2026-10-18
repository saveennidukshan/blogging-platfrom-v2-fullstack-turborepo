import { Router } from "express"
import { setAuthRoutes } from "./auth.router.js"

export const setRouters = (app) => {
    // setting auth routers
    const authRouter = Router();
    app.use("/auth", authRouter);
    setAuthRoutes(authRouter);
}