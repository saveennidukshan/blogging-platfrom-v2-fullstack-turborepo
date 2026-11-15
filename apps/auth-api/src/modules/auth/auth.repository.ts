import type { User } from "../../../generated/prisma/client.js";

export interface UserCreateInput {
    email: string;
    passwordHash: string;
    username: string;
}

export interface AuthRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    isUsernameAvailable(username: string): Promise<Boolean>;
    create(data: UserCreateInput): Promise<User>;
}