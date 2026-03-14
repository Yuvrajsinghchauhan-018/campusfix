import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../api/axios';

const Resolve = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [resolutionNote, setResolutionNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        setComplaint(res.data.data);
      } catch (e) {
        toast.error('Failed to load complaint details');
        navigate('/authority/complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id, navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!resolutionNote) {
      toast.error('Please provide a resolution note');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('resolutionNote', resolutionNote);
      if (photo) {
        data.append('resolutionPhoto', photo);
      }

      await api.patch(`/complaints/${id}/resolve`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Ticket resolved successfully!');
      navigate('/authority/complaints');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to resolve ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading ticket data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full">
        <Link to="/authority/complaints" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mb-6">
          ← Back to Queue
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Resolve Ticket : {complaint.title}</h1>
            <p className="text-green-100 text-sm mt-1">Location: {complaint.block}-{complaint.roomNumber} ({complaint.category})</p>
          </div>

          <form onSubmit={handleResolveSubmit} className="p-8 space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-sm text-orange-800 mb-6">
              <span className="font-bold uppercase tracking-wider text-xs block mb-1">Issue Description</span>
              {complaint.description}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Resolution Note (Required)</label>
              <textarea required rows="4" value={resolutionNote} onChange={e => setResolutionNote(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Detail what was fixed, parts replaced, etc..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Proof of Completion (Photo/Proof)</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              
              {preview && (
                 <div className="mt-4 flex items-center gap-4">
                   <p className="text-sm font-medium text-gray-500">Preview:</p>
                   <img src={preview} alt="Resolution Preview" className="h-32 rounded-lg border shadow-sm object-cover" />
                 </div>
              )}
            </div>

            <div className="pt-6 border-t flex justify-end gap-4">
              <button type="button" onClick={() => navigate('/authority/complaints')} className="px-6 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition">Cancel</button>
              <button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2 rounded-lg transition shadow-md disabled:opacity-70">
                {submitting ? 'Resolving...' : 'Confirm Completion'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Resolve;
