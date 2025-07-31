-- DropForeignKey
ALTER TABLE "Drafts" DROP CONSTRAINT "Drafts_folder_id_fkey";

-- AlterTable
ALTER TABLE "Drafts" ALTER COLUMN "folder_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Drafts" ADD CONSTRAINT "Drafts_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
