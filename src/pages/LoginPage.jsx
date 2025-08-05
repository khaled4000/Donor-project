// // src/pages/LoginPage.js
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import './Login.css';

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     userType: ''
//   });
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertType, setAlertType] = useState('success');
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!formData.email || !formData.password || !formData.userType) {
//       setAlertMessage('Please fill in all fields!');
//       setAlertType('error');
//       setShowAlert(true);
//       return;
//     }

//     // Simulate login logic
//     setAlertMessage('Login successful! Redirecting...');
//     setAlertType('success');
//     setShowAlert(true);
    
//     setTimeout(() => {
//       if (formData.userType === 'family') {
//         navigate('/family-dashboard');
//       } else if (formData.userType === 'donor') {
//         navigate('/donor-dashboard');
//       }
//     }, 2000);
//   };

//   return (
//     <div className="login-page">
//       <Navbar />
//       <section className="login-section">
//         <div className="container">
//           <div className="login-container">
//             <div className="login-header">
//               <h1>
//                 <i className="fas fa-sign-in-alt"></i>
//                 Welcome Back
//               </h1>
//               <p>Sign in to continue helping rebuild South Lebanon</p>
//             </div>
            
//             <div className="login-form">
//               {showAlert && (
//                 <div className={`alert alert-${alertType}`}>
//                   {alertMessage}
//                 </div>
//               )}
              
//               <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                   <label>User Type *</label>
//                   <select
//                     name="userType"
//                     value={formData.userType}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="">Select your role</option>
//                     <option value="family">Family/Victim</option>
//                     <option value="donor">Donor</option>
//                   </select>
//                 </div>
                
//                 <div className="form-group">
//                   <label>Email Address *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Enter your email address"
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label>Password *</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Enter your password"
//                   />
//                 </div>
                
//                 <div className="form-options">
//                   <label className="remember-me">
//                     <input type="checkbox" />
//                     <span>Remember me</span>
//                   </label>
//                   <a href="#" className="forgot-password">Forgot Password?</a>
//                 </div>
                
//                 <button type="submit" className="login-btn">
//                   <i className="fas fa-sign-in-alt"></i>
//                   Sign In
//                 </button>
                
//                 <div className="login-footer">
//                   <p>
//                     Don't have an account? 
//                     <Link to="/register" className="register-link">Register here</Link>
//                   </p>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default LoginPage;
// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import { authenticateUser } from '../utils/userStorage';
import Navbar from '../components/Navbar';
import './Login.css';
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setAlertMessage('Please fill in all fields!');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      try {
        // Authenticate user against localStorage
        const authenticatedUser = authenticateUser(formData.email, formData.password);
        
        if (authenticatedUser) {
          // Log in user using AuthContext
          login(authenticatedUser, authenticatedUser.userType);
          
          setAlertMessage('Login successful! Redirecting to your dashboard...');
          setAlertType('success');
          setShowAlert(true);
          
          // Redirect to appropriate dashboard
          setTimeout(() => {
            if (authenticatedUser.userType === 'family') {
              navigate('/family-dashboard', { replace: true });
            } else if (authenticatedUser.userType === 'donor') {
              navigate('/donor-dashboard', { replace: true });
            } else if (authenticatedUser.userType === 'checker') {
              navigate('/dashboard-checker', { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          }, 1000);
        } else {
          setAlertMessage('Invalid email or password. Please try again.');
          setAlertType('error');
          setShowAlert(true);
        }
      } catch (error) {
        setAlertMessage('Login failed. Please try again.');
        setAlertType('error');
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
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

  return (
    <div className="login-page">
      <Navbar />
      <section className="login-section">
        <div className="container">
          <div className="login-container">
            <div className="login-header">
              <h1>
                <i className="fas fa-sign-in-alt"></i>
                Welcome Back
              </h1>
              <p>Sign in to your account to continue helping rebuild South Lebanon</p>
            </div>
            
            <div className="login-form-container">
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

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="fas fa-lock"></i>
                    Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="login-btn" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="login-footer">
                <p>
                  Don't have an account? 
                  <Link to="/register" className="register-link">
                    Create one here
                  </Link>
                </p>
                
                <div className="login-help">
                  <Link to="/forgot-password" className="forgot-link">
                    <i className="fas fa-question-circle"></i>
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;