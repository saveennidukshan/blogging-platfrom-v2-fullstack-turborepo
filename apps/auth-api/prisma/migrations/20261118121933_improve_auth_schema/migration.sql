/*
  Warnings:

  - You are about to drop the `auth_outbox` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('DEFAULT', 'GOOGLE');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loginType" "LoginType" NOT NULL DEFAULT 'DEFAULT',
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- DropTable
DROP TABLE "auth_outbox";

-- CreateTable
CREATE TABLE "RfTokens" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userIp" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthOutbox" (
    "eventId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userIp" TEXT,
    "userAgent" TEXT,
    "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthOutbox_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RfTokens_tokenHash_key" ON "RfTokens"("tokenHash");

-- CreateIndex
CREATE INDEX "RfTokens_userId_idx" ON "RfTokens"("userId");

-- CreateIndex
CREATE INDEX "RfTokens_expiresAt_idx" ON "RfTokens"("expiresAt");

-- CreateIndex
CREATE INDEX "AuthOutbox_status_createdAt_idx" ON "AuthOutbox"("status", "createdAt");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "RfTokens" ADD CONSTRAINT "RfTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
