-- CreateTable
CREATE TABLE "Album" (
"id" SERIAL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "artist" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
"id" SERIAL,
    "title" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "albumId" INTEGER,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Track" ADD FOREIGN KEY("albumId")REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;
