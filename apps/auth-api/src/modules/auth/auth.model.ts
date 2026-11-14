
import { prisma } from "../../infrastructure/database/databaseConnection.js";
import type { User } from "../../../generated/prisma/client.js";

export interface UserCreateInput {
    email: string;
    passwordHash: string;
    username: string;
}

export const UserModel = {
    findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    create(data: UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    },

    checkUsername(username: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { username },
        });
    },
};
