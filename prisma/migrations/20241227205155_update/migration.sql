/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PoliticianRole` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Politician` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avatar_url` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `base_date` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `last_updated` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `party` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Politician` table. All the data in the column will be lost.
  - You are about to drop the column `voting_period` on the `Politician` table. All the data in the column will be lost.
  - Added the required column `field_title` to the `Politician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `Politician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `party_id` to the `Politician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Politician` table without a default value. This is not possible if the table is not empty.
  - Made the column `ext_abgeordnetenwatch_id` on table `Politician` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Article";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Company";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PoliticianRole";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Party" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Politician" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birth_name" TEXT,
    "profile_image" TEXT NOT NULL DEFAULT 'avatar_placeholder.png',
    "gender" TEXT,
    "birth_year" INTEGER NOT NULL DEFAULT -1,
    "party_past" TEXT,
    "education" TEXT,
    "residence" TEXT,
    "occupation" TEXT NOT NULL,
    "field_title" TEXT NOT NULL,
    "ext_abgeordnetenwatch_id" INTEGER NOT NULL,
    "party_id" INTEGER NOT NULL,
    CONSTRAINT "Politician_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Party" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Politician" ("ext_abgeordnetenwatch_id", "first_name", "last_name") SELECT "ext_abgeordnetenwatch_id", "first_name", "last_name" FROM "Politician";
DROP TABLE "Politician";
ALTER TABLE "new_Politician" RENAME TO "Politician";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
