/**
 * Base de Datos y Generador de Mazos de Oraciones para La Pandilla de Jesús
 */

export interface PrayerCard {
  id: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  category?: string;
  text: string;
  textEn?: string;
  isRosaryGuide?: boolean;
  isMysteryCard?: boolean;
  mysteryNumber?: number;
  mysteryName?: string;
  mysteryMeditation?: string;
}

export type MysteryType = 'gozosos' | 'dolorosos' | 'gloriosos' | 'luminosos';

export interface MysteryInfo {
  type: MysteryType;
  name: string;
  days: string;
  mysteries: Array<{
    number: number;
    title: string;
    biblicalRef?: string;
    meditation: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DECK 1: Oraciones de la Comunidad (Predeterminado)
// ─────────────────────────────────────────────────────────────────────────────
export const oracionesComunidad: PrayerCard[] = [
  {
    id: 'comunidad-angelus',
    title: "El Ángelus",
    titleEn: "The Angelus",
    category: "Comunidad",
    text: `V. El Ángel del Señor anunció a María.
R. Y concibió por obra del Espíritu Santo.
(Dios te salve, María...)

V. He aquí la esclava del Señor.
R. Hágase en mí según tu palabra.
(Dios te salve, María...)

V. Y el Verbo se hizo carne.
R. Y habitó entre nosotros.
(Dios te salve, María...)

V. Ruega por nosotros, Santa Madre de Dios.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo.

Oremos: Derrama, Señor, tu gracia sobre nosotros, que, por el anuncio del Ángel, hemos conocido la encarnación de tu Hijo, para que lleguemos, por su pasión y su cruz, a la gloria de la resurrección. Por Jesucristo Nuestro Señor. Amén.`,
    textEn: `V. The Angel of the Lord declared to Mary:
R. And she conceived of the Holy Spirit.
(Hail Mary...)

V. Behold the handmaid of the Lord:
R. Be it done unto me according to Thy word.
(Hail Mary...)

V. And the Word was made Flesh:
R. And dwelt among us.
(Hail Mary...)

V. Pray for us, O Holy Mother of God,
R. that we may be made worthy of the promises of Christ.

Let us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that we, to whom the incarnation of Christ, Thy Son, was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection, through the same Christ Our Lord. Amen.`
  },
  {
    id: 'comunidad-pandilla',
    title: "Oración de la Pandilla de Jesús",
    category: "Comunidad",
    text: `Jesús, sé el Señor de mi vida.
Toma mi libertad, mi historia,
mi voluntad y mi juventud;
porque tu gracia vale más que la vida.

Quiero seguirte sin mirar atrás,
atreverme a tu plan,
ser tus manos y tus pies.

Enséñame a distinguir el bien del mal,
porque de nada sirve ganar el mundo
si te pierdo a Ti.

Sé que te basta mi debilidad,
y aún así quiero entregarte siempre
un poco más.

Gracias por amarme, escucharme
y confiar en mí.

Tuyo soy, Señor, tuyo para siempre.
Amén.`
  },
  {
    id: 'comunidad-paz',
    title: "Oración por la paz",
    category: "Comunidad",
    text: `Señor Jesús, Tú eres nuestra paz,
mira nuestra Patria dañada por la violencia
y dispersa por el miedo y la inseguridad.
Consuela el dolor de quienes sufren.
Da acierto a las decisiones de quienes nos gobiernan.
Toca el corazón de quienes olvidan que somos hermanos
y provocan sufrimiento y muerte.
Dales el don de la conversión.
Protege a las familias, a nuestros niños, adolescentes
y jóvenes, a nuestros pueblos y comunidades.
Que, como discípulos misioneros tuyos,
ciudadanos responsables,
sepamos ser promotores de justicia y de paz,
para que, en Ti, nuestro pueblo tenga vida digna. AMÉN.

María, Reina de la paz, ruega por nosotros.

Septiembre 2025`
  },
  {
    id: 'comunidad-sagrada-familia',
    title: "Oración a la Sagrada Familia",
    category: "Comunidad",
    text: `Jesús, María y José
en ustedes contemplamos
el esplendor del verdadero amor,
a ustedes, confiados, nos dirigimos.

Santa Familia de Nazaret,
haz también de nuestras familias
lugar de comunión y cenáculo de oración,
auténticas escuelas del Evangelio
y pequeñas iglesias domésticas.

Santa Familia de Nazaret,
que nunca más haya en las familias episodios de violencia,
de cerrazón y división;
que quien haya sido herido o escandalizado
sea pronto consolado y curado.

Santa Familia de Nazaret,
haz tomar conciencia a todos
del carácter sagrado e inviolable de la familia,
de su belleza en el proyecto de Dios.

Jesús, María y José,
escuchen, acojan nuestra súplica.
Amén.

(Papa Francisco, Amoris Laetitia, 325)`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DECK 2: Oraciones Básicas (11 oraciones fundamentales)
// ─────────────────────────────────────────────────────────────────────────────
export const oracionesBasicas: PrayerCard[] = [
  {
    id: 'basicas-cruz',
    title: "Señal de la Santa Cruz",
    titleEn: "Sign of the Cross",
    category: "Oración Básica",
    text: `Por la señal de la Santa Cruz,
de nuestros enemigos
líbranos Señor, Dios nuestro.

En el nombre del Padre,
y del Hijo,
y del Espíritu Santo.
Amén.`,
    textEn: `In the name of the Father,
and of the Son,
and of the Holy Spirit.
Amen.`
  },
  {
    id: 'basicas-padre-nuestro',
    title: "Padre Nuestro",
    titleEn: "The Lord's Prayer (Our Father)",
    category: "Oración Básica",
    text: `Padre nuestro, que estás en el cielo,
santificado sea tu Nombre;
venga a nosotros tu Reino;
hágase tu voluntad en la tierra como en el cielo.

Danos hoy nuestro pan de cada día;
perdona nuestras ofensas,
como también nosotros perdonamos a los que nos ofenden;
no nos dejes caer en la tentación,
y líbranos del mal.
Amén.`,
    textEn: `Our Father, who art in heaven,
hallowed be thy name;
thy kingdom come;
thy will be done on earth as it is in heaven.

Give us this day our daily bread;
and forgive us our trespasses,
as we forgive those who trespass against us;
and lead us not into temptation,
but deliver us from evil.
Amen.`
  },
  {
    id: 'basicas-ave-maria',
    title: "Ave María",
    titleEn: "Hail Mary",
    category: "Oración Básica",
    text: `Dios te salve, María,
llena eres de gracia,
el Señor es contigo;
bendita Tú eres entre todas las mujeres,
y bendito es el fruto de tu vientre, Jesús.

Santa María, Madre de Dios,
ruega por nosotros, pecadores,
ahora y en la hora de nuestra muerte.
Amén.`,
    textEn: `Hail Mary, full of grace,
the Lord is with thee;
blessed art thou among women,
and blessed is the fruit of thy womb, Jesus.

Holy Mary, Mother of God,
pray for us sinners,
now and at the hour of our death.
Amen.`
  },
  {
    id: 'basicas-gloria',
    title: "Gloria al Padre",
    titleEn: "Glory Be",
    category: "Oración Básica",
    text: `Gloria al Padre,
y al Hijo,
y al Espíritu Santo.

Como era en el principio,
ahora y siempre,
por los siglos de los siglos.
Amén.`,
    textEn: `Glory be to the Father,
and to the Son,
and to the Holy Spirit.

As it was in the beginning,
is now, and ever shall be,
world without end.
Amen.`
  },
  {
    id: 'basicas-credo-apostoles',
    title: "Credo de los Apóstoles",
    titleEn: "Apostles' Creed",
    category: "Oración Básica",
    text: `Creo en Dios, Padre Todopoderoso,
Creador del cielo y de la tierra.

Creo en Jesucristo, su único Hijo, Nuestro Señor,
que fue concebido por obra y gracia del Espíritu Santo,
nació de Santa María Virgen,
padeció bajo el poder de Poncio Pilato,
fue crucificado, muerto y sepultado,
descendió a los infiernos,
al tercer día resucitó de entre los muertos,
subió a los cielos
y está sentado a la derecha de Dios, Padre todopoderoso.
Desde allí ha de venir a juzgar a vivos y muertos.

Creo en el Espíritu Santo,
la santa Iglesia católica,
la comunión de los santos,
el perdón de los pecados,
la resurrección de la carne
y la vida eterna.
Amén.`
  },
  {
    id: 'basicas-credo-niceno',
    title: "Credo Niceno-Constantinopolitano",
    titleEn: "Nicene Creed",
    category: "Oración Básica",
    text: `Creo en un solo Dios, Padre Todopoderoso,
Creador del cielo y de la tierra,
de todo lo visible y lo invisible.

Creo en un solo Señor, Jesucristo,
Hijo único de Dios,
nacido del Padre antes de todos los siglos:
Dios de Dios, Luz de Luz,
Dios verdadero de Dios verdadero,
engendrado, no creado,
de la misma naturaleza del Padre,
por quien todo fue hecho;
que por nosotros, los hombres,
y por nuestra salvación bajó del cielo,
y por obra del Espíritu Santo
se encarnó de María, la Virgen, y se hizo hombre;
y por nuestra causa fue crucificado
en tiempos de Poncio Pilato;
padeció y fue sepultado,
y resucitó al tercer día, según las Escrituras,
y subió al cielo, y está sentado a la derecha del Padre;
y de nuevo vendrá con gloria,
para juzgar a vivos y muertos,
y su reino no tendrá fin.

Creo en el Espíritu Santo,
Señor y dador de vida,
que procede del Padre y del Hijo,
que con el Padre y el Hijo
recibe una misma adoración y gloria,
y que habló por los profetas.

Creo en la Iglesia,
que es una, santa, católica y apostólica.
Confieso que hay un solo Bautismo
para el perdón de los pecados.
Espero la resurrección de los muertos
y la vida del mundo futuro.
Amén.`
  },
  {
    id: 'basicas-salve',
    title: "La Salve",
    titleEn: "Hail Holy Queen (Salve Regina)",
    category: "Oración Básica",
    text: `Dios te salve, Reina y Madre de misericordia,
vida, dulzura y esperanza nuestra; Dios te salve.

A Ti llamamos los desterrados hijos de Eva;
a Ti suspiramos, gimiendo y llorando,
en este valle de lágrimas.

Ea, pues, Señora, abogada nuestra,
vuelve a nosotros esos tus ojos misericordiosos;
y después de este destierro muéstranos a Jesús,
fruto bendito de tu vientre.

¡Oh clemente, oh piadosa, oh dulce Virgen María!

V. Ruega por nosotros, Santa Madre de Dios.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo.
Amén.`
  },
  {
    id: 'basicas-acto-contricion',
    title: "Acto de Contrición",
    titleEn: "Act of Contrition",
    category: "Oración Básica",
    text: `Señor mío Jesucristo,
Dios y Hombre verdadero,
Creador, Padre y Redentor mío;
por ser Vos quien sois, bondad infinita,
y porque os amo sobre todas las cosas,
me pesa de todo corazón haberos ofendido;
también me pesa porque podéis castigarme
con las penas del infierno.

Ayudado de vuestra divina gracia,
propongo firmemente nunca más pecar,
confesarme y cumplir la penitencia
que me fuere impuesta.
Amén.`
  },
  {
    id: 'basicas-angel-guarda',
    title: "Oración al Ángel de la Guarda",
    titleEn: "Guardian Angel Prayer",
    category: "Oración Básica",
    text: `Ángel de mi guarda,
dulce compañía,
no me desampares,
ni de noche ni de día.

No me dejes solo,
que me perdería,
hasta que descanse
en los brazos de Jesús, José y María.
Amén.`
  },
  {
    id: 'basicas-angelus',
    title: "El Ángelus",
    titleEn: "The Angelus",
    category: "Oración Básica",
    text: `V. El Ángel del Señor anunció a María.
R. Y concibió por obra del Espíritu Santo.
(Dios te salve, María...)

V. He aquí la esclava del Señor.
R. Hágase en mí según tu palabra.
(Dios te salve, María...)

V. Y el Verbo se hizo carne.
R. Y habitó entre nosotros.
(Dios te salve, María...)

V. Ruega por nosotros, Santa Madre de Dios.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo.

Oremos: Derrama, Señor, tu gracia sobre nosotros, que, por el anuncio del Ángel, hemos conocido la encarnación de tu Hijo, para que lleguemos, por su pasión y su cruz, a la gloria de la resurrección. Por Jesucristo Nuestro Señor. Amén.`
  },
  {
    id: 'basicas-alimentos',
    title: "Bendición de los alimentos",
    titleEn: "Blessing Before Meals",
    category: "Oración Básica",
    text: `Bendícenos, Señor,
y bendice estos alimentos
que por tu bondad vamos a recibir.

Da pan a los que tienen hambre
y hambre de Ti a los que tienen pan.

Por Jesucristo Nuestro Señor.
Amén.`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DECK 3: El Santo Rosario (Misterios y Flujo Guiado)
// ─────────────────────────────────────────────────────────────────────────────

export const MISTERIOS_DATA: Record<MysteryType, MysteryInfo> = {
  gozosos: {
    type: 'gozosos',
    name: 'Misterios Gozosos',
    days: 'Lunes y Sábados',
    mysteries: [
      {
        number: 1,
        title: 'La Encarnación del Hijo de Dios',
        biblicalRef: 'Lucas 1, 26-38',
        meditation: 'El Ángel Gabriel anuncia a la Santísima Virgen María que concebirá por obra del Espíritu Santo al Salvador del mundo. María responde con humilde docilidad: "He aquí la esclava del Señor, hágase en mí según tu palabra".'
      },
      {
        number: 2,
        title: 'La Visitación de María a su prima Santa Isabel',
        biblicalRef: 'Lucas 1, 39-56',
        meditation: 'María viaja con prontitud a la montaña de Judea para servir a su prima Isabel. Al escuchar el saludo de María, el niño Juan salta de gozo en el vientre y María proclama el Magníficat alabando la grandeza del Señor.'
      },
      {
        number: 3,
        title: 'El Nacimiento de Jesús en el Portal de Belén',
        biblicalRef: 'Lucas 2, 1-20',
        meditation: 'En la pobreza de un pesebre nace el Rey del Universo. Los ángeles cantan gloria en las alturas y los pastores acuden a adorar al Niño envuelto en pañales, luz del mundo.'
      },
      {
        number: 4,
        title: 'La Presentación del Niño Jesús en el Templo',
        biblicalRef: 'Lucas 2, 22-38',
        meditation: 'María y José presentan al Niño en el Templo según la Ley de Moisés. El anciano Simeón lo toma en sus brazos bendiciendo a Dios y profetiza a María que una espada atravesará su corazón.'
      },
      {
        number: 5,
        title: 'El Niño Jesús perdido y hallado en el Templo',
        biblicalRef: 'Lucas 2, 41-52',
        meditation: 'A los doce años, Jesús permanece en el Templo de Jerusalén entre los maestros. Tras tres días de angustia, sus padres lo encuentran y Jesús les recuerda que debe ocuparse de las cosas de su Padre celestial.'
      }
    ]
  },
  dolorosos: {
    type: 'dolorosos',
    name: 'Misterios Dolorosos',
    days: 'Martes y Viernes',
    mysteries: [
      {
        number: 1,
        title: 'La Oración de Jesús en el Huerto de Getsemaní',
        biblicalRef: 'Mateo 26, 36-46',
        meditation: 'En la agonía de Getsemaní, Jesús experimenta la soledad y suda gotas de sangre por el peso de nuestros pecados, orando al Padre: "No se haga mi voluntad, sino la tuya".'
      },
      {
        number: 2,
        title: 'La Flagelación de Nuestro Señor atado a la Columna',
        biblicalRef: 'Juan 19, 1-3',
        meditation: 'Pilato manda azotar a Jesús cruelmente. El Cordero de Dios sufre en silencio y mansedumbre las heridas que sanan nuestras rebeliones e impurezas.'
      },
      {
        number: 3,
        title: 'La Coronación de Espinas',
        biblicalRef: 'Mateo 27, 27-31',
        meditation: 'Los soldados visten a Jesús con un manto de púrpura, le colocan una corona de punzantes espinas y una caña en su mano, burlándose del Rey de Reyes con bofetadas e insultos.'
      },
      {
        number: 4,
        title: 'Jesús con la Cruz a cuestas camino al Calvario',
        biblicalRef: 'Juan 19, 16-17',
        meditation: 'Jesús abraza el madero de la Cruz y camina hacia el Gólgota. Cae tres veces bajo el peso, es ayudado por el Cirineo y se encuentra con su afligida Madre.'
      },
      {
        number: 5,
        title: 'La Crucifixión y Muerte de Nuestro Señor',
        biblicalRef: 'Lucas 23, 33-46',
        meditation: 'Clavado en la cruz entre dos ladrones, Jesús nos entrega a María como Madre ("Ahí tienes a tu hijo") y, tras tres horas de agonía, exhala su espíritu diciendo: "Todo está cumplido".'
      }
    ]
  },
  gloriosos: {
    type: 'gloriosos',
    name: 'Misterios Gloriosos',
    days: 'Miércoles y Domingos',
    mysteries: [
      {
        number: 1,
        title: 'La Resurrección del Señor',
        biblicalRef: 'Mateo 28, 1-10',
        meditation: 'Al amanecer del tercer día, Cristo vence el poder de la muerte y el pecado saliendo victorioso del sepulcro, trayéndonos la esperanza de la vida eterna.'
      },
      {
        number: 2,
        title: 'La Ascensión del Señor a los Cielos',
        biblicalRef: 'Hechos 1, 6-11',
        meditation: 'Cuarenta días después de resucitar, ante la mirada de sus apóstoles en el Monte de los Olivos, Jesús asciende al Cielo prometiendo estar con nosotros hasta el fin del mundo.'
      },
      {
        number: 3,
        title: 'La Venida del Espíritu Santo en Pentecostés',
        biblicalRef: 'Hechos 2, 1-13',
        meditation: 'Reunidos en oración junto a María en el Cenáculo, los apóstoles reciben al Espíritu Santo en forma de lenguas de fuego, llenándose de valor y gracia para evangelizar al mundo.'
      },
      {
        number: 4,
        title: 'La Asunción de la Santísima Virgen al Cielo',
        biblicalRef: 'Apocalipsis 12, 1',
        meditation: 'Terminado el curso de su vida terrena, la Inmaculada Madre de Dios es asunta en cuerpo y alma a la gloria celestial, anticipo de nuestra propia resurrección.'
      },
      {
        number: 5,
        title: 'La Coronación de María como Reina de Cielos y Tierra',
        biblicalRef: 'Apocalipsis 12, 1-6',
        meditation: 'La Santísima Trinidad corona a la Virgen María como Reina universal, intercesora y medianera de todas las gracias para el pueblo fiel.'
      }
    ]
  },
  luminosos: {
    type: 'luminosos',
    name: 'Misterios Luminosos',
    days: 'Jueves',
    mysteries: [
      {
        number: 1,
        title: 'El Bautismo de Jesús en el Río Jordán',
        biblicalRef: 'Mateo 3, 13-17',
        meditation: 'Jesús desciende a las aguas del Jordán. El Espíritu Santo desciende como paloma y se escucha la voz del Padre: "Este es mi Hijo amado, en quien me complazco".'
      },
      {
        number: 2,
        title: 'La Autorrevelación en las Bodas de Caná',
        biblicalRef: 'Juan 2, 1-12',
        meditation: 'Por intercesión de su Madre ("Hagan lo que Él les diga"), Jesús realiza su primer signo transformando el agua en vino excelente, manifestando su gloria a los discípulos.'
      },
      {
        number: 3,
        title: 'El Anuncio del Reino de Dios y llamado a la Conversión',
        biblicalRef: 'Marcos 1, 14-15',
        meditation: 'Jesús proclama: "El tiempo se ha cumplido y el Reino de Dios está cerca; conviértanse y crean en el Evangelio", perdonando los pecados a los que acuden con fe.'
      },
      {
        number: 4,
        title: 'La Transfiguración del Señor en el Monte Tabor',
        biblicalRef: 'Lucas 9, 28-36',
        meditation: 'Jesús sube al monte con Pedro, Santiago y Juan. Su rostro resplandece como el sol y sus vestiduras se vuelven blancas y deslumbrantes, revelando su gloria divina.'
      },
      {
        number: 5,
        title: 'La Institución de la Santísima Eucaristía',
        biblicalRef: 'Mateo 26, 26-30',
        meditation: 'En la Última Cena, Jesús toma pan y vino, los entrega como su Cuerpo y Sangre para la remisión de los pecados, y nos ordena: "Hagan esto en memoria mía".'
      }
    ]
  }
};

/**
 * Determina automáticamente el tipo de misterio según el día de la semana
 * (0: Domingo, 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado)
 */
export function getMysteryTypeForDay(day?: number): MysteryType {
  const d = day !== undefined ? day : new Date().getDay();
  switch (d) {
    case 1: // Lunes
    case 6: // Sábado
      return 'gozosos';
    case 2: // Martes
    case 5: // Viernes
      return 'dolorosos';
    case 4: // Jueves
      return 'luminosos';
    case 3: // Miércoles
    case 0: // Domingo
    default:
      return 'gloriosos';
  }
}

/**
 * Genera el flujo guiado completo del Santo Rosario paso a paso
 */
export function getSantoRosarioDeck(manualType?: MysteryType): PrayerCard[] {
  const mysteryType = manualType || getMysteryTypeForDay();
  const info = MISTERIOS_DATA[mysteryType];

  const deck: PrayerCard[] = [
    // 1. Guía Visual
    {
      id: 'rosario-guia-visual',
      title: 'Guía y Estructura del Rosario',
      subtitle: `Hoy: ${info.name} (${info.days})`,
      category: 'Santo Rosario',
      isRosaryGuide: true,
      text: `El Santo Rosario es un camino contemplativo de la vida de Jesús a través del corazón de María.

Estructura del rezo:
1. Señal de la Cruz y Credo
2. Padre Nuestro y 3 Ave Marías (Fe, Esperanza y Caridad)
3. Gloria al Padre
4. 5 Misterios del día (Enunciado + Padre Nuestro + 10 Ave Marías + Gloria + Jaculatoria)
5. La Salve, Letanías Lauretanas y Oración Final`
    },

    // 2. Señal de la Cruz
    {
      id: 'rosario-cruz',
      title: '1. Señal de la Santa Cruz',
      subtitle: 'Inicio del Santo Rosario',
      category: 'Santo Rosario',
      text: `Por la señal de la Santa Cruz,
de nuestros enemigos
líbranos Señor, Dios nuestro.

En el nombre del Padre,
y del Hijo,
y del Espíritu Santo.
Amén.`
    },

    // 3. Credo
    {
      id: 'rosario-credo',
      title: '2. Credo de los Apóstoles',
      subtitle: 'Profesión de nuestra Fe en la Cruz',
      category: 'Santo Rosario',
      text: `Creo en Dios, Padre Todopoderoso,
Creador del cielo y de la tierra.

Creo en Jesucristo, su único Hijo, Nuestro Señor,
que fue concebido por obra y gracia del Espíritu Santo,
nació de Santa María Virgen,
padeció bajo el poder de Poncio Pilato,
fue crucificado, muerto y sepultado,
descendió a los infiernos,
al tercer día resucitó de entre los muertos,
subió a los cielos
y está sentado a la derecha de Dios, Padre todopoderoso.
Desde allí ha de venir a juzgar a vivos y muertos.

Creo en el Espíritu Santo,
la santa Iglesia católica,
la comunión de los santos,
el perdón de los pecados,
la resurrección de la carne
y la vida eterna.
Amén.`
    },

    // 4. Padre Nuestro inicial
    {
      id: 'rosario-pn-inicial',
      title: '3. Padre Nuestro',
      subtitle: 'Primera cuenta grande',
      category: 'Santo Rosario',
      text: `Padre nuestro, que estás en el cielo,
santificado sea tu Nombre;
venga a nosotros tu Reino;
hágase tu voluntad en la tierra como en el cielo.

Danos hoy nuestro pan de cada día;
perdona nuestras ofensas,
como también nosotros perdonamos a los que nos ofenden;
no nos dejes caer en la tentación,
y líbranos del mal.
Amén.`
    },

    // 5. Tres Ave Marías (Fe, Esperanza y Caridad)
    {
      id: 'rosario-tres-avemarias',
      title: '4. Tres Ave Marías',
      subtitle: 'Petición por el aumento de Fe, Esperanza y Caridad',
      category: 'Santo Rosario',
      text: `1º Por el aumento de nuestra Fe:
Dios te salve, María, llena eres de gracia...

2º Por el aumento de nuestra Esperanza:
Dios te salve, María, llena eres de gracia...

3º Por el aumento de nuestra Caridad:
Dios te salve, María, llena eres de gracia...

(Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén.)`
    },

    // 6. Gloria al Padre
    {
      id: 'rosario-gloria-inicial',
      title: '5. Gloria al Padre',
      subtitle: 'Alabanza a la Santísima Trinidad',
      category: 'Santo Rosario',
      text: `Gloria al Padre,
y al Hijo,
y al Espíritu Santo.

Como era en el principio,
ahora y siempre,
por los siglos de los siglos.
Amén.`
    }
  ];

  // 7. Ciclo de los 5 Misterios
  info.mysteries.forEach((m) => {
    deck.push({
      id: `rosario-misterio-${m.number}`,
      title: `${m.number}º Misterio: ${m.title}`,
      subtitle: `${info.name} • ${m.biblicalRef || ''}`,
      category: 'Santo Rosario',
      isMysteryCard: true,
      mysteryNumber: m.number,
      mysteryName: m.title,
      mysteryMeditation: m.meditation,
      text: `MEDITACIÓN:
${m.meditation}

ORACIONES DE ESTE MISTERIO:
• 1 Padre Nuestro
• 10 Ave Marías (lleva la cuenta con las esferas)
• 1 Gloria al Padre
• Oración de Fátima:
"Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén."`
    });
  });

  // 8. La Salve
  deck.push({
    id: 'rosario-salve',
    title: 'La Salve',
    subtitle: 'Agradecimiento a Nuestra Madre',
    category: 'Santo Rosario',
    text: `Dios te salve, Reina y Madre de misericordia,
vida, dulzura y esperanza nuestra; Dios te salve.

A Ti llamamos los desterrados hijos de Eva;
a Ti suspiramos, gimiendo y llorando,
en este valle de lágrimas.

Ea, pues, Señora, abogada nuestra,
vuelve a nosotros esos tus ojos misericordiosos;
y después de este destierro muéstranos a Jesús,
fruto bendito de tu vientre.

¡Oh clemente, oh piadosa, oh dulce Virgen María!

V. Ruega por nosotros, Santa Madre de Dios.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo.
Amén.`
  });

  // 9. Letanías Lauretanas
  deck.push({
    id: 'rosario-letanias',
    title: 'Letanías Lauretanas',
    subtitle: 'Invocaciones a la Santísima Virgen',
    category: 'Santo Rosario',
    text: `Señor, ten piedad de nosotros.
Cristo, ten piedad de nosotros.
Señor, ten piedad de nosotros.
Cristo, óyenos. / Cristo, escúchanos.

Dios, Padre celestial, ten piedad de nosotros.
Dios, Hijo, Redentor del mundo, ten piedad de nosotros.
Dios, Espíritu Santo, ten piedad de nosotros.
Santísima Trinidad, un solo Dios, ten piedad de nosotros.

Santa María, *ruega por nosotros.*
Santa Madre de Dios, *ruega por nosotros.*
Santa Virgen de las Vírgenes,
Madre de Cristo,
Madre de la Iglesia,
Madre de la divina gracia,
Madre purísima,
Madre castísima,
Madre siempre virgen,
Madre inmaculada,
Madre amable,
Madre admirable,
Madre del buen consejo,
Madre del Creador,
Madre del Salvador,

Virgen prudentísima,
Virgen digna de veneración,
Virgen digna de alabanza,
Virgen poderosa,
Virgen clemente,
Virgen fiel,

Espejo de justicia,
Trono de la sabiduría,
Causa de nuestra alegría,
Vaso espiritual,
Vaso digno de honor,
Vaso de insigne devoción,
Rosa mística,
Torre de David,
Torre de marfil,
Casa de oro,
Arca de la Alianza,
Puerta del cielo,
Estrella de la mañana,
Salud de los enfermos,
Refugio de los pecadores,
Consuelo de los afligidos,
Auxilio de los cristianos,

Reina de los Ángeles,
Reina de los Patriarcas,
Reina de los Profetas,
Reina de los Apóstoles,
Reina de los Mártires,
Reina de los Confesores,
Reina de las Vírgenes,
Reina de todos los Santos,
Reina concebida sin pecado original,
Reina asunta a los Cielos,
Reina del Santísimo Rosario,
Reina de la familia,
Reina de la paz.

Cordero de Dios, que quitas el pecado del mundo,
perdónanos, Señor.
Cordero de Dios, que quitas el pecado del mundo,
escúchanos, Señor.
Cordero de Dios, que quitas el pecado del mundo,
ten misericordia de nosotros.`
  });

  // 10. Oración Final y Cruz
  deck.push({
    id: 'rosario-final',
    title: 'Oración Final',
    subtitle: 'Conclusión del Santo Rosario',
    category: 'Santo Rosario',
    text: `V. Ruega por nosotros, Santa Madre de Dios.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo.

Oremos:
Te rogamos nos concedas, Señor Dios nuestro, gozar de continua salud de alma y cuerpo, y por la gloriosa intercesión de la bienaventurada siempre Virgen María, vernos libres de las tristezas de la vida presente y disfrutar de las eternas alegrías.
Por Jesucristo Nuestro Señor.
Amén.

Ave María Purísima, sin pecado concebida.

En el nombre del Padre, y del Hijo, y del Espíritu Santo.
Amén.`
  });

  return deck;
}
