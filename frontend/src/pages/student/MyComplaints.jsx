import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { format } from 'date-fns';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints');
        setComplaints(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    return priority === 'Urgent' ? 'text-red-600 font-bold' : 
           priority === 'High' ? 'text-orange-500 font-semibold' : 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-6 gap-6">
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Student Panel</h2>
        <nav className="space-y-2">
          <Link to="/student/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Dashboard</Link>
          <Link to="/student/new-complaint" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Submit Issue</Link>
          <Link to="/student/complaints" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">My Complaints</Link>
        </nav>
      </aside>

      <main className="flex-1">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Complaints History</h1>
            <Link to="/student/new-complaint" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              + New Request
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading complaints...</div>
          ) : complaints.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-lg">You haven't submitted any complaints yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-600">ID</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Title</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Category</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Priority</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {complaints.map(c => (
                     <tr key={c._id} className="hover:bg-gray-50 transition">
                       <td className="py-4 px-4 text-sm text-gray-500">
                         {c._id.substring(c._id.length - 6).toUpperCase()}
                       </td>
                       <td className="py-4 px-4">
                         <Link to={`/student/complaints/${c._id}`} className="font-medium text-blue-600 hover:underline">
                           {c.title}
                         </Link>
                       </td>
                       <td className="py-4 px-4 text-gray-600">{c.category}</td>
                       <td className={`py-4 px-4 ${getPriorityColor(c.priority)}`}>{c.priority}</td>
                       <td className="py-4 px-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                           {c.status}
                         </span>
                       </td>
                       <td className="py-4 px-4 text-sm text-gray-500">
                         {format(new Date(c.createdAt), 'MMM dd, yyyy')}
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

export default MyComplaints;
