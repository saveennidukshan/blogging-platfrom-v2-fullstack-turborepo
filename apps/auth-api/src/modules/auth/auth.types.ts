export interface UserRegisterInput {
    email: string;
    password: string;
    username: string;
}

export interface Metadata {
    userIp: string | undefined;
    userAgent: string | undefined;
}

export interface UserLoginInput {
    email: string;
    password: string;
}

export interface AuthData {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    authentication: AuthTokens;
}

export interface AuthUserOutput {
    data: AuthData;
    rfToken: string;
}

export interface RefreshUserOutput {
    data: AuthTokens;
    rfToken: string;
}

export interface AuthTokens {
    accessToken: string;
    tokenType: "Bearer";
    expiresIn: number;
}