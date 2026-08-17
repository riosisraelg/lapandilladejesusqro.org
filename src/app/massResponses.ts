export interface MassResponseLine {
  speaker: string;
  text: string;
}

export interface MassResponsePart {
  title: {
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

export const massResponses: MassResponseSection[] = [
  {
    title: {
      en: "Introductory Rites",
      es: "Ritos Iniciales",
    },
    parts: [
      {
        title: { en: "The Greeting", es: "El Saludo" },
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
        title: { en: "The Gloria", es: "El Gloria" },
        lines: {
          en: [
            { speaker: "All", text: "Glory to God in the highest, and on earth peace to people of good will. We praise you, we bless you, we adore you, we glorify you, we give you thanks for your great glory, Lord God, heavenly King, O God, almighty Father. Lord Jesus Christ, Only Begotten Son, Lord God, Lamb of God, Son of the Father, you take away the sins of the world, have mercy on us; you take away the sins of the world, receive our prayer; you are seated at the right hand of the Father, have mercy on us. For you alone are the Holy One, you alone are the Lord, you alone are the Most High, Jesus Christ, with the Holy Spirit, in the glory of God the Father. Amen." }
          ],
          es: [
            { speaker: "Todos", text: "Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Señor. Por tu inmensa gloria te alabamos, te bendecimos, te adoramos, te glorificamos, te damos gracias, Señor Dios, Rey celestial, Dios Padre todopoderoso. Señor, Hijo único, Jesucristo; Señor Dios, Cordero de Dios, Hijo del Padre; tú que quitas el pecado del mundo, ten piedad de nosotros; tú que quitas el pecado del mundo, atiende nuestra súplica; tú que estás sentado a la derecha del Padre, ten piedad de nosotros; porque sólo tú eres Santo, sólo tú Señor, sólo tú Altísimo, Jesucristo, con el Espíritu Santo en la gloria de Dios Padre. Amén." }
          ]
        }
      }
    ]
  },
  {
    title: {
      en: "Liturgy of the Eucharist",
      es: "Liturgia Eucarística"
    },
    parts: [
      {
        title: { en: "The Offertory", es: "El Ofertorio" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Pray, brethren (brothers and sisters), that my sacrifice and yours may be acceptable to God, the almighty Father." },
            { speaker: "People", text: "May the Lord accept the sacrifice at your hands for the praise and glory of his name, for our good and the good of all his holy Church." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Orad, hermanos, para que este sacrificio, mío y vuestro, sea agradable a Dios, Padre todopoderoso." },
            { speaker: "Pueblo", text: "El Señor reciba de tus manos este sacrificio, para alabanza y gloria de su nombre, para nuestro bien y el de toda su santa Iglesia." }
          ]
        }
      },
      {
        title: { en: "The Preface Dialogue", es: "Diálogo del Prefacio" },
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
            { speaker: "Sacerdote", text: "El Señor esté con vosotros." },
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
        title: { en: "The Memorial Acclamation", es: "Aclamación del Memorial" },
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
      }
    ]
  },
  {
    title: {
      en: "The Communion Rite",
      es: "Rito de Comunión"
    },
    parts: [
      {
        title: { en: "Our Father", es: "Padre Nuestro" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "At the Savior's command and formed by divine teaching, we dare to say:" },
            { speaker: "All", text: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil." },
            { speaker: "Celebrant", text: "Deliver us, Lord, we pray, from every evil..." },
            { speaker: "People", text: "For the kingdom, the power and the glory are yours now and for ever." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Fieles a la recomendación del Salvador y siguiendo su divina enseñanza, nos atrevemos a decir:" },
            { speaker: "Todos", text: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal." },
            { speaker: "Sacerdote", text: "Líbranos de todos los males, Señor..." },
            { speaker: "Pueblo", text: "Tuyo es el reino, tuyo el poder y la gloria, por siempre, Señor." }
          ]
        }
      },
      {
        title: { en: "Sign of Peace", es: "El Saludo de la Paz" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "The peace of the Lord be with you always." },
            { speaker: "People", text: "And with your spirit." },
            { speaker: "Celebrant", text: "Let us offer each other the sign of peace." },
            { speaker: "People", text: "(Offer peace) Peace be with you." }
          ],
          es: [
            { speaker: "Sacerdote", text: "La paz del Señor esté siempre con vosotros." },
            { speaker: "Pueblo", text: "Y con tu espíritu." },
            { speaker: "Sacerdote", text: "Daos fraternalmente la paz." },
            { speaker: "Pueblo", text: "(Dar la paz) La paz del Señor esté siempre con vosotros." }
          ]
        }
      },
      {
        title: { en: "Agnus Dei (Lamb of God)", es: "Agnus Dei (Cordero de Dios)" },
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
        title: { en: "Reception of Communion", es: "Recepción de la Comunión" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Behold the Lamb of God, behold him who takes away the sins of the world. Blessed are those called to the supper of the Lamb." },
            { speaker: "People", text: "Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed." },
            { speaker: "Celebrant", text: "The Body of Christ." },
            { speaker: "People", text: "Amen." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Éste es el Cordero de Dios, que quita el pecado del mundo. Dichosos los invitados a la cena del Señor." },
            { speaker: "Pueblo", text: "Señor, no soy digno de que entres en mi casa, pero una palabra tuya bastará para sanarme." },
            { speaker: "Sacerdote", text: "El Cuerpo de Cristo." },
            { speaker: "Pueblo", text: "Amén." }
          ]
        }
      }
    ]
  },
  {
    title: {
      en: "Concluding Rites",
      es: "Ritos de Conclusión"
    },
    parts: [
      {
        title: { en: "Final Blessing", es: "Bendición Final" },
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
            { speaker: "Sacerdote", text: "La bendición de Dios todopoderoso, Padre, Hijo y Espíritu Santo, descienda sobre vosotros." },
            { speaker: "Pueblo", text: "Amén." }
          ]
        }
      },
      {
        title: { en: "The Dismissal", es: "La Despedida" },
        lines: {
          en: [
            { speaker: "Celebrant", text: "Go forth, the Mass is ended." },
            { speaker: "People", text: "Thanks be to God." }
          ],
          es: [
            { speaker: "Sacerdote", text: "Podéis ir en paz." },
            { speaker: "Pueblo", text: "Demos gracias a Dios." }
          ]
        }
      }
    ]
  }
];
