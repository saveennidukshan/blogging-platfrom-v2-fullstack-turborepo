import { Router } from "express";
import { sendNotification } from "./controller.js";

const router = Router()

router.post("/send", sendNotification)


export default router;