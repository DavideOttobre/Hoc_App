#!/usr/bin/env node

/**
 * Script di configurazione iniziale per HOC Admin Dashboard
 * 
 * Questo script aiuta a configurare l'applicazione per il primo utilizzo:
 * 1. Copia i file .env.example in .env
 * 2. Installa le dipendenze
 * 3. Genera il client Prisma
 * 4. Crea il database e applica le migrazioni
 * 5. Crea un utente admin iniziale (opzionale)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colori per il terminale
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Funzione per stampare messaggi colorati
function print(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Funzione per eseguire comandi con gestione degli errori
function execute(command, errorMessage) {
  try {
    print(`Esecuzione: ${command}`, colors.cyan);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    print(`${errorMessage}: ${error.message}`, colors.red);
    return false;
  }
}

// Funzione per copiare file
function copyFile(source, destination) {
  try {
    if (!fs.existsSync(source)) {
      print(`File sorgente non trovato: ${source}`, colors.red);
      return false;
    }
    
    fs.copyFileSync(source, destination);
    print(`File copiato: ${destination}`, colors.green);
    return true;
  } catch (error) {
    print(`Errore durante la copia del file: ${error.message}`, colors.red);
    return false;
  }
}

// Funzione principale
async function setup() {
  print('=== HOC Admin Dashboard - Script di configurazione ===', colors.bright + colors.green);
  
  // 1. Copia i file .env.example in .env
  print('\n1. Configurazione dei file .env', colors.bright);
  
  // Frontend .env
  if (!fs.existsSync('.env')) {
    copyFile('.env.example', '.env');
  } else {
    print('File .env del frontend già esistente, salto questo passaggio.', colors.yellow);
  }
  
  // Backend .env
  if (!fs.existsSync('backend/.env')) {
    copyFile('backend/.env.example', 'backend/.env');
  } else {
    print('File .env del backend già esistente, salto questo passaggio.', colors.yellow);
  }
  
  // 2. Installazione delle dipendenze
  print('\n2. Installazione delle dipendenze', colors.bright);
  
  // Frontend
  print('\nInstallazione dipendenze frontend...', colors.cyan);
  if (!execute('npm install', 'Errore durante l\'installazione delle dipendenze frontend')) {
    return;
  }
  
  // Backend
  print('\nInstallazione dipendenze backend...', colors.cyan);
  if (!execute('cd backend && npm install', 'Errore durante l\'installazione delle dipendenze backend')) {
    return;
  }
  
  // 3. Generazione del client Prisma
  print('\n3. Generazione del client Prisma', colors.bright);
  if (!execute('cd backend && npx prisma generate', 'Errore durante la generazione del client Prisma')) {
    return;
  }
  
  // 4. Configurazione del database
  print('\n4. Configurazione del database', colors.bright);
  
  // Chiedi all'utente se vuole configurare il database
  const configureDb = await new Promise(resolve => {
    rl.question('Vuoi configurare il database MySQL? (s/n): ', answer => {
      resolve(answer.toLowerCase() === 's');
    });
  });
  
  if (configureDb) {
    // Chiedi i dettagli del database
    const dbUser = await new Promise(resolve => {
      rl.question('Utente MySQL (default: root): ', answer => {
        resolve(answer || 'root');
      });
    });
    
    const dbPassword = await new Promise(resolve => {
      rl.question('Password MySQL: ', answer => {
        resolve(answer);
      });
    });
    
    const dbName = await new Promise(resolve => {
      rl.question('Nome del database (default: hoc_app): ', answer => {
        resolve(answer || 'hoc_app');
      });
    });
    
    const dbHost = await new Promise(resolve => {
      rl.question('Host del database (default: localhost): ', answer => {
        resolve(answer || 'localhost');
      });
    });
    
    const dbPort = await new Promise(resolve => {
      rl.question('Porta del database (default: 3306): ', answer => {
        resolve(answer || '3306');
      });
    });
    
    // Aggiorna il file .env del backend
    try {
      let envContent = fs.readFileSync('backend/.env', 'utf8');
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL="mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}"`
      );
      fs.writeFileSync('backend/.env', envContent);
      print('File .env del backend aggiornato con i dettagli del database.', colors.green);
    } catch (error) {
      print(`Errore durante l'aggiornamento del file .env: ${error.message}`, colors.red);
    }
    
    // Chiedi all'utente se vuole creare il database
    const createDb = await new Promise(resolve => {
      rl.question('Vuoi creare il database e applicare le migrazioni? (s/n): ', answer => {
        resolve(answer.toLowerCase() === 's');
      });
    });
    
    if (createDb) {
      // Crea il database
      const createDbCommand = `mysql -u ${dbUser} ${dbPassword ? `-p${dbPassword}` : ''} -e "CREATE DATABASE IF NOT EXISTS ${dbName}"`;
      if (!execute(createDbCommand, 'Errore durante la creazione del database')) {
        print('Assicurati che MySQL sia in esecuzione e che le credenziali siano corrette.', colors.yellow);
      } else {
        // Applica le migrazioni
        if (!execute('cd backend && npx prisma migrate deploy', 'Errore durante l\'applicazione delle migrazioni')) {
          return;
        }
        print('Database creato e migrazioni applicate con successo.', colors.green);
      }
    }
  }
  
  // 5. Creazione utente admin
  print('\n5. Creazione utente admin', colors.bright);
  
  const createAdmin = await new Promise(resolve => {
    rl.question('Vuoi creare un utente admin? (s/n): ', answer => {
      resolve(answer.toLowerCase() === 's');
    });
  });
  
  if (createAdmin) {
    const adminEmail = await new Promise(resolve => {
      rl.question('Email admin (default: admin@example.com): ', answer => {
        resolve(answer || 'admin@example.com');
      });
    });
    
    const adminPassword = await new Promise(resolve => {
      rl.question('Password admin (default: admin123): ', answer => {
        resolve(answer || 'admin123');
      });
    });
    
    print('\nPer creare l\'utente admin, avvia il backend in un terminale separato con:');
    print('cd backend && npm run dev', colors.cyan);
    print('\nQuindi, in un altro terminale, esegui:');
    print(`curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"email":"${adminEmail}","password":"${adminPassword}","role":"ADMIN"}'`, colors.cyan);
  }
  
  // Conclusione
  print('\n=== Configurazione completata ===', colors.bright + colors.green);
  print('\nPer avviare l\'applicazione in modalità sviluppo:');
  print('1. Backend: cd backend && npm run dev', colors.cyan);
  print('2. Frontend: npm run dev', colors.cyan);
  print('\nPer ulteriori informazioni, consulta il file README.md e MANUTENZIONE.md', colors.bright);
  
  rl.close();
}

// Avvia lo script
setup();
