// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive
/**
 * Subproject 2: Mass Transcript Mining & Curation Tool
 * Chat Formatter: Enforces chat-style alignment rules:
 * - Celebrant / Priest sayings align right: isLeft: false -> maps to .duet-right (2.2rem font)
 * - Public / Assembly / Choir / Lector responses align left: isLeft: true -> maps to .duet-left (1.3rem font)
 */

import type {
  LiturgicalTurn,
  SeguirMisaStep,
  SeguirMisaCatalog,
  LanguageMode,
  SpeakerRole,
} from './types.ts';

export interface LyricsModalLine {
  text: string;
  speaker?: SpeakerRole;
  isLeft: boolean;
  className: string;
  timestampSeconds?: number;
  timecode?: string;
}

export interface SeparatedTurns {
  priestTurns: LiturgicalTurn[];
  publicTurns: LiturgicalTurn[];
}

/**
 * Determines whether a speaker role corresponds to the public assembly.
 */
export function isPublicSpeaker(speaker: SpeakerRole): boolean {
  return speaker === 'assembly' || speaker === 'choir' || speaker === 'lector' || speaker === 'cantor' || speaker === 'all';
}

/**
 * Determines whether a speaker role corresponds to the celebrant priest.
 */
export function isPriestSpeaker(speaker: SpeakerRole): boolean {
  return speaker === 'priest';
}

/**
 * Assigns explicit chat-style alignment to a liturgical turn:
 * - Priest: isLeft = false (Right alignment -> .duet-right)
 * - Public / Assembly: isLeft = true (Left alignment -> .duet-left)
 */
export function formatTurnAlignment(turn: LiturgicalTurn): LiturgicalTurn {
  const isLeft = !isPriestSpeaker(turn.speaker);
  return {
    ...turn,
    isLeft,
  };
}

/**
 * Resolves the CSS class name for a given turn based on chat alignment:
 * - isLeft === false -> "duet-right"
 * - isLeft === true -> "duet-left"
 */
export function getAlignmentClass(turn: LiturgicalTurn): 'duet-right' | 'duet-left' {
  return turn.isLeft ? 'duet-left' : 'duet-right';
}

/**
 * Applies chat alignment rules across all turns in all liturgical steps.
 */
export function applyChatAlignmentToSteps(steps: SeguirMisaStep[]): SeguirMisaStep[] {
  return steps.map((step) => ({
    ...step,
    turns: step.turns.map((turn) => {
      const alignedTurn = formatTurnAlignment(turn);
      return {
        ...alignedTurn,
        stepId: step.id,
      };
    }),
  }));
}

/**
 * Separates all liturgical turns into priest sayings and public responses.
 */
export function separatePriestAndPublicTurns(steps: SeguirMisaStep[]): SeparatedTurns {
  const priestTurns: LiturgicalTurn[] = [];
  const publicTurns: LiturgicalTurn[] = [];

  for (const step of steps) {
    for (const turn of step.turns) {
      if (isPriestSpeaker(turn.speaker)) {
        priestTurns.push(turn);
      } else {
        publicTurns.push(turn);
      }
    }
  }

  return { priestTurns, publicTurns };
}

/**
 * Formats turns into lines compatible with AppleMusicLyrics.tsx modal.
 */
export function formatStepForLyricsModal(
  step: SeguirMisaStep,
  mode: LanguageMode = 'es'
): LyricsModalLine[] {
  const lines: LyricsModalLine[] = [];

  // Section header
  lines.push({
    text: `---SECTION---${mode === 'en' ? step.title.en : step.title.es}`,
    isLeft: true,
    className: 'lyric-section-title',
  });

  for (const turn of step.turns) {
    const lineText =
      mode === 'en'
        ? turn.text.en
        : mode === 'both'
        ? `${turn.text.es}\n\n${turn.text.en}`
        : turn.text.es;

    const alignmentClass = getAlignmentClass(turn);

    lines.push({
      text: lineText,
      speaker: turn.speaker,
      isLeft: turn.isLeft,
      className: `lyric-line ${alignmentClass}`,
      timestampSeconds: turn.timestampSeconds,
      timecode: turn.timecode,
    });
  }

  return lines;
}

/**
 * Formats entire catalog into sequential lyric lines for the Seguir Misa modal.
 */
export function formatCatalogForLyricsModal(
  catalog: SeguirMisaCatalog,
  mode: LanguageMode = 'es'
): LyricsModalLine[] {
  const allLines: LyricsModalLine[] = [];

  for (const step of catalog.steps) {
    const stepLines = formatStepForLyricsModal(step, mode);
    allLines.push(...stepLines);
  }

  return allLines;
}
