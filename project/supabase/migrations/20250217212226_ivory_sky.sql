/*
  # Fix recursive policies - Final version

  1. Changes
    - Drop all existing policies that might cause recursion
    - Create new simplified policies for all tables
    - Ensure no circular references in policy definitions
    - Add proper indexes for performance
    
  2. Security
    - All tables still require authentication
    - Policies are simplified but maintain basic security
*/

-- Drop all existing policies to start fresh
DO $$ 
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "enable_all_access" ON operatori;
    DROP POLICY IF EXISTS "enable_all_access" ON responsabili;
    DROP POLICY IF EXISTS "enable_all_access" ON creator;
    DROP POLICY IF EXISTS "enable_all_access" ON responsabili_creator;
    DROP POLICY IF EXISTS "enable_all_access" ON responsabili_operatori;
    DROP POLICY IF EXISTS "enable_all_access" ON disponibilita;
    
    -- Drop any remaining old policies
    DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON operatori;
    DROP POLICY IF EXISTS "Consenti accesso completo agli operatori" ON operatori;
    DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON responsabili;
    DROP POLICY IF EXISTS "Consenti accesso completo ai responsabili" ON responsabili;
    DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON creator;
    DROP POLICY IF EXISTS "Consenti accesso completo ai creator" ON creator;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Create new simplified policies for each table
CREATE POLICY "enable_read_access" ON operatori
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "enable_write_access" ON operatori
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "enable_update_access" ON operatori
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_delete_access" ON operatori
    FOR DELETE TO authenticated
    USING (true);

CREATE POLICY "enable_read_access" ON responsabili
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "enable_write_access" ON responsabili
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "enable_update_access" ON responsabili
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_delete_access" ON responsabili
    FOR DELETE TO authenticated
    USING (true);

CREATE POLICY "enable_read_access" ON creator
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "enable_write_access" ON creator
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "enable_update_access" ON creator
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_delete_access" ON creator
    FOR DELETE TO authenticated
    USING (true);

CREATE POLICY "enable_read_access" ON responsabili_creator
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "enable_write_access" ON responsabili_creator
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "enable_update_access" ON responsabili_creator
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_delete_access" ON responsabili_creator
    FOR DELETE TO authenticated
    USING (true);

CREATE POLICY "enable_read_access" ON responsabili_operatori
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "enable_write_access" ON responsabili_operatori
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "enable_update_access" ON responsabili_operatori
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_delete_access" ON responsabili_operatori
    FOR DELETE TO authenticated
    USING (true);

CREATE POLICY "enable_read_access" ON disponibilita
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "enable_write_access" ON disponibilita
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "enable_update_access" ON disponibilita
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_delete_access" ON disponibilita
    FOR DELETE TO authenticated
    USING (true);

-- Ensure all indexes exist for performance
DO $$ 
BEGIN
    -- Only create indexes if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_responsabili_operatori_operatore') THEN
        CREATE INDEX idx_responsabili_operatori_operatore ON responsabili_operatori(id_operatore);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_responsabili_operatori_responsabile') THEN
        CREATE INDEX idx_responsabili_operatori_responsabile ON responsabili_operatori(id_responsabile);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_responsabili_creator_responsabile') THEN
        CREATE INDEX idx_responsabili_creator_responsabile ON responsabili_creator(id_responsabile);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_responsabili_creator_creator') THEN
        CREATE INDEX idx_responsabili_creator_creator ON responsabili_creator(id_creator);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_disponibilita_operatore_resp') THEN
        CREATE INDEX idx_disponibilita_operatore_resp ON disponibilita(id_operatore_responsabile);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_disponibilita_creator') THEN
        CREATE INDEX idx_disponibilita_creator ON disponibilita(id_creator);
    END IF;
END $$;