-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "nowAt" TIMESTAMP(3),
ADD COLUMN     "nowText" TEXT NOT NULL DEFAULT '';
