export interface MassResponseLine {
  speaker: string;
  text: string;
  rubrics?: string;
}

export interface MassResponsePart {
  title: {
    en: string;
    es: string;
  };
  posture?: {
    en: string;
    es: string;
  };
  lines: {
    en: MassResponseLine[];
    es: MassResponseLine[];
  };
}

export interface MassResponseSection {
  title: {
    en: string;
    es: string;
  };
  parts: MassResponsePart[];
}

export interface MexicanSungHymn {
  id: string;
  title: string;
  composer: string;
  liturgicalMoment: string;
  lyrics: string;
}

/**
 * Traditional Mexican Sung Liturgical Hymns (Alejandro Mejía and Mexican Liturgical Tradition)
 */
export const MEXICAN_SUNG_HYMNS: Record<string, MexicanSungHymn> = {
  gloriaMejia: {
    id: "gloria-mejia",
    title: "Gloria de Mejía",
    composer: "Alejandro Mejía Pereda",
    liturgicalMoment: "Ritos Iniciales — Himno de Alabanza",
    lyrics: `Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Señor.
Por tu inmensa gloria te alabamos, te bendecimos, te adoramos, te glorificamos, te damos gracias, Señor Dios, Rey celestial, Dios Padre todopoderoso.
Señor, Hijo único, Jesucristo; Señor Dios, Cordero de Dios, Hijo del Padre;
tú que quitas el pecado del mundo, ten piedad de nosotros;
tú que quitas el pecado del mundo, atiende nuestra súplica;
tú que estás sentado a la derecha del Padre, ten piedad de nosotros;
porque sólo tú eres Santo, sólo tú Señor, sólo tú Altísimo, Jesucristo,
con el Espíritu Santo en la gloria de Dios Padre. Amén.`
  },
  santoTradicional: {
    id: "santo-tradicional",
    title: "Santo (Alejandro Mejía / Tradicional Mexicano)",
    composer: "Alejandro Mejía Pereda",
    liturgicalMoment: "Liturgia Eucarística — Prefacio",
    lyrics: `Santo, Santo, Santo es el Señor, Dios del universo.
Llenos están el cielo y la tierra de tu gloria.
Hosanna en el cielo.
Bendito el que viene en nombre del Señor.
Hosanna en el cielo.`
  },
  santoMejia: {
    id: "santo-mejia",
    title: "Santo de Mejía",
    composer: "Alejandro Mejía Pereda",
    liturgicalMoment: "Liturgia Eucarística — Aclamación",
    lyrics: `Santo, Santo, Santo es el Señor, Dios del universo.
Llenos están el cielo y la tierra de tu gloria.
Hosanna en el cielo, hosanna en las alturas.
Bendito el que viene en nombre del Señor.
Hosanna en el cielo.`
  },
  corderoMejia: {
    id: "cordero-mejia",
    title: "Cordero de Dios (Alejandro Mejía)",
    composer: "Alejandro Mejía Pereda",
    liturgicalMoment: "Rito de Comunión — Fracción del Pan",
    lyrics: `Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.
Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros.
Cordero de Dios, que quitas el pecado del mundo, danos la paz.`
  },
  corderoTradicional: {
    id: "cordero-tradicional",
    title: "Cordero de Dios (Tradicional Mexicano)",
    composer: "Liturgia Tradicional Mexicana",
    liturgicalMoment: "Rito de Comunión — Fracción del Pan",
    lyrics: `Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros, ten piedad de nosotros.
Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros, ten piedad de nosotros.
Cordero de Dios, que quitas el pecado del mundo, danos la paz, danos la paz.`
  }
};

/**
 * Roman Missal Mass Ordinary Dialogues, Priest Private Prayers & Assembly Responses
 * (Misal Romano 3a Edición Típica para México / Roman Missal 3rd Typical Edition)
 */
