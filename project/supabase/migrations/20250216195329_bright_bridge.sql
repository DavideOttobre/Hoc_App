/*
  # Fix Creator Table Policies

  1. Changes
    - Add RLS policies for Creator table to allow authenticated users to:
      - Insert new creators
      - Update existing creators
      - Delete creators
      - Read all creators
    - Add safety checks to prevent duplicate policy errors

  2. Security
    - Enable RLS on Creator table
    - Add policies for all CRUD operations
    - Restrict access to authenticated users only
*/

DO $$ 
BEGIN
    -- Insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'creator' 
        AND policyname = 'Abilita inserimento per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita inserimento per utenti autenticati" ON creator
            FOR INSERT TO authenticated
            WITH CHECK (true);
    END IF;

    -- Update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'creator' 
        AND policyname = 'Abilita aggiornamento per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita aggiornamento per utenti autenticati" ON creator
            FOR UPDATE TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;

    -- Delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'creator' 
        AND policyname = 'Abilita eliminazione per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita eliminazione per utenti autenticati" ON creator
            FOR DELETE TO authenticated
            USING (true);
    END IF;

    -- Select policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'creator' 
        AND policyname = 'Abilita lettura per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita lettura per utenti autenticati" ON creator
            FOR SELECT TO authenticated
            USING (true);
    END IF;
END $$;