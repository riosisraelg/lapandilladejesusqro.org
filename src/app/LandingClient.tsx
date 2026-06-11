"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchICalFeed } from "../utils/icalParser";
import { ICAL_FEED_URL } from "../config";
;

// ── SVG Icon Components ──
const ClockIcon = () => (
  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);

const MapPinIcon = () => (
  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── FAQ Data ──
const FAQ_DATA: Array<{ q: string; a: React.ReactNode }> = [
  {
    q: "¿Qué es La Pandilla de Jesús?",
    a: "Somos una comunidad católica juvenil con sede en Querétaro. Nos reunimos semanalmente para orar, convivir y crecer en la fe. Organizamos retiros Kerigma, colectas solidarias, misiones y encuentros de oración."
  },
  {
    q: "¿Necesito ser católico para asistir?",
    a: "¡No! Todas las personas son bienvenidas sin importar su tradición religiosa. Lo importante es tener apertura y ganas de compartir un espacio de comunidad y crecimiento personal."
  },
  {
    q: "¿Cuándo y dónde se reúnen?",
    a: (
      <span>
        Nos reunimos los martes a las 20:00 para nuestros encuentros semanales, donde compartimos temas de fe, vida y crecimiento personal impartidos por miembros de la comunidad o profesionales invitados. También asistimos los domingos a las 13:00 a la misa comunitaria (nos sentamos al fondo a la izquierda pegados al altar, ¡y siempre se busca ayuda para la colecta!). Nuestro punto de encuentro es la{" "}
        <a 
          href="https://lasagradafamiliaqro.org/" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "var(--gold)", textDecoration: "underline", fontWeight: "600" }}
        >
          Parroquia de La Sagrada Familia
        </a>
        , Blvd. Jardines de la Hacienda 710, Jardines de la Hacienda, Querétaro.
      </span>
    )
  },
  {
    q: "¿Qué es un retiro Kerigma?",
    a: "Es una experiencia de inmersión espiritual de fin de semana donde cada joven tiene un encuentro personal con Cristo. Llevamos más de 3 generaciones y cada retiro es único e irrepetible. Además, después de vivir el retiro, a partir de esas generaciones se forman pequeñas comunidades que se siguen reuniendo semanalmente para continuar compartiendo y creciendo juntas en la fe."
  },
  {
    q: "¿Cómo me puedo unir?",
    a: (
      <span>
        ¡Solo llega a cualquiera de nuestras reuniones! También puedes escribirnos directamente a nuestro{" "}
        <a 
          href="https://wa.me/5214422497485" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "var(--gold)", textDecoration: "underline", fontWeight: "600" }}
        >
          canal de WhatsApp
        </a>{" "}
        para enterarte de próximos eventos y resolver cualquier duda de inmediato.
      </span>
    )
  },
  {
    q: "¿Las actividades tienen costo?",
    a: "Las reuniones semanales y la mayoría de las actividades son completamente gratuitas. En caso de que un retiro o actividad tenga algún costo, siempre nos organizamos como comunidad para apoyarnos entre todos y asegurar que nadie se quede fuera, aunque por lo general los gastos (como hospedaje, alimentación o la participación en una misión) corren por cuenta de cada integrante."
  },
  {
    q: "¿Qué rango de edad tienen los miembros?",
    a: "La mayoría de nuestros miembros tienen entre 16 y 40 años. Lo que nos une es la fe, no la edad. Dentro del templo tambien hay comunidades de otras edades acerca con nosotros y te orientamos o en la administracion del templo."
  },
  {
    q: "¿Cómo puedo ver el calendario de eventos?",
    a: (
      <span>
        Puedes consultar nuestro calendario completo con todos los eventos, retiros y actividades en la sección de{" "}
        <Link href="/calendario" 
          style={{ color: "var(--gold)", textDecoration: "underline", fontWeight: "600" }}
        >
          Calendario
        </Link>{" "}
        de esta página.
      </span>
    )
  }
];

