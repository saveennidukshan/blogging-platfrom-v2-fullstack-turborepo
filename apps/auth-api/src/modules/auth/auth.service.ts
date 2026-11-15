import { AuthRepository } from "./auth.repository.js";
import { PasswordHash } from "../../utils/hashing.js";
import { generateAuthToken } from "../../utils/tokenService.js";
import { User } from "../../../generated/prisma/client.js";

export interface UserRegisterInput {
    email: string;
    password: string;
    username: string;
}

export interface UserLoginInput {
    email: string;
    password: string;
}

export interface AuthUserOutput {
    id: string
    username: string
    email: string
    createdAt: Date
    data: AuthTokens
}

export interface AuthTokens {
    accessToken: string;
    tokenType: "Bearer";
    expiresIn: number;
}


export class AuthService {
    constructor (
        private readonly authRepository: AuthRepository
    ){}

    async registerUseCase(registerInput: UserRegisterInput): Promise<AuthUserOutput> {
        const { email, username, password } = registerInput;
        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) throw new Error("Email already exists");
        const isUsernameValid = await this.authRepository.isUsernameAvailable(username);
        if (!isUsernameValid)throw new Error("Username already exists");
        const passwordHash = await PasswordHash.hash(password);
        const createdUser = await this.authRepository.create({
            email,
            passwordHash,
            username
        });
        const authToken = generateAuthToken({
            id: createdUser.id,
            email: createdUser.email
        });
        return this.toAuthUserOutput(createdUser, authToken);        
    }

    async loginUseCase(loginInput: UserLoginInput): Promise<AuthUserOutput>{
        const { email, password } = loginInput;
        const user = await this.authRepository.findByEmail(email);
        if (!user) throw new Error("invalid credentials");
        if (!(await PasswordHash.compare(password, user.passwordHash))) throw new Error("invalid credentials");
        const authToken = generateAuthToken({
            id: user.id,
            email: user.email
        });
        return this.toAuthUserOutput(user, authToken); 
    }

    private toAuthUserOutput(user: User, accessToken: string): AuthUserOutput{
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            data: {
                accessToken,
                tokenType: "Bearer",
                expiresIn: 900
            }
        }
    }
}