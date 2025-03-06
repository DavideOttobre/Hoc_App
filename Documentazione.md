# HOC Admin Dashboard

Applicazione web per la gestione di operatori, responsabili, creator e disponibilità.

## Migrazione da Supabase a MySQL

Questo progetto è stato migrato da Supabase a un backend personalizzato con Express.js e MySQL.

## Struttura del Progetto

```
/
├── backend/                  # Backend Express.js
│   ├── controllers/          # Controller per le API
│   ├── middleware/           # Middleware (auth, error handling)
│   ├── prisma/               # Schema Prisma e migrazioni
│   ├── routes/               # Definizione delle route API
│   ├── services/             # Logica di business
│   ├── utils/                # Utility functions
│   ├── .env                  # Variabili d'ambiente backend
│   ├── package.json          # Dipendenze backend
│   └── server.js             # Entry point del server
│
├── src/                      # Frontend React
│   ├── components/           # Componenti React
│   ├── contexts/             # Context API
│   ├── lib/                  # Utility e client API
│   └── pages/                # Pagine dell'applicazione
│
├── .env                      # Variabili d'ambiente frontend
└── package.json              # Dipendenze frontend
```

## Requisiti

- Node.js (v18+)
- MySQL (v8+)

## Configurazione

### 1. Database MySQL

```sql
-- Creare il database
CREATE DATABASE hoc_app;

-- Creare un utente con privilegi
CREATE USER 'hoc_user'@'%' IDENTIFIED BY 'password_sicura';
GRANT ALL PRIVILEGES ON hoc_app.* TO 'hoc_user'@'%';
FLUSH PRIVILEGES;
```

### 2. Backend

1. Installare le dipendenze:
   ```bash
   cd backend
   npm install
   ```

2. Configurare le variabili d'ambiente:
   - Modifica il file `backend/.env` con i dettagli del tuo database MySQL

3. Generare il client Prisma e applicare le migrazioni:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. Avviare il server:
   ```bash
   npm run dev
   ```

### 3. Frontend

1. Installare le dipendenze:
   ```bash
   npm install
   ```

2. Configurare le variabili d'ambiente:
   - Modifica il file `.env` con l'URL del tuo backend API

3. Avviare l'applicazione:
   ```bash
   npm run dev
   ```

## Autenticazione

Il sistema utilizza JWT (JSON Web Tokens) per l'autenticazione. Per creare il primo utente admin:

```bash
# Utilizzando curl
curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"Admin123!","role":"ADMIN"}'
```

## Accesso Remoto

Per rendere l'applicazione accessibile da remoto durante lo sviluppo:

1. **Backend**: Utilizzare ngrok per esporre il server API
   ```bash
   ngrok http 3001
   ```

2. **Database**: Configurare il port forwarding per MySQL o utilizzare un database cloud

## Deployment

### Opzione 1: VPS

1. Configurare un server con Nginx come reverse proxy
2. Configurare MySQL sul server
3. Deployare il backend e il frontend

### Opzione 2: Servizi Cloud

1. **Frontend**: Netlify, Vercel, o Firebase Hosting
2. **Backend**: Heroku, Railway, o servizi simili
3. **Database**: MySQL gestito (AWS RDS, DigitalOcean, ecc.)
