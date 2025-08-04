/*
  Warnings:

  - A unique constraint covering the columns `[txnHash]` on the table `Confirmation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Confirmation_txnHash_key" ON "Confirmation"("txnHash");
