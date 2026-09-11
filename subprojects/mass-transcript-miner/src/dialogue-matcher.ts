// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive
/**
 * Subproject 2: Mass Transcript Mining & Curation Tool
 * Dialogue Matcher: Pairs celebrant prompts with 18 canonical Roman Missal
 * bilingual assembly responses from rejoiceinfaith.org.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  CanonicalDialoguePair,
  PairedLiturgicalDialogue,
  SeguirMisaStep,
  LiturgicalTurn,
} from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 18 Canonical Dialogue Pairs Mappings (Priest Turn ID -> Dialogue Key)
 */
export const KNOWN_PAIRED_KEYS: Record<string, string> = {
  'turn-1-4-saludo': 'GREETING',
  'turn-2-2-absolucion': 'PENITENTIAL_ACT',
  'turn-4-1-colecta': 'COLLECT',
  'turn-5-5-evangelio-saludo': 'GOSPEL_DIALOGUE_GREETING',
  'turn-5-7-evangelio-anuncio': 'GOSPEL_DIALOGUE_ACCLAMATION',
  'turn-5-10-evangelio-despido': 'GOSPEL_DIALOGUE_DISMISSAL',
  'turn-8-2-orate-fratres': 'ORATE_FRATRES',
  'turn-8-4-oracion-ofrendas': 'OFFERTORY_PRAYER',
  'turn-8-6-prefacio-dialogo-1': 'PREFACE_DIALOGUE_GREETING',
  'turn-8-8-prefacio-dialogo-2': 'PREFACE_DIALOGUE_SURSUM',
  'turn-8-10-prefacio-dialogo-3': 'PREFACE_DIALOGUE_GRATIAS',
  'turn-8-17-aclamacion-dialogo': 'MEMORIAL_ACCLAMATION',
  'turn-8-20-doxologia': 'DOXOLOGY',
  'turn-9-3-embolismo': 'LORDS_PRAYER_EMBOLISM',
  'turn-9-5-oracion-paz': 'PEACE_PRAYER',
  'turn-9-7-saludo-paz': 'SIGN_OF_PEACE',
  'turn-9-11-ecce-agnus-dei': 'ECCE_AGNUS_DEI',
  'turn-10-2-oracion-post-comunion': 'POST_COMMUNION_PRAYER',
};

let cachedCanonicalDialogues: CanonicalDialoguePair[] | null = null;

/**
 * Loads the 18 canonical dialogue pairs from data/canonical_dialogues_rejoice.json.
 */
export function loadCanonicalDialogues(): CanonicalDialoguePair[] {
  if (cachedCanonicalDialogues) {
    return cachedCanonicalDialogues;
  }

  const jsonPath = path.resolve(__dirname, '../data/canonical_dialogues_rejoice.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`loadCanonicalDialogues: File not found: ${jsonPath}`);
  }

  const content = fs.readFileSync(jsonPath, 'utf-8');
  cachedCanonicalDialogues = JSON.parse(content) as CanonicalDialoguePair[];
  return cachedCanonicalDialogues;
}

/**
 * Retrieves a canonical dialogue pair by its key (e.g. 'GREETING', 'MEMORIAL_ACCLAMATION').
 */
export function getCanonicalDialogueByKey(key: string): CanonicalDialoguePair | undefined {
  const dialogues = loadCanonicalDialogues();
  const normalized = key.trim().toUpperCase();
  return dialogues.find((d) => d.dialogueKey.toUpperCase() === normalized);
}

/**
 * Normalizes text for fuzzy phrase matching (removes diacritics, punctuation, extra spaces, lowercase).
 */
