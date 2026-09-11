// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive
/**
 * Test Suite: Mass Transcript Mining & Curation Tool
 * Verifies:
 * 1. Ingestion and cleaning of raw YouTube Mass transcript (video EkoysbFU47c).
 * 2. 10 Roman Rite steps partitioning.
 * 3. Separation of priest sayings from public responses.
 * 4. Chat-style alignment logic (Priest Right vs Public Left) for Seguir Misa modal.
 * 5. Pairing with 18 canonical assembly responses from rejoiceinfaith.org.
 * 6. Exported catalog schema and data integrity in host application.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  cleanCueText,
  isMusicOrSoundCue,
  ingestRawTranscript,
  ingestTranscriptFromFile,
} from '../src/ingest.ts';
import {
  getStepDefinitions,
  classifyCueToStep,
  segmentTranscriptIntoSteps,
  validateStepIntegrity,
} from '../src/segmenter.ts';
import {
  loadCanonicalDialogues,
  getCanonicalDialogueByKey,
  matchDialogue,
  pairCelebrantAndAssemblyTurns,
  getPairedDialogueByKey,
  KNOWN_PAIRED_KEYS,
} from '../src/dialogue-matcher.ts';
import {
  formatTurnAlignment,
  getAlignmentClass,
  applyChatAlignmentToSteps,
  separatePriestAndPublicTurns,
  formatStepForLyricsModal,
  formatCatalogForLyricsModal,
} from '../src/chat-formatter.ts';
import {
  buildCuratedCatalog,
  exportCatalogToFile,
} from '../src/index.ts';
import type { RawTranscriptCue, SeguirMisaCatalog } from '../src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAW_TRANSCRIPT_PATH = path.resolve(__dirname, '../data/raw_transcript_EkoysbFU47c.json');
const HOST_CATALOG_PATH = path.resolve(__dirname, '../../../src/data/liturgical_catalog_guadalupe.json');

describe('Subproject 2: Mass Transcript Mining & Curation Tool', () => {

  describe('1. YouTube Auto-Transcript Ingestion & Sanitization', () => {
    it('should strip music and noise tags [Música], [Aplausos] from raw cue text', () => {
      const dirty1 = '[Música] El Señor esté con ustedes [Aplausos]';
      assert.equal(cleanCueText(dirty1), 'El Señor esté con ustedes');

      const dirty2 = '   [Musica]   Gloria a Dios en el cielo   [Risas]  ';
      assert.equal(cleanCueText(dirty2), 'Gloria a Dios en el cielo');

      const dirty3 = '[Silencio]';
      assert.equal(cleanCueText(dirty3), '');
      assert.equal(isMusicOrSoundCue(dirty3), true);
    });

    it('should ingest and sanitize raw YouTube transcript file (video EkoysbFU47c)', () => {
      assert.ok(fs.existsSync(RAW_TRANSCRIPT_PATH), `Raw transcript must exist at ${RAW_TRANSCRIPT_PATH}`);
      const cues = ingestTranscriptFromFile(RAW_TRANSCRIPT_PATH);

      assert.ok(Array.isArray(cues));
      assert.equal(cues.length, 773);

      // Verify cues have valid timestamp numbers and text
      for (const cue of cues) {
        assert.ok(typeof cue.startSeconds === 'number');
        assert.ok(typeof cue.endSeconds === 'number');
        assert.ok(cue.endSeconds >= cue.startSeconds);
        assert.ok(typeof cue.text === 'string');
        assert.ok(!cue.text.includes('[Música]'));
        assert.ok(!cue.text.includes('[Aplausos]'));
      }

      // Verify authentic celebration excerpts are preserved
      const fullText = cues.map((c) => c.text).join(' ');
      assert.ok(fullText.includes('Pueblo'));
      assert.ok(fullText.includes('sacerdotal'));
      assert.ok(fullText.includes('La paz y la caridad'));
      assert.ok(fullText.includes('Ezequiel Mayagón López'));
      assert.ok(fullText.includes('tercera guerra mundial'));
    });
  });

  describe('2. Canonical 10 Roman Rite Step Segmentation', () => {
    it('should provide definitions for exactly 10 canonical Roman Rite steps in order', () => {
      const stepDefs = getStepDefinitions();
      assert.equal(stepDefs.length, 10);

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

      assert.deepEqual(stepDefs.map((s) => s.id), expectedIds);
    });

    it('should partition transcript cues into 10 step buckets based on time boundaries', () => {
      const cues = ingestTranscriptFromFile(RAW_TRANSCRIPT_PATH);
      const stepMap = segmentTranscriptIntoSteps(cues);

      assert.equal(stepMap.size, 10);
      assert.ok((stepMap.get('sec-1-rito-inicial')?.length ?? 0) > 0);
      assert.ok((stepMap.get('sec-5-liturgia-palabra')?.length ?? 0) > 0);
      assert.ok((stepMap.get('sec-8-liturgia-eucaristica')?.length ?? 0) > 0);
      assert.ok((stepMap.get('sec-9-rito-comunion')?.length ?? 0) > 0);
    });

    it('should validate step integrity of curated catalog', () => {
      const catalog = buildCuratedCatalog();
      assert.equal(validateStepIntegrity(catalog.steps), true);
      assert.equal(catalog.steps.length, 10);
    });
  });

  describe('3. Separation of Priest Sayings from Public Responses', () => {
    it('should strictly separate priest sayings from public responses across all 81 turns', () => {
      const catalog = buildCuratedCatalog();
      const { priestTurns, publicTurns } = separatePriestAndPublicTurns(catalog.steps);

      assert.equal(priestTurns.length, 33, 'Must identify exactly 33 priest sayings');
      assert.equal(publicTurns.length, 48, 'Must identify exactly 48 public responses');
      assert.equal(priestTurns.length + publicTurns.length, 81, 'Total turns must equal 81');

      // Assert all priest turns have speaker === 'priest'
      for (const turn of priestTurns) {
        assert.equal(turn.speaker, 'priest');
        assert.ok(turn.exactPriestSayingEs || turn.text.es, 'Priest turn must have text');
      }

      // Assert all public turns have public speakers
      for (const turn of publicTurns) {
        assert.ok(
          turn.speaker === 'assembly' ||
            turn.speaker === 'choir' ||
            turn.speaker === 'lector' ||
            turn.speaker === 'all',
          `Turn ${turn.id} must have a public speaker role, got ${turn.speaker}`
        );
      }
    });

    it('should capture authentic verbatim priest sayings extracted from YouTube transcript', () => {
      const catalog = buildCuratedCatalog();
      const { priestTurns } = separatePriestAndPublicTurns(catalog.steps);

      // Greeting (00:07:58)
      const greeting = priestTurns.find((t) => t.id === 'turn-1-4-saludo');
      assert.ok(greeting);
      assert.equal(
        greeting.exactPriestSayingEs,
        'La paz y la caridad y la fe de parte de Dios Padre y de Jesucristo el Señor estén con todos ustedes.'
      );
      assert.equal(greeting.timecode, '00:07:58');

      // Monition naming Ezequiel Mayagón López (00:08:11)
      const monition = priestTurns.find((t) => t.id === 'turn-1-6-monicion-intenciones');
      assert.ok(monition);
      assert.ok(monition.exactPriestSayingEs?.includes('Ezequiel Mayagón López'));
      assert.ok(monition.exactPriestSayingEs?.includes('casita de nuestra madre María de Guadalupe'));

      // Collect Prayer (00:12:58)
      const collect = priestTurns.find((t) => t.id === 'turn-4-1-colecta');
      assert.ok(collect);
      assert.ok(collect.exactPriestSayingEs?.includes('Cristo, sumo y eterno sacerdote'));

      // Gospel Proclamation (00:20:33)
      const gospelIntro = priestTurns.find((t) => t.id === 'turn-5-7-evangelio-anuncio');
      assert.ok(gospelIntro);
      assert.equal(gospelIntro.exactPriestSayingEs, 'Del santo evangelio según San Lucas.');

      // Homily excerpt (00:23:33)
      const homily = priestTurns.find((t) => t.id === 'turn-6-1-homilia');
      assert.ok(homily);
      assert.ok(homily.exactPriestSayingEs?.includes('tercera guerra mundial a pedazos'));

      // Eucharistic Consecration (00:40:49)
      const bread = priestTurns.find((t) => t.id === 'turn-8-15-consagracion-pan');
      assert.ok(bread);
      assert.ok(bread.exactPriestSayingEs?.includes('Tomen y coman todos de él'));

      // Dismissal rubric (00:52:48)
      const dismissal = priestTurns.find((t) => t.id === 'turn-10-4-despido-rubrica');
      assert.ok(dismissal);
      assert.ok(dismissal.exactPriestSayingEs?.includes('acompañaremos al Señor en procesión'));
    });
  });

  describe('4. Chat-Style Alignment Logic (Priest Right vs Public Left)', () => {
    it('should assign isLeft: false to priest sayings and isLeft: true to public responses', () => {
      const catalog = buildCuratedCatalog();

      for (const step of catalog.steps) {
        for (const turn of step.turns) {
          if (turn.speaker === 'priest') {
            assert.equal(
              turn.isLeft,
              false,
              `Priest turn ${turn.id} must have isLeft: false for right alignment`
            );
            assert.equal(
              getAlignmentClass(turn),
              'duet-right',
              `Priest turn ${turn.id} must map to class "duet-right"`
            );
          } else {
            assert.equal(
              turn.isLeft,
              true,
              `Public turn ${turn.id} (${turn.speaker}) must have isLeft: true for left alignment`
            );
            assert.equal(
              getAlignmentClass(turn),
              'duet-left',
              `Public turn ${turn.id} must map to class "duet-left"`
            );
          }
        }
      }
    });

    it('should format catalog for Seguir Misa modal adhering to AppleMusicLyrics contract', () => {
      const catalog = buildCuratedCatalog();
      const modalLines = formatCatalogForLyricsModal(catalog, 'both');

      assert.ok(modalLines.length > 81, 'Should include section headers and turns');

      // Check section titles
      const sectionHeaders = modalLines.filter((l) => l.text.startsWith('---SECTION---'));
      assert.equal(sectionHeaders.length, 10, 'Must have 10 section headers');

      // Check duet-right lines correspond to priest
      const rightLines = modalLines.filter((l) => l.className.includes('duet-right'));
      assert.equal(rightLines.length, 33, 'All 33 priest turns must format with duet-right');
      for (const rl of rightLines) {
        assert.equal(rl.isLeft, false);
        assert.equal(rl.speaker, 'priest');
      }

      // Check duet-left lines correspond to public
      const leftLines = modalLines.filter((l) => l.className.includes('duet-left'));
      assert.equal(leftLines.length, 48, 'All 48 public turns must format with duet-left');
      for (const ll of leftLines) {
        assert.equal(ll.isLeft, true);
        assert.notEqual(ll.speaker, 'priest');
      }
    });
  });

  describe('5. Pairing with 18 Canonical RejoiceInFaith Assembly Responses', () => {
    it('should load all 18 canonical dialogue pairs from rejoiceinfaith.org', () => {
      const dialogues = loadCanonicalDialogues();
      assert.equal(dialogues.length, 18);

      const allKeys = Object.values(KNOWN_PAIRED_KEYS);
      assert.equal(allKeys.length, 18);

      for (const key of allKeys) {
        const canonical = getCanonicalDialogueByKey(key);
        assert.ok(canonical, `Canonical dialogue pair must exist for key ${key}`);
        assert.ok(canonical.celebrantPrompt.es.length > 0);
        assert.ok(canonical.celebrantPrompt.en.length > 0);
        assert.ok(canonical.assemblyResponse.es.length > 0);
        assert.ok(canonical.assemblyResponse.en.length > 0);
      }
    });

    it('should pair celebrant prompts with bilingual responses across all 18 keys', () => {
      const catalog = buildCuratedCatalog();
      const paired = pairCelebrantAndAssemblyTurns(catalog.steps);

      assert.ok(paired.length >= 18);

      // 1. GREETING
      const greeting = getPairedDialogueByKey(paired, 'GREETING');
      assert.ok(greeting);
      assert.equal(greeting.assemblyResponse.es, 'Y con tu espíritu.');
      assert.equal(greeting.assemblyResponse.en, 'And with your spirit.');

      // 2. PENITENTIAL_ACT
      const penitential = getPairedDialogueByKey(paired, 'PENITENTIAL_ACT');
      assert.ok(penitential);
      assert.equal(penitential.assemblyResponse.es, 'Amén.');
      assert.equal(penitential.assemblyResponse.en, 'Amen.');

      // 3. COLLECT
      const collect = getPairedDialogueByKey(paired, 'COLLECT');
      assert.ok(collect);
      assert.equal(collect.assemblyResponse.es, 'Amén.');
      assert.equal(collect.assemblyResponse.en, 'Amen.');

      // 4. GOSPEL_DIALOGUE_GREETING
      const gospelGreet = getPairedDialogueByKey(paired, 'GOSPEL_DIALOGUE_GREETING');
      assert.ok(gospelGreet);
      assert.equal(gospelGreet.assemblyResponse.es, 'Y con tu espíritu.');
      assert.equal(gospelGreet.assemblyResponse.en, 'And with your spirit.');

      // 5. GOSPEL_DIALOGUE_ACCLAMATION
      const gospelAccl = getPairedDialogueByKey(paired, 'GOSPEL_DIALOGUE_ACCLAMATION');
      assert.ok(gospelAccl);
      assert.equal(gospelAccl.assemblyResponse.es, 'Gloria a ti, Señor.');
      assert.equal(gospelAccl.assemblyResponse.en, 'Glory to you, O Lord.');

      // 6. GOSPEL_DIALOGUE_DISMISSAL
      const gospelDism = getPairedDialogueByKey(paired, 'GOSPEL_DIALOGUE_DISMISSAL');
      assert.ok(gospelDism);
      assert.equal(gospelDism.assemblyResponse.es, 'Gloria a ti, Señor Jesús.');
      assert.equal(gospelDism.assemblyResponse.en, 'Praise to you, Lord Jesus Christ.');

      // 7. ORATE_FRATRES
      const orate = getPairedDialogueByKey(paired, 'ORATE_FRATRES');
      assert.ok(orate);
      assert.ok(orate.assemblyResponse.es.includes('El Señor reciba de tus manos este sacrificio'));
      assert.ok(orate.assemblyResponse.en.includes('May the Lord accept the sacrifice at your hands'));

      // 8. OFFERTORY_PRAYER
      const offertory = getPairedDialogueByKey(paired, 'OFFERTORY_PRAYER');
      assert.ok(offertory);
      assert.equal(offertory.assemblyResponse.es, 'Amén.');
      assert.equal(offertory.assemblyResponse.en, 'Amen.');

      // 9. PREFACE_DIALOGUE_GREETING
      const prefGreet = getPairedDialogueByKey(paired, 'PREFACE_DIALOGUE_GREETING');
      assert.ok(prefGreet);
      assert.equal(prefGreet.assemblyResponse.es, 'Y con tu espíritu.');
      assert.equal(prefGreet.assemblyResponse.en, 'And with your spirit.');

      // 10. PREFACE_DIALOGUE_SURSUM
      const sursum = getPairedDialogueByKey(paired, 'PREFACE_DIALOGUE_SURSUM');
      assert.ok(sursum);
      assert.equal(sursum.assemblyResponse.es, 'Lo tenemos levantado hacia el Señor.');
      assert.equal(sursum.assemblyResponse.en, 'We lift them up to the Lord.');

      // 11. PREFACE_DIALOGUE_GRATIAS
      const gratias = getPairedDialogueByKey(paired, 'PREFACE_DIALOGUE_GRATIAS');
      assert.ok(gratias);
      assert.equal(gratias.assemblyResponse.es, 'Es justo y necesario.');
      assert.equal(gratias.assemblyResponse.en, 'It is right and just.');

      // 12. MEMORIAL_ACCLAMATION
      const memorial = getPairedDialogueByKey(paired, 'MEMORIAL_ACCLAMATION');
      assert.ok(memorial);
      assert.ok(memorial.assemblyResponse.es.includes('Anunciamos tu muerte'));
      assert.ok(memorial.assemblyResponse.en.includes('We proclaim your Death, O Lord'));

      // 13. DOXOLOGY
      const doxology = getPairedDialogueByKey(paired, 'DOXOLOGY');
      assert.ok(doxology);
      assert.equal(doxology.assemblyResponse.es, 'Amén.');
      assert.equal(doxology.assemblyResponse.en, 'Amen.');

      // 14. LORDS_PRAYER_EMBOLISM
      const embolism = getPairedDialogueByKey(paired, 'LORDS_PRAYER_EMBOLISM');
      assert.ok(embolism);
      assert.ok(embolism.assemblyResponse.es.includes('Tuyo es el reino'));
      assert.ok(embolism.assemblyResponse.en.includes('For the kingdom, the power and the glory are yours'));

      // 15. PEACE_PRAYER
      const peacePrayer = getPairedDialogueByKey(paired, 'PEACE_PRAYER');
      assert.ok(peacePrayer);
      assert.equal(peacePrayer.assemblyResponse.es, 'Amén.');
      assert.equal(peacePrayer.assemblyResponse.en, 'Amen.');

      // 16. SIGN_OF_PEACE
      const peaceSign = getPairedDialogueByKey(paired, 'SIGN_OF_PEACE');
      assert.ok(peaceSign);
      assert.equal(peaceSign.assemblyResponse.es, 'Y con tu espíritu.');
      assert.equal(peaceSign.assemblyResponse.en, 'And with your spirit.');

      // 17. ECCE_AGNUS_DEI
      const ecce = getPairedDialogueByKey(paired, 'ECCE_AGNUS_DEI');
      assert.ok(ecce);
      assert.ok(ecce.assemblyResponse.es.includes('Señor, yo no soy digno'));
      assert.ok(ecce.assemblyResponse.en.includes('Lord, I am not worthy'));

      // 18. POST_COMMUNION_PRAYER
      const postComm = getPairedDialogueByKey(paired, 'POST_COMMUNION_PRAYER');
      assert.ok(postComm);
      assert.equal(postComm.assemblyResponse.es, 'Amén.');
      assert.equal(postComm.assemblyResponse.en, 'Amen.');
    });

    it('should support fuzzy dialogue matching for celebrant queries', () => {
      const match1 = matchDialogue('La paz y la caridad y la fe de parte de Dios Padre');
      assert.ok(match1);
      assert.equal(match1.dialogueKey, 'GREETING');

      const matchGospelGreeting = matchDialogue('El Señor esté con ustedes');
      assert.ok(matchGospelGreeting);
      assert.ok(
        matchGospelGreeting.dialogueKey === 'GOSPEL_DIALOGUE_GREETING' ||
          matchGospelGreeting.dialogueKey === 'PREFACE_DIALOGUE_GREETING' ||
          matchGospelGreeting.dialogueKey === 'GREETING'
      );

      const match2 = matchDialogue('Levantemos el corazón');
      assert.ok(match2);
      assert.equal(match2.dialogueKey, 'PREFACE_DIALOGUE_SURSUM');

      const match3 = matchDialogue('Demos gracias al Señor nuestro Dios');
      assert.ok(match3);
      assert.equal(match3.dialogueKey, 'PREFACE_DIALOGUE_GRATIAS');
    });
  });

  describe('6. Exported Catalog Archival and Host App Data Verification', () => {
    it('should export catalog to src/data/liturgical_catalog_guadalupe.json and verify schema', () => {
      const exportPath = exportCatalogToFile();
      assert.ok(fs.existsSync(exportPath), `Exported file must exist at ${exportPath}`);

      const raw = fs.readFileSync(exportPath, 'utf-8');
      const catalog = JSON.parse(raw) as SeguirMisaCatalog;

      assert.equal(catalog.youtubeVideoId, 'EkoysbFU47c');
      assert.equal(catalog.date, '2026-09-10');
      assert.ok(catalog.location.includes('Basílica de Santa María de Guadalupe'));
      assert.equal(catalog.steps.length, 10);

      // Verify each turn has isLeft defined
      let totalTurns = 0;
      for (const step of catalog.steps) {
        for (const turn of step.turns) {
          totalTurns++;
          assert.equal(typeof turn.isLeft, 'boolean');
          assert.equal(turn.isLeft, turn.speaker !== 'priest');
        }
      }
      assert.equal(totalTurns, 81);
    });
  });
});
