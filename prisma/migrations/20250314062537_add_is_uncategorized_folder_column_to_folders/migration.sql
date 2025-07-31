/*
  Warnings:

  - Made the column `folder_id` on table `Drafts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Drafts" DROP CONSTRAINT "Drafts_folder_id_fkey";

-- AlterTable
ALTER TABLE "Drafts" ALTER COLUMN "folder_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Folders" ADD COLUMN     "isUncategorizedFolder" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Drafts" ADD CONSTRAINT "Drafts_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
