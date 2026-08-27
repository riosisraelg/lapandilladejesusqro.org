/**
 * ============================================================================
 * MISAS DE PRECEPTO & CALENDARIO LITÚRGICO CATÓLICO (MÉXICO - CEM / CANON 1246)
 * ============================================================================
 * Implementación canónica de las Solemnidades y Fiestas de Precepto
 * según el Código de Derecho Canónico (Canon 1246 §1 y §2) y las normas
 * de la Conferencia del Episcopado Mexicano (CEM).
 *
 * Incluye el algoritmo Computus Gregoriano (Meeus/Jones/Butcher) para el
 * cálculo astronómico exacto del Domingo de Pascua y las fiestas movibles.
 * ============================================================================
 */

export interface PreceptoEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  isPrecepto: boolean;
  preceptoRule: 'CEM_OBLIGATION' | 'SOLEMNITY' | 'FEAST';
  description: string;
  location: string;
  type: string;
  types: string[];
  liturgicalColor?: 'blanco' | 'rojo' | 'verde' | 'morado';
}

/**
 * Algoritmo Computus Gregoriano Anónimo (Meeus/Jones/Butcher)
 * Calcula el Domingo de Pascua en el calendario gregoriano para cualquier año.
 */
export function computeEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = Marzo, 4 = Abril
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function formatDateISO(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Obtiene todas las Misas de Precepto y Solemnidades Mayores del Año Litúrgico
 * para la comunidad en México (Parroquia de La Sagrada Familia, Querétaro).
 */
export function getMisasDePrecepto(year: number): PreceptoEvent[] {
  const easter = computeEasterSunday(year);

  // Fiestas movibles calculadas desde Pascua
  const ramos = addDays(easter, -7);
  const juevesSanto = addDays(easter, -3);
  const viernesSanto = addDays(easter, -2);
  const pascua = easter;
  const ascension = addDays(easter, 42); // VII Domingo de Pascua en México (CEM)
  const pentecostes = addDays(easter, 49);
  const trinidad = addDays(easter, 56);
  const corpusChristi = addDays(easter, 60); // Jueves posterior a Santísima Trinidad
  const sagradoCorazon = addDays(easter, 68); // Viernes posterior al II Domingo de Pentecostés

  const defaultLocation = 'Parroquia de la Sagrada Familia, Querétaro';

  const events: PreceptoEvent[] = [
    // ── FIJAS ──
    {
      id: `precepto-${year}-01-01`,
      title: 'Santa María, Madre de Dios',
      date: `${year}-01-01`,
      time: '12:00',
      isPrecepto: true,
      preceptoRule: 'CEM_OBLIGATION',
      description: 'Octava de la Natividad del Señor y Solemnidad de Santa María, Madre de Dios. Misa de precepto obligatorio universal (Canon 1246 §1).',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Precepto'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-01-06`,
      title: 'Epifanía del Señor',
      date: `${year}-01-06`,
      time: '19:00',
      isPrecepto: false,
      preceptoRule: 'SOLEMNITY',
      description: 'Manifestación del Señor a todas las naciones. En México se traslada al domingo entre el 2 y el 8 de enero.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-03-19`,
      title: 'San José, Esposo de la Santísima Virgen María',
      date: `${year}-03-19`,
      time: '19:00',
      isPrecepto: false,
      preceptoRule: 'SOLEMNITY',
      description: 'Patrono Universal de la Iglesia y custodio de la Sagrada Familia.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-03-25`,
      title: 'La Anunciación del Señor',
      date: `${year}-03-25`,
      time: '19:00',
      isPrecepto: false,
      preceptoRule: 'SOLEMNITY',
      description: 'Encarnación del Verbo divino en el seno purísimo de la Santísima Virgen María.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'blanco',
    },

    // ── MOVIBLES (SEMANA SANTA Y PASCUA) ──
    {
      id: `precepto-${year}-ramos`,
      title: 'Domingo de Ramos en la Pasión del Señor',
      date: formatDateISO(ramos),
      time: '13:00',
      isPrecepto: true,
      preceptoRule: 'CEM_OBLIGATION',
      description: 'Conmemoración solemne de la entrada triunfal de Jesús en Jerusalén y bendición de las palmas. Todos los domingos son días de precepto.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Precepto'],
      liturgicalColor: 'rojo',
    },
    {
      id: `precepto-${year}-jueves-santo`,
      title: 'Jueves Santo de la Cena del Señor',
      date: formatDateISO(juevesSanto),
      time: '18:00',
      isPrecepto: true,
      preceptoRule: 'SOLEMNITY',
      description: 'Institución de la Sagrada Eucaristía, el Sacerdocio Ministerial y el mandamiento del amor fraterno con el lavatorio de los pies.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-viernes-santo`,
      title: 'Viernes Santo de la Pasión del Señor',
      date: formatDateISO(viernesSanto),
      time: '17:00',
      isPrecepto: true,
      preceptoRule: 'SOLEMNITY',
      description: 'Celebración litúrgica de la Pasión y Muerte de nuestro Señor Jesucristo y Adoración de la Santa Cruz.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'rojo',
    },
    {
      id: `precepto-${year}-pascua`,
      title: 'Domingo de Pascua de la Resurrección del Señor',
      date: formatDateISO(pascua),
      time: '13:00',
      isPrecepto: true,
      preceptoRule: 'CEM_OBLIGATION',
      description: 'La fiesta cumbre del Año Litúrgico. Triunfo definitivo de Cristo sobre la muerte y el pecado. Misa de precepto solemne.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Precepto'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-ascension`,
      title: 'La Ascensión del Señor',
      date: formatDateISO(ascension),
      time: '13:00',
      isPrecepto: true,
      preceptoRule: 'CEM_OBLIGATION',
      description: 'Glorificación de Cristo y su entrada en el Santuario Celestial.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Precepto'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-pentecostes`,
      title: 'Domingo de Pentecostés',
      date: formatDateISO(pentecostes),
      time: '13:00',
      isPrecepto: true,
      preceptoRule: 'CEM_OBLIGATION',
      description: 'Venida del Espíritu Santo sobre María Santísima y los Apóstoles. Nacimiento público de la Iglesia.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Precepto'],
      liturgicalColor: 'rojo',
    },
    {
      id: `precepto-${year}-trinidad`,
      title: 'La Santísima Trinidad',
      date: formatDateISO(trinidad),
      time: '13:00',
      isPrecepto: true,
      preceptoRule: 'CEM_OBLIGATION',
      description: 'Misterio central de la fe católica: un solo Dios en tres Personas divinas (Padre, Hijo y Espíritu Santo).',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Precepto'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-corpus`,
      title: 'El Santísimo Cuerpo y Sangre de Cristo (Corpus Christi)',
      date: formatDateISO(corpusChristi),
      time: '19:00',
      isPrecepto: true,
      preceptoRule: 'CEM_OBLIGATION',
      description: 'Solemnidad de la presencia real de Jesucristo en la Sagrada Eucaristía.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Precepto'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-sagrado-corazon`,
      title: 'El Sagrado Corazón de Jesús',
      date: formatDateISO(sagradoCorazon),
      time: '19:00',
      isPrecepto: false,
      preceptoRule: 'SOLEMNITY',
      description: 'Solemnidad del Amor infinito y misericordioso del Corazón de Cristo.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'blanco',
    },

    // ── FIJAS SEGUNDO SEMESTRE ──
    {
      id: `precepto-${year}-06-24`,
      title: 'La Natividad de San Juan Bautista',
      date: `${year}-06-24`,
      time: '19:00',
      isPrecepto: false,
      preceptoRule: 'SOLEMNITY',
      description: 'Nacimiento del precursor del Mesías.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-06-29`,
      title: 'San Pedro y San Pablo, Apóstoles',
      date: `${year}-06-29`,
      time: '19:00',
      isPrecepto: false,
      preceptoRule: 'SOLEMNITY',
      description: 'Columnas y mártires fundamentales de la Iglesia Universal.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'rojo',
    },
    {
      id: `precepto-${year}-08-15`,
      title: 'La Asunción de la Santísima Virgen María',
      date: `${year}-08-15`,
      time: '19:00',
      isPrecepto: false,
      preceptoRule: 'SOLEMNITY',
      description: 'Glorificación en cuerpo y alma de la Madre de Dios en el cielo.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-11-01`,
      title: 'Todos los Santos',
      date: `${year}-11-01`,
      time: '19:00',
      isPrecepto: false,
      preceptoRule: 'SOLEMNITY',
      description: 'Celebración de la comunión celestial con todos los bienaventurados.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-12-08`,
      title: 'La Inmaculada Concepción de la Santísima Virgen María',
      date: `${year}-12-08`,
      time: '19:00',
      isPrecepto: false,
      preceptoRule: 'SOLEMNITY',
      description: 'Preservación de María de toda mancha de pecado original desde el primer instante de su concepción.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Solemnidad'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-12-12`,
      title: 'Nuestra Señora de Guadalupe',
      date: `${year}-12-12`,
      time: '19:00',
      isPrecepto: true,
      preceptoRule: 'CEM_OBLIGATION',
      description: 'Patrona de México y Emperatriz de América. Solemnidad y Misa de Precepto Nacional en México por disposición de la CEM.',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Precepto'],
      liturgicalColor: 'blanco',
    },
    {
      id: `precepto-${year}-12-25`,
      title: 'La Natividad del Señor (Navidad)',
      date: `${year}-12-25`,
      time: '13:00',
      isPrecepto: true,
      preceptoRule: 'CEM_OBLIGATION',
      description: 'Nacimiento de Nuestro Señor Jesucristo. Misa de precepto obligatorio universal (Canon 1246 §1).',
      location: defaultLocation,
      type: 'Oración',
      types: ['Oración', 'Precepto'],
      liturgicalColor: 'blanco',
    },
  ];

  return events.sort(
    (a, b) => new Date(a.date + 'T00:00:00Z').getTime() - new Date(b.date + 'T00:00:00Z').getTime()
  );
}
