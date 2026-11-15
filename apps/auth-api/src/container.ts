import { AuthService } from "./modules/auth/auth.service.js";
import { createAuthController } from "./modules/auth/auth.controller.js";
import { PrismaAuthRepository } from "./modules/auth/auth-prisma.repository.js";

const authRepository = new PrismaAuthRepository();

const authService = new AuthService(authRepository);

export const authController = createAuthController(authService);