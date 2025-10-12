import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { initializeData } from '../lib/storage.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize default data
    initializeData();
    
    // Check if user is already logged in
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const result = await api.login(username, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isSurveyor: user?.role === 'surveyor',
    isSupervisor: user?.role === 'supervisor'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
