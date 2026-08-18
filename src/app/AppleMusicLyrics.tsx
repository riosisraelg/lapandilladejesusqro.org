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
  // 1. Arena Cálida & Ámbar
  { hues: [38, 48, 24], sat: [40, 50], light: [55, 65] },
  // 2. Bracero de Terracota
  { hues: [18, 28, 12], sat: [50, 60], light: [58, 68] },
  // 3. Miel de Alba
  { hues: [44, 54, 32], sat: [45, 55], light: [60, 70] },
  // 4. Atardecer Coral
  { hues: [12, 4, 22], sat: [55, 65], light: [62, 72] },
  // 5. Rosa Aurora
  { hues: [352, 6, 342], sat: [42, 52], light: [60, 70] },
  // 6. Olivares al Sol
  { hues: [82, 94, 70], sat: [35, 45], light: [52, 62] },
  // 7. Jardín de Salvia
  { hues: [118, 130, 105], sat: [30, 40], light: [54, 64] },
  // 8. Esmeralda Matutina
  { hues: [145, 160, 130], sat: [35, 45], light: [48, 58] },
  // 9. Brisa de Mar Turquesa
  { hues: [175, 190, 162], sat: [40, 50], light: [52, 62] },
  // 10. Laguna Caribeña
  { hues: [182, 198, 170], sat: [45, 55], light: [54, 64] },
  // 11. Cielo Cerúleo
  { hues: [205, 218, 195], sat: [42, 52], light: [56, 66] },
  // 12. Azul Océano Pacífico
  { hues: [215, 228, 202], sat: [40, 50], light: [52, 62] },
  // 13. Zafiro Mediterráneo
  { hues: [222, 235, 210], sat: [45, 55], light: [50, 60] },
  // 14. Caramelo & Vainilla
  { hues: [32, 42, 22], sat: [48, 58], light: [58, 68] },
  // 15. Canela & Cedro
  { hues: [24, 34, 16], sat: [42, 52], light: [56, 66] },
  // 16. Oro Imperial
  { hues: [48, 58, 38], sat: [50, 60], light: [60, 70] },
  // 17. Cobre Radiante
  { hues: [16, 26, 8], sat: [52, 62], light: [58, 68] },
  // 18. Prado Primaveral
  { hues: [132, 146, 120], sat: [38, 48], light: [50, 60] },
  // 19. Papiro & Lino
  { hues: [42, 50, 30], sat: [32, 42], light: [62, 72] },
  // 20. Manantial Glaciar
  { hues: [195, 208, 185], sat: [38, 48], light: [58, 68] },
];

const NIGHT_PALETTES: PaletteDef[] = [
  // 1. Espresso & Brasas
  { hues: [24, 34, 14], sat: [35, 50], light: [16, 26] },
  // 2. Obsidiana & Oro Antiguo
  { hues: [40, 50, 28], sat: [38, 52], light: [14, 24] },
  // 3. Cedro Ahumado
  { hues: [18, 28, 10], sat: [32, 46], light: [15, 25] },
  // 4. Cereza Negra & Caoba
  { hues: [348, 2, 338], sat: [30, 45], light: [14, 24] },
  // 5. Esmeralda Abisal
  { hues: [142, 156, 128], sat: [28, 40], light: [12, 22] },
  // 6. Pino Nocturno
  { hues: [154, 168, 140], sat: [26, 38], light: [13, 23] },
  // 7. Turquesa de Medianoche
  { hues: [178, 192, 165], sat: [30, 44], light: [14, 24] },
  // 8. Fosa Oceánica
  { hues: [186, 200, 172], sat: [32, 46], light: [12, 22] },
  // 9. Zafiro Nocturno
  { hues: [216, 228, 204], sat: [30, 44], light: [12, 22] },
  // 10. Pizarra & Carbón Azul
  { hues: [208, 220, 196], sat: [24, 36], light: [13, 23] },
  // 11. Cobalto Profundo
  { hues: [224, 236, 212], sat: [32, 45], light: [12, 22] },
  // 12. Bronce Sagrado
  { hues: [34, 44, 22], sat: [40, 55], light: [15, 25] },
  // 13. Cacao & Canela Oscura
  { hues: [26, 36, 16], sat: [36, 48], light: [14, 24] },
  // 14. Selva en Tinieblas
  { hues: [136, 150, 122], sat: [25, 38], light: [12, 22] },
  // 15. Musgo Umbrío
  { hues: [88, 100, 76], sat: [26, 38], light: [13, 23] },
  // 16. Basalto Volcánico & Rubí
  { hues: [354, 8, 344], sat: [34, 48], light: [13, 23] },
  // 17. Cobre Ancestral
  { hues: [14, 24, 6], sat: [38, 52], light: [15, 25] },
  // 18. Arrecife Abisal
  { hues: [170, 184, 158], sat: [28, 42], light: [13, 23] },
  // 19. Noche Polar Ártica
  { hues: [198, 212, 186], sat: [26, 40], light: [13, 23] },
  // 20. Índigo Profundo & Ocre
  { hues: [230, 240, 36], sat: [30, 45], light: [12, 22] },
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
          <button 
            type="button"
            className="apple-music-close-btn" 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onTouchEnd={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Cerrar"
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
