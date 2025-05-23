/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qrCode` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Registration` ADD COLUMN `qrCode` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'ATTENDED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX `Registration_qrCode_key` ON `Registration`(`qrCode`);
