/*
  Warnings:

  - The values [ATTENDED] on the enum `Registration_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Registration` ADD COLUMN `attendance` ENUM('ABSENT', 'ATTENDED') NOT NULL DEFAULT 'ABSENT',
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
