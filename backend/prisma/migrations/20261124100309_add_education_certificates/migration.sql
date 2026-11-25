-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "degree" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "period" TEXT NOT NULL DEFAULT '',
    "detail" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL DEFAULT '',
    "year" TEXT NOT NULL DEFAULT '',
    "imageVer" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);
