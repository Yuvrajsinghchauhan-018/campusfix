import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ pending: 0, assigned: 0, resolved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/complaints');
        const list = res.data.data;
        setStats({
          pending: list.filter(c => c.status === 'Pending').length,
          assigned: list.filter(c => c.status === 'Assigned' || c.status === 'In Progress').length,
          resolved: list.filter(c => c.status === 'Resolved').length,
        });
      } catch (e) {
        console.error("Failed to load department stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-6 gap-6">
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Authority Panel</h2>
        <div className="mb-6 px-2">
           <p className="text-sm text-gray-500 font-medium">Department</p>
           <p className="font-semibold text-gray-900">{user?.department?.name || 'Loading...'}</p>
        </div>
        <nav className="space-y-2 mb-8">
          <Link to="/authority/dashboard" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">Dashboard</Link>
          <Link to="/authority/complaints" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Ticket Queue</Link>
          <Link to="/authority/workers" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Manage Staff</Link>
        </nav>
        <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium">Logout</button>
      </aside>

      <main className="flex-1">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">Review pending maintenance requests and assign them to your staff.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition">
            <h3 className="text-gray-500 font-medium mb-1">Pending in Queue</h3>
            <p className="text-4xl font-extrabold text-gray-800">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition">
            <h3 className="text-gray-500 font-medium mb-1">Currently Assigned</h3>
            <p className="text-4xl font-extrabold text-gray-800">{stats.assigned}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition">
            <h3 className="text-gray-500 font-medium mb-1">Resolved (Total)</h3>
            <p className="text-4xl font-extrabold text-gray-800">{stats.resolved}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Action Center</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/authority/complaints" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm flex items-center justify-center flex-1">
              Process New Tickets
            </Link>
            <Link to="/authority/workers" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition flex items-center justify-center flex-1">
              View Staff Availability
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
