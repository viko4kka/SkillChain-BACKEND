-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "description" TEXT,
    "gitUrl" TEXT,
    "linkedinUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
