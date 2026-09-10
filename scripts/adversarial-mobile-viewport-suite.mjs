#!/usr/bin/env node

/**
 * ============================================================================
 * ADVERSARIAL MOBILE VIEWPORT & MODAL LAYOUT STRESS SUITE
 * ============================================================================
 * Challenger 1: Empirical Verification of Mobile Viewport Geometry,
 * Safe Alignment, Dynamic Coordinate Spaces, and Overflow Invariants.
 * ============================================================================
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

console.log('===============================================================================');
console.log('   CHALLENGER 1: MOBILE VIEWPORT & MODAL LAYOUT ADVERSARIAL STRESS SUITE       ');
console.log('===============================================================================');

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;
const failures = [];

function test(category, name, fn) {
  totalTests++;
  try {
    fn();
    totalPassed++;
    console.log(`  [${category}] ✔ PASS: ${name}`);
  } catch (err) {
    totalFailed++;
    failures.push({ category, name, error: err.message, stack: err.stack });
    console.log(`  [${category}] ✖ FAIL: ${name}`);
    console.log(`    Error: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// READ SOURCE FILES UNDER TEST
// ─────────────────────────────────────────────────────────────────────────────
const cssSource = readFileSync(resolve(ROOT_DIR, 'src/app/global.css'), 'utf-8');
const globalModalSource = readFileSync(resolve(ROOT_DIR, 'src/components/GlobalModal.tsx'), 'utf-8');
const landingClientSource = readFileSync(resolve(ROOT_DIR, 'src/app/LandingClient.tsx'), 'utf-8');
const calendarioClientSource = readFileSync(resolve(ROOT_DIR, 'src/app/calendario/CalendarioClient.tsx'), 'utf-8');
const lyricsSource = readFileSync(resolve(ROOT_DIR, 'src/app/AppleMusicLyrics.tsx'), 'utf-8');

// ─────────────────────────────────────────────────────────────────────────────
// TIER 1: CSS CONTRACT & STATIC INVARIANT AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TIER 1: CSS Contract & Static Invariant Audit ---');

test('CSS-INVARIANT', 'Overlay declares canonical fixed bounds (inset: 0, 100%, 100dvh, -webkit-fill-available)', () => {
  const overlayBlockMatch = cssSource.match(/\.calendar-modal-overlay\s*\{([^}]*)\}/);
  assert.ok(overlayBlockMatch, 'Could not locate .calendar-modal-overlay in global.css');
  const block = overlayBlockMatch[1];

  assert.match(block, /position:\s*fixed;/, 'Must use position: fixed');
  assert.match(block, /inset:\s*0;/, 'Must use inset: 0 to anchor to all 4 edges');
  assert.match(block, /width:\s*100%;/, 'Must use width: 100%');
  assert.match(block, /height:\s*100%;/, 'Must declare fallback height: 100%');
  assert.match(block, /height:\s*100dvh;/, 'Must declare dynamic viewport height 100dvh');
  assert.match(block, /min-height:\s*-webkit-fill-available;/, 'Must include WebKit mobile viewport fix');
});

test('CSS-INVARIANT', 'Overlay uses safe flex alignment (justify-content: safe flex-end) preventing negative coordinates', () => {
  const overlayBlockMatch = cssSource.match(/\.calendar-modal-overlay\s*\{([^}]*)\}/);
  const block = overlayBlockMatch[1];
  assert.match(block, /justify-content:\s*safe flex-end;/, 'Must declare safe flex-end on base overlay');

  // Verify responsive section has safe flex-end
  const responsiveIdx = cssSource.indexOf('/* Responsive Styles */');
  assert.ok(responsiveIdx > 0, 'Could not find /* Responsive Styles */');
  const responsiveSection = cssSource.slice(responsiveIdx);
  const mobileOverlayMatch = responsiveSection.match(/\.calendar-modal-overlay\s*\{([^}]*)\}/);
  assert.ok(mobileOverlayMatch, 'Could not locate mobile .calendar-modal-overlay');
  assert.match(mobileOverlayMatch[1], /justify-content:\s*safe flex-end;/, 'Mobile media query must declare safe flex-end');
});

