import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '../../api/axios';

const Queue = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignData, setAssignData] = useState({ workerId: '', deadline: '' });

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data.data);
    } catch (e) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/users?role=authority');
      setWorkers(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchWorkers();
  }, []);

  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setAssignData({ workerId: complaint.assignedTo?._id || '', deadline: '' });
  };

  const closeAssignModal = () => {
    setSelectedComplaint(null);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignData.workerId || !assignData.deadline) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await api.patch(`/complaints/${selectedComplaint._id}/assign`, {
        assignedTo: assignData.workerId,
        deadline: new Date(assignData.deadline)
      });
      toast.success('Ticket assigned successfully!');
      closeAssignModal();
      fetchComplaints(); // Refresh list
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to assign ticket');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status: newStatus });
      toast.success('Status updated!');
      fetchComplaints();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  // UI Helpers
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getPriorityColor = (priority) => {
    return priority === 'Urgent' ? 'text-red-600 font-bold bg-red-50 px-2 py-1 rounded' :
           priority === 'High' ? 'text-orange-500 font-semibold' : 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-6 gap-6 relative">
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Authority Panel</h2>
        <nav className="space-y-2">
          <Link to="/authority/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Dashboard</Link>
          <Link to="/authority/complaints" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">Ticket Queue</Link>
          <Link to="/authority/workers" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Manage Staff</Link>
        </nav>
      </aside>

      <main className="flex-1">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Department Ticket Queue</h1>
              <p className="text-sm text-gray-500">Manage reported issues and assign technicians</p>
            </div>
            <button onClick={fetchComplaints} className="text-sm font-medium text-blue-600 hover:text-blue-800">↻ Refresh</button>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading queue...</div>
          ) : complaints.length === 0 ? (
            <div className="py-16 text-center text-gray-500 font-medium">No complaints found for this department.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status & Staff</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {complaints.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-800 mb-1">{c.title}</p>
                        <p className="text-xs text-gray-400">ID: {c._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-400">{format(new Date(c.createdAt), 'MMM dd, h:mm a')}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800 font-medium">{c.block} - {c.roomNumber}</p>
                        <p className="text-xs text-gray-500">Floor: {c.floor}</p>
                      </td>
                      <td className={`py-4 px-4 ${getPriorityColor(c.priority)}`}>{c.priority}</td>
                      <td className="py-4 px-4">
                        <div className="mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>{c.status}</span>
                        </div>
                        {c.assignedTo ? (
                          <div className="text-xs text-gray-600 mt-1 flex flex-col">
                            <span className="font-medium text-gray-800">👤 {c.assignedTo.name}</span>
                            {c.deadline && <span className="text-red-500">Due: {format(new Date(c.deadline), 'MMM dd, h:mm a')}</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-2 items-center">
                           {c.status === 'Pending' && (
                             <button onClick={() => openAssignModal(c)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-semibold w-full transition">
                               Assign Staff
                             </button>
                           )}
                           {c.status === 'Assigned' && (
                             <button onClick={() => handleStatusChange(c._id, 'In Progress')} className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded text-xs font-semibold w-full transition">
                               Mark In Progress
                             </button>
                           )}
                           {c.status === 'In Progress' && (
                             <button onClick={() => navigate(`/authority/complaints/${c._id}/resolve`)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold w-full transition shadow-sm">
                               Resolve Ticket
                             </button>
                           )}
                           <Link to={`/student/complaints/${c._id}`} className="text-gray-500 hover:text-gray-800 text-xs underline">
                             View Details
                           </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Assign Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Assign Ticket</h3>
            <p className="text-sm text-gray-600 mb-4"><span className="font-semibold">{selectedComplaint.title}</span> ({selectedComplaint.block}-{selectedComplaint.roomNumber})</p>
            
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Technician</label>
                <select required value={assignData.workerId} onChange={e => setAssignData({...assignData, workerId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 outline-none text-sm bg-white">
                  <option value="">-- Choose Staff --</option>
                  {workers.map(w => (
                    <option key={w._id} value={w._id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SLA Deadline</label>
                <input required type="datetime-local" value={assignData.deadline} onChange={e => setAssignData({...assignData, deadline: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 outline-none text-sm bg-white" />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={closeAssignModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium flex-1 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex-1 transition shadow-sm">Confirm Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Queue;
