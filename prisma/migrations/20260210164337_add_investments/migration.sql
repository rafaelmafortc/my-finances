-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalPatrimony" DECIMAL(12,2);

-- CreateTable
CREATE TABLE "InvestmentClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InvestmentClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "investmentClassId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentClass_userId_name_key" ON "InvestmentClass"("userId", "name");

-- AddForeignKey
ALTER TABLE "InvestmentClass" ADD CONSTRAINT "InvestmentClass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investmentClassId_fkey" FOREIGN KEY ("investmentClassId") REFERENCES "InvestmentClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
