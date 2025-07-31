/*
  Warnings:

  - You are about to drop the column `priceId` on the `Subscriptions` table. All the data in the column will be lost.
  - Added the required column `price_id` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('PRO', 'TEAM');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Subscriptions" DROP COLUMN "priceId",
ADD COLUMN     "price_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Prices" (
    "id" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "planType" "PriceType" NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prices_stripePriceId_key" ON "Prices"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "Prices_planType_billingCycle_key" ON "Prices"("planType", "billingCycle");

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "Prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
