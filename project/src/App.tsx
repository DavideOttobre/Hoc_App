import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeesIndex from './pages/employees';
import Managers from './pages/employees/Managers';
import Operators from './pages/employees/Operators';
import Relations from './pages/employees/Relations';
import CreatorManage from './pages/creator/Manage';
import CreatorDetails from './pages/creator/CreatorDetails';
import Availability from './pages/Availability';
import Requests from './pages/Requests';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="employees" element={<EmployeesIndex />} />
              <Route path="employees/managers" element={<Managers />} />
              <Route path="employees/operators" element={<Operators />} />
              <Route path="employees/relations" element={<Relations />} />
              <Route path="creator/manage" element={<CreatorManage />} />
              <Route path="creator/:id" element={<CreatorDetails />} />
              <Route path="availability" element={<Availability />} />
              <Route path="requests" element={<Requests />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;