import { AuthRepository } from "./auth.repository.js";
import { PasswordHash } from "../../utils/hashing.js";
import { generateTokens } from "../../utils/tokenService.js";
import { User } from "../../../generated/prisma/client.js";
import type { UserRegisterInput, Metadata, AuthUserOutput, UserLoginInput, AuthData, RefreshUserOutput } from "./auth.types.js";

export class AuthService {
    constructor (
        private readonly authRepository: AuthRepository
    ){}

    async registerUseCase (registerInput: UserRegisterInput, metadata: Metadata): Promise<AuthUserOutput> {
        const { email, username, password } = registerInput;
        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) throw new Error("Email already exists");
        const isUsernameValid = await this.authRepository.isUsernameAvailable(username);
        if (!isUsernameValid) throw new Error("Username already exists");
        const passwordHash = await PasswordHash.hash(password);
        const createdUser = await this.authRepository.create({
            email,
            passwordHash,
            username
        });
        const tokenId = crypto.randomUUID()
        const tokens = generateTokens(createdUser.id, tokenId);
        const tokenHash = await PasswordHash.hash(tokens.rfToken)
        const insertedToken = await this.authRepository.insertRfToken(
            createdUser.id,
            tokenId,
            tokenHash,
            metadata
        )
        if (!insertedToken) throw new Error("Token insertion failed");
        return {
            data: this.toAuthUserOutput(createdUser, tokens.accessToken),
            rfToken: tokens.rfToken
        }    
    }

    async loginUseCase (loginInput: UserLoginInput, metadata: Metadata): Promise<AuthUserOutput>{
        const { email, password } = loginInput;
        const user = await this.authRepository.findByEmail(email);
        if (!user) throw new Error("invalid credentials");
        if (!(await PasswordHash.compare(password, user.passwordHash))) throw new Error("invalid credentials");
        const tokenId = crypto.randomUUID()
        const tokens = generateTokens(user.id, tokenId);
        const tokenHash = await PasswordHash.hash(tokens.rfToken)
        const insertedToken = await this.authRepository.insertRfToken(
            user.id,
            tokenId,
            tokenHash,
            metadata
        )
        if (!insertedToken) throw new Error("Token insertion failed");
        return {
            data: this.toAuthUserOutput(user, tokens.accessToken),
            rfToken: tokens.rfToken
        }
    }

    async tokenRefreshUseCase (token: string, tokenId: string, metadata: Metadata): Promise<RefreshUserOutput> {
        const tokenFromDB = await this.authRepository.findTokenById(tokenId);
        if(!tokenFromDB || tokenFromDB.revokedAt !== null) throw new Error("Token error");
        if(!await PasswordHash.compare(token, tokenFromDB.tokenHash)) throw new Error("Token error");
        const tokens = generateTokens(tokenFromDB.userId, tokenId);
        const tokenHash = await PasswordHash.hash(tokens.rfToken)
        const insertedToken = await this.authRepository.updateTokenById(
            tokenId,
            tokenHash
        )
        if (!insertedToken) throw new Error("Token insertion failed");
        return {
            data: {
                tokenType: "Bearer",
                accessToken: tokens.accessToken,
                expiresIn: 900
            },
            rfToken: tokens.rfToken
        }

    }

    private toAuthUserOutput(user: User, accessToken: string): AuthData{
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            authentication: {
                tokenType: "Bearer",
                accessToken,
                expiresIn: 900
            }
        }
    }
}