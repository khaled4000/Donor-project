// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../pages/AuthContext';
// import Navbar from '../components/Navbar';
// import './FamilyDashboard.css';

// const FamilyDashboard = () => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [familyData, setFamilyData] = useState({
//     // Family Information
//     familyName: '',
//     headOfHousehold: '',
//     phoneNumber: '',
//     alternatePhone: '',
//     email: '',
//     nationalId: '',
//     numberOfMembers: '',
//     childrenCount: '',
//     elderlyCount: '',
//     specialNeedsCount: '',
    
//     // Address Information
//     village: '', // Added village selection
//     currentAddress: '',
//     originalAddress: '',
//     propertyType: 'house',
//     ownershipStatus: 'owned',
//     propertyValue: '',
    
//     // Destruction Details
//     destructionDate: '',
//     destructionCause: '',
//     destructionPercentage: '',
//     damageDescription: '',
//     previouslyReceivedAid: 'no',
//     aidDetails: '',
    
//     // Supporting Information
//     witnessName: '',
//     witnessPhone: '',
//     emergencyContact: '',
//     emergencyPhone: ''
//   });
  
//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [lastSaved, setLastSaved] = useState(null);
//   const [caseData, setCaseData] = useState(null);

//   // South Lebanon Villages - Same as Family Form
//   const southLebanonVillages = [
//     'Ain Baal', 'Abra', 'Adchit', 'Adloun', 'Aita al-Shaab', 'Aita az-Zut',
//     'Al-Bazouriye', 'Al-Khiyam', 'Al-Mansouri', 'Al-Taybe', 'Alma ash-Shaab',
//     'Ansar', 'Arabsalim', 'Arnoun', 'Bafliyeh', 'Bani Hayyan', 'Barish',
//     'Bayt Yahoun', 'Bazouriye', 'Bint Jbeil', 'Blida', 'Borj ash-Shamali',
//     'Borj el-Muluk', 'Burghuz', 'Chamaa', 'Chaqra', 'Chehabiyeh', 'Chihine',
//     'Deir Mimas', 'Deir Qanoun an-Nahr', 'Deir Seriane', 'Dhayra', 'Ebba',
//     'Ein el-Delb', 'El-Adousiye', 'El-Bassatine', 'El-Khiam', 'El-Mansouri',
//     'El-Qantara', 'Ghandouriye', 'Haddatha', 'Hanaway', 'Haris', 'Harouf',
//     'Houla', 'Jbal as-Saghir', 'Jezzine', 'Jibbain', 'Kafra', 'Kfar Dounin',
//     'Kfar Kila', 'Kfar Melki', 'Kfar Roummane', 'Kfar Shuba', 'Kfar Tibnit',
//     'Khallet Wardeh', 'Khiam', 'Khirbet Selm', 'Kounine', 'Ksour', 'Majdal Zoun',
//     'Marjayoun', 'Maroun ar-Ras', 'Mays al-Jabal', 'Meiss ej-Jabal', 'Metulla',
//     'Nabatiye', 'Odaisseh', 'Qana', 'Qantara', 'Qlayle', 'Qlayaa', 'Qouzah',
//     'Rachaya al-Fukhar', 'Ramyeh', 'Ras al-Biyyadah', 'Rmadiyeh', 'Rmeish',
//     'Rshaf', 'Saida', 'Sajad', 'Sarba', 'Shaqra', 'Sreifa', 'Tayr Harfa',
//     'Tayr Dibba', 'Tebnine', 'Tyre', 'Yaroun', 'Yateri', 'Zawtar ash-Sharqiye'
//   ];

//   // Generate unique case ID
//   const generateCaseId = () => {
//     return `SLA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
//   };

//   // Data storage utility functions
//   const getStorageKey = (suffix = '') => {
//     return `familyCase_${user?.id || 'guest'}${suffix ? '_' + suffix : ''}`;
//   };

//   // Save data to localStorage in JSON format - Only called on submit
//   const saveToStorage = useCallback(async (data, type = 'draft') => {
//     setIsSaving(true);
//     try {
//       const storageData = {
//         userId: user?.id,
//         userEmail: user?.email,
//         caseId: caseData?.caseId || generateCaseId(),
//         status: type, // 'draft', 'submitted', 'under_review', 'approved', 'rejected'
//         familyData: data,
//         uploadedFiles: uploadedFiles.map(file => ({
//           id: file.id,
//           name: file.name,
//           size: file.size,
//           type: file.type,
//           category: file.category,
//           description: file.description,
//           uploadDate: file.uploadDate,
//           base64: file.base64, // Store file content for demo purposes
//           checksum: file.checksum
//           // Note: File content would be handled differently in production
//           // For now, we'll store file metadata only
//         })),
//         timestamps: {
//           created: caseData?.timestamps?.created || new Date().toISOString(),
//           lastModified: new Date().toISOString(),
//           submitted: type === 'submitted' ? new Date().toISOString() : caseData?.timestamps?.submitted
//         },
//         metadata: {
//           version: '1.0',
//           source: 'family_dashboard',
//           formCompletion: calculateFormCompletion(data),
//           totalFiles: uploadedFiles.length
//         }
//       };

//       // Save current case
//       localStorage.setItem(getStorageKey(), JSON.stringify(storageData));
      
//       // Update case list for user
//       const existingCases = JSON.parse(localStorage.getItem(getStorageKey('cases')) || '[]');
//       const caseIndex = existingCases.findIndex(c => c.caseId === storageData.caseId);
      
//       if (caseIndex >= 0) {
//         existingCases[caseIndex] = {
//           caseId: storageData.caseId,
//           status: storageData.status,
//           lastModified: storageData.timestamps.lastModified,
//           familyName: data.familyName,
//           submittedDate: storageData.timestamps.submitted
//         };
//       } else {
//         existingCases.push({
//           caseId: storageData.caseId,
//           status: storageData.status,
//           lastModified: storageData.timestamps.lastModified,
//           familyName: data.familyName,
//           submittedDate: storageData.timestamps.submitted
//         });
//       }
      
//       localStorage.setItem(getStorageKey('cases'), JSON.stringify(existingCases));
      
//       // Update case data state
//       setCaseData(storageData);
//       setLastSaved(new Date());
      
//       console.log('Data saved to localStorage:', storageData);
//       return storageData;
//     } catch (error) {
//       console.error('Error saving data:', error);
//       throw error;
//     } finally {
//       setIsSaving(false);
//     }
//   }, [user?.id, user?.email, uploadedFiles, caseData]);

