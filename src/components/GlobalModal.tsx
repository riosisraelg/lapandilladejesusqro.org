'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

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
  isClosing = false,
  onClose, 
  children, 
  className = '', 
  style = {},
  hideCloseBtn = false,
  headerAction
}: GlobalModalProps) {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure modal card and overlay reset scroll position on open (scrollTop = 0)
  useEffect(() => {
    if (isOpen) {
      if (overlayRef.current) {
        overlayRef.current.scrollTop = 0;
      }
      if (cardRef.current) {
        cardRef.current.scrollTop = 0;
      }
      const scrollableChildren = cardRef.current?.querySelectorAll<HTMLElement>(
        '.recursos-modal-body, .confesion-modal-body, .lyric-scroll-container, .gcal-scrollable-body'
      );
      scrollableChildren?.forEach((el) => {
        el.scrollTop = 0;
      });
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const content = (
    <div 
      ref={overlayRef}
      className={`calendar-modal-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={onClose}
    >
      <div 
        ref={cardRef}
        className={`recursos-modal-card modal-large ${isClosing ? 'slide-down-closing' : ''} ${className}`} 
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

  return createPortal(content, document.body);
}