function normalizeForComparison(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Matches an arbitrary priest utterance to a canonical dialogue pair.
 */
export function matchDialogue(
  priestText: string,
  customDialogues?: CanonicalDialoguePair[]
): CanonicalDialoguePair | undefined {
  if (!priestText || priestText.trim().length === 0) return undefined;

  const dialogues = customDialogues || loadCanonicalDialogues();
  const normInput = normalizeForComparison(priestText);

  // Exact / substring matching
  for (const pair of dialogues) {
    const normPromptEs = normalizeForComparison(pair.celebrantPrompt.es);
    const normPromptEn = normalizeForComparison(pair.celebrantPrompt.en);

    if (
      normInput.includes(normPromptEs) ||
      normPromptEs.includes(normInput) ||
      normInput.includes(normPromptEn) ||
      normPromptEn.includes(normInput)
    ) {
      return pair;
    }
  }

  // Key phrase heuristics
  if (normInput.includes('senor este con ustedes') || normInput.includes('paz y la caridad')) {
    return getCanonicalDialogueByKey('GREETING');
  }
  if (normInput.includes('dios todopoderoso tenga misericordia')) {
    return getCanonicalDialogueByKey('PENITENTIAL_ACT');
  }
  if (normInput.includes('del santo evangelio')) {
    return getCanonicalDialogueByKey('GOSPEL_DIALOGUE_ACCLAMATION');
  }
  if (normInput.includes('palabra del senor')) {
    return getCanonicalDialogueByKey('GOSPEL_DIALOGUE_DISMISSAL');
  }
  if (normInput.includes('oren hermanos')) {
    return getCanonicalDialogueByKey('ORATE_FRATRES');
  }
  if (normInput.includes('levantemos el corazon')) {
    return getCanonicalDialogueByKey('PREFACE_DIALOGUE_SURSUM');
  }
  if (normInput.includes('demos gracias al senor')) {
    return getCanonicalDialogueByKey('PREFACE_DIALOGUE_GRATIAS');
  }
  if (normInput.includes('sacramento de nuestra fe') || normInput.includes('misterio de la fe')) {
    return getCanonicalDialogueByKey('MEMORIAL_ACCLAMATION');
  }
  if (normInput.includes('por cristo con el y en el')) {
    return getCanonicalDialogueByKey('DOXOLOGY');
  }
  if (normInput.includes('libranos de todos los males')) {
    return getCanonicalDialogueByKey('LORDS_PRAYER_EMBOLISM');
  }
  if (normInput.includes('la paz del senor este siempre')) {
    return getCanonicalDialogueByKey('SIGN_OF_PEACE');
  }
  if (normInput.includes('este es jesucristo el hijo de dios') || normInput.includes('cordero de dios que quita el pecado')) {
    return getCanonicalDialogueByKey('ECCE_AGNUS_DEI');
  }

  return undefined;
}

/**
 * Extracts all paired priest statements and bilingual assembly responses
 * from a list of structured liturgical steps.
 */
export function pairCelebrantAndAssemblyTurns(
  steps: SeguirMisaStep[]
): PairedLiturgicalDialogue[] {
  const dialogues: PairedLiturgicalDialogue[] = [];

  for (const step of steps) {
    for (let i = 0; i < step.turns.length - 1; i++) {
      const turn = step.turns[i];
      const nextTurn = step.turns[i + 1];

      if (turn.speaker === 'priest' && nextTurn.speaker === 'assembly') {
        const dialogueKey =
          KNOWN_PAIRED_KEYS[turn.id] ||
          `${step.id.toUpperCase()}_${turn.id.toUpperCase()}`;

        dialogues.push({
          dialogueKey,
          stepId: step.id,
          stepTitle: step.title,
          priestTurn: turn,
          assemblyTurn: nextTurn,
          priestExactEs: turn.exactPriestSayingEs || turn.text.es,
          assemblyResponse: nextTurn.text,
        });
      }
    }
  }

  return dialogues;
}

/**
 * Finds a paired dialogue by key from an array of paired dialogues.
 */
export function getPairedDialogueByKey(
  dialogues: PairedLiturgicalDialogue[],
  key: string
): PairedLiturgicalDialogue | undefined {
  const normKey = key.trim().toUpperCase();
  return dialogues.find((d) => d.dialogueKey.toUpperCase() === normKey);
}
