import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">CampusFix</h1>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">Login</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center mt-16 px-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Report it. Track it. <span className="text-blue-600">Fix it.</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            The complete college maintenance management system. Quickly report room faults, upload photos, and track the resolution securely.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Student</h3>
            <p className="text-gray-600 mb-6 text-sm">Report issues securely and track resolution status in real-time.</p>
            <Link to="/login" className="block w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-100 transition">
              Student Login
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Authority Panel</h3>
            <p className="text-gray-600 mb-6 text-sm">Assign technicians, manage tickets, and resolve reported issues.</p>
            <Link to="/login" className="block w-full bg-orange-50 text-orange-700 font-medium py-2 rounded-lg hover:bg-orange-100 transition">
              Staff Login
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Admin</h3>
            <p className="text-gray-600 mb-6 text-sm">Overview analytics, manage departments and system users.</p>
            <Link to="/login" className="block w-full bg-purple-50 text-purple-700 font-medium py-2 rounded-lg hover:bg-purple-100 transition">
              Admin Login
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} CampusFix. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
