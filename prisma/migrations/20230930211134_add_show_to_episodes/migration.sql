/*
  Warnings:

  - Added the required column `show` to the `episode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "episode" ADD COLUMN     "show" TEXT NOT NULL;
