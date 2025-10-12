import React from 'react';
import '../styles/components.css';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  color = 'primary' 
}) => {
  const getChangeClass = () => {
    if (changeType === 'positive') return 'positive';
    if (changeType === 'negative') return 'negative';
    return '';
  };

  const getIconClass = () => {
    return `stat-card-icon ${color}`;
  };

  const getCardClass = () => {
    return `stat-card ${color}`;
  };

  return (
    <div className={getCardClass()}>
      <div className="stat-card-header">
        <h3 className="stat-card-title">{title}</h3>
        <div className={getIconClass()}>
          {icon || '📊'}
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {change && (
        <div className={`stat-card-change ${getChangeClass()}`}>
          {change}
        </div>
      )}
    </div>
  );
};

export default StatCard;
