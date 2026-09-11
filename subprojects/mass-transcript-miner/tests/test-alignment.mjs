// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(__dirname, '../../../src/data/liturgical_catalog_guadalupe.json');

console.log('--- Testing Subproject 2: Separation & Chat-Style Alignment Logic (Priest Right vs Public Left) ---');

const raw = fs.readFileSync(catalogPath, 'utf-8');
const catalog = JSON.parse(raw);

let priestCount = 0;
let publicCount = 0;
const priestSayings = [];
const publicResponses = [];

for (const step of catalog.steps) {
  for (const turn of step.turns) {
    if (turn.speaker === 'priest') {
      priestCount++;
      priestSayings.push(turn);
      // PRIEST REQUIREMENT: isLeft must be FALSE (align right -> .duet-right)
      assert.equal(
        turn.isLeft,
        false,
        `Priest turn ${turn.id} in ${step.id} must have isLeft: false (align right)`
      );
    } else {
      publicCount++;
      publicResponses.push(turn);
      // PUBLIC REQUIREMENT: isLeft must be TRUE (align left -> .duet-left)
      assert.equal(
        turn.isLeft,
        true,
        `Public turn ${turn.id} (${turn.speaker}) in ${step.id} must have isLeft: true (align left)`
      );
    }
  }
}

console.log(`  ✓ Total liturgical steps: ${catalog.steps.length}`);
console.log(`  ✓ Total turns processed: ${priestCount + publicCount}`);
console.log(`  ✓ Priest sayings separated: ${priestCount} turns (isLeft: false -> .duet-right)`);
console.log(`  ✓ Public responses separated: ${publicCount} turns (isLeft: true -> .duet-left)`);

assert.equal(priestCount, 33, 'Expected exactly 33 priest sayings');
assert.equal(publicCount, 48, 'Expected exactly 48 public responses');
assert.equal(priestCount + publicCount, 81, 'Expected exactly 81 turns in total');

// Verify CSS alignment simulation matching AppleMusicLyrics.tsx:
// if (line.isLeft && line.speaker !== undefined) lineClass += " duet-left";
// else if (line.speaker !== undefined && !line.isLeft) lineClass += " duet-right";
for (const turn of priestSayings) {
  let lineClass = 'lyric-line';
  if (turn.isLeft && turn.speaker !== undefined) lineClass += ' duet-left';
  else if (turn.speaker !== undefined && !turn.isLeft) lineClass += ' duet-right';

  assert.ok(lineClass.includes('duet-right'), `Priest turn ${turn.id} must render with duet-right`);
  assert.ok(!lineClass.includes('duet-left'), `Priest turn ${turn.id} must NOT render with duet-left`);
}

for (const turn of publicResponses) {
  let lineClass = 'lyric-line';
  if (turn.isLeft && turn.speaker !== undefined) lineClass += ' duet-left';
  else if (turn.speaker !== undefined && !turn.isLeft) lineClass += ' duet-right';

  assert.ok(lineClass.includes('duet-left'), `Public turn ${turn.id} must render with duet-left`);
  assert.ok(!lineClass.includes('duet-right'), `Public turn ${turn.id} must NOT render with duet-right`);
}

console.log('  ✓ Verified 100% compliance with AppleMusicLyrics.tsx (.duet-right vs .duet-left)');
console.log('✓ AC-3 Acceptance Criteria PASSED: Priest sayings separated with chat alignment metadata.\n');
