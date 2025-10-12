import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Pages
import Login from './pages/Login.jsx';
import SurveyDashboard from './pages/SurveyDashboard.jsx';
import SurveyForm from './pages/SurveyForm.jsx';
import Reports from './pages/Reports.jsx';
import Messages from './pages/Messages.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Components
import Navbar from './components/Navbar.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App Router
const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        {user && <Navbar />}
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <SurveyDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/survey-form" 
            element={
              <ProtectedRoute allowedRoles={['surveyor']}>
                <SurveyForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/survey-form/:id" 
            element={
              <ProtectedRoute allowedRoles={['surveyor']}>
                <SurveyForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Route */}
          <Route 
            path="/" 
            element={
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
