-- CreateTable
CREATE TABLE "Confirmation" (
    "id" SERIAL NOT NULL,
    "skillId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "approverId" INTEGER NOT NULL,
    "txnHash" TEXT NOT NULL,

    CONSTRAINT "Confirmation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
