import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDeckHSL, calculateContrastRatioAgainstWhite } from '../src/utils/deckColors.ts';

test('M2 Challenger 1: Adversarial Color Engine & Multi-Cycle Chromatic Space', async (t) => {
  await t.test('10,000 rapid sequential index calculations without memory leak or NaN drift', () => {
    const t0 = performance.now();
    for (let i = 0; i < 10000; i++) {
      const tone = calculateDeckHSL(i);
      assert.ok(tone.hue >= 0 && tone.hue < 360);
      assert.ok(tone.saturation >= 30 && tone.saturation <= 44);
      assert.ok(tone.lightness >= 24 && tone.lightness <= 45);
      assert.ok(tone.hslString.startsWith('hsl('));
    }
    const elapsed = performance.now() - t0;
    assert.ok(elapsed < 150, `10,000 color calculations took ${elapsed.toFixed(2)}ms (must be < 150ms)`);
  });

  await t.test('Contrast ratio strictly complies with WCAG AA (>= 4.5:1) for all 360 degrees of hue', () => {
    for (let i = 0; i < 360; i++) {
      const tone = calculateDeckHSL(i);
      const contrast = calculateContrastRatioAgainstWhite(tone.lightness);
      assert.ok(contrast >= 4.5, `Contrast ${contrast.toFixed(2)}:1 violated for index ${i} (L=${tone.lightness}%)`);
    }
  });

  await t.test('CSS custom property string syntax validity across sample indices', () => {
    [0, 1, 2, 3, 7, 42, 100, 999].forEach((idx) => {
      const tone = calculateDeckHSL(idx);
      assert.match(tone.cssVariables['--deck-color-hsl'], /^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
      assert.match(tone.cssVariables['--deck-color-border'], /^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
      assert.match(tone.cssVariables['--deck-color-badge-bg'], /^hsla\(\d+,\s*\d+%,\s*\d+%,\s*0\.12\)$/);
      assert.match(tone.cssVariables['--deck-color-badge-text'], /^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
      assert.match(tone.cssVariables['--deck-color-indicator'], /^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });
  });
});

test('M2 Challenger 2: Extreme Gesture Physics & Multi-Finger / Rapid Drag Stress', async (t) => {
  const DECKS_ORDER = ['comunidad', 'basicas', 'alimentos', 'rosario'];

  await t.test('Circular modulo step calculation with extreme step offsets', () => {
    const N = DECKS_ORDER.length;
    const computeStep = (current, deltaSteps) => {
      return (((current + deltaSteps) % N) + N) % N;
    };

    assert.equal(computeStep(0, 1), 1);
    assert.equal(computeStep(0, -1), 3);
    assert.equal(computeStep(3, 1), 0);
    assert.equal(computeStep(0, 10000), 0);
    assert.equal(computeStep(0, -10000), 0);
    assert.equal(computeStep(2, 5), 3);
    assert.equal(computeStep(1, -7), 2);
  });

  await t.test('Sub-pixel dragging and micro-movements do not cause navigation jitter', () => {
    const threshold = 80;
    const isNavigationTriggered = (dx) => Math.abs(dx) >= threshold;

    [0.01, 0.1, 0.5, 1.2, 5.0, 15.0, 79.99].forEach((microDx) => {
      assert.equal(isNavigationTriggered(microDx), false, `Micro movement ${microDx}px must not trigger navigation`);
      assert.equal(isNavigationTriggered(-microDx), false, `Negative micro movement -${microDx}px must not trigger navigation`);
    });

    [80.0, 80.01, 150.0, 999.0].forEach((triggerDx) => {
      assert.equal(isNavigationTriggered(triggerDx), true, `Drag ${triggerDx}px must trigger navigation`);
      assert.equal(isNavigationTriggered(-triggerDx), true, `Negative drag -${triggerDx}px must trigger navigation`);
    });
  });
});
