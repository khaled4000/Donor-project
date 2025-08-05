// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import './authContext.css';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  // Check for existing session on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedAuth === 'true' && savedUser && savedUserType) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
  }, []);

  const login = (userData, type) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserType(type);
    
    // Persist authentication state
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
    
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const value = {
    isAuthenticated,
    user,
    userType,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};