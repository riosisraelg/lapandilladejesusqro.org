/**
 * Base de Datos y Generador de Mazos de Oraciones para La Pandilla de Jesús
 * Soporte Bilingüe Canónico Completo (Español / English / Latine)
 */

export interface RepeatedPrayer {
  title: string;
  titleEn?: string;
  text: string;
  textEn?: string;
  count: number;
}

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
  biblicalRef?: string;
  scriptureText?: string;
  scriptureTextEn?: string;
  reflectionQuestion?: string;
  reflectionQuestionEn?: string;
  image?: string;
  repeatedPrayers?: RepeatedPrayer[];
  subDeck?: 'opening' | 'mysteries' | 'concluding';
}

export type MysteryType = 'gozosos' | 'dolorosos' | 'gloriosos' | 'luminosos';

export type DayOfWeek = 'domingo' | 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';

export interface MealPrayer {
  verse?: string;
  response?: string;
  prayer: string;
}

export interface FoodPrayerDay {
  id: string;
  day: DayOfWeek;
  dayName: string;
  dayNameEn?: string;
  dayIndex: number;
  intro?: {
    title: string;
    citation: string;
    text: string;
    textEn?: string;
  };
  before: MealPrayer;
  beforeEn?: MealPrayer;
  after?: MealPrayer;
  afterEn?: MealPrayer;
}

export interface MysteryItem {
  number: number;
  title: string;
  titleEn: string;
  biblicalRef: string;
  scriptureText: string;
  scriptureTextEn: string;
  meditation: string;
  meditationEn: string;
  reflectionQuestion: string;
  reflectionQuestionEn: string;
  image: string;
}

