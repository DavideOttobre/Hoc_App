import { prisma } from '../server.js';
import { z } from 'zod';

// Schema di validazione per la creazione/aggiornamento di un operatore
const operatoreSchema = z.object({
  nome: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  cognome: z.string().min(1, { message: 'Il cognome è obbligatorio' }),
  email: z.string().email({ message: 'Email non valida' })
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
    
    // Crea il nuovo operatore
    const newOperatore = await prisma.operatore.create({
      data: validatedData
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
    
    res.status(201).json(newOperatore);
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
