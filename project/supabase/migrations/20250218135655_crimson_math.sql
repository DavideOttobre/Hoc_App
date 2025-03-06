/*
  # Semplificazione delle policy RLS

  1. Modifiche
    - Rimozione di tutte le policy esistenti basate sui ruoli
    - Creazione di policy semplificate che consentono l'accesso completo agli utenti autenticati
    - Mantenimento della RLS di base per sicurezza
    
  2. Sicurezza
    - Richiesta autenticazione per tutte le operazioni
    - Accesso completo per tutti gli utenti autenticati
*/

-- Rimuovi tutte le policy esistenti
DO $$ 
BEGIN
    -- Rimuovi le policy per ogni tabella
    DROP POLICY IF EXISTS "enable_read_access" ON operatori;
    DROP POLICY IF EXISTS "enable_write_access" ON operatori;
    DROP POLICY IF EXISTS "enable_update_access" ON operatori;
    DROP POLICY IF EXISTS "enable_delete_access" ON operatori;

    DROP POLICY IF EXISTS "enable_read_access" ON responsabili;
    DROP POLICY IF EXISTS "enable_write_access" ON responsabili;
    DROP POLICY IF EXISTS "enable_update_access" ON responsabili;
    DROP POLICY IF EXISTS "enable_delete_access" ON responsabili;

    DROP POLICY IF EXISTS "enable_read_access" ON creator;
    DROP POLICY IF EXISTS "enable_write_access" ON creator;
    DROP POLICY IF EXISTS "enable_update_access" ON creator;
    DROP POLICY IF EXISTS "enable_delete_access" ON creator;

    DROP POLICY IF EXISTS "enable_read_access" ON responsabili_creator;
    DROP POLICY IF EXISTS "enable_write_access" ON responsabili_creator;
    DROP POLICY IF EXISTS "enable_update_access" ON responsabili_creator;
    DROP POLICY IF EXISTS "enable_delete_access" ON responsabili_creator;

    DROP POLICY IF EXISTS "enable_read_access" ON responsabili_operatori;
    DROP POLICY IF EXISTS "enable_write_access" ON responsabili_operatori;
    DROP POLICY IF EXISTS "enable_update_access" ON responsabili_operatori;
    DROP POLICY IF EXISTS "enable_delete_access" ON responsabili_operatori;

    DROP POLICY IF EXISTS "enable_read_access" ON disponibilita;
    DROP POLICY IF EXISTS "enable_write_access" ON disponibilita;
    DROP POLICY IF EXISTS "enable_update_access" ON disponibilita;
    DROP POLICY IF EXISTS "enable_delete_access" ON disponibilita;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Crea nuove policy semplificate per ogni tabella
CREATE POLICY "enable_all" ON operatori
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all" ON responsabili
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all" ON creator
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all" ON responsabili_creator
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all" ON responsabili_operatori
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all" ON disponibilita
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all" ON incassi_per_turni
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all" ON utenti
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all" ON note_utente
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all" ON richieste
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);