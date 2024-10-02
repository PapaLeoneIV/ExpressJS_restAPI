-- CreateTable
CREATE TABLE "date" (
    "id" SERIAL NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "date_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "dateId" INTEGER NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "date_bookingDate_key" ON "date"("bookingDate");

-- CreateIndex
CREATE UNIQUE INDEX "room_roomNumber_key" ON "room"("roomNumber");

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "date"("id") ON DELETE CASCADE ON UPDATE CASCADE;
