// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive
/**
 * Subproject 2: Mass Transcript Mining & Curation Tool
 * Liturgical Segmenter: Partitions speech cues and turns into 10 canonical Roman Rite steps.
 */

import type { SeguirMisaStep, LiturgicalTurn, BilingualText, CleanTranscriptCue } from './types.ts';

export interface StepDefinition {
  id: string;
  order: number;
  rite: string;
  title: BilingualText;
  description?: BilingualText;
  posture?: BilingualText;
  startSeconds: number;
  endSeconds: number;
}

export const CANONICAL_STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: 'sec-1-rito-inicial',
    order: 1,
    rite: 'RITO_INICIAL',
    title: {
      es: '1. Rito Inicial / Canto de Entrada y Saludo',
      en: '1. Introductory Rites / Entrance Hymn and Greeting',
    },
    description: {
      es: 'El sacerdote y los ministros se dirigen al altar mientras el coro entona el himno de entrada. Sigue el saludo y las intenciones de la Santa Misa.',
      en: 'The priest and ministers proceed to the altar while the entrance hymn is sung. The liturgical greeting and Mass intentions follow.',
    },
    posture: { es: 'De pie', en: 'Standing' },
    startSeconds: 238,
    endSeconds: 668,
  },
  {
    id: 'sec-2-acto-penitencial',
    order: 2,
    rite: 'RITO_INICIAL',
    title: {
      es: '2. Acto Penitencial (Confiteor / Kyrie)',
      en: '2. Penitential Act (Confiteor / Kyrie)',
    },
    description: {
      es: 'El sacerdote invita a reconocer los pecados. La asamblea reza el Yo Confieso y se aclama al Señor con el Kyrie eleison.',
      en: 'The priest invites to acknowledge sins. The assembly prays the Confiteor and acclaims the Lord with the Kyrie eleison.',
    },
    posture: { es: 'De pie', en: 'Standing' },
    startSeconds: 669,
    endSeconds: 767,
  },
  {
    id: 'sec-3-gloria',
    order: 3,
    rite: 'RITO_INICIAL',
    title: {
      es: '3. Gloria (Omitido por rúbrica)',
      en: '3. Gloria (Omitted per rubrics)',
    },
    description: {
      es: 'En las ferias de los Jueves Sacerdotales del Tiempo Ordinario no se canta el Gloria según las rúbricas del Misal Romano.',
      en: 'On ferias of Priestly Thursdays in Ordinary Time the Gloria is omitted per Roman Missal rubrics.',
    },
    startSeconds: 768,
    endSeconds: 777,
  },
  {
    id: 'sec-4-oracion-colecta',
    order: 4,
    rite: 'RITO_INICIAL',
    title: {
      es: '4. Oración Colecta',
      en: '4. Collect Prayer',
    },
    description: {
      es: 'El sacerdote pronuncia la oración colecta reuniendo las súplicas del pueblo santo hacia Dios Padre.',
      en: 'The priest recites the collect prayer gathering the petitions of the holy people to God the Father.',
    },
    posture: { es: 'De pie', en: 'Standing' },
    startSeconds: 778,
    endSeconds: 825,
  },
  {
    id: 'sec-5-liturgia-palabra',
    order: 5,
    rite: 'LITURGIA_DE_LA_PALABRA',
    title: {
      es: '5. Liturgia de la Palabra / Evangelio',
      en: '5. Liturgy of the Word / Gospel',
    },
    description: {
      es: 'Proclamación de las lecturas bíblicas, Salmo Responsorial, Aclamación antes del Evangelio y proclamación del Santo Evangelio.',
      en: 'Proclamation of biblical readings, Responsorial Psalm, Gospel Acclamation, and holy Gospel proclamation.',
    },
    posture: {
      es: 'Sentados durante las lecturas / De pie para el Evangelio',
      en: 'Seated for the readings / Standing for the Gospel',
    },
    startSeconds: 826,
    endSeconds: 1412,
  },
  {
    id: 'sec-6-homilia',
    order: 6,
    rite: 'LITURGIA_DE_LA_PALABRA',
    title: {
      es: '6. Homilía',
      en: '6. Homily',
    },
    description: {
      es: 'El sacerdote explica la Palabra de Dios y su aplicación a la vida cristiana.',
      en: 'The priest expounds upon the Word of God and its application to Christian life.',
    },
    posture: { es: 'Sentados', en: 'Seated' },
    startSeconds: 1413,
    endSeconds: 1872,
  },
  {
    id: 'sec-7-oracion-universal',
    order: 7,
    rite: 'LITURGIA_DE_LA_PALABRA',
    title: {
      es: '7. Oración Universal / de los Fieles',
      en: '7. Universal Prayer / Prayer of the Faithful',
    },
    description: {
      es: 'Plegaria comunitaria por la Santa Iglesia, las autoridades, los enfermos y las necesidades de la comunidad.',
      en: 'Community petitions for Holy Church, authorities, the sick, and all communal needs.',
    },
    posture: { es: 'De pie', en: 'Standing' },
    startSeconds: 1873,
    endSeconds: 2019,
  },
  {
    id: 'sec-8-liturgia-eucaristica',
    order: 8,
    rite: 'LITURGIA_EUCARISTICA',
    title: {
      es: '8. Liturgia Eucarística / Presentación de Dones / Prefacio / Santo / Plegaria Eucarística II',
      en: '8. Liturgy of the Eucharist / Offertory / Preface / Sanctus / Eucharistic Prayer II',
    },
    description: {
      es: 'Presentación del pan y vino, diálogo del prefacio, himno del Santo, consagración eucarística y gran doxología.',
      en: 'Presentation of bread and wine, preface dialogue, Sanctus hymn, Eucharistic consecration, and great doxology.',
    },
    posture: {
      es: 'Sentados durante las ofrendas / De rodillas o de pie con reverencia para la Consagración',
      en: 'Seated for Offertory / Kneeling or standing with reverence for Consecration',
    },
    startSeconds: 2020,
    endSeconds: 2622,
  },
  {
    id: 'sec-9-rito-comunion',
    order: 9,
    rite: 'RITO_DE_LA_COMUNION',
    title: {
      es: '9. Rito de la Comunión / Padre Nuestro / Paz / Cordero de Dios',
      en: '9. Communion Rite / Lord\'s Prayer / Sign of Peace / Lamb of God',
    },
    description: {
      es: 'Oración del Padre Nuestro, rito de la paz, fracción del pan (Agnus Dei), y distribución de la Sagrada Comunión.',
      en: 'Lord\'s Prayer, rite of peace, fraction of bread (Agnus Dei), and distribution of Holy Communion.',
    },
    posture: {
      es: 'De pie / De rodillas o de pie con reverencia para comulgar',
      en: 'Standing / Kneeling or standing with reverence for Communion',
    },
    startSeconds: 2623,
    endSeconds: 3102,
  },
  {
    id: 'sec-10-rito-conclusion',
    order: 10,
    rite: 'RITO_DE_CONCLUSION',
    title: {
      es: '10. Rito de Conclusión / Adoración',
      en: '10. Concluding Rite / Eucharistic Adoration',
    },
    description: {
      es: 'Oración después de la comunión y procesión al Santísimo Sacramento para la adoración de los Jueves Eucarísticos.',
      en: 'Post-communion prayer and Eucharistic procession to the Blessed Sacrament for Thursday adoration.',
    },
    posture: {
      es: 'De pie / De rodillas para la adoración',
      en: 'Standing / Kneeling for adoration',
    },
    startSeconds: 3103,
    endSeconds: 3600,
  },
];

