import { Router } from "express";

import { validate } from "../../middlewares/validation.middleware.js";
import {
  registerSchema,
  loginSchema
} from "./auth.validation.js";
import { authController } from "../../container.js";
import { authValidate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authValidate(), authController.refresh);

export default router;