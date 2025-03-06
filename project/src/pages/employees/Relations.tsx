import React, { useEffect, useState } from 'react';
import { Link2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Database } from '../../lib/database.types';

type Responsabile = Database['public']['Tables']['responsabili']['Row'];
type Operatore = Database['public']['Tables']['operatori']['Row'];
type Relation = Database['public']['Tables']['responsabili_operatori']['Row'] & {
  operatore: Operatore;
  responsabile: Responsabile;
};

function Relations() {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [managers, setManagers] = useState<Responsabile[]>([]);
  const [operators, setOperators] = useState<Operatore[]>([]);
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');

  const fetchRelations = async () => {
    try {
      const { data, error } = await supabase
        .from('responsabili_operatori')
        .select(`
          *,
          operatore:operatori!id_operatore(*),
          responsabile:responsabili!id_responsabile(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRelations(data || []);
    } catch (error: any) {
      toast.error('Errore nel caricamento delle relazioni');
      console.error('Error fetching relations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const [managersResponse, operatorsResponse] = await Promise.all([
        supabase.from('responsabili').select('*').order('cognome'),
        supabase.from('operatori').select('*').order('cognome')
      ]);

      if (managersResponse.error) throw managersResponse.error;
      if (operatorsResponse.error) throw operatorsResponse.error;

      setManagers(managersResponse.data || []);
      setOperators(operatorsResponse.data || []);
    } catch (error: any) {
      toast.error('Errore nel caricamento dei dipendenti');
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchRelations();
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa relazione?')) return;

    try {
      const { error } = await supabase
        .from('responsabili_operatori')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Relazione eliminata con successo');
      fetchRelations();
    } catch (error: any) {
      toast.error('Errore durante l\'eliminazione');
      console.error('Delete error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManager || !selectedOperator) {
      toast.error('Seleziona un responsabile e un operatore');
      return;
    }

    try {
      const { error } = await supabase
        .from('responsabili_operatori')
        .insert([{
          id_responsabile: selectedManager,
          id_operatore: selectedOperator
        }]);
      
      if (error) throw error;
      
      toast.success('Relazione creata con successo');
      setShowForm(false);
      setSelectedManager('');
      setSelectedOperator('');
      fetchRelations();
    } catch (error: any) {
      toast.error('Errore durante la creazione della relazione');
      console.error('Create error:', error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Relazioni</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestisci le relazioni tra responsabili e operatori.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Link2 className="h-4 w-4 mr-2" />
            Nuova relazione
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-6 bg-white shadow sm:rounded-lg p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                  Responsabile
                </label>
                <select
                  id="manager"
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Seleziona un responsabile</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.cognome} {manager.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="operator" className="block text-sm font-medium text-gray-700">
                  Operatore
                </label>
                <select
                  id="operator"
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Seleziona un operatore</option>
                  {operators.map((operator) => (
                    <option key={operator.id} value={operator.id}>
                      {operator.cognome} {operator.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Crea
              </button>
            </div>
          </form>
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
                      Responsabile
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Operatore
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
                  ) : relations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">
                        Nessuna relazione trovata
                      </td>
                    </tr>
                  ) : (
                    relations.map((relation) => (
                      <tr key={relation.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                          {relation.responsabile.cognome} {relation.responsabile.nome}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {relation.operatore.cognome} {relation.operatore.nome}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(relation.created_at).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(relation.id)}
                            className="text-red-600 hover:text-red-900"
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

export default Relations;