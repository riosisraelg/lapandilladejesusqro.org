import React, { useRef, useState } from 'react';

interface GlobalModalProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hideCloseBtn?: boolean;
}

export default function GlobalModal({ 
  isOpen, 
  isClosing, 
  onClose, 
  children, 
  className = '', 
  style = {},
  hideCloseBtn = false
}: GlobalModalProps) {
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);

  if (!isOpen && !isClosing) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    const deltaX = e.touches[0].clientX - touchStartX.current;

    // Allow dragging up and down as long as it's primarily a vertical drag
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null) return;
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.2 : 150;
    
    if (dragY > threshold) {
      onClose();
    } else {
      // Return to original position
      setDragY(0);
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div 
        className={`recursos-modal-card modal-large ${isClosing ? 'slide-down-closing' : ''} ${className}`} 
        style={{
          transform: dragY !== 0 && !isClosing ? `translateY(${dragY}px)` : undefined,
          transition: dragY === 0 ? 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none',
          ...style
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="mobile-drag-handle"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        ></div>
        {!hideCloseBtn && (
          <button 
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
