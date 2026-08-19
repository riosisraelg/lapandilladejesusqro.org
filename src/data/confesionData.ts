/**
 * Base de Datos Oficial para la Guía Práctica del Sacramento de la Confesión
 * Fuente: Basílica Beatae Mariae Virginis del Pueblito / Parroquia de La Sagrada Familia
 * Soporte Bilingüe Canónico Completo (Español / English)
 */

export interface ConfessionStep {
  number: number;
  title: { es: string; en: string };
  summary: { es: string; en: string };
  inPersonaChristi?: { es: string; en: string };
  qualities?: Array<{
    name: { es: string; en: string };
    desc: { es: string; en: string };
    icon: string;
  }>;
  pastoralNote?: { es: string; en: string };
}

export interface ExamenMandamiento {
  number: number;
  title: { es: string; en: string };
  faltas: { es: string[]; en: string[] };
}

export interface MandamientoIglesia {
  number: number;
  title: { es: string; en: string };
  desc: { es: string; en: string };
}

export interface PecadoCapital {
  number: number;
  name: { es: string; en: string };
  definition: { es: string; en: string };
  manifestations: { es: string[]; en: string[] };
  icon: string;
}

export interface ConfesionData {
  header: {
    title: { es: string; en: string };
    subtitle: { es: string; en: string };
    biblicalQuote: {
      text: { es: string; en: string };
      ref: string;
    };
    sanctuaryContext: {
      title: { es: string; en: string };
      text: { es: string; en: string };
    };
  };
  oracionPreparatoria: {
    title: { es: string; en: string };
    text: { es: string; en: string };
  };
  cincoPasos: ConfessionStep[];
  examenMandamientos: ExamenMandamiento[];
  mandamientosIglesia: {
    title: { es: string; en: string };
    warning: { es: string; en: string };
    items: MandamientoIglesia[];
  };
  pecadosCapitales: {
    title: { es: string; en: string };
    items: PecadoCapital[];
  };
  oracionFinal: {
    title: { es: string; en: string };
    text: { es: string; en: string };
  };
  sello: {
    es: string;
    en: string;
  };
}

