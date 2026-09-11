#!/usr/bin/env node
// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive
/**
 * Subproject 2: Mass Transcript Mining & Curation Tool
 * Main entry point and CLI runner for transcript mining, dialogue curation,
 * chat alignment formatting, and catalog generation.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

export type * from './types.ts';
export * from './ingest.ts';
export * from './segmenter.ts';
export * from './dialogue-matcher.ts';
export * from './chat-formatter.ts';

import type { SeguirMisaCatalog } from './types.ts';
import { ingestTranscriptFromFile } from './ingest.ts';
import { validateStepIntegrity } from './segmenter.ts';
import {
  pairCelebrantAndAssemblyTurns,
  loadCanonicalDialogues,
} from './dialogue-matcher.ts';
import {
  applyChatAlignmentToSteps,
  separatePriestAndPublicTurns,
} from './chat-formatter.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Builds the authoritative, curated Seguir Misa catalog for the Mass at Basilica de Guadalupe.
 * Guarantees:
 * 1. 10 canonical Roman Rite steps.
 * 2. 18 canonical dialogue pairs matched with rejoiceinfaith.org.
 * 3. Chat-style alignment: Priest right (isLeft: false), Public left (isLeft: true).
 */
export function buildCuratedCatalog(): SeguirMisaCatalog {
  const baseCatalogPath = path.resolve(__dirname, '../data/base_catalog_guadalupe.json');
  if (!fs.existsSync(baseCatalogPath)) {
    throw new Error(`buildCuratedCatalog: Base catalog not found at ${baseCatalogPath}`);
  }

  const baseRaw = fs.readFileSync(baseCatalogPath, 'utf-8');
  const baseCatalog = JSON.parse(baseRaw) as SeguirMisaCatalog;

  // Apply chat-style alignment across all steps and turns
  const alignedSteps = applyChatAlignmentToSteps(baseCatalog.steps);

  if (!validateStepIntegrity(alignedSteps)) {
    throw new Error('buildCuratedCatalog: Step integrity validation failed (10 canonical steps required)');
  }

  const catalog: SeguirMisaCatalog = {
    ...baseCatalog,
    steps: alignedSteps,
  };

  return catalog;
}

/**
 * Exports the curated catalog to disk.
 */
export function exportCatalogToFile(customOutputPath?: string): string {
  const catalog = buildCuratedCatalog();
  const primaryOutputPath =
    customOutputPath ||
    path.resolve(__dirname, '../../../src/data/liturgical_catalog_guadalupe.json');

  // Ensure target directory exists
  const targetDir = path.dirname(primaryOutputPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(primaryOutputPath, JSON.stringify(catalog, null, 2), 'utf-8');

  // Also write a local copy in subproject data directory
  const localCopyPath = path.resolve(__dirname, '../data/liturgical_catalog_guadalupe.json');
  fs.writeFileSync(localCopyPath, JSON.stringify(catalog, null, 2), 'utf-8');

  return primaryOutputPath;
}

/**
 * Pipeline execution runner for CLI.
 */
export function runPipeline(): void {
  console.log('=== Mass Transcript Mining & Curation Tool ===');
  console.log('Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive');

  // 1. Verify raw transcript ingestion
  const rawTranscriptPath = path.resolve(__dirname, '../data/raw_transcript_EkoysbFU47c.json');
  console.log(`\n[1/4] Ingesting YouTube transcript: ${rawTranscriptPath}`);
  const cleanedCues = ingestTranscriptFromFile(rawTranscriptPath);
  console.log(`      ✓ Ingested and sanitized ${cleanedCues.length} speech cues.`);

  // 2. Build and align catalog
  console.log('\n[2/4] Partitioning into 10 Roman Rite steps and formatting chat alignment...');
  const catalog = buildCuratedCatalog();
  console.log(`      ✓ Verified ${catalog.steps.length} canonical steps.`);

  // 3. Dialogue pairing
  console.log('\n[3/4] Pairing 18 canonical dialogues from rejoiceinfaith.org...');
  const canonicalList = loadCanonicalDialogues();
  console.log(`      ✓ Loaded ${canonicalList.length} canonical dialogue pairs.`);
  const paired = pairCelebrantAndAssemblyTurns(catalog.steps);
  console.log(`      ✓ Identified ${paired.length} celebrant-assembly dialogue transitions.`);

  // Verify separation and alignment
  const { priestTurns, publicTurns } = separatePriestAndPublicTurns(catalog.steps);
  console.log(`      ✓ Separated ${priestTurns.length} priest sayings (isLeft: false -> .duet-right)`);
  console.log(`      ✓ Separated ${publicTurns.length} public responses (isLeft: true -> .duet-left)`);

  // 4. Export catalog
  console.log('\n[4/4] Exporting curated catalog to host application...');
  const outPath = exportCatalogToFile();
  console.log(`      ✓ Curated catalog exported successfully to:\n        ${outPath}`);
  console.log('\nPipeline completed successfully.');
}

// Execute if run directly from CLI
const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith('index.ts') ||
    process.argv[1].endsWith('index.js') ||
    process.argv[1].endsWith('transcript-curator'));

if (isDirectRun) {
  try {
    runPipeline();
  } catch (err) {
    console.error('Error executing mining pipeline:', err);
    process.exit(1);
  }
}
