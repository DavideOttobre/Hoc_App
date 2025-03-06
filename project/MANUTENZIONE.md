# Guida alla Manutenzione e all'Esecuzione dell'Applicazione

Questa guida fornisce istruzioni dettagliate per la corretta esecuzione, manutenzione e risoluzione dei problemi dell'applicazione HOC Admin Dashboard.

## Indice

1. [Requisiti di Sistema](#requisiti-di-sistema)
2. [Avvio dell'Applicazione](#avvio-dellapplicazione)
3. [Manutenzione del Database](#manutenzione-del-database)
4. [Aggiornamento del Codice](#aggiornamento-del-codice)
5. [Risoluzione dei Problemi](#risoluzione-dei-problemi)
6. [Backup e Ripristino](#backup-e-ripristino)
7. [Monitoraggio e Logging](#monitoraggio-e-logging)
8. [Sicurezza](#sicurezza)

## Requisiti di Sistema

### Software Necessario

- **Node.js**: versione 18.x o superiore
- **MySQL**: versione 8.0 o superiore
- **npm**: versione 8.x o superiore
- **Git**: per la gestione del codice sorgente

### Requisiti Hardware Consigliati

- **CPU**: 2 core o superiore
- **RAM**: 4GB o superiore
- **Spazio su disco**: 1GB minimo per l'applicazione, più spazio per il database in base alle esigenze

## Avvio dell'Applicazione

### Prima Installazione

1. **Clonare il repository**:
   ```bash
   git clone [url-repository]
   cd [nome-directory]
   ```

2. **Configurare il database MySQL**:
   ```sql
   -- Accedere a MySQL
   mysql -u root -p
   
   -- Creare il database
   CREATE DATABASE hoc_app;
   
   -- Creare un utente con privilegi
   CREATE USER 'hoc_user'@'%' IDENTIFIED BY 'password_sicura';
   GRANT ALL PRIVILEGES ON hoc_app.* TO 'hoc_user'@'%';
   FLUSH PRIVILEGES;
   
   -- Uscire da MySQL
   EXIT;
   ```

3. **Configurare le variabili d'ambiente**:
   - Backend: Copiare `.env.example` in `.env` e modificare i valori
     ```
     DATABASE_URL="mysql://hoc_user:password_sicura@localhost:3306/hoc_app"
     JWT_SECRET="chiave_segreta_molto_lunga_e_complessa"
     NODE_ENV="production"
     PORT=3001
     ```
   - Frontend: Copiare `.env.example` in `.env` e modificare i valori
     ```
     VITE_API_URL=http://localhost:3001/api
     ```

4. **Installare le dipendenze e inizializzare il database**:
   ```bash
   # Backend
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   
   # Frontend
   cd ..
   npm install
   ```

5. **Creare il primo utente amministratore**:
   ```bash
   # Avviare il backend
   cd backend
   npm run start
   
   # In un altro terminale, creare l'utente admin
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password_sicura","role":"ADMIN"}'
   ```

### Avvio in Ambiente di Sviluppo

1. **Avviare il backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Avviare il frontend**:
   ```bash
   # In un altro terminale
   cd [root-directory]
   npm run dev
   ```

3. **Accedere all'applicazione**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Avvio in Ambiente di Produzione

1. **Costruire il frontend**:
   ```bash
   npm run build
   ```

2. **Avviare il backend in modalità produzione**:
   ```bash
   cd backend
   npm run start
   ```

3. **Servire il frontend con un server web**:
   - Nginx (consigliato)
   - Apache
   - Vercel, Netlify, ecc.

## Manutenzione del Database

### Backup Regolari

1. **Backup manuale del database**:
   ```bash
   # Backup completo
   mysqldump -u hoc_user -p hoc_app > backup_$(date +%Y%m%d).sql
   
   # Backup solo della struttura
   mysqldump -u hoc_user -p --no-data hoc_app > schema_$(date +%Y%m%d).sql
   
   # Backup solo dei dati
   mysqldump -u hoc_user -p --no-create-info hoc_app > data_$(date +%Y%m%d).sql
   ```

2. **Backup automatico** (crontab):
   ```bash
   # Aggiungere al crontab (crontab -e)
   0 2 * * * mysqldump -u hoc_user -p'password_sicura' hoc_app > /path/to/backups/backup_$(date +\%Y\%m\%d).sql
   ```

### Manutenzione del Database

1. **Ottimizzazione delle tabelle**:
   ```sql
   OPTIMIZE TABLE nome_tabella;
   ```

2. **Analisi delle tabelle**:
   ```sql
   ANALYZE TABLE nome_tabella;
   ```

3. **Verifica dell'integrità**:
   ```sql
   CHECK TABLE nome_tabella;
   ```

### Migrazioni del Database

1. **Creare una nuova migrazione**:
   ```bash
   cd backend
   npx prisma migrate dev --name nome_migrazione
   ```

2. **Applicare le migrazioni in produzione**:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

## Aggiornamento del Codice

### Procedura di Aggiornamento

1. **Backup del codice e del database**:
   ```bash
   # Backup del database
   mysqldump -u hoc_user -p hoc_app > backup_pre_update.sql
   
   # Backup del codice (se non si usa git)
   cp -r [directory-progetto] [directory-progetto]_backup
   ```

2. **Aggiornare il codice**:
   ```bash
   # Se si usa git
   git pull
   
   # Altrimenti, sostituire i file manualmente
   ```

3. **Aggiornare le dipendenze**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ..
   npm install
   ```

4. **Applicare le migrazioni del database**:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

5. **Ricostruire il frontend**:
   ```bash
   npm run build
   ```

6. **Riavviare i servizi**:
   ```bash
   # Riavviare il backend
   cd backend
   npm run start
   
   # Riavviare il server web che serve il frontend
   ```

## Risoluzione dei Problemi

### Problemi Comuni e Soluzioni

#### Backend non si avvia

1. **Verificare le variabili d'ambiente**:
   - Controllare che il file `.env` esista e contenga i valori corretti
   - Verificare che la stringa di connessione al database sia corretta

2. **Verificare la connessione al database**:
   ```bash
   mysql -u hoc_user -p -h localhost hoc_app
   ```

3. **Verificare i log**:
   ```bash
   cd backend
   cat logs/error.log # se configurato
   ```

#### Frontend non si connette al backend

1. **Verificare che il backend sia in esecuzione**:
   ```bash
   curl http://localhost:3001/api
   ```

2. **Verificare le variabili d'ambiente del frontend**:
   - Controllare che `VITE_API_URL` punti all'URL corretto del backend

3. **Verificare i CORS**:
   - Assicurarsi che il backend accetti richieste dall'origine del frontend

#### Errori di autenticazione

1. **Verificare il JWT_SECRET**:
   - Assicurarsi che sia lo stesso utilizzato per generare i token

2. **Verificare la scadenza dei token**:
   - I token JWT hanno una scadenza, potrebbe essere necessario effettuare nuovamente il login

3. **Verificare le credenziali**:
   - Assicurarsi che l'utente esista nel database

## Backup e Ripristino

### Backup Completo dell'Applicazione

1. **Backup del database**:
   ```bash
   mysqldump -u hoc_user -p hoc_app > backup_full.sql
   ```

2. **Backup del codice**:
   ```bash
   tar -czvf app_backup.tar.gz [directory-progetto]
   ```

3. **Backup delle configurazioni**:
   ```bash
   cp backend/.env backend/.env.backup
   cp .env .env.backup
   ```

### Ripristino dell'Applicazione

1. **Ripristino del database**:
   ```bash
   mysql -u hoc_user -p hoc_app < backup_full.sql
   ```

2. **Ripristino del codice**:
   ```bash
   tar -xzvf app_backup.tar.gz
   ```

3. **Ripristino delle configurazioni**:
   ```bash
   cp backend/.env.backup backend/.env
   cp .env.backup .env
   ```

## Monitoraggio e Logging

### Configurazione dei Log

1. **Log del backend**:
   - Configurare Winston o un altro logger in `backend/server.js`
   - Impostare diversi livelli di log (error, warn, info, debug)

2. **Log del database**:
   - Abilitare i log delle query lente in MySQL
   ```sql
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 1;
   ```

### Monitoraggio delle Prestazioni

1. **Monitoraggio del backend**:
   - Utilizzare PM2 per il monitoraggio del processo Node.js
   ```bash
   npm install -g pm2
   cd backend
   pm2 start server.js --name hoc-backend
   pm2 monit
   ```

2. **Monitoraggio del database**:
   - Utilizzare strumenti come MySQL Workbench o phpMyAdmin
   - Monitorare l'utilizzo delle risorse con `SHOW PROCESSLIST`

## Sicurezza

### Best Practices di Sicurezza

1. **Aggiornamenti regolari**:
   - Mantenere Node.js, MySQL e tutte le dipendenze aggiornate
   ```bash
   npm audit
   npm audit fix
   ```

2. **Protezione del database**:
   - Limitare l'accesso al database solo dall'IP del server
   - Utilizzare password complesse
   - Limitare i privilegi dell'utente del database

3. **Protezione dell'API**:
   - Utilizzare HTTPS in produzione
   - Implementare rate limiting
   - Validare tutti gli input

4. **Gestione dei segreti**:
   - Non committare mai file `.env` nel repository
   - Ruotare regolarmente le chiavi JWT e le password

### Controlli di Sicurezza Periodici

1. **Scansione delle vulnerabilità**:
   ```bash
   npm audit
   ```

2. **Revisione dei log**:
   - Controllare regolarmente i log per attività sospette

3. **Test di penetrazione**:
   - Eseguire test di penetrazione periodici sull'applicazione

---

Questa guida è un documento in evoluzione. Aggiornala regolarmente con nuove informazioni e procedure man mano che l'applicazione si evolve.
