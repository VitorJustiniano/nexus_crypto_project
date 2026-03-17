/*
  Warnings:

  - A unique constraint covering the columns `[walletId,token]` on the table `WalletBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "idempotencyKey" (
    "Key" TEXT NOT NULL,
    "datacreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotencyKey_pkey" PRIMARY KEY ("Key")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletBalance_walletId_token_key" ON "WalletBalance"("walletId", "token");
