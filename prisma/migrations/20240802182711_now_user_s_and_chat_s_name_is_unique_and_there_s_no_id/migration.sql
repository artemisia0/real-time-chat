/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_name_key" ON "Chat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
