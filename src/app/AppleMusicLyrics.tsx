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
  { hues: [339, 0, 326], sat: [40, 55], light: [55, 68] }, // Day 1
  { hues: [252, 319, 227], sat: [40, 55], light: [55, 68] }, // Day 2
  { hues: [253, 315, 234], sat: [40, 55], light: [55, 68] }, // Day 3
  { hues: [224, 251, 199], sat: [40, 55], light: [55, 68] }, // Day 4
  { hues: [171, 182, 141], sat: [40, 55], light: [55, 68] }, // Day 5
  { hues: [80, 93, 54], sat: [40, 55], light: [55, 68] }, // Day 6
  { hues: [325, 348, 255], sat: [40, 55], light: [55, 68] }, // Day 7
  { hues: [72, 90, 54], sat: [40, 55], light: [55, 68] }, // Day 8
  { hues: [252, 318, 232], sat: [40, 55], light: [55, 68] }, // Day 9
  { hues: [147, 167, 132], sat: [40, 55], light: [55, 68] }, // Day 10
  { hues: [81, 99, 51], sat: [40, 55], light: [55, 68] }, // Day 11
  { hues: [162, 185, 135], sat: [40, 55], light: [55, 68] }, // Day 12
  { hues: [345, 14, 327], sat: [40, 55], light: [55, 68] }, // Day 13
  { hues: [216, 242, 191], sat: [40, 55], light: [55, 68] }, // Day 14
  { hues: [194, 218, 171], sat: [40, 55], light: [55, 68] }, // Day 15
  { hues: [226, 248, 202], sat: [40, 55], light: [55, 68] }, // Day 16
  { hues: [115, 141, 91], sat: [40, 55], light: [55, 68] }, // Day 17
  { hues: [215, 235, 193], sat: [40, 55], light: [55, 68] }, // Day 18
  { hues: [82, 111, 54], sat: [40, 55], light: [55, 68] }, // Day 19
  { hues: [173, 184, 160], sat: [40, 55], light: [55, 68] }, // Day 20
  { hues: [312, 339, 258], sat: [40, 55], light: [55, 68] }, // Day 21
  { hues: [21, 46, 352], sat: [40, 55], light: [55, 68] }, // Day 22
  { hues: [149, 162, 137], sat: [40, 55], light: [55, 68] }, // Day 23
  { hues: [174, 200, 151], sat: [40, 55], light: [55, 68] }, // Day 24
  { hues: [188, 212, 173], sat: [40, 55], light: [55, 68] }, // Day 25
  { hues: [9, 26, 347], sat: [40, 55], light: [55, 68] }, // Day 26
  { hues: [67, 90, 43], sat: [40, 55], light: [55, 68] }, // Day 27
  { hues: [207, 220, 187], sat: [40, 55], light: [55, 68] }, // Day 28
  { hues: [217, 244, 202], sat: [40, 55], light: [55, 68] }, // Day 29
  { hues: [121, 138, 98], sat: [40, 55], light: [55, 68] }, // Day 30
  { hues: [0, 14, 330], sat: [40, 55], light: [55, 68] }, // Day 31
  { hues: [234, 244, 213], sat: [40, 55], light: [55, 68] }, // Day 32
  { hues: [333, 348, 320], sat: [40, 55], light: [55, 68] }, // Day 33
  { hues: [76, 90, 50], sat: [40, 55], light: [55, 68] }, // Day 34
  { hues: [350, 5, 335], sat: [40, 55], light: [55, 68] }, // Day 35
  { hues: [57, 85, 38], sat: [40, 55], light: [55, 68] }, // Day 36
  { hues: [123, 145, 98], sat: [40, 55], light: [55, 68] }, // Day 37
  { hues: [140, 157, 127], sat: [40, 55], light: [55, 68] }, // Day 38
  { hues: [164, 178, 141], sat: [40, 55], light: [55, 68] }, // Day 39
  { hues: [5, 20, 349], sat: [40, 55], light: [55, 68] }, // Day 40
  { hues: [22, 50, 5], sat: [40, 55], light: [55, 68] }, // Day 41
  { hues: [236, 314, 214], sat: [40, 55], light: [55, 68] }, // Day 42
  { hues: [117, 128, 101], sat: [40, 55], light: [55, 68] }, // Day 43
  { hues: [217, 246, 207], sat: [40, 55], light: [55, 68] }, // Day 44
  { hues: [218, 243, 199], sat: [40, 55], light: [55, 68] }, // Day 45
  { hues: [11, 25, 356], sat: [40, 55], light: [55, 68] }, // Day 46
  { hues: [179, 195, 151], sat: [40, 55], light: [55, 68] }, // Day 47
  { hues: [352, 19, 324], sat: [40, 55], light: [55, 68] }, // Day 48
  { hues: [149, 166, 125], sat: [40, 55], light: [55, 68] }, // Day 49
  { hues: [330, 348, 320], sat: [40, 55], light: [55, 68] }, // Day 50
];

const NIGHT_PALETTES: PaletteDef[] = [
  { hues: [105, 118, 77], sat: [30, 48], light: [14, 25] }, // Night 1
  { hues: [182, 199, 171], sat: [30, 48], light: [14, 25] }, // Night 2
  { hues: [179, 207, 150], sat: [30, 48], light: [14, 25] }, // Night 3
  { hues: [177, 192, 148], sat: [30, 48], light: [14, 25] }, // Night 4
  { hues: [76, 99, 47], sat: [30, 48], light: [14, 25] }, // Night 5
  { hues: [251, 313, 238], sat: [30, 48], light: [14, 25] }, // Night 6
  { hues: [205, 227, 192], sat: [30, 48], light: [14, 25] }, // Night 7
  { hues: [157, 177, 135], sat: [30, 48], light: [14, 25] }, // Night 8
  { hues: [218, 247, 200], sat: [30, 48], light: [14, 25] }, // Night 9
  { hues: [84, 108, 55], sat: [30, 48], light: [14, 25] }, // Night 10
  { hues: [43, 63, 20], sat: [30, 48], light: [14, 25] }, // Night 11
  { hues: [126, 143, 113], sat: [30, 48], light: [14, 25] }, // Night 12
  { hues: [35, 56, 20], sat: [30, 48], light: [14, 25] }, // Night 13
  { hues: [343, 356, 332], sat: [30, 48], light: [14, 25] }, // Night 14
  { hues: [147, 169, 129], sat: [30, 48], light: [14, 25] }, // Night 15
  { hues: [341, 356, 325], sat: [30, 48], light: [14, 25] }, // Night 16
  { hues: [42, 61, 30], sat: [30, 48], light: [14, 25] }, // Night 17
  { hues: [54, 79, 26], sat: [30, 48], light: [14, 25] }, // Night 18
  { hues: [340, 353, 326], sat: [30, 48], light: [14, 25] }, // Night 19
  { hues: [145, 155, 121], sat: [30, 48], light: [14, 25] }, // Night 20
  { hues: [122, 133, 98], sat: [30, 48], light: [14, 25] }, // Night 21
  { hues: [233, 320, 218], sat: [30, 48], light: [14, 25] }, // Night 22
  { hues: [11, 37, 345], sat: [30, 48], light: [14, 25] }, // Night 23
  { hues: [7, 31, 347], sat: [30, 48], light: [14, 25] }, // Night 24
  { hues: [41, 59, 13], sat: [30, 48], light: [14, 25] }, // Night 25
  { hues: [14, 38, 351], sat: [30, 48], light: [14, 25] }, // Night 26
  { hues: [20, 38, 352], sat: [30, 48], light: [14, 25] }, // Night 27
  { hues: [193, 217, 176], sat: [30, 48], light: [14, 25] }, // Night 28
  { hues: [358, 28, 348], sat: [30, 48], light: [14, 25] }, // Night 29
  { hues: [40, 63, 21], sat: [30, 48], light: [14, 25] }, // Night 30
  { hues: [79, 91, 67], sat: [30, 48], light: [14, 25] }, // Night 31
  { hues: [170, 198, 145], sat: [30, 48], light: [14, 25] }, // Night 32
  { hues: [53, 72, 23], sat: [30, 48], light: [14, 25] }, // Night 33
  { hues: [314, 340, 259], sat: [30, 48], light: [14, 25] }, // Night 34
  { hues: [80, 98, 65], sat: [30, 48], light: [14, 25] }, // Night 35
  { hues: [258, 311, 228], sat: [30, 48], light: [14, 25] }, // Night 36
  { hues: [147, 164, 128], sat: [30, 48], light: [14, 25] }, // Night 37
  { hues: [225, 235, 214], sat: [30, 48], light: [14, 25] }, // Night 38
  { hues: [72, 84, 60], sat: [30, 48], light: [14, 25] }, // Night 39
  { hues: [356, 19, 326], sat: [30, 48], light: [14, 25] }, // Night 40
  { hues: [206, 223, 185], sat: [30, 48], light: [14, 25] }, // Night 41
  { hues: [19, 43, 2], sat: [30, 48], light: [14, 25] }, // Night 42
  { hues: [340, 2, 326], sat: [30, 48], light: [14, 25] }, // Night 43
  { hues: [254, 318, 240], sat: [30, 48], light: [14, 25] }, // Night 44
  { hues: [84, 100, 65], sat: [30, 48], light: [14, 25] }, // Night 45
  { hues: [23, 47, 357], sat: [30, 48], light: [14, 25] }, // Night 46
  { hues: [29, 48, 14], sat: [30, 48], light: [14, 25] }, // Night 47
  { hues: [147, 160, 132], sat: [30, 48], light: [14, 25] }, // Night 48
  { hues: [134, 157, 123], sat: [30, 48], light: [14, 25] }, // Night 49
  { hues: [34, 63, 4], sat: [30, 48], light: [14, 25] }, // Night 50
];

