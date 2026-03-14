import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../api/axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (e) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (e) {
      toast.error('Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'student': return 'bg-gray-100 text-gray-700';
      case 'authority': return 'bg-orange-100 text-orange-800';
      case 'admin': return 'bg-purple-100 text-purple-800 font-bold';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-6 gap-6">
      <aside className="w-full md:w-64 bg-slate-900 text-white rounded-xl shadow-lg p-4 h-fit">
        <h2 className="text-xl font-bold border-b border-slate-700 pb-4 mb-4">Admin Console</h2>
        <nav className="space-y-2 text-sm font-medium">
          <Link to="/admin/dashboard" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition text-gray-300">Dashboard</Link>
          <Link to="/admin/users" className="block px-4 py-3 bg-slate-800 rounded-lg text-blue-400">User Management</Link>
          <Link to="/admin/departments" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition text-gray-300">Departments</Link>
          <Link to="/admin/complaints" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition text-gray-300">All Complaints</Link>
          <Link to="/admin/reports" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition text-gray-300">Analytics & Reports</Link>
        </nav>
      </aside>

      <main className="flex-1">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">User Directory</h1>
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-500">Loading directory...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-600">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{u.name}
                        {u.collegeId && <p className="text-xs text-gray-400 font-normal">{u.collegeId}</p>}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded inline-block text-xs ${getRoleBadgeColor(u.role)}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{u.department?.name || '-'}</td>
                      <td className="py-3 px-4 text-right space-x-3">
                        <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700 font-medium text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;
