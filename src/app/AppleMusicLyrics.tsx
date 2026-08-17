'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LyricLineProps {
  text: string;
  speaker?: string; // For duet style
  isLeft?: boolean;
}

interface AppleMusicLyricsProps {
  title: string;
  subtitle?: string;
  lines: LyricLineProps[];
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  langToggle?: React.ReactNode;
}

export default function AppleMusicLyrics({
  title,
  subtitle,
  lines,
  onClose,
  onNext,
  onPrev,
  langToggle
}: AppleMusicLyricsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLine, setActiveLine] = useState<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveLine(index);
          }
        });
      },
      {
        root: container,
        rootMargin: '-40% 0px -40% 0px', // Trigger when line is exactly in the middle 20% of the screen
        threshold: 0,
      }
    );

    const elements = container.querySelectorAll('.lyric-line');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [lines]);

  return (
    <div className="recursos-modal-card modal-large apple-music-mode" onClick={(e) => e.stopPropagation()}>
      <div className="lyric-modal-backdrop" />
      
      <div className="lyric-header">
        <div>
          <h3 className="lyric-title">{title}</h3>
          {subtitle && <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {langToggle}
          {(onPrev || onNext) && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {onPrev && <button onClick={onPrev} className="lang-toggle-btn">◀</button>}
              {onNext && <button onClick={onNext} className="lang-toggle-btn">▶</button>}
            </div>
          )}
          <button className="calendar-modal-close-btn recursos-close" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="lyric-scroll-container" ref={containerRef}>
        {lines.map((line, idx) => {
          if (line.text.startsWith('---SECTION---')) {
            return (
              <div key={`section-${idx}`} className="lyric-section-title" data-index={idx}>
                {line.text.replace('---SECTION---', '')}
              </div>
            );
          }

          let className = "lyric-line";
          if (activeLine === idx) className += " active";
          if (line.isLeft) className += " duet-left";
          else if (line.speaker) className += " duet-right"; // If it's a duet but not left, it's right

          return (
            <p key={idx} data-index={idx} className={className}>
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
