/*
  Warnings:

  - Added the required column `currentPeriodStart` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "currentPeriodStart" TIMESTAMP(3) NOT NULL;
