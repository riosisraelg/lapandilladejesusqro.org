// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive
/**
 * Subproject 2: Mass Transcript Mining & Curation Tool
 * Domain models for liturgical structure, transcripts, dialogues, and chat alignment.
 */

export type LiturgicalRite =
  | 'RITO_INICIAL'
  | 'ACTO_PENITENCIAL'
  | 'GLORIA'
  | 'ORACION_COLECTA'
  | 'LITURGIA_DE_LA_PALABRA'
  | 'HOMILIA'
  | 'ORACION_UNIVERSAL'
  | 'LITURGIA_EUCARISTICA'
  | 'RITO_DE_LA_COMUNION'
  | 'RITO_DE_CONCLUSION';

export type SpeakerRole = 'priest' | 'assembly' | 'all' | 'lector' | 'cantor' | 'choir';

export interface BilingualText {
  es: string;
  en: string;
  latin?: string;
  greek?: string;
}

export interface RawTranscriptCue {
  start: string;
  end: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
}

export interface CleanTranscriptCue {
  start: string;
  end: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
  isMusicOnly?: boolean;
}

export interface LiturgicalTurn {
  id: string;
  stepId?: string;
  speaker: SpeakerRole;
  /**
   * Chat-style alignment flag:
   * - false: Priest / Celebrant (aligns right -> .duet-right)
   * - true: Public / Assembly / Choir / Lector (aligns left -> .duet-left)
   */
  isLeft: boolean;
  text: BilingualText;
  exactPriestSayingEs?: string; // Verbatim quote mined from YouTube transcript
  rubrics?: BilingualText;
  timestampSeconds?: number;
  timecode?: string;
  cueStartSeconds?: number;
  cueEndSeconds?: number;
}

export interface SeguirMisaStep {
  id: string; // Canonical step identifier, e.g., "sec-1-rito-inicial"
  rite: LiturgicalRite | string;
  title: BilingualText;
  description?: BilingualText;
  posture?: BilingualText;
  turns: LiturgicalTurn[];
  videoTimestampSeconds?: number;
  readingsRef?: string;
}

export interface SeguirMisaCatalog {
  massTitle: string;
  date: string;
  location: string;
  celebrant: string;
  youtubeVideoId: string;
  steps: SeguirMisaStep[];
}

export interface CanonicalDialoguePair {
  dialogueKey: string;
  stepId: string;
  celebrantPrompt: BilingualText;
  assemblyResponse: BilingualText;
}

export interface PairedLiturgicalDialogue {
  dialogueKey: string;
  stepId: string;
  stepTitle: BilingualText;
  priestTurn: LiturgicalTurn;
  assemblyTurn: LiturgicalTurn;
  priestExactEs: string;
  assemblyResponse: BilingualText;
}

export type LanguageMode = 'es' | 'en' | 'both';

export const RITES = [
  'RITO_INICIAL',
  'ACTO_PENITENCIAL',
  'GLORIA',
  'ORACION_COLECTA',
  'LITURGIA_DE_LA_PALABRA',
  'HOMILIA',
  'ORACION_UNIVERSAL',
  'LITURGIA_EUCARISTICA',
  'RITO_DE_LA_COMUNION',
  'RITO_DE_CONCLUSION',
] as const;
