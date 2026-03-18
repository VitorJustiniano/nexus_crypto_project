-- CreateTable
CREATE TABLE "Transaction" (
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "fromToken" "Token",
    "toToken" "Token",
    "fromAmount" DECIMAL(65,30),
    "toAmount" DECIMAL(65,30),
    "fee" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionId")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
