import express from 'express';
import { 
  getAllOperatori, 
  getOperatore, 
  createOperatore, 
  updateOperatore, 
  deleteOperatore 
} from '../controllers/operatori.js';
import { authenticateJWT, authorizeRoles, authorizeResponsabileForOperatore } from '../middleware/auth.js';

const router = express.Router();

// Middleware di autenticazione per tutte le rotte
router.use(authenticateJWT);

// Ottieni tutti gli operatori (filtrati in base al ruolo)
router.get('/', getAllOperatori);

// Ottieni un operatore specifico
router.get('/:id', authorizeResponsabileForOperatore, getOperatore);

// Crea un nuovo operatore (solo admin, amministratori e responsabili)
router.post('/', authorizeRoles(['ADMIN', 'AMMINISTRATORE', 'RESPONSABILE']), createOperatore);

// Aggiorna un operatore
router.put('/:id', authorizeResponsabileForOperatore, updateOperatore);

// Elimina un operatore (solo admin e amministratori)
router.delete('/:id', authorizeRoles(['ADMIN', 'AMMINISTRATORE']), deleteOperatore);

export default router;
