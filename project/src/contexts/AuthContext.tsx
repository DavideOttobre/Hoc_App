import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../lib/api';
import { toast } from 'react-hot-toast';

// Definizione del tipo User per il nuovo sistema di autenticazione
interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'AMMINISTRATORE' | 'RESPONSABILE' | 'OPERATORE';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica lo stato di autenticazione all'avvio
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const userData = await authAPI.getProfile();
          setUser(userData);
        }
      } catch (error) {
        // Se c'è un errore, probabilmente il token non è valido
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await authAPI.login(email, password);
      setUser(user);
      
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      toast.success('Accesso effettuato con successo');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Errore durante il login';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signOut = () => {
    authAPI.logout();
    setUser(null);
    toast.success('Disconnessione effettuata con successo');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
