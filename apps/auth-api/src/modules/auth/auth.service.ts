
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

import { UserModel } from "./auth.model.js";
import { generateToken } from "../../utils/tokenService.js";
import { producer } from "../../infrastructure/kafka/kafkaProducer.js";
import { prisma } from "../../infrastructure/database/databaseConnection.js";


export interface RegisterDTO {
    email: string;
    password: string;
    name: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface ValidateUsernameDTO {
    username: string;
}


interface AuthUserResponse {
    id: string;
    email: string;
    username: string | null;
    createdAt: Date;
}

interface AuthResponse {
    user: AuthUserResponse;
    token: string;
}


class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number
    ) {
        super(message);
        this.name = "AppError";
    }
}


export const register = async (
    { email, password, name }: RegisterDTO
): Promise<AuthResponse> => {

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
        throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {

        const user = await tx.user.create({
            data: {
                email,
                passwordHash,
                username: name,
            },
        });

        await tx.auth_outbox.create({
            data: {
                email,
            },
        });

        return user;
    });

    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
        },
        token,
    };
};

// Login
export const login = async (
    { email, password }: LoginDTO
): Promise<AuthResponse> => {

    const user = await UserModel.findByEmail(email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const passwordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user);

    const event = {
        eventId: randomUUID(),
        eventType: "user.logged",
        occurredAt: new Date().toISOString(),
        data: {
            email,
            username: user.username,
        },
    };

    await producer.send({
        topic: "user-events",
        acks: -1,
        messages: [
            {
                key: user.email,
                value: JSON.stringify(event),
            },
        ],
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
        },
        token,
    };
};

// Validate username
export const validateUsername = async (
    { username }: ValidateUsernameDTO
): Promise<boolean> => {

    const user = await UserModel.checkUsername(username);

    if (user) {
        throw new AppError("Username already used", 400);
    }

    return true;
};
