-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT,
    "githubLink" TEXT,
    "websiteLink" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
