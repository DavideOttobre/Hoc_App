import express from 'express';
import { login, register, getProfile } from '../controllers/auth.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Rotta per il login
router.post('/login', login);

// Rotta per la registrazione (solo per admin)
router.post('/register', authenticateJWT, authorizeRoles(['ADMIN']), register);

// Rotta per ottenere il profilo dell'utente corrente
router.get('/profile', authenticateJWT, getProfile);

export default router;
