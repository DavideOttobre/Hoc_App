import { prisma } from '../server.js';
import { z } from 'zod';

// Schema di validazione per la creazione/aggiornamento di un responsabile
const responsabileSchema = z.object({
  nome: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  cognome: z.string().min(1, { message: 'Il cognome è obbligatorio' }),
  email: z.string().email({ message: 'Email non valida' })
});

/**
 * Controller per ottenere tutti i responsabili
 * Filtra in base al ruolo dell'utente:
 * - Admin/Amministratore: tutti i responsabili
 * - Altri ruoli: nessun accesso
 */
export const getAllResponsabili = async (req, res) => {
  try {
    const { role } = req.user;
    
    // Solo admin e amministratori possono vedere tutti i responsabili
    if (role === 'ADMIN' || role === 'AMMINISTRATORE') {
      const responsabili = await prisma.responsabile.findMany({
        orderBy: { cognome: 'asc' }
      });
      
      return res.json(responsabili);
    }
    
    // Altri ruoli non possono vedere i responsabili
    return res.status(403).json({ message: 'Non sei autorizzato a visualizzare i responsabili' });
  } catch (error) {
    console.error('Errore nel recupero dei responsabili:', error);
    res.status(500).json({ message: 'Errore nel recupero dei responsabili' });
  }
};

/**
 * Controller per ottenere un responsabile specifico
 */
export const getResponsabile = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    
    // Solo admin e amministratori possono vedere i dettagli dei responsabili
    if (role !== 'ADMIN' && role !== 'AMMINISTRATORE') {
      return res.status(403).json({ message: 'Non sei autorizzato a visualizzare i dettagli dei responsabili' });
    }
    
    const responsabile = await prisma.responsabile.findUnique({
      where: { id }
    });
    
    if (!responsabile) {
      return res.status(404).json({ message: 'Responsabile non trovato' });
    }
    
    res.json(responsabile);
  } catch (error) {
    console.error('Errore nel recupero del responsabile:', error);
    res.status(500).json({ message: 'Errore nel recupero del responsabile' });
  }
};

/**
 * Controller per creare un nuovo responsabile
 * Solo admin e amministratori possono creare responsabili
 */
export const createResponsabile = async (req, res) => {
  try {
    // Validazione input
    const validatedData = responsabileSchema.parse(req.body);
    
    // Crea il nuovo responsabile
    const newResponsabile = await prisma.responsabile.create({
      data: validatedData
    });
    
    res.status(201).json(newResponsabile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dati non validi', errors: error.errors });
    }
    
    console.error('Errore nella creazione del responsabile:', error);
    res.status(500).json({ message: 'Errore nella creazione del responsabile' });
  }
};

/**
 * Controller per aggiornare un responsabile
 */
export const updateResponsabile = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    
    // Solo admin e amministratori possono aggiornare i responsabili
    if (role !== 'ADMIN' && role !== 'AMMINISTRATORE') {
      return res.status(403).json({ message: 'Non sei autorizzato a modificare i responsabili' });
    }
    
    // Validazione input
    const validatedData = responsabileSchema.parse(req.body);
    
    // Verifica se il responsabile esiste
    const responsabile = await prisma.responsabile.findUnique({
      where: { id }
    });
    
    if (!responsabile) {
      return res.status(404).json({ message: 'Responsabile non trovato' });
    }
    
    // Aggiorna il responsabile
    const updatedResponsabile = await prisma.responsabile.update({
      where: { id },
      data: validatedData
    });
    
    res.json(updatedResponsabile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dati non validi', errors: error.errors });
    }
    
    console.error('Errore nell\'aggiornamento del responsabile:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento del responsabile' });
  }
};

/**
 * Controller per eliminare un responsabile
 */
export const deleteResponsabile = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    
    // Solo admin e amministratori possono eliminare i responsabili
    if (role !== 'ADMIN' && role !== 'AMMINISTRATORE') {
      return res.status(403).json({ message: 'Non sei autorizzato a eliminare i responsabili' });
    }
    
    // Verifica se il responsabile esiste
    const responsabile = await prisma.responsabile.findUnique({
      where: { id }
    });
    
    if (!responsabile) {
      return res.status(404).json({ message: 'Responsabile non trovato' });
    }
    
    // Elimina il responsabile
    await prisma.responsabile.delete({
      where: { id }
    });
    
    res.json({ message: 'Responsabile eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del responsabile:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione del responsabile' });
  }
};
