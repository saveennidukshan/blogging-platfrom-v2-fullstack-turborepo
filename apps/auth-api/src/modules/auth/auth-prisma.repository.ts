import { prisma } from "../../infrastructure/database/databaseConnection.js";

import type { User } from "../../../generated/prisma/client.js";

import type {
    AuthRepository,
    UserCreateInput,
} from "./auth.repository.js";


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
}