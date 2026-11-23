-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "current" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tech" TEXT NOT NULL DEFAULT '';
