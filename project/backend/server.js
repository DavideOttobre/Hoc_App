import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Importazione delle routes
import authRoutes from './routes/auth.js';
import operatoriRoutes from './routes/operatori.js';
import responsabiliRoutes from './routes/responsabili.js';
// import creatorRoutes from './routes/creator.js';
// import disponibilitaRoutes from './routes/disponibilita.js';
// import utentiRoutes from './routes/utenti.js';
// import richiesteRoutes from './routes/richieste.js';

// Configurazione variabili d'ambiente
dotenv.config();

// Inizializzazione Prisma Client
export const prisma = new PrismaClient();

// Inizializzazione Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware per logging delle richieste
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes di base
app.get('/', (req, res) => {
  res.json({ message: 'HOC Admin API' });
});

// Implementazione delle routes
app.use('/api/auth', authRoutes);
app.use('/api/operatori', operatoriRoutes);
app.use('/api/responsabili', responsabiliRoutes);
// app.use('/api/creator', creatorRoutes);
// app.use('/api/disponibilita', disponibilitaRoutes);
// app.use('/api/utenti', utentiRoutes);
// app.use('/api/richieste', richiesteRoutes);

// Middleware per gestione errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Si è verificato un errore interno',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});

// Gestione chiusura Prisma alla chiusura del server
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Connessione al database chiusa');
  process.exit(0);
});
