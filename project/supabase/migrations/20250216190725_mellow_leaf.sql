/*
  # Schema update for Italian table names

  1. New Tables
    - `Creator` (creators)
    - `Operatori` (operators)
    - `Responsabili` (managers)
    - `responsabili_operatori` (manager-operator relations)
    - `disponibilita` (availability)
    - `incassi_per_turni` (shift earnings)
    - `utenti` (users)
    - `note_utente` (user notes)
    - `richieste` (requests)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Rimozione tabelle esistenti in ordine inverso di dipendenza
DROP TABLE IF EXISTS richieste CASCADE;
DROP TABLE IF EXISTS note_utente CASCADE;
DROP TABLE IF EXISTS incassi_per_turni CASCADE;
DROP TABLE IF EXISTS disponibilita CASCADE;
DROP TABLE IF EXISTS responsabili_operatori CASCADE;
DROP TABLE IF EXISTS Responsabili CASCADE;
DROP TABLE IF EXISTS Operatori CASCADE;
DROP TABLE IF EXISTS Creator CASCADE;
DROP TABLE IF EXISTS utenti CASCADE;

-- Creazione tabelle con struttura corretta
CREATE TABLE Creator (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL,
    cognome text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE Operatori (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL,
    cognome text NOT NULL,
    email text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE Responsabili (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL,
    cognome text NOT NULL,
    email text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE responsabili_operatori (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_operatore uuid NOT NULL REFERENCES Operatori(id) ON DELETE CASCADE,
    id_responsabile uuid NOT NULL REFERENCES Responsabili(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE disponibilita (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    data_prenotazione timestamptz NOT NULL,
    data_disponibilita timestamptz NOT NULL,
    fascia_03_07 text NOT NULL,
    fascia_07_12 text NOT NULL,
    fascia_12_17 text NOT NULL,
    fascia_17_22 text NOT NULL,
    fascia_22_03 text NOT NULL,
    id_operatore_responsabile uuid NOT NULL REFERENCES responsabili_operatori(id) ON DELETE CASCADE,
    id_creator uuid NOT NULL REFERENCES Creator(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE incassi_per_turni (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    incasso numeric(10,2) NOT NULL,
    id_disponibilita uuid NOT NULL REFERENCES disponibilita(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE utenti (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname_utente text NOT NULL,
    id_univoco_of text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE note_utente (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nota text NOT NULL,
    id_utente uuid NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE richieste (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_richiesta integer NOT NULL,
    note_richiesta text NOT NULL,
    importo numeric(10,2) NOT NULL,
    stato_richiesta text NOT NULL,
    data_consegna_prevista date NOT NULL,
    data_consegna_effettiva date,
    note_su_consegna text,
    id_operatore_responsabile uuid NOT NULL REFERENCES responsabili_operatori(id) ON DELETE CASCADE,
    id_utente uuid NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Abilitazione Row Level Security
ALTER TABLE Creator ENABLE ROW LEVEL SECURITY;
ALTER TABLE Operatori ENABLE ROW LEVEL SECURITY;
ALTER TABLE Responsabili ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsabili_operatori ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilita ENABLE ROW LEVEL SECURITY;
ALTER TABLE incassi_per_turni ENABLE ROW LEVEL SECURITY;
ALTER TABLE utenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_utente ENABLE ROW LEVEL SECURITY;
ALTER TABLE richieste ENABLE ROW LEVEL SECURITY;

-- Creazione policy per utenti autenticati
CREATE POLICY "Abilita lettura per utenti autenticati" ON Creator
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Abilita lettura per utenti autenticati" ON Operatori
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Abilita lettura per utenti autenticati" ON Responsabili
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Abilita lettura per utenti autenticati" ON responsabili_operatori
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Abilita lettura per utenti autenticati" ON disponibilita
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Abilita lettura per utenti autenticati" ON incassi_per_turni
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Abilita lettura per utenti autenticati" ON utenti
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Abilita lettura per utenti autenticati" ON note_utente
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Abilita lettura per utenti autenticati" ON richieste
    FOR SELECT TO authenticated USING (true);

-- Creazione indici per migliorare le performance
CREATE INDEX idx_responsabili_operatori_operatore ON responsabili_operatori(id_operatore);
CREATE INDEX idx_responsabili_operatori_responsabile ON responsabili_operatori(id_responsabile);
CREATE INDEX idx_disponibilita_operatore_resp ON disponibilita(id_operatore_responsabile);
CREATE INDEX idx_disponibilita_creator ON disponibilita(id_creator);
CREATE INDEX idx_incassi_disponibilita ON incassi_per_turni(id_disponibilita);
CREATE INDEX idx_note_utente ON note_utente(id_utente);
CREATE INDEX idx_richieste_utente ON richieste(id_utente);
CREATE INDEX idx_richieste_operatore_resp ON richieste(id_operatore_responsabile);