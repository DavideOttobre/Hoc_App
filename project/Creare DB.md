   ```sql
-- Script SQL per creare tutte le tabelle necessarie nel database MySQL
-- Basato sullo schema Prisma definito in backend/prisma/schema.prisma

-- Creazione del database (se non esiste già)
CREATE DATABASE IF NOT EXISTS hoc_app;
USE hoc_app;

-- Tabella users (per autenticazione)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'AMMINISTRATORE', 'RESPONSABILE', 'OPERATORE') NOT NULL DEFAULT 'OPERATORE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabella Creator
CREATE TABLE IF NOT EXISTS Creator (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cognome VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Operatori
CREATE TABLE IF NOT EXISTS Operatori (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cognome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Responsabili
CREATE TABLE IF NOT EXISTS Responsabili (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cognome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella responsabili_operatori (relazione molti-a-molti)
CREATE TABLE IF NOT EXISTS responsabili_operatori (
  id VARCHAR(36) PRIMARY KEY,
  id_operatore VARCHAR(36) NOT NULL,
  id_responsabile VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_operatore) REFERENCES Operatori(id) ON DELETE CASCADE,
  FOREIGN KEY (id_responsabile) REFERENCES Responsabili(id) ON DELETE CASCADE
);

-- Tabella disponibilita
CREATE TABLE IF NOT EXISTS disponibilita (
  id VARCHAR(36) PRIMARY KEY,
  data_prenotazione VARCHAR(255) NOT NULL,
  data_disponibilita VARCHAR(255) NOT NULL,
  fascia_03_07 VARCHAR(50) NOT NULL,
  fascia_07_12 VARCHAR(50) NOT NULL,
  fascia_12_17 VARCHAR(50) NOT NULL,
  fascia_17_22 VARCHAR(50) NOT NULL,
  fascia_22_03 VARCHAR(50) NOT NULL,
  id_operatore_responsabile VARCHAR(36) NOT NULL,
  id_creator VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_operatore_responsabile) REFERENCES Operatori(id) ON DELETE CASCADE,
  FOREIGN KEY (id_creator) REFERENCES Creator(id) ON DELETE CASCADE
);

-- Tabella incassi_per_turni
CREATE TABLE IF NOT EXISTS incassi_per_turni (
  id VARCHAR(36) PRIMARY KEY,
  incasso DECIMAL(10, 2) NOT NULL,
  id_disponibilita VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_disponibilita) REFERENCES disponibilita(id) ON DELETE CASCADE
);

-- Tabella utenti
CREATE TABLE IF NOT EXISTS utenti (
  id VARCHAR(36) PRIMARY KEY,
  nickname_utente VARCHAR(255) NOT NULL,
  id_univoco_of VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella note_utente
CREATE TABLE IF NOT EXISTS note_utente (
  id VARCHAR(36) PRIMARY KEY,
  nota TEXT NOT NULL,
  id_utente VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE
);

-- Tabella richieste
CREATE TABLE IF NOT EXISTS richieste (
  id VARCHAR(36) PRIMARY KEY,
  tipo_richiesta INT NOT NULL,
  note_richiesta TEXT NOT NULL,
  importo DECIMAL(10, 2) NOT NULL,
  stato_richiesta VARCHAR(50) NOT NULL,
  data_consegna_prevista VARCHAR(255) NOT NULL,
  data_consegna_effettiva VARCHAR(255) NULL,
  note_su_consegna TEXT NULL,
  id_operatore_responsabile VARCHAR(36) NOT NULL,
  id_utente VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_operatore_responsabile) REFERENCES Operatori(id) ON DELETE CASCADE,
  FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE
);

-- Indici per migliorare le prestazioni delle query
CREATE INDEX idx_responsabili_operatori_id_operatore ON responsabili_operatori(id_operatore);
CREATE INDEX idx_responsabili_operatori_id_responsabile ON responsabili_operatori(id_responsabile);
CREATE INDEX idx_disponibilita_id_operatore ON disponibilita(id_operatore_responsabile);
CREATE INDEX idx_disponibilita_id_creator ON disponibilita(id_creator);
CREATE INDEX idx_incassi_id_disponibilita ON incassi_per_turni(id_disponibilita);
CREATE INDEX idx_note_utente_id_utente ON note_utente(id_utente);
CREATE INDEX idx_richieste_id_operatore ON richieste(id_operatore_responsabile);
CREATE INDEX idx_richieste_id_utente ON richieste(id_utente);

-- Funzione per generare UUID v4
DELIMITER //
CREATE FUNCTION IF NOT EXISTS uuid_v4() 
RETURNS CHAR(36)
BEGIN
    -- Genera un UUID v4 (casuale)
    RETURN LOWER(CONCAT(
        HEX(RANDOM_BYTES(4)),
        '-',
        HEX(RANDOM_BYTES(2)),
        '-4',
        SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3),
        '-',
        HEX(FLOOR(ASCII(RANDOM_BYTES(1)) / 64) + 8),
        SUBSTR(HEX(RANDOM_BYTES(2)), 2, 3),
        '-',
        HEX(RANDOM_BYTES(6))
    ));
END //
DELIMITER ;

-- Trigger per generare automaticamente UUID per ogni nuova riga
DELIMITER //

-- Trigger per users
CREATE TRIGGER IF NOT EXISTS before_insert_users
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

-- Trigger per Creator
CREATE TRIGGER IF NOT EXISTS before_insert_creator
BEFORE INSERT ON Creator
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

-- Trigger per Operatori
CREATE TRIGGER IF NOT EXISTS before_insert_operatori
BEFORE INSERT ON Operatori
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

-- Trigger per Responsabili
CREATE TRIGGER IF NOT EXISTS before_insert_responsabili
BEFORE INSERT ON Responsabili
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

-- Trigger per responsabili_operatori
CREATE TRIGGER IF NOT EXISTS before_insert_responsabili_operatori
BEFORE INSERT ON responsabili_operatori
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

-- Trigger per disponibilita
CREATE TRIGGER IF NOT EXISTS before_insert_disponibilita
BEFORE INSERT ON disponibilita
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

-- Trigger per incassi_per_turni
CREATE TRIGGER IF NOT EXISTS before_insert_incassi_per_turni
BEFORE INSERT ON incassi_per_turni
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

-- Trigger per utenti
CREATE TRIGGER IF NOT EXISTS before_insert_utenti
BEFORE INSERT ON utenti
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

-- Trigger per note_utente
CREATE TRIGGER IF NOT EXISTS before_insert_note_utente
BEFORE INSERT ON note_utente
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

-- Trigger per richieste
CREATE TRIGGER IF NOT EXISTS before_insert_richieste
BEFORE INSERT ON richieste
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        SET NEW.id = uuid_v4();
    END IF;
END //

DELIMITER ;

-- Inserimento utente admin iniziale (password: admin123)
-- La password è hashata con bcrypt e dovrebbe essere generata dall'applicazione
-- INSERT INTO users (id, email, password, role, created_at, updated_at)
-- VALUES (uuid_v4(), 'admin@example.com', '$2b$10$X7VYHy.CgMHPBN0C0pZh6OYGkZQRnGT8MrOdCzXvCsKWH9vMgr9Uu', 'ADMIN', NOW(), NOW());
   ```
