/*
  # Fix recursive policies

  1. Changes
    - Remove all existing policies that might cause recursion
    - Create new simplified policies for all tables
    - Ensure no circular references in policy definitions
    
  2. Security
    - All tables still require authentication
    - Policies are simplified but maintain basic security
*/

-- Drop all existing policies to start fresh
DO $$ 
BEGIN
    -- Drop policies for operatori
    DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON operatori;
    DROP POLICY IF EXISTS "Abilita inserimento per utenti autenticati" ON operatori;
    DROP POLICY IF EXISTS "Abilita aggiornamento per utenti autenticati" ON operatori;
    DROP POLICY IF EXISTS "Abilita eliminazione per utenti autenticati" ON operatori;
    DROP POLICY IF EXISTS "Consenti accesso completo agli operatori" ON operatori;

    -- Drop policies for responsabili
    DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON responsabili;
    DROP POLICY IF EXISTS "Abilita inserimento per utenti autenticati" ON responsabili;
    DROP POLICY IF EXISTS "Abilita aggiornamento per utenti autenticati" ON responsabili;
    DROP POLICY IF EXISTS "Abilita eliminazione per utenti autenticati" ON responsabili;
    DROP POLICY IF EXISTS "Consenti accesso completo ai responsabili" ON responsabili;

    -- Drop policies for creator
    DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON creator;
    DROP POLICY IF EXISTS "Consenti accesso completo ai creator" ON creator;

    -- Drop policies for responsabili_creator
    DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON responsabili_creator;
    DROP POLICY IF EXISTS "Consenti accesso completo a responsabili_creator" ON responsabili_creator;

    -- Drop policies for responsabili_operatori
    DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON responsabili_operatori;
    DROP POLICY IF EXISTS "Consenti accesso completo a responsabili_operatori" ON responsabili_operatori;

    -- Drop policies for disponibilita
    DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON disponibilita;
    DROP POLICY IF EXISTS "Consenti accesso completo a disponibilita" ON disponibilita;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Create new simplified policies for each table
CREATE POLICY "enable_all_access" ON operatori
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all_access" ON responsabili
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all_access" ON creator
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all_access" ON responsabili_creator
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all_access" ON responsabili_operatori
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "enable_all_access" ON disponibilita
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);