-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'AMMINISTRATORE', 'RESPONSABILE', 'OPERATORE') NOT NULL DEFAULT 'OPERATORE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Creator` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `cognome` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Operatori` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `cognome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Responsabili` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `cognome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `responsabili_operatori` (
    `id` VARCHAR(191) NOT NULL,
    `id_operatore` VARCHAR(191) NOT NULL,
    `id_responsabile` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disponibilita` (
    `id` VARCHAR(191) NOT NULL,
    `data_prenotazione` VARCHAR(191) NOT NULL,
    `data_disponibilita` VARCHAR(191) NOT NULL,
    `fascia_03_07` VARCHAR(191) NOT NULL,
    `fascia_07_12` VARCHAR(191) NOT NULL,
    `fascia_12_17` VARCHAR(191) NOT NULL,
    `fascia_17_22` VARCHAR(191) NOT NULL,
    `fascia_22_03` VARCHAR(191) NOT NULL,
    `id_operatore_responsabile` VARCHAR(191) NOT NULL,
    `id_creator` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incassi_per_turni` (
    `id` VARCHAR(191) NOT NULL,
    `incasso` DOUBLE NOT NULL,
    `id_disponibilita` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utenti` (
    `id` VARCHAR(191) NOT NULL,
    `nickname_utente` VARCHAR(191) NOT NULL,
    `id_univoco_of` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `note_utente` (
    `id` VARCHAR(191) NOT NULL,
    `nota` VARCHAR(191) NOT NULL,
    `id_utente` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `richieste` (
    `id` VARCHAR(191) NOT NULL,
    `tipo_richiesta` INTEGER NOT NULL,
    `note_richiesta` VARCHAR(191) NOT NULL,
    `importo` DOUBLE NOT NULL,
    `stato_richiesta` VARCHAR(191) NOT NULL,
    `data_consegna_prevista` VARCHAR(191) NOT NULL,
    `data_consegna_effettiva` VARCHAR(191) NULL,
    `note_su_consegna` VARCHAR(191) NULL,
    `id_operatore_responsabile` VARCHAR(191) NOT NULL,
    `id_utente` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `responsabili_operatori` ADD CONSTRAINT `responsabili_operatori_id_operatore_fkey` FOREIGN KEY (`id_operatore`) REFERENCES `Operatori`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `responsabili_operatori` ADD CONSTRAINT `responsabili_operatori_id_responsabile_fkey` FOREIGN KEY (`id_responsabile`) REFERENCES `Responsabili`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disponibilita` ADD CONSTRAINT `disponibilita_id_operatore_responsabile_fkey` FOREIGN KEY (`id_operatore_responsabile`) REFERENCES `Operatori`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disponibilita` ADD CONSTRAINT `disponibilita_id_creator_fkey` FOREIGN KEY (`id_creator`) REFERENCES `Creator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incassi_per_turni` ADD CONSTRAINT `incassi_per_turni_id_disponibilita_fkey` FOREIGN KEY (`id_disponibilita`) REFERENCES `disponibilita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note_utente` ADD CONSTRAINT `note_utente_id_utente_fkey` FOREIGN KEY (`id_utente`) REFERENCES `utenti`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `richieste` ADD CONSTRAINT `richieste_id_operatore_responsabile_fkey` FOREIGN KEY (`id_operatore_responsabile`) REFERENCES `Operatori`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `richieste` ADD CONSTRAINT `richieste_id_utente_fkey` FOREIGN KEY (`id_utente`) REFERENCES `utenti`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
