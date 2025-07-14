/*
  Warnings:

  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_userId_fkey";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "User";
