import React, { useEffect, useState } from 'react';
import { UserPlus, Pencil, Trash2, Link } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Database } from '../../lib/database.types';

type Creator = Database['public']['Tables']['creator']['Row'];
type Responsabile = Database['public']['Tables']['responsabili']['Row'];

function CreatorManage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [responsabili, setResponsabili] = useState<Responsabile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRelationForm, setShowRelationForm] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedResponsabile, setSelectedResponsabile] = useState<string>('');
  const [formData, setFormData] = useState({
    nome: '',
    cognome: ''
  });

  const fetchCreators = async () => {
    try {
      const { data, error } = await supabase
        .from('creator')
        .select('*')
        .order('cognome', { ascending: true });
      
      if (error) throw error;
      setCreators(data || []);

      // Fetch responsabili for relation form
      const { data: responsabiliData, error: responsabiliError } = await supabase
        .from('responsabili')
        .select('*')
        .order('cognome', { ascending: true });
      
      if (responsabiliError) throw responsabiliError;
      setResponsabili(responsabiliData || []);
    } catch (error: any) {
      toast.error('Errore nel caricamento dei creator');
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo creator?')) return;

    try {
      const { error } = await supabase
        .from('creator')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Creator eliminato con successo');
      fetchCreators();
    } catch (error: any) {
      toast.error('Errore durante l\'eliminazione');
      console.error('Delete error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCreator) {
        const { error } = await supabase
          .from('creator')
          .update(formData)
          .eq('id', selectedCreator.id);
        
        if (error) throw error;
        toast.success('Creator aggiornato con successo');
      } else {
        const { error } = await supabase
          .from('creator')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Creator creato con successo');
      }
      
      setShowForm(false);
      setSelectedCreator(null);
      setFormData({ nome: '', cognome: '' });
      fetchCreators();
    } catch (error: any) {
      toast.error('Errore durante il salvataggio');
      console.error('Save error:', error);
    }
  };

  const handleEdit = (creator: Creator) => {
    setSelectedCreator(creator);
    setFormData({
      nome: creator.nome,
      cognome: creator.cognome
    });
    setShowForm(true);
  };

  const handleCreateRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreator || !selectedResponsabile) {
      toast.error('Seleziona un responsabile');
      return;
    }

    try {
      const { error } = await supabase
        .from('responsabili_creator')
        .insert([{
          id_responsabile: selectedResponsabile,
          id_creator: selectedCreator.id
        }]);
      
      if (error) {
        if (error.code === '23505') {
          toast.error('Questa relazione esiste già');
        } else {
          throw error;
        }
        return;
      }
      
      toast.success('Relazione creata con successo');
      setShowRelationForm(false);
      setSelectedResponsabile('');
    } catch (error: any) {
      toast.error('Errore durante la creazione della relazione');
      console.error('Relation error:', error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Gestione Creator</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestisci l'elenco dei creator nel sistema.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-3">
          <button
            type="button"
            onClick={() => {
              setSelectedCreator(null);
              setShowRelationForm(true);
            }}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Link className="h-4 w-4 mr-2" />
            Crea relazione
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCreator(null);
              setFormData({ nome: '', cognome: '' });
              setShowForm(true);
            }}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nuovo creator
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedCreator ? 'Modifica' : 'Nuovo'} Creator
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedCreator(null);
                  setFormData({ nome: '', cognome: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="h-6 w-6" />
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
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
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
                  value={formData.cognome}
                  onChange={(e) => setFormData(prev => ({ ...prev, cognome: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedCreator(null);
                    setFormData({ nome: '', cognome: '' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {selectedCreator ? 'Aggiorna' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRelationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Crea Relazione con Responsabile
              </h2>
              <button
                onClick={() => {
                  setShowRelationForm(false);
                  setSelectedResponsabile('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateRelation} className="space-y-4">
              <div>
                <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                  Creator
                </label>
                <select
                  id="creator"
                  value={selectedCreator?.id || ''}
                  onChange={(e) => {
                    const creator = creators.find(c => c.id === e.target.value);
                    setSelectedCreator(creator || null);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Seleziona un creator</option>
                  {creators.map((creator) => (
                    <option key={creator.id} value={creator.id}>
                      {creator.cognome} {creator.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="responsabile" className="block text-sm font-medium text-gray-700">
                  Responsabile
                </label>
                <select
                  id="responsabile"
                  value={selectedResponsabile}
                  onChange={(e) => setSelectedResponsabile(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Seleziona un responsabile</option>
                  {responsabili.map((responsabile) => (
                    <option key={responsabile.id} value={responsabile.id}>
                      {responsabile.cognome} {responsabile.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRelationForm(false);
                    setSelectedResponsabile('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Crea Relazione
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                      <td colSpan={4} className="text-center py-4 text-gray-500">
                        Caricamento...
                      </td>
                    </tr>
                  ) : creators.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">
                        Nessun creator trovato
                      </td>
                    </tr>
                  ) : (
                    creators.map((creator) => (
                      <tr key={creator.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                          {creator.nome}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {creator.cognome}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(creator.created_at).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedCreator(creator);
                              setShowRelationForm(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title="Crea relazione"
                          >
                            <Link className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(creator)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title="Modifica"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(creator.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Elimina"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
    </div>
  );
}

export default CreatorManage;