const defaultSongs = [
  {
    id: "lema",
    title: "Coro RUAH (Lema)",
    artist: "Coro RUAH",
    lyrics: `Al cielo llegamos en equipo
Siempre que me mires quiero que me encuentres con fuego en el corazón.
¡VEN ESPÍRITU SANTO!`
  },
  {
    id: "alabo",
    title: "A ti te alabo",
    artist: "Hakuna",
    lyrics: `[Estrofa 1]
A Ti te alabo, Señor, en tu templo,
A Ti te alabo con todo el firmamento,
A Ti te alabo con todo lo que Tú has hecho,
A Ti te alabo, Padre, Hijo, amor eterno,
A Ti te alabo con trompas y flautas,
A Ti te alabo con tambores y danzas,
A Ti te alaban criaturas y animales,
A Ti te alaban las montañas y los mares.

[Estrofa 2]
A ese ser que creó este mundo por amor
No lo encontraba
No creía que fuera posible este don: Un Dios
Todo lo que veo a mi alrededor
Grita que aquí estás y esconde mi temor
Todo ser que aliente, alabe al Señor
Y grite bien fuerte

[Estrofa 3]
A Ti te alabo aunque te escondas, aunque yo no pueda verte,
A Ti te alabo que me salvas de la muerte,
A Ti te alabo en el silencio de un amor que ya no siente,
A Ti te alabo, eres mi Dios, eres mi vida, eres mi fuerte,
A Ti te alabo en lo sencillo, cotidiano, indiferente
A Ti te alabo con el vivo que te busca ansiadamente,
A Ti te alabo con el muerto que te espera nuevamente,
A Ti te alabo, eres mi Dios, eres mi Vida.
A ti te alabo (x4)`
  },
  {
    id: "corazon",
    title: "Mira este corazón",
    artist: "Hakuna",
    lyrics: `[Estrofa 1]
Mira este corazón
No desea nada más que encontrarse con tu amor
Envíanos tu Espíritu, oh Dios,
Derrámalo, derrámalo

[Estrofa 2]
Mira este corazón
Solo tú puedes llenar ese vacío, ese dolor
Envíanos tu Espíritu, oh Dios
Derrámalo, derrámalo

[Estrofa 3]
Sé que ahora escuchas tú mi voz
Ven, date prisa en socorrer a este grito, a este clamor
Ven ahora a mi interior
Ven a irrumpir con tu gran fuerza y tu poder transformador
Envíanos tu Espíritu, oh Dios
Derrámalo
Derrámalo`
  },
  {
    id: "ruah",
    title: "Ruah",
    artist: "Jesse Demara",
    lyrics: `[Estrofa 1]
¡Oh, Ruah!
¡Oh, Ruah!
Con poder
Ruah (x2)

[Estrofa 2]
Estamos llenos de valor
Salimos a anunciar tu resurrección
Señales hoy nos acompañan
De tu majestad, tu sanación.

[Estrofa 3]
Fuego abrazador
Quema nuestro ser
Echa fuera el temor de una vez.

[Estrofa 4]
Ruah
¡Oh, Ruah!
¡Oh, Ruah!
Con poder (x2)

[Estrofa 5]
Estamos llenos de valor
Salimos a anunciar tu resurrección
Señales hoy nos acompañan
De tu majestad, tu sanación.

[Estrofa 6]
Derama tu poder
En mi debilidad
Llena los corazones de tu paz.

Ruah
¡Oh, Ruah!
¡Oh, Ruah!
Con poder`
  },
  {
    id: "gracias",
    title: "Gracias",
    artist: "Tuyo",
    lyrics: `[Estrofa 1]
Gracias por dejarme estar tan cerca de ti,
Qué ganas tenía de que llegara este momento.
Gracias por esconderte en este trozo de pan,
Y poderte escuchar en el silencio.

[Estrofa 2]
Gracias, Señor, muchas gracias, Jesús,
Gracias, Señor, muchas gracias, Jesús.

[Estrofa 3]
Por amarme, escucharme, y confiar en mí,
Y por darme lo que tengo, aunque no me lo merezcO.
Gracias, Señor, muchas gracias, Jesús,
Gracias, Señor, muchas gracias, Jesús.`
  },
  {
    id: "tantum",
    title: "Tantum Ergo",
    artist: "Himno Eucarístico",
    lyrics: `Latín

[Estrofa 1]
Tantum Ergo Sacraméntum,
Venerémur cérnui:
Et antíquum documéntum
Novo cedat rítui;
Præstet fides suppleméntum
Sénsuum deféctui.

[Estrofa 2]
Genitóri Genitóque,
Laus et jubilátio;
Salus, honor, virtus quoque,
Sit et benedíctio;
Procedénti ab utróque
Compar sit laudátio.
Amen.

Español

[Estrofa 1]
Veneremos, pues, inclinados
A tan grande Sacramento;
Y la antigua figura ceda el puesto
Al nuevo rito;
La fe supla
La incapacidad de los sentidos.

[Estrofa 2]
Al Padre y al Hijo
Sean dadas alabanza y júbilo,
Salud, honor, poder y bendición;
Una gloria igual sea dada
Al que del uno y del otro procede.
Amén.`
  },
  {
    id: "yeshua",
    title: "Yeshua",
    artist: "Harpa Dei",
    lyrics: `Yeshua,
Yeshua,
Yeshua.`
  },
  {
    id: "guadalupana",
    title: "La Guadalupana",
    artist: "Tradicional",
    lyrics: `[Estrofa 1]
Desde el cielo, una hermosa mañana
Desde el cielo, una hermosa mañana
La Guadalupana, la Guadalupana
La Guadalupana bajó al Tepeyac
La Guadalupana, la Guadalupana
La Guadalupana bajó al Tepeyac

[Estrofa 2]
Suplicante, juntaba sus manos
Suplicante, juntaba sus manos
Y eran mexicanos, y eran mexicanos
Y eran mexicanos, su porte y su faz
Y eran mexicanos, y eran mexicanos
Y eran mexicanos, su porte y su faz.

[Estrofa 3]
Su llegada llenó de alegría
Su llegada llenó de alegría
De luz y armonía, de luz y armonía
De luz y armonía todo el Anáhuac
De luz y armonía, de luz y armonía
De luz y armonía todo el Anáhuac

[Estrofa 4]
Desde entonces, para el mexicano
Desde entonces, para el mexicano
Ser Guadalupano, ser Guadalupano
Ser Guadalupano es algo esencial
Ser Guadalupano, ser Guadalupano
Ser Guadalupano es algo esencial.`
  },
  {
    id: "adorandote",
    title: "Adorándote, Amándote",
    artist: "Coro RUAH",
    lyrics: `Uh… Adorándote, Amándote,
Uh… Adorándote, Amándote,
Aquí estoy Señor entrando en tu presencia
Adorándote, amándote (x2)
Tu Espíritu
Está aquí
Tu poderoso amor
Actúa en mi
Tu santidad
Llena el lugar
Reinas con autoridad
Y yo...
Uh… Adorándote, Amándote
Aquí estás, Aquí estás,
Sanándome, Liberándome //
Uh… Adorándote, Amándote
Uh… Adorándote, Amándote
¡GRACIAS! -Coro RUAH.`
  }
];

