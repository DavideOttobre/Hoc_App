/*
  # Add RLS policies for disponibilita table

  1. Security Changes
    - Add policies for CRUD operations on disponibilita table
    - Enable insert, update, and delete for authenticated users
    - Maintain existing read access policy
*/

DO $$ 
BEGIN
    -- Insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'disponibilita' 
        AND policyname = 'Abilita inserimento per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita inserimento per utenti autenticati" ON disponibilita
            FOR INSERT TO authenticated
            WITH CHECK (true);
    END IF;

    -- Update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'disponibilita' 
        AND policyname = 'Abilita aggiornamento per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita aggiornamento per utenti autenticati" ON disponibilita
            FOR UPDATE TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;

    -- Delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'disponibilita' 
        AND policyname = 'Abilita eliminazione per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita eliminazione per utenti autenticati" ON disponibilita
            FOR DELETE TO authenticated
            USING (true);
    END IF;
END $$;