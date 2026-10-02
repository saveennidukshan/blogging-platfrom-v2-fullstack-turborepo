import { register, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation.js";


export const setAuthRoutes = (router) => {

  router.post("/register", validate(registerSchema), register);

  router.post("/login", validate(loginSchema), login);

}

