-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `quota` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Event_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Major` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registration` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `npm` VARCHAR(191) NOT NULL,
    `majorId` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `cancelToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Registration_cancelToken_key`(`cancelToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
