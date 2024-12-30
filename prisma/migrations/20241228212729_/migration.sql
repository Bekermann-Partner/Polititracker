/*
  Warnings:

  - You are about to drop the column `label` on the `Party` table. All the data in the column will be lost.
  - Added the required column `long` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short` to the `Party` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Party" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "short" TEXT NOT NULL,
    "long" TEXT NOT NULL
);
INSERT INTO "new_Party" ("id") SELECT "id" FROM "Party";
DROP TABLE "Party";
ALTER TABLE "new_Party" RENAME TO "Party";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
