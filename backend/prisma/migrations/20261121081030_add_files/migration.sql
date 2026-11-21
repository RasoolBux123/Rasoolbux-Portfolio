-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "cvVer" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "photoVer" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "imageVer" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "File" (
    "key" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "size" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("key")
);
