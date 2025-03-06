import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FileText, LogOut, ChevronDown, UserCog, Link2, Brush } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Creator = Database['public']['Tables']['creator']['Row'];

function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [employeesOpen, setEmployeesOpen] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const { data, error } = await supabase
          .from('creator')
          .select('*')
          .order('cognome', { ascending: true });
        
        if (error) throw error;
        setCreators(data || []);
      } catch (error) {
        console.error('Error fetching creators:', error);
      }
    };

    fetchCreators();
  }, []);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isEmployeesActive = location.pathname.startsWith('/employees');
  const isCreatorActive = location.pathname.startsWith('/creator');

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    {
      name: 'Dipendenti',
      icon: Users,
      children: [
        { name: 'Responsabili', href: '/employees/managers', icon: UserCog },
        { name: 'Operatori', href: '/employees/operators', icon: Users },
        { name: 'Relazioni', href: '/employees/relations', icon: Link2 },
      ],
    },
    {
      name: 'Creator',
      icon: Brush,
      children: [
        { name: 'Gestione Creator', href: '/creator/manage', icon: Brush },
        ...creators.map(creator => ({
          name: `${creator.nome} ${creator.cognome}`,
          href: `/creator/${creator.id}`,
          icon: Brush
        }))
      ],
    },
    { name: 'Disponibilità', href: '/availability', icon: Calendar },
    { name: 'Richieste', href: '/requests', icon: FileText },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">HOC Admin</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                if (item.children) {
                  const isActive = item.name === 'Dipendenti' ? isEmployeesActive : isCreatorActive;
                  const isOpen = item.name === 'Dipendenti' ? employeesOpen : creatorOpen;
                  const setIsOpen = item.name === 'Dipendenti' ? setEmployeesOpen : setCreatorOpen;

                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`${
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md justify-between`}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className={`${
                              isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                            } mr-3 flex-shrink-0 h-6 w-6`}
                          />
                          {item.name}
                        </div>
                        <ChevronDown
                          className={`${
                            isOpen ? 'transform rotate-180' : ''
                          } w-5 h-5 transition-transform duration-200`}
                        />
                      </button>
                      {isOpen && (
                        <div className="pl-11 pr-2 space-y-1">
                          {item.children.map((child) => {
                            const isChildActive = location.pathname === child.href;
                            return (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={`${
                                  isChildActive
                                    ? 'bg-gray-50 text-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                              >
                                <child.icon
                                  className={`${
                                    isChildActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                                  } mr-3 flex-shrink-0 h-5 w-5`}
                                />
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={() => signOut()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-6 w-6" />
              Esci
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;