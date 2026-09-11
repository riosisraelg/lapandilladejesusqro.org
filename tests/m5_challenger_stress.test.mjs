#!/usr/bin/env node
/**
 * ============================================================================
 * ADVERSARIAL STRESS TEST SUITE — CHALLENGER M5
 * ============================================================================
 * Adversarially challenges:
 *   1. API Route /api/mass-readings (bad lang, invalid date, fallback handling)
 *   2. Chat-style alignment invariants in src/data/liturgical_catalog_guadalupe.json
 *   3. Subproject 1 Git & CalVer tag compliance and parent .gitignore isolation
 *   4. Subproject 2 Git absence verification
 * ============================================================================
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as net from 'node:net';
import { spawn, execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();

// ── Utility: Ephemeral Port Allocation ──
function getAvailablePort(startPort = 3200) {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(startPort, () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on('error', () => {
      getAvailablePort(startPort + 1).then(resolve, reject);
    });
  });
}

// ── Utility: Polling for server readiness ──
async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200 || res.status === 404) return true;
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

// ============================================================================
// TEST SUITE 1: API ROUTE ADVERSARIAL STRESS TESTING
// ============================================================================
test('M5 Challenge 1: API Route /api/mass-readings Adversarial & Fallback Stress', async (t) => {
  const port = await getAvailablePort(3250);
  const baseUrl = `http://localhost:${port}`;

  console.log(`[API Stress] Launching ephemeral Next.js production server on ${baseUrl}...`);
  const serverProc = spawn('npx', ['next', 'start', '-p', String(port)], {
    cwd: ROOT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: String(port), NODE_ENV: 'production' },
  });

  serverProc.stderr.on('data', (d) => {
    const msg = d.toString();
    if (!msg.includes('ExperimentalWarning')) {
      // log unexpected errors
    }
  });

  try {
    await waitForServer(`${baseUrl}/api/mass-readings?lang=es&date=2026-09-10`, 20000);

    await t.test('1.1 Invalid / malicious lang parameters gracefully fallback to Spanish (HTTP 200)', async () => {
      const badLangs = [
        'fr',
        '123',
        'undefined',
        'null',
        '',
        'unknown_locale',
        "'; DROP TABLE users;--",
        '<script>alert(1)</script>',
        '__proto__',
      ];

      for (const badLang of badLangs) {
        const url = `${baseUrl}/api/mass-readings?lang=${encodeURIComponent(badLang)}&date=2026-09-10`;
        const res = await fetch(url);
        assert.equal(res.status, 200, `Expected 200 for lang='${badLang}'`);
        const data = await res.json();
        assert.equal(data.language, 'es', `Bad lang '${badLang}' must default to 'es'`);
        assert.ok(data.firstReading?.citation, `First reading citation must be present for lang='${badLang}'`);
        assert.ok(data.psalm?.citation, `Psalm citation must be present for lang='${badLang}'`);
        assert.ok(data.gospel?.citation, `Gospel citation must be present for lang='${badLang}'`);
      }
    });

    await t.test('1.2 Case-insensitivity and alias normalization for lang parameter', async () => {
      const validCases = [
        { lang: 'EN', expectedLang: 'en', expectedSource: 'catholic-mass-readings' },
        { lang: 'En', expectedLang: 'en', expectedSource: 'catholic-mass-readings' },
        { lang: 'ES', expectedLang: 'es', expectedSource: 'spanish-mass-readings' },
        { lang: 'BOTH', expectedLang: 'bilingual', expectedSource: 'dual-scraper' },
        { lang: 'Both', expectedLang: 'bilingual', expectedSource: 'dual-scraper' },
        { lang: 'bilingual', expectedLang: 'bilingual', expectedSource: 'dual-scraper' },
        { lang: 'BiLiNgUaL', expectedLang: 'bilingual', expectedSource: 'dual-scraper' },
      ];

      for (const vc of validCases) {
        const url = `${baseUrl}/api/mass-readings?lang=${vc.lang}&date=2026-09-10`;
        const res = await fetch(url);
        assert.equal(res.status, 200, `Expected 200 for lang='${vc.lang}'`);
        const data = await res.json();
        assert.equal(data.language, vc.expectedLang, `Expected language '${vc.expectedLang}' for '${vc.lang}'`);
        assert.equal(data.source, vc.expectedSource, `Expected source '${vc.expectedSource}' for '${vc.lang}'`);
      }
    });

    await t.test('1.3 Adversarial date parameter stress (malformed, path traversal, out of bounds)', async () => {
      const adversarialDates = [
        { date: 'bad-date', desc: 'string literal bad-date' },
        { date: 'undefined', desc: 'string literal undefined' },
        { date: 'null', desc: 'string literal null' },
        { date: '../../../etc/passwd', desc: 'path traversal attempt' },
        { date: '2026-99-99', desc: 'invalid month/day iso' },
        { date: '99999999', desc: 'compact far future' },
        { date: 'abcdefgh', desc: '8 non-numeric characters' },
        { date: '2026.09.10', desc: 'dotted date' },
      ];

      for (const tc of adversarialDates) {
        const url = `${baseUrl}/api/mass-readings?date=${encodeURIComponent(tc.date)}`;
        const res = await fetch(url);
        assert.equal(res.status, 200, `Expected 200 for ${tc.desc}`);
        const data = await res.json();
        assert.ok(data.firstReading, `firstReading must exist for ${tc.desc}`);
        assert.ok(data.psalm, `psalm must exist for ${tc.desc}`);
        assert.ok(data.gospel, `gospel must exist for ${tc.desc}`);
      }
    });

    await t.test('1.4 Simulated upstream failure / timeout triggers HTTP 200 with isFallback: true', async () => {
      // Using an unreachable lectionary date far in future triggers upstream USCCB scraper failure and catches to fallback
      const futureDate = '9999-99-99';

      // 1.4.1 Spanish Fallback
      const esRes = await fetch(`${baseUrl}/api/mass-readings?date=${futureDate}&lang=es`);
      assert.equal(esRes.status, 200);
      const esData = await esRes.json();
      assert.equal(esData.isFallback, true, 'Spanish upstream failure must return isFallback: true');
      assert.equal(esData.source, 'fallback', 'Spanish upstream failure source must be fallback');
      assert.equal(esData.language, 'es');
      assert.ok(esData.firstReading.text.length > 50, 'Fallback first reading must be non-empty');
      assert.ok(esData.psalm.response.length > 5, 'Fallback psalm response must be non-empty');

      // 1.4.2 English Fallback
      const enRes = await fetch(`${baseUrl}/api/mass-readings?date=${futureDate}&lang=en`);
      assert.equal(enRes.status, 200);
      const enData = await enRes.json();
      assert.equal(enData.isFallback, true, 'English upstream failure must return isFallback: true');
      assert.equal(enData.source, 'fallback', 'English upstream failure source must be fallback');
      assert.equal(enData.language, 'en');
      assert.ok(enData.firstReading.text.length > 50, 'Fallback first reading must be non-empty');

      // 1.4.3 Bilingual Fallback
      const bothRes = await fetch(`${baseUrl}/api/mass-readings?date=${futureDate}&lang=both`);
      assert.equal(bothRes.status, 200);
      const bothData = await bothRes.json();
      assert.equal(bothData.isFallback, true, 'Bilingual upstream failure must return isFallback: true');
      assert.equal(bothData.source, 'fallback');
      assert.equal(bothData.language, 'bilingual');
      assert.ok(bothData.readings?.es, 'readings.es must exist in bilingual fallback');
      assert.ok(bothData.readings?.en, 'readings.en must exist in bilingual fallback');
      assert.equal(bothData.readings.es.isFallback, true);
      assert.equal(bothData.readings.en.isFallback, true);
    });
  } finally {
    serverProc.kill('SIGTERM');
  }
});

// ============================================================================
// TEST SUITE 2: LITURGICAL CATALOG CHAT-STYLE ALIGNMENT INVARIANTS
// ============================================================================
test('M5 Challenge 2: Chat-Style Alignment Invariants in liturgical_catalog_guadalupe.json', async (t) => {
  const catalogPath = path.resolve(ROOT_DIR, 'src/data/liturgical_catalog_guadalupe.json');
  assert.ok(fs.existsSync(catalogPath), 'liturgical_catalog_guadalupe.json must exist');

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  await t.test('2.1 Structure verification (10 steps, valid metadata, valid YouTube ID)', () => {
    assert.equal(catalog.youtubeVideoId, 'EkoysbFU47c');
    assert.equal(catalog.steps.length, 10, 'Must have 10 liturgical steps');
  });

  const allTurns = [];
  for (const step of catalog.steps) {
    assert.ok(Array.isArray(step.turns), `Step ${step.id} must have turns array`);
    for (const turn of step.turns) {
      allTurns.push({ ...turn, parentStepId: step.id });
    }
  }

  await t.test(`2.2 Total turn count validation (found ${allTurns.length} turns, expected exactly 81)`, () => {
    assert.equal(allTurns.length, 81, 'Total turns in liturgical catalog must be exactly 81');
  });

  await t.test('2.3 Invariant: ZERO turns have undefined isLeft', () => {
    const missingIsLeft = allTurns.filter((t) => t.isLeft === undefined || t.isLeft === null);
    assert.equal(missingIsLeft.length, 0, `Found ${missingIsLeft.length} turns with undefined isLeft`);
  });

  await t.test('2.4 Invariant: 100% of priest turns have isLeft === false (.duet-right)', () => {
    const priestTurns = allTurns.filter((t) => t.speaker === 'priest');
    assert.ok(priestTurns.length > 0, 'Priest turns must exist');
    const violatingPriestTurns = priestTurns.filter((t) => t.isLeft !== false);
    assert.equal(
      violatingPriestTurns.length,
      0,
      `Found ${violatingPriestTurns.length} priest turns violating isLeft === false: ${JSON.stringify(violatingPriestTurns.map((t) => t.id))}`
    );
    assert.equal(priestTurns.length, 33, 'Expected 33 priest turns in canonical transcript');
  });

  await t.test('2.5 Invariant: 100% of public/non-priest turns have isLeft === true (.duet-left)', () => {
    const publicTurns = allTurns.filter((t) => t.speaker !== 'priest');
    assert.ok(publicTurns.length > 0, 'Public/non-priest turns must exist');
    const violatingPublicTurns = publicTurns.filter((t) => t.isLeft !== true);
    assert.equal(
      violatingPublicTurns.length,
      0,
      `Found ${violatingPublicTurns.length} public turns violating isLeft === true: ${JSON.stringify(violatingPublicTurns.map((t) => t.id))}`
    );
    assert.equal(publicTurns.length, 48, 'Expected 48 public/non-priest turns in canonical transcript');

    const distinctSpeakers = new Set(publicTurns.map((t) => t.speaker));
    assert.deepEqual(
      Array.from(distinctSpeakers).sort(),
      ['all', 'assembly', 'choir', 'lector'].sort(),
      'Public speakers must belong to canonical choir/assembly/all/lector set'
    );
  });

  await t.test('2.6 Invariant: All turns possess complete bilingual texts and valid step references', () => {
    for (const turn of allTurns) {
      assert.ok(turn.id && typeof turn.id === 'string', `Turn must have string id: ${turn.id}`);
      assert.ok(turn.text?.es && turn.text.es.trim().length > 0, `Turn ${turn.id} missing Spanish text`);
      assert.ok(turn.text?.en && turn.text.en.trim().length > 0, `Turn ${turn.id} missing English text`);
      assert.equal(turn.stepId, turn.parentStepId, `Turn ${turn.id} stepId must match parent step id`);
    }
  });

  await t.test('2.7 UI alignment mapping verification in AppleMusicLyrics.tsx', () => {
    const lyricsCompPath = path.resolve(ROOT_DIR, 'src/app/AppleMusicLyrics.tsx');
    const lyricsSrc = fs.readFileSync(lyricsCompPath, 'utf8');

    // Verify presence of duet-left and duet-right logic
    assert.ok(
      lyricsSrc.includes('line.isLeft && line.speaker !== undefined'),
      'AppleMusicLyrics must check line.isLeft for duet-left'
    );
    assert.ok(
      lyricsSrc.includes('lineClass += " duet-left"'),
      'AppleMusicLyrics must apply duet-left class'
    );
    assert.ok(
      lyricsSrc.includes('lineClass += " duet-right"'),
      'AppleMusicLyrics must apply duet-right class'
    );
  });
});

// ============================================================================
// TEST SUITE 3: SUBPROJECT 1 GIT & CALVER INVARIANT STRESS TESTING
// ============================================================================
test('M5 Challenge 3: Subproject 1 Git & CalVer Invariant Verification', async (t) => {
  const sub1Dir = path.resolve(ROOT_DIR, 'subprojects/spanish-mass-readings');
  const sub1GitDir = path.join(sub1Dir, '.git');

  await t.test('3.1 Subproject 1 has its own initialized .git directory', () => {
    assert.ok(fs.existsSync(sub1GitDir), 'subprojects/spanish-mass-readings/.git must exist');
    const stat = fs.statSync(sub1GitDir);
    assert.ok(stat.isDirectory(), 'subprojects/spanish-mass-readings/.git must be a directory');
  });

  await t.test('3.2 Subproject 1 Git tag 2026.09.0 matches HEAD commit exactly', () => {
    const headCommit = execSync('git rev-parse HEAD', { cwd: sub1Dir, encoding: 'utf8' }).trim();
    const tagCommit = execSync('git rev-parse 2026.09.0^{commit}', { cwd: sub1Dir, encoding: 'utf8' }).trim();
    const pointsAtHead = execSync('git tag -l --points-at HEAD', { cwd: sub1Dir, encoding: 'utf8' }).trim();

    assert.ok(headCommit.length === 40, 'HEAD commit hash must be 40 chars');
    assert.equal(tagCommit, headCommit, `Tag 2026.09.0 commit (${tagCommit}) must match HEAD commit (${headCommit})`);
    assert.ok(pointsAtHead.includes('2026.09.0'), `git tag --points-at HEAD must include 2026.09.0, got: '${pointsAtHead}'`);
  });

  await t.test('3.3 Tag format complies strictly with Calendar Versioning (CalVer) regex ^\\d{4}\\.\\d{2}\\.\\d+$', () => {
    const calverRegex = /^\d{4}\.\d{2}\.\d+$/;
    const tags = execSync('git tag -l', { cwd: sub1Dir, encoding: 'utf8' })
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    assert.ok(tags.includes('2026.09.0'), 'Tags list must include 2026.09.0');
    for (const tag of tags) {
      assert.match(tag, calverRegex, `Tag '${tag}' must strictly adhere to CalVer YYYY.MM.MINOR regex`);
    }
  });

  await t.test('3.4 Parent repository .gitignore strictly contains /subprojects/spanish-mass-readings/.git', () => {
    const parentGitignorePath = path.resolve(ROOT_DIR, '.gitignore');
    const gitignoreContent = fs.readFileSync(parentGitignorePath, 'utf8');

    const lines = gitignoreContent.split('\n').map((l) => l.trim());
    const match = lines.some((l) => l === '/subprojects/spanish-mass-readings/.git' || l === 'subprojects/spanish-mass-readings/.git');
    assert.ok(
      match,
      "Parent .gitignore must explicitly contain '/subprojects/spanish-mass-readings/.git'"
    );

    // Verify git check-ignore returns positive
    const checkIgnoreResult = execSync('git check-ignore subprojects/spanish-mass-readings/.git', {
      cwd: ROOT_DIR,
      encoding: 'utf8',
    }).trim();
    assert.equal(checkIgnoreResult, 'subprojects/spanish-mass-readings/.git');
  });

  await t.test('3.5 Parent repository git index does not track any files inside subproject .git', () => {
    const trackedSubGit = execSync('git ls-files subprojects/spanish-mass-readings/.git', {
      cwd: ROOT_DIR,
      encoding: 'utf8',
    }).trim();
    assert.equal(trackedSubGit, '', 'Parent git index must not track any files in subprojects/spanish-mass-readings/.git');
  });
});

// ============================================================================
// TEST SUITE 4: SUBPROJECT 2 GIT ABSENCE INVARIANT
// ============================================================================
test('M5 Challenge 4: Subproject 2 (mass-transcript-miner) Git Absence Invariant', async (t) => {
  const sub2Dir = path.resolve(ROOT_DIR, 'subprojects/mass-transcript-miner');
  const sub2GitDir = path.join(sub2Dir, '.git');

  await t.test('4.1 subprojects/mass-transcript-miner has NO .git folder or file', () => {
    assert.ok(fs.existsSync(sub2Dir), 'subprojects/mass-transcript-miner directory must exist');
    assert.equal(
      fs.existsSync(sub2GitDir),
      false,
      'subprojects/mass-transcript-miner/.git MUST NOT exist (Subproject 2 must not be initialized as a git repo)'
    );
  });

  await t.test('4.2 subprojects/mass-transcript-miner package.json exists and is valid', () => {
    const pkgPath = path.join(sub2Dir, 'package.json');
    assert.ok(fs.existsSync(pkgPath), 'package.json must exist');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.equal(pkg.name, 'mass-transcript-miner');
  });
});
