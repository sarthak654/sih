import React, { useEffect } from 'react';
import '../styles/components.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'medium',
  className = '' 
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getModalSize = () => {
    switch (size) {
      case 'small': return { maxWidth: '400px' };
      case 'large': return { maxWidth: '800px' };
      case 'xl': return { maxWidth: '1200px' };
      default: return { maxWidth: '500px' };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal ${className}`}
        style={getModalSize()}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button 
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
