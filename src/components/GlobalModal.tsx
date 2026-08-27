import React from 'react';

interface GlobalModalProps {
  isOpen: boolean;
  isClosing?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hideCloseBtn?: boolean;
  headerAction?: React.ReactNode;
}

export default function GlobalModal({ 
  isOpen, 
  onClose, 
  children, 
  className = '', 
  style = {},
  hideCloseBtn = false,
  headerAction
}: GlobalModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="calendar-modal-overlay" 
      onClick={onClose}
    >
      <div 
        className={`recursos-modal-card modal-large ${className}`} 
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="global-modal-header-actions">
          {headerAction}
          {!hideCloseBtn && (
            <button 
              type="button"
              className="calendar-modal-close-btn" 
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
