import type { RequestHandler } from "express";
import type { Metadata, UserLoginInput, UserRegisterInput } from "./auth.types.js";
import { setAuthCookies } from "../../utils/cookiesHandler.js";
import { AuthService } from "./auth.service.js";

export const createAuthController = (
    authService: AuthService
) => {
    const register: RequestHandler = async (req, res) => {
        const metadata: Metadata = {
            userIp: req.ip,
            userAgent: req.get("user-agent") ?? undefined,
        };
        const { data, rfToken } = await authService.registerUseCase(req.body as UserRegisterInput, metadata);
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
        const metadata: Metadata = {
            userIp: req.ip,
            userAgent: req.get("user-agent") ?? undefined,
        };
        const { data, rfToken } = await authService.loginUseCase(req.body as UserLoginInput, metadata);
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