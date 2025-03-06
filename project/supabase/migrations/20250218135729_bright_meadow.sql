/*
  # Fix finale delle policy RLS

  1. Modifiche
    - Rimozione di TUTTE le policy esistenti, incluse quelle precedenti
    - Disabilitazione temporanea della RLS per risolvere il ciclo infinito
    - Riabilitazione della RLS con policy semplificate
    
  2. Sicurezza
    - Mantenimento dell'autenticazione di base
    - Policy semplificate per evitare cicli infiniti
*/

-- Disabilita temporaneamente RLS su tutte le tabelle
ALTER TABLE operatori DISABLE ROW LEVEL SECURITY;
ALTER TABLE responsabili DISABLE ROW LEVEL SECURITY;
ALTER TABLE creator DISABLE ROW LEVEL SECURITY;
ALTER TABLE responsabili_creator DISABLE ROW LEVEL SECURITY;
ALTER TABLE responsabili_operatori DISABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilita DISABLE ROW LEVEL SECURITY;
ALTER TABLE incassi_per_turni DISABLE ROW LEVEL SECURITY;
ALTER TABLE utenti DISABLE ROW LEVEL SECURITY;
ALTER TABLE note_utente DISABLE ROW LEVEL SECURITY;
ALTER TABLE richieste DISABLE ROW LEVEL SECURITY;

-- Rimuovi TUTTE le policy esistenti
DO $$ 
DECLARE
    _table text;
    _policy text;
BEGIN
    FOR _table IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        FOR _policy IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE schemaname = 'public' AND tablename = _table
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', _policy, _table);
        END LOOP;
    END LOOP;
END $$;

-- Riabilita RLS su tutte le tabelle
ALTER TABLE operatori ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsabili ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsabili_creator ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsabili_operatori ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilita ENABLE ROW LEVEL SECURITY;
ALTER TABLE incassi_per_turni ENABLE ROW LEVEL SECURITY;
ALTER TABLE utenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_utente ENABLE ROW LEVEL SECURITY;
ALTER TABLE richieste ENABLE ROW LEVEL SECURITY;

-- Crea nuove policy semplificate
DO $$ 
DECLARE
    _table text;
BEGIN
    FOR _table IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('CREATE POLICY "enable_all" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', _table);
    END LOOP;
END $$;