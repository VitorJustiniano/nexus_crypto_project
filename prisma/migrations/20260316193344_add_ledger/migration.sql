-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'SWAP_IN', 'SWAP_OUT', 'SWAP_FEE', 'WITHDRAWAL');

-- CreateTable
CREATE TABLE "Ledger" (
    "ledgerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" "Token" NOT NULL,
    "balance_before" DECIMAL(65,30) NOT NULL,
    "balance_after" DECIMAL(65,30) NOT NULL,
    "moved_value" DECIMAL(65,30) NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("ledgerId")
);

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
