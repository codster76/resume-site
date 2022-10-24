/*
  Warnings:

  - A unique constraint covering the columns `[name,password]` on the table `Bag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bag_name_password_key" ON "Bag"("name", "password");
