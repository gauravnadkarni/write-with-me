/*
  Warnings:

  - You are about to drop the column `orders` on the `Prices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prices" DROP COLUMN "orders",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;