const oraciones = [
  {
    title: "Ofrecimiento de la Hora Santa",
    text: `Señor Jesús, me presento ante Ti para acompañarte durante esta Hora Santa. Quiero ofrecerte este tiempo en reparación por mis pecados y los del mundo entero, para adorarte en el Santísimo Sacramento del Altar, darte gracias por tus inmensos beneficios y pedirte las gracias que tanto necesito. Envía tu Espíritu Santo para que me guíe y me enseñe a orar como a Ti te agrada. Amén.`
  },
  {
    title: "Acto de Contrición",
    text: `Señor mío Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío; por ser Vos quien sois, Bondad infinita, y porque os amo sobre todas las cosas, me pesa de todo corazón de haberos ofendido; también me pesa porque podéis castigarme con las penas del infierno. Ayudado de vuestra divina gracia, propongo firmemente nunca más pecar, confesarme y cumplir la penitencia que me fuere impuesta. Amén.`
  },
  {
    title: "Comunión Espiritual",
    text: `Jesús mío, creo firmemente que estás presente en el Santísimo Sacramento del Altar. Te amo sobre todas las cosas y deseo ardientemente recibirte dentro de mi alma; pero no pudiendo hacerlo ahora sacramentalmente, ven al menos espiritualmente a mi corazón. Y como si ya te hubiese recibido, te abrazo y me uno del todo a Ti. Señor, no permitas que jamás me separe de Ti. Amén.`
  },
  {
    title: "Estación al Santísimo Sacramento",
    text: `— Viva Jesús Sacramentado.
— ¡Sea por siempre bendito y alabado!

*Padrenuestro, Avemaría y Gloria.*

Señor Jesús, te adoramos en esta Hostia Santa, donde estás real y verdaderamente presente con tu Cuerpo, Sangre, Alma y Divinidad. Te pedimos perdón por todos los ultrajes, sacrilegios e indiferencias con que eres ofendido en este Sacramento de tu amor. Amén.`
  },
  {
    title: "Oración por las Vocaciones",
    text: `Señor Jesús, Buen Pastor de nuestras almas, que viniste no a ser servido sino a servir; te pedimos que envíes abundantes obreros a tu mies. Suscita en el corazón de muchos jóvenes el deseo de entregarse enteramente a Ti y al servicio de tu Iglesia como sacerdotes, religiosos y laicos consagrados. Dales valentía para responder a tu llamado y generosidad para seguirte con alegría. Amén.`
  },
  {
    title: "Alma de Cristo (Anima Christi)",
    text: `Alma de Cristo, santifícame.
Cuerpo de Cristo, sálvame.
Sangre de Cristo, embriágame.
Agua del costado de Cristo, lávame.
Pasión de Cristo, confórtame.
¡Oh, buen Jesús!, óyeme.
Dentro de tus llagas, escóndeme.
No permitas que me aparte de Ti.
Del enemigo malo, defiéndeme.
En la hora de mi muerte, llámame.
Y mándame ir a Ti.
Para que con tus santos te alabe.
Por los siglos de los siglos. Amén.`
  },
  {
    title: "Respuestas breves de la Misa",
    text: `— El Señor esté con vosotros.
— Y con tu espíritu.

— Levantemos el corazón.
— Lo tenemos levantado hacia el Señor.

— Demos gracias al Señor, nuestro Dios.
— Es justo y necesario.

— Podéis ir en paz.
— Demos gracias a Dios.`
  }
];

