import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import Modal from '../components/Modal.jsx';
import '../styles/components.css';

const SurveyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    villageName: '',
    population: '',
    hasElectricity: false,
    hasWaterSupply: false,
    hasRoadConnectivity: false,
    schoolsCount: '',
    hospitalsCount: '',
    totalLandArea: '',
    cultivatedLand: '',
    mainCrops: [],
    irrigationMethods: [],
    issues: [],
    recommendations: '',
    challenges: [],
    suggestions: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      loadSurvey();
    }
  }, [id]);

  const loadSurvey = () => {
    const survey = api.getSurveyById(id);
    if (survey) {
      setFormData({
        title: survey.title || '',
        description: survey.description || '',
        ...survey.formData
      });
    } else {
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'hasElectricity' || name === 'hasWaterSupply' || name === 'hasRoadConnectivity') {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      } else {
        // Handle multi-select checkboxes
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.villageName.trim()) newErrors.villageName = 'Village name is required';
    if (!formData.population.trim()) newErrors.population = 'Population is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const surveyData = {
        title: formData.title,
        description: formData.description,
        createdBy: user.username,
        formData: {
          villageName: formData.villageName,
          population: formData.population,
          hasElectricity: formData.hasElectricity,
          hasWaterSupply: formData.hasWaterSupply,
          hasRoadConnectivity: formData.hasRoadConnectivity,
          schoolsCount: formData.schoolsCount,
          hospitalsCount: formData.hospitalsCount,
          totalLandArea: formData.totalLandArea,
          cultivatedLand: formData.cultivatedLand,
          mainCrops: formData.mainCrops,
          irrigationMethods: formData.irrigationMethods,
          issues: formData.issues,
          recommendations: formData.recommendations,
          challenges: formData.challenges,
          suggestions: formData.suggestions
        }
      };

      if (isEdit) {
        await api.updateSurvey(id, { ...surveyData, status: 'draft' });
      } else {
        await api.createSurvey(surveyData);
      }
      
      setShowSaveModal(true);
    } catch (error) {
      console.error('Error saving survey:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const surveyData = {
        title: formData.title,
        description: formData.description,
        createdBy: user.username,
        status: 'submitted',
        formData: {
          villageName: formData.villageName,
          population: formData.population,
          hasElectricity: formData.hasElectricity,
          hasWaterSupply: formData.hasWaterSupply,
          hasRoadConnectivity: formData.hasRoadConnectivity,
          schoolsCount: formData.schoolsCount,
          hospitalsCount: formData.hospitalsCount,
          totalLandArea: formData.totalLandArea,
          cultivatedLand: formData.cultivatedLand,
          mainCrops: formData.mainCrops,
          irrigationMethods: formData.irrigationMethods,
          issues: formData.issues,
          recommendations: formData.recommendations,
          challenges: formData.challenges,
          suggestions: formData.suggestions
        }
      };

      if (isEdit) {
        await api.updateSurvey(id, surveyData);
      } else {
        await api.createSurvey(surveyData);
      }
      
      setShowSubmitModal(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSaveModal(false);
    setShowSubmitModal(false);
    navigate('/dashboard');
  };

  const checkboxOptions = {
    mainCrops: ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Pulses', 'Oilseeds', 'Vegetables'],
    irrigationMethods: ['Tube well', 'Canal', 'River', 'Pond', 'Drip irrigation', 'Sprinkler'],
    issues: ['Water quality', 'Electricity shortage', 'Road conditions', 'Healthcare access', 'Education facilities', 'Sanitation'],
    challenges: ['Water scarcity', 'Pesticide costs', 'Market access', 'Climate change', 'Labor shortage', 'Technology adoption']
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="page-header">
          <div className="flex-container justify-content-between align-items-center">
            <div>
              <h1 className="page-title">
                {isEdit ? 'Edit Survey' : 'Create New Survey'}
              </h1>
              <p className="page-subtitle">
                {isEdit ? 'Update your survey information' : 'Fill out the survey form with village details'}
              </p>
            </div>
            <Link to="/dashboard" className="btn btn-outline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <form className="survey-form">
          {/* Basic Information */}
          <div className="survey-section">
            <h3 className="survey-section-title">Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Survey Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter survey title"
              />
              {errors.title && (
                <div className="text-danger" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.title}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the purpose of this survey"
                rows="3"
              />
              {errors.description && (
                <div className="text-danger" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.description}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="villageName" className="form-label">
                    Village Name *
                  </label>
                  <input
                    type="text"
                    id="villageName"
                    name="villageName"
                    className="form-control"
                    value={formData.villageName}
                    onChange={handleChange}
                    placeholder="Enter village name"
                  />
                  {errors.villageName && (
                    <div className="text-danger" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.villageName}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="population" className="form-label">
                    Population *
                  </label>
                  <input
                    type="number"
                    id="population"
                    name="population"
                    className="form-control"
                    value={formData.population}
                    onChange={handleChange}
                    placeholder="Enter population"
                  />
                  {errors.population && (
                    <div className="text-danger" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.population}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="survey-section">
            <h3 className="survey-section-title">Infrastructure</h3>
            
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="hasElectricity"
                  name="hasElectricity"
                  checked={formData.hasElectricity}
                  onChange={handleChange}
                />
                <label htmlFor="hasElectricity">Has Electricity</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="hasWaterSupply"
                  name="hasWaterSupply"
                  checked={formData.hasWaterSupply}
                  onChange={handleChange}
                />
                <label htmlFor="hasWaterSupply">Has Water Supply</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="hasRoadConnectivity"
                  name="hasRoadConnectivity"
                  checked={formData.hasRoadConnectivity}
                  onChange={handleChange}
                />
                <label htmlFor="hasRoadConnectivity">Has Road Connectivity</label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="schoolsCount" className="form-label">
                    Number of Schools
                  </label>
                  <input
                    type="number"
                    id="schoolsCount"
                    name="schoolsCount"
                    className="form-control"
                    value={formData.schoolsCount}
                    onChange={handleChange}
                    placeholder="Enter number of schools"
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="hospitalsCount" className="form-label">
                    Number of Hospitals/Clinics
                  </label>
                  <input
                    type="number"
                    id="hospitalsCount"
                    name="hospitalsCount"
                    className="form-control"
                    value={formData.hospitalsCount}
                    onChange={handleChange}
                    placeholder="Enter number of hospitals"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Agriculture (Optional) */}
          <div className="survey-section">
            <h3 className="survey-section-title">Agriculture Information</h3>
            
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="totalLandArea" className="form-label">
                    Total Land Area (acres)
                  </label>
                  <input
                    type="number"
                    id="totalLandArea"
                    name="totalLandArea"
                    className="form-control"
                    value={formData.totalLandArea}
                    onChange={handleChange}
                    placeholder="Enter total land area"
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="cultivatedLand" className="form-label">
                    Cultivated Land (acres)
                  </label>
                  <input
                    type="number"
                    id="cultivatedLand"
                    name="cultivatedLand"
                    className="form-control"
                    value={formData.cultivatedLand}
                    onChange={handleChange}
                    placeholder="Enter cultivated land area"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Main Crops</label>
              <div className="checkbox-group">
                {checkboxOptions.mainCrops.map(crop => (
                  <div key={crop} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`crop_${crop}`}
                      name="mainCrops"
                      value={crop}
                      checked={formData.mainCrops.includes(crop)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`crop_${crop}`}>{crop}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Irrigation Methods</label>
              <div className="checkbox-group">
                {checkboxOptions.irrigationMethods.map(method => (
                  <div key={method} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`irrigation_${method}`}
                      name="irrigationMethods"
                      value={method}
                      checked={formData.irrigationMethods.includes(method)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`irrigation_${method}`}>{method}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Issues and Challenges */}
          <div className="survey-section">
            <h3 className="survey-section-title">Issues and Challenges</h3>
            
            <div className="form-group">
              <label className="form-label">Current Issues</label>
              <div className="checkbox-group">
                {checkboxOptions.issues.map(issue => (
                  <div key={issue} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`issue_${issue}`}
                      name="issues"
                      value={issue}
                      checked={formData.issues.includes(issue)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`issue_${issue}`}>{issue}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Agricultural Challenges</label>
              <div className="checkbox-group">
                {checkboxOptions.challenges.map(challenge => (
                  <div key={challenge} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`challenge_${challenge}`}
                      name="challenges"
                      value={challenge}
                      checked={formData.challenges.includes(challenge)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`challenge_${challenge}`}>{challenge}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="survey-section">
            <h3 className="survey-section-title">Recommendations</h3>
            
            <div className="form-group">
              <label htmlFor="recommendations" className="form-label">
                General Recommendations
              </label>
              <textarea
                id="recommendations"
                name="recommendations"
                className="form-control"
                value={formData.recommendations}
                onChange={handleChange}
                placeholder="Provide recommendations for village development"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="suggestions" className="form-label">
                Agricultural Suggestions
              </label>
              <textarea
                id="suggestions"
                name="suggestions"
                className="form-control"
                value={formData.suggestions}
                onChange={handleChange}
                placeholder="Provide suggestions for agricultural improvement"
                rows="4"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-container justify-content-between">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn btn-outline"
              disabled={saving}
            >
              {saving ? (
                <span>
                  <span className="spinner"></span> Saving...
                </span>
              ) : (
                'Save Draft'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner"></span> Submitting...
                </span>
              ) : (
                'Submit Survey'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Save Draft Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={handleModalClose}
        title="Draft Saved"
        size="small"
      >
        <p>Your survey has been saved as a draft successfully!</p>
        <div className="modal-footer">
          <button onClick={handleModalClose} className="btn btn-primary">
            Continue
          </button>
        </div>
      </Modal>

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={handleModalClose}
        title="Survey Submitted"
        size="small"
      >
        <p>Your survey has been submitted successfully! It will be reviewed by the supervisor.</p>
        <div className="modal-footer">
          <button onClick={handleModalClose} className="btn btn-primary">
            Continue
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SurveyForm;