//   // Load data from localStorage
//   const loadFromStorage = useCallback(() => {
//     try {
//       const savedData = localStorage.getItem(getStorageKey());
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);
//         setFamilyData(parsedData.familyData || {});
//         setUploadedFiles(parsedData.uploadedFiles || []);
//         setCaseData(parsedData);
//         setLastSaved(new Date(parsedData.timestamps?.lastModified));
//         console.log('Data loaded from localStorage:', parsedData);
//       }
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   }, [user?.id]);

//   // Calculate form completion percentage
//   const calculateFormCompletion = (data) => {
//     const requiredFields = [
//       'familyName', 'headOfHousehold', 'phoneNumber', 'numberOfMembers',
//       'village', 'currentAddress', 'originalAddress', 'destructionDate', 'destructionPercentage',
//       'damageDescription'
//     ];
    
//     const completedFields = requiredFields.filter(field => data[field] && data[field].toString().trim() !== '');
//     const basicCompletion = (completedFields.length / requiredFields.length) * 80; // 80% for required fields
//     const fileCompletion = uploadedFiles.length > 0 ? 20 : 0; // 20% for file upload
    
//     return Math.round(basicCompletion + fileCompletion);
//   };

//   // Removed auto-save functionality - Data only saves on submit

//   // Load data on component mount
//   useEffect(() => {
//     loadFromStorage();
//   }, [loadFromStorage]);

//   // Initialize with user data if available
//   useEffect(() => {
//     if (user && !familyData.email) {
//       setFamilyData(prev => ({
//         ...prev,
//         email: user.email || '',
//         headOfHousehold: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
//         phoneNumber: user.phone || ''
//       }));
//     }
//   }, [user, familyData.email]);

//   const caseStatus = {
//     status: caseData?.status === 'submitted' ? 'Under Review' : 'Draft',
//     submittedDate: caseData?.timestamps?.submitted ? new Date(caseData.timestamps.submitted).toLocaleDateString() : '-',
//     caseId: caseData?.caseId || 'Not assigned',
//     progress: calculateFormCompletion(familyData) // Calculate real-time progress
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFamilyData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   // Handle file upload with base64 encoding for storage
//   const handleFileUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     const maxSize = 10 * 1024 * 1024; // 10MB per file
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'image/heic'];
    
//     const validFiles = files.filter(file => {
//       if (file.size > maxSize) {
//         alert(`File ${file.name} is too large. Maximum size is 10MB.`);
//         return false;
//       }
//       if (!allowedTypes.includes(file.type)) {
//         alert(`File ${file.name} is not a supported format. Please upload JPG, PNG, PDF, or HEIC files.`);
//         return false;
//       }
//       return true;
//     });

//     const processedFiles = await Promise.all(validFiles.map(async (file) => {
//       // Convert file to base64 for storage (in production, you'd upload to cloud storage)
//       const base64 = await new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.readAsDataURL(file);
//       });

//       return {
//         id: Date.now() + Math.random(),
//         file: file,
//         name: file.name,
//         size: file.size,
//         type: file.type,
//         uploadDate: new Date().toISOString(),
//         category: 'uncategorized',
//         description: '',
//         base64: base64, // Store file content for demo purposes
//         checksum: btoa(file.name + file.size + file.lastModified) // Simple checksum
//       };
//     }));

//     setUploadedFiles(prev => [...prev, ...processedFiles]);
//   };

//   // Remove uploaded file
//   const removeFile = (fileId) => {
//     setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
//   };

//   // Update file category and description
//   const updateFileInfo = (fileId, field, value) => {
//     setUploadedFiles(prev => 
//       prev.map(file => 
//         file.id === fileId ? { ...file, [field]: value } : file
//       )
//     );
//   };

//   // Form validation
//   const validateForm = () => {
//     const errors = {};
    
//     // Required fields validation
//     const requiredFields = [
//       'familyName', 'headOfHousehold', 'phoneNumber', 'numberOfMembers',
//       'village', 'currentAddress', 'originalAddress', 'destructionDate', 'destructionPercentage',
//       'damageDescription'
//     ];
    
//     requiredFields.forEach(field => {
//       if (!familyData[field] || familyData[field].toString().trim() === '') {
//         errors[field] = 'This field is required';
//       }
//     });

//     // Email validation
//     if (familyData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(familyData.email)) {
//       errors.email = 'Please enter a valid email address';
//     }

//     // Phone validation
//     if (familyData.phoneNumber && !/^\+?[\d\s-()]{8,}$/.test(familyData.phoneNumber)) {
//       errors.phoneNumber = 'Please enter a valid phone number';
//     }

//     // Destruction percentage validation
//     if (familyData.destructionPercentage && (
//       isNaN(familyData.destructionPercentage) || 
//       familyData.destructionPercentage < 0 || 
//       familyData.destructionPercentage > 100
//     )) {
//       errors.destructionPercentage = 'Please enter a percentage between 0 and 100';
//     }

