import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './DashboardChecker.css';

const DashboardChecker = () => {
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [finalDamagePercentage, setFinalDamagePercentage] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [allCases, setAllCases] = useState([]);
 const villages = [
     'Ain Baal', 'Abra', 'Adchit', 'Adloun', 
     'Aita al-Shaab', 'Aita az-Zut', 
         'Al-Bazouriye', 'Al-Khiyam', 
         'Al-Mansouri', 'Al-Taybe', 'Alma ash-Shaab',  
            'Ansar', 'Arabsalim', 'Arnoun', 'Bafliyeh', 
            'Bani Hayyan', 'Barish',     'Bayt Yahoun', 
            'Bazouriye', 'Bint Jbeil', 'Blida', 'Borj ash-Shamali', 
                'Borj el-Muluk', 'Burghuz', 'Chamaa', 'Chaqra', 'Chehabiyeh', 
                'Chihine',     'Deir Mimas', 'Deir Qanoun an-Nahr', 'Deir Seriane', 
                'Dhayra', 'Ebba',     'Ein el-Delb', 'El-Adousiye', 'El-Bassatine',
                 'El-Khiam', 'El-Mansouri',     'El-Qantara', 'Ghandouriye',
                  'Haddatha', 'Hanaway', 'Haris', 'Harouf',     'Houla', 
                  'Jbal as-Saghir', 'Jezzine', 'Jibbain', 'Kafra', 'Kfar Dounin',   
                    'Kfar Kila', 'Kfar Melki', 'Kfar Roummane', 'Kfar Shuba',
                     'Kfar Tibnit',     'Khallet Wardeh', 'Khiam', 'Khirbet Selm', 
                     'Kounine', 'Ksour', 'Majdal Zoun',     'Marjayoun', 'Maroun ar-Ras', 'Mays al-Jabal', 'Meiss ej-Jabal', 'Metulla',     'Nabatiye', 'Odaisseh', 'Qana', 'Qantara', 'Qlayle', 'Qlayaa', 'Qouzah',     'Rachaya al-Fukhar', 'Ramyeh', 'Ras al-Biyyadah', 'Rmadiyeh', 'Rmeish',     'Rshaf', 'Saida', 'Sajad', 'Sarba', 'Shaqra', 'Sreifa', 'Tayr Harfa',   
       'Tayr Dibba', 'Tebnine', 'Tyre', 'Yaroun', 'Yateri', 'Zawtar ash-Sharqiye'
  ];
  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = () => {
    const cases = [];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('familyCase_')) {
        try {
          const caseData = JSON.parse(localStorage.getItem(key));
          if (caseData?.status === 'submitted') {
            cases.push({
              caseId: caseData.caseId,
              status: 'Under Review',
              submittedDate: new Date(caseData.timestamps.submitted).toLocaleDateString(),
              familyData: caseData.familyData,
              originalStorageKey: key
            });
          }
        } catch (error) {
          console.error('Error loading case:', error);
        }
      }
    });
    setAllCases(cases);
  };

  const filteredCases = selectedVillage 
    ? allCases.filter(c => c.familyData?.village === selectedVillage)
    : allCases;

  const handleSubmitDecision = () => {
    if (!decision || !comments.trim()) {
      alert('Please select a decision and provide comments.');
      return;
    }

    if (decision === 'approved') {
      if (!finalDamagePercentage || !estimatedCost) {
        alert('For approved cases, please provide final damage percentage and estimated cost to rebuild.');
        return;
      }
      if (finalDamagePercentage < 0 || finalDamagePercentage > 100) {
        alert('Damage percentage must be between 0 and 100.');
        return;
      }
      if (estimatedCost <= 0) {
        alert('Estimated cost must be greater than 0.');
        return;
      }
    }

    const decisionData = {
      caseId: selectedCase.caseId,
      decision,
      comments,
      finalDamagePercentage: decision === 'approved' ? finalDamagePercentage : null,
      estimatedCost: decision === 'approved' ? estimatedCost : null,
      timestamp: new Date().toISOString(),
      checkerId: 'checker_001'
    };

    // Save decision
    localStorage.setItem(`caseDecision_${selectedCase.caseId}`, JSON.stringify(decisionData));
    
    if (decision === 'approved') {
      // Create approved case for donor dashboard
      const approvedCase = {
        id: selectedCase.caseId,
        family: selectedCase.familyData?.familyName || 'Unknown Family',
        location: `${selectedCase.familyData?.village}, South Lebanon`,
        familySize: `${selectedCase.familyData?.numberOfMembers} members`,
        needed: `$${parseInt(estimatedCost).toLocaleString()}`,
        raised: '$0',
        progress: 0,
        verified: new Date().toLocaleDateString(),
        damagePercentage: finalDamagePercentage,
        estimatedCost: estimatedCost,
        familyData: selectedCase.familyData,
        checkerComments: comments,
        approvedDate: new Date().toISOString(),
        status: 'approved'
      };

      // Add to donor dashboard cases
      const existingDonorCases = JSON.parse(localStorage.getItem('donorCases') || '[]');
      existingDonorCases.push(approvedCase);
      localStorage.setItem('donorCases', JSON.stringify(existingDonorCases));

      // Update family dashboard with approval
      if (selectedCase.originalStorageKey) {
        const originalCase = JSON.parse(localStorage.getItem(selectedCase.originalStorageKey));
        originalCase.status = 'approved';
        originalCase.checkerDecision = decisionData;
        originalCase.finalDamagePercentage = finalDamagePercentage;
        originalCase.estimatedCost = estimatedCost;
        localStorage.setItem(selectedCase.originalStorageKey, JSON.stringify(originalCase));
      }

      alert(`Case approved successfully!\nFinal Damage: ${finalDamagePercentage}%\nEstimated Cost: $${parseInt(estimatedCost).toLocaleString()}\n\nThe case has been added to the Donor Dashboard for funding.`);
    } else {
      // Update family dashboard with rejection
      if (selectedCase.originalStorageKey) {
        const originalCase = JSON.parse(localStorage.getItem(selectedCase.originalStorageKey));
        originalCase.status = 'rejected';
        originalCase.checkerDecision = decisionData;
        localStorage.setItem(selectedCase.originalStorageKey, JSON.stringify(originalCase));
      }

      alert(`Case rejected.\nReason: ${comments}\n\nThe family has been notified of the rejection.`);
    }
    
    // Update cases list
    setAllCases(prev => prev.map(c => 
      c.caseId === selectedCase.caseId 
        ? { ...c, status: decision === 'approved' ? 'Approved' : 'Rejected' }
        : c
    ));
    
    setSelectedCase(null);
    setDecision('');
    setComments('');
    setFinalDamagePercentage('');
    setEstimatedCost('');
  };

  const handleDeleteCase = (caseToDelete) => {
    if (!window.confirm(`Are you sure you want to permanently delete case ${caseToDelete.caseId}? This action cannot be undone.`)) {
      return;
    }

    // Remove from localStorage
    if (caseToDelete.originalStorageKey) {
      localStorage.removeItem(caseToDelete.originalStorageKey);
    }
    localStorage.removeItem(`caseDecision_${caseToDelete.caseId}`);

    // Update cases list
    setAllCases(prev => prev.filter(c => c.caseId !== caseToDelete.caseId));
    
    alert(`Case ${caseToDelete.caseId} has been permanently deleted from the system.`);
  };

  if (selectedCase) {
    return (
      <div className="dashboard-checker-page">
        <Navbar />
        <div className="checker-container">
          <div className="checker-sidebar">
            <div className="checker-info">
              <i className="fas fa-user-shield"></i>
              <h3>Case Review</h3>
            </div>
            <Link to="/" className="back-btn">
              <i className="fas fa-home"></i> Home
            </Link>
          </div>
          
          <div className="checker-main">
            <div className="case-details-section">
              <div className="case-details-header">
                <h2>{selectedCase.caseId}</h2>
                <button onClick={() => setSelectedCase(null)} className="back-to-list">
                  ← Back to Cases
                </button>
              </div>

              <div className="case-info-grid">
                <div className="info-card">
                  <h3>Family Information</h3>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="label">Family:</span>
                      <span className="value">{selectedCase.familyData?.familyName}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Head:</span>
                      <span className="value">{selectedCase.familyData?.headOfHousehold}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{selectedCase.familyData?.phoneNumber}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Members:</span>
                      <span className="value">{selectedCase.familyData?.numberOfMembers}</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Location</h3>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="label">Village:</span>
                      <span className="value village-highlight">{selectedCase.familyData?.village}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Current Address:</span>
                      <span className="value">{selectedCase.familyData?.currentAddress}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Original Address:</span>
                      <span className="value">{selectedCase.familyData?.originalAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Damage Assessment</h3>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="label">Reported Damage:</span>
                      <span className="value damage-level">{selectedCase.familyData?.destructionPercentage}%</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Date:</span>
                      <span className="value">{selectedCase.familyData?.destructionDate}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Cause:</span>
                      <span className="value">{selectedCase.familyData?.destructionCause}</span>
                    </div>
                    <div className="info-item full-width">
                      <span className="label">Description:</span>
                      <span className="value">{selectedCase.familyData?.damageDescription}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="decision-section">
                <h3>Final Review & Decision</h3>
                
                <div className="decision-options">
                  <label className="decision-option">
                    <input 
                      type="radio" 
                      name="decision" 
                      value="approved"
                      checked={decision === 'approved'}
                      onChange={(e) => setDecision(e.target.value)}
                    />
                    <div className="option-content approve">
                      <i className="fas fa-check-circle"></i>
                      <span>Approve Case</span>
                    </div>
                  </label>
                  
                  <label className="decision-option">
                    <input 
                      type="radio" 
                      name="decision" 
                      value="rejected"
                      checked={decision === 'rejected'}
                      onChange={(e) => setDecision(e.target.value)}
                    />
                    <div className="option-content reject">
                      <i className="fas fa-times-circle"></i>
                      <span>Reject Case</span>
                    </div>
                  </label>
                </div>

                {decision === 'approved' && (
                  <div className="final-assessment">
                    <h4>Final Assessment (Required for Approval)</h4>
                    <div className="assessment-row">
                      <div className="form-group">
                        <label>Final Damage Percentage *</label>
                        <div className="percentage-input">
                          <input
                            type="number"
                            value={finalDamagePercentage}
                            onChange={(e) => setFinalDamagePercentage(e.target.value)}
                            placeholder="0"
                            min="0"
                            max="100"
                            required
                          />
                          <span className="percentage-symbol">%</span>
                        </div>
                        <small>Verified damage percentage after review</small>
                      </div>
                      
                      <div className="form-group">
                        <label>Estimated Cost to Rebuild *</label>
                        <div className="currency-input">
                          <span className="currency-symbol">$</span>
                          <input
                            type="number"
                            value={estimatedCost}
                            onChange={(e) => setEstimatedCost(e.target.value)}
                            placeholder="0"
                            min="1"
                            required
                          />
                        </div>
                        <small>Total estimated cost in USD</small>
                      </div>
                    </div>
                  </div>
                )}

                <div className="comments-section">
                  <label>Comments & Justification *</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={decision === 'approved' 
                      ? "Explain your approval decision and assessment methodology..." 
                      : "Provide detailed reason for rejection..."}
                    rows="4"
                    className="decision-comments"
                  />
                </div>

                <button className="submit-decision-btn" onClick={handleSubmitDecision}>
                  <i className="fas fa-gavel"></i>
                  {decision === 'approved' ? 'Approve & Send to Donors' : 'Submit Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-checker-page">
      <Navbar />
      
      <div className="checker-container">
        <div className="checker-sidebar">
          <div className="checker-info">
            <i className="fas fa-user-shield"></i>
            <h3>Checker Dashboard</h3>
          </div>
          <Link to="/" className="back-btn">
            <i className="fas fa-home"></i> Home
          </Link>
        </div>
        
        <div className="checker-main">
          <div className="village-selection-section">
            <div className="selection-header">
              <h2>Cases Review</h2>
              <div className="total-summary">
                <span className="total-cases">
                  {selectedVillage ? `${filteredCases.length} in ${selectedVillage}` : `${allCases.length} Total`}
                </span>
                <button className="refresh-btn" onClick={loadCases}>
                  <i className="fas fa-sync-alt"></i> Refresh
                </button>
              </div>
            </div>

            <div className="village-filter">
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="village-select"
              >
                <option value="">All Villages</option>
                {villages.map(village => (
                  <option key={village} value={village}>{village}</option>
                ))}
              </select>
            </div>

            {allCases.length === 0 ? (
              <div className="no-cases-global">
                <i className="fas fa-inbox"></i>
                <h3>No cases submitted</h3>
              </div>
            ) : (
              <div className="cases-list">
                <div className="cases-list-items">
                  {filteredCases.map(caseItem => (
                    <div 
                      key={caseItem.caseId}
                      className="case-list-item"
                    >
                      <div className="case-item-header">
                        <div className="case-id">{caseItem.caseId}</div>
                        <div className={`case-status status-${caseItem.status.toLowerCase().replace(' ', '-')}`}>
                          {caseItem.status}
                        </div>
                      </div>
                      
                      <div className="case-item-body">
                        <h4>{caseItem.familyData?.familyName}</h4>
                        <div className="case-item-details">
                          <span><i className="fas fa-map-marker-alt"></i> {caseItem.familyData?.village}</span>
                          <span><i className="fas fa-user"></i> {caseItem.familyData?.headOfHousehold}</span>
                          <span><i className="fas fa-users"></i> {caseItem.familyData?.numberOfMembers} members</span>
                          <span><i className="fas fa-exclamation-triangle"></i> {caseItem.familyData?.destructionPercentage}% damage</span>
                        </div>
                      </div>
                      
                      <div className="case-actions">
                        {caseItem.status === 'Under Review' ? (
                          <button 
                            className="review-btn"
                            onClick={() => setSelectedCase(caseItem)}
                          >
                            <i className="fas fa-eye"></i> Review
                          </button>
                        ) : caseItem.status === 'Rejected' ? (
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteCase(caseItem)}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        ) : (
                          <span className="approved-label">
                            <i className="fas fa-check-circle"></i> Processed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChecker;