
import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "node:crypto";

import configs from "../config/dotenv.config.js";

export interface Tokens {
    accessToken: string;
    rfToken: string;
}

const ACCESS_SECRET = configs.jwt_access_secret;
const REFRESH_SECRET = configs.jwt_refresh_secret;

const JWT_ISS = configs.jwt_issuer;

if (!ACCESS_SECRET || !REFRESH_SECRET || !JWT_ISS) {
    throw new Error("JWT configuration is missing");
}

const JWT_ACCESS_OPTIONS: SignOptions = {
    expiresIn: configs.jwt_auth_expires_in as SignOptions["expiresIn"],
    issuer: JWT_ISS,
    audience: "auth-service",
    algorithm: "HS256",
};

const JWT_REFRESH_OPTIONS: SignOptions = {
    expiresIn: configs.jwt_rf_expires_in as SignOptions["expiresIn"],
    issuer: JWT_ISS,
    audience: "auth-service",
    algorithm: "HS256",
};

interface TokenUser {
    id: string;
}

export const generateTokens = (user: TokenUser): Tokens => {

    const accessToken = jwt.sign(
        {
            type: "auth",
        },
        ACCESS_SECRET,
        {
            ...JWT_ACCESS_OPTIONS,
            subject: user.id,
        }
    );

    const rfToken = jwt.sign(
        {
            type: "refresh",
        },
        REFRESH_SECRET,
        {
            ...JWT_REFRESH_OPTIONS,
            subject: user.id,
            jwtid: crypto.randomUUID(),
        }
    );

    return {
        accessToken,
        rfToken,
    };
};
