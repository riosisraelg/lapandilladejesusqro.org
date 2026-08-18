import React, { useEffect, useRef, useState } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);

  // Critical fix: Reset any residual drag displacement whenever modal is closed or reopened
  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
      touchStartY.current = null;
      touchStartX.current = null;
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    const deltaX = e.touches[0].clientX - touchStartX.current;

    // Only handle if predominantly vertical drag
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0) {
        // Downward drag (1:1 tracking)
        setDragY(deltaY);
      } else {
        // Upward drag: apply strong rubber-band resistance
        setDragY(deltaY * 0.15);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null) return;
    setIsDragging(false);
    
    // Threshold to trigger close: 100px or 15% of viewport height
    const threshold = typeof window !== 'undefined' ? Math.min(110, window.innerHeight * 0.15) : 100;
    
    if (dragY > threshold) {
      // Exceeded threshold -> Close cleanly
      onClose();
    } else {
      // Did not exceed threshold -> Snap back to top (0px) with spring animation
      setDragY(0);
    }
    
    touchStartY.current = null;
    touchStartX.current = null;
  };

  return (
    <div 
      className={`calendar-modal-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={onClose}
    >
      <div 
        className={`recursos-modal-card modal-large ${isClosing ? 'slide-down-closing' : ''} ${className}`} 
        style={{
          transform: !isClosing && (isDragging || dragY !== 0) ? `translateY(${dragY}px)` : undefined,
          transition: !isDragging && dragY === 0 ? 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
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
