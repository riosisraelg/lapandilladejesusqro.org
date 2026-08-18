/**
 * Base de Datos y Generador de Mazos de Oraciones para La Pandilla de Jesús
 * Soporte Bilingüe Canónico Completo (Español / English / Latine)
 */

export interface PrayerCard {
  id: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  category?: string;
  categoryEn?: string;
  text: string;
  textEn?: string;
  isRosaryGuide?: boolean;
  isConfigCard?: boolean;
  isMysteryCard?: boolean;
  mysteryNumber?: number;
  mysteryName?: string;
  mysteryNameEn?: string;
  mysteryMeditation?: string;
  mysteryMeditationEn?: string;
}

export type MysteryType = 'gozosos' | 'dolorosos' | 'gloriosos' | 'luminosos';

export interface MysteryInfo {
  type: MysteryType;
  name: string;
  nameEn: string;
  days: string;
  daysEn: string;
  mysteries: Array<{
    number: number;
    title: string;
    titleEn: string;
    biblicalRef?: string;
    meditation: string;
    meditationEn: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DECK 1: Oraciones de la Comunidad (Predeterminado)
// ─────────────────────────────────────────────────────────────────────────────
export const oracionesComunidad: PrayerCard[] = [
  {
    id: 'comunidad-pandilla',
    title: "Oración de la Pandilla de Jesús",
    titleEn: "Prayer of La Pandilla de Jesús",
    subtitle: "Oración del Grupo Juvenil",
    subtitleEn: "Youth Group Prayer",
    category: "Comunidad",
    categoryEn: "Community",
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
Amén.`,
    textEn: `Jesus, be the Lord of my life.
Take my freedom, my story,
my will, and my youth;
for Your grace is worth more than life itself.

I want to follow You without looking back,
dare to follow Your plan,
and be Your hands and Your feet.

Teach me to discern good from evil,
for it profits nothing to gain the whole world
if I lose You.

I know my weakness is enough for You,
yet I always desire to offer You
a little more.

Thank You for loving me, listening to me,
and trusting in me.

I am Yours, Lord, Yours forever.
Amen.`
  },
  {
    id: 'comunidad-paz',
    title: "Oración por la paz",
    titleEn: "Prayer for Peace",
    subtitle: "Por la justicia y reconciliación",
    subtitleEn: "For justice and reconciliation",
    category: "Comunidad",
    categoryEn: "Community",
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

Septiembre 2025`,
    textEn: `Lord Jesus, You are our peace,
look upon our homeland wounded by violence
and scattered by fear and insecurity.
Comfort the sorrow of those who suffer.
Grant wisdom to the decisions of our leaders.
Touch the hearts of those who forget that we are brothers and sisters
and cause suffering and death.
Grant them the gift of conversion.
Protect families, our children, adolescents,
and young people, our towns and communities.
May we, as Your missionary disciples
and responsible citizens,
know how to be promoters of justice and peace,
so that in You, our people may have a dignified life. AMEN.

Mary, Queen of Peace, pray for us.`
  },
  {
    id: 'comunidad-sagrada-familia',
    title: "Oración a la Sagrada Familia",
    titleEn: "Prayer to the Holy Family",
    subtitle: "Por los hogares y familias",
    subtitleEn: "For homes and families",
    category: "Comunidad",
    categoryEn: "Community",
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

(Papa Francisco, Amoris Laetitia, 325)`,
    textEn: `Jesus, Mary, and Joseph,
in you we contemplate
the splendor of true love;
to you, with trusting hearts, we turn.

Holy Family of Nazareth,
grant that our families too
may be places of communion and prayer,
authentic schools of the Gospel
and small domestic churches.

Holy Family of Nazareth,
may there never again be in our families
episodes of violence, closed-heartedness, or division;
may all who have been wounded or scandalized
speedily find comfort and healing.

Holy Family of Nazareth,
make all people deeply aware
of the sacred and inviolable character of the family,
of its beauty in God's plan.

Jesus, Mary, and Joseph,
graciously hear and welcome our prayer.
Amen.

(Pope Francis, Amoris Laetitia, 325)`
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
    subtitle: "Invocación inicial",
    subtitleEn: "Opening invocation",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
    text: `Por la señal de la Santa Cruz,
de nuestros enemigos
líbranos Señor, Dios nuestro.

En el nombre del Padre,
y del Hijo,
y del Espíritu Santo.
Amén.`,
    textEn: `By the sign of the Holy Cross,
deliver us from our enemies,
O Lord our God.

In the name of the Father,
and of the Son,
and of the Holy Spirit.
Amen.`
  },
  {
    id: 'basicas-padre-nuestro',
    title: "Padre Nuestro",
    titleEn: "The Lord's Prayer (Our Father)",
    subtitle: "La oración que Jesús nos enseñó",
    subtitleEn: "The prayer taught by Jesus",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
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
    subtitle: "Saludo a la Madre de Dios",
    subtitleEn: "Salutation to the Mother of God",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
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
    subtitle: "Doxología Trinitaria",
    subtitleEn: "Trinitarian Doxology",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
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
    subtitle: "Símbolo de la Fe Apostólica",
    subtitleEn: "Symbol of Apostolic Faith",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
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
Amén.`,
    textEn: `I believe in God, the Father Almighty,
Creator of heaven and earth.

And in Jesus Christ, His only Son, our Lord,
who was conceived by the Holy Spirit,
born of the Virgin Mary,
suffered under Pontius Pilate,
was crucified, died and was buried;
He descended into hell;
on the third day He rose again from the dead;
He ascended into heaven,
and is seated at the right hand of God the Father Almighty;
from there He will come to judge the living and the dead.

I believe in the Holy Spirit,
the Holy Catholic Church,
the communion of saints,
the forgiveness of sins,
the resurrection of the body,
and life everlasting.
Amen.`
  },
  {
    id: 'basicas-credo-niceno',
    title: "Credo Niceno-Constantinopolitano",
    titleEn: "Nicene Creed",
    subtitle: "Profesión Solemne de la Fe",
    subtitleEn: "Solemn Profession of Faith",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
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
Amén.`,
    textEn: `I believe in one God, the Father almighty,
maker of heaven and earth,
of all things visible and invisible.

I believe in one Lord Jesus Christ,
the Only Begotten Son of God,
born of the Father before all ages.
God from God, Light from Light,
true God from true God,
begotten, not made, consubstantial with the Father;
through him all things were made.
For us men and for our salvation
he came down from heaven,
and by the Holy Spirit was incarnate of the Virgin Mary,
and became man.
For our sake he was crucified under Pontius Pilate,
he suffered death and was buried,
and rose again on the third day
in accordance with the Scriptures.
He ascended into heaven
and is seated at the right hand of the Father.
He will come again in glory
to judge the living and the dead
and his kingdom will have no end.

I believe in the Holy Spirit, the Lord, the giver of life,
who proceeds from the Father and the Son,
who with the Father and the Son is adored and glorified,
who has spoken through the prophets.

I believe in one, holy, catholic and apostolic Church.
I confess one Baptism for the forgiveness of sins
and I look forward to the resurrection of the dead
and the life of the world to come.
Amen.`
  },
  {
    id: 'basicas-salve',
    title: "La Salve",
    titleEn: "Hail Holy Queen (Salve Regina)",
    subtitle: "Himno a la Madre y Reina",
    subtitleEn: "Hymn to the Mother and Queen",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
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
Amén.`,
    textEn: `Hail, Holy Queen, Mother of Mercy,
our life, our sweetness, and our hope.
To thee do we cry, poor banished children of Eve.
To thee do we send up our sighs,
mourning and weeping in this valley of tears.

Turn then, most gracious advocate,
thine eyes of mercy toward us,
and after this our exile,
show unto us the blessed fruit of thy womb, Jesus.

O clement, O loving, O sweet Virgin Mary.

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ.
Amen.`
  },
  {
    id: 'basicas-acto-contricion',
    title: "Acto de Contrición",
    titleEn: "Act of Contrition",
    subtitle: "Arrepentimiento y propósito de enmienda",
    subtitleEn: "Sincere sorrow and firm purpose of amendment",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
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
Amén.`,
    textEn: `O my God, I am heartily sorry for having offended Thee,
and I detest all my sins because of Thy just punishments,
but most of all because they offend Thee, my God,
who art all good and deserving of all my love.

I firmly resolve, with the help of Thy grace,
to sin no more, to do penance,
and to avoid the near occasions of sin.
Amen.`
  },
  {
    id: 'basicas-angel-guarda',
    title: "Oración al Ángel de la Guarda",
    titleEn: "Guardian Angel Prayer",
    subtitle: "Protección y guía celestial",
    subtitleEn: "Celestial protection and guidance",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
    text: `Ángel de mi guarda,
dulce compañía,
no me desampares,
ni de noche ni de día.

No me dejes solo,
que me perdería,
hasta que descanse
en los brazos de Jesús, José y María.
Amén.`,
    textEn: `Angel of God, my guardian dear,
to whom God's love commits me here,
ever this day be at my side,
to light and guard, to rule and guide.

Do not forsake me by night or by day,
leave me not alone, lest I lose my way,
until I rest in the peace of Jesus, Mary, and Joseph.
Amen.`
  },
  {
    id: 'basicas-angelus',
    title: "El Ángelus",
    titleEn: "The Angelus",
    subtitle: "Memoria de la Encarnación",
    subtitleEn: "Memorial of the Incarnation",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
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
    textEn: `V. The Angel of the Lord declared unto Mary.
R. And she conceived of the Holy Spirit.
(Hail Mary, full of grace...)

V. Behold the handmaid of the Lord.
R. Be it done unto me according to thy word.
(Hail Mary, full of grace...)

V. And the Word was made Flesh.
R. And dwelt among us.
(Hail Mary, full of grace...)

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ.

Let us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that we, to whom the Incarnation of Christ, Thy Son, was made known by the message of an Angel, may by His Passion and Cross be brought to the glory of His Resurrection. Through the same Christ our Lord. Amen.`
  },
  {
    id: 'basicas-alimentos',
    title: "Bendición de los alimentos",
    titleEn: "Blessing Before Meals",
    subtitle: "Acción de gracias en la mesa",
    subtitleEn: "Thanksgiving at the table",
    category: "Oración Básica",
    categoryEn: "Basic Prayer",
    text: `Bendícenos, Señor,
y bendice estos alimentos
que por tu bondad vamos a recibir.

Da pan a los que tienen hambre
y hambre de Ti a los que tienen pan.

Por Jesucristo Nuestro Señor.
Amén.`,
    textEn: `Bless us, O Lord,
and these Thy gifts,
which we are about to receive from Thy bounty.

Grant bread to those who are hungry,
and hunger for Thee to those who have bread.

Through Christ our Lord.
Amen.`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DECK 3: El Santo Rosario (Misterios y Flujo Guiado Bilingüe)
// ─────────────────────────────────────────────────────────────────────────────

export const MISTERIOS_DATA: Record<MysteryType, MysteryInfo> = {
  gozosos: {
    type: 'gozosos',
    name: 'Misterios Gozosos',
    nameEn: 'Joyful Mysteries',
    days: 'Lunes y Sábados',
    daysEn: 'Mondays & Saturdays',
    mysteries: [
      {
        number: 1,
        title: 'La Encarnación del Hijo de Dios',
        titleEn: 'The Annunciation of the Lord',
        biblicalRef: 'Lucas 1, 26-38',
        meditation: 'El Ángel Gabriel anuncia a la Santísima Virgen María que concebirá por obra del Espíritu Santo al Salvador del mundo. María responde con humilde docilidad: "He aquí la esclava del Señor, hágase en mí según tu palabra".',
        meditationEn: 'The Angel Gabriel announces to Mary that she will conceive the Savior of the world through the Holy Spirit. Mary responds: "Behold, I am the handmaid of the Lord; let it be done to me according to your word."'
      },
      {
        number: 2,
        title: 'La Visitación de María a su prima Santa Isabel',
        titleEn: 'The Visitation of Mary to Elizabeth',
        biblicalRef: 'Lucas 1, 39-56',
        meditation: 'María viaja con prontitud a la montaña de Judea para servir a su prima Isabel. Al escuchar el saludo de María, el niño Juan salta de gozo en el vientre y María proclama el Magníficat alabando la grandeza del Señor.',
        meditationEn: 'Mary travels with haste to visit and serve her cousin Elizabeth. John leaps for joy in Elizabeth’s womb, and Mary proclaims the Magnificat, praising the greatness of the Lord.'
      },
      {
        number: 3,
        title: 'El Nacimiento de Jesús en el Portal de Belén',
        titleEn: 'The Nativity of the Lord',
        biblicalRef: 'Lucas 2, 1-20',
        meditation: 'En la pobreza de un pesebre nace el Rey del Universo. Los ángeles cantan gloria en las alturas y los pastores acuden a adorar al Niño envuelto en pañales, luz del mundo.',
        meditationEn: 'The King of the Universe is born in the poverty of a stable. Angels sing glory in the highest and shepherds come to adore the Infant Jesus wrapped in swaddling clothes.'
      },
      {
        number: 4,
        title: 'La Presentación del Niño Jesús en el Templo',
        titleEn: 'The Presentation of Jesus in the Temple',
        biblicalRef: 'Lucas 2, 22-38',
        meditation: 'María y José presentan al Niño en el Templo según la Ley de Moisés. El anciano Simeón lo toma en sus brazos bendiciendo a Dios y profetiza a María que una espada atravesará su corazón.',
        meditationEn: 'Mary and Joseph present Jesus in the Temple according to the Law of Moses. Simeon takes the Child in his arms, blessing God and prophesying that a sword will pierce Mary’s soul.'
      },
      {
        number: 5,
        title: 'El Niño Jesús perdido y hallado en el Templo',
        titleEn: 'The Finding of Jesus in the Temple',
        biblicalRef: 'Lucas 2, 41-52',
        meditation: 'A los doce años, Jesús permanece en el Templo de Jerusalén entre los maestros. Tras tres días de angustia, sus padres lo encuentran y Jesús les recuerda que debe ocuparse de las cosas de su Padre celestial.',
        meditationEn: 'At age twelve, Jesus remains in the Temple among the teachers. After three days of searching, His parents find Him, and Jesus gently reminds them He must be in His Father’s house.'
      }
    ]
  },
  dolorosos: {
    type: 'dolorosos',
    name: 'Misterios Dolorosos',
    nameEn: 'Sorrowful Mysteries',
    days: 'Martes y Viernes',
    daysEn: 'Tuesdays & Fridays',
    mysteries: [
      {
        number: 1,
        title: 'La Oración de Jesús en el Huerto de Getsemaní',
        titleEn: 'The Agony in the Garden of Gethsemane',
        biblicalRef: 'Mateo 26, 36-46',
        meditation: 'En la agonía de Getsemaní, Jesús experimenta la soledad y suda gotas de sangre por el peso de nuestros pecados, orando al Padre: "No se haga mi voluntad, sino la tuya".',
        meditationEn: 'In Gethsemane, Jesus prays in sorrow and sweat like drops of blood, completely submitting to the Father: "Not my will, but yours be done."'
      },
      {
        number: 2,
        title: 'La Flagelación de Nuestro Señor atado a la Columna',
        titleEn: 'The Scourging at the Pillar',
        biblicalRef: 'Juan 19, 1-3',
        meditation: 'Pilato manda azotar a Jesús cruelmente. El Cordero de Dios sufre en silencio y mansedumbre las heridas que sanan nuestras rebeliones e impurezas.',
        meditationEn: 'Pilate orders Jesus to be scourged. The Lamb of God endures the brutal lashes in meek silence, healing our transgressions by His holy wounds.'
      },
      {
        number: 3,
        title: 'La Coronación de Espinas',
        titleEn: 'The Crowning with Thorns',
        biblicalRef: 'Mateo 27, 27-31',
        meditation: 'Los soldados visten a Jesús con un manto de púrpura, le colocan una corona de punzantes espinas y una caña en su mano, burlándose del Rey de Reyes con bofetadas e insultos.',
        meditationEn: 'Soldiers mock Jesus with a purple cloak, placing a crown of sharp thorns on His head and a reed in His hand, mocking the King of Kings with blows and insults.'
      },
      {
        number: 4,
        title: 'Jesús con la Cruz a cuestas camino al Calvario',
        titleEn: 'The Carrying of the Cross to Calvary',
        biblicalRef: 'Juan 19, 16-17',
        meditation: 'Jesús abraza el madero de la Cruz y camina hacia el Gólgota. Cae tres veces bajo el peso, es ayudado por el Cirineo y se encuentra con su afligida Madre.',
        meditationEn: 'Jesus embraces the heavy Cross and walks towards Calvary. Falling under its weight, He is aided by Simon of Cyrene and meets His sorrowful Mother.'
      },
      {
        number: 5,
        title: 'La Crucifixión y Muerte de Nuestro Señor',
        titleEn: 'The Crucifixion and Death of Our Lord',
        biblicalRef: 'Lucas 23, 33-46',
        meditation: 'Clavado en la cruz entre dos ladrones, Jesús nos entrega a María como Madre ("Ahí tienes a tu hijo") y, tras tres horas de agonía, exhala su espíritu diciendo: "Todo está cumplido".',
        meditationEn: 'Nailed to the Cross, Jesus gives us Mary as our Mother ("Behold your mother") and, after three hours of agony, yields His spirit, saying: "It is finished."'
      }
    ]
  },
  gloriosos: {
    type: 'gloriosos',
    name: 'Misterios Gloriosos',
    nameEn: 'Glorious Mysteries',
    days: 'Miércoles y Domingos',
    daysEn: 'Wednesdays & Sundays',
    mysteries: [
      {
        number: 1,
        title: 'La Resurrección del Señor',
        titleEn: 'The Resurrection of the Lord',
        biblicalRef: 'Mateo 28, 1-10',
        meditation: 'Al amanecer del tercer día, Cristo vence el poder de la muerte y el pecado saliendo victorioso del sepulcro, trayéndonos la esperanza de la vida eterna.',
        meditationEn: 'On the third day, Christ triumphs victoriously over death and sin, rising from the tomb and opening for us the gates of everlasting life.'
      },
      {
        number: 2,
        title: 'La Ascensión del Señor a los Cielos',
        titleEn: 'The Ascension of the Lord into Heaven',
        biblicalRef: 'Hechos 1, 6-11',
        meditation: 'Cuarenta días después de resucitar, ante la mirada de sus apóstoles en el Monte de los Olivos, Jesús asciende al Cielo prometiendo estar con nosotros hasta el fin del mundo.',
        meditationEn: 'Forty days after His resurrection, in the presence of His disciples on Mount Olivet, Jesus ascends into heaven, promising to be with us until the end of the age.'
      },
      {
        number: 3,
        title: 'La Venida del Espíritu Santo en Pentecostés',
        titleEn: 'The Descent of the Holy Spirit at Pentecost',
        biblicalRef: 'Hechos 2, 1-13',
        meditation: 'Reunidos en oración junto a María en el Cenáculo, los apóstoles reciben al Espíritu Santo en forma de lenguas de fuego, llenándose de valor y gracia para evangelizar al mundo.',
        meditationEn: 'Gathered in prayer with Mary in the Upper Room, the Apostles receive the Holy Spirit as tongues of fire, filled with courage to proclaim the Gospel to the nations.'
      },
      {
        number: 4,
        title: 'La Asunción de la Santísima Virgen al Cielo',
        titleEn: 'The Assumption of the Blessed Virgin Mary into Heaven',
        biblicalRef: 'Apocalipsis 12, 1',
        meditation: 'Terminado el curso de su vida terrena, la Inmaculada Madre de Dios es asunta en cuerpo y alma a la gloria celestial, anticipo de nuestra propia resurrección.',
        meditationEn: 'Having completed the course of her earthly life, the Immaculate Mother of God is taken up body and soul into heavenly glory, a sign of hope for our own resurrection.'
      },
      {
        number: 5,
        title: 'La Coronación de María como Reina de Cielos y Tierra',
        titleEn: 'The Coronation of Mary as Queen of Heaven and Earth',
        biblicalRef: 'Apocalipsis 12, 1-6',
        meditation: 'La Santísima Trinidad corona a la Virgen María como Reina universal, intercesora y medianera de todas las gracias para el pueblo fiel.',
        meditationEn: 'The Most Holy Trinity crowns Mary as Queen of Heaven and Earth, loving intercessor and advocate of all graces for God’s faithful children.'
      }
    ]
  },
  luminosos: {
    type: 'luminosos',
    name: 'Misterios Luminosos',
    nameEn: 'Luminous Mysteries',
    days: 'Jueves',
    daysEn: 'Thursdays',
    mysteries: [
      {
        number: 1,
        title: 'El Bautismo de Jesús en el Río Jordán',
        titleEn: 'The Baptism of Jesus in the Jordan',
        biblicalRef: 'Mateo 3, 13-17',
        meditation: 'Jesús desciende a las aguas del Jordán. El Espíritu Santo desciende como paloma y se escucha la voz del Padre: "Este es mi Hijo amado, en quien me complazco".',
        meditationEn: 'Jesus steps into the Jordan River. The Holy Spirit descends like a dove, and the Father’s voice proclaims: "This is my beloved Son, with whom I am well pleased."'
      },
      {
        number: 2,
        title: 'La Autorrevelación en las Bodas de Caná',
        titleEn: 'The Self-Revelation at the Wedding at Cana',
        biblicalRef: 'Juan 2, 1-12',
        meditation: 'Por intercesión de su Madre ("Hagan lo que Él les diga"), Jesús realiza su primer signo transformando el agua en vino excelente, manifestando su gloria a los discípulos.',
        meditationEn: 'At Mary’s intercession ("Do whatever He tells you"), Jesus performs His first public sign, changing water into fine wine and revealing His divine glory.'
      },
      {
        number: 3,
        title: 'El Anuncio del Reino de Dios y llamado a la Conversión',
        titleEn: 'The Proclamation of the Kingdom of God and Call to Conversion',
        biblicalRef: 'Marcos 1, 14-15',
        meditation: 'Jesús proclama: "El tiempo se ha cumplido y el Reino de Dios está cerca; conviértanse y crean en el Evangelio", perdonando los pecados a los que acuden con fe.',
        meditationEn: 'Jesus proclaims: "The time is fulfilled, and the kingdom of God is at hand; repent and believe in the Gospel," bestowing mercy on all who come in faith.'
      },
      {
        number: 4,
        title: 'La Transfiguración del Señor en el Monte Tabor',
        titleEn: 'The Transfiguration of the Lord on Mount Tabor',
        biblicalRef: 'Lucas 9, 28-36',
        meditation: 'Jesús sube al monte con Pedro, Santiago y Juan. Su rostro resplandece como el sol y sus vestiduras se vuelven blancas y deslumbrantes, revelando su gloria divina.',
        meditationEn: 'On Mount Tabor before Peter, James, and John, Jesus’ face shines like the sun and His garments become dazzling white, revealing His heavenly glory.'
      },
      {
        number: 5,
        title: 'La Institución de la Santísima Eucaristía',
        titleEn: 'The Institution of the Holy Eucharist',
        biblicalRef: 'Mateo 26, 26-30',
        meditation: 'En la Última Cena, Jesús toma pan y vino, los entrega como su Cuerpo y Sangre para la remisión de los pecados, y nos ordena: "Hagan esto en memoria mía".',
        meditationEn: 'At the Last Supper, Jesus offers His Body and Blood under the species of bread and wine, giving us the sacrament of eternal love: "Do this in memory of me."'
      }
    ]
  }
};

/**
 * Determina automáticamente el tipo de misterio según el día de la semana
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

export type RosaryVariant = 'mexicana' | 'misionera' | 'universal' | 'latin';

export interface RosaryContinentInfo {
  continent: string;
  continentEn: string;
  color: string;
  colorEn: string;
  emoji: string;
  intention: string;
  intentionEn: string;
}

export const CONTINENTES_MISIONEROS: RosaryContinentInfo[] = [
  { continent: "África", continentEn: "Africa", color: "Verde", colorEn: "Green", emoji: "🟢", intention: "Por la paz, sus selvas y la fe naciente de sus comunidades cristianas.", intentionEn: "For peace, its forests, and the blossoming faith of its Christian communities." },
  { continent: "América", continentEn: "America", color: "Rojo", colorEn: "Red", emoji: "🔴", intention: "Por la sangre de los mártires, la justicia y la fe de todos nuestros pueblos.", intentionEn: "For the blood of martyrs, social justice, and the living faith of all our peoples." },
  { continent: "Europa", continentEn: "Europe", color: "Blanco", colorEn: "White", emoji: "⚪", intention: "Por el Santo Padre, la unidad de la Iglesia y el renacer espiritual de sus raíces.", intentionEn: "For the Holy Father, the unity of the Church, and the spiritual renewal of its Christian roots." },
  { continent: "Oceanía", continentEn: "Oceania", color: "Azul", colorEn: "Blue", emoji: "🔵", intention: "Por las islas y mares lejanos que esperan la luz del Evangelio.", intentionEn: "For the distant islands and vast seas that await the bright light of the Gospel." },
  { continent: "Asia", continentEn: "Asia", color: "Amarillo", colorEn: "Yellow", emoji: "🟡", intention: "Por los miles de millones de hermanos en la cuna de las grandes culturas.", intentionEn: "For the billions of brothers and sisters in the cradle of ancient cultures and religions." }
];

export const MYSTERY_TITLES_LATIN: Record<MysteryType, { name: string; mysteries: string[] }> = {
  gozosos: {
    name: "Mysteria Gaudiosa",
    mysteries: [
      "1. Annuntiatio Domini",
      "2. Visitatio Mariae Virginis ad Elisabeth",
      "3. Nativitas Domini nostri Iesu Christi",
      "4. Praesentatio Iesu in Templo",
      "5. Inventio Iesu in Templo"
    ]
  },
  dolorosos: {
    name: "Mysteria Dolorosa",
    mysteries: [
      "1. Agonia Iesu in Horto Gethsemani",
      "2. Flagellatio Domini nostri ad columnam",
      "3. Coronatio spinis",
      "4. Baiulatio crucis ad Calvariae locum",
      "5. Crucifixio et mors Domini"
    ]
  },
  gloriosos: {
    name: "Mysteria Gloriosa",
    mysteries: [
      "1. Resurrectio Domini a mortuis",
      "2. Ascensio Domini in Caelum",
      "3. Missio Spiritus Sancti in discipulos",
      "4. Assumptio Beatae Mariae Virginis",
      "5. Coronatio Beatae Mariae Virginis in Caelis"
    ]
  },
  luminosos: {
    name: "Mysteria Luminosa",
    mysteries: [
      "1. Baptisma Iesu in Iordane",
      "2. Autorevelatio Iesu ad nuptias Canenses",
      "3. Regni Dei proclamatio et ad conversionem invitatio",
      "4. Transfiguratio Domini in Monte Thabor",
      "5. Eucharistiae Institutio in Ultima Cena"
    ]
  }
};

/**
 * Genera el flujo guiado completo del Santo Rosario según el tipo de misterio y variante
 * Incluye textos completos en Español, Inglés y Latín
 */
export function getSantoRosarioDeck(manualType?: MysteryType, variant: RosaryVariant = 'mexicana'): PrayerCard[] {
  const mysteryType = manualType || getMysteryTypeForDay();
  const info = MISTERIOS_DATA[mysteryType];

  if (variant === 'misionera') {
    // ─────────────────────────────────────────────────────────────────────────
    // VARIANTE: ROSARIO MISIONERO (5 CONTINENTES)
    // ─────────────────────────────────────────────────────────────────────────
    const deck: PrayerCard[] = [
      {
        id: 'rosario-misionero-guia',
        title: 'Rosario Misionero • Los 5 Continentes',
        titleEn: 'Missionary Rosary • The 5 Continents',
        subtitle: `Hoy: ${info.name}`,
        subtitleEn: `Today: ${info.nameEn}`,
        category: 'Santo Rosario Misionero',
        categoryEn: 'Missionary Holy Rosary',
        isRosaryGuide: true,
        isConfigCard: true,
        text: `El Rosario Misionero es una oración universal que abraza a toda la humanidad a través de los 5 colores simbólicos:

🟢 1er Misterio: Verde por África (selvas y fe naciente)
🔴 2do Misterio: Rojo por América (sangre de mártires e indígenas)
⚪ 3er Misterio: Blanco por Europa (sede de Pedro y unidad)
🔵 4to Misterio: Azul por Oceanía (islas y mares)
🟡 5to Misterio: Amarillo por Asia (pueblos y culturas milenarias)

En cada misterio rezamos: 1 Padre Nuestro, 10 Ave Marías, 1 Gloria y la jaculatoria misionera:
"¡Santa María, Reina de las Misiones; ruega al Señor Jesús por nosotros!"`,
        textEn: `The Missionary Rosary is a universal prayer that embraces all humanity through 5 symbolic colors:

🟢 1st Mystery: Green for Africa (its forests and blossoming faith)
🔴 2nd Mystery: Red for America (the blood of martyrs and its peoples)
⚪ 3rd Mystery: White for Europe (the Holy See and Christian unity)
🔵 4th Mystery: Blue for Oceania (the islands and vast oceans)
🟡 5th Mystery: Yellow for Asia (the ancient cradle of cultures)

In each mystery we pray: 1 Our Father, 10 Hail Marys, 1 Glory Be, and the missionary aspiration:
"Holy Mary, Queen of the Missions; pray to the Lord Jesus for us!"`
      },
      {
        id: 'rosario-misionero-cruz-ofrecimiento',
        title: '1. Señal de la Cruz y Ofrecimiento Misionero',
        titleEn: '1. Sign of the Cross and Missionary Offering',
        subtitle: 'Inicio en el amor universal',
        subtitleEn: 'Opening in universal love',
        category: 'Santo Rosario Misionero',
        categoryEn: 'Missionary Holy Rosary',
        text: `Por la señal de la Santa Cruz, de nuestros enemigos líbranos Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.

Ofrecimiento:
Señor Jesús, dueño de la mies, te ofrecemos este Santo Rosario Misionero por la evangelización del mundo entero, por los misioneros que anuncian tu Palabra y por la paz de todos los pueblos.

Señor mío Jesucristo, Dios y Hombre verdadero, me pesa de todo corazón haberte ofendido. Propongo firmemente nunca más pecar. Amén.`,
        textEn: `By the sign of the Holy Cross, deliver us from our enemies, O Lord our God. In the name of the Father, and of the Son, and of the Holy Spirit. Amen.

Offering:
Lord Jesus, Lord of the harvest, we offer You this Holy Missionary Rosary for the evangelization of the entire world, for the missionaries proclaiming Your Word, and for peace among all nations.

O my God, I am heartily sorry for having offended Thee. I firmly resolve, with the help of Thy grace, to sin no more. Amen.`
      },
      {
        id: 'rosario-misionero-credo',
        title: '2. Credo de los Apóstoles',
        titleEn: '2. Apostles\' Creed',
        subtitle: 'Profesión de la Fe Universal',
        subtitleEn: 'Profession of Universal Faith',
        category: 'Santo Rosario Misionero',
        categoryEn: 'Missionary Holy Rosary',
        text: `Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra.

Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos.

Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.`,
        textEn: `I believe in God, the Father Almighty, Creator of heaven and earth.

And in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from there He will come to judge the living and the dead.

I believe in the Holy Spirit, the Holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.`
      },
      {
        id: 'rosario-misionero-pn-tres-avemarias',
        title: '3. Padre Nuestro y 3 Ave Marías Iniciales',
        titleEn: '3. Our Father and 3 Initial Hail Marys',
        subtitle: 'Por el Papa y los misioneros del mundo',
        subtitleEn: 'For the Pope and world missionaries',
        category: 'Santo Rosario Misionero',
        categoryEn: 'Missionary Holy Rosary',
        text: `Padre nuestro, que estás en el cielo...

1º Por el Santo Padre y la Iglesia: Dios te salve, María...
2º Por las vocaciones sacerdotales y misioneras: Dios te salve, María...
3º Por todos los que aún no conocen a Cristo: Dios te salve, María...

Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`,
        textEn: `Our Father, who art in heaven...

1st For the Holy Father and the Church: Hail Mary...
2nd For priestly and missionary vocations: Hail Mary...
3rd For all who do not yet know Christ: Hail Mary...

Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.`
      }
    ];

    // 5 Misterios Misioneros
    info.mysteries.forEach((m, idx) => {
      const cont = CONTINENTES_MISIONEROS[idx] || CONTINENTES_MISIONEROS[0];
      deck.push({
        id: `rosario-misionero-misterio-${m.number}`,
        title: `${m.number}º Misterio: ${m.title}`,
        titleEn: `${m.number}th Mystery: ${m.titleEn}`,
        subtitle: `${cont.emoji} Continente: ${cont.continent} (${cont.color}) • ${info.name}`,
        subtitleEn: `${cont.emoji} Continent: ${cont.continentEn} (${cont.colorEn}) • ${info.nameEn}`,
        category: 'Santo Rosario Misionero',
        categoryEn: 'Missionary Holy Rosary',
        isMysteryCard: true,
        mysteryNumber: m.number,
        mysteryName: m.title,
        mysteryNameEn: m.titleEn,
        mysteryMeditation: m.meditation,
        mysteryMeditationEn: m.meditationEn,
        text: `INTENCIÓN MISIONERA:
${cont.emoji} Oramos por ${cont.continent} (${cont.color}): ${cont.intention}

MEDITACIÓN:
${m.meditation} (${m.biblicalRef || ''})

ORACIONES DE ESTE MISTERIO:
• 1 Padre Nuestro
• 10 Ave Marías (lleva la cuenta con las esferas)
• 1 Gloria al Padre
• Jaculatoria Misionera:
"¡Santa María, Reina de las Misiones; ruega al Señor Jesús por nosotros!"
• Jaculatoria de Fátima:
"Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén."`,
        textEn: `MISSIONARY INTENTION:
${cont.emoji} We pray for ${cont.continentEn} (${cont.colorEn}): ${cont.intentionEn}

MEDITATION:
${m.meditationEn} (${m.biblicalRef || ''})

PRAYERS OF THIS MYSTERY:
• 1 Our Father
• 10 Hail Marys (track using the decade beads)
• 1 Glory Be
• Missionary Aspiration:
"Holy Mary, Queen of the Missions; pray to the Lord Jesus for us!"
• Fatima Aspiration:
"O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of Thy mercy. Amen."`
      });
    });

    // Tres últimas Ave Marías (Tres Divinas Personas)
    deck.push({
      id: 'rosario-misionero-tres-ultimas',
      title: 'Las Tres Últimas Ave Marías',
      titleEn: 'The Three Final Hail Marys',
      subtitle: 'A las Tres Divinas Personas',
      subtitleEn: 'To the Three Divine Persons',
      category: 'Santo Rosario Misionero',
      categoryEn: 'Missionary Holy Rosary',
      text: `Padre Nuestro, que estás en el cielo...

1.- Dios te salve María, Hija de Dios Padre; en Tus Manos ponemos nuestra Fe para que la ilumines; llena eres de gracia, el Señor es contigo; bendita Tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.

2.- Dios te salve María, Madre de Dios Hijo; en Tus Manos ponemos nuestra Esperanza para que la alientes; llena eres de gracia, el Señor es contigo; bendita Tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.

3.- Dios te salve María, Esposa de Dios Espíritu Santo; en Tus Manos ponemos nuestra Caridad para que la inflames; llena eres de gracia, el Señor es contigo; bendita Tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.

Dios te salve María; Templo, Trono y Sagrario de la Santísima Trinidad; Virgen concebida sin pecado original.`,
      textEn: `Our Father, who art in heaven...

1.- Hail Mary, Daughter of God the Father; into Thy hands we commend our Faith that Thou mayest enlighten it; full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.

2.- Hail Mary, Mother of God the Son; into Thy hands we commend our Hope that Thou mayest encourage it; full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.

3.- Hail Mary, Spouse of the Holy Spirit; into Thy hands we commend our Charity that Thou mayest enkindle it; full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.

Hail Mary, Temple and Tabernacle of the Most Holy Trinity; Virgin conceived without original sin.`
    });

    // La Salve Misionera
    deck.push({
      id: 'rosario-misionero-salve',
      title: 'La Salve Regina',
      titleEn: 'Hail Holy Queen',
      subtitle: 'Madre de todas las Naciones',
      subtitleEn: 'Mother of all Nations',
      category: 'Santo Rosario Misionero',
      categoryEn: 'Missionary Holy Rosary',
      text: `Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve.

A Ti llamamos los desterrados hijos de Eva; a Ti suspiramos, gimiendo y llorando, en este valle de lágrimas.

Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre.

¡Oh clemente, oh piadosa, oh dulce Virgen María!

V. Ruega por nosotros, Santa Madre de Dios y Reina de las Misiones.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.`,
      textEn: `Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears.

Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus.

O clement, O loving, O sweet Virgin Mary.

V. Pray for us, Holy Mother of God and Queen of the Missions.
R. That we may be made worthy of the promises of Christ. Amen.`
    });

    // Oración Misionera Final
    deck.push({
      id: 'rosario-misionero-final',
      title: 'Oración Misionera Final',
      titleEn: 'Concluding Missionary Prayer',
      subtitle: 'Envío y Bendición Universal',
      subtitleEn: 'Mission Sending and Universal Blessing',
      category: 'Santo Rosario Misionero',
      categoryEn: 'Missionary Holy Rosary',
      text: `Oremos:
Señor Dios nuestro, que has querido que tu Iglesia sea sacramento universal de salvación para todos los pueblos: derrama sobre el mundo entero el fuego de tu Espíritu Santo, bendice a los misioneros en África, América, Europa, Oceanía y Asia, y haz que la luz de tu Evangelio llegue hasta los confines de la tierra.
Por Jesucristo Nuestro Señor. Amén.

¡Santa María, Reina de las Misiones!
— Ruega al Señor Jesús por nosotros.

En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.`,
      textEn: `Let us pray:
O Lord our God, who hast willed that Thy Church be the universal sacrament of salvation for all peoples: pour out upon the whole world the living fire of Thy Holy Spirit, bless the missionaries in Africa, America, Europe, Oceania, and Asia, and grant that the light of Thy Gospel may reach the ends of the earth.
Through Christ our Lord. Amen.

Holy Mary, Queen of the Missions!
— Pray to the Lord Jesus for us.

In the name of the Father, and of the Son, and of the Holy Spirit. Amen.`
    });

    return deck;
  }

  if (variant === 'latin') {
    // ─────────────────────────────────────────────────────────────────────────
    // VARIANTE: LATÍN (ROSARIUM VIRGINIS MARIAE)
    // ─────────────────────────────────────────────────────────────────────────
    const latinInfo = MYSTERY_TITLES_LATIN[mysteryType];
    const deck: PrayerCard[] = [
      {
        id: 'rosario-latin-guia',
        title: 'Rosarium Virginis Mariae',
        titleEn: 'The Holy Rosary in Latin',
        subtitle: `Hodie: ${latinInfo.name}`,
        subtitleEn: `Today: ${latinInfo.name} (${info.nameEn})`,
        category: 'Rosarium Latine',
        categoryEn: 'Latin Rosary',
        isRosaryGuide: true,
        isConfigCard: true,
        text: `Rosarium est oratio contemplativa Christi mysteriorum cum Maria Virgine.

Ordo orationis:
1. Signum Crucis & Symbolum Apostolorum
2. Pater Noster & Tres Ave Mariae (pro Fide, Spe et Caritate)
3. Gloria Patri
4. Quinque Mysteria (Pater Noster + 10 Ave Mariae + Gloria Patri + Oratio Fatimae)
5. Salve Regina, Litaniae Lauretanae & Oratio Conclusiva`,
        textEn: `The Rosary is a contemplative prayer on the mysteries of Christ with the Virgin Mary.

Order of prayer in classical Latin:
1. Sign of the Cross & Apostles' Creed
2. Our Father & Three Hail Marys (for Faith, Hope, and Charity)
3. Glory Be
4. Five Mysteries (Our Father + 10 Hail Marys + Glory Be + Fatima Prayer)
5. Salve Regina, Litany of Loreto & Concluding Prayer`
      },
      {
        id: 'rosario-latin-signum-credo',
        title: '1. Signum Crucis & Symbolum Apostolorum',
        titleEn: '1. Sign of the Cross & Apostles\' Creed',
        subtitle: 'Professio Fidei',
        subtitleEn: 'Profession of Faith',
        category: 'Rosarium Latine',
        categoryEn: 'Latin Rosary',
        text: `In nomine Patris, et Filii, et Spiritus Sancti. Amen.

Credo in Deum Patrem omnipotentem, Creatorem caeli et terrae. Et in Iesum Christum, Filium eius unicum, Dominum nostrum, qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus, et sepultus, descendit ad inferos, tertia die resurrexit a mortuis, ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis, inde venturus est iudicare vivos et mortuos.

Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.`,
        textEn: `In nomine Patris, et Filii, et Spiritus Sancti. Amen.

Credo in Deum Patrem omnipotentem, Creatorem caeli et terrae. Et in Iesum Christum, Filium eius unicum, Dominum nostrum, qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus, et sepultus, descendit ad inferos, tertia die resurrexit a mortuis, ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis, inde venturus est iudicare vivos et mortuos.

Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.`
      },
      {
        id: 'rosario-latin-pater-tres-ave',
        title: '2. Pater Noster & Tres Ave Mariae',
        titleEn: '2. Our Father & Three Hail Marys',
        subtitle: 'Pro Fide, Spe et Caritate',
        subtitleEn: 'For Faith, Hope, and Charity',
        category: 'Rosarium Latine',
        categoryEn: 'Latin Rosary',
        text: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum cotidianum da nobis hodie, et dimitte nobis debita nostra sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem: sed libera nos a malo. Amen.

1. Pro Fide: Ave Maria, gratia plena, Dominus tecum...
2. Pro Spe: Ave Maria, gratia plena, Dominus tecum...
3. Pro Caritate: Ave Maria, gratia plena, Dominus tecum...

Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.

Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc et semper, et in saecula saeculorum. Amen.`,
        textEn: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum cotidianum da nobis hodie, et dimitte nobis debita nostra sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem: sed libera nos a malo. Amen.

1. Pro Fide (For Faith): Ave Maria, gratia plena, Dominus tecum...
2. Pro Spe (For Hope): Ave Maria, gratia plena, Dominus tecum...
3. Pro Caritate (For Charity): Ave Maria, gratia plena, Dominus tecum...

Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.

Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc et semper, et in saecula saeculorum. Amen.`
      }
    ];

    // 5 Mysteria
    info.mysteries.forEach((m, idx) => {
      const latTitle = latinInfo.mysteries[idx] || m.title;
      deck.push({
        id: `rosario-latin-mysterium-${m.number}`,
        title: `${m.number}. Mysterium: ${latTitle}`,
        titleEn: `${m.number}. Mystery: ${latTitle} (${m.titleEn})`,
        subtitle: `${latinInfo.name} • ${m.biblicalRef || ''}`,
        subtitleEn: `${latinInfo.name} • ${m.biblicalRef || ''}`,
        category: 'Rosarium Latine',
        categoryEn: 'Latin Rosary',
        isMysteryCard: true,
        mysteryNumber: m.number,
        mysteryName: latTitle,
        mysteryNameEn: m.titleEn,
        mysteryMeditation: m.meditation,
        mysteryMeditationEn: m.meditationEn,
        text: `MEDITATIO:
${m.meditation}

ORATIONES HUIUS MYSTERII:
• 1 Pater Noster
• 10 Ave Mariae (Decena)
• 1 Gloria Patri
• Oratio Fatimae:
"O mi Iesu, dimitte nobis debita nostra, libera nos ab igne inferni, perduc in caelum omnes animas, praesertim eas quae misericordiae tuae maxime indigent. Amen."`,
        textEn: `MEDITATIO (Meditation):
${m.meditationEn}

ORATIONES HUIUS MYSTERII:
• 1 Pater Noster
• 10 Ave Mariae (Decade)
• 1 Gloria Patri
• Oratio Fatimae:
"O mi Iesu, dimitte nobis debita nostra, libera nos ab igne inferni, perduc in caelum omnes animas, praesertim eas quae misericordiae tuae maxime indigent. Amen."`
      });
    });

    deck.push({
      id: 'rosario-latin-salve',
      title: 'Salve Regina',
      titleEn: 'Salve Regina (Hail Holy Queen)',
      subtitle: 'Antiphona Beatae Mariae Virginis',
      subtitleEn: 'Antiphon to the Blessed Virgin Mary',
      category: 'Rosarium Latine',
      categoryEn: 'Latin Rosary',
      text: `Salve, Regina, Mater misericordiae; vita, dulcedo et spes nostra, salve.

Ad te clamamus, exsules filii Evae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle.

Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende.

O clemens, o pia, o dulcis Virgo Maria.

V. Ora pro nobis, Sancta Dei Genetrix.
R. Ut digni efficiamur promissionibus Christi. Amen.`,
      textEn: `Salve, Regina, Mater misericordiae; vita, dulcedo et spes nostra, salve.

Ad te clamamus, exsules filii Evae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle.

Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende.

O clemens, o pia, o dulcis Virgo Maria.

V. Ora pro nobis, Sancta Dei Genetrix.
R. Ut digni efficiamur promissionibus Christi. Amen.`
    });

    deck.push({
      id: 'rosario-latin-conclusio',
      title: 'Oratio Conclusiva',
      titleEn: 'Concluding Prayer in Latin',
      subtitle: 'Benedictio Finalis',
      subtitleEn: 'Final Blessing',
      category: 'Rosarium Latine',
      categoryEn: 'Latin Rosary',
      text: `Oremus:
Deus, cuius Unigenitus per vitam, mortem et resurrectionem suam nobis salutis aeternae praemia comparavit: concede, quaesumus; ut haec mysteria sacratissimo Beatae Mariae Virginis Rosario recolentes, et imitemur quod continent, et quod promittunt assequamur.
Per Christum Dominum nostrum. Amen.

In nomine Patris, et Filii, et Spiritus Sancti. Amen.`,
      textEn: `Oremus (Let us pray):
Deus, cuius Unigenitus per vitam, mortem et resurrectionem suam nobis salutis aeternae praemia comparavit: concede, quaesumus; ut haec mysteria sacratissimo Beatae Mariae Virginis Rosario recolentes, et imitemur quod continent, et quod promittunt assequamur.
Per Christum Dominum nostrum. Amen.

In nomine Patris, et Filii, et Spiritus Sancti. Amen.`
    });

    return deck;
  }

  if (variant === 'universal') {
    // ─────────────────────────────────────────────────────────────────────────
    // VARIANTE: UNIVERSAL / ROMANA (ESTÁNDAR VATICANO)
    // ─────────────────────────────────────────────────────────────────────────
    const deck: PrayerCard[] = [
      {
        id: 'rosario-universal-guia',
        title: 'Santo Rosario • Guía Universal',
        titleEn: 'Holy Rosary • Universal Roman Guide',
        subtitle: `Hoy: ${info.name} (${info.days})`,
        subtitleEn: `Today: ${info.nameEn} (${info.daysEn})`,
        category: 'Santo Rosario Universal',
        categoryEn: 'Universal Holy Rosary',
        isRosaryGuide: true,
        isConfigCard: true,
        text: `Estructura Universal del Santo Rosario según la tradición de la Iglesia:
1. Señal de la Cruz y Credo Apostólico
2. Padre Nuestro y 3 Ave Marías (Fe, Esperanza, Caridad)
3. Gloria al Padre
4. 5 Misterios del día (Padre Nuestro + 10 Ave Marías + Gloria + Jaculatoria de Fátima)
5. La Salve, Letanías Lauretanas y Oración Conclusiva`,
        textEn: `Universal Structure of the Holy Rosary according to Church tradition:
1. Sign of the Cross and Apostles' Creed
2. Our Father and 3 Hail Marys (for Faith, Hope, and Charity)
3. Glory Be
4. 5 Mysteries of the day (Our Father + 10 Hail Marys + Glory Be + Fatima Prayer)
5. Hail Holy Queen, Litany of Loreto, and Concluding Prayer`
      },
      {
        id: 'rosario-universal-cruz-credo',
        title: '1. Señal de la Cruz y Credo',
        titleEn: '1. Sign of the Cross and Creed',
        subtitle: 'Inicio y Profesión de Fe',
        subtitleEn: 'Beginning and Profession of Faith',
        category: 'Santo Rosario Universal',
        categoryEn: 'Universal Holy Rosary',
        text: `Por la señal de la Santa Cruz, de nuestros enemigos líbranos Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.

Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos.

Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.`,
        textEn: `In the name of the Father, and of the Son, and of the Holy Spirit. Amen.

I believe in God, the Father Almighty, Creator of heaven and earth. And in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from there He will come to judge the living and the dead.

I believe in the Holy Spirit, the Holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.`
      },
      {
        id: 'rosario-universal-pn-tres-avemarias',
        title: '2. Padre Nuestro y 3 Ave Marías',
        titleEn: '2. Our Father and 3 Hail Marys',
        subtitle: 'Virtudes Teologales: Fe, Esperanza y Caridad',
        subtitleEn: 'Theological Virtues: Faith, Hope, and Charity',
        category: 'Santo Rosario Universal',
        categoryEn: 'Universal Holy Rosary',
        text: `Padre nuestro, que estás en el cielo, santificado sea tu Nombre...

1º Por el aumento de la Fe: Dios te salve, María...
2º Por el aumento de la Esperanza: Dios te salve, María...
3º Por el aumento de la Caridad: Dios te salve, María...

Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`,
        textEn: `Our Father, who art in heaven, hallowed be thy name...

1st For the increase of Faith: Hail Mary, full of grace...
2nd For the increase of Hope: Hail Mary, full of grace...
3rd For the increase of Charity: Hail Mary, full of grace...

Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.`
      }
    ];

    info.mysteries.forEach((m) => {
      deck.push({
        id: `rosario-universal-misterio-${m.number}`,
        title: `${m.number}º Misterio: ${m.title}`,
        titleEn: `${m.number}th Mystery: ${m.titleEn}`,
        subtitle: `${info.name} • ${m.biblicalRef || ''}`,
        subtitleEn: `${info.nameEn} • ${m.biblicalRef || ''}`,
        category: 'Santo Rosario Universal',
        categoryEn: 'Universal Holy Rosary',
        isMysteryCard: true,
        mysteryNumber: m.number,
        mysteryName: m.title,
        mysteryNameEn: m.titleEn,
        mysteryMeditation: m.meditation,
        mysteryMeditationEn: m.meditationEn,
        text: `MEDITACIÓN:
${m.meditation}

ORACIONES DE ESTE MISTERIO:
• 1 Padre Nuestro
• 10 Ave Marías (con el contador de cuentas)
• 1 Gloria al Padre
• Oración de Fátima:
"Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén."`,
        textEn: `MEDITATION:
${m.meditationEn}

PRAYERS OF THIS MYSTERY:
• 1 Our Father
• 10 Hail Marys (use the decade beads tracker)
• 1 Glory Be
• Fatima Prayer:
"O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of Thy mercy. Amen."`
      });
    });

    deck.push({
      id: 'rosario-universal-salve',
      title: 'La Salve',
      titleEn: 'Hail Holy Queen (Salve Regina)',
      subtitle: 'Agradecimiento a la Virgen María',
      subtitleEn: 'Thanksgiving to the Virgin Mary',
      category: 'Santo Rosario Universal',
      categoryEn: 'Universal Holy Rosary',
      text: `Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A Ti llamamos los desterrados hijos de Eva; a Ti suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente, oh piadosa, oh dulce Virgen María!

V. Ruega por nosotros, Santa Madre de Dios.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.`,
      textEn: `Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ. Amen.`
    });

    deck.push({
      id: 'rosario-universal-final',
      title: 'Oración Final y Bendición',
      titleEn: 'Concluding Prayer and Blessing',
      subtitle: 'Fin del Santo Rosario',
      subtitleEn: 'Conclusion of the Holy Rosary',
      category: 'Santo Rosario Universal',
      categoryEn: 'Universal Holy Rosary',
      text: `Oremos:
Te rogamos nos concedas, Señor Dios nuestro, gozar de continua salud de alma y cuerpo, y por la gloriosa intercesión de la bienaventurada siempre Virgen María, vernos libres de las tristezas de la vida presente y disfrutar de las eternas alegrías.
Por Jesucristo Nuestro Señor. Amén.

En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.`,
      textEn: `Let us pray:
O God, whose Only Begotten Son, by His life, Death, and Resurrection, has purchased for us the rewards of eternal life: grant, we beseech Thee, that meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise.
Through Christ our Lord. Amen.

In the name of the Father, and of the Son, and of the Holy Spirit. Amen.`
    });

    return deck;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // VARIANTE PREDETERMINADA: MEXICANA / TRADICIONAL (DEVOCIÓN POPULAR Y DIFUNTOS)
  // ───────────────────────────────────────────────────────────────────────────
  const deck: PrayerCard[] = [
    {
      id: 'rosario-mexicana-guia',
      title: 'Santo Rosario • Tradición Mexicana',
      titleEn: 'Holy Rosary • Mexican Tradition',
      subtitle: `Hoy: ${info.name} (${info.days})`,
      subtitleEn: `Today: ${info.nameEn} (${info.daysEn})`,
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      isRosaryGuide: true,
      isConfigCard: true,
      text: `Estructura del Santo Rosario en la Tradición Mexicana:
1. Señal de la Cruz, Acto de Contrición y Ofrecimiento
2. Credo de los Apóstoles
3. Padre Nuestro y 3 Ave Marías Iniciales + Gloria
4. 5 Misterios del día con jaculatorias tradicionales mexicanas
5. Las Tres Últimas Ave Marías a las Tres Divinas Personas
6. La Salve Regina, Letanías Lauretanas y Bajo tu Amparo`,
      textEn: `Structure of the Holy Rosary in the Mexican Tradition:
1. Sign of the Cross, Act of Contrition, and Offering
2. Apostles' Creed
3. Our Father and 3 Initial Hail Marys + Glory Be
4. 5 Mysteries of the day with traditional Mexican aspirations
5. The Three Final Hail Marys to the Most Holy Trinity
6. Hail Holy Queen, Litany of Loreto, and Sub Tuum Praesidium`
    },
    {
      id: 'rosario-mexicana-cruz-contricion',
      title: '1. Señal de la Cruz y Ofrecimiento',
      titleEn: '1. Sign of the Cross and Offering',
      subtitle: 'Por estos misterios santos...',
      subtitleEn: 'By these holy mysteries...',
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      text: `Por la señal de la Santa Cruz, de nuestros enemigos líbranos Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.

Ofrecimiento:
Por estos misterios santos de que hemos hecho memoria, te pedimos, ¡oh María!, de la fe santa el aumento, la exaltación de la Iglesia, del Papa el mejor acierto, de nuestra Patria la paz y del pecador la conversión.

Señor mío Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío; por ser Vos quien sois, bondad infinita, me pesa de todo corazón haberte ofendido. Propongo firmemente nunca más pecar. Amén.`,
      textEn: `By the sign of the Holy Cross, deliver us from our enemies, O Lord our God. In the name of the Father, and of the Son, and of the Holy Spirit. Amen.

Offering:
Through these holy mysteries which we commemorate, we ask Thee, O Mary, for the increase of holy faith, the exaltation of the Church, guidance for the Pope, peace for our homeland, and conversion for all sinners.

O my Jesus Christ, true God and true Man, my Creator, Father, and Redeemer; because Thou art who Thou art, infinite goodness, I am heartily sorry for having offended Thee. I firmly resolve never to sin again. Amen.`
    },
    {
      id: 'rosario-mexicana-credo',
      title: '2. Credo de los Apóstoles',
      titleEn: '2. Apostles\' Creed',
      subtitle: 'Profesión de Fe en la Cruz',
      subtitleEn: 'Profession of Faith at the Cross',
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      text: `Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra.

Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos.

Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.`,
      textEn: `I believe in God, the Father Almighty, Creator of heaven and earth.

And in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from there He will come to judge the living and the dead.

I believe in the Holy Spirit, the Holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.`
    },
    {
      id: 'rosario-mexicana-pn-tres-avemarias',
      title: '3. Padre Nuestro y 3 Ave Marías Iniciales',
      titleEn: '3. Our Father and 3 Initial Hail Marys',
      subtitle: 'Fe, Esperanza y Caridad',
      subtitleEn: 'Faith, Hope, and Charity',
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      text: `Padre nuestro, que estás en el cielo, santificado sea tu Nombre...

1º Por el aumento de nuestra Fe: Dios te salve, María...
2º Por el aumento de nuestra Esperanza: Dios te salve, María...
3º Por el aumento de nuestra Caridad: Dios te salve, María...

Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`,
      textEn: `Our Father, who art in heaven, hallowed be thy name...

1st For the increase of our Faith: Hail Mary, full of grace...
2nd For the increase of our Hope: Hail Mary, full of grace...
3rd For the increase of our Charity: Hail Mary, full of grace...

Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.`
    }
  ];

  // 5 Misterios con Jaculatorias Tradicionales Mexicanas
  info.mysteries.forEach((m) => {
    deck.push({
      id: `rosario-mexicana-misterio-${m.number}`,
      title: `${m.number}º Misterio: ${m.title}`,
      titleEn: `${m.number}th Mystery: ${m.titleEn}`,
      subtitle: `${info.name} • ${m.biblicalRef || ''}`,
      subtitleEn: `${info.nameEn} • ${m.biblicalRef || ''}`,
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      isMysteryCard: true,
      mysteryNumber: m.number,
      mysteryName: m.title,
      mysteryNameEn: m.titleEn,
      mysteryMeditation: m.meditation,
      mysteryMeditationEn: m.meditationEn,
      text: `MEDITACIÓN:
${m.meditation} (${m.biblicalRef || ''})

ORACIONES DE ESTE MISTERIO:
• 1 Padre Nuestro
• 10 Ave Marías (cuenta interactiva)
• 1 Gloria al Padre

JACULATORIAS TRADICIONALES:
— "María, Madre de gracia y Madre de misericordia, en la vida y en la muerte ampáranos, Gran Señora."
— "Alabanzas y gracias sean dadas en todo momento al Santísimo y Divinísimo Sacramento del Altar. Y bendita sea por siempre la Santa e Inmaculada Concepción de la Bienaventurada Virgen María, Madre de Dios y Madre nuestra."
— "Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén."
— "Sagrado Corazón de Jesús, en Vos confío."`,
      textEn: `MEDITATION:
${m.meditationEn} (${m.biblicalRef || ''})

PRAYERS OF THIS MYSTERY:
• 1 Our Father
• 10 Hail Marys (interactive counter)
• 1 Glory Be

TRADITIONAL ASPIRATIONS:
— "Mary, Mother of grace and Mother of mercy, in life and in death protect us, O Great Lady."
— "Praised and adored without end be the Most Blessed and Divine Sacrament of the Altar. And forever blessed be the Holy and Immaculate Conception of the Blessed Virgin Mary, Mother of God and our Mother."
— "O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of Thy mercy. Amen."
— "Sacred Heart of Jesus, I place my trust in Thee."`
    });
  });

  // Las Tres Últimas Ave Marías a las Tres Divinas Personas
  deck.push({
    id: 'rosario-mexicana-tres-ultimas',
    title: 'Las Tres Últimas Ave Marías',
    titleEn: 'The Three Final Hail Marys',
    subtitle: 'A las Tres Divinas Personas',
    subtitleEn: 'To the Three Divine Persons',
    category: 'Santo Rosario',
    categoryEn: 'Holy Rosary',
    text: `Padre Nuestro, que estás en el cielo...

1.- Dios te salve María, Hija de Dios Padre; en Tus Manos ponemos nuestra Fe para que la ilumines; llena eres de gracia, el Señor es contigo; bendita Tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.

2.- Dios te salve María, Madre de Dios Hijo; en Tus Manos ponemos nuestra Esperanza para que la alientes; llena eres de gracia, el Señor es contigo; bendita Tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.

3.- Dios te salve María, Esposa de Dios Espíritu Santo; en Tus Manos ponemos nuestra Caridad para que la inflames; llena eres de gracia, el Señor es contigo; bendita Tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.

Dios te salve María; Templo, Trono y Sagrario de la Santísima Trinidad; Virgen concebida sin pecado original. ¡Dios te salve, Reina y Madre de Misericordia!...`,
    textEn: `Our Father, who art in heaven...

1.- Hail Mary, Daughter of God the Father; into Thy hands we commend our Faith that Thou mayest enlighten it; full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.

2.- Hail Mary, Mother of God the Son; into Thy hands we commend our Hope that Thou mayest encourage it; full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.

3.- Hail Mary, Spouse of the Holy Spirit; into Thy hands we commend our Charity that Thou mayest enkindle it; full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.

Hail Mary; Temple, Throne, and Tabernacle of the Most Holy Trinity; Virgin conceived without original sin. Hail Holy Queen, Mother of Mercy!...`
  });

  // La Salve
  deck.push({
    id: 'rosario-mexicana-salve',
    title: 'La Salve Regina',
    titleEn: 'Hail Holy Queen (Salve Regina)',
    subtitle: 'Madre y Esperanza Nuestra',
    subtitleEn: 'Our Mother and Our Hope',
    category: 'Santo Rosario',
    categoryEn: 'Holy Rosary',
    text: `Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve.

A Ti llamamos los desterrados hijos de Eva; a Ti suspiramos, gimiendo y llorando, en este valle de lágrimas.

Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre.

¡Oh clemente, oh piadosa, oh dulce Virgen María!

V. Ruega por nosotros, Santa Madre de Dios.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.`,
    textEn: `Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears.

Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus.

O clement, O loving, O sweet Virgin Mary.

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ. Amen.`
  });

  // Letanías Lauretanas
  deck.push({
    id: 'rosario-mexicana-letanias',
    title: 'Letanías Lauretanas',
    titleEn: 'Litany of Loreto',
    subtitle: 'Invocaciones a la Santísima Virgen',
    subtitleEn: 'Invocations to the Blessed Virgin Mary',
    category: 'Santo Rosario',
    categoryEn: 'Holy Rosary',
    text: `Señor, ten piedad de nosotros.
Cristo, ten piedad de nosotros.
Señor, ten piedad de nosotros.
Cristo, óyenos. / Cristo, escúchanos.

Dios, Padre celestial, *ten piedad de nosotros.*
Dios, Hijo, Redentor del mundo, *ten piedad de nosotros.*
Dios, Espíritu Santo, *ten piedad de nosotros.*
Santísima Trinidad, un solo Dios, *ten piedad de nosotros.*

Santa María, *ruega por nosotros.*
Santa Madre de Dios,
Santa Virgen de las Vírgenes,
Madre de Cristo,
Madre de la Iglesia,
Madre de la divina gracia,
Madre de la esperanza,
Madre purísima,
Madre castísima,
Madre siempre virgen,
Madre inmaculada,
Madre amable,
Madre admirable,
Madre del buen consejo,
Madre del Creador,
Madre del Salvador,
Madre de misericordia,

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
Vaso insigne de devoción,
Rosa mística,
Torre de David,
Torre de marfil,
Casa de oro,
Arca de la Alianza,
Puerta del cielo,
Estrella de la mañana,
Salud de los enfermos,
Refugio de los pecadores,
Consuelo de los migrantes,
Consoladora de los afligidos,
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
ten misericordia de nosotros.`,
    textEn: `Lord, have mercy on us.
Christ, have mercy on us.
Lord, have mercy on us.
Christ, hear us. / Christ, graciously hear us.

God the Father of Heaven, *have mercy on us.*
God the Son, Redeemer of the world, *have mercy on us.*
God the Holy Spirit, *have mercy on us.*
Holy Trinity, One God, *have mercy on us.*

Holy Mary, *pray for us.*
Holy Mother of God,
Holy Virgin of virgins,
Mother of Christ,
Mother of the Church,
Mother of divine grace,
Mother of hope,
Mother most pure,
Mother most chaste,
Mother inviolate,
Mother undefiled,
Mother most amiable,
Mother most admirable,
Mother of good counsel,
Mother of our Creator,
Mother of our Savior,
Mother of mercy,

Virgin most prudent,
Virgin most venerable,
Virgin most renowned,
Virgin most powerful,
Virgin most merciful,
Virgin most faithful,

Mirror of justice,
Seat of wisdom,
Cause of our joy,
Spiritual vessel,
Vessel of honor,
Singular vessel of devotion,
Mystical Rose,
Tower of David,
Tower of ivory,
House of gold,
Ark of the Covenant,
Gate of Heaven,
Morning Star,
Health of the sick,
Refuge of sinners,
Solace of migrants,
Comforter of the afflicted,
Help of Christians,

Queen of Angels,
Queen of Patriarchs,
Queen of Prophets,
Queen of Apostles,
Queen of Martyrs,
Queen of Confessors,
Queen of Virgins,
Queen of all Saints,
Queen conceived without original sin,
Queen assumed into Heaven,
Queen of the Most Holy Rosary,
Queen of families,
Queen of peace.

Lamb of God, who takest away the sins of the world,
spare us, O Lord.
Lamb of God, who takest away the sins of the world,
graciously hear us, O Lord.
Lamb of God, who takest away the sins of the world,
have mercy on us.`
  });

  // Bajo tu Amparo y Conclusión
  deck.push({
    id: 'rosario-mexicana-final',
    title: 'Bajo tu Amparo y Oración Final',
    titleEn: 'Sub Tuum Praesidium & Concluding Prayer',
    subtitle: 'Conclusión y Bendición',
    subtitleEn: 'Conclusion and Blessing',
    category: 'Santo Rosario',
    categoryEn: 'Holy Rosary',
    text: `Bajo tu amparo nos acogemos, Santa Madre de Dios; no deseches las súplicas que te dirigimos en nuestras necesidades, antes bien, líbranos de todo peligro, ¡oh Virgen gloriosa y bendita!

V. Ruega por nosotros, Santa Madre de Dios.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo.

Oremos:
Te rogamos nos concedas, Señor Dios nuestro, gozar de continua salud de alma y cuerpo, y por la gloriosa intercesión de la bienaventurada siempre Virgen María, vernos libres de las tristezas de la vida presente y disfrutar de las eternas alegrías.
Por Jesucristo Nuestro Señor.
Amén.

Ave María Purísima,
— Sin pecado concebida.

En el nombre del Padre, y del Hijo, y del Espíritu Santo.
Amén.`,
    textEn: `We fly to Thy protection, O Holy Mother of God; despise not our petitions in our necessities, but deliver us always from all dangers, O glorious and blessed Virgin.

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ.

Let us pray:
O God, whose Only Begotten Son, by His life, Death, and Resurrection, has purchased for us the rewards of eternal life: grant, we beseech Thee, that meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise.
Through Christ our Lord.
Amen.

Hail Mary Most Pure,
— Conceived without sin.

In the name of the Father, and of the Son, and of the Holy Spirit.
Amen.`
  });

  return deck;
}
