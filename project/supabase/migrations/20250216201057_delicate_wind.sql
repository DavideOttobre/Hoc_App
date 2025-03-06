/*
  # Add RLS policies for responsabili_operatori table

  1. Security Changes
    - Add policies for CRUD operations on responsabili_operatori table
    - Enable insert, update, and delete for authenticated users
    - Maintain existing read access policy
*/

DO $$ 
BEGIN
    -- Insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'responsabili_operatori' 
        AND policyname = 'Abilita inserimento per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita inserimento per utenti autenticati" ON responsabili_operatori
            FOR INSERT TO authenticated
            WITH CHECK (true);
    END IF;

    -- Update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'responsabili_operatori' 
        AND policyname = 'Abilita aggiornamento per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita aggiornamento per utenti autenticati" ON responsabili_operatori
            FOR UPDATE TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;

    -- Delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'responsabili_operatori' 
        AND policyname = 'Abilita eliminazione per utenti autenticati'
    ) THEN
        CREATE POLICY "Abilita eliminazione per utenti autenticati" ON responsabili_operatori
            FOR DELETE TO authenticated
            USING (true);
    END IF;
END $$;