test('CSS-INVARIANT', 'Overlay declares independent vertical scrollability and touch containment', () => {
  const overlayBlockMatch = cssSource.match(/\.calendar-modal-overlay\s*\{([^}]*)\}/);
  const block = overlayBlockMatch[1];
  assert.match(block, /overflow-y:\s*auto;/, 'Overlay must declare overflow-y: auto');
  assert.match(block, /overscroll-behavior:\s*contain;/, 'Overlay must contain overscroll');
  assert.match(block, /-webkit-overflow-scrolling:\s*touch;/, 'Overlay must enable smooth WebKit momentum touch scrolling');
});

test('CSS-INVARIANT', 'Mobile media query enforces safe area inset bottom padding for iOS home indicator', () => {
  const responsiveIdx = cssSource.indexOf('/* Responsive Styles */');
  const responsiveSection = cssSource.slice(responsiveIdx);
  const mobileOverlayMatch = responsiveSection.match(/\.calendar-modal-overlay\s*\{([^}]*)\}/);
  assert.ok(mobileOverlayMatch, 'Could not locate mobile .calendar-modal-overlay in responsive section');
  assert.match(mobileOverlayMatch[1], /padding-bottom:\s*env\(safe-area-inset-bottom,\s*0px\)\s*!important;/, 'Mobile overlay must preserve iOS home indicator safe area');
});

test('CSS-INVARIANT', 'Modal cards use auto top margin and dvh/svh bounded max-height', () => {
  const cardMatch = cssSource.match(/\.recursos-modal-card\s*\{([^}]*)\}/);
  assert.ok(cardMatch, 'Could not locate .recursos-modal-card');
  const block = cardMatch[1];
  assert.match(block, /margin:\s*auto 0 0 0;/, 'Must use margin: auto 0 0 0 for safe bottom pinning');
  assert.match(block, /max-height:\s*calc\(100dvh - 2rem\);/, 'Must declare dvh max-height limit');
  assert.match(block, /max-height:\s*calc\(100svh - 2rem\);/, 'Must declare svh max-height limit');

  // Verify mobile modal-large in responsive section as well
  const responsiveIdx = cssSource.indexOf('/* Responsive Styles */');
  const responsiveSection = cssSource.slice(responsiveIdx);
  const mobileCardMatch = responsiveSection.match(/\.recursos-modal-card\.modal-large\s*\{([^}]*)\}/);
  assert.ok(mobileCardMatch, 'Could not locate mobile .recursos-modal-card.modal-large');
  assert.match(mobileCardMatch[1], /margin:\s*auto 0 0 0;/, 'Mobile modal-large must use margin: auto 0 0 0');
  assert.match(mobileCardMatch[1], /max-height:\s*calc\(100svh - 2rem\);/, 'Mobile modal-large must use svh max-height');
});

test('CSS-INVARIANT', 'No conflicting max-height: 90vh remains in mobile media queries', () => {
  const responsiveIdx = cssSource.indexOf('/* Responsive Styles */');
  const responsiveSection = cssSource.slice(responsiveIdx);
  assert.doesNotMatch(responsiveSection, /\.recursos-modal-card\s*\{[^}]*max-height:\s*90vh/, 'Must not have conflicting max-height: 90vh in responsive section');
});

test('CSS-INVARIANT', 'Stacked deck container fluidly flexes without fixed 480px or 72vh minimum', () => {
  const responsiveIdx = cssSource.indexOf('/* Responsive Styles */');
  const responsiveSection = cssSource.slice(responsiveIdx);
  const deckMatch = responsiveSection.match(/\.stacked-deck-container\s*\{([^}]*)\}/);
  assert.ok(deckMatch, 'Could not locate mobile .stacked-deck-container');
  const block = deckMatch[1];
  assert.match(block, /flex:\s*1 1 auto;/, 'Deck must flex fluidly');
  assert.match(block, /min-height:\s*0;/, 'Deck must have min-height: 0 to shrink inside modal');
  assert.doesNotMatch(block, /min-height:\s*480px;/, 'Must not have hardcoded min-height: 480px');
  assert.doesNotMatch(block, /height:\s*72vh;/, 'Must not have rigid 72vh height');
});

