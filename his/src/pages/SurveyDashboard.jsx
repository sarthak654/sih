import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import StatCard from '../components/StatCard.jsx';
import Table from '../components/Table.jsx';
import '../styles/layout.css';

const SurveyDashboard = () => {
  const { user, isSurveyor } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0
  });
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userStats = api.getStats(user.username);
      const userSurveys = api.getSurveys(user.username);
      
      setStats(userStats);
      setSurveys(userSurveys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  const tableHeaders = ['Title', 'Status', 'Created Date', 'Actions'];
  
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
      <td>{getStatusBadge(survey.status)}</td>
      <td>{formatDate(survey.createdAt)}</td>
      <td>
        <div className="action-buttons">
          <Link 
            to={`/survey-form/${survey.id}`}
            className="action-btn primary"
            title="Edit Survey"
          >
            ✏️
          </Link>
          <Link 
            to={`/survey-details/${survey.id}`}
            className="action-btn info"
            title="View Details"
          >
            👁️
          </Link>
        </div>
      </td>
    </tr>
  );

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
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {user.name}! Here's an overview of your surveys.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-4 mb-4">
          <StatCard
            title="Total Surveys"
            value={stats.total}
            icon="📊"
            color="primary"
          />
          <StatCard
            title="Draft"
            value={stats.draft}
            icon="📝"
            color="warning"
          />
          <StatCard
            title="Submitted"
            value={stats.submitted}
            icon="📤"
            color="info"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon="✅"
            color="success"
          />
        </div>

        {/* Quick Actions */}
        <div className="card mb-4">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="flex-container">
              {isSurveyor && (
                <Link to="/survey-form" className="btn btn-primary">
                  + Create New Survey
                </Link>
              )}
              <Link to="/reports" className="btn btn-outline">
                📊 View Reports
              </Link>
              <Link to="/messages" className="btn btn-outline">
                💬 Messages
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Surveys */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Surveys</h3>
          </div>
          <div className="card-body">
            <Table
              headers={tableHeaders}
              data={surveys.slice(0, 10)}
              renderRow={renderTableRow}
              emptyMessage="You haven't created any surveys yet. Create your first survey to get started!"
            />
            
            {surveys.length > 10 && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/reports" className="btn btn-outline">
                  View All Surveys
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDashboard;
