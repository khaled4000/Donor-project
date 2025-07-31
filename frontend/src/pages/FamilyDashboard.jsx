
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './FamilyDashboard.css';

const FamilyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [familyData, setFamilyData] = useState({
    // Family Information
    familyName: '',
    headOfHousehold: '',
    phoneNumber: '',
    alternatePhone: '',
    email: '',
    nationalId: '',
    numberOfMembers: '',
    childrenCount: '',
    elderlyCount: '',
    specialNeedsCount: '',
    
    // Address Information
    currentAddress: '',
    originalAddress: '',
    propertyType: 'house',
    ownershipStatus: 'owned',
    propertyValue: '',
    
    // Destruction Details
    destructionDate: '',
    destructionCause: '',
    destructionPercentage: '',
    damageDescription: '',
    previouslyRecevedAid: 'no',
    aidDetails: '',
    
    // Supporting Information
    witnessName: '',
    witnessPhone: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const caseStatus = {
    status: 'Under Review',
    submittedDate: '2025-01-15',
    caseId: 'SLA-2025-001247',
    progress: 65
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFamilyData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB per file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'image/heic'];
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format. Please upload JPG, PNG, PDF, or HEIC files.`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      category: 'uncategorized',
      description: ''
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // Remove uploaded file
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Update file category and description
  const updateFileInfo = (fileId, field, value) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, [field]: value } : file
      )
    );
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    const requiredFields = [
      'familyName', 'headOfHousehold', 'phoneNumber', 'numberOfMembers',
      'currentAddress', 'originalAddress', 'destructionDate', 'destructionPercentage',
      'damageDescription'
    ];
    
    requiredFields.forEach(field => {
      if (!familyData[field] || familyData[field].trim() === '') {
        errors[field] = 'This field is required';
      }
    });

    // Email validation
    if (familyData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(familyData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (familyData.phoneNumber && !/^\+?[\d\s-()]{8,}$/.test(familyData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    // Destruction percentage validation
    if (familyData.destructionPercentage && (
      isNaN(familyData.destructionPercentage) || 
      familyData.destructionPercentage < 0 || 
      familyData.destructionPercentage > 100
    )) {
      errors.destructionPercentage = 'Please enter a percentage between 0 and 100';
    }

    // File validation
    if (uploadedFiles.length === 0) {
      errors.files = 'Please upload at least one photo or document as evidence';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for API submission
      const formDataToSubmit = new FormData();
      
      // Add family data
      Object.keys(familyData).forEach(key => {
        formDataToSubmit.append(key, familyData[key]);
      });
      
      // Add files
      uploadedFiles.forEach((fileObj, index) => {
        formDataToSubmit.append(`file_${index}`, fileObj.file);
        formDataToSubmit.append(`file_${index}_category`, fileObj.category);
        formDataToSubmit.append(`file_${index}_description`, fileObj.description);
      });

      // API call would go here
      console.log('Submitting form data:', formDataToSubmit);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Case submitted successfully! You will receive a confirmation email shortly.');
      
      // Reset form or redirect as needed
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="tab-content">
            <div className="welcome-section">
              <h2>Welcome, {familyData.familyName || 'Family'}</h2>
              <p>Track your case status and manage your information</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="stat-info">
                  <h3>Case Status</h3>
                  <p className="stat-value status-review">{caseStatus.status}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar"></i>
                </div>
                <div className="stat-info">
                  <h3>Submitted</h3>
                  <p className="stat-value">{caseStatus.submittedDate}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-hashtag"></i>
                </div>
                <div className="stat-info">
                  <h3>Case ID</h3>
                  <p className="stat-value">{caseStatus.caseId}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-images"></i>
                </div>
                <div className="stat-info">
                  <h3>Files Uploaded</h3>
                  <p className="stat-value">{uploadedFiles.length}</p>
                </div>
              </div>
            </div>
            
            <div className="progress-section">
              <h3>Verification Progress</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${caseStatus.progress}%`}}
                ></div>
              </div>
              <p>{caseStatus.progress}% Complete</p>
            </div>
          </div>
        );
        
      case 'submit':
        return (
          <div className="tab-content">
            <div className="form-header-section">
              <h2>Submit New Case Application</h2>
              <p>Please provide accurate information about your family and property damage. All fields marked with (*) are required.</p>
            </div>

            <form onSubmit={handleSubmit} className="family-form">
              {/* Family Information Section */}
              <div className="form-section">
                <div className="section-title">
                  <i className="fas fa-users"></i>
                  Family Information
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Family Name *</label>
                    <input
                      type="text"
                      name="familyName"
                      value={familyData.familyName}
                      onChange={handleInputChange}
                      placeholder="Enter family surname"
                      className={formErrors.familyName ? 'error' : ''}
                    />
                    {formErrors.familyName && <span className="error-text">{formErrors.familyName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Head of Household *</label>
                    <input
                      type="text"
                      name="headOfHousehold"
                      value={familyData.headOfHousehold}
                      onChange={handleInputChange}
                      placeholder="Full name of head of household"
                      className={formErrors.headOfHousehold ? 'error' : ''}
                    />
                    {formErrors.headOfHousehold && <span className="error-text">{formErrors.headOfHousehold}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Primary Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={familyData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+961 XX XXX XXX"
                      className={formErrors.phoneNumber ? 'error' : ''}
                    />
                    {formErrors.phoneNumber && <span className="error-text">{formErrors.phoneNumber}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Alternate Phone Number</label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={familyData.alternatePhone}
                      onChange={handleInputChange}
                      placeholder="+961 XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={familyData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className={formErrors.email ? 'error' : ''}
                    />
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>National ID Number</label>
                    <input
                      type="text"
                      name="nationalId"
                      value={familyData.nationalId}
                      onChange={handleInputChange}
                      placeholder="Enter ID number"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Total Family Members *</label>
                    <select
                      name="numberOfMembers"
                      value={familyData.numberOfMembers}
                      onChange={handleInputChange}
                      className={formErrors.numberOfMembers ? 'error' : ''}
                    >
                      <option value="">Select number of members</option>
                      {[...Array(15)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} member{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                    {formErrors.numberOfMembers && <span className="error-text">{formErrors.numberOfMembers}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Number of Children (under 18)</label>
                    <select
                      name="childrenCount"
                      value={familyData.childrenCount}
                      onChange={handleInputChange}
                    >
                      <option value="">Select number</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Number of Elderly (over 65)</label>
                    <select
                      name="elderlyCount"
                      value={familyData.elderlyCount}
                      onChange={handleInputChange}
                    >
                      <option value="">Select number</option>
                      {[...Array(5)].map((_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Members with Special Needs</label>
                    <select
                      name="specialNeedsCount"
                      value={familyData.specialNeedsCount}
                      onChange={handleInputChange}
                    >
                      <option value="">Select number</option>
                      {[...Array(5)].map((_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Property Information Section */}
              <div className="form-section">
                <div className="section-title">
                  <i className="fas fa-home"></i>
                  Property Information
                </div>

                <div className="form-group">
                  <label>Current Address *</label>
                  <textarea
                    name="currentAddress"
                    value={familyData.currentAddress}
                    onChange={handleInputChange}
                    placeholder="Where are you currently staying?"
                    rows="2"
                    className={formErrors.currentAddress ? 'error' : ''}
                  />
                  {formErrors.currentAddress && <span className="error-text">{formErrors.currentAddress}</span>}
                </div>

                <div className="form-group">
                  <label>Original Property Address *</label>
                  <textarea
                    name="originalAddress"
                    value={familyData.originalAddress}
                    onChange={handleInputChange}
                    placeholder="Full address of the destroyed property"
                    rows="3"
                    className={formErrors.originalAddress ? 'error' : ''}
                  />
                  {formErrors.originalAddress && <span className="error-text">{formErrors.originalAddress}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Property Type</label>
                    <select
                      name="propertyType"
                      value={familyData.propertyType}
                      onChange={handleInputChange}
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="building">Building</option>
                      <option value="commercial">Commercial Property</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Ownership Status</label>
                    <select
                      name="ownershipStatus"
                      value={familyData.ownershipStatus}
                      onChange={handleInputChange}
                    >
                      <option value="owned">Owned</option>
                      <option value="rented">Rented</option>
                      <option value="family_owned">Family Owned</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Estimated Property Value (before destruction)</label>
                  <input
                    type="number"
                    name="propertyValue"
                    value={familyData.propertyValue}
                    onChange={handleInputChange}
                    placeholder="Amount in USD"
                    min="0"
                  />
                </div>
              </div>

              {/* Destruction Assessment Section */}
              <div className="form-section">
                <div className="section-title">
                  <i className="fas fa-exclamation-triangle"></i>
                  Destruction Assessment
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date of Destruction *</label>
                    <input
                      type="date"
                      name="destructionDate"
                      value={familyData.destructionDate}
                      onChange={handleInputChange}
                      className={formErrors.destructionDate ? 'error' : ''}
                    />
                    {formErrors.destructionDate && <span className="error-text">{formErrors.destructionDate}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Cause of Destruction</label>
                    <select
                      name="destructionCause"
                      value={familyData.destructionCause}
                      onChange={handleInputChange}
                    >
                      <option value="">Select cause</option>
                      <option value="airstrike">Airstrike</option>
                      <option value="artillery">Artillery</option>
                      <option value="ground_combat">Ground Combat</option>
                      <option value="explosion">Explosion</option>
                      <option value="fire">Fire</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Estimated Destruction Percentage *</label>
                  <div className="percentage-input">
                    <input
                      type="number"
                      name="destructionPercentage"
                      value={familyData.destructionPercentage}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      className={formErrors.destructionPercentage ? 'error' : ''}
                    />
                    <span className="percentage-symbol">%</span>
                  </div>
                  {formErrors.destructionPercentage && <span className="error-text">{formErrors.destructionPercentage}</span>}
                  <small className="help-text">
                    0% = No damage, 25% = Minor damage, 50% = Moderate damage, 75% = Severe damage, 100% = Complete destruction
                  </small>
                </div>

                <div className="form-group">
                  <label>Detailed Damage Description *</label>
                  <textarea
                    name="damageDescription"
                    value={familyData.damageDescription}
                    onChange={handleInputChange}
                    placeholder="Please describe the damage in detail. Include information about which parts of the property were affected, what was destroyed or damaged, and any other relevant details."
                    rows="5"
                    className={formErrors.damageDescription ? 'error' : ''}
                  />
                  {formErrors.damageDescription && <span className="error-text">{formErrors.damageDescription}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Previously Received Aid</label>
                    <select
                      name="previouslyReceivedAid"
                      value={familyData.previouslyReceivedAid}
                      onChange={handleInputChange}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  
                  {familyData.previouslyReceivedAid === 'yes' && (
                    <div className="form-group">
                      <label>Aid Details</label>
                      <textarea
                        name="aidDetails"
                        value={familyData.aidDetails}
                        onChange={handleInputChange}
                        placeholder="Please describe the aid received, from which organization, and when"
                        rows="3"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Supporting Information Section */}
              <div className="form-section">
                <div className="section-title">
                  <i className="fas fa-user-friends"></i>
                  Supporting Information
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Witness Name</label>
                    <input
                      type="text"
                      name="witnessName"
                      value={familyData.witnessName}
                      onChange={handleInputChange}
                      placeholder="Name of someone who can verify the damage"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Witness Phone</label>
                    <input
                      type="tel"
                      name="witnessPhone"
                      value={familyData.witnessPhone}
                      onChange={handleInputChange}
                      placeholder="+961 XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={familyData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Name of emergency contact person"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={familyData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="+961 XX XXX XXX"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="form-section">
                <div className="section-title">
                  <i className="fas fa-cloud-upload-alt"></i>
                  Evidence Upload
                </div>
                
                <div className="upload-instructions">
                  <p>Please upload photos and documents as evidence of the property damage. Accepted formats: JPG, PNG, PDF, HEIC. Maximum file size: 10MB per file.</p>
                  <ul>
                    <li>Photos of the damaged property (before and after if available)</li>
                    <li>Property ownership documents</li>
                    <li>National ID or passport</li>
                    <li>Any official damage assessment reports</li>
                    <li>Insurance documents (if applicable)</li>
                  </ul>
                </div>

                <div className="file-upload-area">
                  <div className="file-upload-box">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept="image/*,.pdf"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <p>Click to upload files or drag and drop</p>
                      <small>JPG, PNG, PDF up to 10MB each</small>
                    </label>
                  </div>
                </div>

                {formErrors.files && <span className="error-text">{formErrors.files}</span>}

                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files">
                    <h4>Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="files-grid">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="file-item">
                          <div className="file-header">
                            <div className="file-icon">
                              <i className={file.type.includes('image') ? 'fas fa-image' : 'fas fa-file-pdf'}></i>
                            </div>
                            <div className="file-info">
                              <h5>{file.name}</h5>
                              <p>{formatFileSize(file.size)}</p>
                            </div>
                            <button
                              type="button"
                              className="remove-file"
                              onClick={() => removeFile(file.id)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          
                          <div className="file-details">
                            <div className="form-group">
                              <label>Category</label>
                              <select
                                value={file.category}
                                onChange={(e) => updateFileInfo(file.id, 'category', e.target.value)}
                              >
                                <option value="uncategorized">Select category</option>
                                <option value="property_damage">Property Damage Photos</option>
                                <option value="before_photos">Before Destruction Photos</option>
                                <option value="ownership_documents">Ownership Documents</option>
                                <option value="identification">ID Documents</option>
                                <option value="official_reports">Official Reports</option>
                                <option value="insurance">Insurance Documents</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            
                            <div className="form-group">
                              <label>Description</label>
                              <input
                                type="text"
                                value={file.description}
                                onChange={(e) => updateFileInfo(file.id, 'description', e.target.value)}
                                placeholder="Brief description of this file"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-paper-plane"></i>
                  {isSubmitting ? 'Submitting Case...' : 'Submit Case Application'}
                </button>
                
                <p className="submit-notice">
                  By submitting this form, you confirm that all information provided is accurate and complete. 
                  You may be contacted for additional verification.
                </p>
              </div>
            </form>
          </div>
        );
        
      case 'documents':
        return (
          <div className="tab-content">
            <h2>My Documents</h2>
            <div className="documents-overview">
              <p>View and manage all uploaded documents for your case.</p>
              
              {uploadedFiles.length === 0 ? (
                <div className="no-documents">
                  <i className="fas fa-folder-open"></i>
                  <h3>No documents uploaded yet</h3>
                  <p>Go to the "Submit Case" tab to upload your evidence documents.</p>
                </div>
              ) : (
                <div className="documents-grid">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="document-card">
                      <div className="doc-icon">
                        <i className={file.type.includes('image') ? 'fas fa-image' : 'fas fa-file-pdf'}></i>
                      </div>
                      <div className="doc-info">
                        <h4>{file.name}</h4>
                        <p>Category: {file.category}</p>
                        <p>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</p>
                        <p>Size: {formatFileSize(file.size)}</p>
                      </div>
                      <div className="doc-actions">
                        <button className="view-btn">View</button>
                        <button className="download-btn">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <i className="fas fa-users"></i>
            </div>
            <h3>{familyData.familyName || 'Family Name'}</h3>
            <p className="user-type">Family/Victim</p>
          </div>
          
          <nav className="dashboard-nav">
            <button 
              className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-tachometer-alt"></i>
              Overview
            </button>
            <button 
              className={`nav-btn ${activeTab === 'submit' ? 'active' : ''}`}
              onClick={() => setActiveTab('submit')}
            >
              <i className="fas fa-plus"></i>
              Submit Case
            </button>
            <button 
              className={`nav-btn ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <i className="fas fa-folder"></i>
              My Documents
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

export default FamilyDashboard;