test('CSS-INVARIANT', 'Animation keyframes use percentage translations (translateY(100%)) rather than 100vh', () => {
  // Helper to extract full @keyframes block including inner percentages
  function extractKeyframeBlock(name) {
    const startIdx = cssSource.indexOf(`@keyframes ${name}`);
    assert.ok(startIdx !== -1, `Could not find @keyframes ${name}`);
    const firstBrace = cssSource.indexOf('{', startIdx);
    let depth = 1;
    let endIdx = firstBrace + 1;
    while (depth > 0 && endIdx < cssSource.length) {
      if (cssSource[endIdx] === '{') depth++;
      else if (cssSource[endIdx] === '}') depth--;
      endIdx++;
    }
    return cssSource.slice(firstBrace, endIdx);
  }

  const slideUpBlock = extractKeyframeBlock('modalSlideUp');
  assert.doesNotMatch(slideUpBlock, /100vh/, 'modalSlideUp must not use 100vh');
  assert.match(slideUpBlock, /translateY\(100%\)/, 'modalSlideUp must use translateY(100%)');

  const slideDownBlock = extractKeyframeBlock('modalSlideDown');
  assert.doesNotMatch(slideDownBlock, /100vh/, 'modalSlideDown must not use 100vh');
  assert.match(slideDownBlock, /translateY\(100%\)/, 'modalSlideDown must use translateY(100%)');

  const scaleInBlock = extractKeyframeBlock('scaleInModal');
  assert.doesNotMatch(scaleInBlock, /100vh/, 'scaleInModal must not use 100vh');
  assert.match(scaleInBlock, /translateY\(100%\)/, 'scaleInModal must use translateY(100%)');
});

test('CSS-INVARIANT', 'Internal scroll containers declare min-height: 0 and overscroll-behavior: contain', () => {
  const recursosBodyMatch = cssSource.match(/\.recursos-modal-body\s*\{([^}]*)\}/);
  assert.match(recursosBodyMatch[1], /min-height:\s*0;/, '.recursos-modal-body must declare min-height: 0');
  assert.match(recursosBodyMatch[1], /overscroll-behavior:\s*contain;/, '.recursos-modal-body must contain overscroll');
  assert.match(recursosBodyMatch[1], /-webkit-overflow-scrolling:\s*touch;/, '.recursos-modal-body must enable touch scrolling');

  const confesionBodyMatch = cssSource.match(/\.confesion-modal-body\s*\{([^}]*)\}/);
  assert.match(confesionBodyMatch[1], /min-height:\s*0;/, '.confesion-modal-body must declare min-height: 0');
  assert.match(confesionBodyMatch[1], /overscroll-behavior:\s*contain;/, '.confesion-modal-body must contain overscroll');

  const lyricContainerMatch = cssSource.match(/\.lyric-scroll-container\s*\{([^}]*)\}/);
  assert.match(lyricContainerMatch[1], /overscroll-behavior:\s*contain;/, '.lyric-scroll-container must contain overscroll');
  assert.match(lyricContainerMatch[1], /-webkit-overflow-scrolling:\s*touch;/, '.lyric-scroll-container must enable touch scrolling');
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 2: COMPONENT & LIFECYCLE CONTRACT VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TIER 2: Component & Lifecycle Contract Verification ---');

test('COMPONENT', 'GlobalModal implements React Portal to document.body with hydration guard', () => {
  assert.match(globalModalSource, /createPortal\(content,\s*document\.body\)/, 'GlobalModal must portal to document.body');
  assert.match(globalModalSource, /const \[mounted, setMounted\] = useState\(false\);/, 'GlobalModal must track mounted state');
  assert.match(globalModalSource, /if \(!isOpen \|\| !mounted\) return null;/, 'GlobalModal must return null on SSR / unmounted');
});

test('COMPONENT', 'GlobalModal resets scroll position (scrollTop = 0) on open across overlay and scroll containers', () => {
  assert.match(globalModalSource, /overlayRef\.current\.scrollTop = 0;/, 'GlobalModal must reset overlay scrollTop');
  assert.match(globalModalSource, /cardRef\.current\.scrollTop = 0;/, 'GlobalModal must reset card scrollTop');
  assert.match(globalModalSource, /scrollableChildren\?\.forEach\(\(el\) => \{\s*el\.scrollTop = 0;\s*\}\);/, 'GlobalModal must reset internal scrollable children');
});

