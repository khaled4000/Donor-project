// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import FamilyDashboard from './pages/FamilyDashboard';
import DonorDashboard from './pages/DonorDashboard';
import DashboardChecker from './pages/DasboardChecker';
import { AuthProvider } from './pages/AuthContext';
import './App.css';

function App() {
  return (
      <AuthProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
           <Route path="/family-dashboard" element={<FamilyDashboard />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
           <Route path="/dashboard-checker" element={<DashboardChecker />} />
        
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;