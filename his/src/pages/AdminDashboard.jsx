import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import StatCard from '../components/StatCard.jsx';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import '../styles/layout.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = () => {
    setLoading(true);
    try {
      const allSurveys = api.getSurveys();
      let filteredSurveys = allSurveys;
      
      if (filter !== 'all') {
        filteredSurveys = allSurveys.filter(survey => survey.status === filter);
      }
      
      setSurveys(filteredSurveys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setStats(api.getStats());
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (surveyId) => {
    setProcessing(true);
    try {
      await api.approveSurvey(surveyId, user.username);
      loadData(); // Refresh data
      setShowDetailsModal(false);
      setSelectedSurvey(null);
    } catch (error) {
      console.error('Error approving survey:', error);
      alert('Failed to approve survey');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (surveyId) => {
    setProcessing(true);
    try {
      await api.rejectSurvey(surveyId, user.username);
      loadData(); // Refresh data
      setShowDetailsModal(false);
      setSelectedSurvey(null);
    } catch (error) {
      console.error('Error rejecting survey:', error);
      alert('Failed to reject survey');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetails = (survey) => {
    setSelectedSurvey(survey);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      draft: 'status-badge draft',
      submitted: 'status-badge submitted',
      approved: 'status-badge approved',
      rejected: 'status-badge rejected'
    };
    
    const statusText = {
      draft: 'Draft',
      submitted: 'Submitted',
      approved: 'Approved',
      rejected: 'Rejected'
    };

    return (
      <span className={statusClasses[status]}>
        {statusText[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tableHeaders = ['Title', 'Village', 'Surveyor', 'Status', 'Created Date', 'Actions'];
  
  const renderTableRow = (survey) => (
    <tr key={survey.id}>
      <td>
        <div>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
            {survey.title}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {survey.description}
          </div>
        </div>
      </td>
      <td>{survey.formData?.villageName || 'N/A'}</td>
      <td>{survey.createdBy}</td>
      <td>{getStatusBadge(survey.status)}</td>
      <td>{formatDate(survey.createdAt)}</td>
      <td>
        <div className="action-buttons">
          <button 
            onClick={() => handleViewDetails(survey)}
            className="action-btn info"
            title="View Details"
          >
            👁️
          </button>
          {survey.status === 'submitted' && (
            <>
              <button 
                onClick={() => handleApprove(survey.id)}
                className="action-btn success"
                title="Approve"
                disabled={processing}
              >
                ✅
              </button>
              <button 
                onClick={() => handleReject(survey.id)}
                className="action-btn danger"
                title="Reject"
                disabled={processing}
              >
                ❌
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const renderSurveyDetails = () => {
    if (!selectedSurvey) return null;

    const { formData } = selectedSurvey;

    return (
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Survey Information</h4>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Created by: {selectedSurvey.createdBy} • {formatDate(selectedSurvey.createdAt)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <strong>Village Name:</strong> {formData?.villageName || 'N/A'}
          </div>
          <div>
            <strong>Population:</strong> {formData?.population || 'N/A'}
          </div>
          <div>
            <strong>Schools:</strong> {formData?.schoolsCount || 'N/A'}
          </div>
          <div>
            <strong>Hospitals:</strong> {formData?.hospitalsCount || 'N/A'}
          </div>
          {formData?.totalLandArea && (
            <div>
              <strong>Total Land Area:</strong> {formData.totalLandArea} acres
            </div>
          )}
          {formData?.cultivatedLand && (
            <div>
              <strong>Cultivated Land:</strong> {formData.cultivatedLand} acres
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h5 style={{ marginBottom: '0.5rem' }}>Infrastructure</h5>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {formData?.hasElectricity && <span className="badge badge-success">Electricity</span>}
            {formData?.hasWaterSupply && <span className="badge badge-success">Water Supply</span>}
            {formData?.hasRoadConnectivity && <span className="badge badge-success">Road Connectivity</span>}
          </div>
        </div>

        {formData?.mainCrops && formData.mainCrops.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ marginBottom: '0.5rem' }}>Main Crops</h5>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {formData.mainCrops.map((crop, index) => (
                <span key={index} className="badge badge-info">{crop}</span>
              ))}
            </div>
          </div>
        )}

        {formData?.issues && formData.issues.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ marginBottom: '0.5rem' }}>Issues Identified</h5>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {formData.issues.map((issue, index) => (
                <span key={index} className="badge badge-warning">{issue}</span>
              ))}
            </div>
          </div>
        )}

        {formData?.recommendations && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ marginBottom: '0.5rem' }}>Recommendations</h5>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--light-color)', 
              borderRadius: 'var(--border-radius)',
              whiteSpace: 'pre-wrap'
            }}>
              {formData.recommendations}
            </div>
          </div>
        )}

        {formData?.suggestions && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ marginBottom: '0.5rem' }}>Agricultural Suggestions</h5>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--light-color)', 
              borderRadius: 'var(--border-radius)',
              whiteSpace: 'pre-wrap'
            }}>
              {formData.suggestions}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">
            Review and manage submitted surveys from surveyors.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-4 mb-4">
          <StatCard
            title="Total Surveys"
            value={stats.total || 0}
            icon="📊"
            color="primary"
          />
          <StatCard
            title="Pending Review"
            value={stats.submitted || 0}
            icon="⏳"
            color="warning"
          />
          <StatCard
            title="Approved"
            value={stats.approved || 0}
            icon="✅"
            color="success"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected || 0}
            icon="❌"
            color="danger"
          />
        </div>

        {/* Survey Management */}
        <div className="card">
          <div className="card-header">
            <div className="flex-container justify-content-between align-items-center">
              <h3>Survey Management</h3>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Surveys</option>
                <option value="submitted">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <Table
              headers={tableHeaders}
              data={surveys}
              renderRow={renderTableRow}
              emptyMessage="No surveys found."
            />
          </div>
        </div>
      </div>

      {/* Survey Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedSurvey(null);
        }}
        title="Survey Details"
        size="large"
      >
        {renderSurveyDetails()}
        
        {selectedSurvey?.status === 'submitted' && (
          <div className="modal-footer">
            <button
              onClick={() => handleReject(selectedSurvey.id)}
              className="btn btn-danger"
              disabled={processing}
            >
              {processing ? (
                <span>
                  <span className="spinner"></span> Processing...
                </span>
              ) : (
                'Reject Survey'
              )}
            </button>
            <button
              onClick={() => handleApprove(selectedSurvey.id)}
              className="btn btn-success"
              disabled={processing}
            >
              {processing ? (
                <span>
                  <span className="spinner"></span> Processing...
                </span>
              ) : (
                'Approve Survey'
              )}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
