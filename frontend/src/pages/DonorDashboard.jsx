// src/pages/DonorDashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const verifiedCases = [
    {
      id: 'SLA-2025-001247',
      family: 'Ahmad Family',
      location: 'Tyre, South Lebanon',
      familySize: '5 members',
      needed: '$12,000',
      raised: '$7,200',
      progress: 60,
      verified: '2025-01-10'
    },
    {
      id: 'SLA-2025-001248',
      family: 'Fatima Family',
      location: 'Nabatieh, South Lebanon',
      familySize: '3 members',
      needed: '$8,500',
      raised: '$2,100',
      progress: 25,
      verified: '2025-01-12'
    },
    {
      id: 'SLA-2025-001249',
      family: 'Hassan Family',
      location: 'Bint Jbeil, South Lebanon',
      familySize: '7 members',
      needed: '$15,000',
      raised: '$13,500',
      progress: 90,
      verified: '2025-01-08'
    }
  ];

  const regionalStats = [
    { region: 'Tyre', cases: 156, funded: '78%' },
    { region: 'Nabatieh', cases: 134, funded: '65%' },
    { region: 'Bint Jbeil', cases: 98, funded: '82%' },
    { region: 'Marjayoun', cases: 87, funded: '45%' }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'browse':
        return (
          <div className="tab-content">
            <div className="browse-header">
              <h2>Browse Verified Cases</h2>
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
                </select>
              </div>
            </div>
            
            <div className="cases-grid">
              {verifiedCases.map(caseItem => (
                <div key={caseItem.id} className="case-card">
                  <div className="case-header">
                    <h4>{caseItem.family}</h4>
                    <span className="case-id">{caseItem.id}</span>
                  </div>
                  
                  <div className="case-info">
                    <p><i className="fas fa-map-marker-alt"></i> {caseItem.location}</p>
                    <p><i className="fas fa-users"></i> {caseItem.familySize}</p>
                    <p><i className="fas fa-check-circle"></i> Verified: {caseItem.verified}</p>
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
                      <span className="raised">${caseItem.raised.replace('$', '')} raised</span>
                      <span className="needed">of {caseItem.needed}</span>
                    </div>
                  </div>
                  
                  <div className="case-actions">
                    <button className="donate-btn">
                      <i className="fas fa-heart"></i>
                      Donate Now
                    </button>
                    <button className="view-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
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
                  <p className="amount">$2,450</p>
                </div>
                <div className="summary-card">
                  <h3>Families Helped</h3>
                  <p className="amount">8</p>
                </div>
                <div className="summary-card">
                  <h3>This Month</h3>
                  <p className="amount">$500</p>
                </div>
              </div>
              
              <div className="donation-list">
                <div className="donation-item">
                  <div className="donation-info">
                    <h4>Ahmad Family</h4>
                    <p>Tyre, South Lebanon</p>
                    <span className="date">January 18, 2025</span>
                  </div>
                  <div className="donation-amount">$300</div>
                </div>
                
                <div className="donation-item">
                  <div className="donation-info">
                    <h4>Hassan Family</h4>
                    <p>Bint Jbeil, South Lebanon</p>
                    <span className="date">January 15, 2025</span>
                  </div>
                  <div className="donation-amount">$200</div>
                </div>
                
                <div className="donation-item">
                  <div className="donation-info">
                    <h4>Fatima Family</h4>
                    <p>Nabatieh, South Lebanon</p>
                    <span className="date">January 10, 2025</span>
                  </div>
                  <div className="donation-amount">$150</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-heart"></i>
            </div>
            <h3>Sarah Johnson</h3>
            <p className="user-type">Donor</p>
          </div>
          
          <nav className="dashboard-nav">
            <button 
              className={`nav-btn ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              <i className="fas fa-search"></i>
              Browse Cases
            </button>
            <button 
              className={`nav-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <i className="fas fa-map-marked-alt"></i>
              Regional Map
            </button>
            <button 
              className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <i className="fas fa-history"></i>
              My Donations
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <Link to="/" className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Back to Home
            </Link>
          </div>
        </div>
        
        <div className="dashboard-main">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;