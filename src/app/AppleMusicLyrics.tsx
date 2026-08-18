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
  
  // UX Improvements
  className?: string;
  style?: React.CSSProperties;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
  onTouchMove?: React.TouchEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  onTouchCancel?: React.TouchEventHandler<HTMLDivElement>;
  
  // Deep Linking
  onSectionChange?: (section: string) => void;
  initialSection?: string | null;
}

// ── Dynamic Gradient Palette System ──
// Curated palette pools — NO purple/violet hues (avoid 260-310 range)
interface PaletteDef {
  hues: number[];
  sat: [number, number];
  light: [number, number];
}

const DAY_PALETTES: PaletteDef[] = [
  // Warm sand/amber
  { hues: [35, 45, 20], sat: [40, 50], light: [55, 65] },
  // Ocean teal
  { hues: [175, 190, 160], sat: [35, 45], light: [50, 60] },
  // Coral sunset
  { hues: [15, 5, 25], sat: [55, 65], light: [60, 70] },
  // Forest green
  { hues: [130, 145, 115], sat: [30, 40], light: [45, 55] },
  // Rose gold
  { hues: [350, 10, 340], sat: [40, 50], light: [60, 68] },
  // Sky blue
  { hues: [210, 220, 200], sat: [45, 55], light: [55, 65] },
];

const NIGHT_PALETTES: PaletteDef[] = [
  // Deep amber/coffee
  { hues: [25, 35, 15], sat: [35, 50], light: [18, 28] },
  // Midnight teal
  { hues: [180, 195, 170], sat: [25, 40], light: [15, 25] },
  // Dark cherry
  { hues: [350, 5, 340], sat: [30, 45], light: [15, 25] },
  // Deep emerald
  { hues: [140, 155, 125], sat: [25, 35], light: [12, 22] },
  // Charcoal blue
  { hues: [215, 225, 205], sat: [20, 35], light: [12, 22] },
  // Dark bronze
  { hues: [30, 40, 20], sat: [40, 55], light: [14, 24] },
];

function generateGradientColors(): string[] {
  const isDark = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches 
    : false;
  const pool = isDark ? NIGHT_PALETTES : DAY_PALETTES;
  const palette = pool[Math.floor(Math.random() * pool.length)];
  
  return palette.hues.map((h) => {
    const s = palette.sat[0] + Math.random() * (palette.sat[1] - palette.sat[0]);
    const l = palette.light[0] + Math.random() * (palette.light[1] - palette.light[0]);
    // Add slight hue jitter (±5°) for organic variation
    const jitteredH = (h + Math.floor(Math.random() * 10 - 5) + 360) % 360;
    return `hsl(${jitteredH}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  });
}

export default function AppleMusicLyrics({
  title,
  subtitle,
  lines,
  onClose,
  onNext,
  onPrev,
  langToggle,
  className = '',
  style = {},
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  onSectionChange,
  initialSection
}: AppleMusicLyricsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLine, setActiveLine] = useState<number>(0);
  const lastReportedSection = useRef<string | null>(null);
  
  // Generate random gradient colors once on mount (new colors every page load)
  const [gradientColors] = useState<string[]>(() => generateGradientColors());
  
  // Inject dynamic gradient CSS custom properties
  const combinedStyle = {
    ...style,
    '--gradient-c1': gradientColors[0] || 'hsl(30, 40%, 20%)',
    '--gradient-c2': gradientColors[1] || 'hsl(40, 35%, 25%)',
    '--gradient-c3': gradientColors[2] || 'hsl(20, 30%, 15%)',
  } as React.CSSProperties;

  // Scroll to top when song changes (not when lines reference changes)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [title, subtitle]);

  // Handle active line detection & Deep Linking URL update
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveLine(index);
            
            // Check if this line is a section to update the URL silently
            if (onSectionChange) {
              const text = entry.target.getAttribute('data-text') || '';
              if (text.startsWith('---SECTION---')) {
                const sectionName = text.replace('---SECTION---', '');
                const slug = sectionName.toLowerCase().replace(/\s+/g, '-');
                if (slug !== lastReportedSection.current) {
                  lastReportedSection.current = slug;
                  onSectionChange(sectionName);
                }
              }
            }
          }
        });
      },
      {
        root: container,
        rootMargin: '-10% 0px -60% 0px', // Trigger near the top of the container
        threshold: 0,
      }
    );

    const elements = container.querySelectorAll('.lyric-line, .lyric-section-title');
    elements.forEach((el) => observer.observe(el));

    // Handle initial scrolling if initialSection is provided via URL
    if (initialSection) {
      const targetEl = Array.from(elements).find(el => {
        const t = el.getAttribute('data-text') || '';
        return t === `---SECTION---${initialSection}`;
      });
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [lines, onSectionChange, initialSection]);

  return (
    <>
      <div className="lyric-modal-backdrop" style={combinedStyle} />
      
      <div className="lyric-header">
        <div>
          <h3 className="lyric-title">{title}</h3>
          {subtitle && <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', zIndex: 10 }}>
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
              <div 
                key={`section-${idx}`} 
                className="lyric-section-title" 
                data-index={idx}
                data-text={line.text}
              >
                {line.text.replace('---SECTION---', '')}
              </div>
            );
          }

          let lineClass = "lyric-line";
          if (activeLine === idx) lineClass += " active";
          
          const isFirstOfStanza = idx === 0 || lines[idx - 1]?.text.trim() === '' || lines[idx - 1]?.text.startsWith('---SECTION---');
          if (isFirstOfStanza && line.text.trim() !== '') lineClass += " first-of-stanza";
          
          if (line.isLeft && line.speaker !== undefined) lineClass += " duet-left";
          else if (line.speaker !== undefined && !line.isLeft) lineClass += " duet-right";

          return (
            <p key={idx} data-index={idx} data-text={line.text} className={lineClass}>
              {line.text}
            </p>
          );
        })}
      </div>
    </>
  );
}