export const massResponses: MassResponseSection[] = [
  // ── SECCIÓN 1: RITOS INICIALES ──
  {
    title: {
      en: "Introductory Rites",
      es: "Ritos Iniciales",
    },
    parts: [
      {
        title: { en: "The Greeting", es: "El Saludo Inicial" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen." },
            { speaker: "Celebrant", text: "The Lord be with you." },
            { speaker: "People", text: "And with your spirit." },
          ],
          es: [
            { speaker: "Sacerdote", text: "En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén." },
            { speaker: "Sacerdote", text: "El Señor esté con ustedes." },
            { speaker: "Pueblo", text: "Y con tu espíritu." },
          ]
        }
      },
      {
        title: { en: "Act of Penitence", es: "Acto Penitencial" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Brethren (brothers and sisters), let us acknowledge our sins, and so prepare ourselves to celebrate the sacred mysteries." },
            { speaker: "All", text: "I confess to almighty God and to you, my brothers and sisters, that I have greatly sinned, in my thoughts and in my words, in what I have done and in what I have failed to do, through my fault, through my fault, through my most grievous fault; therefore I ask blessed Mary ever-Virgin, all the Angels and Saints, and you, my brothers and sisters, to pray for me to the Lord our God." },
            { speaker: "Celebrant", text: "May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life. Amen." },
            { speaker: "Celebrant", text: "Lord, have mercy. Christ, have mercy. Lord, have mercy." },
            { speaker: "People", text: "Lord, have mercy. Christ, have mercy. Lord, have mercy." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Para celebrar dignamente estos sagrados misterios, reconozcamos nuestros pecados." },
            { speaker: "Todos", text: "Yo confieso ante Dios todopoderoso y ante ustedes, hermanos, que he pecado mucho de pensamiento, palabra, obra y omisión: por mi culpa, por mi culpa, por mi gran culpa. Por eso ruego a santa María, siempre Virgen, a los ángeles, a los santos y a ustedes, hermanos, que intercedan por mí ante Dios, nuestro Señor." },
            { speaker: "Sacerdote", text: "Dios todopoderoso tenga misericordia de nosotros, perdone nuestros pecados y nos lleve a la vida eterna. Amén." },
            { speaker: "Sacerdote", text: "Señor, ten piedad. Cristo, ten piedad. Señor, ten piedad." },
            { speaker: "Pueblo", text: "Señor, ten piedad. Cristo, ten piedad. Señor, ten piedad." }
          ]
        }
      },
      {
        title: { en: "The Gloria", es: "El Gloria (Himno de Alabanza)" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "All", text: "Glory to God in the highest, and on earth peace to people of good will. We praise you, we bless you, we adore you, we glorify you, we give you thanks for your great glory, Lord God, heavenly King, O God, almighty Father. Lord Jesus Christ, Only Begotten Son, Lord God, Lamb of God, Son of the Father, you take away the sins of the world, have mercy on us; you take away the sins of the world, receive our prayer; you are seated at the right hand of the Father, have mercy on us. For you alone are the Holy One, you alone are the Lord, you alone are the Most High, Jesus Christ, with the Holy Spirit, in the glory of God the Father. Amen." }
          ],
          es: [
            { speaker: "Todos", text: "Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Señor. Por tu inmensa gloria te alabamos, te bendecimos, te adoramos, te glorificamos, te damos gracias, Señor Dios, Rey celestial, Dios Padre todopoderoso. Señor, Hijo único, Jesucristo; Señor Dios, Cordero de Dios, Hijo del Padre; tú que quitas el pecado del mundo, ten piedad de nosotros; tú que quitas el pecado del mundo, atiende nuestra súplica; tú que estás sentado a la derecha del Padre, ten piedad de nosotros; porque sólo tú eres Santo, sólo tú Señor, sólo tú Altísimo, Jesucristo, con el Espíritu Santo en la gloria de Dios Padre. Amén." }
          ]
        }
      },
      {
        title: { en: "The Collect", es: "Oración Colecta" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Let us pray. (The priest pronounces the collect prayer of the day)... through our Lord Jesus Christ, your Son, who lives and reigns with you in the unity of the Holy Spirit, God, for ever and ever." },
            { speaker: "People", text: "Amen." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Oremos. (El sacerdote pronuncia la oración colecta del día)... Por nuestro Señor Jesucristo, tu Hijo, que vive y reina contigo en la unidad del Espíritu Santo y es Dios por los siglos de los siglos." },
            { speaker: "Pueblo", text: "Amén." }
          ]
        }
      }
    ]
  },

  // ── SECCIÓN 2: LITURGIA DE LA PALABRA ──
  {
    title: {
      en: "Liturgy of the Word",
      es: "Liturgia de la Palabra",
    },
    parts: [
      {
        title: { en: "First Reading", es: "Primera Lectura" },
        posture: { en: "Sitting", es: "Sentados" },
        lines: {
          en: [
            { speaker: "Lector", text: "A reading from the holy Scriptures... (The reader proclaims the first reading)." },
            { speaker: "Lector", text: "The Word of the Lord." },
            { speaker: "People", text: "Thanks be to God." }
          ],
          es: [
            { speaker: "Lector", text: "Lectura de la Sagrada Escritura... (El lector proclama la primera lectura)." },
            { speaker: "Lector", text: "Palabra de Dios." },
            { speaker: "Pueblo", text: "Te alabamos, Señor." }
          ]
        }
      },
      {
        title: { en: "Responsorial Psalm", es: "Salmo Responsorial" },
        posture: { en: "Sitting", es: "Sentados" },
        lines: {
          en: [
            { speaker: "Psalmist", text: "(The psalmist proclaims the psalm antiphon and verses)." },
            { speaker: "People", text: "(The people repeat the responsorial response)." }
          ],
          es: [
            { speaker: "Salmista", text: "(El salmista o cantor proclama la antífona y las estrofas del salmo)." },
            { speaker: "Pueblo", text: "(La asamblea responde con la antífona del salmo)." }
          ]
        }
      },
      {
        title: { en: "Second Reading", es: "Segunda Lectura (Domingos y Solemnidades)" },
        posture: { en: "Sitting", es: "Sentados" },
        lines: {
          en: [
            { speaker: "Lector", text: "A reading from the Letter of... (On Sundays and solemnities, the reader proclaims the apostolic epistle)." },
            { speaker: "Lector", text: "The Word of the Lord." },
            { speaker: "People", text: "Thanks be to God." }
          ],
          es: [
            { speaker: "Lector", text: "Lectura de la Carta de... (En domingos y solemnidades, el lector proclama la epístola apostólica)." },
            { speaker: "Lector", text: "Palabra de Dios." },
            { speaker: "Pueblo", text: "Te alabamos, Señor." }
          ]
        }
      },
      {
        title: { en: "Gospel Acclamation", es: "Aclamación del Evangelio (Aleluya)" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "All", text: "Alleluia, alleluia! (During Lent: Glory and praise to you, Lord Jesus Christ!)." }
          ],
          es: [
            { speaker: "Todos", text: "¡Aleluya, aleluya! (En Cuaresma: Gloria y alabanza a ti, Señor Jesús)." }
          ]
        }
      },
      {
        title: { en: "Proclamation of the Holy Gospel", es: "Proclamación del Santo Evangelio" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "The Lord be with you." },
            { speaker: "People", text: "And with your spirit." },
            { speaker: "Celebrant", text: "A reading from the holy Gospel according to [Matthew/Mark/Luke/John]." },
            { speaker: "People", text: "Glory to you, O Lord. (Sign of cross on forehead, lips, and chest)." },
            { speaker: "Celebrant", text: "(The priest or deacon proclaims the Gospel passage)." },
            { speaker: "Celebrant", text: "The Gospel of the Lord." },
            { speaker: "People", text: "Praise to you, Lord Jesus Christ." },
            { speaker: "Priest (quietly)", text: "Through the words of the Gospel may our sins be wiped away." }
          ],
          es: [
            { speaker: "Sacerdote", text: "El Señor esté con ustedes." },
            { speaker: "Pueblo", text: "Y con tu espíritu." },
            { speaker: "Sacerdote", text: "Lectura del santo Evangelio según san [Mateo/Marcos/Lucas/Juan]." },
            { speaker: "Pueblo", text: "Gloria a ti, Señor. (Haciendo la señal de la cruz en la frente, labios y pecho)." },
            { speaker: "Sacerdote", text: "(El sacerdote o diácono proclama el pasaje del Evangelio del día)." },
            { speaker: "Sacerdote", text: "Palabra del Señor." },
            { speaker: "Pueblo", text: "Gloria a ti, Señor Jesús." },
            { speaker: "Sacerdote (en secreto)", text: "Las palabras del Evangelio borren nuestros pecados." }
          ]
        }
      },
      {
        title: { en: "The Homily", es: "La Homilía" },
        posture: { en: "Sitting", es: "Sentados" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "(The priest or deacon explains the readings, applying God's word to daily Christian life)." }
          ],
          es: [
            { speaker: "Sacerdote", text: "(El sacerdote o diácono profundiza en las lecturas, aplicando la Palabra de Dios a la vida cristiana)." }
          ]
        }
      },
      {
        title: { en: "Profession of Faith (The Creed)", es: "Profesión de Fe (El Credo)" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "All", text: "I believe in one God, the Father almighty, maker of heaven and earth, of all things visible and invisible. I believe in one Lord Jesus Christ, the Only Begotten Son of God, born of the Father before all ages. God from God, Light from Light, true God from true God, begotten, not made, consubstantial with the Father; through him all things were made. For us men and for our salvation he came down from heaven, and by the Holy Spirit was incarnate of the Virgin Mary, and became man. For our sake he was crucified under Pontius Pilate, he suffered death and was buried, and rose again on the third day in accordance with the Scriptures. He ascended into heaven and is seated at the right hand of the Father. He will come again in glory to judge the living and the dead and his kingdom will have no end. I believe in the Holy Spirit, the Lord, the giver of life, who proceeds from the Father and the Son, who with the Father and the Son is adored and glorified, who has spoken through the prophets. I believe in one, holy, catholic and apostolic Church. I confess one Baptism for the forgiveness of sins and I look forward to the resurrection of the dead and the life of the world to come. Amen." }
          ],
          es: [
            { speaker: "Todos", text: "Creo en un solo Dios, Padre todopoderoso, Creador del cielo y de la tierra, de todo lo visible y lo invisible. Creo en un solo Señor, Jesucristo, Hijo único de Dios, nacido del Padre antes de todos los siglos: Dios de Dios, Luz de Luz, Dios verdadero de Dios verdadero, engendrado, no creado, de la misma naturaleza del Padre, por quien todo fue hecho; que por nosotros, los hombres, y por nuestra salvación bajó del cielo, y por obra del Espíritu Santo se encarnó de María, la Virgen, y se hizo hombre; y por nuestra causa fue crucificado en tiempos de Poncio Pilato; padeció y fue sepultado, y resucitó al tercer día, según las Escrituras, y subió al cielo, y está sentado a la derecha del Padre; y de nuevo vendrá con gloria para juzgar a vivos y muertos, y su reino no tendrá fin. Creo en el Espíritu Santo, Señor y dador de vida, que procede del Padre y del Hijo, que con el Padre y el Hijo recibe una misma adoración y gloria, y que habló por los profetas. Creo en la Iglesia, que es una, santa, católica y apostólica. Confieso que hay un solo bautismo para el perdón de los pecados. Espero la resurrección de los muertos y la vida del mundo futuro. Amén." }
          ]
        }
      },
      {
        title: { en: "Universal Prayer", es: "Oración Universal (Plegaria de los Fieles)" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Let us pray, brothers and sisters, to God the almighty Father for the holy Church, for the world, and for all people." },
            { speaker: "Lector", text: "...let us pray to the Lord." },
            { speaker: "People", text: "Lord, hear our prayer." },
            { speaker: "Celebrant", text: "Hear our prayers, O Lord, through Christ our Lord." },
            { speaker: "People", text: "Amen." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Oremos, hermanos, a Dios Padre todopoderoso, por las necesidades de la santa Iglesia, del mundo y de nuestra comunidad." },
            { speaker: "Lector", text: "...roguemos al Señor." },
            { speaker: "Pueblo", text: "Te rogamos, óyenos." },
            { speaker: "Sacerdote", text: "Escucha, Padre santo, nuestras súplicas. Por Jesucristo, nuestro Señor." },
            { speaker: "Pueblo", text: "Amén." }
          ]
        }
      }
    ]
  },

  // ── SECCIÓN 3: LITURGIA EUCARÍSTICA ──
  {
    title: {
      en: "Liturgy of the Eucharist",
      es: "Liturgia Eucarística",
    },
    parts: [
      {
        title: { en: "The Offertory & Preparation of the Gifts", es: "Presentación de las Ofrendas y Ofertorio" },
        posture: { en: "Sitting", es: "Sentados" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Blessed are you, Lord God of all creation, for through your goodness we have received the bread we offer you: fruit of the earth and work of human hands, it will become for us the bread of life." },
            { speaker: "People", text: "Blessed be God for ever." },
            { speaker: "Celebrant", text: "Blessed are you, Lord God of all creation, for through your goodness we have received the wine we offer you: fruit of the vine and work of human hands, it will become our spiritual drink." },
            { speaker: "People", text: "Blessed be God for ever." },
            { speaker: "Priest (quietly)", text: "With humble spirit and contrite heart may we be accepted by you, O Lord, and may our sacrifice in your sight this day be pleasing to you, Lord God. Wash me, O Lord, from my iniquity and cleanse me from my sin." },
            { speaker: "Celebrant", text: "Pray, brethren (brothers and sisters), that my sacrifice and yours may be acceptable to God, the almighty Father." },
            { speaker: "People", text: "May the Lord accept the sacrifice at your hands for the praise and glory of his name, for our good and the good of all his holy Church." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Bendito seas, Señor, Dios del universo, por este pan, fruto de la tierra y del trabajo del hombre, que recibimos de tu generosidad y ahora te presentamos; él será para nosotros pan de vida." },
            { speaker: "Pueblo", text: "Bendito seas por siempre, Señor." },
            { speaker: "Sacerdote", text: "Bendito seas, Señor, Dios del universo, por este vino, fruto de la vid y del trabajo del hombre, que recibimos de tu generosidad y ahora te presentamos; él será para nosotros bebida de salvación." },
            { speaker: "Pueblo", text: "Bendito seas por siempre, Señor." },
            { speaker: "Sacerdote (en secreto)", text: "Acepta, Señor, nuestro corazón contrito y nuestro espíritu humilde; y que éste sea hoy nuestro sacrificio. Lava del todo mi delito, Señor, y limpia mi pecado." },
            { speaker: "Sacerdote", text: "Orad, hermanos, para que este sacrificio, mío y vuestro, sea agradable a Dios, Padre todopoderoso." },
            { speaker: "Pueblo", text: "El Señor reciba de tus manos este sacrificio, para alabanza y gloria de su nombre, para nuestro bien y el de toda su santa Iglesia." }
          ]
        }
      },
      {
        title: { en: "The Preface Dialogue", es: "Diálogo del Prefacio" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "The Lord be with you." },
            { speaker: "People", text: "And with your spirit." },
            { speaker: "Celebrant", text: "Lift up your hearts." },
            { speaker: "People", text: "We lift them up to the Lord." },
            { speaker: "Celebrant", text: "Let us give thanks to the Lord our God." },
            { speaker: "People", text: "It is right and just." }
          ],
          es: [
            { speaker: "Sacerdote", text: "El Señor esté con ustedes." },
            { speaker: "Pueblo", text: "Y con tu espíritu." },
            { speaker: "Sacerdote", text: "Levantemos el corazón." },
            { speaker: "Pueblo", text: "Lo tenemos levantado hacia el Señor." },
            { speaker: "Sacerdote", text: "Demos gracias al Señor, nuestro Dios." },
            { speaker: "Pueblo", text: "Es justo y necesario." }
          ]
        }
      },
      {
        title: { en: "Sanctus (Holy, Holy)", es: "Sanctus (Santo, Santo)" },
        posture: { en: "Kneeling", es: "De rodillas" },
        lines: {
          en: [
            { speaker: "All", text: "Holy, Holy, Holy Lord God of hosts. Heaven and earth are full of your glory. Hosanna in the highest. Blessed is he who comes in the name of the Lord. Hosanna in the highest." }
          ],
          es: [
            { speaker: "Todos", text: "Santo, Santo, Santo es el Señor, Dios del universo. Llenos están el cielo y la tierra de tu gloria. Hosanna en el cielo. Bendito el que viene en nombre del Señor. Hosanna en el cielo." }
          ]
        }
      },
      {
        title: { en: "Eucharistic Prayer & Consecration", es: "Plegaria Eucarística y Consagración" },
        posture: { en: "Kneeling", es: "De rodillas" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "TAKE THIS, ALL OF YOU, AND EAT OF IT, FOR THIS IS MY BODY, WHICH WILL BE GIVEN UP FOR YOU." },
            { speaker: "Celebrant", text: "TAKE THIS, ALL OF YOU, AND DRINK FROM IT, FOR THIS IS THE CHALICE OF MY BLOOD, THE BLOOD OF THE NEW AND ETERNAL COVENANT, WHICH WILL BE POURED OUT FOR YOU AND FOR MANY FOR THE FORGIVENESS OF SINS. DO THIS IN MEMORY OF ME." }
          ],
          es: [
            { speaker: "Sacerdote", text: "TOMEN Y COMAN TODOS DE ÉL, PORQUE ESTO ES MI CUERPO, QUE SERÁ ENTREGADO POR USTEDES." },
            { speaker: "Sacerdote", text: "TOMEN Y BEBAN TODOS DE ÉL, PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE, SANGRE DE LA ALIANZA NUEVA Y ETERNA, QUE SERÁ DERRAMADA POR USTEDES Y POR MUCHOS PARA EL PERDÓN DE LOS PECADOS. HAGAN ESTO EN CONMEMORACIÓN MÍA." }
          ]
        }
      },
      {
        title: { en: "The Memorial Acclamation", es: "Aclamación del Memorial" },
        posture: { en: "Kneeling", es: "De rodillas" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "The mystery of faith." },
            { speaker: "People", text: "We proclaim your Death, O Lord, and profess your Resurrection until you come again." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Éste es el Misterio de la fe." },
            { speaker: "Pueblo", text: "Anunciamos tu muerte, proclamamos tu resurrección. ¡Ven, Señor Jesús!" }
          ]
        }
      },
      {
        title: { en: "The Great Doxology", es: "Doxología Mayor (Por Cristo, con Él y en Él)" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Through him, and with him, and in him, O God, almighty Father, in the unity of the Holy Spirit, all glory and honor is yours, for ever and ever." },
            { speaker: "People", text: "Amen." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Por Cristo, con él y en él, a ti, Dios Padre omnipotente, en la unidad del Espíritu Santo, todo honor y toda gloria por los siglos de los siglos." },
            { speaker: "Pueblo", text: "¡Amén!" }
          ]
        }
      }
    ]
  },

  // ── SECCIÓN 4: RITO DE COMUNIÓN ──
  {
    title: {
      en: "The Communion Rite",
      es: "Rito de Comunión",
    },
    parts: [
      {
        title: { en: "Our Father", es: "Padre Nuestro" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "At the Savior's command and formed by divine teaching, we dare to say:" },
            { speaker: "All", text: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil." },
            { speaker: "Celebrant", text: "Deliver us, Lord, we pray, from every evil, graciously grant peace in our days, that, by the help of your mercy, we may be always free from sin and safe from all distress, as we await the blessed hope and the coming of our Savior, Jesus Christ." },
            { speaker: "People", text: "For the kingdom, the power and the glory are yours now and for ever." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Fieles a la recomendación del Salvador y siguiendo su divina enseñanza, nos atrevemos a decir:" },
            { speaker: "Todos", text: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal." },
            { speaker: "Sacerdote", text: "Líbranos de todos los males, Señor, y concédenos la paz en nuestros días, para que, ayudados por tu misericordia, vivamos siempre libres de pecado y protegidos de toda perturbación, mientras esperamos la gloriosa venida de nuestro Salvador Jesucristo." },
            { speaker: "Pueblo", text: "Tuyo es el reino, tuyo el poder y la gloria, por siempre, Señor." }
          ]
        }
      },
      {
        title: { en: "Sign of Peace", es: "El Saludo de la Paz" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Lord Jesus Christ, who said to your Apostles: Peace I leave you, my peace I give you, look not on our sins, but on the faith of your Church, and graciously grant her peace and unity in accordance with your will. Who live and reign for ever and ever." },
            { speaker: "People", text: "Amen." },
            { speaker: "Celebrant", text: "The peace of the Lord be with you always." },
            { speaker: "People", text: "And with your spirit." },
            { speaker: "Celebrant", text: "Let us offer each other the sign of peace." },
            { speaker: "People", text: "(Exchange peace) Peace be with you." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Señor Jesucristo, que dijiste a tus apóstoles: «La paz les dejo, mi paz les doy», no tengas en cuenta nuestros pecados, sino la fe de tu Iglesia y, conforme a tu palabra, concédele la paz y la unidad. Tú que vives y reinas por los siglos de los siglos." },
            { speaker: "Pueblo", text: "Amén." },
            { speaker: "Sacerdote", text: "La paz del Señor esté siempre con ustedes." },
            { speaker: "Pueblo", text: "Y con tu espíritu." },
            { speaker: "Sacerdote", text: "Dense fraternalmente la paz." },
            { speaker: "Pueblo", text: "(Dar la paz) La paz del Señor esté siempre con ustedes." }
          ]
        }
      },
      {
        title: { en: "Fractio Panis (Fraction of the Bread)", es: "Fracción del Pan (Mezcla en el Cáliz)" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Priest (quietly)", text: "May this mingling of the Body and Blood of our Lord Jesus Christ bring eternal life to us who receive it." }
          ],
          es: [
            { speaker: "Sacerdote (en secreto)", text: "El Cuerpo y la Sangre de nuestro Señor Jesucristo, unidos en este cáliz, sean para nosotros, que los recibimos, fuente de vida eterna." }
          ]
        }
      },
      {
        title: { en: "Agnus Dei (Lamb of God)", es: "Agnus Dei (Cordero de Dios)" },
        posture: { en: "Standing / Kneeling", es: "De pie / De rodillas" },
        lines: {
          en: [
            { speaker: "All", text: "Lamb of God, you take away the sins of the world, have mercy on us." },
            { speaker: "All", text: "Lamb of God, you take away the sins of the world, have mercy on us." },
            { speaker: "All", text: "Lamb of God, you take away the sins of the world, grant us peace." }
          ],
          es: [
            { speaker: "Todos", text: "Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros." },
            { speaker: "Todos", text: "Cordero de Dios, que quitas el pecado del mundo, ten piedad de nosotros." },
            { speaker: "Todos", text: "Cordero de Dios, que quitas el pecado del mundo, danos la paz." }
          ]
        }
      },
      {
        title: { en: "Priest Private Prayer Before Communion", es: "Oración Privada del Sacerdote Antes de Comulgar" },
        posture: { en: "Kneeling", es: "De rodillas" },
        lines: {
          en: [
            { speaker: "Priest (quietly)", text: "Lord Jesus Christ, Son of the living God, who, by the will of the Father and the work of the Holy Spirit, through your Death gave life to the world, free me by this, your most holy Body and Blood, from all my sins and from every evil; keep me always faithful to your commandments, and never let me be parted from you." }
          ],
          es: [
            { speaker: "Sacerdote (en secreto)", text: "Señor Jesucristo, Hijo de Dios vivo, que por voluntad del Padre y con la cooperación del Espíritu Santo, diste con tu muerte la vida al mundo, líbrame, por la recepción de tu Cuerpo y de tu Sangre, de todas mis culpas y de todo mal; concédeme cumplir siempre tus mandamientos y jamás permitas que me separe de ti." }
          ]
        }
      },
      {
        title: { en: "Reception of Holy Communion", es: "Invitación y Recepción de la Santa Comunión" },
        posture: { en: "Kneeling / Standing", es: "De rodillas / Procesión de pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Behold the Lamb of God, behold him who takes away the sins of the world. Blessed are those called to the supper of the Lamb." },
            { speaker: "People", text: "Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed." },
            { speaker: "Priest (quietly)", text: "May the Body of Christ keep me safe for eternal life." },
            { speaker: "Priest (quietly)", text: "May the Blood of Christ keep me safe for eternal life." },
            { speaker: "Celebrant", text: "The Body of Christ." },
            { speaker: "People", text: "Amen." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Éste es el Cordero de Dios, que quita el pecado del mundo. Dichosos los invitados a la cena del Señor." },
            { speaker: "Pueblo", text: "Señor, no soy digno de que entres en mi casa, pero una palabra tuya bastará para sanarme." },
            { speaker: "Sacerdote (en secreto)", text: "El Cuerpo de Cristo me guarde para la vida eterna." },
            { speaker: "Sacerdote (en secreto)", text: "La Sangre de Cristo me guarde para la vida eterna." },
            { speaker: "Sacerdote", text: "El Cuerpo de Cristo." },
            { speaker: "Pueblo", text: "Amén." }
          ]
        }
      },
      {
        title: { en: "Purification of the Sacred Vessels", es: "Purificación de los Vasos Sagrados" },
        posture: { en: "Sitting", es: "Sentados en silencio sagrado" },
        lines: {
          en: [
            { speaker: "Priest (quietly)", text: "What has passed our lips as food, O Lord, may we possess in purity of heart, that what has been given to us in time may be our healing for eternity." }
          ],
          es: [
            { speaker: "Sacerdote (en secreto)", text: "Haz, Señor, que recibamos con un corazón limpio el alimento corporal, y que lo que nos ha sido dado en el tiempo sea para nosotros remedio de eternidad." }
          ]
        }
      },
      {
        title: { en: "Prayer After Communion", es: "Oración Después de la Comunión" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Let us pray. (The priest pronounces the post-communion prayer of the day)... Through Christ our Lord." },
            { speaker: "People", text: "Amen." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Oremos. (El sacerdote pronuncia la oración después de la comunión del día)... Por Jesucristo, nuestro Señor." },
            { speaker: "Pueblo", text: "Amén." }
          ]
        }
      }
    ]
  },

  // ── SECCIÓN 5: RITOS CONCLUSIVOS ──
  {
    title: {
      en: "Concluding Rites",
      es: "Ritos Conclusivos",
    },
    parts: [
      {
        title: { en: "Final Blessing", es: "Bendición Final" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "The Lord be with you." },
            { speaker: "People", text: "And with your spirit." },
            { speaker: "Celebrant", text: "May almighty God bless you, the Father, and the Son, and the Holy Spirit." },
            { speaker: "People", text: "Amen." }
          ],
          es: [
            { speaker: "Sacerdote", text: "El Señor esté con ustedes." },
            { speaker: "Pueblo", text: "Y con tu espíritu." },
            { speaker: "Sacerdote", text: "La bendición de Dios todopoderoso, Padre, Hijo y Espíritu Santo, descienda sobre ustedes y permanezca para siempre." },
            { speaker: "Pueblo", text: "Amén." }
          ]
        }
      },
      {
        title: { en: "The Dismissal", es: "La Despedida y Envío" },
        posture: { en: "Standing", es: "De pie" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Go forth, the Mass is ended. (or: Go in peace, glorifying the Lord by your life)." },
            { speaker: "People", text: "Thanks be to God." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Pueden ir en paz. (o: Vayan a glorificar al Señor con su vida)." },
            { speaker: "Pueblo", text: "Demos gracias a Dios." }
          ]
        }
      }
    ]
  }
];
