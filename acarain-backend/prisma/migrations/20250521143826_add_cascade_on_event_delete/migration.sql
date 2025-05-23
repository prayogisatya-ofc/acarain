-- DropForeignKey
ALTER TABLE `Registration` DROP FOREIGN KEY `Registration_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `Registration` DROP FOREIGN KEY `Registration_majorId_fkey`;

-- DropIndex
DROP INDEX `Registration_eventId_fkey` ON `Registration`;

-- DropIndex
DROP INDEX `Registration_majorId_fkey` ON `Registration`;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
