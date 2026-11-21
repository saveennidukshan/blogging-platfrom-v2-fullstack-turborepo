import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";

export const requestId: RequestHandler = (req, res, next) => {
    const reqId = randomUUID();
    res.setHeader("X-Request-Id", reqId);
    res.locals.requestId = reqId;
    next();
};