import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../api/axios';

const NewComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Electrical',
    priority: 'Low', roomNumber: '', block: '', floor: ''
  });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  const categories = ['Electrical', 'Furniture', 'Plumbing', 'Computer', 'AC', 'Carpentry', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.error('Maximum 3 photos allowed');
      return;
    }
    setPhotos(files);
    
    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      photos.forEach(photo => data.append('photos', photo));

      await api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Complaint submitted successfully!');
      navigate('/student/complaints');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-6 gap-6">
      <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Student Panel</h2>
        <nav className="space-y-2">
          <Link to="/student/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">Dashboard</Link>
          <Link to="/student/new-complaint" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">Submit Issue</Link>
          <Link to="/student/complaints" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">My Complaints</Link>
        </nav>
      </aside>

      <main className="flex-1 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Report a New Issue</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="e.g., Broken AC in Room 204" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required minLength={20} name="description" value={formData.description} onChange={handleChange} rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Describe the issue in detail (min 20 characters)..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block / Building</label>
                <input required type="text" name="block" value={formData.block} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Block A" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                <input required type="text" name="floor" value={formData.floor} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Ground, 1st" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input required type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 101" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos (Max 3)</label>
                <input type="file" multiple accept="image/*" onChange={handlePhotoChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <div className="flex gap-4 mt-4">
                  {previews.map((src, i) => (
                    <img key={i} src={src} alt="Preview" className="h-20 w-20 object-cover rounded-lg border shadow-sm" />
                  ))}
                </div>
              </div>

            </div>

            <button type="submit" disabled={loading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:bg-blue-400">
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewComplaint;
