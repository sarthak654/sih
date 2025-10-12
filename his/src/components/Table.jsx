import React from 'react';
import '../styles/components.css';

const Table = ({ 
  headers, 
  data, 
  renderRow, 
  emptyMessage = 'No data available',
  className = '' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`table-container ${className}`}>
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">No Data</div>
          <div className="empty-state-text">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => renderRow(row, index))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