export default function Landing() {
  const [events, setEvents] = useState<Array<any>>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Recursos Modals States
  const [showCancionero, setShowCancionero] = useState(false);
  const [showOraciones, setShowOraciones] = useState(false);
  const [showGuiaMisa, setShowGuiaMisa] = useState(false);

  // Cancionero state
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Array<{ id: string; title: string; artist: string; lyrics: string }>>(defaultSongs);
  const [expandedSongId, setExpandedSongId] = useState<string | null>(null);

  // Oraciones state
  const [activeOracionIdx, setActiveOracionIdx] = useState(0);

  // Guía de Misa state
  const [activeGuiaTab, setActiveGuiaTab] = useState<'misterio' | 'respuestas' | 'liturgia' | 'biblia'>('misterio');

  // Load song order from localStorage
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("cancionero_order");
      if (savedOrder) {
        const orderIds = JSON.parse(savedOrder) as string[];
        const ordered = [...defaultSongs].sort((a, b) => {
          const idxA = orderIds.indexOf(a.id);
          const idxB = orderIds.indexOf(b.id);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        });
        setSongs(ordered);
      }
    } catch (e) {
      console.error("Error loading song order", e);
    }
  }, []);

  // Load active oracion index from localStorage
  useEffect(() => {
    try {
      const savedIdx = localStorage.getItem("active_oracion_index");
      if (savedIdx) {
        const idx = parseInt(savedIdx, 10);
        if (idx >= 0 && idx < oraciones.length) {
          setActiveOracionIdx(idx);
        }
      }
    } catch (e) {
      console.error("Error loading active oracion index", e);
    }
  }, []);

  const reorderSong = (index: number, direction: "up" | "down") => {
    const newSongs = [...songs];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSongs.length) return;
    
    const temp = newSongs[index];
    newSongs[index] = newSongs[targetIndex];
    newSongs[targetIndex] = temp;
    
    setSongs(newSongs);
    localStorage.setItem("cancionero_order", JSON.stringify(newSongs.map(s => s.id)));
  };

  const handleOracionNav = (newIdx: number) => {
    if (newIdx >= 0 && newIdx < oraciones.length) {
      setActiveOracionIdx(newIdx);
      localStorage.setItem("active_oracion_index", String(newIdx));
    }
  };

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs;
    const q = searchQuery.toLowerCase();
    return songs.filter(
      s => s.title.toLowerCase().includes(q) || s.lyrics.toLowerCase().includes(q)
    );
  }, [songs, searchQuery]);

  // Track active section during scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200; // Offset for better intersection tracking
      const acercaEl = document.getElementById('acerca');
      const faqEl = document.getElementById('faq');

      if (faqEl && scrollPos >= faqEl.offsetTop) {
        setActiveSection('faq');
      } else if (acercaEl && scrollPos >= acercaEl.offsetTop) {
        setActiveSection('acerca');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // height of fixed navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Apply landing body class
  useEffect(() => {
    document.body.classList.add("landing-body");
    return () => document.body.classList.remove("landing-body");
  }, []);

  // Intersection Observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [events]);

  // Fetch events from public iCal feed exclusively
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch and parse external iCal events
        let icsEvents: any[] = [];
        if (ICAL_FEED_URL) {
          icsEvents = await fetchICalFeed(ICAL_FEED_URL);
        }

        // Sort by date
        const sorted = icsEvents.sort(
          (a, b) => new Date(a.date + "T00:00:00").getTime() - new Date(b.date + "T00:00:00").getTime()
        );
        setEvents(sorted);
      } catch (err) {
        console.error("Error loading events", err);
      }
    };
    fetchEvents();
  }, []);

  // Format YYYY-MM-DD safely in local browser timezone
  const getLocalDateString = (dateObj: Date) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Group events within the current transcurring calendar week (Monday to Sunday)
  const weekEvents = useMemo(() => {
    const today = new Date();
    const todayStr = getLocalDateString(today);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = getLocalDateString(tomorrow);

    // Get current calendar week end date (Sunday)
    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const sunday = new Date();
    sunday.setDate(today.getDate() + daysUntilSunday);
    const sundayStr = getLocalDateString(sunday);

    // Events in this week interval [todayStr, sundayStr]
    const thisWeek = events.filter((e) => e.date >= todayStr && e.date <= sundayStr);

    const todayList = thisWeek.filter((e) => e.date === todayStr);
    const tomorrowList = thisWeek.filter((e) => e.date === tomorrowStr);
    const remainingList = thisWeek.filter((e) => e.date > tomorrowStr);

    const todayDay = today.getDate();
    const todayMonth = today.toLocaleDateString("es-ES", { month: "long" });
    const sundayDay = sunday.getDate();
    const sundayMonth = sunday.toLocaleDateString("es-ES", { month: "long" });
    
    const rangeStr = todayMonth === sundayMonth 
      ? `del ${todayDay} al ${sundayDay} de ${todayMonth}`
      : `del ${todayDay} de ${todayMonth} al ${sundayDay} de ${sundayMonth}`;

    return {
      today: todayList,
      tomorrow: tomorrowList,
      remaining: remainingList,
      hasAny: thisWeek.length > 0,
      rangeStr
    };
  }, [events]);

  // Derived helpers for dates
  const getDay = (d: string) => new Date(d + "T12:00:00").getDate();
  const getMonth = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("es-ES", { month: "short" });

  const getDayOfWeek = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short" });

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`nav ${mobileMenuOpen ? "nav-expanded" : ""}`}>
        <div className="nav-left">
          <div className="nav-brand">
            <span className="nav-brand-name">La Pandilla de Jesús</span>
            <span className="nav-brand-sub">Grupo Juvenil Catolico . Queretaro</span>
          </div>
        </div>
        
        {/* Desktop Links */}
        <ul className="nav-links">
          <li><Link href="/calendario">Eventos</Link></li>
          <li>
            <a href="https://wa.me/5214422497485" target="_blank" rel="noopener noreferrer" className="nav-cta-wa">
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button 
          className={`nav-mobile-btn ${mobileMenuOpen ? "active" : ""}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Mobile Dropdown Overlay */}
        <div className={`nav-mobile-overlay ${mobileMenuOpen ? "open" : ""}`}>
          <ul className="nav-mobile-links">
            <li><Link href="/calendario" onClick={() => setMobileMenuOpen(false)}>Eventos</Link></li>
            <li>
              <a 
                href="https://wa.me/5214422497485" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-mobile-cta-wa"
                onClick={() => setMobileMenuOpen(false)}
              >
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="landing-main" id="hero">
        {/* ══ HERO: Two-Column Grid ══ */}
        <div className="hero-grid">

          {/* LEFT COLUMN — Community Info & Templo Sede */}
          <div className="hero-left-column">
            
            {/* CARD 1 — Grupo Juvenil Catolico de Queretaro*/}
            <div className="info-card anim-fadeup">
              <h1>Grupo Juvenil Catolico de Queretaro</h1>
              <p>
                La Pandilla de Jesús es un espacio de encuentro, formación y servicio en la ciudad de Querétaro.
                Acompañamos a jóvenes en su camino de fe mediante actividades
                comunitarias, oración y proyectos sociales que fortalecen nuestra parroquia y el tejido comunitario.
              </p>

              <div className="contact-grid">
                <div className="contact-item" style={{ gridColumn: "span 2" }}>
                  <ClockIcon />
                  <div>
                    <div className="contact-label">Horario de reunión</div>
                    <div className="contact-value">Martes 20:00 - Reunión de formación | Domingo 13:00 - Misa comunitaria (nos ubicamos al fondo a la izquierda pegados al altar; siempre se busca ayuda para la colecta)</div>
                  </div>
                </div>
                
                <div className="contact-item" style={{ gridColumn: "span 2" }}>
                  <MapPinIcon />
                  <div>
                    <div className="contact-label">Dirección</div>
                    <div className="contact-value">
                      <a href="https://lasagradafamiliaqro.org/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                        Parroquia de La Sagrada Familia
                      </a>
                      <br />
                      Blvd. Jardines de la Hacienda 710, Jardines de la Hacienda, Querétaro
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Buttons Row inside Community Card */}
              <div className="dynamic-buttons-row">
                <a 
                  href="https://wa.me/5214422497485" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="dynamic-btn btn-whatsapp"
                >
                  <WhatsAppIcon size={16} /> WhatsApp Comunidad
                </a>
                
                <Link href="/calendario" className="dynamic-btn btn-events">
                  Calendario de Eventos
                </Link>
              </div>
            </div>

            {/* CARD 2 — Templo Sede */}
            <div className="info-card templo-card anim-fadeup anim-delay-1" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "var(--text-dark)", marginBottom: "1rem" }}>Templo Sede: Parroquia de La Sagrada Familia</h2>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "var(--text-body)", marginBottom: "1.5rem" }}>
                  Nuestra comunidad de fe tiene su sede principal en la Parroquia de La Sagrada Familia, en Querétaro.
                  Aquí se celebran nuestras asambleas semanales de los martes y la eucaristía comunitaria de los domingos.
                </p>
                
                <a 
                  href="https://lasagradafamiliaqro.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-ver-eventos"
                  style={{ display: "flex", justifyContent: "center", textDecoration: "none", width: "100%" }}
                >
                  Visitar Sitio Web Parroquial
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN — Eventos & Recursos */}
          <div className="hero-right-column">
            {/* Eventos próximos */}
            <div className="upcoming-card anim-fadeup anim-delay-2">
              <div className="upcoming-header">
                <div className="upcoming-title-group">
                  <h3>Eventos próximos</h3>
                  <p>Mostrando agenda {weekEvents.rangeStr && `(${weekEvents.rangeStr})`}</p>
                </div>
                <Link href="/calendario" className="btn-ver-calendar">Ver todo</Link>
              </div>

              <div className="week-events-list">
                {!weekEvents.hasAny ? (
                  <div className="events-empty">
                    <p>No hay eventos programados para esta semana.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Hoy Section */}
                    <div className="event-day-section day-today">
                      <h4>Hoy</h4>
                      {weekEvents.today.length === 0 ? (
                        <p className="event-day-empty">No hay eventos programados para hoy.</p>
                      ) : (
                        weekEvents.today.map((ev) => (
                          <div key={ev.id} className="event-day-item">
                            <div className="event-day-info">
                              <h5>{ev.title}</h5>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                                {ev.time && ev.time !== "Todo el día" && (
                                  <p className="event-item-time" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', color: 'var(--gold)', verticalAlign: 'middle' }}>
                                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                    </svg>
                                    <span>{ev.time}</span>
                                  </p>
                                )}
                                {ev.location && (
                                  <p className="event-item-location" style={{ margin: 0 }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', color: 'var(--gold)', verticalAlign: 'middle' }}>
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    <span>{ev.location.split(",")[0]}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Mañana Section */}
                    <div className="event-day-section day-tomorrow">
                      <h4>Mañana</h4>
                      {weekEvents.tomorrow.length === 0 ? (
                        <p className="event-day-empty">No hay eventos programados para mañana.</p>
                      ) : (
                        weekEvents.tomorrow.map((ev) => (
                          <div key={ev.id} className="event-day-item">
                            <div className="event-day-info">
                              <h5>{ev.title}</h5>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                                {ev.time && ev.time !== "Todo el día" && (
                                  <p className="event-item-time" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', color: 'var(--gold)', verticalAlign: 'middle' }}>
                                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                    </svg>
                                    <span>{ev.time}</span>
                                  </p>
                                )}
                                {ev.location && (
                                  <p className="event-item-location" style={{ margin: 0 }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', color: 'var(--gold)', verticalAlign: 'middle' }}>
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    <span>{ev.location.split(",")[0]}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Rest of the week Section */}
                    <div className="event-day-section day-week">
                      <h4>Resto de la semana</h4>
                      {weekEvents.remaining.length === 0 ? (
                        <p className="event-day-empty">No hay más eventos programados.</p>
                      ) : (
                        weekEvents.remaining.map((ev) => (
                          <div key={ev.id} className="event-day-item">
                            <div className="event-day-info">
                              <h5>{ev.title}</h5>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                                <p style={{ margin: 0 }}>
                                  <strong style={{ letterSpacing: '0.5px' }}>{getDayOfWeek(ev.date).toUpperCase()} · {getDay(ev.date)} {getMonth(ev.date).toUpperCase()}</strong>
                                  {ev.time && ev.time !== "Todo el día" && (
                                    <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center' }}>
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '3px', color: 'var(--gold)', verticalAlign: 'middle' }}>
                                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                      </svg>
                                      <span>{ev.time}</span>
                                    </span>
                                  )}
                                </p>
                                {ev.location && (
                                  <p className="event-item-location" style={{ margin: 0 }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', color: 'var(--gold)', verticalAlign: 'middle' }}>
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    <span>{ev.location.split(",")[0]}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="upcoming-info-note">
                <p>
                  * Mostramos únicamente la agenda de esta semana. Para consultar toda la planeación mensual y agendar eventos directamente en tus dispositivos, visita la sección de <Link href="/calendario" style={{ color: "var(--gold)", textDecoration: "underline", fontWeight: "600" }}>Calendario</Link>.
                </p>
                <p style={{ marginTop: '8px' }}>
                  Nos esforzamos por mantener la información actualizada. Si no ves eventos programados o son muy pocos, ¡escríbenos directamente por <a href="https://wa.me/5214422497485" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "underline", fontWeight: "600" }}>WhatsApp</a> para resolver cualquier duda al instante!
                </p>
              </div>
            </div>

            {/* Recursos de la Comunidad */}
            <div className="recursos-card anim-fadeup anim-delay-3">
              <h3 className="recursos-title">Recursos de la Comunidad</h3>
              <p className="recursos-desc">Recursos interactivos de la comunidad. Las oraciones y la guía están sujetas a cambios para ajustarse a nuestras necesidades.</p>
              
              <div className="recursos-buttons-grid">
                <button 
                  className="recursos-btn btn-cancionero" 
                  onClick={() => setShowCancionero(true)}
                >
                  <div className="recursos-icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.5 4.5S16.5 6 13 9c-3.5 3-4 8-4 8s3-.5 6-3.5c3-3 5.5-9 5.5-9z" />
                      <path d="M9 14c-1.5 1.5-3.5 2.5-5.5 2.5-2 0-2.5-1-2.5-1.5s.5-1.5 2.5-2.5c2-1 5.5-1.5 5.5-1.5" />
                      <path d="M13.5 9c-.5-1.5-2-3.5-4.5-4.5-2.5-1-3.5-.5-3.5-.5s.5 1.5 2 3c1.5 1.5 6 2 6 2" />
                    </svg>
                  </div>
                  Cancionero
                </button>

                <button 
                  className="recursos-btn btn-oraciones" 
                  onClick={() => setShowOraciones(true)}
                >
                  <div className="recursos-icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8a6 6 0 0 0-12 0v8a6 6 0 0 0 12 0V8z" />
                      <path d="M12 2v20" />
                      <path d="M8 12h8" />
                    </svg>
                  </div>
                  Oraciones
                </button>

                <button 
                  className="recursos-btn btn-guia" 
                  onClick={() => setShowGuiaMisa(true)}
                >
                  <div className="recursos-icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  Guía de Misa
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ══ ACERCA DE — 3 Pilares ══ */}
        <section className="about-section fade-in" id="acerca">
          <div className="about-header">
            <span className="section-badge">Nuestra Misión</span>
            <h2 className="section-heading">¿Quiénes Somos?</h2>
            <p className="section-subheading">
              Somos un grupo de jóvenes católicos unidos por la fe, el servicio y la alegría.
              Tres pilares guían nuestro caminar.
            </p>
          </div>

          <div className="pillars-grid">
            {/* Pilar 1 */}
            <div className="pillar-card fade-in">
              <div className="pillar-icon-wrap pillar-icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C10 6 7 8 7 13a5 5 0 0 0 10 0c0-5-3-7-5-11z" />
                </svg>
              </div>
              <h3>Fe Viva</h3>
              <p>
                Fortalecemos nuestra relación con Dios a través de la oración,
                la Eucaristía y el estudio de la Palabra. Cada martes y domingo
                nos encontramos para crecer juntos en este camino espiritual.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="pillar-card fade-in">
              <div className="pillar-icon-wrap pillar-icon-gold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3>Comunidad</h3>
              <p>
                Construimos una familia donde cada persona es valorada, escuchada
                y acompañada. Organizamos convivencias, retiros Kerigma y espacios
                donde los jóvenes descubren el amor de Dios.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="pillar-card fade-in">
              <div className="pillar-icon-wrap pillar-icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <h3>Servicio</h3>
              <p>
                Llevamos el amor de Cristo a los demás a través del servicio de Liturgia en nuestra Misa dominical de jóvenes a las 13:00 horas y apostolado haciendo tortas y llevándolas al hospital los sábados.
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row fade-in">
            <div className="stat-item">
              <span className="stat-number">3+</span>
              <span className="stat-label">Generaciones Kerigma</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">60+</span>
              <span className="stat-label">Jóvenes activos</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">2+</span>
              <span className="stat-label">Colectas realizadas</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">1+</span>
              <span className="stat-label">Misiones cumplidas</span>
            </div>
          </div>
        </section>

        {/* ══ VERSÍCULO ══ */}
        <section className="verse-banner fade-in">
          <p className="verse-text">
            "Porque donde dos o tres se reúnen en mi nombre, allí estoy yo en medio de ellos."
          </p>
          <span className="verse-ref">— Mateo 18:20</span>
        </section>

        {/* ══ FAQ ══ */}
        <section className="faq-section fade-in" id="faq">
          <div className="about-header">
            <span className="section-badge">Resuelve tus dudas</span>
            <h2 className="section-heading">Preguntas Frecuentes</h2>
            <p className="section-subheading">
              Todo lo que necesitas saber antes de visitarnos.
            </p>
          </div>

          <div className="faq-list">
            {FAQ_DATA.map((item, idx) => (
              <div
                key={idx}
                className={`faq-item ${openFaq === idx ? "faq-open" : ""}`}
              >
                <button className="faq-question" onClick={() => toggleFaq(idx)}>
                  <span>{item.q}</span>
                  <span className={`faq-chevron ${openFaq === idx ? "faq-chevron-open" : ""}`}>
                    <ChevronDown />
                  </span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA Final ══ */}
        <section className="cta-banner fade-in">
          <h2>¿Listo para ser parte de La Pandilla?</h2>
          <p>Ven a conocernos en persona o escríbenos directamente para enterarte de todo.</p>
          <div className="cta-buttons">
            <Link href="/calendario" className="btn-insta" style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}>
              Ver Calendario de Eventos
            </Link>
            <a
              href="https://wa.me/5214422497485"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa"
              style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}
            >
              <WhatsAppIcon size={18} /> WhatsApp Comunidad
            </a>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-sparkles-container">
          <div className="sparkle sparkle-1">✦</div>
          <div className="sparkle sparkle-2">✧</div>
          <div className="sparkle sparkle-3">✦</div>
          <div className="sparkle sparkle-4">★</div>
          <div className="sparkle sparkle-5">✧</div>
          <div className="sparkle sparkle-6">✦</div>
          <div className="sparkle sparkle-7">★</div>
          <div className="sparkle sparkle-8">✧</div>
          <div className="sparkle sparkle-9">✦</div>
          <div className="sparkle sparkle-10">✧</div>
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
          <div className="bubble bubble-4"></div>
          <div className="bubble bubble-5"></div>
        </div>
        <div className="footer-inner">
          <div className="footer-brand-container">
            <div className="footer-brand-name">La Pandilla de Jesús</div>
            <div className="footer-brand-sub">Grupo Juvenil Católico · Parroquia de La Sagrada Familia, Querétaro</div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-meta-container">
            <span className="footer-copy">© 2026 La Pandilla de Jesús</span>
            <ul className="footer-links">
              <li><Link href="/calendario">Eventos</Link></li>
              <li>
                <a href="https://wa.me/5214422497485" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Cancionero Modal */}
      {showCancionero && (
        <div className="calendar-modal-overlay" onClick={() => setShowCancionero(false)}>
          <div className="recursos-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="calendar-modal-close-btn" 
              onClick={() => setShowCancionero(false)}
              aria-label="Cerrar modal"
            >
              ✕
            </button>
            <h3 className="recursos-title" style={{ paddingRight: '2rem' }}>Cancionero Horas Santas</h3>
            
            <div className="cancionero-nota">
              Nota: El orden de las canciones es informativo y no representa la secuencia exacta en que se cantan en la Hora Santa. Puedes ordenarlas para tu planeación.
            </div>

            <input 
              type="text" 
              placeholder="Buscar canción por título o letra..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cancionero-search"
            />

            <div className="recursos-modal-body">
              {filteredSongs.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem 0', fontStyle: 'italic' }}>
                  No se encontraron canciones que coincidan con la búsqueda.
                </p>
              ) : (
                filteredSongs.map((song, idx) => {
                  const isExpanded = expandedSongId === song.id;
                  const originalIndex = songs.findIndex(s => s.id === song.id);
                  
                  return (
                    <div key={song.id} className="cancionero-song-item">
                      <div className="cancionero-song-header" onClick={() => setExpandedSongId(isExpanded ? null : song.id)}>
                        <div className="cancionero-song-title-group">
                          <span className="cancionero-song-title">{song.title}</span>
                          <span className="cancionero-song-artist">{song.artist}</span>
                        </div>
                        <div className="cancionero-song-controls" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="cancionero-order-btn" 
                            disabled={originalIndex === 0 || searchQuery !== ""}
                            onClick={() => reorderSong(originalIndex, "up")}
                          >
                            ▲
                          </button>
                          <button 
                            className="cancionero-order-btn" 
                            disabled={originalIndex === songs.length - 1 || searchQuery !== ""}
                            onClick={() => reorderSong(originalIndex, "down")}
                          >
                            ▼
                          </button>
                          <span style={{ 
                            marginLeft: '8px', 
                            fontSize: '0.75rem', 
                            color: 'var(--text-light)', 
                            transform: isExpanded ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                          }}
                          onClick={() => setExpandedSongId(isExpanded ? null : song.id)}>
                            ▼
                          </span>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="cancionero-song-body">
                          {song.lyrics}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Agradecimiento Especial */}
              <div className="cancionero-agradecimiento-card">
                <h4 className="cancionero-agradecimiento-title">Jesús,</h4>
                <p>
                  Gracias por permitirnos estar tan cerca de Tl, y por regalarnos la gracia de tener sed de Tl.
                  Por tocar la puerta (nuestro corazón) y llamarnos a tu encuentro.
                  Gracias por llenar de Tl estos corazones heridos y vacíos, por sanarlos y transformarlos.
                  Gracias por todas las bendiciones que nos has dado en este gran año, y, por si fuera poco, gracias por darnos la VIDA.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  Hoy no queremos más que encontrarnos con tu AMOR, hoy sabemos que sólo TÚ puedes llenar ese vacío, hoy ya no concebimos vida más allá de esta medida.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  Sólo gracias papá, por un año tan maravilloso.
                </p>
                <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>
                  ¡TE AMAMOS CON LOCURA!
                </p>
                <p style={{ fontStyle: 'italic' }}>
                  -Tus hijos muy amados.
                </p>
                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                  ¡GRACIAS!
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                  * Coro RUAH
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Oraciones Modal */}
      {showOraciones && (
        <div className="calendar-modal-overlay" onClick={() => setShowOraciones(false)}>
          <div className="recursos-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="calendar-modal-close-btn" 
              onClick={() => setShowOraciones(false)}
              aria-label="Cerrar modal"
            >
              ✕
            </button>
            <h3 className="recursos-title">Oraciones de la Comunidad</h3>
            <p className="recursos-desc" style={{ marginBottom: '1rem' }}>
              Tarjetero de oraciones para adoración y preparación espiritual.
            </p>

            <div className="recursos-modal-body" style={{ overflow: 'visible' }}>
              <div className="oraciones-deck-container">
                <div className="oracion-card">
                  <h4>{oraciones[activeOracionIdx].title}</h4>
                  <p>{oraciones[activeOracionIdx].text}</p>
                </div>
              </div>

              <div className="oraciones-nav">
                <button 
                  className="oraciones-nav-btn" 
                  disabled={activeOracionIdx === 0}
                  onClick={() => handleOracionNav(activeOracionIdx - 1)}
                >
                  ◀ Anterior
                </button>
                <span className="oraciones-counter">
                  {activeOracionIdx + 1} de {oraciones.length}
                </span>
                <button 
                  className="oraciones-nav-btn" 
                  disabled={activeOracionIdx === oraciones.length - 1}
                  onClick={() => handleOracionNav(activeOracionIdx + 1)}
                >
                  Siguiente ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guía de Misa Modal */}
      {showGuiaMisa && (
        <div className="calendar-modal-overlay" onClick={() => setShowGuiaMisa(false)}>
          <div className="recursos-modal-card" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <button 
              className="calendar-modal-close-btn" 
              onClick={() => setShowGuiaMisa(false)}
              aria-label="Cerrar modal"
            >
              ✕
            </button>
            <h3 className="recursos-title">Guía de Misa para Principiantes</h3>
            <p className="recursos-desc">
              Aprende el significado, respuestas y la liturgia del año.
            </p>

            <div className="guia-tabs">
              <button 
                className={`guia-tab-btn ${activeGuiaTab === 'misterio' ? 'active' : ''}`}
                onClick={() => setActiveGuiaTab('misterio')}
              >
                El Misterio
              </button>
              <button 
                className={`guia-tab-btn ${activeGuiaTab === 'respuestas' ? 'active' : ''}`}
                onClick={() => setActiveGuiaTab('respuestas')}
              >
                Respuestas y Posturas
              </button>
              <button 
                className={`guia-tab-btn ${activeGuiaTab === 'liturgia' ? 'active' : ''}`}
                onClick={() => setActiveGuiaTab('liturgia')}
              >
                Año Litúrgico
              </button>
              <button 
                className={`guia-tab-btn ${activeGuiaTab === 'biblia' ? 'active' : ''}`}
                onClick={() => setActiveGuiaTab('biblia')}
              >
                Citas Bíblicas
              </button>
            </div>

            <div className="recursos-modal-body">
              {activeGuiaTab === 'misterio' && (
                <div className="guia-content-panel">
                  <h4>¿Por qué la Misa y sus Ritos?</h4>
                  <p>
                    La Santa Misa no es una simple reunión comunitaria, sino la actualización del <strong>Misterio Pascual</strong> de Cristo: su Pasión, Muerte y Resurrección. En cada Eucaristía, nos unimos al mismo sacrificio redentor de Jesús en la cruz de manera incruenta (sin dolor).
                  </p>
                  <p><strong>Estructura del Misterio:</strong></p>
                  <ul>
                    <li>
                      <strong>Liturgia de la Palabra:</strong> Dios nos habla a través de las Escrituras. Escuchamos las lecturas y el Evangelio, respondiendo con el salmo y la homilía.
                    </li>
                    <li>
                      <strong>Liturgia Eucarística:</strong> El pan y el vino se convierten real y sustancialmente en el Cuerpo y la Sangre de Cristo (Transustanciación). Participamos en el banquete celestial y nos alimentamos espiritualmente.
                    </li>
                    <li>
                      <strong>El Ritual:</strong> Cada postura, gesto y palabra tiene un significado profundo heredado de la tradición apostólica y bíblica, destinado a involucrar todo nuestro ser (cuerpo, mente y alma) en la adoración divina.
                    </li>
                  </ul>
                </div>
              )}

              {activeGuiaTab === 'respuestas' && (
                <div className="guia-content-panel">
                  <h4>Respuestas y Posturas Clave</h4>
                  <p>
                    Las posturas físicas reflejan nuestra actitud interior de oración, respeto y adoración.
                  </p>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table className="guia-responses-table">
                      <thead>
                        <tr>
                          <th>Postura</th>
                          <th>Significado</th>
                          <th>Momentos Principales</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>De Pie</strong></td>
                          <td>Respeto, atención activa y oración libre.</td>
                          <td>Ritos iniciales, proclamación del Evangelio, Credo, Padre Nuestro y bendición final.</td>
                        </tr>
                        <tr>
                          <td><strong>Sentados</strong></td>
                          <td>Escucha atenta, meditación y receptividad.</td>
                          <td>Primera y segunda lectura, homilía y preparación de las ofrendas.</td>
                        </tr>
                        <tr>
                          <td><strong>De Rodillas</strong></td>
                          <td>Adoración humilde, reverencia extrema y contrición.</td>
                          <td>Plegaria eucarística y momento de la Consagración.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 style={{ marginTop: '1.5rem' }}>Diálogos Comunes</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="guia-responses-table">
                      <thead>
                        <tr>
                          <th>Sacerdote (o Diácono)</th>
                          <th>Asamblea (Nosotros)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>El Señor esté con vosotros.</td>
                          <td><strong>Y con tu espíritu.</strong></td>
                        </tr>
                        <tr>
                          <td>Levantemos el corazón.</td>
                          <td><strong>Lo tenemos levantado hacia el Señor.</strong></td>
                        </tr>
                        <tr>
                          <td>Demos gracias al Señor, nuestro Dios.</td>
                          <td><strong>Es justo y necesario.</strong></td>
                        </tr>
                        <tr>
                          <td>Este es el Misterio de la fe.</td>
                          <td><strong>Anunciamos tu muerte, proclamamos tu resurrección. ¡Ven, Señor Jesús!</strong></td>
                        </tr>
                        <tr>
                          <td>Podéis ir en paz.</td>
                          <td><strong>Demos gracias a Dios.</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeGuiaTab === 'liturgia' && (
                <div className="guia-content-panel">
                  <h4>El Año Litúrgico</h4>
                  <p>
                    Recorremos la vida de Jesús en diferentes tiempos e intensidades espirituales a lo largo del año:
                  </p>
                  <ul>
                    <li>
                      <strong>Adviento (Color Morado):</strong> Cuatro semanas de preparación, esperanza y espera activa antes de Navidad.
                    </li>
                    <li>
                      <strong>Navidad (Color Blanco/Dorado):</strong> Celebración alegre del nacimiento del Salvador.
                    </li>
                    <li>
                      <strong>Cuaresma (Color Morado):</strong> Cuarenta días de conversión, oración, ayuno y limosna para prepararnos para la Pascua.
                    </li>
                    <li>
                      <strong>Semana Santa y Pascua (Color Blanco/Dorado):</strong> El Triduo Pascual conmemora la Pasión y Muerte de Jesús, culminando en los cincuenta días de gozo por su Resurrección.
                    </li>
                    <li>
                      <strong>Tiempo Ordinario (Color Verde):</strong> Período de crecimiento cotidiano, siguiendo la vida pública de Jesús y sus enseñanzas.
                    </li>
                  </ul>
                  <p><strong>Misas Especiales y Liturgia adicional:</strong></p>
                  <ul>
                    <li>
                      <strong>Misas de Exequias:</strong> Oraciones solemnes por el descanso eterno de un difunto y el consuelo de su familia.
                    </li>
                    <li>
                      <strong>Horas Santas:</strong> Tiempos dedicados a la adoración eucarística comunitaria o personal con el Santísimo Sacramento expuesto.
                    </li>
                  </ul>
                </div>
              )}

              {activeGuiaTab === 'biblia' && (
                <div className="guia-content-panel">
                  <h4>Citas Bíblicas sobre la Eucaristía</h4>
                  <p>
                    La Eucaristía está profundamente arraigada en las Sagradas Escrituras. Aquí te presentamos cuatro citas fundamentales para profundizar:
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                    <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                      <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.88rem' }}>
                        "Yo soy el pan vivo bajado del cielo; el que coma de este pan vivirá para siempre. Y el pan que yo daré es mi carne para la vida del mundo."
                      </p>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>— Juan 6, 51</strong>
                    </div>

                    <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                      <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.88rem' }}>
                        "Mientras comían, Jesús tomó pan y, pronunciada la bendición, lo partió y se lo dio a sus discípulos diciendo: «Tomad, comed; esto es mi cuerpo.»"
                      </p>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>— Mateo 26, 26</strong>
                    </div>

                    <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                      <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.88rem' }}>
                        "Porque cada vez que coméis este pan y bebéis esta copa, anunciáis la muerte del Señor, hasta que él venga."
                      </p>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>— 1 Corintios 11, 26</strong>
                    </div>

                    <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                      <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.88rem' }}>
                        "Y sucedió que, al ponerse a la mesa con ellos, tomó el pan, pronunció la bendición, lo partió y se lo iba dando. Entonces se les abrieron los ojos y le reconocieron."
                      </p>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>— Lucas 24, 30-31</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── VERTICAL SIDE INDEX BAR ── */}
      <div className="side-index-bar">
        <a href="#hero" className={`side-index-dot ${activeSection === 'hero' ? 'active' : ''}`} onClick={(e) => scrollToSection(e, 'hero')}>
          <span className="dot-line"></span>
          <span className="dot-title">Inicio</span>
        </a>
        <a href="#acerca" className={`side-index-dot ${activeSection === 'acerca' ? 'active' : ''}`} onClick={(e) => scrollToSection(e, 'acerca')}>
          <span className="dot-line"></span>
          <span className="dot-title">Acerca de</span>
        </a>
        <a href="#faq" className={`side-index-dot ${activeSection === 'faq' ? 'active' : ''}`} onClick={(e) => scrollToSection(e, 'faq')}>
          <span className="dot-line"></span>
          <span className="dot-title">Preguntas Frecuentes</span>
        </a>
      </div>
    </>
  );
}
