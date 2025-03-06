import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { operatoriAPI, responsabiliAPI } from '../lib/api';

// Definizione dei tipi per il nuovo sistema
interface BaseEmployee {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  createdAt: string;
}

type Responsabile = BaseEmployee;
type Operatore = BaseEmployee;
type EmployeeType = 'responsabili' | 'operatori';

interface EmployeeFormProps {
  type: EmployeeType;
  employee?: Responsabile | Operatore;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmployeeForm({ type, employee, onClose, onSuccess }: EmployeeFormProps) {
  const [nome, setNome] = useState(employee?.nome || '');
  const [cognome, setCognome] = useState(employee?.cognome || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const employeeData = {
        nome,
        cognome,
        email,
        password: password || undefined // Invia la password solo se è stata inserita
      };

      if (employee) {
        // Aggiornamento dipendente esistente
        if (type === 'responsabili') {
          await responsabiliAPI.update(employee.id, employeeData);
        } else {
          await operatoriAPI.update(employee.id, employeeData);
        }
        
        toast.success('Dipendente aggiornato con successo');
      } else {
        // Creazione nuovo dipendente
        let response;
        if (type === 'responsabili') {
          response = await responsabiliAPI.create(employeeData);
        } else {
          response = await operatoriAPI.create(employeeData);
        }
        
        // Mostra la password generata se presente
        if (response.generatedPassword) {
          toast.success(
            <div>
              <p>Dipendente creato con successo</p>
              <p className="font-bold mt-2">Password generata: {response.generatedPassword}</p>
              <p className="text-xs mt-1">Conserva questa password, non sarà più visibile in seguito.</p>
            </div>,
            { duration: 10000 } // Mostra il toast per 10 secondi
          );
        } else {
          toast.success('Dipendente creato con successo');
        }
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Errore durante il salvataggio';
      toast.error(errorMessage);
      console.error('Form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {employee ? 'Modifica' : 'Nuovo'} {type === 'responsabili' ? 'Responsabile' : 'Operatore'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="cognome" className="block text-sm font-medium text-gray-700">
              Cognome
            </label>
            <input
              type="text"
              id="cognome"
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          {!employee && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password (opzionale)
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Lascia vuoto per generare una password casuale"
              />
              <p className="mt-1 text-xs text-gray-500">
                Se non inserisci una password, ne verrà generata una automaticamente.
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Salvataggio...' : employee ? 'Aggiorna' : 'Crea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
