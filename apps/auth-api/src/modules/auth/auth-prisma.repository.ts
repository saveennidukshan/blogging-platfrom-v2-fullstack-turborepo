import { prisma } from "../../infrastructure/database/databaseConnection.js";

import type { User, RfTokens } from "../../../generated/prisma/client.js";

import type {
    AuthRepository,
    UserCreateInput
} from "./auth.repository.js";
import { Metadata } from "./auth.types.js";


export class PrismaAuthRepository implements AuthRepository {

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async isUsernameAvailable(username: string): Promise<boolean> {
        const count = await prisma.user.count({
            where: { username },
        });

        return count === 0;
    }

    async create(data: UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    async insertRfToken(userId: string, tokenID: string, tokenHash: string, metadata: Metadata): Promise<RfTokens>{
        return prisma.rfTokens.create({
        data: {
            id: tokenID,
            tokenHash,
            userId,
            userIp: metadata.userIp,
            userAgent: metadata.userAgent,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });
    }

    async findTokenById(id: string): Promise<RfTokens | null> {
        return prisma.rfTokens.findUnique({
            where: {
                id
            }
        });
    }

    async updateTokenById(id: string, tokenHash: string): Promise<RfTokens | null> {
        return prisma.rfTokens.update({
            where: {
                id
            },
            data:{
                tokenHash
            }
        });
    }


async createWithAuthData(
    data: UserCreateInput,
    eventType: string,
    tokenID: string,
    tokenHash: string,
    metadata: Metadata
): Promise<{
    user: User;
    refreshToken: RfTokens;
}> {
    return prisma.$transaction(async (tx) => {

        // 1. Create user
        const user = await tx.user.create({
            data,
        });

        // 2. Save refresh token
        const refreshToken = await tx.rfTokens.create({
            data: {
                id: tokenID,
                tokenHash,
                userId: user.id,
                userIp: metadata.userIp,
                userAgent: metadata.userAgent,
                expiresAt: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                ),
            },
        });

        // 3. Insert outbox event
        await tx.authOutbox.create({
            data: {
                eventType,
                username: user.username,
                userEmail: user.email,
                userIp: metadata.userIp,
                userAgent: metadata.userAgent,
            },
        });

        return {
            user,
            refreshToken,
        };
    });
}
}