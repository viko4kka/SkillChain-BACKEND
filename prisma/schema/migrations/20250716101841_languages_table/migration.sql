/*
  Warnings:

  - You are about to drop the column `userId` on the `Language` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_userId_fkey";

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "UserLanguage" (
    "userId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "UserLanguage_pkey" PRIMARY KEY ("userId","languageId")
);

-- AddForeignKey
ALTER TABLE "UserLanguage" ADD CONSTRAINT "UserLanguage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLanguage" ADD CONSTRAINT "UserLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
