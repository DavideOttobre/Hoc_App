import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server.js';
import { z } from 'zod';

// Schema di validazione per il login
const loginSchema = z.object({
  email: z.string().email({ message: 'Email non valida' }),
  password: z.string().min(6, { message: 'La password deve contenere almeno 6 caratteri' })
});

// Schema di validazione per la registrazione
const registerSchema = z.object({
  email: z.string().email({ message: 'Email non valida' }),
  password: z.string().min(6, { message: 'La password deve contenere almeno 6 caratteri' }),
  role: z.enum(['ADMIN', 'AMMINISTRATORE', 'RESPONSABILE', 'OPERATORE'])
});

/**
 * Controller per il login
 */
export const login = async (req, res) => {
  try {
    // Validazione input
    const validatedData = loginSchema.parse(req.body);
    
    // Cerca l'utente nel database
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    
    // Verifica la password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    
    // Genera il token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );
    
    // Restituisci il token e i dati dell'utente (senza la password)
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dati non validi', errors: error.errors });
    }
    
    console.error('Errore durante il login:', error);
    res.status(500).json({ message: 'Errore durante il login' });
  }
};

/**
 * Controller per la registrazione (solo per admin)
 */
export const register = async (req, res) => {
  try {
    // Validazione input
    const validatedData = registerSchema.parse(req.body);
    
    // Verifica se l'email è già in uso
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email già in uso' });
    }
    
    // Hash della password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Crea il nuovo utente
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role
      }
    });
    
    // Restituisci i dati dell'utente (senza la password)
    const { password, ...userWithoutPassword } = newUser;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dati non validi', errors: error.errors });
    }
    
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
};

/**
 * Controller per ottenere il profilo dell'utente corrente
 */
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    // Restituisci i dati dell'utente (senza la password)
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Errore durante il recupero del profilo:', error);
    res.status(500).json({ message: 'Errore durante il recupero del profilo' });
  }
};
