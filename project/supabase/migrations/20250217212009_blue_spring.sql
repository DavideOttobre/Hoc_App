-- Rimuovi tutte le policy esistenti
DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON operatori;
DROP POLICY IF EXISTS "Abilita inserimento per utenti autenticati" ON operatori;
DROP POLICY IF EXISTS "Abilita aggiornamento per utenti autenticati" ON operatori;
DROP POLICY IF EXISTS "Abilita eliminazione per utenti autenticati" ON operatori;

DROP POLICY IF EXISTS "Abilita lettura per utenti autenticati" ON responsabili;
DROP POLICY IF EXISTS "Abilita inserimento per utenti autenticati" ON responsabili;
DROP POLICY IF EXISTS "Abilita aggiornamento per utenti autenticati" ON responsabili;
DROP POLICY IF EXISTS "Abilita eliminazione per utenti autenticati" ON responsabili;

-- Crea nuove policy semplificate per operatori
CREATE POLICY "Consenti accesso completo agli operatori" ON operatori
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Crea nuove policy semplificate per responsabili
CREATE POLICY "Consenti accesso completo ai responsabili" ON responsabili
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Crea nuove policy semplificate per creator
CREATE POLICY "Consenti accesso completo ai creator" ON creator
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Crea nuove policy semplificate per responsabili_creator
CREATE POLICY "Consenti accesso completo a responsabili_creator" ON responsabili_creator
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Crea nuove policy semplificate per responsabili_operatori
CREATE POLICY "Consenti accesso completo a responsabili_operatori" ON responsabili_operatori
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Crea nuove policy semplificate per disponibilita
CREATE POLICY "Consenti accesso completo a disponibilita" ON disponibilita
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);