import { Router } from "express";

import { register, login, usernameValidate } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  usernameSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/validate-username", validate(usernameSchema), usernameValidate)
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;