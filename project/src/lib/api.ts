import axios from 'axios';

// Configurazione di base di axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere il token JWT a ogni richiesta
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Interceptor per gestire gli errori di risposta
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // Gestione errori specifici
    if (error.response) {
      // Se il token è scaduto o non valido, reindirizza al login
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API di autenticazione
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  register: async (userData: { email: string; password: string; role: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('authToken') !== null;
  }
};

// API per gli operatori
export const operatoriAPI = {
  getAll: async () => {
    const response = await api.get('/operatori');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/operatori/${id}`);
    return response.data;
  },
  
  create: async (operatore: { nome: string; cognome: string; email: string }) => {
    const response = await api.post('/operatori', operatore);
    return response.data;
  },
  
  update: async (id: string, operatore: { nome: string; cognome: string; email: string }) => {
    const response = await api.put(`/operatori/${id}`, operatore);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/operatori/${id}`);
    return response.data;
  }
};

// API per i responsabili
export const responsabiliAPI = {
  getAll: async () => {
    const response = await api.get('/responsabili');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/responsabili/${id}`);
    return response.data;
  },
  
  create: async (responsabile: { nome: string; cognome: string; email: string }) => {
    const response = await api.post('/responsabili', responsabile);
    return response.data;
  },
  
  update: async (id: string, responsabile: { nome: string; cognome: string; email: string }) => {
    const response = await api.put(`/responsabili/${id}`, responsabile);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/responsabili/${id}`);
    return response.data;
  }
};

// API per i creator
export const creatorAPI = {
  getAll: async () => {
    const response = await api.get('/creator');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/creator/${id}`);
    return response.data;
  },
  
  create: async (creator: { nome: string; cognome: string }) => {
    const response = await api.post('/creator', creator);
    return response.data;
  },
  
  update: async (id: string, creator: { nome: string; cognome: string }) => {
    const response = await api.put(`/creator/${id}`, creator);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/creator/${id}`);
    return response.data;
  }
};

// API per le disponibilità
export const disponibilitaAPI = {
  getAll: async () => {
    const response = await api.get('/disponibilita');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/disponibilita/${id}`);
    return response.data;
  },
  
  create: async (disponibilita: any) => {
    const response = await api.post('/disponibilita', disponibilita);
    return response.data;
  },
  
  update: async (id: string, disponibilita: any) => {
    const response = await api.put(`/disponibilita/${id}`, disponibilita);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/disponibilita/${id}`);
    return response.data;
  }
};

// API per gli utenti
export const utentiAPI = {
  getAll: async () => {
    const response = await api.get('/utenti');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/utenti/${id}`);
    return response.data;
  },
  
  create: async (utente: { nicknameUtente: string; idUnivocoOf: string }) => {
    const response = await api.post('/utenti', utente);
    return response.data;
  },
  
  update: async (id: string, utente: { nicknameUtente: string; idUnivocoOf: string }) => {
    const response = await api.put(`/utenti/${id}`, utente);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/utenti/${id}`);
    return response.data;
  }
};

// API per le richieste
export const richiesteAPI = {
  getAll: async () => {
    const response = await api.get('/richieste');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/richieste/${id}`);
    return response.data;
  },
  
  create: async (richiesta: any) => {
    const response = await api.post('/richieste', richiesta);
    return response.data;
  },
  
  update: async (id: string, richiesta: any) => {
    const response = await api.put(`/richieste/${id}`, richiesta);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/richieste/${id}`);
    return response.data;
  }
};

export default api;
