import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/components.css';

const Navbar = () => {
  const { user, logout, isSurveyor, isSupervisor } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Gram Sarvekshak
          </Link>
          
          <nav className="nav">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            
            {isSurveyor && (
              <>
                <Link 
                  to="/survey-form" 
                  className={`nav-link ${isActive('/survey-form') ? 'active' : ''}`}
                >
                  New Survey
                </Link>
                <Link 
                  to="/reports" 
                  className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
                >
                  Reports
                </Link>
              </>
            )}
            
            {isSupervisor && (
              <Link 
                to="/admin" 
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              >
                Admin Dashboard
              </Link>
            )}
            
            <Link 
              to="/messages" 
              className={`nav-link ${isActive('/messages') ? 'active' : ''}`}
            >
              Messages
            </Link>
          </nav>
          
          <div className="user-menu">
            <div className="user-info">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {user.role === 'surveyor' ? 'Surveyor' : 'Supervisor'}
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
