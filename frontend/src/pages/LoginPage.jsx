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
import Navbar from '../components/Navbar';
import './Login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  
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
    
    if (!formData.email || !formData.password || !formData.userType) {
      setAlertMessage('Please fill in all fields!');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Simulate login logic - replace with actual authentication
        const userData = {
          email: formData.email,
          userType: formData.userType,
          loginTime: new Date().toISOString()
        };

        // Use the login function from AuthContext
        login(userData, formData.userType);
        
        setAlertMessage('Login successful! Redirecting...');
        setAlertType('success');
        setShowAlert(true);
        
        setTimeout(() => {
          if (formData.userType === 'family') {
            navigate('/family-dashboard');
          } else if (formData.userType === 'donor') {
            navigate('/donor-dashboard');
          }
        }, 1500);
        
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
              <p>Sign in to continue helping rebuild South Lebanon</p>
            </div>
            
            <div className="login-form">
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
                <div className="form-group">
                  <label>User Type *</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select your role</option>
                    <option value="family">Family/Victim</option>
                    <option value="donor">Donor</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter your password"
                  />
                </div>
                
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" disabled={isLoading} />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
                
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
                
                <div className="login-footer">
                  <p>
                    Don't have an account? 
                    <Link to="/register" className="register-link">Register here</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;