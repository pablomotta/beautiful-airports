-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "airportCode" TEXT NOT NULL,
    "airportName" TEXT NOT NULL,
    "runwayLengthMeters" INTEGER,
    "size" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VisitedAirports" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VisitedAirports_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_airportCode_key" ON "Airport"("airportCode");

-- CreateIndex
CREATE INDEX "_VisitedAirports_B_index" ON "_VisitedAirports"("B");

-- AddForeignKey
ALTER TABLE "_VisitedAirports" ADD CONSTRAINT "_VisitedAirports_A_fkey" FOREIGN KEY ("A") REFERENCES "Airport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VisitedAirports" ADD CONSTRAINT "_VisitedAirports_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
