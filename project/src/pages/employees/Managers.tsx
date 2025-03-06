import React, { useEffect, useState } from 'react';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import EmployeeForm from '../../components/EmployeeForm';
import { responsabiliAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

// Definizione del tipo Responsabile per il nuovo sistema
interface Responsabile {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  createdAt: string;
}

function Managers() {
  const [managers, setManagers] = useState<Responsabile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Responsabile | undefined>();
  const { user } = useAuth();
  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'AMMINISTRATORE';

  const fetchManagers = async () => {
    try {
      const data = await responsabiliAPI.getAll();
      setManagers(data || []);
    } catch (error: any) {
      toast.error('Errore nel caricamento dei responsabili');
      console.error('Error fetching managers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo responsabile?')) return;

    try {
      await responsabiliAPI.delete(id);
      toast.success('Responsabile eliminato con successo');
      fetchManagers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Errore durante l\'eliminazione';
      toast.error(errorMessage);
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (manager: Responsabile) => {
    setSelectedManager(manager);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    fetchManagers();
    setSelectedManager(undefined);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Responsabili</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestisci l'elenco dei responsabili nel sistema.
          </p>
        </div>
        {isAuthorized && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Nuovo responsabile
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Nome
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Cognome
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Data creazione
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4">
                      <span className="sr-only">Azioni</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">
                        Caricamento...
                      </td>
                    </tr>
                  ) : managers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">
                        Nessun responsabile trovato
                      </td>
                    </tr>
                  ) : (
                    managers.map((manager) => (
                      <tr key={manager.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                          {manager.nome}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {manager.cognome}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {manager.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(manager.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          {isAuthorized && (
                            <>
                              <button
                                onClick={() => handleEdit(manager)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(manager.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showForm && isAuthorized && (
        <EmployeeForm
          type="responsabili"
          employee={selectedManager}
          onClose={() => {
            setShowForm(false);
            setSelectedManager(undefined);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default Managers;
