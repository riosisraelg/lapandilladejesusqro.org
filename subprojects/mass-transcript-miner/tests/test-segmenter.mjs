// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(__dirname, '../../../src/data/liturgical_catalog_guadalupe.json');

console.log('--- Testing 10 Roman Rite Liturgical Step Segmentation ---');

const raw = fs.readFileSync(catalogPath, 'utf-8');
const catalog = JSON.parse(raw);

assert.equal(catalog.steps.length, 10, 'Must have exactly 10 canonical Roman Rite steps');

const expectedIds = [
  'sec-1-rito-inicial',
  'sec-2-acto-penitencial',
  'sec-3-gloria',
  'sec-4-oracion-colecta',
  'sec-5-liturgia-palabra',
  'sec-6-homilia',
  'sec-7-oracion-universal',
  'sec-8-liturgia-eucaristica',
  'sec-9-rito-comunion',
  'sec-10-rito-conclusion',
];

catalog.steps.forEach((step, idx) => {
  assert.equal(step.id, expectedIds[idx], `Step ${idx} must be ${expectedIds[idx]}`);
  assert.ok(step.title.es.length > 0, `Step ${step.id} must have Spanish title`);
  assert.ok(step.title.en.length > 0, `Step ${step.id} must have English title`);
  assert.ok(Array.isArray(step.turns), `Step ${step.id} must have turns array`);
  console.log(`  ✓ [Step ${idx + 1}/10] ${step.id}: ${step.title.es} (${step.turns.length} turns)`);
});

console.log('✓ All 10 Roman Rite steps segmented and verified successfully!\n');
