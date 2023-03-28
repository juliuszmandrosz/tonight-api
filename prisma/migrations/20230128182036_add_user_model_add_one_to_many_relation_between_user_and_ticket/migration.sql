/*
  Warnings:

  - Added the required column `userId` to the `TicketEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket"
    ADD COLUMN "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User"
(
    "id"       TEXT NOT NULL,
    "email"    TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "locale"   TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User" ("username");

-- AddForeignKey
ALTER TABLE "Ticket"
    ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
