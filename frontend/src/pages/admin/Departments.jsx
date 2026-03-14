import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../api/axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDeptName, setNewDeptName] = useState('');

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch (e) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDeptName) return;
    try {
      await api.post('/departments', { name: newDeptName });
      toast.success('Department created');
      setNewDeptName('');
      fetchDepartments();
    } catch (e) {
      toast.error('Failed to create department. Name may exist.');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-6 gap-6">
      <aside className="w-full md:w-64 bg-slate-900 text-white rounded-xl shadow-lg p-4 h-fit">
        <h2 className="text-xl font-bold border-b border-slate-700 pb-4 mb-4">Admin Console</h2>
        <nav className="space-y-2 text-sm font-medium">
          <Link to="/admin/dashboard" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition text-gray-300">Dashboard</Link>
          <Link to="/admin/users" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition text-gray-300">User Management</Link>
          <Link to="/admin/departments" className="block px-4 py-3 bg-slate-800 rounded-lg text-blue-400">Departments</Link>
          <Link to="/admin/complaints" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition text-gray-300">All Complaints</Link>
          <Link to="/admin/reports" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition text-gray-300">Analytics & Reports</Link>
        </nav>
      </aside>

      <main className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Departments</h1>
          <p className="text-gray-600 text-sm">Create and organize college maintenance departments.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
           <form onSubmit={handleCreate} className="flex gap-4 mb-8 bg-gray-50 p-4 rounded-lg border">
             <input type="text" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} required placeholder="E.g., Electrical, Plumbing..." className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
             <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition shadow-sm">+ Add New</button>
           </form>

           {loading ? <p className="text-center py-4">Loading...</p> : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {departments.map(d => (
                 <div key={d._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="text-xl font-bold text-gray-800">{d.name}</h3>
                     <button onClick={() => handleDelete(d._id)} className="text-red-500 hover:bg-red-50 p-1 rounded transition text-sm">Delete</button>
                   </div>
                   <p className="text-sm text-gray-500 mb-4">ID: {d._id}</p>
                   
                   <div className="text-sm border-t pt-3">
                     <p className="text-gray-600"><span className="font-semibold text-gray-800">Head:</span> {d.headUser?.name || 'Unassigned'}</p>
                     <p className="text-gray-600 mt-1"><span className="font-semibold text-gray-800">Workers:</span> {d.workers?.length || 0} registered</p>
                   </div>
                 </div>
               ))}
               {departments.length === 0 && <p className="text-gray-500">No departments configured.</p>}
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default Departments;
