const fs = require('fs');
const filePath = 'src/app/LandingClient.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find start and end indices
const startIndex = content.indexOf('  {\n    id: "ven_senor_jesus",');
const endIndex = content.indexOf('  {\n    id: "agradecimiento",');

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find the block to replace.");
  process.exit(1);
}

const newSongs = `  {
    id: "gloria_martin_valverde",
    title: "Gloria",
    artist: "Martín Valverde",
    lyrics: \`Gloria, Gloria,
Gloria, Gloria.

a Jesús el Señor,
al Cordero de Dios.
Al Nombre sobre todo nombre. (x2)

Gloria, Glo- ria,
Gloria, Glo- ria,

a Jesús el Señor,
al Cordero de Dios.
Al Nombre sobre todo nombre. (x2)

Al Nombre sobre
todo nombre.\`
  },
  {
    id: "espiritu_santo_athenas",
    title: "Espíritu Santo",
    artist: "Athenas",
    lyrics: \`Espíritu de Dios, Espíritu Santo
Espíritu de Dios, Espíritu Santo
Mi alma tiene sed de Ti,
mi alma tiene sed
X2

Espíritu Santo ven a arder
Derrama tu fuego y tu poder
Actúa en mí
Actúa en mí
Actúa en mí
X2

Espíritu de Dios, Espíritu Santo
Espíritu de Dios, Espíritu Santo\`
  },
  {
    id: "ganarte_a_ti_tuyo",
    title: "Ganarte a Ti",
    artist: "Tuyo",
    lyrics: \`Miro a la cruz como un loco enamorado
Y no puedo resistirme a preguntar
Por qué te diste Jesús por mis pecados
Por qué quisiste salvarme así

Tú has querido contar conmigo
Aún sabiendo como soy
Sé que me miras con paciencia y con cariño
Esperando a que lo deje todo por Ti

Te lo entrego todo,
todo lo que tengo es para Ti
Te lo entrego todo Jesús,
todo lo que soy es para Ti

Te lo entrego todo,
todo lo que tengo es para Ti
Te lo entrego todo,
todo lo que soy es para Ti

De nada sirve la vida,
si no la vivo contigo
De nada sirve ganar el mundo
si te pierdo a Ti

De nada sirve la vida,
si no la vivo contigo
De nada sirve ganar el mundo
si te pierdo a Ti

Ya no quiero nada
que no venga de Ti
No me interesa nada
que no salga de Ti
No hay nada en este mundo
que se compare a Ti
Lo perdería todo por ganarte a Ti

Ya no quiero nada
que no venga de Ti
No me interesa nada
que no salga de Ti
No hay nada en este mundo
que se compare a Ti
Lo dejaría todo
Por ganarte a Ti
Lo dejaría todo
Por ganarte a Ti
Tu eres mi tesoro, Jesús

De nada sirve mi vida,
si no la vivo contigo
De nada sirve ganar el mundo
si te pierdo a Ti

Sabiendo todo lo que me puedes dar,
cómo me voy a conformar con el mundo.\`
  },
  {
    id: "nada_hakuna",
    title: "Nada",
    artist: "Hakuna",
    lyrics: \`Deja de herirte
Deja de poner en mi boca
Palabras que nunca dije

Deja de pensar que estoy enfadado
Deja de decir
Que soy yo el que se está
Alejando de ti

Y es que no lo ves
Me entrego por ti
Una y otra vez
Tú siempre serás mi favorita

Nunca te dejaré
Nunca te dejaré

Y es que no hay nada
Nada, nada, nada
Que puedas hacer
Para que te deje de querer

Y es que no hay nada
Hagas lo que hagas
Por favor
Deja de decir
Que no eres amada por mí

No hay nada en tu alma
Que haga que en ti
Deje de pensar

Estos muros que te destrozan
Son entre tú y tu libertad
Házme caso hija mía
Yo solo quiero verte feliz

Tú siempre tendrás mi perdón
Te falta perdonarte a ti

Y es que no hay nada
Nada, nada, nada
Que puedas hacer
Para que te deje de querer

Y es que no hay nada
Hagas lo que hagas
Por favor
Deja de decir
Que no eres amada por mí

Y es que aunque peques y me cambies
Por las cosas terrenales
Aunque te alejes y me olvides
Y me borres de tu planes
Aunque te rindas y te caigas
Y no sepas levantarte
Si estás perdido pide ayuda (X 2)

Y es que no hay nada
Nada, nada, nada
Que puedas hacer
Para que te deje de querer

Y es que no hay nada
Hagas lo que hagas
Por favor
Deja de decir
Que no eres amada por mí.\`
  },
  {
    id: "tu_el_unico_rey_tuyo",
    title: "TÚ el único REY",
    artist: "tuyo",
    lyrics: \`Tú, el Único Rey que tiene que reinar
El Único Señor al que voy a alabar
Hoy levanto el corazón al que lo conquistó
Simplemente porque Tú eres Dios

Y a Ti, toda la alabanza
Todo el poder y el honor
Toda la gloria al Señor (x3)

Tú, el Único Rey que tiene que reinar
El Único Señor al que voy a alabar
Hoy levanto el corazón al que lo conquistó
Simplemente porque Tú eres Dios (x2)\`
  },
  {
    id: "consagracion_a_maria",
    title: "Consagración a María",
    artist: "Oración",
    lyrics: \`Oh Señora mía,
Oh Madre mía,
Yo me ofrezco todo a ti,
Y en prueba de mi filial afecto,
Te consagro en este día,
Mis ojos,
Mis oídos,
Mi lengua,
Y mi corazón,
En una palabra,
Todo mi ser.
Ya que soy todo tuyo,
Oh Madre de bondad,
Guárdame, defiéndeme,
Y utilízame como instrumento,
Y posesión tuya (x2)
Amén.\`
  }
`;

const newContent = content.substring(0, startIndex) + newSongs + content.substring(endIndex);
fs.writeFileSync(filePath, newContent);
console.log("Successfully replaced old songs with new songs in LandingClient.tsx.");
