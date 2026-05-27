-- CreateTable
CREATE TABLE "ScamCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inputText" TEXT NOT NULL,
    "selectedType" TEXT,
    "riskScore" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "scamCategory" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "warningSigns" TEXT NOT NULL,
    "recommendedActions" TEXT NOT NULL,
    "confidenceLevel" TEXT NOT NULL,
    "disclaimer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ScamReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportedMessage" TEXT NOT NULL,
    "category" TEXT,
    "country" TEXT,
    "userEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scamCheckId" TEXT NOT NULL,
    "userRating" INTEGER NOT NULL,
    "userComment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_scamCheckId_fkey" FOREIGN KEY ("scamCheckId") REFERENCES "ScamCheck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