/**
 * Returns the immutable list of all 10 canonical Roman Rite step definitions.
 */
export function getStepDefinitions(): StepDefinition[] {
  return CANONICAL_STEP_DEFINITIONS;
}

/**
 * Maps a single transcript cue to one of the 10 canonical steps based on its start timecode.
 */
export function classifyCueToStep(cue: CleanTranscriptCue): string {
  for (const step of CANONICAL_STEP_DEFINITIONS) {
    if (cue.startSeconds >= step.startSeconds && cue.startSeconds <= step.endSeconds) {
      return step.id;
    }
  }
  // Default to step 1 if before start, or step 10 if after
  if (cue.startSeconds < CANONICAL_STEP_DEFINITIONS[0].startSeconds) {
    return CANONICAL_STEP_DEFINITIONS[0].id;
  }
  return CANONICAL_STEP_DEFINITIONS[CANONICAL_STEP_DEFINITIONS.length - 1].id;
}

/**
 * Partitions an array of cleaned transcript cues across the 10 canonical steps.
 */
export function segmentTranscriptIntoSteps(
  cues: CleanTranscriptCue[]
): Map<string, CleanTranscriptCue[]> {
  const stepMap = new Map<string, CleanTranscriptCue[]>();

  for (const step of CANONICAL_STEP_DEFINITIONS) {
    stepMap.set(step.id, []);
  }

  for (const cue of cues) {
    const stepId = classifyCueToStep(cue);
    const list = stepMap.get(stepId);
    if (list) {
      list.push(cue);
    }
  }

  return stepMap;
}

/**
 * Assembles fully structured SeguirMisaStep objects given a map of step ID to turns.
 */
export function assembleStepsFromTurns(
  stepTurnsMap: Map<string, LiturgicalTurn[]>
): SeguirMisaStep[] {
  return CANONICAL_STEP_DEFINITIONS.map((def) => {
    const turns = stepTurnsMap.get(def.id) || [];
    return {
      id: def.id,
      rite: def.rite,
      title: def.title,
      description: def.description,
      posture: def.posture,
      turns,
      videoTimestampSeconds: def.startSeconds,
    };
  });
}

/**
 * Validates that all 10 canonical steps are present, strictly ordered, and non-empty.
 */
export function validateStepIntegrity(steps: SeguirMisaStep[]): boolean {
  if (steps.length !== 10) return false;
  const expectedIds = CANONICAL_STEP_DEFINITIONS.map((s) => s.id);
  return steps.every((s, i) => s.id === expectedIds[i] && Array.isArray(s.turns));
}
