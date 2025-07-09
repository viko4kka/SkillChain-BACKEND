-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "description" TEXT,
    "linkGit" TEXT,
    "linkLinkedIn" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
