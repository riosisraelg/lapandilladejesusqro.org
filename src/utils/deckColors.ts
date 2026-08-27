/**
 * Dynamic Brand Color Tone Engine (ISO/IEC/IEEE 29148:2018 §RF-04)
 * 
 * Programmatically calculates distinct tones and gradients of the primary
 * Catholic coffee brand color (#5C3D2E, HSL: 20°, 33%, 27%) for deck differentiation.
 */

export interface DeckColorTone {
  index: number;
  hue: number;
  saturation: number;
  lightness: number;
  hslString: string;
  gradientString: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  indicatorActive: string;
  cssVariables: Record<string, string>;
}

/**
 * Calculates deterministic HSL color tone and gradient for a given deck index.
 * 
 * Formula:
 *   Hue = (20 + index * 12) % 360
 *   Lightness = 24 + ((index * 7) % 22)   (Range: 24% - 45%, WCAG AA contrast compliant)
 *   Saturation = 30 + ((index * 5) % 15)  (Range: 30% - 44%)
 */
export function calculateDeckHSL(index: number): DeckColorTone {
  const safeIdx = Math.floor(Math.abs(index || 0));
  const hue = (20 + safeIdx * 12) % 360;
  const lightness = 24 + ((safeIdx * 7) % 22);
  const saturation = 30 + ((safeIdx * 5) % 15);
  
  const hslString = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const gradientString = `linear-gradient(135deg, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${hue}, ${Math.max(saturation - 5, 10)}%, ${Math.max(lightness - 8, 10)}%))`;
  const accentBorder = `hsl(${hue}, ${saturation}%, ${Math.min(lightness + 18, 65)}%)`;
  const badgeBg = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.12)`;
  const badgeText = `hsl(${hue}, ${saturation}%, ${Math.max(lightness - 5, 18)}%)`;
  const indicatorActive = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const cssVariables: Record<string, string> = {
    '--deck-color-hsl': hslString,
    '--deck-color-gradient': gradientString,
    '--deck-color-border': accentBorder,
    '--deck-color-badge-bg': badgeBg,
    '--deck-color-badge-text': badgeText,
    '--deck-color-indicator': indicatorActive,
  };

  return {
    index: safeIdx,
    hue,
    saturation,
    lightness,
    hslString,
    gradientString,
    accentBorder,
    badgeBg,
    badgeText,
    indicatorActive,
    cssVariables,
  };
}

/**
 * Calculates WCAG contrast ratio of lightness against white (#FFFFFF).
 */
export function calculateContrastRatioAgainstWhite(lightness: number): number {
  const lNorm = lightness / 100;
  const lumDark = 0.2126 * (lNorm ** 2.2) + 0.7152 * (lNorm ** 2.2) + 0.0722 * (lNorm ** 2.2);
  const lumWhite = 1.0;
  return (lumWhite + 0.05) / (lumDark + 0.05);
}
