
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Register.css';

const RegisterPage = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const userTypes = [
    {
      type: 'family',
      title: 'Family/Victim',
      description: 'Submit information about your destroyed home',
      icon: 'fas fa-users',
      color: '#ed1c24'
    },
    {
      type: 'donor',
      title: 'Donor',
      description: 'Help families by providing financial support',
      icon: 'fas fa-heart',
      color: '#2a9d8f'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    // Redirect based on user type
    if (userType === 'family') {
      navigate('/family-dashboard');
    } else if (userType === 'donor') {
      navigate('/donor-dashboard');
    }
  };

  if (!userType) {
    return (
      <div className="register-page">
        <Navbar />
        <section className="register-section">
          <div className="container">
            <div className="register-header">
              <h1>Join Our Community</h1>
              <p>Choose your role to get started with helping rebuild South Lebanon</p>
            </div>
            
            <div className="user-types-grid">
              {userTypes.map((type) => (
                <div 
                  key={type.type}
                  className="user-type-card"
                  onClick={() => setUserType(type.type)}
                  style={{'--card-color': type.color}}
                >
                  <div className="user-type-icon">
                    <i className={type.icon}></i>
                  </div>
                  <h3>{type.title}</h3>
                  <p>{type.description}</p>
                  <button className="select-btn">
                    Register as {type.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="register-page">
      <Navbar />
      <section className="form-section">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>
                <i className={userTypes.find(t => t.type === userType)?.icon}></i>
                Register as {userTypes.find(t => t.type === userType)?.title}
              </h2>
            </div>
            
            <div className="form-body">
              <form onSubmit={handleSubmit}>
                <div className="section-title">
                  <i className="fas fa-user"></i>
                  Personal Information
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+961 XX XXX XXX"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter password (min 6 characters)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    <i className="fas fa-user-plus"></i>
                    Create Account
                  </button>
                  
                  <button 
                    type="button"
                    className="back-btn"
                    onClick={() => setUserType('')}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Choose Different User Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;