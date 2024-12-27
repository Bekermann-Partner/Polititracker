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
    "occupation" TEXT,
    "field_title" TEXT,
    "ext_abgeordnetenwatch_id" INTEGER NOT NULL,
    "party_id" INTEGER NOT NULL,
    CONSTRAINT "Politician_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Party" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Politician" ("birth_name", "birth_year", "education", "ext_abgeordnetenwatch_id", "field_title", "first_name", "gender", "last_name", "occupation", "party_id", "party_past", "profile_image", "residence", "uuid") SELECT "birth_name", "birth_year", "education", "ext_abgeordnetenwatch_id", "field_title", "first_name", "gender", "last_name", "occupation", "party_id", "party_past", "profile_image", "residence", "uuid" FROM "Politician";
DROP TABLE "Politician";
ALTER TABLE "new_Politician" RENAME TO "Politician";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
