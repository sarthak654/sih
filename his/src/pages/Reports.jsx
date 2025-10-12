import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import StatCard from '../components/StatCard.jsx';
import Table from '../components/Table.jsx';
import '../styles/layout.css';

const Reports = () => {
  const { user, isSurveyor } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [user, filter]);

  const loadData = () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let userSurveys = api.getSurveys(isSurveyor ? user.username : null);
      
      // Apply filter
      if (filter !== 'all') {
        userSurveys = userSurveys.filter(survey => survey.status === filter);
      }
      
      setSurveys(userSurveys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setStats(api.getStats(isSurveyor ? user.username : null));
    } catch (error) {
      console.error('Error loading reports:', error);
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

  const tableHeaders = ['Title', 'Village', 'Status', 'Created Date', 'Approved Date'];
  
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
      <td>{getStatusBadge(survey.status)}</td>
      <td>{formatDate(survey.createdAt)}</td>
      <td>
        {survey.approvedAt ? formatDate(survey.approvedAt) : '-'}
      </td>
    </tr>
  );

  const generateSimpleChart = () => {
    const statusCounts = {
      draft: surveys.filter(s => s.status === 'draft').length,
      submitted: surveys.filter(s => s.status === 'submitted').length,
      approved: surveys.filter(s => s.status === 'approved').length,
      rejected: surveys.filter(s => s.status === 'rejected').length
    };

    const total = surveys.length;
    if (total === 0) return null;

    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Survey Status Distribution</h3>
        </div>
        <div className="chart-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const colors = {
                draft: '#6c757d',
                submitted: '#ffc107',
                approved: '#28a745',
                rejected: '#dc3545'
              };
              
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: colors[status], 
                    borderRadius: '4px' 
                  }}></div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{status}</span>
                    <span>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div style={{ 
                    width: '200px', 
                    height: '8px', 
                    backgroundColor: 'var(--light-color)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: colors[status],
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">
            View and analyze your survey reports and statistics.
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
            title="Approved"
            value={stats.approved || 0}
            icon="✅"
            color="success"
          />
          <StatCard
            title="Pending"
            value={(stats.submitted || 0) + (stats.draft || 0)}
            icon="⏳"
            color="warning"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected || 0}
            icon="❌"
            color="danger"
          />
        </div>

        {/* Chart */}
        {surveys.length > 0 && generateSimpleChart()}

        {/* Filter and Table */}
        <div className="card">
          <div className="card-header">
            <div className="flex-container justify-content-between align-items-center">
              <h3>Survey Reports</h3>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Surveys</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <Table
              headers={tableHeaders}
              data={surveys}
              renderRow={renderTableRow}
              emptyMessage="No surveys found. Create your first survey to get started!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
