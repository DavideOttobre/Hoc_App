import React from 'react';
import { X } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Creator = Database['public']['Tables']['creator']['Row'];

interface FormData {
  data_prenotazione: string;
  data_disponibilita: string;
  fascia_03_07: string;
  fascia_07_12: string;
  fascia_12_17: string;
  fascia_17_22: string;
  fascia_22_03: string;
  id_operatore_responsabile: string;
  id_creator: string;
}

interface AvailabilityFormProps {
  formData: FormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (data: Partial<FormData>) => void;
  onClose: () => void;
  creators: Creator[];
  selectedCreator: string;
}

export default function AvailabilityForm({
  formData,
  onSubmit,
  onChange,
  onClose,
  creators,
  selectedCreator
}: AvailabilityFormProps) {
  const timeSlots = [
    { id: 'fascia_03_07', label: '03:00 - 07:00' },
    { id: 'fascia_07_12', label: '07:00 - 12:00' },
    { id: 'fascia_12_17', label: '12:00 - 17:00' },
    { id: 'fascia_17_22', label: '17:00 - 22:00' },
    { id: 'fascia_22_03', label: '22:00 - 03:00' }
  ];

  const handleTimeSlotClick = (slotId: string) => {
    onChange({ [slotId]: formData[slotId as keyof FormData] === 'prenotato' ? '' : 'prenotato' });
  };

  const selectedCreatorData = creators.find(c => c.id === selectedCreator);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Nuova Prenotazione
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data Prenotazione
              </label>
              <input
                type="text"
                value={new Date(formData.data_prenotazione).toLocaleDateString()}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data Disponibilità
              </label>
              <input
                type="text"
                value={new Date(formData.data_disponibilita).toLocaleDateString()}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Creator
            </label>
            <input
              type="text"
              value={selectedCreatorData ? `${selectedCreatorData.cognome} ${selectedCreatorData.nome}` : ''}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
              disabled
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Fasce Orarie</h3>
            <p className="text-sm text-gray-500">Seleziona una o più fasce orarie per la prenotazione</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeSlots.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTimeSlotClick(id)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    formData[id as keyof FormData] === 'prenotato'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

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
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}