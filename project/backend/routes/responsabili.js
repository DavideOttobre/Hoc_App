import express from 'express';
import { 
  getAllResponsabili, 
  getResponsabile, 
  createResponsabile, 
  updateResponsabile, 
  deleteResponsabile 
} from '../controllers/responsabili.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Middleware di autenticazione per tutte le rotte
router.use(authenticateJWT);

// Ottieni tutti i responsabili (solo admin e amministratori)
router.get('/', authorizeRoles(['ADMIN', 'AMMINISTRATORE']), getAllResponsabili);

// Ottieni un responsabile specifico (solo admin e amministratori)
router.get('/:id', authorizeRoles(['ADMIN', 'AMMINISTRATORE']), getResponsabile);

// Crea un nuovo responsabile (solo admin e amministratori)
router.post('/', authorizeRoles(['ADMIN', 'AMMINISTRATORE']), createResponsabile);

// Aggiorna un responsabile (solo admin e amministratori)
router.put('/:id', authorizeRoles(['ADMIN', 'AMMINISTRATORE']), updateResponsabile);

// Elimina un responsabile (solo admin e amministratori)
router.delete('/:id', authorizeRoles(['ADMIN', 'AMMINISTRATORE']), deleteResponsabile);

export default router;
