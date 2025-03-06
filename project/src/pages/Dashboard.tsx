import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch total users count
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        setTotalUsers(count || 0);
      } catch (error: any) {
        toast.error('Error loading dashboard data');
        console.error('Dashboard data error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const stats = [
    { 
      name: 'Total Users', 
      value: loading ? 'Loading...' : totalUsers.toString(), 
      icon: Users, 
      href: '/users' 
    },
    { 
      name: 'Active Shifts', 
      value: '—', 
      icon: Calendar, 
      href: '/availability',
      comingSoon: true
    },
    { 
      name: 'Pending Requests', 
      value: '—', 
      icon: FileText, 
      href: '/requests',
      comingSoon: true
    },
    { 
      name: 'Total Earnings', 
      value: '—', 
      icon: BarChart3, 
      href: '#',
      comingSoon: true
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className={`relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6 ${
              stat.comingSoon ? 'cursor-not-allowed opacity-60' : 'hover:shadow-lg transition-shadow'
            }`}
            onClick={e => stat.comingSoon && e.preventDefault()}
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              {stat.comingSoon && (
                <span className="ml-2 text-xs font-medium text-gray-500">
                  Coming soon
                </span>
              )}
            </dd>
          </Link>
        ))}
      </div>

      {/* Placeholder for future charts/widgets */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-500 text-sm">Coming soon...</p>
        </div>
        
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h2>
          <p className="text-gray-500 text-sm">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;