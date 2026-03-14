import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './utils/PrivateRoute';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import NewComplaint from './pages/student/NewComplaint';
import MyComplaints from './pages/student/MyComplaints';
import ComplaintDetail from './pages/student/ComplaintDetail';

// Authority Pages
import AuthorityDashboard from './pages/authority/Dashboard';
import AuthorityQueue from './pages/authority/Queue';
import AuthorityResolve from './pages/authority/Resolve';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminDepartments from './pages/admin/Departments';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route element={<PrivateRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/new-complaint" element={<NewComplaint />} />
            <Route path="/student/complaints" element={<MyComplaints />} />
            <Route path="/student/complaints/:id" element={<ComplaintDetail />} />
          </Route>
          
          {/* Authority Routes */}
          <Route element={<PrivateRoute allowedRoles={['authority']} />}>
            <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
            <Route path="/authority/complaints" element={<AuthorityQueue />} />
            <Route path="/authority/complaints/:id/resolve" element={<AuthorityResolve />} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/departments" element={<AdminDepartments />} />
            {/* <Route path="/admin/complaints" element={<AdminComplaints />} /> */}
            {/* <Route path="/admin/reports" element={<AdminReports />} /> */}
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </Router>
  );
};

export default App;
