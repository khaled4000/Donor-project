  
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import Navbar from '../components/Navbar';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [verifiedCases, setVerifiedCases] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [donorData, setDonorData] = useState({
    donorName: '',
    email: '',
    userType: 'Donor'
  });
  const [userStats, setUserStats] = useState({
    totalDonated: 0,
    familiesHelped: 0,
    thisMonth: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from multiple sources
    const loggedInUser = getCurrentUser();
    
    // If no user from context or localStorage, redirect to login
    if (!loggedInUser && !user) {
      navigate('/login');
      return;
    }
    
    // Use context user if available, otherwise localStorage user
    const activeUser = user || loggedInUser;
    setCurrentUser(activeUser);
    setDonorData({
      donorName: activeUser?.name || activeUser?.donorName || 'Anonymous Donor',
      email: activeUser?.email || '',
      userType: activeUser?.userType || 'Donor'
    });
    
    loadVerifiedCases();
    loadUserDonationHistory(activeUser?.email);
    loadUserPreferences(activeUser?.email);
  }, [navigate, user]);

  const getCurrentUser = () => {
    try {
      // Try multiple localStorage keys for compatibility
      const currentUserData = localStorage.getItem('currentUser') || 
                              localStorage.getItem('loggedInUser') ||
                              localStorage.getItem('userData');
      return currentUserData ? JSON.parse(currentUserData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const saveUserData = (userData) => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const loadUserPreferences = (userEmail) => {
    if (!userEmail) return;
    
    try {
      const preferences = localStorage.getItem(`userPreferences_${userEmail}`);
      if (preferences) {
        const parsedPrefs = JSON.parse(preferences);
        setActiveTab(parsedPrefs.lastActiveTab || 'browse');
        setSelectedRegion(parsedPrefs.selectedRegion || 'all');
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const saveUserPreferences = (userEmail, preferences) => {
    if (!userEmail) return;
    
    try {
      localStorage.setItem(`userPreferences_${userEmail}`, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  const loadVerifiedCases = () => {
    try {
      const cases = JSON.parse(localStorage.getItem('donorCases') || '[]');
      setVerifiedCases(cases);
    } catch (error) {
      console.error('Error loading verified cases:', error);
      setVerifiedCases([]);
    }
  };

  const loadUserDonationHistory = (userEmail) => {
    if (!userEmail) return;
    
    try {
      // Get all donation history and filter by current user
      const allDonations = JSON.parse(localStorage.getItem('donationHistory') || '[]');
      const userDonations = allDonations.filter(donation => 
        donation.donorEmail === userEmail || 
        donation.donorName === donorData.donorName
      );
      setDonationHistory(userDonations);
      
      // Calculate user stats
      const totalDonated = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
      const familiesHelped = new Set(userDonations.map(d => d.caseId)).size;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonth = userDonations
        .filter(d => {
          const donationDate = new Date(d.date);
          return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
        })
        .reduce((sum, donation) => sum + donation.amount, 0);
      
      setUserStats({ totalDonated, familiesHelped, thisMonth });
    } catch (error) {
      console.error('Error loading donation history:', error);
    }
  };

  const handleDonation = (caseItem, amount) => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    if (!currentUser) {
      alert('Please log in to make a donation.');
      return;
    }

    const donation = {
      id: Date.now().toString(),
      caseId: caseItem.id,
      familyName: caseItem.family,
      location: caseItem.location,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      donorName: donorData.donorName || currentUser.name,
      donorEmail: currentUser.email
    };

    try {
      // Add to global donation history
      const allDonations = JSON.parse(localStorage.getItem('donationHistory') || '[]');
      const updatedAllDonations = [...allDonations, donation];
      localStorage.setItem('donationHistory', JSON.stringify(updatedAllDonations));

      // Update case progress
      const updatedCases = verifiedCases.map(c => {
        if (c.id === caseItem.id) {
          const currentRaised = parseFloat(c.raised.replace(/[$,]/g, '')) || 0;
          const newRaised = currentRaised + parseFloat(amount);
          const needed = parseFloat(c.needed.replace(/[$,]/g, ''));
          const newProgress = Math.min(Math.round((newRaised / needed) * 100), 100);
          
          return {
            ...c,
            raised: `${newRaised.toLocaleString()}`,
            progress: newProgress
          };
        }
        return c;
      });

      setVerifiedCases(updatedCases);
      localStorage.setItem('donorCases', JSON.stringify(updatedCases));

      // Update user's donation history and stats
      const updatedUserDonations = [...donationHistory, donation];
      setDonationHistory(updatedUserDonations);
      
      // Recalculate stats
      const totalDonated = updatedUserDonations.reduce((sum, d) => sum + d.amount, 0);
      const familiesHelped = new Set(updatedUserDonations.map(d => d.caseId)).size;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonth = updatedUserDonations
        .filter(d => {
          const donationDate = new Date(d.date);
          return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
        })
        .reduce((sum, d) => sum + d.amount, 0);
      
      setUserStats({ totalDonated, familiesHelped, thisMonth });

      // Save updated user data
      const updatedUserData = {
        ...currentUser,
        totalDonated,
        familiesHelped,
        lastDonation: new Date().toISOString()
      };
      saveUserData(updatedUserData);

      alert(`Thank you for your donation of ${amount} to ${caseItem.family}!`);
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Error processing donation. Please try again.');
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (currentUser?.email) {
      saveUserPreferences(currentUser.email, {
        lastActiveTab: newTab,
        selectedRegion: selectedRegion
      });
    }
  };

  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    if (currentUser?.email) {
      saveUserPreferences(currentUser.email, {
        lastActiveTab: activeTab,
        selectedRegion: newRegion
      });
    }
  };

  const handleLogout = () => {
    try {
      // Clear user session data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userData');
      localStorage.removeItem('loggedInUser');
      
      // Save final preferences before logout
      if (currentUser?.email) {
        saveUserPreferences(currentUser.email, {
          lastActiveTab: activeTab,
          selectedRegion: selectedRegion
        });
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/');
    }
  };

  const filteredCases = selectedRegion === 'all' 
    ? verifiedCases 
    : verifiedCases.filter(c => c.location.toLowerCase().includes(selectedRegion.replace('-', ' ').toLowerCase()));

  const regionalStats = [
    { region: 'Tyre', cases: verifiedCases.filter(c => c.location.includes('Tyre')).length, funded: '78%' },
    { region: 'Nabatieh', cases: verifiedCases.filter(c => c.location.includes('Nabatieh')).length, funded: '65%' },
    { region: 'Bint Jbeil', cases: verifiedCases.filter(c => c.location.includes('Bint Jbeil')).length, funded: '82%' },
    { region: 'Marjayoun', cases: verifiedCases.filter(c => c.location.includes('Marjayoun')).length, funded: '45%' },
    { region: 'Saida', cases: verifiedCases.filter(c => c.location.includes('Saida')).length, funded: '60%' }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'browse':
        return (
          <div className="tab-content">
            <div className="browse-header">
              <h2>Browse Verified Cases</h2>
              <div className="browse-stats">
                <span className="stat-item">
                  <strong>{verifiedCases.length}</strong> verified cases
                </span>
                <span className="stat-item">
                  <strong>{verifiedCases.filter(c => c.progress < 100).length}</strong> need funding
                </span>
                <span className="stat-item">
                  <strong>${verifiedCases.reduce((sum, c) => sum + parseFloat(c.raised.replace(/[$,]/g, '') || 0), 0).toLocaleString()}</strong> total raised
                </span>
              </div>
              <div className="filters">
                <select 
                  value={selectedRegion} 
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="all">All Regions</option>
                  <option value="tyre">Tyre</option>
                  <option value="nabatieh">Nabatieh</option>
                  <option value="bint-jbeil">Bint Jbeil</option>
                  <option value="marjayoun">Marjayoun</option>
                  <option value="saida">Saida</option>
                </select>
                <button className="refresh-btn" onClick={loadVerifiedCases}>
                  <i className="fas fa-sync-alt"></i> Refresh
                </button>
              </div>
            </div>
            
            {filteredCases.length === 0 ? (
              <div className="no-cases">
                <i className="fas fa-heart-broken"></i>
                <h3>No verified cases available</h3>
                <p>Cases approved by our checkers will appear here for funding.</p>
                {selectedRegion !== 'all' && (
                  <button 
                    className="view-all-btn"
                    onClick={() => setSelectedRegion('all')}
                  >
                    View All Regions
                  </button>
                )}
              </div>
            ) : (
              <div className="cases-grid">
                {filteredCases.map(caseItem => (
                  <div key={caseItem.id} className={`case-card ${caseItem.progress >= 100 ? 'fully-funded' : ''}`}>
                    <div className="case-header">
                      <h4>{caseItem.family}</h4>
                      <span className="case-id">{caseItem.id}</span>
                      {caseItem.progress >= 100 && (
                        <span className="funded-badge">
                          <i className="fas fa-check-circle"></i> Fully Funded
                        </span>
                      )}
                    </div>
                    
                    <div className="case-info">
                      <p><i className="fas fa-map-marker-alt"></i> {caseItem.location}</p>
                      <p><i className="fas fa-users"></i> {caseItem.familySize}</p>
                      <p><i className="fas fa-check-circle"></i> Verified: {caseItem.verified}</p>
                      {caseItem.damagePercentage && (
                        <p><i className="fas fa-exclamation-triangle"></i> Damage: {caseItem.damagePercentage}%</p>
                      )}
                    </div>
                    
                    <div className="funding-info">
                      <div className="funding-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{width: `${caseItem.progress}%`}}
                          ></div>
                        </div>
                        <span>{caseItem.progress}%</span>
                      </div>
                      <div className="funding-amounts">
                        <span className="raised">{caseItem.raised} raised</span>
                        <span className="needed">of {caseItem.needed}</span>
                      </div>
                    </div>
                    
                    <div className="case-actions">
                      {caseItem.progress < 100 ? (
                        <div className="donation-input">
                          <input
                            type="number"
                            placeholder="Amount ($)"
                            min="1"
                            max="10000"
                            id={`donation-${caseItem.id}`}
                          />
                          <button 
                            className="donate-btn"
                            onClick={() => {
                              const amount = document.getElementById(`donation-${caseItem.id}`).value;
                              handleDonation(caseItem, amount);
                              document.getElementById(`donation-${caseItem.id}`).value = '';
                            }}
                          >
                            <i className="fas fa-heart"></i>
                            Donate
                          </button>
                        </div>
                      ) : (
                        <div className="fully-funded-message">
                          <i className="fas fa-heart"></i>
                          Goal Achieved!
                        </div>
                      )}
                      <button className="view-btn">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'map':
        return (
          <div className="tab-content">
            <h2>Regional Impact Map</h2>
            <div className="regional-stats">
              <div className="stats-header">
                <h3>South Lebanon Overview</h3>
                <p>Cases by region with funding progress</p>
              </div>
              
              <div className="regions-grid">
                {regionalStats.map(region => (
                  <div key={region.region} className="region-card">
                    <div className="region-header">
                      <h4>{region.region}</h4>
                      <span className="funded-percentage">{region.funded} Funded</span>
                    </div>
                    <div className="region-stats">
                      <p><strong>{region.cases}</strong> verified cases</p>
                      <div className="region-progress">
                        <div 
                          className="progress-fill"
                          style={{width: region.funded}}
                        ></div>
                      </div>
                      <button 
                        className="view-region-btn"
                        onClick={() => {
                          handleRegionChange(region.region.toLowerCase().replace(' ', '-'));
                          handleTabChange('browse');
                        }}
                      >
                        View Cases
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="map-placeholder">
                <i className="fas fa-map"></i>
                <p>Interactive map will be displayed here</p>
                <small>Showing distribution of cases across South Lebanon</small>
              </div>
            </div>
          </div>
        );
        
      case 'history':
        return (
          <div className="tab-content">
            <h2>My Donation History</h2>
            <div className="donation-history">
              <div className="donation-summary">
                <div className="summary-card">
                  <h3>Total Donated</h3>
                  <p className="amount">${userStats.totalDonated.toLocaleString()}</p>
                </div>
                <div className="summary-card">
                  <h3>Families Helped</h3>
                  <p className="amount">{userStats.familiesHelped}</p>
                </div>
                <div className="summary-card">
                  <h3>This Month</h3>
                  <p className="amount">${userStats.thisMonth.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="donation-list">
                {donationHistory.length === 0 ? (
                  <div className="no-donations">
                    <i className="fas fa-heart"></i>
                    <h3>No donations yet</h3>
                    <p>Your donation history will appear here after you make your first donation.</p>
                    <button 
                      className="start-donating-btn"
                      onClick={() => handleTabChange('browse')}
                    >
                      Start Donating
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="donation-list-header">
                      <h3>Recent Donations</h3>
                      <p>{donationHistory.length} donations made</p>
                    </div>
                    {donationHistory
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(donation => (
                        <div key={donation.id} className="donation-item">
                          <div className="donation-info">
                            <h4>{donation.familyName}</h4>
                            <p><i className="fas fa-map-marker-alt"></i> {donation.location}</p>
                            <span className="date">
                              <i className="fas fa-calendar"></i> 
                              {new Date(donation.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="donation-amount">
                            <span className="amount">${donation.amount.toLocaleString()}</span>
                            <span className="case-id">{donation.caseId}</span>
                          </div>
                        </div>
                      ))
                    }
                  </>
                )}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Show loading if no current user yet
  if (!currentUser && !user) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const displayUser = currentUser || user;

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-heart"></i>
            </div>
            <h3>{donorData.donorName || displayUser?.name || 'Donor'}</h3>
            <p className="user-type">{donorData.userType}</p>
            <p className="user-email">{displayUser?.email || 'No email provided'}</p>
            <div className="user-stats-mini">
              <div className="mini-stat">
                <span className="mini-stat-value">${userStats.totalDonated.toLocaleString()}</span>
                <span className="mini-stat-label">donated</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-value">{userStats.familiesHelped}</span>
                <span className="mini-stat-label">  families helped</span>
              </div>
            </div>
          </div>
          
          <nav className="dashboard-nav">
            <button 
              className={`nav-btn ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => handleTabChange('browse')}
            >
              <i className="fas fa-search"></i>
              Browse Cases
              <span className="nav-badge">{verifiedCases.filter(c => c.progress < 100).length}</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => handleTabChange('map')}
            >
              <i className="fas fa-map-marked-alt"></i>
              Regional Map
            </button>
            <button 
              className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              <i className="fas fa-history"></i>
              My Donations
              {donationHistory.length > 0 && (
                <span className="nav-badge">{donationHistory.length}</span>
              )}
            </button>
          </nav>
          
       
        </div>
        
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1>Welcome back, {donorData.donorName?.split(' ')[0] || displayUser?.name?.split(' ')[0] || 'Donor'}!</h1>
            <p>Thank you for making a difference in South Lebanon</p>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;    
  