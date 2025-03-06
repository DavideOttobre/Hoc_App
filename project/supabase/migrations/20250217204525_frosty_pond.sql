/*
  # Creazione tabella responsabili_creator

  1. Nuove Tabelle
    - `responsabili_creator`
      - `id` (uuid, chiave primaria)
      - `id_responsabile` (uuid, chiave esterna verso Responsabili)
      - `id_creator` (uuid, chiave esterna verso Creator)
      - `created_at` (timestamp con timezone)

  2. Sicurezza
    - Abilitazione RLS sulla tabella
    - Policy per lettura, inserimento, aggiornamento ed eliminazione per utenti autenticati

  3. Indici
    - Indice sulla colonna id_responsabile
    - Indice sulla colonna id_creator
*/

-- Creazione della tabella responsabili_creator
CREATE TABLE responsabili_creator (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id_responsabile uuid NOT NULL REFERENCES Responsabili(id) ON DELETE CASCADE,
    id_creator uuid NOT NULL REFERENCES Creator(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Abilitazione Row Level Security
ALTER TABLE responsabili_creator ENABLE ROW LEVEL SECURITY;

-- Creazione delle policy
CREATE POLICY "Abilita lettura per utenti autenticati" ON responsabili_creator
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Abilita inserimento per utenti autenticati" ON responsabili_creator
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Abilita aggiornamento per utenti autenticati" ON responsabili_creator
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Abilita eliminazione per utenti autenticati" ON responsabili_creator
    FOR DELETE TO authenticated
    USING (true);

-- Creazione degli indici
CREATE INDEX idx_responsabili_creator_responsabile ON responsabili_creator(id_responsabile);
CREATE INDEX idx_responsabili_creator_creator ON responsabili_creator(id_creator);

-- Aggiunta vincolo di unicità per evitare duplicati
ALTER TABLE responsabili_creator
    ADD CONSTRAINT unique_responsabile_creator 
    UNIQUE (id_responsabile, id_creator);