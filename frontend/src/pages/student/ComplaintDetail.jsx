import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        setComplaint(res.data.data);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load complaint');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/complaints/${id}/rate`, { rating, feedback });
      setComplaint(res.data.data);
      toast.success('Rating submitted successfully!');
    } catch (e) {
      toast.error('Failed to submit rating');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!complaint) return <div className="p-8 text-center text-red-500">Complaint not found</div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-6 gap-6">
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Student Panel</h2>
        <nav className="space-y-2">
          <Link to="/student/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Dashboard</Link>
          <Link to="/student/new-complaint" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Submit Issue</Link>
          <Link to="/student/complaints" className="block px-4 py-2 bg-gray-50 text-gray-800 rounded-lg font-medium">My Complaints</Link>
        </nav>
      </aside>

      <main className="flex-1 max-w-4xl space-y-6">
        <div className="bg-white rounded-xl shadow-sm flex flex-col md:flex-row justify-between p-6 border-l-4 border-blue-500">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-4">
              <span>ID: {complaint._id}</span>
              <span>Submitted: {format(new Date(complaint.createdAt), 'MMM dd, yyyy h:mm a')}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Details</h3>
              <p className="text-gray-700 whitespace-pre-wrap mb-6">{complaint.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Category</p>
                  <p className="font-semibold text-gray-800">{complaint.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Priority</p>
                  <p className="font-semibold text-gray-800">{complaint.priority}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="font-semibold text-gray-800">{complaint.block}-{complaint.roomNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Floor</p>
                  <p className="font-semibold text-gray-800">{complaint.floor}</p>
                </div>
              </div>
              
              {complaint.photos && complaint.photos.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Submitted Photos</h4>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {complaint.photos.map((url, i) => (
                      <img key={i} src={`http://localhost:5000${url}`} alt="Complaint issue" className="h-32 w-32 object-cover rounded-lg border" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {complaint.status === 'Resolved' && (
              <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-100">
                <h3 className="text-lg font-bold text-green-900 mb-4">Resolution Details</h3>
                <p className="text-green-800 mb-4">{complaint.resolutionNote || "No notes provided."}</p>
                
                {complaint.resolutionPhoto && (
                  <img src={`http://localhost:5000${complaint.resolutionPhoto}`} alt="Resolution" className="h-40 object-cover rounded-lg shadow-sm border border-green-200" />
                )}

                {!complaint.rating && (
                  <form onSubmit={handleRatingSubmit} className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">Rate the Service</h4>
                    <div className="flex items-center gap-2 mb-4">
                      {[1,2,3,4,5].map(num => (
                        <button key={num} type="button" onClick={() => setRating(num)}
                          className={`text-2xl ${rating >= num ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                      ))}
                    </div>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                      placeholder="Leave optional feedback..." className="w-full border rounded-lg p-2 text-sm focus:ring-blue-500 outline-none mb-3" />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Submit Rating</button>
                  </form>
                )}

                {complaint.rating && (
                   <div className="mt-4 bg-white p-4 rounded-lg">
                     <p className="text-yellow-500 text-lg mb-1">{"★".repeat(complaint.rating)}{"☆".repeat(5-complaint.rating)}</p>
                     {complaint.feedback && <p className="text-gray-600 text-sm italic">"{complaint.feedback}"</p>}
                   </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Timeline & Staff</h3>
              
              <div className="space-y-4">
                {complaint.assignedTo ? (
                  <div>
                    <p className="text-xs text-gray-500 font-medium tracking-wider">ASSIGNED TECHNICIAN</p>
                    <p className="font-semibold text-gray-800">{complaint.assignedTo.name}</p>
                    {complaint.assignedTo.phone && <p className="text-sm text-gray-500 text-blue-600">{complaint.assignedTo.phone}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Not assigned yet</p>
                )}

                {complaint.deadline && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium tracking-wider mt-4">SLA DEADLINE</p>
                    <p className="font-semibold text-red-600">{format(new Date(complaint.deadline), 'MMM dd, yyyy h:mm a')}</p>
                  </div>
                )}
                
                {complaint.resolvedAt && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium tracking-wider mt-4">RESOLVED AT</p>
                    <p className="font-semibold text-green-600">{format(new Date(complaint.resolvedAt), 'MMM dd, yyyy h:mm a')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetail;
