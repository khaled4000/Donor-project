import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import Navbar from '../components/Navbar';
import { saveUser, emailExists } from '../utils/userStorage';
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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const userTypes = [
    {
      type: 'family',
      title: 'Victim',
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



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setAlertMessage('Please fill in all required fields!');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage('Passwords do not match!');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    if (formData.password.length < 6) {
      setAlertMessage('Password must be at least 6 characters long!');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    // Check if email already exists
    if (emailExists(formData.email)) {
      setAlertMessage('An account with this email already exists!');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate registration API call
    setTimeout(async () => {
      try {
        // Create user data
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password // Store password for authentication
        };

        // Save user to localStorage and get the complete user object
        const savedUser = saveUser(userData, userType);
        
        // Automatically log in user after successful registration using AuthContext
        login(savedUser, userType);
        
        setAlertMessage('Registration successful! Redirecting to your dashboard...');
        setAlertType('success');
        setShowAlert(true);
        
        // Auto-redirect to appropriate dashboard
        setTimeout(() => {
          if (userType === 'family') {
            navigate('/family-dashboard', { replace: true });
          } else if (userType === 'donor') {
            navigate('/donor-dashboard', { replace: true });
          }
        }, 1500);
        
      } catch (error) {
        setAlertMessage('Registration failed. Please try again.');
        setAlertType('error');
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  // Auto-hide alerts after 5 seconds
  React.useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  if (!userType) {
    return (
      <div className="register-page">
        <Navbar />
        <section className="register-section">
          <div className="container">
            <div className="register-header">
              <h1>
                <i className="fas fa-user-plus"></i>
                Join Our Community
              </h1>
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
            
            <div className="register-footer">
              <p>
                Already have an account? 
                <Link to="/login" className="login-link">Sign in here</Link>
              </p>
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
              {showAlert && (
                <div className={`alert alert-${alertType}`}>
                  <i className={`fas ${alertType === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                  {alertMessage}
                  <button 
                    className="alert-close" 
                    onClick={() => setShowAlert(false)}
                    aria-label="Close alert"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              
                <div className="form-actions">
                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        Create Account
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button"
                    className="back-btn"
                    onClick={() => setUserType('')}
                    disabled={isLoading}
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