import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Database } from '../lib/database.types';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import AvailabilityForm from '../components/AvailabilityForm';
import { useAuth } from '../contexts/AuthContext';

type Disponibilita = Database['public']['Tables']['disponibilita']['Row'];
type Creator = Database['public']['Tables']['creator']['Row'];
type ResponsabiliOperatori = Database['public']['Tables']['responsabili_operatori']['Row'];
type ResponsabiliCreator = Database['public']['Tables']['responsabili_creator']['Row'];

type ViewMode = 'my-bookings' | 'creator';

function Availability() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<(Disponibilita & { creator?: Creator })[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('my-bookings');
  const [selectedCreator, setSelectedCreator] = useState<string>('');
  const [userRelationId, setUserRelationId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    data_prenotazione: new Date().toISOString(),
    data_disponibilita: '',
    fascia_03_07: '',
    fascia_07_12: '',
    fascia_12_17: '',
    fascia_17_22: '',
    fascia_22_03: '',
    id_operatore_responsabile: '',
    id_creator: ''
  });

  useEffect(() => {
    fetchData();
  }, [user, viewMode, selectedCreator]);

  const fetchData = async () => {
    if (!user) return;

    try {
      let relationId = '';
      let responsabileId = '';

      // First check if user is an operator
      const { data: operatorsData, error: operatorsError } = await supabase
        .from('operatori')
        .select('id, email');

      if (operatorsError) throw operatorsError;

      const operatorMatch = operatorsData?.find(op => op.email === user.email);

      if (operatorMatch) {
        // Get the most recent relation for this operator
        const { data: operatorRelation } = await supabase
          .from('responsabili_operatori')
          .select('id, id_responsabile')
          .eq('id_operatore', operatorMatch.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (operatorRelation) {
          relationId = operatorRelation.id;
          responsabileId = operatorRelation.id_responsabile;
        }
      } else {
        // If not an operator, check if user is a manager
        const { data: managersData, error: managersError } = await supabase
          .from('responsabili')
          .select('id, email');

        if (managersError) throw managersError;

        const managerMatch = managersData?.find(mgr => mgr.email === user.email);

        if (managerMatch) {
          responsabileId = managerMatch.id;
          // Get the most recent relation for this manager
          const { data: managerRelation } = await supabase
            .from('responsabili_operatori')
            .select('id')
            .eq('id_responsabile', managerMatch.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (managerRelation) {
            relationId = managerRelation.id;
          }
        }
      }

      // Fetch creators based on responsabile_creator relations
      if (responsabileId) {
        const { data: creatorRelations, error: creatorError } = await supabase
          .from('responsabili_creator')
          .select(`
            id,
            creator:creator(*)
          `)
          .eq('id_responsabile', responsabileId)
          .order('created_at', { ascending: false });

        if (creatorError) throw creatorError;

        // Get unique creators (keeping only the most recent relation for each creator)
        const uniqueCreators = creatorRelations.reduce((acc, curr) => {
          if (curr.creator && !acc.some(c => c.id === curr.creator.id)) {
            acc.push(curr.creator);
          }
          return acc;
        }, [] as Creator[]);

        setCreators(uniqueCreators);

        // If no creator is selected, select the first one
        if (!selectedCreator && uniqueCreators.length > 0) {
          setSelectedCreator(uniqueCreators[0].id);
        }
      }

      if (relationId) {
        setUserRelationId(relationId);
        setFormData(prev => ({
          ...prev,
          id_operatore_responsabile: relationId
        }));
      } else {
        toast.error('Non hai accesso alle prenotazioni');
        setBookings([]);
        setLoading(false);
        return;
      }

      // Fetch bookings based on view mode
      let query = supabase
        .from('disponibilita')
        .select(`
          *,
          creator:creator(*)
        `);
      
      if (viewMode === 'my-bookings') {
        if (relationId) {
          query = query.eq('id_operatore_responsabile', relationId);
        } else {
          setBookings([]);
          return;
        }
      } else if (viewMode === 'creator' && selectedCreator) {
        query = query.eq('id_creator', selectedCreator);
      }

      const { data: bookingsData, error: bookingsError } = await query;
      
      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Errore nel caricamento dei dati');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewModeChange = (mode: ViewMode, creatorId?: string) => {
    if (mode === 'my-bookings' && !userRelationId) {
      toast.error('Non hai accesso alle prenotazioni. Seleziona un creator per visualizzare le disponibilità.');
      return;
    }
    setViewMode(mode);
    setSelectedCreator(creatorId || '');
  };

  const handleDateClick = (date: Date) => {
    if (viewMode === 'my-bookings') {
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.data_disponibilita);
        return bookingDate.getDate() === date.getDate() &&
               bookingDate.getMonth() === date.getMonth() &&
               bookingDate.getFullYear() === date.getFullYear();
      });

      if (dayBookings.length === 0) return;

      const timeSlots = [
        { id: 'fascia_03_07', label: '03:00 - 07:00' },
        { id: 'fascia_07_12', label: '07:00 - 12:00' },
        { id: 'fascia_12_17', label: '12:00 - 17:00' },
        { id: 'fascia_17_22', label: '17:00 - 22:00' },
        { id: 'fascia_22_03', label: '22:00 - 03:00' }
      ];

      // Group bookings by creator
      const bookingsByCreator = dayBookings.reduce((acc, booking) => {
        if (!booking.creator) return acc;
        
        const creatorId = booking.creator.id;
        if (!acc[creatorId]) {
          acc[creatorId] = {
            creator: `${booking.creator.cognome} ${booking.creator.nome}`,
            slots: new Set<string>()
          };
        }

        timeSlots.forEach(slot => {
          if (booking[slot.id as keyof Disponibilita] === 'prenotato') {
            acc[creatorId].slots.add(slot.label);
          }
        });

        return acc;
      }, {} as Record<string, { creator: string; slots: Set<string> }>);

      // Create formatted message
      const message = Object.values(bookingsByCreator)
        .map(({ creator, slots }) => {
          return `Creator: ${creator}\nFasce orarie:\n${Array.from(slots).sort().map(slot => `- ${slot}`).join('\n')}`;
        })
        .join('\n\n');

      toast((t) => (
        <div className="max-w-md">
          <h3 className="font-semibold mb-2">
            Prenotazioni del {date.toLocaleDateString()}
          </h3>
          <div className="whitespace-pre-line">
            {message}
          </div>
        </div>
      ), {
        duration: 5000,
        style: {
          maxWidth: '500px'
        }
      });
    } else if (viewMode === 'creator' && selectedCreator) {
      if (!userRelationId) {
        toast.error('Non hai i permessi per effettuare prenotazioni');
        return;
      }
      setFormData(prev => ({
        ...prev,
        data_disponibilita: date.toISOString(),
        id_creator: selectedCreator
      }));
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_operatore_responsabile || !formData.id_creator) {
      toast.error('Dati mancanti');
      return;
    }

    try {
      const timeSlots = [
        'fascia_03_07',
        'fascia_07_12',
        'fascia_12_17',
        'fascia_17_22',
        'fascia_22_03'
      ];

      const selectedSlots = timeSlots.filter(
        slot => formData[slot as keyof typeof formData] === 'prenotato'
      );

      if (selectedSlots.length === 0) {
        toast.error('Seleziona almeno una fascia oraria');
        return;
      }

      // Create a record for each selected time slot
      const records = selectedSlots.map(slot => {
        const record = {
          data_prenotazione: formData.data_prenotazione,
          data_disponibilita: formData.data_disponibilita,
          id_operatore_responsabile: formData.id_operatore_responsabile,
          id_creator: formData.id_creator,
          fascia_03_07: '',
          fascia_07_12: '',
          fascia_12_17: '',
          fascia_17_22: '',
          fascia_22_03: ''
        };
        record[slot as keyof typeof record] = 'prenotato';
        return record;
      });

      const { error } = await supabase
        .from('disponibilita')
        .insert(records);
      
      if (error) throw error;
      
      toast.success('Disponibilità registrate con successo');
      setShowForm(false);
      setFormData(prev => ({
        ...prev,
        data_prenotazione: new Date().toISOString(),
        data_disponibilita: '',
        fascia_03_07: '',
        fascia_07_12: '',
        fascia_12_17: '',
        fascia_17_22: '',
        fascia_22_03: '',
        id_creator: ''
      }));
      fetchData();
    } catch (error: any) {
      toast.error('Errore durante il salvataggio');
      console.error('Save error:', error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Disponibilità</h1>
          <p className="mt-2 text-sm text-gray-700">
            {viewMode === 'my-bookings' 
              ? 'Visualizza le tue prenotazioni'
              : 'Visualizza le prenotazioni per i creator'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="relative">
            <select
              value={viewMode === 'my-bookings' ? 'my-bookings' : selectedCreator}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'my-bookings') {
                  handleViewModeChange('my-bookings');
                } else {
                  handleViewModeChange('creator', value);
                }
              }}
              className="block w-64 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="my-bookings">Le mie prenotazioni</option>
              <optgroup label="Creator">
                {creators.map((creator) => (
                  <option key={creator.id} value={creator.id}>
                    {creator.cognome} {creator.nome}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Caricamento...</div>
          </div>
        ) : (
          <div className="p-4">
            <AvailabilityCalendar 
              onDateClick={handleDateClick}
              bookings={bookings}
              viewMode={viewMode}
            />
          </div>
        )}
      </div>

      {showForm && (
        <AvailabilityForm
          formData={formData}
          onSubmit={handleSubmit}
          onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
          onClose={() => setShowForm(false)}
          creators={creators}
          selectedCreator={selectedCreator}
        />
      )}
    </div>
  );
}

export default Availability;