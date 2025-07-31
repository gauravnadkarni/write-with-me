-- AlterEnum
ALTER TYPE "PriceType" ADD VALUE 'FREE';

-- AlterTable
ALTER TABLE "Prices" ADD COLUMN     "orders" INTEGER NOT NULL DEFAULT 1;
