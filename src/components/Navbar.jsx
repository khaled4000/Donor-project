
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isMinimized, setIsMinimized] = useState(false);
  const { isAuthenticated, user, userType, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // If user is authenticated, show minimized navbar
  if (isAuthenticated) {
    return (
      <nav className={`navbar navbar-authenticated ${isMinimized ? 'minimized' : ''}`}>
        <div className="nav-container">
          <div className="nav-minimal">
        
            <div className="nav-user-controls">
              <button className="minimize-btn" onClick={toggleMinimize} title="Toggle Navigation">
                <i className={`fas ${isMinimized ? 'fa-expand' : 'fa-compress'}`}></i>
              </button>
              
              {!isMinimized && (
                <>
                
                  <div className="nav-actions">
              
                    <button className="logout-btn" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      {language === 'en' ? 'Logout' : 'خروج'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Default navbar for non-authenticated users
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <i className="fas fa-home"></i>
          {language === 'en' ? 'South Lebanon Aid' : 'مساعدة جنوب لبنان'}
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {language === 'en' ? 'Home' : 'الرئيسية'}
          </Link>
          <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {language === 'en' ? 'Register' : 'تسجيل'}
          </Link>
          <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {language === 'en' ? 'Login' : 'دخول'}
          </Link>

          {/* Dashboard Links - Only show for non-authenticated users */}
          <div className="dashboard-dropdown">
            <div className="dropdown-content">
              <Link to="/dashboard-checker" className="dropdown-link checker-link" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-user-shield"></i>
                {language === 'en' ? 'Auditor Panel' : 'لوحة المدقق'}
              </Link>
            </div>
          </div>
          
          <button className="language-btn" onClick={toggleLanguage}>
            {language === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
        
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;