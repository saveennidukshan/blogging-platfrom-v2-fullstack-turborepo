import type { RequestHandler } from "express";
import type { AuthService, UserLoginInput, UserRegisterInput } from "./auth.service.js";
import { setAuthCookies } from "../../utils/cookiesHandler.js";

export const createAuthController = (
    authService: AuthService
) => {
    const register: RequestHandler = async (req, res) => {
        const { data, rfToken } = await authService.registerUseCase(req.body as UserRegisterInput);
        setAuthCookies(res, rfToken);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data,
            meta:{
                requestId: res.locals.requestId
            }
        });
    };

    const login: RequestHandler = async (req, res) => {
        const { data, rfToken } = await authService.loginUseCase(req.body as UserLoginInput);
        setAuthCookies(res, rfToken);
        return res.status(200).json({
            success: true,
            message: "User logged successfully",
            data,
            meta:{
                requestId: res.locals.requestId
            }
        });
    }

    return { register, login };
};