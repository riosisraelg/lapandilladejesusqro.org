#!/usr/bin/env node
/**
 * Cancionero Monthly Extraction & Migration CLI Wrapper (Node.js)
 * La Pandilla de Jesús Qro (lapandilladejesusqro.org)
 *
 * Provides a native Node.js CLI interface wrapping scripts/extract_cancionero.py
 * for seamless compatibility with npm run / node scripts invocations.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScript = path.join(__dirname, 'extract_cancionero.py');
const args = [pythonScript, ...process.argv.slice(2)];

const proc = spawn('python3', args, {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..')
});

proc.on('close', (code) => {
  process.exit(code ?? 0);
});

proc.on('error', (err) => {
  console.error('Failed to execute extract_cancionero.py:', err);
  process.exit(1);
});
