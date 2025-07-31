/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubscriptionItemId]` on the table `Subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeSubscriptionItemId` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "stripeSubscriptionItemId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_stripeSubscriptionItemId_key" ON "Subscriptions"("stripeSubscriptionItemId");
