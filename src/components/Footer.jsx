// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <i className="fas fa-heart"></i>
              South Lebanon Aid
            </h3>
            <p>
              Connecting families in need with generous donors to rebuild homes 
              and restore hope in South Lebanon.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>info@southlebanonaid.org</p>
            <p>+961 1 234 567</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 South Lebanon Aid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;