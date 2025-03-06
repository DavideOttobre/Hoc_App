import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Disponibilita = Database['public']['Tables']['disponibilita']['Row'] & {
  creator?: Database['public']['Tables']['creator']['Row'];
};
type ViewMode = 'my-bookings' | 'creator';

interface CalendarProps {
  onDateClick: (date: Date) => void;
  bookings: Disponibilita[];
  viewMode: ViewMode;
}

export default function AvailabilityCalendar({ onDateClick, bookings, viewMode }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.data_disponibilita);
      return bookingDate.getDate() === date.getDate() &&
             bookingDate.getMonth() === date.getMonth() &&
             bookingDate.getFullYear() === date.getFullYear();
    });
  };

  const getTimeSlotCount = (bookings: Disponibilita[]) => {
    const slots = {
      'fascia_03_07': 0,
      'fascia_07_12': 0,
      'fascia_12_17': 0,
      'fascia_17_22': 0,
      'fascia_22_03': 0
    };

    bookings.forEach(booking => {
      Object.keys(slots).forEach(slot => {
        if (booking[slot as keyof Disponibilita] === 'prenotato') {
          slots[slot as keyof typeof slots]++;
        }
      });
    });

    return slots;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const weeks: JSX.Element[][] = [];
    let days: JSX.Element[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<td key={`empty-${i}`} className="p-1"></td>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayBookings = getBookingsForDate(date);
      const hasBookings = dayBookings.length > 0;
      const timeSlots = getTimeSlotCount(dayBookings);
      
      days.push(
        <td key={day} className="p-1">
          <button
            onClick={() => onDateClick(date)}
            className={`w-full min-h-[5rem] rounded-lg transition-colors relative p-2
              ${hasBookings 
                ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700' 
                : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <span className="absolute top-2 left-2 text-sm font-medium">{day}</span>
            {hasBookings && viewMode === 'creator' && (
              <div className="mt-6 space-y-1 text-xs">
                {Object.entries(timeSlots).map(([slot, count]) => count > 0 && (
                  <div key={slot} className="flex justify-between">
                    <span>{slot.replace('fascia_', '').replace('_', '-')}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
            {hasBookings && viewMode === 'my-bookings' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-indigo-700">
                  {dayBookings.length}
                </span>
              </div>
            )}
          </button>
        </td>
      );

      if (days.length === 7) {
        weeks.push([...days]);
        days = [];
      }
    }

    // Add empty cells for days after the last of the month
    if (days.length > 0) {
      while (days.length < 7) {
        days.push(<td key={`empty-end-${days.length}`} className="p-1"></td>);
      }
      weeks.push([...days]);
    }

    return weeks.map((week, index) => <tr key={index}>{week}</tr>);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
              <th key={day} className="p-2 text-sm font-medium text-gray-600">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {renderCalendar()}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-end space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-indigo-50 border border-indigo-500 mr-2"></div>
          <span>Giorno con prenotazioni</span>
        </div>
      </div>
    </div>
  );
}