function generateGradientColors(): string[] {
  const isDark = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches 
    : false;
  
  const poolName = isDark ? 'NIGHT_PALETTES' : 'DAY_PALETTES';
  const pool = isDark ? NIGHT_PALETTES : DAY_PALETTES;
  
  let usedIndices: number[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`used_palettes_${poolName}`);
      if (stored) usedIndices = JSON.parse(stored);
    } catch (e) {}
  }
  
  let availableIndices = pool.map((_, i) => i).filter(i => !usedIndices.includes(i));
  if (availableIndices.length === 0) {
    availableIndices = pool.map((_, i) => i);
    usedIndices = [];
  }
  
  const randomAvailableIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedIndices.push(randomAvailableIndex);
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`used_palettes_${poolName}`, JSON.stringify(usedIndices));
    } catch (e) {}
  }

  const palette = pool[randomAvailableIndex];
  
  return palette.hues.map((h) => {
    const s = palette.sat[0] + Math.random() * (palette.sat[1] - palette.sat[0]);
    const l = palette.light[0] + Math.random() * (palette.light[1] - palette.light[0]);
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
      }) as HTMLElement | undefined;
      if (targetEl && containerRef.current) {
        containerRef.current.scrollTo({ top: targetEl.offsetTop - 100, behavior: 'auto' });
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
        <div className="lyric-header-title-wrap">
          <h3 className="lyric-title">{title}</h3>
          {subtitle && <p className="lyric-subtitle">{subtitle}</p>}
        </div>
        <div className="lyric-header-actions">
          {langToggle}
          {(onPrev || onNext) && (
            <div className="lyric-nav-arrows">
              {onPrev && (
                <button 
                  type="button" 
                  onClick={onPrev} 
                  className="lang-toggle-btn"
                  aria-label="Anterior"
                  title="Anterior"
                >
                  ◀
                </button>
              )}
              {onNext && (
                <button 
                  type="button" 
                  onClick={onNext} 
                  className="lang-toggle-btn"
                  aria-label="Siguiente"
                  title="Siguiente"
                >
                  ▶
                </button>
              )}
            </div>
          )}
          <button 
            type="button"
            className="apple-music-close-btn" 
            onClick={onClose}
            aria-label="Cerrar letras"
            title="Cerrar"
          >
            ✕
          </button>
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
