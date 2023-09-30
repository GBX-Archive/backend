/*
  Warnings:

  - A unique constraint covering the columns `[clyde_id]` on the table `episode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clyde_id` to the `episode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "episode" ADD COLUMN     "clyde_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "episode_clyde_id_key" ON "episode"("clyde_id");