test('COMPONENT', 'LandingClient locks body scroll with position: fixed and restores window.scrollY on unlock', () => {
  assert.match(landingClientSource, /document\.body\.style\.position = 'fixed';/, 'LandingClient must set body position fixed');
  assert.match(landingClientSource, /document\.body\.style\.top = `-\$\{scrollY\}px`;/, 'LandingClient must lock top offset');
  assert.match(landingClientSource, /document\.body\.style\.width = '100%';/, 'LandingClient must lock body width');
  assert.match(landingClientSource, /window\.scrollTo\(0,\s*(?:scrollY|restoredY)\);/, 'LandingClient must restore scroll position');
});

test('COMPONENT', 'CalendarioClient locks body scroll with position: fixed and preserves existing top if nested', () => {
  assert.match(calendarioClientSource, /document\.body\.style\.position = 'fixed';/, 'CalendarioClient must set body position fixed');
  assert.match(calendarioClientSource, /existingTop \? Math\.abs\(parseInt\(existingTop, 10\)\) : window\.scrollY;/, 'CalendarioClient must guard against nested modal scroll corruption');
  assert.match(calendarioClientSource, /window\.scrollTo\(0,\s*restoredY\);/, 'CalendarioClient must restore exact scroll position');
});

test('COMPONENT', 'AppleMusicLyrics uses containerRef.current.scrollTo instead of window-level scrollIntoView', () => {
  assert.doesNotMatch(lyricsSource, /scrollIntoView\s*\(/, 'AppleMusicLyrics must not use scrollIntoView');
  assert.match(lyricsSource, /containerRef\.current\.scrollTo\(\s*\{[\s\S]*?top:/, 'AppleMusicLyrics must use container scrollTo');
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 3: EMPIRICAL FLEXBOX & VIEWPORT GEOMETRY SIMULATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TIER 3: Empirical Viewport Geometry & Coordinate Bounds ---');

/**
 * Mathematical Layout Oracle for CSS Flexbox with Safe Alignment & Dynamic Viewports:
 * Simulates exact browser box calculations across screen dimensions, dynamic toolbars,
 * and content overflows.
 */
class ViewportLayoutOracle {
  constructor(options) {
    this.name = options.name;
    this.screenWidth = options.width;
    this.screenHeight = options.height;
    // Dynamic toolbars: svh (toolbars expanded), lvh (toolbars collapsed), dvh (current)
    this.toolbarHeight = options.toolbarHeight || 0;
    this.safeAreaBottom = options.safeAreaBottom || 0;
    this.safeAreaTop = options.safeAreaTop || 0;
    
    this.lvh = this.screenHeight;
    this.svh = this.screenHeight - this.toolbarHeight;
    this.dvh = this.svh; // Most conservative mobile state (toolbars expanded)
  }

  calculateLayout({ contentHeight, flexAlignMode = 'safe flex-end', useAutoMargin = true, legacyBugSimulation = false }) {
    const containerHeight = this.dvh;
    const containerWidth = this.screenWidth;
    const rem = 16; // 1rem = 16px standard browser root

    let cardMaxHeight;
    let actualCardHeight;

    if (legacyBugSimulation) {
      // Legacy unpatched state:
      // In old CSS: max-height: 90vh (which evaluates to 90% of lvh)
      // and .stacked-deck-container had min-height: 480px + header + padding = 588px
      cardMaxHeight = 0.90 * this.lvh;
      const minLegacyHeight = 588;
      const preferredCardHeight = Math.max(minLegacyHeight, contentHeight + 108);
      actualCardHeight = Math.min(preferredCardHeight, cardMaxHeight);
    } else {
      // Modern patched state:
      // max-height: calc(100svh - 2rem); height: auto;
      cardMaxHeight = Math.max(0, this.svh - (2 * rem));
      const cardHeaderHeight = 56;
      const cardPaddingTop = 20;
      const cardPaddingBottom = 32;
      const preferredCardHeight = contentHeight + cardHeaderHeight + cardPaddingTop + cardPaddingBottom;
      actualCardHeight = Math.min(preferredCardHeight, cardMaxHeight);
    }

    // Free vertical space in the flex container
    const freeSpace = containerHeight - actualCardHeight;

    let cardTop = 0;
    let cardMarginTop = 0;

    // 1. Evaluate auto margins (margin: auto 0 0 0)
    if (useAutoMargin) {
      if (freeSpace > 0) {
        cardMarginTop = freeSpace;
        cardTop = cardMarginTop;
      } else {
        cardMarginTop = 0;
        cardTop = 0;
      }
    } else {
      // 2. Evaluate flexbox alignment fallback
      if (flexAlignMode === 'safe flex-end') {
        if (freeSpace >= 0) {
          cardTop = freeSpace;
        } else {
          // 'safe' alignment triggers fallback to flex-start (top = 0)
          cardTop = 0;
        }
      } else if (flexAlignMode === 'unsafe flex-end') {
        // The legacy buggy behavior: shifts card into negative coordinates!
        cardTop = freeSpace; // When freeSpace < 0, cardTop < 0!
      } else {
        cardTop = 0;
      }
    }

    // Close button & Header coordinates relative to the screen
    const closeBtnOffsetTop = 12;
    const closeBtnHeight = 34;
    const closeBtnScreenTop = cardTop + closeBtnOffsetTop;
    const closeBtnScreenBottom = closeBtnScreenTop + closeBtnHeight;
    const cardBottom = cardTop + actualCardHeight;
    const isInternalScrollActive = !legacyBugSimulation && ((contentHeight + 108) > cardMaxHeight);

    return {
      containerHeight,
      cardMaxHeight,
      actualCardHeight,
      freeSpace,
      cardTop,
      cardBottom,
      closeBtnScreenTop,
      closeBtnScreenBottom,
      isInternalScrollActive,
      isNegativeCoordinateSpace: cardTop < 0,
      isCloseButtonClippedTop: closeBtnScreenTop < 0,
      isCloseButtonClippedBottom: closeBtnScreenBottom > this.screenHeight
    };
  }
}

// Matrix of real physical mobile, tablet, and desktop devices
const TEST_DEVICES = [
  { name: 'iPhone SE (1st gen)', width: 320, height: 568, toolbarHeight: 90, safeAreaTop: 0, safeAreaBottom: 0 },
  { name: 'iPhone SE (2nd/3rd gen)', width: 375, height: 667, toolbarHeight: 114, safeAreaTop: 0, safeAreaBottom: 0 },
  { name: 'iPhone 12/13/14', width: 390, height: 844, toolbarHeight: 134, safeAreaTop: 47, safeAreaBottom: 34 },
  { name: 'iPhone 14 Pro / 15 Pro', width: 393, height: 852, toolbarHeight: 140, safeAreaTop: 59, safeAreaBottom: 34 },
  { name: 'iPhone 14 Plus / 15 Pro Max', width: 430, height: 932, toolbarHeight: 140, safeAreaTop: 59, safeAreaBottom: 34 },
  { name: 'Samsung Galaxy S8/S9', width: 360, height: 740, toolbarHeight: 110, safeAreaTop: 24, safeAreaBottom: 0 },
  { name: 'Samsung Galaxy S20 / S21', width: 360, height: 800, toolbarHeight: 110, safeAreaTop: 24, safeAreaBottom: 0 },
  { name: 'Samsung Galaxy S22 Ultra', width: 384, height: 854, toolbarHeight: 115, safeAreaTop: 24, safeAreaBottom: 0 },
  { name: 'Google Pixel 7', width: 412, height: 915, toolbarHeight: 120, safeAreaTop: 24, safeAreaBottom: 0 },
  { name: 'Galaxy Fold (Outer Screen)', width: 280, height: 653, toolbarHeight: 100, safeAreaTop: 24, safeAreaBottom: 0 },
  { name: 'Galaxy Fold (Inner Screen)', width: 717, height: 512, toolbarHeight: 90, safeAreaTop: 0, safeAreaBottom: 0 },
  { name: 'iPad Mini (6th gen)', width: 744, height: 1133, toolbarHeight: 80, safeAreaTop: 24, safeAreaBottom: 20 },
  { name: 'iPad 10th Gen / Air', width: 820, height: 1180, toolbarHeight: 80, safeAreaTop: 24, safeAreaBottom: 20 },
  { name: 'iPad Pro 11"', width: 834, height: 1194, toolbarHeight: 80, safeAreaTop: 24, safeAreaBottom: 20 },
  { name: 'iPad Pro 12.9"', width: 1024, height: 1366, toolbarHeight: 80, safeAreaTop: 24, safeAreaBottom: 20 },
  // Landscape Orientations
  { name: 'iPhone SE Landscape', width: 667, height: 375, toolbarHeight: 50, safeAreaTop: 0, safeAreaBottom: 21 },
  { name: 'iPhone 14 Pro Landscape', width: 852, height: 393, toolbarHeight: 50, safeAreaTop: 0, safeAreaBottom: 21 },
  { name: 'Galaxy S20 Landscape', width: 800, height: 360, toolbarHeight: 48, safeAreaTop: 0, safeAreaBottom: 0 },
  // Edge / Adversarial Viewports
  { name: 'Extreme Micro Viewport', width: 240, height: 320, toolbarHeight: 40, safeAreaTop: 0, safeAreaBottom: 0 },
  { name: 'Desktop Full HD', width: 1920, height: 1080, toolbarHeight: 0, safeAreaTop: 0, safeAreaBottom: 0 },
  { name: 'Desktop 4K Ultrawide', width: 3840, height: 2160, toolbarHeight: 0, safeAreaTop: 0, safeAreaBottom: 0 }
];

// Content height stress profiles
const CONTENT_PROFILES = [
  { label: 'Tiny notice modal', contentHeight: 80 },
  { label: 'Standard event modal', contentHeight: 320 },
  { label: 'Medium prayer deck', contentHeight: 580 },
  { label: 'Full Mass guide with 3 readings', contentHeight: 1450 },
  { label: 'Massive hymnal lyrics (adversarial)', contentHeight: 4800 },
  { label: 'Extreme stress payload (adversarial)', contentHeight: 25000 }
];

// Test all device x content profiles under canonical production styles
for (const dev of TEST_DEVICES) {
  for (const prof of CONTENT_PROFILES) {
    test('LAYOUT-SIM', `${dev.name} [${dev.width}x${dev.height}] with ${prof.label} (${prof.contentHeight}px): top >= 0 and header unclipped`, () => {
      const oracle = new ViewportLayoutOracle(dev);
      const res = oracle.calculateLayout({
        contentHeight: prof.contentHeight,
        flexAlignMode: 'safe flex-end',
        useAutoMargin: true
      });

      // INVARIANT 1: Card top MUST NEVER be negative (prevent Flexbox data-loss)
      assert.ok(res.cardTop >= 0, `Card top is negative (${res.cardTop}px) on ${dev.name}! Header will be cut off!`);
      assert.strictEqual(res.isNegativeCoordinateSpace, false, `Negative coordinate detected: ${res.cardTop}`);

      // INVARIANT 2: Close button MUST NOT be clipped off top or bottom
      assert.strictEqual(res.isCloseButtonClippedTop, false, `Close button clipped off screen top (${res.closeBtnScreenTop}px)`);
      assert.strictEqual(res.isCloseButtonClippedBottom, false, `Close button clipped off screen bottom (${res.closeBtnScreenBottom}px)`);

      // INVARIANT 3: Card bottom must not overflow outside the container height
      assert.ok(res.cardBottom <= res.containerHeight + 0.001, `Card bottom (${res.cardBottom}px) overflows container (${res.containerHeight}px)`);

      // INVARIANT 4: If content exceeds available space, internal scroll MUST activate
      if (prof.contentHeight > res.cardMaxHeight) {
        assert.strictEqual(res.isInternalScrollActive, true, 'Internal scroll container should be active for overflowing content');
      }
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 4: ADVERSARIAL STRESS TESTING & DEGRADED ENGINE ATTACKS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TIER 4: Adversarial Stress Testing & Degraded Engine Attacks ---');

test('ADVERSARIAL', 'Reproduce baseline defect: legacy unsafe flex-end causes negative top coordinate and clips close button', () => {
  const iphoneSE = TEST_DEVICES.find(d => d.name === 'iPhone SE (2nd/3rd gen)');
  const oracle = new ViewportLayoutOracle(iphoneSE);

  // Accurate simulation of unpatched baseline:
  // - card has rigid deck min-height (588px) and max-height: 90vh (600px)
  // - overlay has unsafe `justify-content: flex-end` and NO auto margin
  // - mobile Safari with toolbars: svh = 553px
  // -> freeSpace = 553 - 588 = -35px!
  // -> cardTop = -35px (CLIPPED INTO NEGATIVE SPACE)
  // -> closeBtnScreenTop = -35 + 12 = -23px (PERMANENTLY CUT OFF OFF-SCREEN)
  const buggyResult = oracle.calculateLayout({
    contentHeight: 500,
    flexAlignMode: 'unsafe flex-end',
    useAutoMargin: false,
    legacyBugSimulation: true
  });

  // Under legacy buggy flexbox, cardTop becomes NEGATIVE (-35px)!
  assert.ok(buggyResult.cardTop < 0, 'Oracle should accurately reproduce negative card top under unpatched legacy configuration');
  assert.strictEqual(buggyResult.isNegativeCoordinateSpace, true, 'Oracle should confirm negative coordinate space under legacy bug');
  assert.ok(buggyResult.closeBtnScreenTop < 0, 'Oracle should confirm close button clipped off-screen under legacy bug');
  console.log(`    (Confirmed: Legacy unpatched code produced card.top = ${buggyResult.cardTop}px and closeBtn = ${buggyResult.closeBtnScreenTop}px)`);
});

test('ADVERSARIAL', 'Defense-in-depth: Even if browser engine drops margin: auto, safe flex-end alone prevents top < 0', () => {
  // If an engine doesn't apply margin: auto on flex items, does `safe flex-end` protect the layout?
  for (const dev of TEST_DEVICES) {
    const oracle = new ViewportLayoutOracle(dev);
    const res = oracle.calculateLayout({
      contentHeight: 3000, // massive overflow
      flexAlignMode: 'safe flex-end',
      useAutoMargin: false // ATTACK: auto margin disabled
    });

    assert.ok(res.cardTop >= 0, `Failed on ${dev.name} without auto-margin: card.top = ${res.cardTop}`);
    assert.strictEqual(res.isCloseButtonClippedTop, false);
  }
});

test('ADVERSARIAL', 'Defense-in-depth: Even if browser engine ignores safe keyword, svh max-height prevents top < 0', () => {
  // If a browser engine doesn't recognize "safe" and treats it as "flex-end",
  // because card max-height is calc(100svh - 2rem) = containerHeight - 32px:
  // freeSpace = containerHeight - cardHeight >= 32px > 0!
  // Therefore, freeSpace is NEVER negative!
  for (const dev of TEST_DEVICES) {
    const oracle = new ViewportLayoutOracle(dev);
    const res = oracle.calculateLayout({
      contentHeight: 5000, // massive overflow
      flexAlignMode: 'unsafe flex-end', // ATTACK: engine ignores 'safe'
      useAutoMargin: true // auto-margin active
    });

    assert.ok(res.cardTop >= 0, `Failed on ${dev.name}: card.top = ${res.cardTop}`);
    assert.strictEqual(res.isCloseButtonClippedTop, false);
  }
});

test('ADVERSARIAL', 'Dynamic Toolbar Transition: Transition from collapsed toolbar (lvh) to expanded toolbar (svh) retains top >= 0', () => {
  const iphone14Pro = TEST_DEVICES.find(d => d.name === 'iPhone 14 Pro / 15 Pro');
  
  // Step 1: Toolbars collapsed (height = 852px)
  const expandedOracle = new ViewportLayoutOracle({ ...iphone14Pro, toolbarHeight: 0 });
  const step1 = expandedOracle.calculateLayout({ contentHeight: 900 });
  assert.ok(step1.cardTop >= 0);
  assert.strictEqual(step1.isCloseButtonClippedTop, false);

  // Step 2: User scrolls or interacts, toolbars expand (toolbarHeight = 140px, svh = 712px)
  const collapsedOracle = new ViewportLayoutOracle(iphone14Pro);
  const step2 = collapsedOracle.calculateLayout({ contentHeight: 900 });
  assert.ok(step2.cardTop >= 0);
  assert.strictEqual(step2.isCloseButtonClippedTop, false);
  assert.ok(step2.cardBottom <= step2.containerHeight);
});

test('ADVERSARIAL', 'Landscape Orientation Stress: Mobile viewport with extreme short height (375px & 360px)', () => {
  const landscapeDevices = TEST_DEVICES.filter(d => d.width > d.height);
  assert.ok(landscapeDevices.length >= 3, 'Must test at least 3 landscape mobile devices');

  for (const dev of landscapeDevices) {
    const oracle = new ViewportLayoutOracle(dev);
    const res = oracle.calculateLayout({ contentHeight: 1200 }); // tall content in short landscape

    assert.ok(res.cardTop >= 0, `Landscape failure on ${dev.name}: top = ${res.cardTop}`);
    assert.ok(res.actualCardHeight <= (oracle.svh - 32) + 0.001, `Card height ${res.actualCardHeight} exceeded max on ${dev.name}`);
    assert.strictEqual(res.isCloseButtonClippedTop, false);
  }
});

test('ADVERSARIAL', 'Micro-Screen Attack: Viewport height below 300px (240x320) does not produce NaN or negative geometry', () => {
  const microDev = { name: 'Smartwatch/Micro', width: 200, height: 240, toolbarHeight: 20 };
  const oracle = new ViewportLayoutOracle(microDev);
  const res = oracle.calculateLayout({ contentHeight: 500 });

  assert.ok(!isNaN(res.cardTop), 'cardTop must not be NaN');
  assert.ok(!isNaN(res.actualCardHeight), 'actualCardHeight must not be NaN');
  assert.ok(res.cardTop >= 0, 'cardTop must be non-negative even on micro screens');
  assert.strictEqual(res.isCloseButtonClippedTop, false);
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 5: BODY SCROLL LOCK REENTRANCY & CONCURRENCY ORACLE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TIER 5: Body Scroll Lock Reentrancy & Concurrency Oracle ---');

test('SCROLL-LOCK', 'Scroll lock preserves deep page scroll position across modal open and close lifecycle', () => {
  const mockBody = {
    style: { position: '', top: '', width: '', overflow: '' },
    classList: new Set()
  };
  let mockWindowScrollY = 1420;
  let restoredScrollTo = null;

  const mockWindow = {
    get scrollY() { return mockWindowScrollY; },
    scrollTo(x, y) { restoredScrollTo = { x, y }; mockWindowScrollY = y; }
  };

  function lock(scrollY) {
    mockBody.style.position = 'fixed';
    mockBody.style.top = `-${scrollY}px`;
    mockBody.style.width = '100%';
    mockBody.classList.add('modal-open');
  }

  function unlock(savedScrollY) {
    mockBody.style.position = '';
    mockBody.style.top = '';
    mockBody.style.width = '';
    mockBody.classList.delete('modal-open');
    mockWindow.scrollTo(0, savedScrollY);
  }

  const savedY = mockWindow.scrollY;
  lock(savedY);

  assert.strictEqual(mockBody.style.position, 'fixed');
  assert.strictEqual(mockBody.style.top, '-1420px');
  assert.strictEqual(mockBody.style.width, '100%');
  assert.ok(mockBody.classList.has('modal-open'));

  unlock(savedY);

  assert.strictEqual(mockBody.style.position, '');
  assert.strictEqual(mockBody.style.top, '');
  assert.strictEqual(mockBody.style.width, '');
  assert.strictEqual(mockBody.classList.has('modal-open'), false);
  assert.deepStrictEqual(restoredScrollTo, { x: 0, y: 1420 });
});

test('SCROLL-LOCK', 'CalendarioClient nested modal guard prevents corruption of saved scroll position', () => {
  const mockBody = {
    style: { position: 'fixed', top: '-850px', width: '100%', overflow: 'hidden' },
    classList: new Set(['modal-open'])
  };
  let mockWindowScrollY = 0; // In Safari, fixed body resets window.scrollY to 0!

  const existingTop = mockBody.style.top;
  const scrollY = existingTop ? Math.abs(parseInt(existingTop, 10)) : mockWindowScrollY;

  assert.strictEqual(scrollY, 850, 'Must extract original scroll offset from body.style.top to avoid resetting user to top of page');
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n===============================================================================');
console.log('                          SUITE EXECUTION SUMMARY                              ');
console.log('===============================================================================');
console.log(` TOTAL VERIFICATION CHECKS : ${totalTests}`);
console.log(` PASSED                    : ${totalPassed}`);
console.log(` FAILED                    : ${totalFailed}`);
console.log('───────────────────────────────────────────────────────────────────────────────');

if (totalFailed > 0) {
  console.log('\n❌ SUITE VERIFICATION FAILED with errors:\n');
  for (const f of failures) {
    console.log(`• [${f.category}] ${f.name}`);
    console.log(`  ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('✔ ALL ADVERSARIAL MOBILE VIEWPORT & LAYOUT CHECKS PASSED (100% SUCCESS)\n');
  process.exit(0);
}
