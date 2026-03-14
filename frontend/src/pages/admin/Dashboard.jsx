import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalDepts: 0, totalComplaints: 0 });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [usersRes, deptsRes, compRes] = await Promise.all([
          api.get('/users'),
          api.get('/departments'),
          api.get('/complaints')
        ]);
        setStats({
          totalUsers: usersRes.data.count,
          totalDepts: deptsRes.data.count,
          totalComplaints: compRes.data.count,
        });
      } catch (e) {
        console.error("Failed to fetch admin stats");
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-6 gap-6">
      <aside className="w-full md:w-64 bg-slate-900 text-white rounded-xl shadow-lg p-4 h-fit">
        <h2 className="text-xl font-bold border-b border-slate-700 pb-4 mb-4">Admin Console</h2>
        <nav className="space-y-2 mb-8 text-sm font-medium">
          <Link to="/admin/dashboard" className="block px-4 py-3 bg-slate-800 rounded-lg text-blue-400">Dashboard</Link>
          <Link to="/admin/users" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition">User Management</Link>
          <Link to="/admin/departments" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition">Departments</Link>
          <Link to="/admin/complaints" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition">All Complaints</Link>
          <Link to="/admin/reports" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition">Analytics & Reports</Link>
        </nav>
        <button onClick={logout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition font-medium">Log out</button>
      </aside>

      <main className="flex-1">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border-l-4 border-slate-800">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Master Administration</h1>
          <p className="text-gray-600">Overview of system health, users, and ticket states.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-blue-500">
            <h3 className="text-gray-500 font-medium mb-1">Total Users</h3>
            <p className="text-4xl font-extrabold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-purple-500">
            <h3 className="text-gray-500 font-medium mb-1">Departments</h3>
            <p className="text-4xl font-extrabold text-purple-600">{stats.totalDepts}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-b-4 border-orange-500">
            <h3 className="text-gray-500 font-medium mb-1">Total Network Tickets</h3>
            <p className="text-4xl font-extrabold text-orange-600">{stats.totalComplaints}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
