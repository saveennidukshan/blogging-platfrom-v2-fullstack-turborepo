
import jwt, { type SignOptions } from "jsonwebtoken";
import configs from "../config/dotenv.config.js";

export interface UserPayload {
    id: string;
    email: string;
}

const JWT_SECRET = configs.jwt_secret_key;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const JWT_OPTIONS: SignOptions = {
    expiresIn: configs.jwt_expires_in as SignOptions["expiresIn"],
};

export const generateToken = (user: UserPayload): string => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        JWT_SECRET,
        JWT_OPTIONS
    );
};