//     // File validation
//     if (uploadedFiles.length === 0) {
//       errors.files = 'Please upload at least one photo or document as evidence';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form submission - Only place where data is saved
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       alert('Please fix the errors in the form before submitting.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Save as submitted case - ONLY TIME DATA IS SAVED
//       const submittedData = await saveToStorage(familyData, 'submitted');
      
//       // Generate submission report
//       const submissionReport = {
//         ...submittedData,
//         submissionSummary: {
//           totalFields: Object.keys(familyData).length,
//           completedFields: Object.values(familyData).filter(val => val !== '').length,
//           totalFiles: uploadedFiles.length,
//           categorizedFiles: uploadedFiles.filter(f => f.category !== 'uncategorized').length
//         }
//       };

//       // In production, this would be sent to your API
//       console.log('Case submitted successfully:', submissionReport);
      
//       // Save submission report
//       localStorage.setItem(
//         getStorageKey('submission_report'), 
//         JSON.stringify(submissionReport)
//       );

//       // Save for checker to access (same as Family Form)
//       localStorage.setItem('pendingCaseReview', JSON.stringify({
//         caseId: submittedData.caseId,
//         status: 'Under Review',
//         submittedDate: new Date().toLocaleDateString(),
//         priority: 'High',
//         familyData: {
//           ...familyData,
//           submittedBy: user?.firstName + ' ' + user?.lastName || 'Unknown',
//           submissionTime: new Date().toISOString()
//         }
//       }));
      
//       alert(`Case submitted successfully! Your Case ID is: ${submittedData.caseId}\n\nThe case has been sent to our checker for review.`);
      
//       // Switch to overview tab
//       setActiveTab('overview');
      
//     } catch (error) {
//       console.error('Submission error:', error);
//       alert('There was an error submitting your case. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Send data to checker
//   const sendToChecker = () => {
//     if (!caseData) {
//       alert('Please submit your case first before sending to checker.');
//       return;
//     }

//     // Navigate to checker dashboard with case data
//     window.open('/dashboard-checker', '_blank');
//     alert('Case sent to checker dashboard! A new tab will open for the checker to review.');
//   };
//   const exportCaseData = () => {
//     try {
//       const exportData = {
//         ...caseData,
//         exportTimestamp: new Date().toISOString(),
//         exportVersion: '1.0'
//       };
      
//       const dataStr = JSON.stringify(exportData, null, 2);
//       const dataBlob = new Blob([dataStr], { type: 'application/json' });
//       const url = URL.createObjectURL(dataBlob);
      
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `case_${caseData?.caseId || 'draft'}_${Date.now()}.json`;
//       link.click();
      
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Export error:', error);
//       alert('Error exporting data. Please try again.');
//     }
//   };

//   // Manual save function - Only saves draft, not auto-triggered
//   const handleManualSave = async () => {
//     try {
//       await saveToStorage(familyData, caseData?.status || 'draft');
//       alert('Data saved successfully!');
//     } catch (error) {
//       alert('Error saving data. Please try again.');
//     }
//   };

//   // Format file size
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const renderTabContent = () => {
//     switch(activeTab) {
//       case 'overview':
//         return (
//           <div className="tab-content">
//             <div className="welcome-section">
//               <h2>Welcome, {familyData.familyName || user?.firstName || 'Family'}</h2>
//               <p>Track your case status and manage your information</p>
              
//               {/* Save Status Indicator */}
//               {lastSaved && (
//                 <div className="save-status">
//                   <span className="saved">
//                     <i className="fas fa-check-circle"></i>
//                     Last saved: {lastSaved.toLocaleString()}
//                   </span>
//                 </div>
//               )}
//             </div>
// {/*             
//             <div className="stats-grid">
//               <div className="stat-card">
//                 <div className="stat-icon">
//                   <i className="fas fa-file-alt"></i>
//                 </div>
//                 <div className="stat-info">
//                   <h3>Case Status</h3>
//                   <p className={`stat-value status-${caseStatus.status.toLowerCase().replace(' ', '-')}`}>
//                     {caseStatus.status}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="stat-card">
//                 <div className="stat-icon">
//                   <i className="fas fa-calendar"></i>
//                 </div>
//                 <div className="stat-info">
//                   <h3>Submitted</h3>
//                   <p className="stat-value">{caseStatus.submittedDate}</p>
//                 </div>
//               </div>
              
//               <div className="stat-card">
//                 <div className="stat-icon">
//                   <i className="fas fa-hashtag"></i>
//                 </div>
//                 <div className="stat-info">
//                   <h3>Case ID</h3>
//                   <p className="stat-value">{caseStatus.caseId}</p>
//                 </div>
//               </div>
              
//               <div className="stat-card">
//                 <div className="stat-icon">
//                   <i className="fas fa-images"></i>
//                 </div>
//                 <div className="stat-info">
//                   <h3>Files Uploaded</h3>
//                   <p className="stat-value">{uploadedFiles.length}</p>
//                 </div>
//               </div>
//             </div> */}
            
//             <div className="progress-section">
//               <h3>Application Progress</h3>
//               <div className="progress-bar">
//                 <div 
//                   className="progress-fill" 
//                   style={{width: `${caseStatus.progress}%`}}
//                 ></div>
//               </div>
//               <p>{caseStatus.progress}% Complete</p>
              
//               {/* Show village information if selected */}
//               {familyData.village && (
//                 <div className="village-info-section">
//                   <h4>Selected Village</h4>
//                   <div className="village-display">
//                     <i className="fas fa-map-marker-alt"></i>
//                     <span className="village-name">{familyData.village}</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Send to Checker Action */}
//             {caseData?.status === 'submitted' && (
//               <div className="checker-actions">
//                 <h3>Case Review</h3>
//                 <p>Your case has been submitted and is ready for review.</p>
//                 <button className="send-to-checker-btn" onClick={sendToChecker}>
//                   <i className="fas fa-user-shield"></i>
//                   Open Checker Dashboard
//                 </button>
//               </div>
//             )}

//             {/* Data Management Actions */}
//             {/* <div className="data-actions">
//               <button className="action-btn" onClick={handleManualSave} disabled={isSaving}>
//                 <i className="fas fa-save"></i>
//                 Manual Save
//               </button>
//               <button className="action-btn secondary" onClick={exportCaseData} disabled={!caseData}>
//                 <i className="fas fa-download"></i>
//                 Export Data (JSON)
//               </button>
//             </div> */}
//           </div>
//         );
        
//       case 'submit':
//         return (
//           <div className="tab-content">
//             <div className="form-header-section">
//               <h2>Submit New Case Application</h2>
//               <p>Please provide accurate information about your family and property damage. All fields marked with (*) are required.</p>
              
//               {/* Data save info - No auto-save */}
//               <div className="save-info">
//                 <i className="fas fa-info-circle"></i>
//                 Your data will be saved when you submit the form. Please complete all sections before submitting.
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="family-form">
//               {/* Family Information Section */}
//               <div className="form-section">
//                 <div className="section-title">
//                   <i className="fas fa-users"></i>
//                   Family Information
//                 </div>
                
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Family Name *</label>
//                     <input
//                       type="text"
//                       name="familyName"
//                       value={familyData.familyName}
//                       onChange={handleInputChange}
//                       placeholder="Enter family surname"
//                       className={formErrors.familyName ? 'error' : ''}
//                     />
//                     {formErrors.familyName && <span className="error-text">{formErrors.familyName}</span>}
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Head of Household *</label>
//                     <input
//                       type="text"
//                       name="headOfHousehold"
//                       value={familyData.headOfHousehold}
//                       onChange={handleInputChange}
//                       placeholder="Full name of head of household"
//                       className={formErrors.headOfHousehold ? 'error' : ''}
//                     />
//                     {formErrors.headOfHousehold && <span className="error-text">{formErrors.headOfHousehold}</span>}
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Primary Phone Number *</label>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={familyData.phoneNumber}
//                       onChange={handleInputChange}
//                       placeholder="+961 XX XXX XXX"
//                       className={formErrors.phoneNumber ? 'error' : ''}
//                     />
//                     {formErrors.phoneNumber && <span className="error-text">{formErrors.phoneNumber}</span>}
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Alternate Phone Number</label>
//                     <input
//                       type="tel"
//                       name="alternatePhone"
//                       value={familyData.alternatePhone}
//                       onChange={handleInputChange}
//                       placeholder="+961 XX XXX XXX"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Email Address</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={familyData.email}
//                       onChange={handleInputChange}
//                       placeholder="your.email@example.com"
//                       className={formErrors.email ? 'error' : ''}
//                     />
//                     {formErrors.email && <span className="error-text">{formErrors.email}</span>}
//                   </div>
                  
//                   <div className="form-group">
//                     <label>National ID Number</label>
//                     <input
//                       type="text"
//                       name="nationalId"
//                       value={familyData.nationalId}
//                       onChange={handleInputChange}
//                       placeholder="Enter ID number"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Total Family Members *</label>
//                     <select
//                       name="numberOfMembers"
//                       value={familyData.numberOfMembers}
//                       onChange={handleInputChange}
//                       className={formErrors.numberOfMembers ? 'error' : ''}
//                     >
//                       <option value="">Select number of members</option>
//                       {[...Array(15)].map((_, i) => (
//                         <option key={i + 1} value={i + 1}>{i + 1} member{i > 0 ? 's' : ''}</option>
//                       ))}
//                     </select>
//                     {formErrors.numberOfMembers && <span className="error-text">{formErrors.numberOfMembers}</span>}
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Number of Children (under 18)</label>
//                     <select
//                       name="childrenCount"
//                       value={familyData.childrenCount}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Select number</option>
//                       {[...Array(10)].map((_, i) => (
//                         <option key={i} value={i}>{i}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Number of Elderly (over 65)</label>
//                     <select
//                       name="elderlyCount"
//                       value={familyData.elderlyCount}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Select number</option>
//                       {[...Array(5)].map((_, i) => (
//                         <option key={i} value={i}>{i}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Members with Special Needs</label>
//                     <select
//                       name="specialNeedsCount"
//                       value={familyData.specialNeedsCount}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Select number</option>
//                       {[...Array(5)].map((_, i) => (
//                         <option key={i} value={i}>{i}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Property Information Section */}
//               <div className="form-section">
//                 <div className="section-title">
//                   <i className="fas fa-home"></i>
//                   Property Information
//                 </div>

//                 <div className="form-group">
//                   <label>Village *</label>
//                   <select
//                     name="village"
//                     value={familyData.village}
//                     onChange={handleInputChange}
//                     className={formErrors.village ? 'error' : ''}
//                   >
//                     <option value="">Select your village</option>
//                     {southLebanonVillages.map(village => (
//                       <option key={village} value={village}>{village}</option>
//                     ))}
//                   </select>
//                   {formErrors.village && <span className="error-text">{formErrors.village}</span>}
//                 </div>

//                 <div className="form-group">
//                   <label>Current Address *</label>
//                   <textarea
//                     name="currentAddress"
//                     value={familyData.currentAddress}
//                     onChange={handleInputChange}
//                     placeholder="Where are you currently staying?"
//                     rows="2"
//                     className={formErrors.currentAddress ? 'error' : ''}
//                   />
//                   {formErrors.currentAddress && <span className="error-text">{formErrors.currentAddress}</span>}
//                 </div>

//                 <div className="form-group">
//                   <label>Original Property Address *</label>
//                   <textarea
//                     name="originalAddress"
//                     value={familyData.originalAddress}
//                     onChange={handleInputChange}
//                     placeholder="Full address of the destroyed property"
//                     rows="3"
//                     className={formErrors.originalAddress ? 'error' : ''}
//                   />
//                   {formErrors.originalAddress && <span className="error-text">{formErrors.originalAddress}</span>}
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Property Type</label>
//                     <select
//                       name="propertyType"
//                       value={familyData.propertyType}
//                       onChange={handleInputChange}
//                     >
//                       <option value="house">House</option>
//                       <option value="apartment">Apartment</option>
//                       <option value="villa">Villa</option>
//                       <option value="building">Building</option>
//                       <option value="commercial">Commercial Property</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Ownership Status</label>
//                     <select
//                       name="ownershipStatus"
//                       value={familyData.ownershipStatus}
//                       onChange={handleInputChange}
//                     >
//                       <option value="owned">Owned</option>
//                       <option value="rented">Rented</option>
//                       <option value="family_owned">Family Owned</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label>Estimated Property Value (before destruction)</label>
//                   <input
//                     type="number"
//                     name="propertyValue"
//                     value={familyData.propertyValue}
//                     onChange={handleInputChange}
//                     placeholder="Amount in USD"
//                     min="0"
//                   />
//                 </div>
//               </div>

//               {/* Destruction Assessment Section */}
//               <div className="form-section">
//                 <div className="section-title">
//                   <i className="fas fa-exclamation-triangle"></i>
//                   Destruction Assessment
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Date of Destruction *</label>
//                     <input
//                       type="date"
//                       name="destructionDate"
//                       value={familyData.destructionDate}
//                       onChange={handleInputChange}
//                       className={formErrors.destructionDate ? 'error' : ''}
//                     />
//                     {formErrors.destructionDate && <span className="error-text">{formErrors.destructionDate}</span>}
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Cause of Destruction</label>
//                     <select
//                       name="destructionCause"
//                       value={familyData.destructionCause}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Select cause</option>
//                       <option value="airstrike">Airstrike</option>
//                       <option value="artillery">Artillery</option>
//                       <option value="ground_combat">Ground Combat</option>
//                       <option value="explosion">Explosion</option>
//                       <option value="fire">Fire</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label>Estimated Destruction Percentage *</label>
//                   <div className="percentage-input">
//                     <input
//                       type="number"
//                       name="destructionPercentage"
//                       value={familyData.destructionPercentage}
//                       onChange={handleInputChange}
//                       placeholder="0"
//                       min="0"
//                       max="100"
//                       className={formErrors.destructionPercentage ? 'error' : ''}
//                     />
//                     <span className="percentage-symbol">%</span>
//                   </div>
//                   {formErrors.destructionPercentage && <span className="error-text">{formErrors.destructionPercentage}</span>}
//                   <small className="help-text">
//                     0% = No damage, 25% = Minor damage, 50% = Moderate damage, 75% = Severe damage, 100% = Complete destruction
//                   </small>
//                 </div>

//                 <div className="form-group">
//                   <label>Detailed Damage Description *</label>
//                   <textarea
//                     name="damageDescription"
//                     value={familyData.damageDescription}
//                     onChange={handleInputChange}
//                     placeholder="Please describe the damage in detail. Include information about which parts of the property were affected, what was destroyed or damaged, and any other relevant details."
//                     rows="5"
//                     className={formErrors.damageDescription ? 'error' : ''}
//                   />
//                   {formErrors.damageDescription && <span className="error-text">{formErrors.damageDescription}</span>}
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Previously Received Aid</label>
//                     <select
//                       name="previouslyReceivedAid"
//                       value={familyData.previouslyReceivedAid}
//                       onChange={handleInputChange}
//                     >
//                       <option value="no">No</option>
//                       <option value="yes">Yes</option>
//                     </select>
//                   </div>
                  
//                   {familyData.previouslyReceivedAid === 'yes' && (
//                     <div className="form-group">
//                       <label>Aid Details</label>
//                       <textarea
//                         name="aidDetails"
//                         value={familyData.aidDetails}
//                         onChange={handleInputChange}
//                         placeholder="Please describe the aid received, from which organization, and when"
//                         rows="3"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Supporting Information Section */}
//               <div className="form-section">
//                 <div className="section-title">
//                   <i className="fas fa-user-friends"></i>
//                   Supporting Information
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Witness Name</label>
//                     <input
//                       type="text"
//                       name="witnessName"
//                       value={familyData.witnessName}
//                       onChange={handleInputChange}
//                       placeholder="Name of someone who can verify the damage"
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Witness Phone</label>
//                     <input
//                       type="tel"
//                       name="witnessPhone"
//                       value={familyData.witnessPhone}
//                       onChange={handleInputChange}
//                       placeholder="+961 XX XXX XXX"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Emergency Contact Name</label>
//                     <input
//                       type="text"
//                       name="emergencyContact"
//                       value={familyData.emergencyContact}
//                       onChange={handleInputChange}
//                       placeholder="Name of emergency contact person"
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Emergency Contact Phone</label>
//                     <input
//                       type="tel"
//                       name="emergencyPhone"
//                       value={familyData.emergencyPhone}
//                       onChange={handleInputChange}
//                       placeholder="+961 XX XXX XXX"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* File Upload Section */}
//               <div className="form-section">
//                 <div className="section-title">
//                   <i className="fas fa-cloud-upload-alt"></i>
//                   Evidence Upload
//                 </div>
                
//                 <div className="upload-instructions">
//                   <p>Please upload photos and documents as evidence of the property damage. Accepted formats: JPG, PNG, PDF, HEIC. Maximum file size: 10MB per file.</p>
//                   <ul>
//                     <li>Photos of the damaged property (before and after if available)</li>
//                     <li>Property ownership documents</li>
//                     <li>National ID or passport</li>
//                     <li>Any official damage assessment reports</li>
//                     <li>Insurance documents (if applicable)</li>
//                   </ul>
//                 </div>

//                 <div className="file-upload-area">
//                   <div className="file-upload-box">
//                     <input
//                       type="file"
//                       multiple
//                       onChange={handleFileUpload}
//                       accept="image/*,.pdf"
//                       id="file-upload"
//                     />
//                     <label htmlFor="file-upload">
//                       <i className="fas fa-cloud-upload-alt"></i>
//                       <p>Click to upload files or drag and drop</p>
//                       <small>JPG, PNG, PDF up to 10MB each</small>
//                     </label>
//                   </div>
//                 </div>

//                 {formErrors.files && <span className="error-text">{formErrors.files}</span>}

//                 {/* Uploaded Files Display */}
//                 {uploadedFiles.length > 0 && (
//                   <div className="uploaded-files">
//                     <h4>Uploaded Files ({uploadedFiles.length})</h4>
//                     <div className="files-grid">
//                       {uploadedFiles.map(file => (
//                         <div key={file.id} className="file-item">
//                           <div className="file-header">
//                             <div className="file-icon">
//                               <i className={file.type.includes('image') ? 'fas fa-image' : 'fas fa-file-pdf'}></i>
//                             </div>
//                             <div className="file-info">
//                               <h5>{file.name}</h5>
//                               <p>{formatFileSize(file.size)}</p>
//                             </div>
//                             <button
//                               type="button"
//                               className="remove-file"
//                               onClick={() => removeFile(file.id)}
//                             >
//                               <i className="fas fa-times"></i>
//                             </button>
//                           </div>
                          
//                           <div className="file-details">
//                             <div className="form-group">
//                               <label>Category</label>
//                               <select
//                                 value={file.category}
//                                 onChange={(e) => updateFileInfo(file.id, 'category', e.target.value)}
//                               >
//                                 <option value="uncategorized">Select category</option>
//                                 <option value="property_damage">Property Damage Photos</option>
//                                 <option value="before_photos">Before Destruction Photos</option>
//                                 <option value="ownership_documents">Ownership Documents</option>
//                                 <option value="identification">ID Documents</option>
//                                 <option value="official_reports">Official Reports</option>
//                                 <option value="insurance">Insurance Documents</option>
//                                 <option value="other">Other</option>
//                               </select>
//                             </div>
                            
//                             <div className="form-group">
//                               <label>Description</label>
//                               <input
//                                 type="text"
//                                 value={file.description}
//                                 onChange={(e) => updateFileInfo(file.id, 'description', e.target.value)}
//                                 placeholder="Brief description of this file"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <div className="form-actions">
//                 <button 
//                   type="submit" 
//                   className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
//                   disabled={isSubmitting}
//                 >
//                   <i className="fas fa-paper-plane"></i>
//                   {isSubmitting ? 'Submitting Case...' : 'Submit Case & Send to Checker'}
//                 </button>
                
//                 <button 
//                   type="button" 
//                   className="save-draft-btn"
//                   onClick={handleManualSave}
//                   disabled={isSaving}
//                 >
//                   <i className="fas fa-save"></i>
//                   {isSaving ? 'Saving...' : 'Save Draft'}
//                 </button>
                
//                 <p className="submit-notice">
//                   By submitting this form, you confirm that all information provided is accurate and complete. 
//                   The case will be sent to our checker for review.
//                 </p>
//               </div>
//             </form>
//           </div>
//         );
        
//       case 'documents':
//         return (
//           <div className="tab-content">
//             <h2>My Documents</h2>
//             <div className="documents-overview">
//               <p>View and manage all uploaded documents for your case.</p>
              
//               {uploadedFiles.length === 0 ? (
//                 <div className="no-documents">
//                   <i className="fas fa-folder-open"></i>
//                   <h3>No documents uploaded yet</h3>
//                   <p>Go to the "Submit Case" tab to upload your evidence documents.</p>
//                 </div>
//               ) : (
//                 <div className="documents-grid">
//                   {uploadedFiles.map(file => (
//                     <div key={file.id} className="document-card">
//                       <div className="doc-icon">
//                         <i className={file.type.includes('image') ? 'fas fa-image' : 'fas fa-file-pdf'}></i>
//                       </div>
//                       <div className="doc-info">
//                         <h4>{file.name}</h4>
//                         <p>Category: {file.category}</p>
//                         <p>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</p>
//                         <p>Size: {formatFileSize(file.size)}</p>
//                         {file.description && <p>Description: {file.description}</p>}
//                       </div>
//                       <div className="doc-actions">
//                         <button 
//                           className="view-btn"
//                           onClick={() => {
//                             if (file.base64) {
//                               const newWindow = window.open();
//                               if (file.type.includes('image')) {
//                                 newWindow.document.write(`<img src="${file.base64}" style="max-width:100%;height:auto;" />`);
//                               } else {
//                                 newWindow.location.href = file.base64;
//                               }
//                             }
//                           }}
//                         >
//                           View
//                         </button>
//                         <button 
//                           className="download-btn"
//                           onClick={() => {
//                             if (file.base64) {
//                               const link = document.createElement('a');
//                               link.href = file.base64;
//                               link.download = file.name;
//                               link.click();
//                             }
//                           }}
//                         >
//                           Download
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case 'data':
//         return (
//           <div className="tab-content">
//             <h2>Data Management</h2>
//             <div className="data-management">
//               <div className="data-info">
//                 <h3>Storage Information</h3>
//                 <p>Your case data is saved to your browser's local storage in JSON format when you submit the form.</p>
                
//                 <div className="data-stats">
//                   <div className="data-stat">
//                     <strong>Case ID:</strong> {caseData?.caseId || 'Not assigned'}
//                   </div>
//                   <div className="data-stat">
//                     <strong>Last Saved:</strong> {lastSaved ? lastSaved.toLocaleString() : 'Never'}
//                   </div>
//                   <div className="data-stat">
//                     <strong>Data Size:</strong> {caseData ? Math.round(JSON.stringify(caseData).length / 1024) : 0} KB
//                   </div>
//                   <div className="data-stat">
//                     <strong>Status:</strong> {caseData?.status || 'No data'}
//                   </div>
//                 </div>
//               </div>

//               <div className="data-actions-section">
//                 <h3>Data Actions</h3>
//                 <div className="action-buttons">
//                   <button className="action-btn" onClick={handleManualSave} disabled={isSaving}>
//                     <i className="fas fa-save"></i>
//                     {isSaving ? 'Saving...' : 'Save Current Data'}
//                   </button>
                  
//                   <button className="action-btn secondary" onClick={exportCaseData} disabled={!caseData}>
//                     <i className="fas fa-download"></i>
//                     Export as JSON
//                   </button>
                  
//                   <button 
//                     className="action-btn danger" 
//                     onClick={() => {
//                       if (window.confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
//                         localStorage.removeItem(getStorageKey());
//                         localStorage.removeItem(getStorageKey('cases'));
//                         window.location.reload();
//                       }
//                     }}
//                   >
//                     <i className="fas fa-trash"></i>
//                     Clear All Data
//                   </button>
//                 </div>
//               </div>

//               {caseData && (
//                 <div className="data-preview">
//                   <h3>Data Preview</h3>
//                   <pre className="json-preview">
//                     {JSON.stringify(caseData, null, 2)}
//                   </pre>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
        
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="dashboard-page">
//       <Navbar />
//       <div className="dashboard-container">
//         <div className="dashboard-sidebar">
//           <div className="user-info">
//             <div className="user-avatar">
//               <i className="fas fa-users"></i>
//             </div>
//             <h3>{familyData.familyName || user?.firstName || 'Family Name'}</h3>
//             <p className="user-type">Family/Victim</p>
//             {caseData?.caseId && (
//               <p className="case-id">ID: {caseData.caseId}</p>
//             )}
//           </div>
          
//           <nav className="dashboard-nav">
//             <button 
//               className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
//               onClick={() => setActiveTab('overview')}
//             >
//               <i className="fas fa-tachometer-alt"></i>
//               Overview
//             </button>
//             <button 
//               className={`nav-btn ${activeTab === 'submit' ? 'active' : ''}`}
//               onClick={() => setActiveTab('submit')}
//             >
//               <i className="fas fa-plus"></i>
//               Submit Case
//             </button>
//             <button 
//               className={`nav-btn ${activeTab === 'documents' ? 'active' : ''}`}
//               onClick={() => setActiveTab('documents')}
//             >
//               <i className="fas fa-folder"></i>
//               My Documents
//             </button>
//             <button 
//               className={`nav-btn ${activeTab === 'data' ? 'active' : ''}`}
//               onClick={() => setActiveTab('data')}
//             >
//               <i className="fas fa-database"></i>
//               Data Management
//             </button>
//           </nav>
          
//           <div className="sidebar-footer">
//             <Link to="/" className="logout-btn">
//               <i className="fas fa-sign-out-alt"></i>
//               Back to Home
//             </Link>
//           </div>
//         </div>
        
//         <div className="dashboard-main">
//           {renderTabContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FamilyDashboard; 
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import Navbar from '../components/Navbar';
import './FamilyDashboard.css';

const FamilyDashboard = () => {
  const { user } = useAuth();
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
    village: '',
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
    previouslyReceivedAid: 'no',
    aidDetails: '',
    
    // Supporting Information
    witnessName: '',
    witnessPhone: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [caseStatus, setCaseStatus] = useState(null);

  // South Lebanon Villages - Same as Family Form
  const southLebanonVillages = [
    'Ain Baal', 'Abra', 'Adchit', 'Adloun', 'Aita al-Shaab', 'Aita az-Zut',
    'Al-Bazouriye', 'Al-Khiyam', 'Al-Mansouri', 'Al-Taybe', 'Alma ash-Shaab',
    'Ansar', 'Arabsalim', 'Arnoun', 'Bafliyeh', 'Bani Hayyan', 'Barish',
    'Bayt Yahoun', 'Bazouriye', 'Bint Jbeil', 'Blida', 'Borj ash-Shamali',
    'Borj el-Muluk', 'Burghuz', 'Chamaa', 'Chaqra', 'Chehabiyeh', 'Chihine',
    'Deir Mimas', 'Deir Qanoun an-Nahr', 'Deir Seriane', 'Dhayra', 'Ebba',
    'Ein el-Delb', 'El-Adousiye', 'El-Bassatine', 'El-Khiam', 'El-Mansouri',
    'El-Qantara', 'Ghandouriye', 'Haddatha', 'Hanaway', 'Haris', 'Harouf',
    'Houla', 'Jbal as-Saghir', 'Jezzine', 'Jibbain', 'Kafra', 'Kfar Dounin',
    'Kfar Kila', 'Kfar Melki', 'Kfar Roummane', 'Kfar Shuba', 'Kfar Tibnit',
    'Khallet Wardeh', 'Khiam', 'Khirbet Selm', 'Kounine', 'Ksour', 'Majdal Zoun',
    'Marjayoun', 'Maroun ar-Ras', 'Mays al-Jabal', 'Meiss ej-Jabal', 'Metulla',
    'Nabatiye', 'Odaisseh', 'Qana', 'Qantara', 'Qlayle', 'Qlayaa', 'Qouzah',
    'Rachaya al-Fukhar', 'Ramyeh', 'Ras al-Biyyadah', 'Rmadiyeh', 'Rmeish',
    'Rshaf', 'Saida', 'Sajad', 'Sarba', 'Shaqra', 'Sreifa', 'Tayr Harfa',
    'Tayr Dibba', 'Tebnine', 'Tyre', 'Yaroun', 'Yateri', 'Zawtar ash-Sharqiye'
  ];

  // Generate unique case ID
  const generateCaseId = () => {
    return `SLA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  };

  // Data storage utility functions
  const getStorageKey = (suffix = '') => {
    return `familyCase_${user?.id || 'guest'}${suffix ? '_' + suffix : ''}`;
  };

  // Save data to localStorage in JSON format
  const saveToStorage = useCallback(async (data, type = 'draft') => {
    setIsSaving(true);
    try {
      const storageData = {
        userId: user?.id,
        userEmail: user?.email,
        caseId: caseData?.caseId || generateCaseId(),
        status: type,
        familyData: data,
        uploadedFiles: uploadedFiles.map(file => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          category: file.category,
          description: file.description,
          uploadDate: file.uploadDate,
          base64: file.base64,
          checksum: file.checksum
        })),
        timestamps: {
          created: caseData?.timestamps?.created || new Date().toISOString(),
          lastModified: new Date().toISOString(),
          submitted: type === 'submitted' ? new Date().toISOString() : caseData?.timestamps?.submitted
        },
        metadata: {
          version: '1.0',
          source: 'family_dashboard',
          formCompletion: calculateFormCompletion(data),
          totalFiles: uploadedFiles.length
        }
      };

      localStorage.setItem(getStorageKey(), JSON.stringify(storageData));
      
      const existingCases = JSON.parse(localStorage.getItem(getStorageKey('cases')) || '[]');
      const caseIndex = existingCases.findIndex(c => c.caseId === storageData.caseId);
      
      if (caseIndex >= 0) {
        existingCases[caseIndex] = {
          caseId: storageData.caseId,
          status: storageData.status,
          lastModified: storageData.timestamps.lastModified,
          familyName: data.familyName,
          submittedDate: storageData.timestamps.submitted
        };
      } else {
        existingCases.push({
          caseId: storageData.caseId,
          status: storageData.status,
          lastModified: storageData.timestamps.lastModified,
          familyName: data.familyName,
          submittedDate: storageData.timestamps.submitted
        });
      }
      
      localStorage.setItem(getStorageKey('cases'), JSON.stringify(existingCases));
      setCaseData(storageData);
      setLastSaved(new Date());
      
      console.log('Data saved to localStorage:', storageData);
      return storageData;
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, user?.email, uploadedFiles, caseData]);

  // Load data from localStorage
  const loadFromStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem(getStorageKey());
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFamilyData(parsedData.familyData || {});
        setUploadedFiles(parsedData.uploadedFiles || []);
        setCaseData(parsedData);
        setLastSaved(new Date(parsedData.timestamps?.lastModified));
        
        // Check for case status updates
        updateCaseStatus(parsedData);
        
        console.log('Data loaded from localStorage:', parsedData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [user?.id]);

  // Update case status based on checker decisions
  const updateCaseStatus = (data) => {
    const status = {
      status: 'Draft',
      submittedDate: '-',
      caseId: data?.caseId || 'Not assigned',
      progress: calculateFormCompletion(data?.familyData || familyData)
    };

    if (data?.status === 'submitted') {
      status.status = 'Under Review';
      status.submittedDate = data.timestamps?.submitted ? new Date(data.timestamps.submitted).toLocaleDateString() : '-';
    } else if (data?.status === 'approved') {
      status.status = 'Approved';
      status.submittedDate = data.timestamps?.submitted ? new Date(data.timestamps.submitted).toLocaleDateString() : '-';
      status.approvalDetails = {
        finalDamagePercentage: data.finalDamagePercentage,
        estimatedCost: data.estimatedCost,
        checkerComments: data.checkerDecision?.comments
      };
    } else if (data?.status === 'rejected') {
      status.status = 'Rejected';
      status.submittedDate = data.timestamps?.submitted ? new Date(data.timestamps.submitted).toLocaleDateString() : '-';
      status.rejectionReason = data.checkerDecision?.comments;
    }

    setCaseStatus(status);
  };

  // Calculate form completion percentage
  const calculateFormCompletion = (data) => {
    const requiredFields = [
      'familyName', 'headOfHousehold', 'phoneNumber', 'numberOfMembers',
      'village', 'currentAddress', 'originalAddress', 'destructionDate', 'destructionPercentage',
      'damageDescription'
    ];
    
    const completedFields = requiredFields.filter(field => data[field] && data[field].toString().trim() !== '');
    const basicCompletion = (completedFields.length / requiredFields.length) * 80;
    const fileCompletion = uploadedFiles.length > 0 ? 20 : 0;
    
    return Math.round(basicCompletion + fileCompletion);
  };

  // Load data on component mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Initialize with user data if available
  useEffect(() => {
    if (user && !familyData.email) {
      setFamilyData(prev => ({
        ...prev,
        email: user.email || '',
        headOfHousehold: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
        phoneNumber: user.phone || ''
      }));
    }
  }, [user, familyData.email]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFamilyData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file upload with base64 encoding for storage
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024;
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

    const processedFiles = await Promise.all(validFiles.map(async (file) => {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      return {
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        category: 'uncategorized',
        description: '',
        base64: base64,
        checksum: btoa(file.name + file.size + file.lastModified)
      };
    }));

    setUploadedFiles(prev => [...prev, ...processedFiles]);
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
    
    const requiredFields = [
      'familyName', 'headOfHousehold', 'phoneNumber', 'numberOfMembers',
      'village', 'currentAddress', 'originalAddress', 'destructionDate', 'destructionPercentage',
      'damageDescription'
    ];
    
    requiredFields.forEach(field => {
      if (!familyData[field] || familyData[field].toString().trim() === '') {
        errors[field] = 'This field is required';
      }
    });

    if (familyData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(familyData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (familyData.phoneNumber && !/^\+?[\d\s-()]{8,}$/.test(familyData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (familyData.destructionPercentage && (
      isNaN(familyData.destructionPercentage) || 
      familyData.destructionPercentage < 0 || 
      familyData.destructionPercentage > 100
    )) {
      errors.destructionPercentage = 'Please enter a percentage between 0 and 100';
    }

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
      const submittedData = await saveToStorage(familyData, 'submitted');
      
      const submissionReport = {
        ...submittedData,
        submissionSummary: {
          totalFields: Object.keys(familyData).length,
          completedFields: Object.values(familyData).filter(val => val !== '').length,
          totalFiles: uploadedFiles.length,
          categorizedFiles: uploadedFiles.filter(f => f.category !== 'uncategorized').length
        }
      };

      console.log('Case submitted successfully:', submissionReport);
      
      localStorage.setItem(
        getStorageKey('submission_report'), 
        JSON.stringify(submissionReport)
      );

      localStorage.setItem('pendingCaseReview', JSON.stringify({
        caseId: submittedData.caseId,
        status: 'Under Review',
        submittedDate: new Date().toLocaleDateString(),
        priority: 'High',
        familyData: {
          ...familyData,
          submittedBy: user?.firstName + ' ' + user?.lastName || 'Unknown',
          submissionTime: new Date().toISOString()
        }
      }));
      
      alert(`Case submitted successfully! Your Case ID is: ${submittedData.caseId}\n\nThe case has been sent to our checker for review.`);
      
      setActiveTab('overview');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual save function
  const handleManualSave = async () => {
    try {
      await saveToStorage(familyData, caseData?.status || 'draft');
      alert('Data saved successfully!');
    } catch (error) {
      alert('Error saving data. Please try again.');
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
              <h2>Welcome, {familyData.familyName || user?.firstName || 'Family'}</h2>
              <p>Track your case status and manage your information</p>
              
              {lastSaved && (
                <div className="save-status">
                  <span className="saved">
                    <i className="fas fa-check-circle"></i>
                    Last saved: {lastSaved.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="stat-info">
                  <h3>Case Status</h3>
                  <p className={`stat-value status-${caseStatus?.status.toLowerCase().replace(' ', '-')}`}>
                    {caseStatus?.status || 'Draft'}
                  </p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar"></i>
                </div>
                <div className="stat-info">
                  <h3>Submitted</h3>
                  <p className="stat-value">{caseStatus?.submittedDate || '-'}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-hashtag"></i>
                </div>
                <div className="stat-info">
                  <h3>Case ID</h3>
                  <p className="stat-value">{caseStatus?.caseId || 'Not assigned'}</p>
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
              <h3>Application Progress</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${caseStatus?.progress || 0}%`}}
                ></div>
              </div>
              <p>{caseStatus?.progress || 0}% Complete</p>
              
              {familyData.village && (
                <div className="village-info-section">
                  <h4>Selected Village</h4>
                  <div className="village-display">
                    <i className="fas fa-map-marker-alt"></i>
                    <span className="village-name">{familyData.village}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Case Status Notifications */}
            {caseStatus?.status === 'Approved' && (
              <div className="status-notification approved">
                <div className="notification-header">
                  <i className="fas fa-check-circle"></i>
                  <h3>Case Approved!</h3>
                </div>
                <div className="notification-content">
                  <p>Congratulations! Your case has been approved and is now available for funding.</p>
                  <div className="approval-details">
                    <div className="detail-item">
                      <strong>Final Damage Assessment:</strong> {caseStatus.approvalDetails?.finalDamagePercentage}%
                    </div>
                    <div className="detail-item">
                      <strong>Estimated Rebuild Cost:</strong> ${parseInt(caseStatus.approvalDetails?.estimatedCost || 0).toLocaleString()}
                    </div>
                    {caseStatus.approvalDetails?.checkerComments && (
                      <div className="detail-item">
                        <strong>Checker Comments:</strong> {caseStatus.approvalDetails.checkerComments}
                      </div>
                    )}
                  </div>
                  <div className="notification-actions">
                    <Link to="/donor-dashboard" className="action-btn">
                      <i className="fas fa-heart"></i>
                      View in Donor Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {caseStatus?.status === 'Rejected' && (
              <div className="status-notification rejected">
                <div className="notification-header">
                  <i className="fas fa-times-circle"></i>
                  <h3>Case Rejected</h3>
                </div>
                <div className="notification-content">
                  <p>Unfortunately, your case has been rejected by our checker.</p>
                  <div className="rejection-details">
                    <div className="detail-item">
                      <strong>Reason:</strong> {caseStatus.rejectionReason}
                    </div>
                  </div>
                  <div className="notification-actions">
                    <button 
                      className="action-btn secondary"
                      onClick={() => setActiveTab('submit')}
                    >
                      <i className="fas fa-edit"></i>
                      Update & Resubmit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'submit':
        return (
          <div className="tab-content">
            <div className="form-header-section">
              <h2>Submit New Case Application</h2>
              <p>Please provide accurate information about your family and property damage. All fields marked with (*) are required.</p>
              
              <div className="save-info">
                <i className="fas fa-info-circle"></i>
                Your data will be saved when you submit the form. Please complete all sections before submitting.
              </div>
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
                </div>
              </div>

              {/* Property Information Section */}
              <div className="form-section">
                <div className="section-title">
                  <i className="fas fa-home"></i>
                  Property Information
                </div>

                <div className="form-group">
                  <label>Village *</label>
                  <select
                    name="village"
                    value={familyData.village}
                    onChange={handleInputChange}
                    className={formErrors.village ? 'error' : ''}
                  >
                    <option value="">Select your village</option>
                    {southLebanonVillages.map(village => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </select>
                  {formErrors.village && <span className="error-text">{formErrors.village}</span>}
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
                </div>

                <div className="form-group">
                  <label>Detailed Damage Description *</label>
                  <textarea
                    name="damageDescription"
                    value={familyData.damageDescription}
                    onChange={handleInputChange}
                    placeholder="Please describe the damage in detail..."
                    rows="5"
                    className={formErrors.damageDescription ? 'error' : ''}
                  />
                  {formErrors.damageDescription && <span className="error-text">{formErrors.damageDescription}</span>}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="form-section">
                <div className="section-title">
                  <i className="fas fa-cloud-upload-alt"></i>
                  Evidence Upload
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
                                <option value="other">Other</option>
                              </select>
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
                  {isSubmitting ? 'Submitting Case...' : 'Submit Case'}
                </button>
                
                <button 
                  type="button" 
                  className="save-draft-btn"
                  onClick={handleManualSave}
                  disabled={isSaving}
                >
                  <i className="fas fa-save"></i>
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
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
                        <p>Size: {formatFileSize(file.size)}</p>
                      </div>
                      <div className="doc-actions">
                        <button 
                          className="view-btn"
                          onClick={() => {
                            if (file.base64) {
                              const newWindow = window.open();
                              if (file.type.includes('image')) {
                                newWindow.document.write(`<img src="${file.base64}" style="max-width:100%;height:auto;" />`);
                              } else {
                                newWindow.location.href = file.base64;
                              }
                            }
                          }}
                        >
                          View
                        </button>
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
            <h3>{familyData.familyName || user?.firstName || 'Family Name'}</h3>
            <p className="user-type">Family/Victim</p>
            {caseData?.caseId && (
              <p className="case-id">ID: {caseData.caseId}</p>
            )}
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