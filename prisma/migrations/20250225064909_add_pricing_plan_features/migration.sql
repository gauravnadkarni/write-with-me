/*
  Warnings:

  - The `features` column on the `Prices` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Prices" DROP COLUMN "features",
ADD COLUMN     "features" TEXT[];
