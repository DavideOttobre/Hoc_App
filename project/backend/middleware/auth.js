import jwt from 'jsonwebtoken';
import { prisma } from '../server.js';

/**
 * Middleware per verificare il token JWT
 */
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token non fornito' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token non valido o scaduto' });
  }
};

/**
 * Middleware per verificare i ruoli dell'utente
 * @param {string[]} roles - Array di ruoli autorizzati
 */
export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Utente non autenticato' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accesso non autorizzato' });
    }
    
    next();
  };
};

/**
 * Middleware per verificare se l'utente è un responsabile e può accedere ai dati di un operatore
 */
export const authorizeResponsabileForOperatore = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Utente non autenticato' });
  }
  
  // Admin e amministratori possono accedere a tutti gli operatori
  if (['ADMIN', 'AMMINISTRATORE'].includes(req.user.role)) {
    return next();
  }
  
  // Responsabili possono accedere solo ai loro operatori
  if (req.user.role === 'RESPONSABILE') {
    const operatoreId = req.params.id || req.body.idOperatore;
    
    if (!operatoreId) {
      return next();
    }
    
    try {
      const relazione = await prisma.responsabiliOperatori.findFirst({
        where: {
          idResponsabile: req.user.userId,
          idOperatore: operatoreId
        }
      });
      
      if (!relazione) {
        return res.status(403).json({ message: 'Non sei autorizzato ad accedere a questo operatore' });
      }
      
      next();
    } catch (error) {
      console.error('Errore nella verifica della relazione responsabile-operatore:', error);
      res.status(500).json({ message: 'Errore nella verifica dell\'autorizzazione' });
    }
  } else {
    // Gli operatori possono accedere solo ai propri dati
    if (req.params.id && req.params.id !== req.user.userId) {
      return res.status(403).json({ message: 'Non sei autorizzato ad accedere a questi dati' });
    }
    
    next();
  }
};