export const CONFESION_DATA: ConfesionData = {
  header: {
    title: {
      es: "Guía Práctica para el Sacramento de la Confesión",
      en: "Practical Guide to the Sacrament of Reconciliation (Confession)"
    },
    subtitle: {
      es: "Bienvenido al encuentro con la Misericordia de Dios",
      en: "Welcome to the Encounter with God's Infinite Mercy"
    },
    biblicalQuote: {
      text: {
        es: "«Yo te daré las llaves del Reino de los cielos. Todo lo que ates en la tierra, quedará atado en el cielo, y todo lo que desates en la tierra, quedará desatado en el cielo.»",
        en: "«I will give you the keys of the Kingdom of Heaven. Whatever you bind on earth will be bound in heaven, and whatever you loose on earth will be loosed in heaven.»"
      },
      ref: "Mt. 16, 19"
    },
    sanctuaryContext: {
      title: {
        es: "Capilla de la Reconciliación",
        en: "Chapel of Reconciliation"
      },
      text: {
        es: "Estás en la Capilla de la Reconciliación, espacio sagrado, que por su naturaleza, ofrece las condiciones para vivir el Sacramento de la Reconciliación, procurar el ambiente de reconocimiento, guardando silencio.",
        en: "You are in the Chapel of Reconciliation, a sacred space designed to foster an atmosphere of quiet reflection, prayerful silence, and encounter with God's mercy."
      }
    }
  },

  oracionPreparatoria: {
    title: {
      es: "Oración Preparatoria",
      en: "Preparatory Prayer"
    },
    text: {
      es: "Ven Espíritu Santo, ilumina mi mente y mi corazón para que pueda reconocer mis pecados, mueve mi conciencia al dolor sincero, ayúdame a hacer una buena confesión. Santa María, Madre de Dios, ruega por mí que soy un pecador. Amén.",
      en: "Come, Holy Spirit, enlighten my mind and my heart so that I may recognize my sins, move my conscience to sincere sorrow, and help me to make a good confession. Holy Mary, Mother of God, pray for me, a sinner. Amen."
    }
  },

  cincoPasos: [
    {
      number: 1,
      title: {
        es: "1. Examen de Conciencia",
        en: "1. Examination of Conscience"
      },
      summary: {
        es: "Esfuerzo sincero de recordar todos y cada uno de los pecados cometidos con pensamientos, palabras, obras y omisiones.",
        en: "A sincere effort to recall each and every sin committed through thoughts, words, actions, and omissions."
      }
    },
    {
      number: 2,
      title: {
        es: "2. Dolor de los Pecados",
        en: "2. Contrition (Sorrow for Sins)"
      },
      summary: {
        es: "Reconocer con dolor de corazón que ante todo se ha ofendido a Dios que nos ama tanto y es infinitamente bueno.",
        en: "Heartfelt sorrow for having offended God, who loves us so deeply and is infinitely good and worthy of all our love."
      }
    },
    {
      number: 3,
      title: {
        es: "3. Propósito de no volver a pecar",
        en: "3. Firm Purpose of Amendment"
      },
      summary: {
        es: "La simple y sincera determinación de evitar el pecado y las ocasiones próximas de pecar por amor a Dios.",
        en: "The simple and firm resolve to avoid future sin and near occasions of sin out of love for God."
      }
    },
    {
      number: 4,
      title: {
        es: "4. Decir los pecados al Sacerdote",
        en: "4. Confession of Sins to the Priest"
      },
      summary: {
        es: "El Sacerdote es instrumento de la Misericordia de Dios, que actúa In Persona Christi, es decir, en la misma persona de Cristo quien te perdona los pecados.",
        en: "The Priest is an instrument of God's Mercy acting In Persona Christi (in the person of Christ), who grants you sacramental absolution and pardon."
      },
      inPersonaChristi: {
        es: "Tres reglas de oro para confesar tus pecados:",
        en: "Three golden rules for confessing your sins:"
      },
      qualities: [
        {
          name: { es: "CONCISA", en: "CONCISE" },
          desc: {
            es: "Ir al punto, sin detalles innecesarios ni justificar o excusar los pecados.",
            en: "Get straight to the point without unnecessary details or making excuses."
          },
          icon: "🎯"
        },
        {
          name: { es: "CLARA", en: "CLEAR" },
          desc: {
            es: "Expresar los pecados de forma comprensible, sin rodeos ni ambigüedades.",
            en: "State your sins plainly, without beating around the bush or ambiguity."
          },
          icon: "💡"
        },
        {
          name: { es: "COMPLETA", en: "COMPLETE" },
          desc: {
            es: "No omitir voluntariamente ningún pecado grave, confesando todo lo que la conciencia recuerda.",
            en: "Never deliberately conceal a mortal sin, confessing all that conscience recalls."
          },
          icon: "🕊️"
        }
      ],
      pastoralNote: {
        es: "Ten en cuenta que la Confesión no es una charla, pero si necesitas explicar de manera detallada algunos aspectos de tu vida que te llevan al pecado, puedes solicitar Acompañamiento espiritual, el cual se ofrece en la oficina de la Basílica de lunes a viernes de 10:00 am a 2:00 pm.",
        en: "Please note that Confession is not a counseling session. If you need in-depth spiritual direction, you may request Spiritual Accompaniment at the Basilica/Parish office (Monday to Friday, 10:00 am to 2:00 pm)."
      }
    },
    {
      number: 5,
      title: {
        es: "5. Cumplir la Penitencia",
        en: "5. Satisfaction (Doing Penance)"
      },
      summary: {
        es: "Cumplirla cuanto antes con humildad y dolor en desagravio, reparación y satisfacción de la culpa contraída al ofender a Dios.",
        en: "Perform the assigned penance promptly with humility, in reparation and thanksgiving to God."
      }
    }
  ],

  examenMandamientos: [
    {
      number: 1,
      title: {
        es: "1º. Amarás a Dios sobre todas las cosas",
        en: "1st. You shall love the Lord your God above all things"
      },
      faltas: {
        es: [
          "¿Creo en amuletos, supersticiones, horóscopos, tarot, lectura de cartas o de manos?",
          "¿Doy más importancia al trabajo, al estudio, al deporte, al descanso, a las diversiones antes que a Dios, faltando a Misa el domingo que es el Día del Señor?",
          "¿Me olvido de orar en la mañana, en la noche, al inicio del trabajo, antes de comer?",
          "¿Me avergüenzo de la fe, de la religión o de la Iglesia ante los demás?"
        ],
        en: [
          "Have I engaged in superstition, amulets, horoscopes, tarot, or fortune-telling?",
          "Have I put work, sports, entertainment, or rest before God, missing Sunday Mass?",
          "Have I neglected daily prayer in the morning, night, or before meals?",
          "Have I been ashamed of my Catholic faith or denied it before others?"
        ]
      }
    },
    {
      number: 2,
      title: {
        es: "2º. No tomarás el Nombre de Dios en vano",
        en: "2nd. You shall not take the name of the Lord your God in vain"
      },
      faltas: {
        es: [
          "¿Uso el nombre de Dios, de Jesús o de la Virgen María sin respeto o con ligereza?",
          "¿He jurado sin necesidad, o poniendo a Dios por testigo de una mentira?",
          "¿He faltado a alguna promesa o compromiso hecho ante Dios o la Iglesia?"
        ],
        en: [
          "Have I used the holy name of God, Jesus, or Mary disrespectfully or in anger?",
          "Have I sworn falsely or taken unnecessary oaths using God's name?",
          "Have I broken solemn promises or vows made to God or the Church?"
        ]
      }
    },
    {
      number: 3,
      title: {
        es: "3º. Santificarás las fiestas",
        en: "3rd. Remember to keep holy the Lord's Day"
      },
      faltas: {
        es: [
          "¿He faltado a Misa los domingos o días de precepto por flojera o por darle más importancia a otras actividades, personas o cosas?",
          "¿He llegado tarde a Misa por descuido o salgo antes de que el sacerdote dé la bendición final?",
          "¿He vivido el domingo como un día de descanso cristiano, oración y encuentro familiar?"
        ],
        en: [
          "Have I missed Holy Mass on Sundays or Holy Days of Obligation through laziness or worldly pursuits?",
          "Have I arrived late or left Mass early without a grave reason?",
          "Have I respected Sunday as a day of prayer, rest, and family communion?"
        ]
      }
    },
    {
      number: 4,
      title: {
        es: "4º. Honrarás a tu padre y a tu madre",
        en: "4th. Honor your father and your mother"
      },
      faltas: {
        es: [
          "¿He desobedecido, insultado o mentido a mis padres?",
          "¿Les falto al respeto, les causo tristeza, amargura o malestar con mi conducta?",
          "¿No he ayudado a mis padres en sus necesidades materiales, de salud o afectivas?",
          "¿No les visito, no les muestro gratitud ni oro por ellos?"
        ],
        en: [
          "Have I disrespected, lied to, or disobeyed my parents?",
          "Have I caused them sorrow, grief, or distress through my attitude?",
          "Have I neglected to assist them in their material, health, or emotional needs?",
          "Do I fail to visit them, show genuine gratitude, or pray for them?"
        ]
      }
    },
    {
      number: 5,
      title: {
        es: "5º. No matarás",
        en: "5th. You shall not kill"
      },
      faltas: {
        es: [
          "¿He deseado el mal o la muerte de alguien?",
          "¿Expongo mi vida y salud sin necesidad con imprudencias o vicios?",
          "¿He causado daño a otros en su persona, reputación o en sus cosas?",
          "¿He peleado, insultado, guardado rencor o maltratado física o verbalmente a otros?",
          "¿He perjudicado mi salud con excesos de alcohol, drogas o desórdenes?",
          "¿He dañado la vida de otros o aconsejado, apoyado o practicado el aborto?"
        ],
        en: [
          "Have I wished harm, vengeance, or death upon anyone?",
          "Have I endangered my life or health through reckless behavior or vices?",
          "Have I physically or verbally assaulted, insulted, or abused others?",
          "Have I harmed my body with drugs, drunkenness, or unhealthy excesses?",
          "Have I counseled, aided, or procured an abortion, or degraded human life?"
        ]
      }
    },
    {
      number: 6,
      title: {
        es: "6º. No cometerás actos impuros",
        en: "6th. You shall not commit adultery"
      },
      faltas: {
        es: [
          "¿He pensado, visto o compartido cosas deshonestas en internet o redes?",
          "¿He visto pornografía en cualquier medio?",
          "¿He cometido actos impuros solo (masturbación) o con otros?",
          "¿He tenido relaciones sexuales fuera del santo matrimonio?"
        ],
        en: [
          "Have I viewed, sought, or shared indecent content or pornography?",
          "Have I engaged in impure solitary acts (masturbation)?",
          "Have I engaged in sexual relations outside of sacramental marriage?"
        ]
      }
    },
    {
      number: 7,
      title: {
        es: "7º. No robarás",
        en: "7th. You shall not steal"
      },
      faltas: {
        es: [
          "¿He robado, dañado o tomado cosas ajenas sin el debido permiso?",
          "¿He retenido bienes ajenos o no he devuelto lo prestado o encontrado?",
          "¿He perdido el tiempo deliberadamente en el trabajo o en el estudio?",
          "¿No he sido honesto y justo en la administración de bienes, dinero, negocios o en el comercio?"
        ],
        en: [
          "Have I stolen, damaged, or taken property that does not belong to me?",
          "Have I wasted time paid for by my employer or cheated in studies?",
          "Have I been dishonest in financial dealings, debts, or business affairs?"
        ]
      }
    },
    {
      number: 8,
      title: {
        es: "8º. No levantarás falso testimonio ni mentirás",
        en: "8th. You shall not bear false witness against your neighbor"
      },
      faltas: {
        es: [
          "¿He dicho mentiras?",
          "¿He murmurado, criticado o calumniado sin fundamento la fama del prójimo?",
          "¿He hablado mal de alguien a sus espaldas (chismes)?",
          "¿He divulgado faltas, errores o pecados íntimos ajenos?",
          "¿He sembrado discordia, odio, divisiones o rencillas en mi familia o grupo?"
        ],
        en: [
          "Have I told lies or deceived others?",
          "Have I engaged in gossip, slander, or ruined someone's good reputation?",
          "Have I revealed secret faults of others without a grave and just cause?",
          "Have I sown discord, bitterness, division, or malice among brothers?"
        ]
      }
    },
    {
      number: 9,
      title: {
        es: "9º. No consentirás pensamientos ni deseos impuros",
        en: "9th. You shall not covet your neighbor's wife"
      },
      faltas: {
        es: [
          "¿He consentido deliberadamente pensamientos o deseos impuros?",
          "¿He cometido adulterio de pensamiento o de acción?",
          "¿He pretendido a una persona casada o comprometida?"
        ],
        en: [
          "Have I deliberately entertained lustful, unchaste thoughts or desires?",
          "Have I committed adultery in thought or affection?",
          "Have I pursued or enticed someone who is married or consecrated?"
        ]
      }
    },
    {
      number: 10,
      title: {
        es: "10º. No codiciarás los bienes ajenos",
        en: "10th. You shall not covet your neighbor's goods"
      },
      faltas: {
        es: [
          "¿He tenido envidia del éxito, bienes o cualidades de los demás?",
          "¿He deseado el mal a otros por no tener lo que ellos tienen?",
          "¿Pretendo poseer bienes por ambición desmedida, siendo injusto con el prójimo?",
          "¿He sido avaricioso, apegado al dinero o egoísta con el necesitado?"
        ],
        en: [
          "Have I harbored jealousy or envy over other people's blessings, gifts, or wealth?",
          "Have I acted with greed, selfish attachment to money, or ambition that harms others?",
          "Have I refused to be generous and help those in real need?"
        ]
      }
    }
  ],

  mandamientosIglesia: {
    title: {
      es: "Mandamientos de la Santa Madre Iglesia",
      en: "Precepts of the Holy Mother Church"
    },
    warning: {
      es: "Es pecado grave no cumplirlos",
      en: "It is a serious sin to neglect these duties"
    },
    items: [
      {
        number: 1,
        title: {
          es: "1º Participar en MISA entera los Domingos y Fiestas de guardar",
          en: "1st Attend Holy Mass on Sundays and Holy Days of Obligation"
        },
        desc: {
          es: "Santificar el Día del Señor y descansar de los trabajos serviles.",
          en: "Keep holy the Lord's Day through Eucharistic participation and rest."
        }
      },
      {
        number: 2,
        title: {
          es: "2º CONFESARSE cuando menos una vez al año o en peligro de muerte",
          en: "2nd Confess your sins at least once a year"
        },
        desc: {
          es: "O siempre que se haya de comulgar y se tenga conciencia de pecado mortal.",
          en: "And whenever conscious of mortal sin before receiving Holy Communion."
        }
      },
      {
        number: 3,
        title: {
          es: "3º COMULGAR por lo menos una vez al año, por Pascua de Resurrección",
          en: "3rd Receive the Sacrament of the Eucharist at least during Easter season"
        },
        desc: {
          es: "Preparados adecuadamente en estado de gracia santificante.",
          en: "Duly prepared in a state of grace and proper Eucharistic fast."
        }
      },
      {
        number: 4,
        title: {
          es: "4º AYUNAR y abstenerse de comer carne cuando lo manda la Iglesia",
          en: "4th Fast and abstain from meat on designated days"
        },
        desc: {
          es: "Especialmente el Miércoles de Ceniza y el Viernes Santo, practicando la penitencia en Cuaresma.",
          en: "Especially on Ash Wednesday and Good Friday, uniting penance with Christ."
        }
      },
      {
        number: 5,
        title: {
          es: "5º Aportar el DIEZMO y ayudar a la Iglesia en sus necesidades",
          en: "5th Provide for the material needs of the Church"
        },
        desc: {
          es: "Contribuir generosamente al sostenimiento del culto, clero y obras de caridad para los pobres.",
          en: "Contribute according to one's means to divine worship, clergy, and charity."
        }
      }
    ]
  },

  pecadosCapitales: {
    title: {
      es: "Los 7 Pecados Capitales y sus Manifestaciones",
      en: "The 7 Capital Sins and Their Manifestations"
    },
    items: [
      {
        number: 1,
        name: { es: "1° SOBERBIA", en: "1st PRIDE" },
        definition: {
          es: "Amor desordenado de nuestra propia excelencia. Pensar sólo en uno mismo y en los propios intereses.",
          en: "An disordered love of one's own excellence. Putting self above God and others."
        },
        manifestations: {
          es: [
            "Vanidad: preocupación excesiva por el modo de vestir, por el físico, los adornos o la apariencia.",
            "Orgullo: egoísmo, autosuficiencia y vanagloria.",
            "Hipocresía: fingir virtudes o cualidades que no se tienen para ser alabado."
          ],
          en: [
            "Vanity: excessive concern for appearance, fashion, and social praise.",
            "Arrogance: self-centeredness, refusal to submit to truth or authority.",
            "Hypocrisy: pretending virtue or righteousness for public approval."
          ]
        },
        icon: "👑"
      },
      {
        number: 2,
        name: { es: "2° AVARICIA", en: "2nd GREED (AVARICE)" },
        definition: {
          es: "Amor desordenado de los bienes materiales y del dinero.",
          en: "Inordinate love and craving for material possessions and riches."
        },
        manifestations: {
          es: [
            "Adquirir bienes por medios ilícitos o injustos.",
            "Ambición desmedida y tacañería.",
            "No ayudar al necesitado cuando se tiene la posibilidad de hacerlo."
          ],
          en: [
            "Acquiring wealth through dishonest or unfair means.",
            "Stinginess and refusal to share with those in distress.",
            "Hardening one's heart against the poor."
          ]
        },
        icon: "💰"
      },
      {
        number: 3,
        name: { es: "3º LUJURIA", en: "3rd LUST" },
        definition: {
          es: "Apetito desordenado de deleites carnales y placeres sexuales fuera de la voluntad de Dios.",
          en: "Disordered desire for sexual pleasures outside of God's holy order."
        },
        manifestations: {
          es: [
            "Ver y consultar lo que enseñan el 6º y 9º Mandamientos de la Ley de Dios (pornografía, relaciones ilícitas, actos impuros)."
          ],
          en: [
            "See 6th and 9th Commandments (pornography, unchaste acts, premarital or extramarital sex)."
          ]
        },
        icon: "🔥"
      },
      {
        number: 4,
        name: { es: "4° IRA", en: "4th WRATH (ANGER)" },
        definition: {
          es: "Acaloramiento desmedido del ánimo o deseo de venganza.",
          en: "Uncontrolled emotional fury, malice, and desire for revenge."
        },
        manifestations: {
          es: [
            "Odio, rencor acumulado y resentimiento.",
            "Mala voluntad hacia el prójimo.",
            "Negarse a perdonar ofensas y buscar hacer pagar el daño recibido."
          ],
          en: [
            "Holding grudges, bitterness, and hatred toward others.",
            "Refusing to forgive and pray for those who hurt us.",
            "Violent outbursts and verbal attacks."
          ]
        },
        icon: "⚡"
      },
      {
        number: 5,
        name: { es: "5° GULA", en: "5th GLUTTONY" },
        definition: {
          es: "Apetito desordenado e insaciable en el comer y el beber.",
          en: "Inordinate indulgence and lack of temperance in food and drink."
        },
        manifestations: {
          es: [
            "Embriagarse o consumir sustancias perjudiciales.",
            "Invitar o incitar a otros a este vicio y descontrol.",
            "Comer con desmedida ansiedad sin gratitud."
          ],
          en: [
            "Drunkenness and substance abuse.",
            "Pressuring others to overindulge or drink excessively.",
            "Wasting food and neglecting self-control."
          ]
        },
        icon: "🍷"
      },
      {
        number: 6,
        name: { es: "6° ENVIDIA", en: "6th ENVY" },
        definition: {
          es: "Pesar y tristeza por el bien ajeno, anhelándolo egoístamente como bien propio.",
          en: "Sorrow at another's good fortune or success, viewing it as a personal loss."
        },
        manifestations: {
          es: [
            "Deseo desordenado por los bienes, talentos y cualidades del otro.",
            "Alegrarse del fracaso, desdicha o caída de alguien.",
            "Desacreditar los logros ajenos por celos."
          ],
          en: [
            "Resentment toward the gifts, talents, and prosperity of neighbors.",
            "Rejoicing in another's misfortune or downfall.",
            "Speaking ill of someone to diminish their praise."
          ]
        },
        icon: "👁️"
      },
      {
        number: 7,
        name: { es: "7° PEREZA", en: "7th SLOTH" },
        definition: {
          es: "Decaimiento del ánimo en el buen obrar y negligencia en los deberes espirituales y temporales.",
          en: "Sluggishness in spiritual duty, duty of state, and avoidance of effort in virtue."
        },
        manifestations: {
          es: [
            "Flojera, pérdida deliberada de tiempo y ociosidad.",
            "No cumplir con las obligaciones de la propia vocación, trabajo o estudio.",
            "Procrastinar constantemente lo que se debe hacer hoy.",
            "Pereza espiritual: tibieza y descuido de la oración y los sacramentos."
          ],
          en: [
            "Habitual procrastination and laziness.",
            "Neglecting professional, academic, and family duties.",
            "Spiritual apathy: neglecting prayer, confession, and the sacraments."
          ]
        },
        icon: "⏳"
      }
    ]
  },

  oracionFinal: {
    title: {
      es: "Oración Final (Acto de Sincero Arrepentimiento)",
      en: "Final Prayer (Act of Sincere Contrition)"
    },
    text: {
      es: "Señor Jesús, me arrepiento sinceramente de haberte ofendido, porque eres infinitamente bueno, padeciste y moriste por mí clavado en la cruz, te amo con todo el corazón —y si no fuere cierto, concédeme que lo sea—, me propongo firmemente con tu ayuda y gracia no volver a pecar. Amén.",
      en: "Lord Jesus, I am heartily sorry for having offended Thee, because Thou art infinitely good, and didst suffer and die for me upon the cross. I love Thee with all my heart—and if my love be weak, grant that it may be true—and I firmly resolve, with the help of Thy divine grace, never to sin again. Amen."
    }
  },

  sello: {
    es: "BASÍLICA BEATAE MARIAE VIRGINIS DEL PUEBLITO · QUERÉTARO",
    en: "BASILICA BEATAE MARIAE VIRGINIS OF EL PUEBLITO · QUERÉTARO"
  }
};
