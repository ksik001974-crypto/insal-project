-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "analysis" TEXT,
    "violated" TEXT,
    "reason" TEXT,
    "problemPart" TEXT,
    "riskScore" INTEGER,
    "status" TEXT NOT NULL DEFAULT '미처리',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);
