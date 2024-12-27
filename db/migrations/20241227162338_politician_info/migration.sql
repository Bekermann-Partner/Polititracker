-- CreateTable
CREATE TABLE "PoliticianRole" (
    "politician_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "function" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PoliticianRole_politician_id_fkey" FOREIGN KEY ("politician_id") REFERENCES "Politician" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Politician" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "party" TEXT,
    "type" TEXT NOT NULL,
    "voting_period" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "base_date" DATETIME NOT NULL,
    "last_updated" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "politician_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    CONSTRAINT "Article_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_politician_id_fkey" FOREIGN KEY ("politician_id") REFERENCES "Politician" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