export interface MysteryInfo {
  type: MysteryType;
  name: string;
  nameEn: string;
  days: string;
  daysEn: string;
  mysteries: MysteryItem[];
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
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DECK 3: Bendición de los Alimentos (7 Días • Bendicional nn. 883-884)
// ─────────────────────────────────────────────────────────────────────────────

export const BENDICIONAL_INTRO = {
  title: "Bendicional",
  citation: "nn. 883-884",
  text: "El cristiano, cuando se sienta a la mesa, reconociendo en los manjares que le dan una señal de la bendición de Dios, no debe echar en olvido a los pobres que posiblemente carecen del sustento del que él, quizás, disfruta en abundancia; por eso debe, con su sobriedad, subvenir en la medida que le sea posible a la necesidad de aquellos.",
  textEn: "The Christian, when sitting at the table, recognizing in the meals provided a sign of God's blessing, must not forget the poor who may lack the sustenance that he, perhaps, enjoys in abundance; therefore, with sobriety, one must assist as far as possible the needs of those in want."
};

export const FOOD_PRAYERS_DATA: FoodPrayerDay[] = [
  {
    id: 'alimentos-domingo',
    day: 'domingo',
    dayName: 'Domingo',
    dayNameEn: 'Sunday',
    dayIndex: 0,
    intro: BENDICIONAL_INTRO,
    before: {
      verse: 'El Señor preparará para todos los pueblos un festín de manjares suculentos, un festín de manjares enjundiosos y de vinos generosos.',
      response: 'Bendito seas por siempre, Señor.',
      prayer: `Señor, Dios nuestro, tú que ordenaste a tu pueblo celebrar con un banquete la Pascua de su liberación, bendice esta mesa y haz que al participar de ella se acreciente nuestro gozo y la esperanza de participar un día en el banquete eterno.

Por Jesucristo, Nuestro Señor.
Amén.`
    },
    beforeEn: {
      verse: 'The Lord will prepare for all peoples a feast of rich food, a banquet of choice wines.',
      response: 'Blessed be God forever, Lord.',
      prayer: `Lord our God, You who commanded Your people to celebrate with a banquet the Passover of their deliverance, bless this table and grant that by sharing in it our joy and hope of partaking one day in the eternal banquet may increase.

Through Christ our Lord.
Amen.`
    },
    after: {
      prayer: `Oh Dios, fuente de vida, derrama en nuestros corazones la alegría de la Pascua y, ya que nos has dado esta comida, sacada de la tierra, concédenos también mantenernos siempre en aquella vida nueva que Cristo con su resurrección nos ha merecido y con su misericordia nos ha comunicado.

Él, que vive y reina por los siglos de los siglos.
Amén.`
    },
    afterEn: {
      prayer: `O God, source of life, pour into our hearts the joy of Easter and, since You have given us this food drawn from the earth, grant us also to remain always in that new life which Christ by His resurrection has won for us and by His mercy has communicated to us.

He who lives and reigns forever and ever.
Amen.`
    }
  },
  {
    id: 'alimentos-lunes',
    day: 'lunes',
    dayName: 'Lunes',
    dayNameEn: 'Monday',
    dayIndex: 1,
    intro: BENDICIONAL_INTRO,
    before: {
      verse: 'El Señor ha abierto las compuertas del cielo y nos ha dado un trigo celeste, nos ha mandado provisiones hasta la hartura.',
      response: 'Bendito seas por siempre, Señor.',
      prayer: `Señor Jesús, tú que a la hora del mediodía, agotado por el cansancio del camino, te sentaste junto al pozo de Sicar, repara ahora nuestras fuerzas con el alimento que vamos a tomar y danos hambre de cumplir siempre tu voluntad.

Tú que vives y reinas por los siglos de los siglos.
Amén.`
    },
    beforeEn: {
      verse: 'The Lord opened the doors of heaven and rained down manna upon them for food, and gave them bread from heaven.',
      response: 'Blessed be God forever, Lord.',
      prayer: `Lord Jesus, You who at midday, weary from the journey, sat down by the well of Sychar, restore now our strength with the food we are about to receive, and give us hunger to always fulfill Your will.

You who live and reign forever and ever.
Amen.`
    },
    after: {
      prayer: `Dios, Padre Nuestro, te damos gracias por el alimento que, reunidos fraternalmente, hemos recibido de tu generosidad; te pedimos que, aprendiendo también nosotros a compartir con los hermanos los bienes que de ti hemos recibido, lleguemos a tener parte en el convite eterno.

Por Jesucristo, Nuestro Señor.
Amén.`
    },
    afterEn: {
      prayer: `God, our Father, we thank You for the food that, gathered as brothers and sisters, we have received from Your bounty; we ask that, learning also to share with our brothers and sisters the gifts we have received from You, we may come to share in the eternal feast.

Through Christ our Lord.
Amen.`
    }
  },
  {
    id: 'alimentos-martes',
    day: 'martes',
    dayName: 'Martes',
    dayNameEn: 'Tuesday',
    dayIndex: 2,
    intro: BENDICIONAL_INTRO,
    before: {
      verse: 'El Señor sustenta al huérfano y a la viuda, el Señor da pan a los hambrientos.',
      response: 'Bendito seas por siempre, Señor.',
      prayer: `Bendice, Señor, estos dones que hemos recibido de tu generosidad y haz que un día podamos sentarnos también a comer en el banquete de tu reino.

Por Jesucristo, Nuestro Señor.
Amén.`
    },
    beforeEn: {
      verse: 'The Lord sustains the fatherless and the widow; the Lord gives food to the hungry.',
      response: 'Blessed be God forever, Lord.',
      prayer: `Bless, Lord, these gifts which we have received from Your bounty and grant that one day we may also sit down to eat at the banquet of Your kingdom.

Through Christ our Lord.
Amen.`
    },
    after: {
      prayer: `Te damos gracias, Dios todopoderoso, por todos los beneficios que hemos recibido de tu bondad.

Tú que vives y reinas por los siglos de los siglos.
Amén.`
    },
    afterEn: {
      prayer: `We give You thanks, Almighty God, for all the benefits we have received from Your goodness.

You who live and reign forever and ever.
Amen.`
    }
  },
  {
    id: 'alimentos-miercoles',
    day: 'miercoles',
    dayName: 'Miércoles',
    dayNameEn: 'Wednesday',
    dayIndex: 3,
    intro: BENDICIONAL_INTRO,
    before: {
      verse: 'El Señor hace brotar hierba en los montes y a todos da su alimento, el Señor nos sacia con flor de harina.',
      response: 'Bendito seas por siempre, Señor.',
      prayer: `Bendícenos, Señor, bendice también los alimentos que vamos a tomar y bendice a quienes los han preparado; da de tu pan al que no lo tiene y al que lo tiene dale siempre hambre y sed de ser justo.

Por Jesucristo, Nuestro Señor.
Amén.`
    },
    beforeEn: {
      verse: 'The Lord makes grass grow on the hills and gives food to every creature; the Lord fills us with finest wheat.',
      response: 'Blessed be God forever, Lord.',
      prayer: `Bless us, Lord, bless also the food we are about to receive, and bless those who have prepared it; give Your bread to those who have none, and to those who have bread give always hunger and thirst for righteousness.

Through Christ our Lord.
Amen.`
    },
    after: {
      prayer: `Te damos gracias, Señor, porque en esta mesa nos has dado nueva fuerza, y te pedimos que este alimento corporal contribuya también al fortalecimiento de nuestro espíritu.

Tú que vives y reinas por los siglos de los siglos.
Amén.`
    },
    afterEn: {
      prayer: `We thank You, Lord, because at this table You have given us renewed strength, and we ask that this bodily nourishment may also contribute to the strengthening of our spirit.

You who live and reign forever and ever.
Amen.`
    }
  },
  {
    id: 'alimentos-jueves',
    day: 'jueves',
    dayName: 'Jueves',
    dayNameEn: 'Thursday',
    dayIndex: 4,
    intro: BENDICIONAL_INTRO,
    before: {
      verse: 'El Señor es bueno con todos, es cariñoso con todas sus criaturas; que todo viviente bendiga su santo nombre por siempre jamás.',
      response: 'Bendito seas por siempre, Señor.',
      prayer: `Señor Dios nuestro, que para fortalecer a tu pueblo peregrino por el desierto le diste el pan del cielo y el agua de la roca, bendice esta mesa y concédenos que, con la fuerza de los alimentos que vamos a tomar, prosigamos también nuestro camino hasta llegar a ti.

Por Jesucristo, Nuestro Señor.
Amén.`
    },
    beforeEn: {
      verse: 'The Lord is good to all, compassionate toward all His creatures; let all living things bless His holy name forever and ever.',
      response: 'Blessed be God forever, Lord.',
      prayer: `Lord our God, who to strengthen Your pilgrim people in the desert gave them bread from heaven and water from the rock, bless this table and grant that, with the strength of the food we are about to receive, we may continue our journey until we reach You.

Through Christ our Lord.
Amen.`
    },
    after: {
      prayer: `Señor Jesús, que dijiste a los discípulos que la vida del hombre no sólo se sustenta con el pan, sino con toda palabra que sale de tu boca; ayúdanos a levantar hacia ti nuestros corazones y haz que, con la fuerza que de ti proviene, te amemos sinceramente a través de nuestros hermanos.

Tú que vives y reinas por los siglos de los siglos.
Amén.`
    },
    afterEn: {
      prayer: `Lord Jesus, who told the disciples that man does not live on bread alone, but on every word that comes from the mouth of God; help us to lift our hearts to You and grant that, with the strength that comes from You, we may love You sincerely through our brothers and sisters.

You who live and reign forever and ever.
Amen.`
    }
  },
  {
    id: 'alimentos-viernes',
    day: 'viernes',
    dayName: 'Viernes',
    dayNameEn: 'Friday',
    dayIndex: 5,
    intro: BENDICIONAL_INTRO,
    before: {
      verse: 'El Señor Jesús acogía a los pecadores y comía con ellos.',
      response: 'Bendito seas por siempre, Señor.',
      prayer: `Señor Jesús, que no te negaste a comer con los pecadores; no nos rechaces tampoco a nosotros que nos sentimos también bajo el peso del pecado: sé el huésped de nuestra mesa y admítenos un día en el convite de tu reino.

Tú que vives y reinas por los siglos de los siglos.
Amén.`
    },
    beforeEn: {
      verse: 'The Lord Jesus welcomed sinners and ate with them.',
      response: 'Blessed be God forever, Lord.',
      prayer: `Lord Jesus, You who did not refuse to eat with sinners; do not reject us who also feel the weight of sin: be the guest at our table and admit us one day to the feast of Your kingdom.

You who live and reign forever and ever.
Amen.`
    },
    after: {
      prayer: `Oh Dios, que amas la vida, que alimentas a las aves del cielo y vistes a los lirios del campo, te bendecimos por todas tus criaturas y por esta comida que hemos tomado, y te suplicamos, Señor, que, por tu bondad, nadie quede privado del necesario alimento.

Por Jesucristo, Nuestro Señor.
Amén.`
    },
    afterEn: {
      prayer: `O God, lover of life, who feed the birds of the air and clothe the lilies of the field, we bless You for all Your creatures and for this food we have received, and we pray, Lord, that through Your goodness no one may be deprived of necessary sustenance.

Through Christ our Lord.
Amen.`
    }
  },
  {
    id: 'alimentos-sabado',
    day: 'sabado',
    dayName: 'Sábado',
    dayNameEn: 'Saturday',
    dayIndex: 6,
    intro: BENDICIONAL_INTRO,
    before: {
      verse: 'Entonen la acción de gracias al Señor, que prepara la lluvia para la tierra y hace brotar hierba de los montes.',
      response: 'Bendito seas por siempre, Señor.',
      prayer: `Señor Dios nuestro, que calmas el ansia de los sedientos y a los hambrientos los colmas de bienes, haz que tomemos estos alimentos con acción de gracias y veamos en ellos la prenda del banquete del cielo.

Por Jesucristo, Nuestro Señor.
Amén.`
    },
    beforeEn: {
      verse: 'Sing thanksgiving to the Lord, who prepares rain for the earth and makes grass grow on the hills.',
      response: 'Blessed be God forever, Lord.',
      prayer: `Lord our God, who satisfy the longing of the thirsty and fill the hungry with good things, grant that we may receive this food with thanksgiving and see in it the pledge of the banquet of heaven.

Through Christ our Lord.
Amen.`
    },
    after: {
      prayer: `Te damos gracias, Dios todopoderoso, por todos los beneficios que hemos recibido de tu bondad.

Tú que vives y reinas por los siglos de los siglos.
Amén.`
    },
    afterEn: {
      prayer: `We give You thanks, Almighty God, for all the benefits we have received from Your goodness.

You who live and reign forever and ever.
Amen.`
    }
  }
];

export const oracionesAlimentos: PrayerCard[] = FOOD_PRAYERS_DATA.map((day) => ({
  id: day.id,
  title: `Bendición de los Alimentos • ${day.dayName}`,
  titleEn: `Meal Prayers • ${day.dayNameEn}`,
  subtitle: `Antes y Después de las comidas • Bendicional nn. 883-884`,
  subtitleEn: `Before & After Meals • Book of Blessings nn. 883-884`,
  category: 'Bendición de Alimentos',
  categoryEn: 'Meal Blessings',
  text: `📜 BENDICIONAL (nn. 883-884)
«${BENDICIONAL_INTRO.text}»

🍽️ ANTES DE LAS COMIDAS
V. ${day.before.verse}
R. ${day.before.response}

Oremos:
${day.before.prayer}

✨ DESPUÉS DE LAS COMIDAS
Oremos:
${day.after?.prayer || ''}`,
  textEn: `📜 BOOK OF BLESSINGS (nn. 883-884)
"${BENDICIONAL_INTRO.textEn}"

🍽️ BEFORE MEALS
V. ${day.beforeEn?.verse || day.before.verse}
R. ${day.beforeEn?.response || 'Blessed be God forever, Lord.'}

Let us pray:
${day.beforeEn?.prayer || day.before.prayer}

✨ AFTER MEALS
Let us pray:
${day.afterEn?.prayer || day.after?.prayer || ''}`
}));

export function getFoodPrayersDeck(dayIndex?: number): PrayerCard[] {
  return oracionesAlimentos;
}

// ─────────────────────────────────────────────────────────────────────────────
// DECK 4: El Santo Rosario (Misterios y Flujo Guiado Bilingüe)
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
        image: 'icon-annunciation',
        biblicalRef: "Luke 1:26-27",
        scriptureText: 'El ángel, entrando en su presencia, dijo: «Alégrate, llena de gracia, el Señor está contigo»... María contestó: «He aquí la esclava del Señor; hágase en mí según tu palabra».',
        scriptureTextEn: `In the sixth month, the angel Gabriel was sent from God to a town of Galilee called Nazareth, to a virgin betrothed to a man named Joseph, of the house of David, and the virgin’s name was Mary.`Rejoice, full of grace, the Lord is with you."... Mary said: "Behold, I am the handmaid of the Lord; let it be done to me according to your word."',
        meditation: 'El Ángel Gabriel anuncia a la Santísima Virgen María que concebirá por obra del Espíritu Santo al Salvador del mundo. Contemplamos la profunda humildad y disponibilidad de María ante el plan divino.',
        meditationEn: 'The Angel Gabriel announces to Mary that she will conceive the Savior of the world through the Holy Spirit. We contemplate Mary\'s profound humility and readiness before God\'s divine plan.',
        reflectionQuestion: '¿Estoy dispuesto a acoger la voluntad de Dios en mi vida diaria con un "sí" generoso y confiado?',
        reflectionQuestionEn: "Fruit of the mystery: Humility"s will in my daily life with a generous and trusting "yes"?'
      },
      {
        number: 2,
        title: 'La Visitación de María a su prima Santa Isabel',
        titleEn: 'The Visitation of Mary to Elizabeth',
        image: 'icon-visitation',
        biblicalRef: "Luke 1:39-42",
        scriptureText: 'En cuanto Isabel oyó el saludo de María, saltó la criatura en su vientre. Se llenó Isabel del Espíritu Santo y exclamó: «¡Bendita tú entre las mujeres y bendito el fruto de tu vientre!»',
        scriptureTextEn: `During those days Mary set out and traveled to the hill country in haste to a town of Judah, where she entered the house of Zechariah and greeted Elizabeth. When Elizabeth heard Mary’s greeting, the infant leaped in her womb, and Elizabeth, filled with the holy Spirit, cried out in a loud voice and said, 'Most blessed are you among women, and blessed is the fruit of your womb.'`s greeting, the infant leaped in her womb, and Elizabeth, filled with the Holy Spirit, cried out: "Blessed are you among women, and blessed is the fruit of your womb!"',
        meditation: 'María viaja con prontitud a la montaña de Judea para servir a su prima Isabel. Al escuchar el saludo de María, Juan salta de gozo en el vientre y la Virgen proclama el Magníficat alabando la grandeza del Señor.',
        meditationEn: 'Mary travels with haste to visit and serve her cousin Elizabeth. John leaps for joy in Elizabeth\'s womb, and Mary proclaims the Magnificat, praising the greatness of the Lord.',
        reflectionQuestion: '¿Llevo la alegría de Cristo a los demás a través de un servicio humilde, caritativo y oportuno?',
        reflectionQuestionEn: "Fruit of the mystery: Love of Neighbor"
      },
      {
        number: 3,
        title: 'El Nacimiento de Jesús en el Portal de Belén',
        titleEn: 'The Nativity of the Lord',
        image: 'icon-nativity',
        biblicalRef: "Luke 2:1-7",
        scriptureText: 'Y dio a luz a su hijo primogénito, lo envolvió en pañales y lo recostó en un pesebre, porque no había sitio para ellos en la posada.',
        scriptureTextEn: `In those days a decree went out from Caesar Augustus that the whole world should be enrolled. This was the first enrollment, when Quirinius was governor of Syria. So all went to be enrolled, each to his own town. And Joseph too went up from Galilee from the town of Nazareth to Judea, to the city of David that is called Bethlehem, because he was of the house and family of David, to be enrolled with Mary, his betrothed, who was with child. While they were there, the time came for her to have her child, and she gave birth to her firstborn son. She wrapped him in swaddling clothes and laid him in a manger, because there was no room for them in the inn.`,
        meditation: 'En la pobreza de un pesebre nace el Rey del Universo. Los ángeles cantan gloria en las alturas y los pastores acuden a adorar al Niño envuelto en pañales, luz del mundo.',
        meditationEn: 'The King of the Universe is born in the poverty of a stable. Angels sing glory in the highest and shepherds come to adore the Infant Jesus wrapped in swaddling clothes.',
        reflectionQuestion: '¿Hago espacio en mi corazón y en mi vida cotidiana para que Jesús reine en medio de la sencillez?',
        reflectionQuestionEn: "Fruit of the mystery: Poverty"
      },
      {
        number: 4,
        title: 'La Presentación del Niño Jesús en el Templo',
        titleEn: 'The Presentation of Jesus in the Temple',
        image: 'icon-presentation',
        biblicalRef: "Luke 2:21-24",
        scriptureText: 'Simeón lo tomó en brazos y bendijo a Dios diciendo: «Ahora, Señor, según tu promesa, puedes dejar a tu siervo irse en paz, porque mis ojos han visto a tu Salvador».',
        scriptureTextEn: `When eight days were completed for his circumcision, he was named Jesus, the name given him by the angel before he was conceived in the womb.

When the days were completed for their purification according to the law of Moses, they took him up to Jerusalem to present him to the Lord, just as it is written in the law of the Lord, 'Every male that opens the womb shall be consecrated to the Lord,' and to offer the sacrifice of 'a pair of turtledoves or two young pigeons,' in accordance with the dictate in the law of the Lord.`Now, Master, you may let your servant go in peace, according to your word, for my eyes have seen your salvation."',
        meditation: 'María y José presentan al Niño en el Templo según la Ley de Moisés. El anciano Simeón lo toma en sus brazos bendiciendo a Dios y profetiza a María que una espada atravesará su corazón.',
        meditationEn: 'Mary and Joseph present Jesus in the Temple according to the Law of Moses. Simeon takes the Child in his arms, blessing God and prophesying that a sword will pierce Mary\'s soul.',
        reflectionQuestion: '¿Consagro a Dios mis planes, mi vocación y mis sacrificios con obediencia filial y confianza?',
        reflectionQuestionEn: "Fruit of the mystery: Purity of Heart and Body"
      },
      {
        number: 5,
        title: 'El Niño Jesús perdido y hallado en el Templo',
        titleEn: 'The Finding of Jesus in the Temple',
        image: 'icon-finding',
        biblicalRef: "Luke 2:41-47",
        scriptureText: 'Al cabo de tres días lo encontraron en el templo, sentado en medio de los maestros, escuchándolos y haciéndoles preguntas.',
        scriptureTextEn: `Each year his parents went to Jerusalem for the feast of Passover, and when he was twelve years old, they went up according to festival custom. After they had completed its days, as they were returning, the boy Jesus remained behind in Jerusalem, but his parents did not know it. Thinking that he was in the caravan, they journeyed for a day and looked for him among their relatives and acquaintances, but not finding him, they returned to Jerusalem to look for him. After three days they found him in the temple, sitting in the midst of the teachers, listening to them and asking them questions, and all who heard him were astounded at his understanding and his answers.`,
        meditation: 'A los doce años, Jesús permanece en el Templo de Jerusalén entre los maestros. Tras tres días de angustia, sus padres lo encuentran y Jesús les recuerda que debe ocuparse de las cosas de su Padre celestial.',
        meditationEn: 'At age twelve, Jesus remains in the Temple among the teachers. After three days of searching, His parents find Him, and Jesus gently reminds them He must be in His Father\'s house.',
        reflectionQuestion: 'Cuando me siento distraído o alejado de Dios, ¿lo busco con perseverancia y prioridad en la oración y los sacramentos?',
        reflectionQuestionEn: "Fruit of the mystery: Devotion to Jesus"
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
        image: 'icon-agony',
        biblicalRef: "Matthew 26:36-39",
        scriptureText: 'Cayó rostro en tierra y oraba diciendo: «Padre mío, si es posible, que pase de mí este cáliz; pero no sea como yo quiero, sino como quieres tú».',
        scriptureTextEn: `Then Jesus came with them to a place called Gethsemane, and he said to his disciples, 'Sit here while I go over there and pray.' He took along Peter and the two sons of Zebedee, and began to feel sorrow and distress. Then he said to them, 'My soul is sorrowful even to death. Remain here and keep watch with me.' He advanced a little and fell prostrate in prayer, saying, 'My Father, if it is possible, let this cup pass from me; yet, not as I will, but as you will.'`My Father, if it is possible, let this cup pass from me; yet, not as I will, but as you will."',
        meditation: 'En la agonía de Getsemaní, Jesús experimenta la soledad y suda gotas de sangre por el peso de nuestros pecados, sometiéndose amorosamente a la santa voluntad del Padre.',
        meditationEn: 'In Gethsemane, Jesus prays in sorrow and sweat like drops of blood, completely submitting to the Father: "Not my will, but yours be done."',
        reflectionQuestion: 'En mis momentos de prueba o dolor, ¿acudo confiadamente a la oración para abrazar la voluntad de Dios?',
        reflectionQuestionEn: "Fruit of the mystery: Obedience to God’s Will"
      },
      {
        number: 2,
        title: 'La Flagelación de Nuestro Señor atado a la Columna',
        titleEn: 'The Scourging at the Pillar',
        image: 'icon-scourging',
        biblicalRef: "Matthew 27:26",
        scriptureText: 'Entonces Pilato tomó a Jesús y mandó azotarlo. Y por sus llagas fuimos nosotros curados.',
        scriptureTextEn: `Then he released Barabbas to them, but after he had Jesus scourged, he handed him over to be crucified.`,
        meditation: 'Pilato manda azotar a Jesús cruelmente. El Cordero de Dios sufre en silencio y mansedumbre las heridas que sanan nuestras rebeliones e impurezas.',
        meditationEn: 'Pilate orders Jesus to be scourged. The Lamb of God endures the brutal lashes in meek silence, healing our transgressions by His holy wounds.',
        reflectionQuestion: '¿Ofrezco sacrificios y practico la templanza para purificar mi corazón de apegos y pasiones desordenadas?',
        reflectionQuestionEn: "Fruit of the mystery: Mortification"
      },
      {
        number: 3,
        title: 'La Coronación de Espinas',
        titleEn: 'The Crowning with Thorns',
        image: 'icon-crowning',
        biblicalRef: "Matthew 27:27-29",
        scriptureText: 'Los soldados trenzaron una corona de espinas y se la pusieron en la cabeza, y una caña en su mano derecha; y burlándose decían: «¡Salve, rey de los judíos!»',
        scriptureTextEn: `Then the soldiers of the governor took Jesus inside the praetorium and gathered the whole cohort around him. They stripped off his clothes and threw a scarlet military cloak about him. Weaving a crown out of thorns, they placed it on his head, and a reed in his right hand. And kneeling before him, they mocked him, saying, 'Hail, King of the Jews!'`Hail, King of the Jews!"',
        meditation: 'Los soldados visten a Jesús con un manto de púrpura, le colocan una corona de punzantes espinas y una caña en su mano, burlándose del Rey de Reyes con bofetadas e insultos.',
        meditationEn: 'Soldiers mock Jesus with a purple cloak, placing a crown of sharp thorns on His head and a reed in His hand, mocking the King of Kings with blows and insults.',
        reflectionQuestion: '¿Acepto con humildad y paciencia las críticas o incomprensiones, buscando agradar a Dios antes que al mundo?',
        reflectionQuestionEn: "Fruit of the mystery: Courage"
      },
      {
        number: 4,
        title: 'Jesús con la Cruz a cuestas camino al Calvario',
        titleEn: 'The Carrying of the Cross to Calvary',
        image: 'icon-carrying-cross',
        biblicalRef: "Mark 15:21-22",
        scriptureText: 'Tomaron a Jesús y él, cargando con su cruz, salió hacia el lugar llamado la Calavera, que en hebreo se dice Gólgota.',
        scriptureTextEn: `They pressed into service a passer-by, Simon, a Cyrenian, who was coming in from the country, the father of Alexander and Rufus, to carry his cross. They brought him to the place of Golgotha (which is translated Place of the Skull).`,
        meditation: 'Jesús abraza el madero de la Cruz y camina hacia el Gólgota. Cae tres veces bajo el peso, es ayudado por el Cirineo y se encuentra con su afligida Madre.',
        meditationEn: 'Jesus embraces the heavy Cross and walks towards Calvary. Falling under its weight, He is aided by Simon of Cyrene and meets His sorrowful Mother.',
        reflectionQuestion: '¿Tomo mi cruz cotidiana con perseverancia y ayudo como el Cirineo a sobrellevar las cargas de mi prójimo?',
        reflectionQuestionEn: "Fruit of the mystery: Patience"
      },
      {
        number: 5,
        title: 'La Crucifixión y Muerte de Nuestro Señor',
        titleEn: 'The Crucifixion and Death of Our Lord',
        image: 'icon-crucifixion',
        biblicalRef: "Luke 23:33-46",
        scriptureText: 'Jesús decía: «Padre, perdónalos, porque no saben lo que hacen»... Y gritando con voz potente, dijo: «Padre, a tus manos encomiendo mi espíritu». Y expiró.',
        scriptureTextEn: `When they came to the place called the Skull, they crucified him and the criminals there, one on his right, the other on his left. [Then Jesus said, 'Father, forgive them, they know not what they do.'] They divided his garments by casting lots. The people stood by and watched; the rulers, meanwhile, sneered at him and said, 'He saved others, let him save himself if he is the chosen one, the Messiah of God.' Even the soldiers jeered at him. As they approached to offer him wine they called out, 'If you are King of the Jews, save yourself.' Above him there was an inscription that read, 'This is the King of the Jews.' Now one of the criminals hanging there reviled Jesus, saying, 'Are you not the Messiah? Save yourself and us.' The other, however, rebuking him, said in reply, 'Have you no fear of God, for you are subject to the same condemnation? And indeed, we have been condemned justly, for the sentence we received corresponds to our crimes, but this man has done nothing criminal.' Then he said, 'Jesus, remember me when you come into your kingdom.' He replied to him, 'Amen, I say to you, today you will be with me in Paradise.'

It was now about noon and darkness came over the whole land until three in the afternoon because of an eclipse of the sun. Then the veil of the temple was torn down the middle. Jesus cried out in a loud voice, 'Father, into your hands I commend my spirit'; and when he had said this he breathed his last.`Father, forgive them, they know not what they do."... Jesus cried out in a loud voice: "Father, into your hands I commend my spirit"; and he breathed his last.',
        meditation: 'Clavado en la cruz entre dos ladrones, Jesús nos entrega a María como Madre ("Ahí tienes a tu hijo") y, tras tres horas de agonía redentora, exhala su espíritu diciendo: "Todo está cumplido".',
        meditationEn: 'Nailed to the Cross, Jesus gives us Mary as our Mother ("Behold your mother") and, after three hours of agony, yields His spirit, saying: "It is finished."',
        reflectionQuestion: '¿Sé perdonar de corazón a quienes me ofenden y me entrego generosamente por el bien de las almas?',
        reflectionQuestionEn: "Fruit of the mystery: Sorrow for our Sins"
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
        image: 'icon-resurrection',
        biblicalRef: "Luke 24:1-5",
        scriptureText: 'El ángel dijo a las mujeres: «No teman; sé que buscan a Jesús, el crucificado. No está aquí: ha resucitado, como había dicho. Vengan a ver el sitio donde yacía».',
        scriptureTextEn: `But at daybreak on the first day of the week they took the spices they had prepared and went to the tomb.They found the stone rolled away from the tomb; but when they entered, they did not find the body of the Lord Jesus. While they were puzzling over this, behold, two men in dazzling garments appeared to them. They were terrified and bowed their faces to the ground. They said to them, 'Why do you seek the living one among the dead? He is not here, but he has been raised.'`Do not be afraid! I know that you are seeking Jesus the crucified. He is not here, for he has been raised just as he said. Come and see the place where he lay."',
        meditation: 'Al amanecer del tercer día, Cristo vence el poder de la muerte y el pecado saliendo victorioso del sepulcro, trayéndonos la esperanza de la vida eterna.',
        meditationEn: 'On the third day, Christ triumphs victoriously over death and sin, rising from the tomb and opening for us the gates of everlasting life.',
        reflectionQuestion: '¿Vivo con la gozosa certeza de que Cristo resucitado ha vencido toda desesperanza y miedo en mi vida?',
        reflectionQuestionEn: "Fruit of the mystery: Faith"
      },
      {
        number: 2,
        title: 'La Ascensión del Señor a los Cielos',
        titleEn: 'The Ascension of the Lord into Heaven',
        image: 'icon-ascension',
        biblicalRef: "Mark 16:19",
        scriptureText: 'Dicho esto, a la vista de ellos, fue elevado al cielo, hasta que una nube se lo quitó de la vista. Y les dijo: «Serán mis testigos hasta los confines de la tierra».',
        scriptureTextEn: `So then the Lord Jesus, after he spoke to them, was taken up into heaven and took his seat at the right hand of God.`You will be my witnesses to the ends of the earth."',
        meditation: 'Cuarenta días después de resucitar, ante la mirada de sus apóstoles en el Monte de los Olivos, Jesús asciende al Cielo prometiendo estar con nosotros hasta el fin del mundo.',
        meditationEn: 'Forty days after His resurrection, in the presence of His disciples on Mount Olivet, Jesus ascends into heaven, promising to be with us until the end of the age.',
        reflectionQuestion: '¿Tengo mi corazón puesto en las realidades del cielo y testifico mi fe cristiana con audacia?',
        reflectionQuestionEn: "Fruit of the mystery: Hope"
      },
      {
        number: 3,
        title: 'La Venida del Espíritu Santo en Pentecostés',
        titleEn: 'The Descent of the Holy Spirit at Pentecost',
        image: 'icon-pentecost',
        biblicalRef: "Acts 2:1-4",
        scriptureText: 'Se les aparecieron unas lenguas como de fuego y se posaron sobre cada uno de ellos. Todos se llenaron del Espíritu Santo y empezaron a proclamar las maravillas de Dios.',
        scriptureTextEn: `When the time for Pentecost was fulfilled, they were all in one place together. And suddenly there came from the sky a noise like a strong driving wind, and it filled the entire house in which they were. Then there appeared to them tongues as of fire, which parted and came to rest on each one of them. And they were all filled with the holy Spirit and began to speak in different tongues, as the Spirit enabled them to proclaim.`,
        meditation: 'Reunidos en oración junto a María en el Cenáculo, los apóstoles reciben al Espíritu Santo en forma de lenguas de fuego, llenándose de valor y gracia para evangelizar al mundo.',
        meditationEn: 'Gathered in prayer with Mary in the Upper Room, the Apostles receive the Holy Spirit as tongues of fire, filled with courage to proclaim the Gospel to the nations.',
        reflectionQuestion: '¿Invoco diariamente los dones y frutos del Espíritu Santo para ser un apóstol fiel en mi entorno?',
        reflectionQuestionEn: "Fruit of the mystery: Wisdom"
      },
      {
        number: 4,
        title: 'La Asunción de la Santísima Virgen al Cielo',
        titleEn: 'The Assumption of the Blessed Virgin Mary into Heaven',
        image: 'icon-assumption',
        biblicalRef: "Luke 1:48-49",
        scriptureText: 'Un gran signo apareció en el cielo: una mujer vestida del sol, con la luna bajo sus pies y una corona de doce estrellas sobre su cabeza.',
        scriptureTextEn: `Behold, from now on will all ages call me blessed.
The Mighty One has done great things for me,
and holy is his name.`,
        meditation: 'Terminado el curso de su vida terrena, la Inmaculada Madre de Dios es asunta en cuerpo y alma a la gloria celestial, anticipo de nuestra propia resurrección.',
        meditationEn: 'Having completed the course of her earthly life, the Immaculate Mother of God is taken up body and soul into heavenly glory, a sign of hope for our own resurrection.',
        reflectionQuestion: '¿Miro a la Virgen María como modelo de santidad y purifico mi vida para alcanzar el banquete celestial?',
        reflectionQuestionEn: "Fruit of the mystery: Devotion to Mary"
      },
      {
        number: 5,
        title: 'La Coronación de María como Reina de Cielos y Tierra',
        titleEn: 'The Coronation of Mary as Queen of Heaven and Earth',
        image: 'icon-coronation',
        biblicalRef: "Revelation 12:1",
        scriptureText: 'Bendita seas tú, hija, por el Dios Altísimo, más que todas las mujeres de la tierra. Porque no se olvidará la alabanza que te tributan los hombres.',
        scriptureTextEn: `A great sign appeared in the sky, a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars.`,
        meditation: 'La Santísima Trinidad corona a la Virgen María como Reina universal, intercesora y medianera de todas las gracias para el pueblo fiel.',
        meditationEn: 'The Most Holy Trinity crowns Mary as Queen of Heaven and Earth, loving intercessor and advocate of all graces for God’s faithful children.',
        reflectionQuestion: '¿Reconozco a María como mi Reina y Madre, confiándole filialmente mis intenciones, luchas y alegrías?',
        reflectionQuestionEn: "Fruit of the mystery: Grace of a happy death"
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
        image: 'icon-baptism',
        biblicalRef: "Matthew 3:16-17",
        scriptureText: 'Bautizado Jesús, bajó el Espíritu de Dios como una paloma y vino sobre él. Y una voz del cielo decía: «Este es mi Hijo amado, en quien me complazco».',
        scriptureTextEn: `After Jesus was baptized, he came up from the water and behold, the heavens were opened [for him], and he saw the Spirit of God descending like a dove [and] coming upon him. And a voice came from the heavens, saying, 'This is my beloved Son, with whom I am well pleased.'`This is my beloved Son, with whom I am well pleased."',
        meditation: 'Jesús desciende a las aguas del Jordán. El Espíritu Santo desciende como paloma y se escucha la voz del Padre: "Este es mi Hijo amado, en quien me complazco".',
        meditationEn: 'Jesus steps into the Jordan River. The Holy Spirit descends like a dove, and the Father’s voice proclaims: "This is my beloved Son, with whom I am well pleased."',
        reflectionQuestion: '¿Renuevo con gratitud mis promesas bautismales y vivo con coherencia como hijo adoptivo de Dios?',
        reflectionQuestionEn: "Fruit of the mystery: Openness to the Holy Spirit"
      },
      {
        number: 2,
        title: 'La Autorrevelación en las Bodas de Caná',
        titleEn: 'The Self-Revelation at the Wedding at Cana',
        image: 'icon-wedding-cana',
        biblicalRef: "John 2:1-5",
        scriptureText: 'Dijo su madre a los sirvientes: «Hagan lo que él les diga». Así Jesús manifestó su gloria, y sus discípulos creyeron en él.',
        scriptureTextEn: `On the third day there was a wedding in Cana in Galilee, and the mother of Jesus was there. Jesus and his disciples were also invited to the wedding. When the wine ran short, the mother of Jesus said to him, 'They have no wine.' [And] Jesus said to her, 'Woman, how does your concern affect me? My hour has not yet come.' His mother said to the servers, 'Do whatever he tells you.'`Do whatever he tells you." Jesus revealed his glory, and his disciples began to believe in him.',
        meditation: 'Por intercesión de su Madre ("Hagan lo que Él les diga"), Jesús realiza su primer signo transformando el agua en vino excelente, manifestando su gloria a los discípulos.',
        meditationEn: 'At Mary’s intercession ("Do whatever He tells you"), Jesus performs His first public sign, changing water into fine wine and revealing His divine glory.',
        reflectionQuestion: '¿Escucho la voz de María que me dice "Haz lo que Jesús te diga" en mis responsabilidades y relaciones?',
        reflectionQuestionEn: "Fruit of the mystery: To Jesus through Mary"
      },
      {
        number: 3,
        title: 'El Anuncio del Reino de Dios y llamado a la Conversión',
        titleEn: 'The Proclamation of the Kingdom of God and Call to Conversion',
        image: 'icon-kingdom',
        biblicalRef: "Mark 1:15",
        scriptureText: 'Jesús marchó a Galilea a proclamar el Evangelio de Dios: «Se ha cumplido el tiempo y está cerca el reino de Dios: conviértanse y crean en el Evangelio».',
        scriptureTextEn: `'This is the time of fulfillment. The kingdom of God is at hand. Repent, and believe in the gospel.'`This is the time of fulfillment. The kingdom of God is at hand. Repent, and believe in the gospel."',
        meditation: 'Jesús proclama: "El tiempo se ha cumplido y el Reino de Dios está cerca; conviértanse y crean en el Evangelio", perdonando los pecados a los que acuden con fe.',
        meditationEn: 'Jesus proclaims: "The time is fulfilled, and the kingdom of God is at hand; repent and believe in the Gospel," bestowing mercy on all who come in faith.',
        reflectionQuestion: '¿Me acerco con frecuencia al sacramento de la Reconciliación para renovar mi corazón en la gracia divina?',
        reflectionQuestionEn: "Fruit of the mystery: Conversion"
      },
      {
        number: 4,
        title: 'La Transfiguración del Señor en el Monte Tabor',
        titleEn: 'The Transfiguration of the Lord on Mount Tabor',
        image: 'icon-transfiguration',
        biblicalRef: "Matthew 17:1-2",
        scriptureText: 'Mientras oraba, el aspecto de su rostro cambió y su vestido brillaba de resplandor. Y una voz desde la nube decía: «Este es mi Hijo, el elegido; escúchenlo».',
        scriptureTextEn: `After six days Jesus took Peter, James, and John his brother, and led them up a high mountain by themselves. And he was transfigured before them; his face shone like the sun and his clothes became white as light.`This is my chosen Son; listen to him."',
        meditation: 'Jesús sube al monte con Pedro, Santiago y Juan. Su rostro resplandece como el sol y sus vestiduras se vuelven blancas y deslumbrantes, revelando su gloria divina.',
        meditationEn: 'On Mount Tabor before Peter, James, and John, Jesus’ face shines like the sun and His garments become dazzling white, revealing His heavenly glory.',
        reflectionQuestion: '¿Busco momentos de contemplación y adoración para dejarme iluminar por la presencia viva de Cristo?',
        reflectionQuestionEn: "Fruit of the mystery: Desire for holiness"
      },
      {
        number: 5,
        title: 'La Institución de la Santísima Eucaristía',
        titleEn: 'The Institution of the Holy Eucharist',
        image: 'icon-eucharist',
        biblicalRef: "Matthew 26:26",
        scriptureText: 'Tomó pan, pronunció la bendición, lo partió y lo dio a sus discípulos diciendo: «Tomen, coman: esto es mi cuerpo». Y tomando el cáliz: «Beban todos de él, porque esta es mi sangre de la alianza».',
        scriptureTextEn: `While they were eating, Jesus took bread, said the blessing, broke it, and giving it to his disciples said, 'Take and eat; this is my body.'`Take and eat; this is my body." Then he took a cup: "Drink from it, all of you, for this is my blood of the covenant."',
        meditation: 'En la Última Cena, Jesús toma pan y vino, los entrega como su Cuerpo y Sangre para la remisión de los pecados, y nos ordena: "Hagan esto en memoria mía".',
        meditationEn: 'At the Last Supper, Jesus offers His Body and Blood under the species of bread and wine, giving us the sacrament of eternal love: "Do this in memory of me."',
        reflectionQuestion: '¿Participo de la Sagrada Eucaristía con reverencia, agradecimiento y un corazón debidamente preparado?',
        reflectionQuestionEn: "Fruit of the mystery: Adoration"
      }
    ]
  }
};

