import React from 'react';

interface GlobalModalProps {
  isOpen: boolean;
  isClosing?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hideCloseBtn?: boolean;
}

export default function GlobalModal({ 
  isOpen, 
  onClose, 
  children, 
  className = '', 
  style = {},
  hideCloseBtn = false
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
        {children}
      </div>
    </div>
  );
}
