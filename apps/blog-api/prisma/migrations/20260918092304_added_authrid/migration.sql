/*
  Warnings:

  - You are about to drop the column `author` on the `blogs` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "author",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "blogs_authorId_idx" ON "blogs"("authorId");
