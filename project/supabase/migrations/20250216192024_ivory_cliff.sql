/*
  # Aggiunta policy RLS per operazioni CRUD

  1. Modifiche
    - Aggiunta policy per inserimento dati nelle tabelle responsabili e operatori
    - Aggiunta policy per aggiornamento dati nelle tabelle responsabili e operatori
    - Aggiunta policy per eliminazione dati nelle tabelle responsabili e operatori

  2. Security
    - Solo gli utenti autenticati possono eseguire operazioni CRUD
    - Mantenute le policy di lettura esistenti
*/

-- Policy per la tabella responsabili
CREATE POLICY "Abilita inserimento per utenti autenticati" ON responsabili
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Abilita aggiornamento per utenti autenticati" ON responsabili
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Abilita eliminazione per utenti autenticati" ON responsabili
    FOR DELETE TO authenticated
    USING (true);

-- Policy per la tabella operatori
CREATE POLICY "Abilita inserimento per utenti autenticati" ON operatori
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Abilita aggiornamento per utenti autenticati" ON operatori
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Abilita eliminazione per utenti autenticati" ON operatori
    FOR DELETE TO authenticated
    USING (true);