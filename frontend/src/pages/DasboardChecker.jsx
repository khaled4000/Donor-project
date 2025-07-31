// src/pages/DashboardChecker.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './DashboardChecker.css';

const DashboardChecker = () => {
  const { caseId } = useParams();
  const [activeSection, setActiveSection] = useState('overview');
  const [checkerDecision, setCheckerDecision] = useState('');
  const [checkerComments, setCheckerComments] = useState('');
  const [verificationNotes, setVerificationNotes] = useState({
    familyInfo: '',
    propertyInfo: '',
    damageAssessment: '',
    documentAuthenticity: '',
    fieldVerification: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample case data - in real app, this would come from API
  const [caseData] = useState({
    caseId: 'SLA-2025-001247',
    status: 'Under Review',
    submittedDate: '2025-01-15',
    priority: 'High',
    estimatedAmount: '$12,000',
    
    // Family Information
    familyInfo: {
      familyName: 'Al-Ahmad Family',
      headOfHousehold: 'Mohammed Ahmad',
      phoneNumber: '+961 70 123 456',
      alternatePhone: '+961 03 789 012',
      email: 'ahmad.family@email.com',
      nationalId: 'LB123456789',
      numberOfMembers: 7,
      childrenCount: 3,
      elderlyCount: 1,
      specialNeedsCount: 0
    },
    
    // Address Information
    addressInfo: {
      currentAddress: 'Temporary shelter, Sidon Municipality Center',
      originalAddress: 'Ain Baal Village, House #45, Near the Main Mosque, Tyre District, South Lebanon',
      propertyType: 'house',
      ownershipStatus: 'owned',
      propertyValue: '85000',
      coordinates: {
        lat: 33.2774,
        lng: 35.2044
      }
    },
    
    // Destruction Details
    destructionInfo: {
      destructionDate: '2024-10-15',
      destructionCause: 'airstrike',
      destructionPercentage: 85,
      damageDescription: 'The house was severely damaged by an airstrike. The roof completely collapsed, three rooms were destroyed, and the kitchen and living room walls have major cracks. The electrical and plumbing systems are completely damaged. Only one bedroom remains partially intact.',
      previouslyReceivedAid: 'no',
      aidDetails: ''
    },
    
    // Supporting Information
    supportingInfo: {
      witnessName: 'Ali Hassan',
      witnessPhone: '+961 71 234 567',
      emergencyContact: 'Fatima Ahmad (Sister)',
      emergencyPhone: '+961 03 345 678'
    },
    
    // Uploaded Files
    uploadedFiles: [
      {
        id: 1,
        name: 'house_damage_main.jpg',
        category: 'property_damage',
        description: 'Main view of destroyed house',
        size: '2.4 MB',
        uploadDate: '2025-01-15',
        type: 'image',
        url: '/api/files/house_damage_main.jpg',
        verified: null
      },
      {
        id: 2,
        name: 'before_destruction.jpg',
        category: 'before_photos',
        description: 'House before the airstrike',
        size: '1.8 MB',
        uploadDate: '2025-01-15',
        type: 'image',
        url: '/api/files/before_destruction.jpg',
        verified: null
      },
      {
        id: 3,
        name: 'property_deed.pdf',
        category: 'ownership_documents',
        description: 'Official property ownership document',
        size: '456 KB',
        uploadDate: '2025-01-15',
        type: 'document',
        url: '/api/files/property_deed.pdf',
        verified: null
      },
      {
        id: 4,
        name: 'national_id.jpg',
        category: 'identification',
        description: 'National ID of head of household',
        size: '892 KB',
        uploadDate: '2025-01-15',
        type: 'image',
        url: '/api/files/national_id.jpg',
        verified: null
      },
      {
        id: 5,
        name: 'interior_damage.jpg',
        category: 'property_damage',
        description: 'Interior damage - living room',
        size: '3.1 MB',
        uploadDate: '2025-01-15',
        type: 'image',
        url: '/api/files/interior_damage.jpg',
        verified: null
      }
    ],
    
    // Verification Checklist
    verificationChecklist: {
      familyInfoVerified: null,
      addressVerified: null,
      damageAssessmentVerified: null,
      documentsAuthentic: null,
      fieldVerificationNeeded: true,
      fieldVerificationCompleted: false
    }
  });

  const handleNotesChange = (section, value) => {
    setVerificationNotes(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleFileVerification = (fileId, isVerified) => {
    // In real app, this would update the file verification status via API
    console.log(`File ${fileId} verification status: ${isVerified}`);
  };

  const handleCaseDecision = async () => {
    if (!checkerDecision) {
      alert('Please select approve or reject before submitting.');
      return;
    }
    
    if (!checkerComments.trim()) {
      alert('Please provide comments explaining your decision.');
      return;
    }

    setIsSubmitting(true);

    try {
      const decisionData = {
        caseId: caseData.caseId,
        decision: checkerDecision,
        comments: checkerComments,
        verificationNotes: verificationNotes,
        timestamp: new Date().toISOString(),
        checkerId: 'current_checker_id' // Would come from auth context
      };

      // API call would go here
      console.log('Submitting decision:', decisionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Case ${checkerDecision === 'approved' ? 'approved' : 'rejected'} successfully!`);
      
      // Redirect to cases list or next case
      
    } catch (error) {
      console.error('Decision submission error:', error);
      alert('There was an error submitting your decision. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review': return '#ffc107';
      case 'Approved': return '#28a745';
      case 'Rejected': return '#dc3545';
      case 'Pending': return '#6c757d';
      default: return '#17a2b8';
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="case-header">
        <div className="case-info">
          <h1>Case Review: {caseData.caseId}</h1>
          <div className="case-meta">
            <span className="status-badge" style={{backgroundColor: getStatusColor(caseData.status)}}>
              {caseData.status}
            </span>
            <span className="priority-badge priority-high">High Priority</span>
            <span className="submitted-date">Submitted: {caseData.submittedDate}</span>
          </div>
        </div>
        <div className="case-summary">
          <div className="summary-item">
            <h4>Estimated Need</h4>
            <p className="amount">{caseData.estimatedAmount}</p>
          </div>
          <div className="summary-item">
            <h4>Family Size</h4>
            <p>{caseData.familyInfo.numberOfMembers} members</p>
          </div>
          <div className="summary-item">
            <h4>Damage Level</h4>
            <p>{caseData.destructionInfo.destructionPercentage}%</p>
          </div>
        </div>
      </div>

      <div className="quick-facts">
        <h3>Quick Assessment</h3>
        <div className="facts-grid">
          <div className="fact-item">
            <i className="fas fa-users"></i>
            <h4>Family: {caseData.familyInfo.familyName}</h4>
            <p>Head: {caseData.familyInfo.headOfHousehold}</p>
            <p>Members: {caseData.familyInfo.numberOfMembers} ({caseData.familyInfo.childrenCount} children, {caseData.familyInfo.elderlyCount} elderly)</p>
          </div>
          
          <div className="fact-item">
            <i className="fas fa-map-marker-alt"></i>
            <h4>Location</h4>
            <p>{caseData.addressInfo.originalAddress}</p>
            <button className="location-btn">
              <i className="fas fa-external-link-alt"></i>
              View on Map
            </button>
          </div>
          
          <div className="fact-item">
            <i className="fas fa-exclamation-triangle"></i>
            <h4>Destruction Details</h4>
            <p>Date: {caseData.destructionInfo.destructionDate}</p>
            <p>Cause: {caseData.destructionInfo.destructionCause}</p>
            <p>Severity: {caseData.destructionInfo.destructionPercentage}%</p>
          </div>
          
          <div className="fact-item">
            <i className="fas fa-folder"></i>
            <h4>Evidence Submitted</h4>
            <p>{caseData.uploadedFiles.length} files uploaded</p>
            <p>{caseData.uploadedFiles.filter(f => f.type === 'image').length} photos, {caseData.uploadedFiles.filter(f => f.type === 'document').length} documents</p>
          </div>
        </div>
      </div>

      <div className="verification-checklist">
        <h3>Verification Checklist</h3>
        <div className="checklist-items">
          <div className="checklist-item">
            <input type="checkbox" id="family-verified" />
            <label htmlFor="family-verified">Family information verified</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="address-verified" />
            <label htmlFor="address-verified">Address and location verified</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="damage-verified" />
            <label htmlFor="damage-verified">Damage assessment reviewed</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="documents-verified" />
            <label htmlFor="documents-verified">Documents authenticated</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="field-verification" />
            <label htmlFor="field-verification">Field verification completed (if required)</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFamilyInfo = () => (
    <div className="family-info-section">
      <h2>Family Information Review</h2>
      
      <div className="info-grid">
        <div className="info-card">
          <h3>Basic Information</h3>
          <div className="info-rows">
            <div className="info-row">
              <span className="label">Family Name:</span>
              <span className="value">{caseData.familyInfo.familyName}</span>
            </div>
            <div className="info-row">
              <span className="label">Head of Household:</span>
              <span className="value">{caseData.familyInfo.headOfHousehold}</span>
            </div>
            <div className="info-row">
              <span className="label">National ID:</span>
              <span className="value">{caseData.familyInfo.nationalId}</span>
            </div>
            <div className="info-row">
              <span className="label">Primary Phone:</span>
              <span className="value">{caseData.familyInfo.phoneNumber}</span>
            </div>
            <div className="info-row">
              <span className="label">Alternate Phone:</span>
              <span className="value">{caseData.familyInfo.alternatePhone}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{caseData.familyInfo.email}</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Family Composition</h3>
          <div className="info-rows">
            <div className="info-row">
              <span className="label">Total Members:</span>
              <span className="value">{caseData.familyInfo.numberOfMembers}</span>
            </div>
            <div className="info-row">
              <span className="label">Children (under 18):</span>
              <span className="value">{caseData.familyInfo.childrenCount}</span>
            </div>
            <div className="info-row">
              <span className="label">Elderly (over 65):</span>
              <span className="value">{caseData.familyInfo.elderlyCount}</span>
            </div>
            <div className="info-row">
              <span className="label">Special Needs:</span>
              <span className="value">{caseData.familyInfo.specialNeedsCount}</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Supporting Contacts</h3>
          <div className="info-rows">
            <div className="info-row">
              <span className="label">Witness Name:</span>
              <span className="value">{caseData.supportingInfo.witnessName}</span>
            </div>
            <div className="info-row">
              <span className="label">Witness Phone:</span>
              <span className="value">{caseData.supportingInfo.witnessPhone}</span>
            </div>
            <div className="info-row">
              <span className="label">Emergency Contact:</span>
              <span className="value">{caseData.supportingInfo.emergencyContact}</span>
            </div>
            <div className="info-row">
              <span className="label">Emergency Phone:</span>
              <span className="value">{caseData.supportingInfo.emergencyPhone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="verification-notes">
        <h3>Family Information Verification Notes</h3>
        <textarea
          value={verificationNotes.familyInfo}
          onChange={(e) => handleNotesChange('familyInfo', e.target.value)}
          placeholder="Add notes about family information verification, ID checks, contact verification, etc."
          rows="4"
        />
      </div>
    </div>
  );

  const renderPropertyInfo = () => (
    <div className="property-info-section">
      <h2>Property Information Review</h2>
      
      <div className="info-grid">
        <div className="info-card">
          <h3>Property Details</h3>
          <div className="info-rows">
            <div className="info-row">
              <span className="label">Property Type:</span>
              <span className="value">{caseData.addressInfo.propertyType}</span>
            </div>
            <div className="info-row">
              <span className="label">Ownership Status:</span>
              <span className="value">{caseData.addressInfo.ownershipStatus}</span>
            </div>
            <div className="info-row">
              <span className="label">Estimated Value:</span>
              <span className="value">${caseData.addressInfo.propertyValue}</span>
            </div>
          </div>
        </div>

        <div className="info-card full-width">
          <h3>Address Information</h3>
          <div className="info-rows">
            <div className="info-row">
              <span className="label">Original Property Address:</span>
              <span className="value">{caseData.addressInfo.originalAddress}</span>
            </div>
            <div className="info-row">
              <span className="label">Current Address:</span>
              <span className="value">{caseData.addressInfo.currentAddress}</span>
            </div>
            <div className="info-row">
              <span className="label">GPS Coordinates:</span>
              <span className="value">
                {caseData.addressInfo.coordinates.lat}, {caseData.addressInfo.coordinates.lng}
                <button className="location-btn ml-2">
                  <i className="fas fa-map"></i>
                  Verify Location
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="location-verification">
        <h3>Location Verification Tools</h3>
        <div className="verification-tools">
          <button className="tool-btn">
            <i className="fas fa-satellite"></i>
            View Satellite Images
          </button>
          <button className="tool-btn">
            <i className="fas fa-street-view"></i>
            Street View
          </button>
          <button className="tool-btn">
            <i className="fas fa-map-marked-alt"></i>
            Municipal Records
          </button>
          <button className="tool-btn">
            <i className="fas fa-calendar-check"></i>
            Schedule Field Visit
          </button>
        </div>
      </div>

      <div className="verification-notes">
        <h3>Property Verification Notes</h3>
        <textarea
          value={verificationNotes.propertyInfo}
          onChange={(e) => handleNotesChange('propertyInfo', e.target.value)}
          placeholder="Add notes about property verification, location checks, ownership verification, etc."
          rows="4"
        />
      </div>
    </div>
  );

  const renderDamageAssessment = () => (
    <div className="damage-assessment-section">
      <h2>Damage Assessment Review</h2>
      
      <div className="damage-overview">
        <div className="damage-stats">
          <div className="damage-stat">
            <div className="stat-circle">
              <span className="percentage">{caseData.destructionInfo.destructionPercentage}%</span>
            </div>
            <h4>Destruction Level</h4>
          </div>
          
          <div className="damage-details">
            <div className="detail-item">
              <span className="label">Date of Destruction:</span>
              <span className="value">{caseData.destructionInfo.destructionDate}</span>
            </div>
            <div className="detail-item">
              <span className="label">Cause:</span>
              <span className="value">{caseData.destructionInfo.destructionCause}</span>
            </div>
            <div className="detail-item">
              <span className="label">Previous Aid:</span>
              <span className="value">{caseData.destructionInfo.previouslyReceivedAid}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="damage-description">
        <h3>Damage Description</h3>
        <div className="description-box">
          <p>{caseData.destructionInfo.damageDescription}</p>
        </div>
      </div>

      <div className="damage-verification-tools">
        <h3>Assessment Verification Tools</h3>
        <div className="verification-tools">
          <button className="tool-btn">
            <i className="fas fa-calculator"></i>
            Damage Calculator
          </button>
          <button className="tool-btn">
            <i className="fas fa-chart-line"></i>
            Compare Similar Cases
          </button>
          <button className="tool-btn">
            <i className="fas fa-history"></i>
            Historical Data
          </button>
          <button className="tool-btn">
            <i className="fas fa-user-tie"></i>
            Request Expert Opinion
          </button>
        </div>
      </div>

      <div className="verification-notes">
        <h3>Damage Assessment Verification Notes</h3>
        <textarea
          value={verificationNotes.damageAssessment}
          onChange={(e) => handleNotesChange('damageAssessment', e.target.value)}
          placeholder="Add notes about damage assessment verification, percentage accuracy, comparison with similar cases, etc."
          rows="4"
        />
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="documents-section">
      <h2>Documents & Evidence Review</h2>
      
      <div className="documents-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="number">{caseData.uploadedFiles.length}</span>
            <span className="label">Total Files</span>
          </div>
          <div className="stat-item">
            <span className="number">{caseData.uploadedFiles.filter(f => f.type === 'image').length}</span>
            <span className="label">Photos</span>
          </div>
          <div className="stat-item">
            <span className="number">{caseData.uploadedFiles.filter(f => f.type === 'document').length}</span>
            <span className="label">Documents</span>
          </div>
        </div>
      </div>

      <div className="documents-grid">
        {caseData.uploadedFiles.map(file => (
          <div key={file.id} className="document-item">
            <div className="document-header">
              <div className="file-icon">
                <i className={file.type === 'image' ? 'fas fa-image' : 'fas fa-file-pdf'}></i>
              </div>
              <div className="file-info">
                <h4>{file.name}</h4>
                <p className="file-meta">
                  {file.category} • {file.size} • {file.uploadDate}
                </p>
                <p className="file-description">{file.description}</p>
              </div>
              <div className="verification-status">
                <button 
                  className={`verify-btn ${file.verified === true ? 'verified' : file.verified === false ? 'rejected' : 'pending'}`}
                  onClick={() => handleFileVerification(file.id, true)}
                >
                  <i className="fas fa-check"></i>
                </button>
                <button 
                  className={`reject-btn ${file.verified === false ? 'rejected' : 'pending'}`}
                  onClick={() => handleFileVerification(file.id, false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="document-actions">
              <button className="action-btn view-btn" onClick={() => setSelectedImage(file)}>
                <i className="fas fa-eye"></i>
                View Full Size
              </button>
              <button className="action-btn download-btn">
                <i className="fas fa-download"></i>
                Download
              </button>
              <button className="action-btn analyze-btn">
                <i className="fas fa-search"></i>
                Authenticate
              </button>
            </div>

            {file.type === 'image' && (
              <div className="image-preview">
                <img 
                  src={`https://via.placeholder.com/300x200?text=${file.name}`} 
                  alt={file.description}
                  onClick={() => setSelectedImage(file)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="authentication-tools">
        <h3>Document Authentication Tools</h3>
        <div className="verification-tools">
          <button className="tool-btn">
            <i className="fas fa-fingerprint"></i>
            Metadata Analysis
          </button>
          <button className="tool-btn">
            <i className="fas fa-search-plus"></i>
            Reverse Image Search
          </button>
          <button className="tool-btn">
            <i className="fas fa-shield-alt"></i>
            Forgery Detection
          </button>
          <button className="tool-btn">
            <i className="fas fa-clock"></i>
            Timestamp Verification
          </button>
        </div>
      </div>

      <div className="verification-notes">
        <h3>Document Authentication Notes</h3>
        <textarea
          value={verificationNotes.documentAuthenticity}
          onChange={(e) => handleNotesChange('documentAuthenticity', e.target.value)}
          placeholder="Add notes about document authenticity, metadata analysis, image verification, etc."
          rows="4"
        />
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedImage.name}</h3>
              <button className="close-btn" onClick={() => setSelectedImage(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <img 
                src={`https://via.placeholder.com/800x600?text=${selectedImage.name}`} 
                alt={selectedImage.description}
              />
              <div className="image-analysis">
                <h4>Analysis Tools</h4>
                <div className="analysis-tools">
                  <button className="analysis-btn">
                    <i className="fas fa-crop"></i>
                    Crop/Zoom
                  </button>
                  <button className="analysis-btn">
                    <i className="fas fa-adjust"></i>
                    Enhance
                  </button>
                  <button className="analysis-btn">
                    <i className="fas fa-info-circle"></i>
                    EXIF Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDecision = () => (
    <div className="decision-section">
      <h2>Case Decision</h2>
      
      <div className="decision-summary">
        <h3>Review Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <h4>Case Information</h4>
            <p>Case ID: {caseData.caseId}</p>
            <p>Family: {caseData.familyInfo.familyName}</p>
            <p>Estimated Need: {caseData.estimatedAmount}</p>
          </div>
          <div className="summary-item">
            <h4>Verification Status</h4>
            <p>✓ Family information reviewed</p>
            <p>✓ Property details verified</p>
            <p>✓ Damage assessment completed</p>
            <p>✓ Documents authenticated</p>
          </div>
        </div>
      </div>

      <div className="decision-form">
        <h3>Make Decision</h3>
        
        <div className="decision-options">
          <label className="decision-option">
            <input 
              type="radio" 
              name="decision" 
              value="approved"
              checked={checkerDecision === 'approved'}
              onChange={(e) => setCheckerDecision(e.target.value)}
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
              checked={checkerDecision === 'rejected'}
              onChange={(e) => setCheckerDecision(e.target.value)}
            />
            <div className="option-content reject">
              <i className="fas fa-times-circle"></i>
              <span>Reject Case</span>
            </div>
          </label>
          
          <label className="decision-option">
            <input 
              type="radio" 
              name="decision" 
              value="needs_more_info"
              checked={checkerDecision === 'needs_more_info'}
              onChange={(e) => setCheckerDecision(e.target.value)}
            />
            <div className="option-content info">
              <i className="fas fa-question-circle"></i>
              <span>Request More Information</span>
            </div>
          </label>
        </div>

        <div className="comments-section">
          <h4>Comments & Justification *</h4>
          <textarea
            value={checkerComments}
            onChange={(e) => setCheckerComments(e.target.value)}
            placeholder="Provide detailed explanation for your decision. Include specific reasons, verification results, and any recommendations."
            rows="6"
            className="decision-comments"
          />
        </div>

        <div className="field-verification-section">
          <h4>Field Verification Notes</h4>
          <textarea
            value={verificationNotes.fieldVerification}
            onChange={(e) => handleNotesChange('fieldVerification', e.target.value)}
            placeholder="Add notes about field verification activities, site visits, local inquiries, etc."
            rows="4"
          />
        </div>

        <div className="decision-actions">
          <button 
            className={`submit-decision-btn ${isSubmitting ? 'loading' : ''}`}
            onClick={handleCaseDecision}
            disabled={isSubmitting}
          >
            <i className="fas fa-gavel"></i>
            {isSubmitting ? 'Submitting Decision...' : 'Submit Decision'}
          </button>
          
          <button className="save-draft-btn">
            <i className="fas fa-save"></i>
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-checker-page">
      <Navbar />
      
      <div className="checker-container">
        <div className="checker-sidebar">
          <div className="checker-info">
            <div className="checker-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <h3>Sarah Mitchell</h3>
            <p className="checker-role">Senior Auditor</p>
            <p className="checker-id">ID: AUD-2025-042</p>
          </div>
          
          <nav className="checker-nav">
            <button 
              className={`nav-btn ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <i className="fas fa-clipboard-list"></i>
              Case Overview
            </button>
            <button 
              className={`nav-btn ${activeSection === 'family' ? 'active' : ''}`}
              onClick={() => setActiveSection('family')}
            >
              <i className="fas fa-users"></i>
              Family Information
            </button>
            <button 
              className={`nav-btn ${activeSection === 'property' ? 'active' : ''}`}
              onClick={() => setActiveSection('property')}
            >
              <i className="fas fa-home"></i>
              Property Details
            </button>
            <button 
              className={`nav-btn ${activeSection === 'damage' ? 'active' : ''}`}
              onClick={() => setActiveSection('damage')}
            >
              <i className="fas fa-exclamation-triangle"></i>
              Damage Assessment
            </button>
            <button 
              className={`nav-btn ${activeSection === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveSection('documents')}
            >
              <i className="fas fa-folder-open"></i>
              Documents & Evidence
            </button>
            <button 
              className={`nav-btn ${activeSection === 'decision' ? 'active' : ''}`}
              onClick={() => setActiveSection('decision')}
            >
              <i className="fas fa-gavel"></i>
              Make Decision
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <Link to="/checker-dashboard" className="back-btn">
              <i className="fas fa-arrow-left"></i>
              Back to Cases
            </Link>
          </div>
        </div>
        
        <div className="checker-main">
          <div className="checker-content">
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'family' && renderFamilyInfo()}
            {activeSection === 'property' && renderPropertyInfo()}
            {activeSection === 'damage' && renderDamageAssessment()}
            {activeSection === 'documents' && renderDocuments()}
            {activeSection === 'decision' && renderDecision()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChecker;