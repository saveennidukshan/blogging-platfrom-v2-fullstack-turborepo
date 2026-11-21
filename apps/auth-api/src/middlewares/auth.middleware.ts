import { RequestHandler } from "express";
import { validateTokens } from "../utils/tokenService";

export const authValidate = (): RequestHandler => {
    return (req, res, next) => {
        const token = req.cookies.rfToken;
        if (!token) throw new Error("Token error")
        const payload = validateTokens(token);
        if (!payload) throw new Error("Token error")
        res.locals.tokenId = payload.jti;
        next();
    }
};