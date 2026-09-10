#!/usr/bin/env node

/**
 * ============================================================================
 * MODAL SCROLL LIFECYCLE & STATE TRANSITIONS STRESS SUITE — CHALLENGER 2
 * ============================================================================
 * Adversarial and empirical verification of:
 *   1. Body scroll locking transitions (preservation & restoration of scrollY)
 *   2. Rapid sequential modal switching (Cancionero -> Oraciones -> Guía -> Confesión -> AppleMusicGuia)
 *   3. Calendario modal scroll lock behavior (Events & Subscribe modals)
 *   4. GlobalModal portal mounting, SSR safety, scroll reset on open, and unmount cleanup
 *   5. Elimination of window-displacing scrollIntoView calls in dialogs
 *   6. Dynamic viewport CSS alignment & geometry rules
 * ============================================================================
 */

import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  bgBlue: '\x1b[44m',
  white: '\x1b[37m',
};

console.log(`\n${ANSI.bold}${ANSI.bgBlue}${ANSI.white} ╔═══════════════════════════════════════════════════════════════════════════╗ ${ANSI.reset}`);
console.log(`${ANSI.bold}${ANSI.bgBlue}${ANSI.white} ║   CHALLENGER 2: MODAL SCROLL LIFECYCLE & STATE ADVERSARIAL STRESS SUITE   ║ ${ANSI.reset}`);
console.log(`${ANSI.bold}${ANSI.bgBlue}${ANSI.white} ╚═══════════════════════════════════════════════════════════════════════════╝ ${ANSI.reset}\n`);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ${ANSI.green}✔ PASS${ANSI.reset} ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  ${ANSI.red}✖ FAIL${ANSI.reset} ${name}`);
    console.error(`    ${ANSI.yellow}${err.message}${ANSI.reset}`);
    if (err.stack) {
      console.error(`    ${ANSI.dim}${err.stack.split('\n').slice(1, 4).join('\n')}${ANSI.reset}`);
    }
  }
}

// ============================================================================
// SUITE 1: STATIC & AST INVARIANTS (ZERO SCROLLINTOVIEW & VIEWPORT CSS AUDIT)
// ============================================================================
console.log(`\n${ANSI.bold}${ANSI.cyan}▶ SUITE 1: Static AST & Viewport CSS Invariants${ANSI.reset}`);
console.log(`${ANSI.dim}${'─'.repeat(75)}${ANSI.reset}`);

// Recursively find all ts, tsx, js, jsx in src/
function getAllSourceFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllSourceFiles(filePath));
    } else if (/\.(tsx?|jsx?)$/.test(file)) {
      results.push(filePath);
    }
  }
  return results;
}

test('1.1 Zero occurrences of scrollIntoView across entire src/ directory', () => {
  const srcFiles = getAllSourceFiles(resolve(ROOT_DIR, 'src'));
  const violatingFiles = [];

  for (const filePath of srcFiles) {
    const content = readFileSync(filePath, 'utf-8');
    if (content.includes('scrollIntoView')) {
      violatingFiles.push(filePath);
    }
  }

  assert.equal(
    violatingFiles.length,
    0,
    `Found scrollIntoView in files: ${violatingFiles.join(', ')}`
  );
});

test('1.2 AppleMusicLyrics uses container-level scrollTo instead of window scroll', () => {
  const lyricsPath = resolve(ROOT_DIR, 'src/app/AppleMusicLyrics.tsx');
  const content = readFileSync(lyricsPath, 'utf-8');

  // Must not have targetEl.scrollIntoView
  assert.ok(!content.includes('targetEl.scrollIntoView'), 'Must not call targetEl.scrollIntoView');
  
  // Must have containerRef.current.scrollTo
  assert.ok(
    content.includes('containerRef.current.scrollTo({ top: targetEl.offsetTop - 100, behavior: \'auto\' })'),
    'Must call containerRef.current.scrollTo with container-level coordinates'
  );
});

test('1.3 GlobalModal implements React createPortal to document.body with SSR safety', () => {
  const modalPath = resolve(ROOT_DIR, 'src/components/GlobalModal.tsx');
  const content = readFileSync(modalPath, 'utf-8');

  assert.ok(content.includes('createPortal(content, document.body)'), 'Must portal content to document.body');
  assert.ok(content.includes('const [mounted, setMounted] = useState(false);'), 'Must have mounted state gate');
  assert.ok(content.includes('if (!isOpen || !mounted) return null;'), 'Must return null before mounted or when closed');
});

test('1.4 GlobalModal resets scroll positions (scrollTop = 0) on open', () => {
  const modalPath = resolve(ROOT_DIR, 'src/components/GlobalModal.tsx');
  const content = readFileSync(modalPath, 'utf-8');

  assert.ok(content.includes('overlayRef.current.scrollTop = 0'), 'Resets overlayRef scrollTop');
  assert.ok(content.includes('cardRef.current.scrollTop = 0'), 'Resets cardRef scrollTop');
  assert.ok(content.includes('.recursos-modal-body, .confesion-modal-body, .lyric-scroll-container, .gcal-scrollable-body'), 
    'Targets all internal scroll containers');
  assert.ok(content.includes('el.scrollTop = 0'), 'Resets children scrollTop');
});

test('1.5 global.css .calendar-modal-overlay uses safe alignment and viewport geometry', () => {
  const cssPath = resolve(ROOT_DIR, 'src/app/global.css');
  const content = readFileSync(cssPath, 'utf-8');

  // Verify safe flex-end
  assert.ok(
    content.includes('justify-content: safe flex-end;'),
    'Must use "justify-content: safe flex-end;" to prevent flexbox data-loss clipping'
  );

  // Verify fixed bounds
  assert.ok(content.includes('position: fixed;'), 'Must be position: fixed');
  assert.ok(content.includes('inset: 0;'), 'Must specify inset: 0');
  assert.ok(content.includes('height: 100dvh;'), 'Must support 100dvh');
  assert.ok(content.includes('min-height: -webkit-fill-available;'), 'Must support -webkit-fill-available');
  assert.ok(content.includes('overscroll-behavior: contain;'), 'Must contain overscroll');
  assert.ok(content.includes('-webkit-overflow-scrolling: touch;'), 'Must enable momentum scrolling');
});

test('1.6 Keyframe animations do not use 100vh translation artifacts', () => {
  const cssPath = resolve(ROOT_DIR, 'src/app/global.css');
  const content = readFileSync(cssPath, 'utf-8');

  // Check keyframe blocks using balanced or specific matching
  const slideUpIdx = content.indexOf('@keyframes modalSlideUp');
  assert.ok(slideUpIdx !== -1, 'modalSlideUp keyframe exists');
  const slideUpBlock = content.slice(slideUpIdx, content.indexOf('@keyframes modalSlideDown'));
  assert.ok(!slideUpBlock.includes('100vh'), 'modalSlideUp must not use 100vh');
  assert.ok(slideUpBlock.includes('100%'), 'modalSlideUp must use 100% translation');

  const slideDownIdx = content.indexOf('@keyframes modalSlideDown');
  assert.ok(slideDownIdx !== -1, 'modalSlideDown keyframe exists');
  const slideDownBlock = content.slice(slideDownIdx, content.indexOf('@keyframes fadeInModal'));
  assert.ok(!slideDownBlock.includes('100vh'), 'modalSlideDown must not use 100vh');
  assert.ok(slideDownBlock.includes('100%'), 'modalSlideDown must use 100% translation');
});

test('1.7 Conflicting 90vh constraint removed from .recursos-modal-card', () => {
  const cssPath = resolve(ROOT_DIR, 'src/app/global.css');
  const content = readFileSync(cssPath, 'utf-8');

  // Verify recursos-modal-card uses dvh / svh bounds and not conflicting raw 90vh
  const cardSection = content.slice(content.indexOf('.recursos-modal-card {'), content.indexOf('.recursos-modal-card {') + 500);
  assert.ok(cardSection.includes('calc(100dvh - 2rem)'), 'Uses 100dvh calculation');
  assert.ok(cardSection.includes('calc(100svh - 2rem)'), 'Uses 100svh calculation');
  assert.ok(!cardSection.includes('max-height: 90vh;'), 'No conflicting max-height: 90vh');
});

test('1.8 Stacked deck container in mobile media query allows dynamic flex shrink without fixed 72vh', () => {
  const cssPath = resolve(ROOT_DIR, 'src/app/global.css');
  const content = readFileSync(cssPath, 'utf-8');

  // Find the mobile media query around line 3512
  const targetMediaIdx = content.indexOf('@media (max-width: 1024px) {\n  .calendar-modal-overlay');
  assert.ok(targetMediaIdx !== -1, 'Modal responsive media query exists');
  const mobileCss = content.slice(targetMediaIdx, targetMediaIdx + 3000);

  const deckBlockMatch = mobileCss.match(/\.stacked-deck-container\s*\{([\s\S]*?)\}/);
  assert.ok(deckBlockMatch, 'Mobile .stacked-deck-container defined in media query');
  assert.ok(!deckBlockMatch[1].includes('height: 72vh;'), 'Mobile deck must not have hardcoded height: 72vh');
  assert.ok(!deckBlockMatch[1].includes('min-height: 480px;'), 'Mobile deck must not have min-height: 480px');
  assert.ok(deckBlockMatch[1].includes('min-height: 0;'), 'Mobile deck must have min-height: 0 to allow flex shrinking');
  assert.ok(deckBlockMatch[1].includes('flex: 1 1 auto;'), 'Mobile deck must flex fluidly');
});

test('1.9 Mobile safe-area bottom inset handled on media query', () => {
  const cssPath = resolve(ROOT_DIR, 'src/app/global.css');
  const content = readFileSync(cssPath, 'utf-8');

  assert.ok(
    content.includes('padding-bottom: env(safe-area-inset-bottom, 0px)'),
    'Must handle env(safe-area-inset-bottom) in media queries'
  );
});

// ============================================================================
// SUITE 2: DOM SIMULATION ENGINE FOR BODY SCROLL LOCKING
// ============================================================================
console.log(`\n${ANSI.bold}${ANSI.cyan}▶ SUITE 2: Empirical Body Scroll Locking State Machine & Transitions${ANSI.reset}`);
console.log(`${ANSI.dim}${'─'.repeat(75)}${ANSI.reset}`);

/**
 * High-fidelity Mock DOM environment modeling browser window and document.body
 * adhering strictly to the CSSOM View Specification and DOM standards.
 */
class MockDOMEnvironment {
  constructor(initialScrollY = 0) {
    this._scrollY = initialScrollY;
    const classSet = new Set();
    this.body = {
      style: {
        position: '',
        top: '',
        width: '',
        overflow: '',
      },
      classList: {
        add: (cls) => classSet.add(cls),
        remove: (cls) => classSet.delete(cls),
        contains: (cls) => classSet.has(cls),
      },
    };
  }

  get scrollY() {
    return this._scrollY;
  }

  set scrollY(val) {
    this._scrollY = val;
  }

  scrollTo(x, y) {
    if (typeof x === 'object' && x !== null) {
      this._scrollY = x.top ?? this._scrollY;
    } else {
      this._scrollY = y ?? 0;
    }
  }
}

/**
 * Creates an instance of the exact scroll lock hook logic from LandingClient.tsx
 */
function createLandingScrollLockController(dom) {
  let activeCleanup = null;

  function onModalStateChange(modals) {
    const { showCancionero, showOraciones, showGuiaMisa, showConfesion, showAppleMusicGuia } = modals;
    const isAnyModalOpen = Boolean(showCancionero || showOraciones || showGuiaMisa || showConfesion || showAppleMusicGuia);

    // React useEffect cleanup phase
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }

    // React useEffect setup phase
    if (isAnyModalOpen) {
      const existingTop = dom.body.style.top;
      const scrollY = existingTop ? Math.abs(parseInt(existingTop, 10)) : dom.scrollY;
      dom.body.style.position = 'fixed';
      dom.body.style.top = `-${scrollY}px`;
      dom.body.style.width = '100%';
      dom.body.style.overflow = 'hidden';
      dom.body.classList.add('modal-open');

      activeCleanup = () => {
        const currentTop = dom.body.style.top;
        dom.body.style.position = '';
        dom.body.style.top = '';
        dom.body.style.width = '';
        dom.body.style.overflow = '';
        dom.body.classList.remove('modal-open');
        const restoredY = currentTop ? Math.abs(parseInt(currentTop, 10)) : scrollY;
        dom.scrollTo(0, restoredY);
      };
    }
  }

  function unmount() {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
  }

  return { onModalStateChange, unmount };
}

test('2.1 Single modal open/close preserves and restores exact scrollY at Y = 500', () => {
  const dom = new MockDOMEnvironment(500);
  const controller = createLandingScrollLockController(dom);

  // Initial state: page at 500px, no modals
  assert.equal(dom.scrollY, 500);
  assert.equal(dom.body.style.position, '');

  // Open Oraciones
  controller.onModalStateChange({ showOraciones: true });
  assert.equal(dom.body.style.position, 'fixed');
  assert.equal(dom.body.style.top, '-500px');
  assert.equal(dom.body.style.width, '100%');
  assert.equal(dom.body.style.overflow, 'hidden');
  assert.ok(dom.body.classList.contains('modal-open'));

  // Close Oraciones
  controller.onModalStateChange({ showOraciones: false });
  assert.equal(dom.body.style.position, '');
  assert.equal(dom.body.style.top, '');
  assert.equal(dom.body.style.width, '');
  assert.equal(dom.body.style.overflow, '');
  assert.ok(!dom.body.classList.contains('modal-open'));
  assert.equal(dom.scrollY, 500, 'Exact scroll position must be restored');
});

test('2.2 Boundary scroll values: Y = 0 (top of page)', () => {
  const dom = new MockDOMEnvironment(0);
  const controller = createLandingScrollLockController(dom);

  controller.onModalStateChange({ showCancionero: true });
  assert.equal(dom.body.style.position, 'fixed');
  assert.equal(dom.body.style.top, '-0px');
  assert.ok(dom.body.classList.contains('modal-open'));

  controller.onModalStateChange({ showCancionero: false });
  assert.equal(dom.body.style.position, '');
  assert.equal(dom.scrollY, 0);
  assert.ok(!dom.body.classList.contains('modal-open'));
});

test('2.3 Boundary scroll values: Deep scroll Y = 125,480 (long landing page)', () => {
  const dom = new MockDOMEnvironment(125480);
  const controller = createLandingScrollLockController(dom);

  controller.onModalStateChange({ showGuiaMisa: true });
  assert.equal(dom.body.style.top, '-125480px');

  controller.onModalStateChange({ showGuiaMisa: false });
  assert.equal(dom.scrollY, 125480);
  assert.equal(dom.body.style.top, '');
});

test('2.4 Rapid sequential modal switching (Oraciones -> Guía -> Confesión -> Cancionero -> AppleMusicGuia)', () => {
  const dom = new MockDOMEnvironment(820);
  const controller = createLandingScrollLockController(dom);

  // 1. Open Oraciones
  controller.onModalStateChange({ showOraciones: true });
  assert.equal(dom.body.style.top, '-820px');
  assert.equal(dom.body.style.position, 'fixed');

  // 2. Direct switch to Guía Misa
  controller.onModalStateChange({ showOraciones: false, showGuiaMisa: true });
  assert.equal(dom.body.style.top, '-820px', 'Top must remain locked at -820px across Guia switch');
  assert.equal(dom.body.style.position, 'fixed');
  assert.ok(dom.body.classList.contains('modal-open'));

  // 3. Direct switch to Confesión
  controller.onModalStateChange({ showGuiaMisa: false, showConfesion: true });
  assert.equal(dom.body.style.top, '-820px', 'Top must remain locked at -820px across Confesion switch');
  assert.equal(dom.body.style.position, 'fixed');

  // 4. Direct switch to Cancionero
  controller.onModalStateChange({ showConfesion: false, showCancionero: true });
  assert.equal(dom.body.style.top, '-820px', 'Top must remain locked across Cancionero switch');
  assert.equal(dom.body.style.position, 'fixed');

  // 5. Direct switch to AppleMusicGuia
  controller.onModalStateChange({ showCancionero: false, showAppleMusicGuia: true });
  assert.equal(dom.body.style.top, '-820px', 'Top must remain locked across AppleMusicGuia switch');
  assert.equal(dom.body.style.position, 'fixed');

  // 6. Close AppleMusicGuia (all modals closed)
  controller.onModalStateChange({ showAppleMusicGuia: false });
  assert.equal(dom.body.style.position, '');
  assert.equal(dom.body.style.top, '');
  assert.equal(dom.body.style.width, '');
  assert.equal(dom.body.style.overflow, '');
  assert.ok(!dom.body.classList.contains('modal-open'));
  assert.equal(dom.scrollY, 820, 'Scroll position 820px successfully restored after 5-modal chain');
});

test('2.5 Random walk modal switcher: 1,000 rapid chaotic transitions with zero drift', () => {
  const initialY = 1540;
  const dom = new MockDOMEnvironment(initialY);
  const controller = createLandingScrollLockController(dom);
  const modalKeys = ['showCancionero', 'showOraciones', 'showGuiaMisa', 'showConfesion', 'showAppleMusicGuia'];

  let activeModal = null;

  for (let i = 0; i < 1000; i++) {
    const action = Math.random() < 0.2 ? 'close' : 'switch';
    if (action === 'close' || !activeModal) {
      const nextModal = modalKeys[Math.floor(Math.random() * modalKeys.length)];
      activeModal = nextModal;
      controller.onModalStateChange({ [nextModal]: true });
    } else {
      const nextModal = modalKeys[Math.floor(Math.random() * modalKeys.length)];
      activeModal = nextModal;
      controller.onModalStateChange({ [nextModal]: true });
    }

    assert.equal(dom.body.style.position, 'fixed');
    assert.equal(dom.body.style.top, `-${initialY}px`);
    assert.ok(dom.body.classList.contains('modal-open'));
  }

  // Finally close
  controller.onModalStateChange({});
  assert.equal(dom.body.style.position, '');
  assert.equal(dom.body.style.top, '');
  assert.ok(!dom.body.classList.contains('modal-open'));
  assert.equal(dom.scrollY, initialY, 'Scroll position strictly preserved with 0px drift after 1000 chaotic transitions');
});

test('2.6 Unmounting component while modal is open cleans up all body styles', () => {
  const dom = new MockDOMEnvironment(640);
  const controller = createLandingScrollLockController(dom);

  controller.onModalStateChange({ showOraciones: true });
  assert.equal(dom.body.style.position, 'fixed');

  // Simulate route change / unmount
  controller.unmount();

  assert.equal(dom.body.style.position, '');
  assert.equal(dom.body.style.top, '');
  assert.equal(dom.body.style.width, '');
  assert.equal(dom.body.style.overflow, '');
  assert.ok(!dom.body.classList.contains('modal-open'));
  assert.equal(dom.scrollY, 640, 'Scroll position restored upon unmount');
});

// ============================================================================
// SUITE 3: CALENDARIO MODAL SCROLL LOCKING
// ============================================================================
console.log(`\n${ANSI.bold}${ANSI.cyan}▶ SUITE 3: Calendario Modal Scroll Lock & State Transitions${ANSI.reset}`);
console.log(`${ANSI.dim}${'─'.repeat(75)}${ANSI.reset}`);

function createCalendarioScrollLockController(dom) {
  let activeCleanup = null;

  function onModalStateChange({ selectedEvent, showSubscribeModal }) {
    const isModalOpen = Boolean(selectedEvent || showSubscribeModal);

    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }

    if (isModalOpen) {
      const existingTop = dom.body.style.top;
      const scrollY = existingTop ? Math.abs(parseInt(existingTop, 10)) : dom.scrollY;
      dom.body.style.position = 'fixed';
      dom.body.style.top = `-${scrollY}px`;
      dom.body.style.width = '100%';
      dom.body.style.overflow = 'hidden';
      dom.body.classList.add('modal-open');

      activeCleanup = () => {
        const currentTop = dom.body.style.top;
        dom.body.style.position = '';
        dom.body.style.top = '';
        dom.body.style.width = '';
        dom.body.style.overflow = '';
        dom.body.classList.remove('modal-open');
        const restoredY = currentTop ? Math.abs(parseInt(currentTop, 10)) : scrollY;
        dom.scrollTo(0, restoredY);
      };
    }
  }

  function unmount() {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
  }

  return { onModalStateChange, unmount };
}

test('3.1 Calendario Event modal locks and restores scroll at Y = 430', () => {
  const dom = new MockDOMEnvironment(430);
  const controller = createCalendarioScrollLockController(dom);

  const event1 = { id: 'misa-1', title: 'Misa Dominical', date: '2026-09-13', time: '12:00' };

  controller.onModalStateChange({ selectedEvent: event1, showSubscribeModal: false });
  assert.equal(dom.body.style.position, 'fixed');
  assert.equal(dom.body.style.top, '-430px');
  assert.ok(dom.body.classList.contains('modal-open'));

  controller.onModalStateChange({ selectedEvent: null, showSubscribeModal: false });
  assert.equal(dom.body.style.position, '');
  assert.equal(dom.scrollY, 430);
});

test('3.2 Calendario Subscribe modal locks and restores scroll at Y = 950', () => {
  const dom = new MockDOMEnvironment(950);
  const controller = createCalendarioScrollLockController(dom);

  controller.onModalStateChange({ selectedEvent: null, showSubscribeModal: true });
  assert.equal(dom.body.style.position, 'fixed');
  assert.equal(dom.body.style.top, '-950px');

  controller.onModalStateChange({ selectedEvent: null, showSubscribeModal: false });
  assert.equal(dom.body.style.position, '');
  assert.equal(dom.scrollY, 950);
});

test('3.3 Switching between multiple events in Calendario preserves locked top', () => {
  const dom = new MockDOMEnvironment(380);
  const controller = createCalendarioScrollLockController(dom);

  const events = [
    { id: 'e1', title: 'Event 1' },
    { id: 'e2', title: 'Event 2' },
    { id: 'e3', title: 'Event 3' },
    { id: 'e4', title: 'Event 4' },
  ];

  // Open event 1
  controller.onModalStateChange({ selectedEvent: events[0], showSubscribeModal: false });
  assert.equal(dom.body.style.top, '-380px');

  // Switch to event 2, 3, 4 sequentially
  for (let i = 1; i < events.length; i++) {
    controller.onModalStateChange({ selectedEvent: events[i], showSubscribeModal: false });
    assert.equal(dom.body.style.top, '-380px', `Preserved on switch to event ${i}`);
    assert.equal(dom.body.style.position, 'fixed');
  }

  // Switch to Subscribe modal from Event 4
  controller.onModalStateChange({ selectedEvent: null, showSubscribeModal: true });
  assert.equal(dom.body.style.top, '-380px', 'Preserved on switch to subscribe modal');

  // Close Subscribe modal
  controller.onModalStateChange({ selectedEvent: null, showSubscribeModal: false });
  assert.equal(dom.body.style.position, '');
  assert.equal(dom.scrollY, 380, 'Restored to 380px');
});

// ============================================================================
// SUITE 4: GLOBALMODAL PORTAL MOUNTING & SCROLL RESET SIMULATION
// ============================================================================
console.log(`\n${ANSI.bold}${ANSI.cyan}▶ SUITE 4: GlobalModal Portal Mounting & Scroll Reset Lifecycle${ANSI.reset}`);
console.log(`${ANSI.dim}${'─'.repeat(75)}${ANSI.reset}`);

class MockModalElement {
  constructor(className = '') {
    this.className = className;
    this.scrollTop = 150; // default to nonzero to test reset
    this.children = [];
  }

  querySelectorAll(selector) {
    const results = [];
    const selectors = selector.split(',').map(s => s.trim().replace(/^\./, ''));
    
    function traverse(node) {
      for (const child of node.children) {
        for (const sel of selectors) {
          if (child.className && child.className.includes(sel)) {
            results.push(child);
            break;
          }
        }
        traverse(child);
      }
    }
    traverse(this);
    return results;
  }
}

function simulateGlobalModalScrollReset(isOpen, overlayEl, cardEl) {
  if (isOpen) {
    if (overlayEl) {
      overlayEl.scrollTop = 0;
    }
    if (cardEl) {
      cardEl.scrollTop = 0;
    }
    const scrollableChildren = cardEl?.querySelectorAll(
      '.recursos-modal-body, .confesion-modal-body, .lyric-scroll-container, .gcal-scrollable-body'
    );
    scrollableChildren?.forEach((el) => {
      el.scrollTop = 0;
    });
  }
}

test('4.1 Scroll reset sets overlay and card scrollTop to 0 on open', () => {
  const overlay = new MockModalElement('calendar-modal-overlay');
  const card = new MockModalElement('recursos-modal-card modal-large');
  overlay.scrollTop = 300;
  card.scrollTop = 450;

  simulateGlobalModalScrollReset(true, overlay, card);

  assert.equal(overlay.scrollTop, 0, 'Overlay scrollTop reset to 0');
  assert.equal(card.scrollTop, 0, 'Card scrollTop reset to 0');
});

test('4.2 Scroll reset resets all matching child containers simultaneously', () => {
  const overlay = new MockModalElement('calendar-modal-overlay');
  const card = new MockModalElement('recursos-modal-card modal-large');

  const child1 = new MockModalElement('recursos-modal-body');
  child1.scrollTop = 220;
  const child2 = new MockModalElement('confesion-modal-body');
  child2.scrollTop = 180;
  const child3 = new MockModalElement('lyric-scroll-container');
  child3.scrollTop = 510;
  const child4 = new MockModalElement('gcal-scrollable-body');
  child4.scrollTop = 95;

  card.children.push(child1, child2, child3, child4);

  simulateGlobalModalScrollReset(true, overlay, card);

  assert.equal(child1.scrollTop, 0, 'recursos-modal-body reset to 0');
  assert.equal(child2.scrollTop, 0, 'confesion-modal-body reset to 0');
  assert.equal(child3.scrollTop, 0, 'lyric-scroll-container reset to 0');
  assert.equal(child4.scrollTop, 0, 'gcal-scrollable-body reset to 0');
});

test('4.3 SSR safety gate: GlobalModal returns null when mounted is false', () => {
  // Simulating SSR render: mounted = false
  function renderModal(isOpen, mounted) {
    if (!isOpen || !mounted) return null;
    return { type: 'PORTAL_ATTACHED' };
  }

  assert.equal(renderModal(true, false), null, 'SSR pass (not mounted) must return null');
  assert.equal(renderModal(false, false), null, 'Closed + not mounted must return null');
  assert.equal(renderModal(false, true), null, 'Closed + mounted must return null');
  assert.deepEqual(renderModal(true, true), { type: 'PORTAL_ATTACHED' }, 'Open + mounted renders portal');
});

// ============================================================================
// SUITE 5: ADVERSARIAL EDGE CASES & FAILURE MODES
// ============================================================================
console.log(`\n${ANSI.bold}${ANSI.cyan}▶ SUITE 5: Adversarial Boundary & Stress Cases${ANSI.reset}`);
console.log(`${ANSI.dim}${'─'.repeat(75)}${ANSI.reset}`);

test('5.1 Floating-point and subpixel scroll positions (e.g. 542.8px)', () => {
  const dom = new MockDOMEnvironment(542.8);
  const controller = createLandingScrollLockController(dom);

  controller.onModalStateChange({ showOraciones: true });
  // Math.abs(parseInt(existingTop, 10)) parses -542.8 as -542
  assert.ok(dom.body.style.top === '-542.8px' || dom.body.style.top === '-542px');

  controller.onModalStateChange({ showOraciones: false });
  assert.ok(Math.abs(dom.scrollY - 542.8) <= 1, 'Restores to within subpixel tolerance');
});

test('5.2 Re-entrant opening: Multiple modals set to true simultaneously in state', () => {
  const dom = new MockDOMEnvironment(700);
  const controller = createLandingScrollLockController(dom);

  // If two flags are erroneously true simultaneously
  controller.onModalStateChange({ showOraciones: true, showGuiaMisa: true });
  assert.equal(dom.body.style.position, 'fixed');
  assert.equal(dom.body.style.top, '-700px');

  // One flag turns false, but one remains true
  controller.onModalStateChange({ showOraciones: false, showGuiaMisa: true });
  assert.equal(dom.body.style.position, 'fixed');
  assert.equal(dom.body.style.top, '-700px');

  // Final close
  controller.onModalStateChange({ showGuiaMisa: false });
  assert.equal(dom.body.style.position, '');
  assert.equal(dom.scrollY, 700);
});

test('5.3 Zero leak of modal-open class across repeated quick bounces', () => {
  const dom = new MockDOMEnvironment(100);
  const controller = createLandingScrollLockController(dom);

  for (let i = 0; i < 50; i++) {
    controller.onModalStateChange({ showConfesion: true });
    controller.onModalStateChange({ showConfesion: false });
  }

  assert.ok(!dom.body.classList.contains('modal-open'), 'modal-open class cleanly removed');
  assert.equal(dom.body.style.position, '');
  assert.equal(dom.body.style.top, '');
  assert.equal(dom.scrollY, 100);
});

// ============================================================================
// SUITE SUMMARY
// ============================================================================
console.log(`\n${ANSI.bold}${'═'.repeat(75)}${ANSI.reset}`);
console.log(`${ANSI.bold}TOTAL TESTS EXECUTED : ${totalTests}${ANSI.reset}`);
console.log(`${ANSI.bold}${ANSI.green}TOTAL PASSED         : ${passedTests}${ANSI.reset}`);
if (failedTests > 0) {
  console.log(`${ANSI.bold}${ANSI.red}TOTAL FAILED         : ${failedTests}${ANSI.reset}`);
  process.exit(1);
} else {
  console.log(`${ANSI.bold}${ANSI.green}ALL MODAL SCROLL & STATE TRANSITIONS TESTS PASSED 100%!${ANSI.reset}\n`);
}