/**
 * Determina automáticamente el tipo de misterio según el día de la semana
 */
export function getMysteryTypeForDay(day?: number, date?: Date): MysteryType {
  const d = day !== undefined ? day : new Date().getDay();
  const currentDate = date || new Date();
  const month = currentDate.getMonth() + 1; // 1-12
  const dayOfMonth = currentDate.getDate();

  // Extraordinary cases (System for special feasts/seasons)
  // Christmas Day (Dec 25) -> Joyful
  if (month === 12 && dayOfMonth === 25) return 'gozosos';
  // Annunciation (Mar 25) -> Joyful
  if (month === 3 && dayOfMonth === 25) return 'gozosos';
  // Assumption (Aug 15) -> Glorious
  if (month === 8 && dayOfMonth === 15) return 'gloriosos';
  // All Saints (Nov 1) -> Glorious
  if (month === 11 && dayOfMonth === 1) return 'gloriosos';
  // Our Lady of Sorrows (Sep 15) -> Sorrowful
  if (month === 9 && dayOfMonth === 15) return 'dolorosos';

  // Default weekly cycle
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
// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL UNTRUNCATED PRAYERS (ES / EN / LA)
// ─────────────────────────────────────────────────────────────────────────────

export const PRAYERS_CANONICAL = {
  padreNuestro: {
    es: `Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu Reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.`,
    en: `Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.`,
    la: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum cotidianum da nobis hodie, et dimitte nobis debita nostra sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem: sed libera nos a malo. Amen.`
  },
  aveMaria: {
    es: `Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita Tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.`,
    en: `Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.`,
    la: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`
  },
  gloria: {
    es: `Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.`,
    en: `Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.`,
    la: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc et semper, et in saecula saeculorum. Amen.`
  },
  fatima: {
    es: `¡Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén!`,
    en: `O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of Thy mercy. Amen.`,
    la: `O mi Iesu, dimitte nobis debita nostra, libera nos ab igne inferni, perduc in caelum omnes animas, praesertim eas quae misericordiae tuae maxime indigent. Amen.`
  },
  credo: {
    es: `Creo en Dios, Padre Todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.`,
    en: `I believe in God, the Father Almighty, Creator of heaven and earth. And in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from there He will come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.`,
    la: `Credo in Deum Patrem omnipotentem, Creatorem caeli et terrae. Et in Iesum Christum, Filium eius unicum, Dominum nostrum, qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus, et sepultus, descendit ad inferos, tertia die resurrexit a mortuis, ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis, inde venturus est iudicare vivos et mortuos. Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.`
  }
};

/**
 * Mazo 1: Oraciones Iniciales (Opening Prayers Deck)
 */
export function getRosarioOpeningDeck(variant: RosaryVariant = 'mexicana'): PrayerCard[] {
  const mysteryType = getMysteryTypeForDay();
  const info = MISTERIOS_DATA[mysteryType];

  if (variant === 'misionera') {
    return [
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
        subDeck: 'opening',
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
        subDeck: 'opening',
        text: `Por la señal de la Santa Cruz, de nuestros enemigos líbranos Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.

Ofrecimiento:
Señor Jesús, dueño de la mies, te ofrecemos este Santo Rosario Misionero por la evangelización del mundo entero, por los misioneros que anuncian tu Palabra y por la paz de todos los pueblos.

Señor mío Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío; por ser Vos quien sois, bondad infinita, me pesa de todo corazón haberte ofendido. Propongo firmemente nunca más pecar. Amén.`,
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
        subDeck: 'opening',
        text: PRAYERS_CANONICAL.credo.es,
        textEn: PRAYERS_CANONICAL.credo.en
      },
      {
        id: 'rosario-misionero-pn-tres-avemarias',
        title: '3. Padre Nuestro y 3 Ave Marías Iniciales',
        titleEn: '3. Our Father and 3 Initial Hail Marys',
        subtitle: 'Por el Papa y los misioneros del mundo',
        subtitleEn: 'For the Pope and world missionaries',
        category: 'Santo Rosario Misionero',
        categoryEn: 'Missionary Holy Rosary',
        subDeck: 'opening',
        text: `Padre Nuestro:
${PRAYERS_CANONICAL.padreNuestro.es}

1º Por el Santo Padre y la Iglesia:
${PRAYERS_CANONICAL.aveMaria.es}

2º Por las vocaciones sacerdotales y misioneras:
${PRAYERS_CANONICAL.aveMaria.es}

3º Por todos los que aún no conocen a Cristo:
${PRAYERS_CANONICAL.aveMaria.es}

Gloria al Padre:
${PRAYERS_CANONICAL.gloria.es}`,
        textEn: `Our Father:
${PRAYERS_CANONICAL.padreNuestro.en}

1st For the Holy Father and the Church:
${PRAYERS_CANONICAL.aveMaria.en}

2nd For priestly and missionary vocations:
${PRAYERS_CANONICAL.aveMaria.en}

3rd For all who do not yet know Christ:
${PRAYERS_CANONICAL.aveMaria.en}

Glory Be:
${PRAYERS_CANONICAL.gloria.en}`
      }
    ];
  }

  if (variant === 'latin') {
    const latinInfo = MYSTERY_TITLES_LATIN[mysteryType];
    return [
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
        subDeck: 'opening',
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
        subDeck: 'opening',
        text: `In nomine Patris, et Filii, et Spiritus Sancti. Amen.

${PRAYERS_CANONICAL.credo.la}`,
        textEn: `In the name of the Father, and of the Son, and of the Holy Spirit. Amen.

${PRAYERS_CANONICAL.credo.en}`
      },
      {
        id: 'rosario-latin-pater-tres-ave',
        title: '2. Pater Noster & Tres Ave Mariae',
        titleEn: '2. Our Father & Three Hail Marys',
        subtitle: 'Pro Fide, Spe et Caritate',
        subtitleEn: 'For Faith, Hope, and Charity',
        category: 'Rosarium Latine',
        categoryEn: 'Latin Rosary',
        subDeck: 'opening',
        text: `Pater Noster:
${PRAYERS_CANONICAL.padreNuestro.la}

1. Pro Fide:
${PRAYERS_CANONICAL.aveMaria.la}

2. Pro Spe:
${PRAYERS_CANONICAL.aveMaria.la}

3. Pro Caritate:
${PRAYERS_CANONICAL.aveMaria.la}

Gloria Patri:
${PRAYERS_CANONICAL.gloria.la}`,
        textEn: `Our Father:
${PRAYERS_CANONICAL.padreNuestro.en}

1. For Faith:
${PRAYERS_CANONICAL.aveMaria.en}

2. For Hope:
${PRAYERS_CANONICAL.aveMaria.en}

3. For Charity:
${PRAYERS_CANONICAL.aveMaria.en}

Glory Be:
${PRAYERS_CANONICAL.gloria.en}`
      }
    ];
  }

  if (variant === 'universal') {
    return [
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
        subDeck: 'opening',
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
        subDeck: 'opening',
        text: `Por la señal de la Santa Cruz, de nuestros enemigos líbranos Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.

${PRAYERS_CANONICAL.credo.es}`,
        textEn: `In the name of the Father, and of the Son, and of the Holy Spirit. Amen.

${PRAYERS_CANONICAL.credo.en}`
      },
      {
        id: 'rosario-universal-pn-tres-avemarias',
        title: '2. Padre Nuestro y 3 Ave Marías',
        titleEn: '2. Our Father and 3 Hail Marys',
        subtitle: 'Virtudes Teologales: Fe, Esperanza y Caridad',
        subtitleEn: 'Theological Virtues: Faith, Hope, and Charity',
        category: 'Santo Rosario Universal',
        categoryEn: 'Universal Holy Rosary',
        subDeck: 'opening',
        text: `Padre Nuestro:
${PRAYERS_CANONICAL.padreNuestro.es}

1º Por el aumento de la Fe:
${PRAYERS_CANONICAL.aveMaria.es}

2º Por el aumento de la Esperanza:
${PRAYERS_CANONICAL.aveMaria.es}

3º Por el aumento de la Caridad:
${PRAYERS_CANONICAL.aveMaria.es}

Gloria al Padre:
${PRAYERS_CANONICAL.gloria.es}`,
        textEn: `Our Father:
${PRAYERS_CANONICAL.padreNuestro.en}

1st For the increase of Faith:
${PRAYERS_CANONICAL.aveMaria.en}

2nd For the increase of Hope:
${PRAYERS_CANONICAL.aveMaria.en}

3rd For the increase of Charity:
${PRAYERS_CANONICAL.aveMaria.en}

Glory Be:
${PRAYERS_CANONICAL.gloria.en}`
      }
    ];
  }

  // Predeterminada: Mexicana
  return [
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
      subDeck: 'opening',
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
      subDeck: 'opening',
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
      subDeck: 'opening',
      text: PRAYERS_CANONICAL.credo.es,
      textEn: PRAYERS_CANONICAL.credo.en
    },
    {
      id: 'rosario-mexicana-pn-tres-avemarias',
      title: '3. Padre Nuestro y 3 Ave Marías Iniciales',
      titleEn: '3. Our Father and 3 Initial Hail Marys',
      subtitle: 'Fe, Esperanza y Caridad',
      subtitleEn: 'Faith, Hope, and Charity',
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      subDeck: 'opening',
      text: `Padre Nuestro:
${PRAYERS_CANONICAL.padreNuestro.es}

1º Por el aumento de nuestra Fe:
${PRAYERS_CANONICAL.aveMaria.es}

2º Por el aumento de nuestra Esperanza:
${PRAYERS_CANONICAL.aveMaria.es}

3º Por el aumento de nuestra Caridad:
${PRAYERS_CANONICAL.aveMaria.es}

Gloria al Padre:
${PRAYERS_CANONICAL.gloria.es}`,
      textEn: `Our Father:
${PRAYERS_CANONICAL.padreNuestro.en}

1st For the increase of our Faith:
${PRAYERS_CANONICAL.aveMaria.en}

2nd For the increase of our Hope:
${PRAYERS_CANONICAL.aveMaria.en}

3rd For the increase of our Charity:
${PRAYERS_CANONICAL.aveMaria.en}

Glory Be:
${PRAYERS_CANONICAL.gloria.en}`
    }
  ];
}

/**
 * Mazo 2: Los 5 Misterios (Mysteries Deck con 5 elementos secuenciales)
 */
export function getRosarioMysteriesDeck(manualType?: MysteryType, variant: RosaryVariant = 'mexicana'): PrayerCard[] {
  const mysteryType = manualType || getMysteryTypeForDay();
  const info = MISTERIOS_DATA[mysteryType];
  const latinInfo = MYSTERY_TITLES_LATIN[mysteryType];

  return info.mysteries.map((m, idx) => {
    let cardTitle = `${m.number}º Misterio: ${m.title}`;
    let cardTitleEn = `${m.number}th Mystery: ${m.titleEn}`;
    let cardSubtitle = `${info.name} • ${m.biblicalRef}`;
    let cardSubtitleEn = `${info.nameEn} • ${m.biblicalRef}`;
    let cardCategory = 'Santo Rosario';
    let cardCategoryEn = 'Holy Rosary';
    let extraAspirationsEs = `— "María, Madre de gracia y Madre de misericordia, en la vida y en la muerte ampáranos, Gran Señora."\n— "Alabanzas y gracias sean dadas en todo momento al Santísimo y Divinísimo Sacramento del Altar. Y bendita sea por siempre la Santa e Inmaculada Concepción de la Bienaventurada Virgen María, Madre de Dios y Madre nuestra."\n— "${PRAYERS_CANONICAL.fatima.es}"\n— "Sagrado Corazón de Jesús, en Vos confío."`;
    let extraAspirationsEn = `— "Mary, Mother of grace and Mother of mercy, in life and in death protect us, O Great Lady."\n— "Praised and adored without end be the Most Blessed and Divine Sacrament of the Altar. And forever blessed be the Holy and Immaculate Conception of the Blessed Virgin Mary, Mother of God and our Mother."\n— "${PRAYERS_CANONICAL.fatima.en}"\n— "Sacred Heart of Jesus, I place my trust in Thee."`;

    if (variant === 'misionera') {
      const cont = CONTINENTES_MISIONEROS[idx] || CONTINENTES_MISIONEROS[0];
      cardSubtitle = `${cont.emoji} Continente: ${cont.continent} (${cont.color}) • ${info.name}`;
      cardSubtitleEn = `${cont.emoji} Continent: ${cont.continentEn} (${cont.colorEn}) • ${info.nameEn}`;
      cardCategory = 'Santo Rosario Misionero';
      cardCategoryEn = 'Missionary Holy Rosary';
      extraAspirationsEs = `— "¡Santa María, Reina de las Misiones; ruega al Señor Jesús por nosotros!"\n— "${PRAYERS_CANONICAL.fatima.es}"`;
      extraAspirationsEn = `— "Holy Mary, Queen of the Missions; pray to the Lord Jesus for us!"\n— "${PRAYERS_CANONICAL.fatima.en}"`;
    } else if (variant === 'latin') {
      const latTitle = latinInfo.mysteries[idx] || m.title;
      cardTitle = `${m.number}. Mysterium: ${latTitle}`;
      cardTitleEn = `${m.number}. Mystery: ${latTitle} (${m.titleEn})`;
      cardSubtitle = `${latinInfo.name} • ${m.biblicalRef}`;
      cardSubtitleEn = `${latinInfo.name} • ${m.biblicalRef}`;
      cardCategory = 'Rosarium Latine';
      cardCategoryEn = 'Latin Rosary';
      extraAspirationsEs = `— "${PRAYERS_CANONICAL.fatima.la}"`;
      extraAspirationsEn = `— "${PRAYERS_CANONICAL.fatima.la}"`;
    } else if (variant === 'universal') {
      cardCategory = 'Santo Rosario Universal';
      cardCategoryEn = 'Universal Holy Rosary';
      extraAspirationsEs = `— "${PRAYERS_CANONICAL.fatima.es}"`;
      extraAspirationsEn = `— "${PRAYERS_CANONICAL.fatima.en}"`;
    }

    const repeatedPrayers: RepeatedPrayer[] = [
      {
        title: variant === 'latin' ? '1 Pater Noster' : '1 Padre Nuestro',
        titleEn: variant === 'latin' ? '1 Pater Noster' : '1 Our Father',
        text: variant === 'latin' ? PRAYERS_CANONICAL.padreNuestro.la : PRAYERS_CANONICAL.padreNuestro.es,
        textEn: variant === 'latin' ? PRAYERS_CANONICAL.padreNuestro.la : PRAYERS_CANONICAL.padreNuestro.en,
        count: 1
      },
      {
        title: variant === 'latin' ? '10 Ave Mariae' : '10 Ave Marías',
        titleEn: variant === 'latin' ? '10 Ave Mariae' : '10 Hail Marys',
        text: variant === 'latin' ? PRAYERS_CANONICAL.aveMaria.la : PRAYERS_CANONICAL.aveMaria.es,
        textEn: variant === 'latin' ? PRAYERS_CANONICAL.aveMaria.la : PRAYERS_CANONICAL.aveMaria.en,
        count: 10
      },
      {
        title: variant === 'latin' ? '1 Gloria Patri' : '1 Gloria al Padre',
        titleEn: variant === 'latin' ? '1 Gloria Patri' : '1 Glory Be',
        text: variant === 'latin' ? PRAYERS_CANONICAL.gloria.la : PRAYERS_CANONICAL.gloria.es,
        textEn: variant === 'latin' ? PRAYERS_CANONICAL.gloria.la : PRAYERS_CANONICAL.gloria.en,
        count: 1
      },
      {
        title: variant === 'latin' ? 'Oratio Fatimae' : 'Jaculatorias',
        titleEn: variant === 'latin' ? 'Fatima Prayer' : 'Aspirations',
        text: extraAspirationsEs,
        textEn: extraAspirationsEn,
        count: 1
      }
    ];

    const fullBodyEs = `1. CITA BÍBLICA:
${m.biblicalRef}

2. LECTURA BÍBLICA:
"${m.scriptureText}"

3. MEDITACIÓN:
${m.meditation}

4. PREGUNTA DE REFLEXIÓN:
${m.reflectionQuestion}

5. ORACIONES DE ESTA DECENA:
• 1 Padre Nuestro:
${PRAYERS_CANONICAL.padreNuestro.es}

• 10 Ave Marías:
${PRAYERS_CANONICAL.aveMaria.es}

• 1 Gloria al Padre:
${PRAYERS_CANONICAL.gloria.es}

• Jaculatorias:
${extraAspirationsEs}`;

    const fullBodyEn = `1. SCRIPTURAL CITATION:
${m.biblicalRef}

2. SCRIPTURE READING:
"${m.scriptureTextEn}"

3. MEDITATION:
${m.meditationEn}

4. PERSONAL REFLECTION:
${m.reflectionQuestionEn}

5. PRAYERS OF THIS DECADE:
• 1 Our Father:
${PRAYERS_CANONICAL.padreNuestro.en}

• 10 Hail Marys:
${PRAYERS_CANONICAL.aveMaria.en}

• 1 Glory Be:
${PRAYERS_CANONICAL.gloria.en}

• Aspirations:
${extraAspirationsEn}`;

    return {
      id: `rosario-${variant}-misterio-${m.number}`,
      title: cardTitle,
      titleEn: cardTitleEn,
      subtitle: cardSubtitle,
      subtitleEn: cardSubtitleEn,
      category: cardCategory,
      categoryEn: cardCategoryEn,
      isMysteryCard: true,
      mysteryNumber: m.number,
      mysteryName: m.title,
      mysteryNameEn: m.titleEn,
      mysteryMeditation: m.meditation,
      mysteryMeditationEn: m.meditationEn,
      biblicalRef: m.biblicalRef,
      scriptureText: m.scriptureText,
      scriptureTextEn: m.scriptureTextEn,
      reflectionQuestion: m.reflectionQuestion,
      reflectionQuestionEn: m.reflectionQuestionEn,
      image: m.image,
      repeatedPrayers,
      subDeck: 'mysteries',
      text: fullBodyEs,
      textEn: fullBodyEn
    };
  });
}

/**
 * Mazo 3: Oraciones Finales (Concluding & Self Prayers Deck)
 */
export function getRosarioConcludingDeck(variant: RosaryVariant = 'mexicana'): PrayerCard[] {
  if (variant === 'misionera') {
    return [
      {
        id: 'rosario-misionero-tres-ultimas',
        title: 'Las Tres Últimas Ave Marías',
        titleEn: 'The Three Final Hail Marys',
        subtitle: 'A las Tres Divinas Personas',
        subtitleEn: 'To the Three Divine Persons',
        category: 'Santo Rosario Misionero',
        categoryEn: 'Missionary Holy Rosary',
        subDeck: 'concluding',
        text: `Padre Nuestro:
${PRAYERS_CANONICAL.padreNuestro.es}

1.- Dios te salve María, Hija de Dios Padre; en Tus Manos ponemos nuestra Fe para que la ilumines:
${PRAYERS_CANONICAL.aveMaria.es}

2.- Dios te salve María, Madre de Dios Hijo; en Tus Manos ponemos nuestra Esperanza para que la alientes:
${PRAYERS_CANONICAL.aveMaria.es}

3.- Dios te salve María, Esposa de Dios Espíritu Santo; en Tus Manos ponemos nuestra Caridad para que la inflames:
${PRAYERS_CANONICAL.aveMaria.es}

Dios te salve María; Templo, Trono y Sagrario de la Santísima Trinidad; Virgen concebida sin pecado original.`,
        textEn: `Our Father:
${PRAYERS_CANONICAL.padreNuestro.en}

1.- Hail Mary, Daughter of God the Father; into Thy hands we commend our Faith that Thou mayest enlighten it:
${PRAYERS_CANONICAL.aveMaria.en}

2.- Hail Mary, Mother of God the Son; into Thy hands we commend our Hope that Thou mayest encourage it:
${PRAYERS_CANONICAL.aveMaria.en}

3.- Hail Mary, Spouse of the Holy Spirit; into Thy hands we commend our Charity that Thou mayest enkindle it:
${PRAYERS_CANONICAL.aveMaria.en}

Hail Mary, Temple and Tabernacle of the Most Holy Trinity; Virgin conceived without original sin.`
      },
      {
        id: 'rosario-misionero-salve',
        title: 'La Salve Regina',
        titleEn: 'Hail Holy Queen',
        subtitle: 'Madre de todas las Naciones',
        subtitleEn: 'Mother of all Nations',
        category: 'Santo Rosario Misionero',
        categoryEn: 'Missionary Holy Rosary',
        subDeck: 'concluding',
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
      },
      {
        id: 'rosario-misionero-final',
        title: 'Oración Misionera Final',
        titleEn: 'Concluding Missionary Prayer',
        subtitle: 'Envío y Bendición Universal',
        subtitleEn: 'Mission Sending and Universal Blessing',
        category: 'Santo Rosario Misionero',
        categoryEn: 'Missionary Holy Rosary',
        subDeck: 'concluding',
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
      }
    ];
  }

  if (variant === 'latin') {
    return [
      {
        id: 'rosario-latin-salve',
        title: 'Salve Regina',
        titleEn: 'Salve Regina (Hail Holy Queen)',
        subtitle: 'Antiphona Beatae Mariae Virginis',
        subtitleEn: 'Antiphon to the Blessed Virgin Mary',
        category: 'Rosarium Latine',
        categoryEn: 'Latin Rosary',
        subDeck: 'concluding',
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
      },
      {
        id: 'rosario-latin-conclusio',
        title: 'Oratio Conclusiva',
        titleEn: 'Concluding Prayer in Latin',
        subtitle: 'Benedictio Finalis',
        subtitleEn: 'Final Blessing',
        category: 'Rosarium Latine',
        categoryEn: 'Latin Rosary',
        subDeck: 'concluding',
        text: `Oremus:
Deus, cuius Unigenitus per vitam, mortem et resurrectionem suam nobis salutis aeternae praemia comparavit: concede, quaesumus; ut haec mysteria sacratissimo Beatae Mariae Virginis Rosario recolentes, et imitemur quod continent, et quod promittunt assequamur.
Per Christum Dominum nostrum. Amen.

In nomine Patris, et Filii, et Spiritus Sancti. Amen.`,
        textEn: `Oremus (Let us pray):
Deus, cuius Unigenitus per vitam, mortem et resurrectionem suam nobis salutis aeternae praemia comparavit: concede, quaesumus; ut haec mysteria sacratissimo Beatae Mariae Virginis Rosario recolentes, et imitemur quod continent, et quod promittunt assequamur.
Per Christum Dominum nostrum. Amen.

In nomine Patris, et Filii, et Spiritus Sancti. Amen.`
      }
    ];
  }

  if (variant === 'universal') {
    return [
      {
        id: 'rosario-universal-salve',
        title: 'La Salve',
        titleEn: 'Hail Holy Queen (Salve Regina)',
        subtitle: 'Agradecimiento a la Virgen María',
        subtitleEn: 'Thanksgiving to the Virgin Mary',
        category: 'Santo Rosario Universal',
        categoryEn: 'Universal Holy Rosary',
        subDeck: 'concluding',
        text: `Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A Ti llamamos los desterrados hijos de Eva; a Ti suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente, oh piadosa, oh dulce Virgen María!

V. Ruega por nosotros, Santa Madre de Dios.
R. Para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.`,
        textEn: `Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ. Amen.`
      },
      {
        id: 'rosario-universal-final',
        title: 'Oración Final y Bendición',
        titleEn: 'Concluding Prayer and Blessing',
        subtitle: 'Fin del Santo Rosario',
        subtitleEn: 'Conclusion of the Holy Rosary',
        category: 'Santo Rosario Universal',
        categoryEn: 'Universal Holy Rosary',
        subDeck: 'concluding',
        text: `Oremos:
Te rogamos nos concedas, Señor Dios nuestro, gozar de continua salud de alma y cuerpo, y por la gloriosa intercesión de la bienaventurada siempre Virgen María, vernos libres de las tristezas de la vida presente y disfrutar de las eternas alegrías.
Por Jesucristo Nuestro Señor. Amén.

En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.`,
        textEn: `Let us pray:
O God, whose Only Begotten Son, by His life, Death, and Resurrection, has purchased for us the rewards of eternal life: grant, we beseech Thee, that meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise.
Through Christ our Lord. Amen.

In the name of the Father, and of the Son, and of the Holy Spirit. Amen.`
      }
    ];
  }

  // Predeterminada: Mexicana
  return [
    {
      id: 'rosario-mexicana-tres-ultimas',
      title: 'Las Tres Últimas Ave Marías',
      titleEn: 'The Three Final Hail Marys',
      subtitle: 'A las Tres Divinas Personas',
      subtitleEn: 'To the Three Divine Persons',
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      subDeck: 'concluding',
      text: `Padre Nuestro:
${PRAYERS_CANONICAL.padreNuestro.es}

1.- Dios te salve María, Hija de Dios Padre; en Tus Manos ponemos nuestra Fe para que la ilumines:
${PRAYERS_CANONICAL.aveMaria.es}

2.- Dios te salve María, Madre de Dios Hijo; en Tus Manos ponemos nuestra Esperanza para que la alientes:
${PRAYERS_CANONICAL.aveMaria.es}

3.- Dios te salve María, Esposa de Dios Espíritu Santo; en Tus Manos ponemos nuestra Caridad para que la inflames:
${PRAYERS_CANONICAL.aveMaria.es}

Dios te salve María; Templo, Trono y Sagrario de la Santísima Trinidad; Virgen concebida sin pecado original.`,
      textEn: `Our Father:
${PRAYERS_CANONICAL.padreNuestro.en}

1.- Hail Mary, Daughter of God the Father; into Thy hands we commend our Faith that Thou mayest enlighten it:
${PRAYERS_CANONICAL.aveMaria.en}

2.- Hail Mary, Mother of God the Son; into Thy hands we commend our Hope that Thou mayest encourage it:
${PRAYERS_CANONICAL.aveMaria.en}

3.- Hail Mary, Spouse of the Holy Spirit; into Thy hands we commend our Charity that Thou mayest enkindle it:
${PRAYERS_CANONICAL.aveMaria.en}

Hail Mary; Temple, Throne, and Tabernacle of the Most Holy Trinity; Virgin conceived without original sin.`
    },
    {
      id: 'rosario-mexicana-salve',
      title: 'La Salve Regina',
      titleEn: 'Hail Holy Queen (Salve Regina)',
      subtitle: 'Madre y Esperanza Nuestra',
      subtitleEn: 'Our Mother and Our Hope',
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      subDeck: 'concluding',
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
    },
    {
      id: 'rosario-mexicana-letanias',
      title: 'Letanías Lauretanas',
      titleEn: 'Litany of Loreto',
      subtitle: 'Invocaciones a la Santísima Virgen',
      subtitleEn: 'Invocations to the Blessed Virgin Mary',
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      subDeck: 'concluding',
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
    },
    {
      id: 'rosario-mexicana-final',
      title: 'Bajo tu Amparo y Oración Final',
      titleEn: 'Sub Tuum Praesidium & Concluding Prayer',
      subtitle: 'Conclusión y Bendición',
      subtitleEn: 'Conclusion and Blessing',
      category: 'Santo Rosario',
      categoryEn: 'Holy Rosary',
      subDeck: 'concluding',
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
    }
  ];
}

/**
 * Genera el flujo guiado completo del Santo Rosario según el tipo de misterio, variante y sub-mazo
 * Soporta 'all', 'opening', 'mysteries', 'concluding'
 */
export function getSantoRosarioDeck(
  manualType?: MysteryType, 
  variant: RosaryVariant = 'mexicana',
  subDeck: 'all' | 'opening' | 'mysteries' | 'concluding' = 'all'
): PrayerCard[] {
  const mysteryType = manualType || getMysteryTypeForDay();

  if (subDeck === 'opening') {
    return getRosarioOpeningDeck(variant);
  }
  if (subDeck === 'mysteries') {
    return getRosarioMysteriesDeck(mysteryType, variant);
  }
  if (subDeck === 'concluding') {
    return getRosarioConcludingDeck(variant);
  }

  // 'all' combines opening + mysteries + concluding
  return [
    ...getRosarioOpeningDeck(variant),
    ...getRosarioMysteriesDeck(mysteryType, variant),
    ...getRosarioConcludingDeck(variant)
  ];
}
