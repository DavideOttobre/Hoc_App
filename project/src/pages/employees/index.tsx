import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCog, Link2 } from 'lucide-react';

const sections = [
  {
    name: 'Responsabili',
    description: 'Gestisci l\'elenco dei responsabili nel sistema',
    href: '/employees/managers',
    icon: UserCog,
  },
  {
    name: 'Operatori',
    description: 'Gestisci l\'elenco degli operatori nel sistema',
    href: '/employees/operators',
    icon: Users,
  },
  {
    name: 'Relazioni',
    description: 'Gestisci le relazioni tra responsabili e operatori',
    href: '/employees/relations',
    icon: Link2,
  },
];

function EmployeesIndex() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Gestione Dipendenti</h1>
          <p className="mt-2 text-sm text-gray-700">
            Seleziona una sezione per gestire i dipendenti e le loro relazioni.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.name}
            to={section.href}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 hover:bg-gray-50"
          >
            <div className="flex-shrink-0">
              <section.icon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{section.name}</p>
              <p className="truncate text-sm text-gray-500">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EmployeesIndex;