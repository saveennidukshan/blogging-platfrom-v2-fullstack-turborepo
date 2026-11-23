-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('LOGIN', 'REGISTER');

-- AlterTable
ALTER TABLE "AuthOutbox" ADD COLUMN     "eventType" TEXT;
