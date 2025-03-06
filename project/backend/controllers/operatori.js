import { prisma } from '../server.js';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Schema di validazione per la creazione/aggiornamento di un operatore
const operatoreSchema = z.object({
  nome: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  cognome: z.string().min(1, { message: 'Il cognome è obbligatorio' }),
  email: z.string().email({ message: 'Email non valida' }),
  password: z.string().min(6, { message: 'La password deve contenere almeno 6 caratteri' }).optional()
});

/**
 * Controller per ottenere tutti gli operatori
 * Filtra in base al ruolo dell'utente:
 * - Admin/Amministratore: tutti gli operatori
 * - Responsabile: solo gli operatori associati
 * - Operatore: solo se stesso
 */
export const getAllOperatori = async (req, res) => {
  try {
    const { role, userId } = req.user;
    
    let operatori;
    
    if (role === 'ADMIN' || role === 'AMMINISTRATORE') {
      // Admin e amministratori vedono tutti gli operatori
      operatori = await prisma.operatore.findMany({
        orderBy: { cognome: 'asc' }
      });
    } else if (role === 'RESPONSABILE') {
      // Responsabili vedono solo i loro operatori
      operatori = await prisma.operatore.findMany({
        where: {
          responsabiliOperatori: {
            some: {
              idResponsabile: userId
            }
          }
        },
        orderBy: { cognome: 'asc' }
      });
    } else {
      // Operatori vedono solo se stessi
      operatori = await prisma.operatore.findMany({
        where: { id: userId },
        orderBy: { cognome: 'asc' }
      });
    }
    
    res.json(operatori);
  } catch (error) {
    console.error('Errore nel recupero degli operatori:', error);
    res.status(500).json({ message: 'Errore nel recupero degli operatori' });
  }
};

/**
 * Controller per ottenere un operatore specifico
 */
export const getOperatore = async (req, res) => {
  try {
    const { id } = req.params;
    
    const operatore = await prisma.operatore.findUnique({
      where: { id }
    });
    
    if (!operatore) {
      return res.status(404).json({ message: 'Operatore non trovato' });
    }
    
    res.json(operatore);
  } catch (error) {
    console.error('Errore nel recupero dell\'operatore:', error);
    res.status(500).json({ message: 'Errore nel recupero dell\'operatore' });
  }
};

/**
 * Controller per creare un nuovo operatore
 */
export const createOperatore = async (req, res) => {
  try {
    // Validazione input
    const validatedData = operatoreSchema.parse(req.body);
    
    // Genera una password casuale se non fornita
    const password = validatedData.password || Math.random().toString(36).slice(-8);
    
    // Verifica se l'email è già in uso nella tabella users
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email già in uso' });
    }
    
    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crea il nuovo utente per l'accesso
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: 'OPERATORE'
      }
    });
    
    // Crea il nuovo operatore
    const newOperatore = await prisma.operatore.create({
      data: {
        nome: validatedData.nome,
        cognome: validatedData.cognome,
        email: validatedData.email
      }
    });
    
    // Se l'utente è un responsabile, crea anche la relazione
    if (req.user.role === 'RESPONSABILE') {
      await prisma.responsabiliOperatori.create({
        data: {
          idOperatore: newOperatore.id,
          idResponsabile: req.user.userId
        }
      });
    }
    
    // Restituisci i dati dell'operatore e la password generata (se non fornita)
    const response = {
      ...newOperatore,
      userId: newUser.id,
      generatedPassword: validatedData.password ? undefined : password
    };
    
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dati non validi', errors: error.errors });
    }
    
    console.error('Errore nella creazione dell\'operatore:', error);
    res.status(500).json({ message: 'Errore nella creazione dell\'operatore' });
  }
};

/**
 * Controller per aggiornare un operatore
 */
export const updateOperatore = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validazione input
    const validatedData = operatoreSchema.parse(req.body);
    
    // Verifica se l'operatore esiste
    const operatore = await prisma.operatore.findUnique({
      where: { id }
    });
    
    if (!operatore) {
      return res.status(404).json({ message: 'Operatore non trovato' });
    }
    
    // Aggiorna l'operatore
    const updatedOperatore = await prisma.operatore.update({
      where: { id },
      data: validatedData
    });
    
    res.json(updatedOperatore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dati non validi', errors: error.errors });
    }
    
    console.error('Errore nell\'aggiornamento dell\'operatore:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'operatore' });
  }
};

/**
 * Controller per eliminare un operatore
 */
export const deleteOperatore = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se l'operatore esiste
    const operatore = await prisma.operatore.findUnique({
      where: { id }
    });
    
    if (!operatore) {
      return res.status(404).json({ message: 'Operatore non trovato' });
    }
    
    // Elimina l'operatore
    await prisma.operatore.delete({
      where: { id }
    });
    
    res.json({ message: 'Operatore eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione dell\'operatore:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'operatore' });
  }
};
