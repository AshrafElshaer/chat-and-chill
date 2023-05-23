/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Chatroom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chatroom" DROP COLUMN "updatedAt",
ADD COLUMN     "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
