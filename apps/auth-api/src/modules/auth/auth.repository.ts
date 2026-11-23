import type { User, RfTokens } from "../../../generated/prisma/client.js";
import { Metadata } from "./auth.types.js";

export type UserCreateInput = {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
};

export interface AuthRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    isUsernameAvailable(username: string): Promise<Boolean>;
    create(data: UserCreateInput): Promise<User>;
    insertRfToken(userId: string, tokenId: string, tokenHash: string, metadata: Metadata): Promise<RfTokens>;
    findTokenById(id: string): Promise<RfTokens | null>;
    updateTokenById(id: string, tokenHash: string): Promise<RfTokens | null>;
    createWithAuthData(
    data: UserCreateInput,
    eventType: string,
    tokenID: string,
    tokenHash: string,
    metadata: Metadata
): Promise<{
    user: User;
    refreshToken: RfTokens;
}>;
}