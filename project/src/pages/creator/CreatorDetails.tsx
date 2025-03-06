import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Database } from '../../lib/database.types';

type Creator = Database['public']['Tables']['creator']['Row'];

function CreatorDetails() {
  const { id } = useParams();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const { data, error } = await supabase
          .from('creator')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setCreator(data);
      } catch (error: any) {
        toast.error('Errore nel caricamento del creator');
        console.error('Error fetching creator:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Caricamento...</div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Creator non trovato</div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {creator.nome} {creator.cognome}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Dettagli e statistiche del creator.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Statistiche del creator */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Data registrazione
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {new Date(creator.created_at).toLocaleDateString()}
            </dd>
          </div>
        </div>

        {/* Altre statistiche possono essere aggiunte qui */}
      </div>

      {/* Sezione per le disponibilità del creator */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Disponibilità</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-500 text-sm">
              Nessuna disponibilità registrata.
            </p>
          </div>
        </div>
      </div>

      {/* Sezione per gli incassi del creator */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Incassi</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-500 text-sm">
              Nessun incasso registrato.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorDetails;