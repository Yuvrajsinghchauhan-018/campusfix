import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints');
        const list = res.data.data;
        setStats({
          pending: list.filter(c => c.status === 'Pending').length,
          inProgress: list.filter(c => c.status === 'In Progress').length,
          resolved: list.filter(c => c.status === 'Resolved').length,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
      {/* Sidebar Placeholder */}
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Student Panel</h2>
        <nav className="space-y-2 mb-8">
          <Link to="/student/dashboard" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">Dashboard</Link>
          <Link to="/student/new-complaint" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Submit Issue</Link>
          <Link to="/student/complaints" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">My Complaints</Link>
        </nav>
        <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium">Logout</button>
      </aside>

      <main className="flex-1">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Track and manage your campus maintenance requests.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 font-medium mb-1">Pending Requests</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <h3 className="text-gray-500 font-medium mb-1">In Progress</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 font-medium mb-1">Resolved</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.resolved}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link to="/student/new-complaint" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition shadow">
              + New Issue
            </Link>
            <Link to="/student/complaints" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium transition">
              View All History
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
