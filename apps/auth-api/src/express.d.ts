declare global {
    namespace Express {
        interface Locals {
            requestId: string;
            tokenId: string
        }
    }
}

export {};