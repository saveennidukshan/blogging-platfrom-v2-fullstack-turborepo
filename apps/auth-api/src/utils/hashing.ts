import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const PasswordHash = {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    },

    async compare(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    },
};
