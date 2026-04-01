-- CreateTable
CREATE TABLE "StatementDayCheck" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "StatementDayCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatementDayCheck_userId_date_key" ON "StatementDayCheck"("userId", "date");

-- AddForeignKey
ALTER TABLE "StatementDayCheck" ADD CONSTRAINT "StatementDayCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
