
import type { Response } from "express";

const REFRESH_TOKEN_COOKIE = "rfToken";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/auth/refresh",
};

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; 

export const setAuthCookies = (res: Response, rfToken: string): void => {
    res.cookie(REFRESH_TOKEN_COOKIE, rfToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
};

export const clearAuthCookies = (res: Response): void => {
    res.clearCookie(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
};
