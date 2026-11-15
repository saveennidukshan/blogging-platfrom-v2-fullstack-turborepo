import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

export const requestId: RequestHandler = (req, res, next) => {
    const reqId = randomUUID();

    res.setHeader("X-Request-Id", reqId);

    req.id = reqId;

    next();
};
