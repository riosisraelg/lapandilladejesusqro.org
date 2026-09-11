// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dialoguesPath = path.resolve(__dirname, '../data/canonical_dialogues_rejoice.json');
const catalogPath = path.resolve(__dirname, '../../../src/data/liturgical_catalog_guadalupe.json');

console.log('--- Testing 18 Canonical RejoiceInFaith Dialogue Pairs ---');

const rawDialogues = fs.readFileSync(dialoguesPath, 'utf-8');
const canonicalDialogues = JSON.parse(rawDialogues);

assert.equal(canonicalDialogues.length, 18, 'Must have exactly 18 canonical dialogue pairs from rejoiceinfaith.org');

const rawCatalog = fs.readFileSync(catalogPath, 'utf-8');
const catalog = JSON.parse(rawCatalog);

// Extract transitions
const transitions = [];
for (const step of catalog.steps) {
  for (let i = 0; i < step.turns.length - 1; i++) {
    const t = step.turns[i];
    const next = step.turns[i + 1];
    if (t.speaker === 'priest' && next.speaker === 'assembly') {
      transitions.push({
        stepId: step.id,
        priestTurn: t,
        assemblyTurn: next,
      });
    }
  }
}

console.log(`  ✓ Found ${transitions.length} celebrant-assembly dialogue transitions in catalog`);
assert.ok(transitions.length >= 18, 'Must have at least 18 dialogue transitions');

canonicalDialogues.forEach((pair, idx) => {
  assert.ok(pair.dialogueKey, `Dialogue pair ${idx} must have key`);
  assert.ok(pair.celebrantPrompt.es, `Dialogue pair ${pair.dialogueKey} must have Spanish prompt`);
  assert.ok(pair.assemblyResponse.es, `Dialogue pair ${pair.dialogueKey} must have Spanish response`);
  assert.ok(pair.assemblyResponse.en, `Dialogue pair ${pair.dialogueKey} must have English response`);
  console.log(`  ✓ [Pair ${idx + 1}/18] ${pair.dialogueKey}: "${pair.assemblyResponse.es}" / "${pair.assemblyResponse.en}"`);
});

console.log('✓ All 18 canonical dialogue pairs verified successfully!\n');
