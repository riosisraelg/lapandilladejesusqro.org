"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from "next/link";
import { fetchICalFeed } from "../utils/icalParser";
import { ICAL_FEED_URL } from "../config";
import AppleMusicLyrics from "./AppleMusicLyrics";
import GlobalModal from '../components/GlobalModal';
import { massResponses, MEXICAN_SUNG_HYMNS } from "./massResponses";
import type { MassReadingsResponse } from "./api/mass-readings/route";
import { 
  oracionesComunidad, 
  oracionesBasicas, 
  oracionesAlimentos,
  getFoodPrayersDeck,
  getSantoRosarioDeck, 
  getMysteryTypeForDay, 
  MISTERIOS_DATA, 
  MysteryType, 
  RosaryVariant,
  PrayerCard,
  FoodPrayerDay 
} from '../data/oracionesData';
import MysteryArtworkIcon from '../components/RosarioArtworkIcons';
import { CONFESION_DATA } from '../data/confesionData';
import { calculateDeckHSL } from '../utils/deckColors';

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

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const ThreadsIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24C5.454 24 0 18.618 0 12.006 0 5.394 5.454.012 12.186.012c6.732 0 12.186 5.382 12.186 11.994 0 2.274-.636 4.416-1.848 6.276l-2.028-1.344c.948-1.44 1.44-3.09 1.44-4.932 0-5.268-4.32-9.558-9.75-9.558-5.43 0-9.75 4.29-9.75 9.558 0 5.268 4.32 9.558 9.75 9.558 2.652 0 5.166-1.044 7.026-2.922l1.74 1.704C18.57 22.68 15.486 24 12.186 24zm4.818-12.87c-.078-3.09-2.316-5.55-5.004-5.55-2.778 0-5.046 2.586-5.046 5.766 0 3.18 2.268 5.766 5.046 5.766 1.83 0 3.444-1.122 4.314-2.82l-2.052-1.092c-.528.984-1.398 1.548-2.262 1.548-1.47 0-2.658-1.44-2.658-3.402 0-.252.018-.504.06-.744 1.05-.18 2.232-.27 3.51-.27 1.494 0 2.658.12 3.468.348.06-.522.084-1.032.084-1.546h-.46zm-2.43 1.902c-.636-.18-1.542-.27-2.622-.27-.996 0-1.926.066-2.748.192.198 1.47 1.152 2.574 2.37 2.574.978 0 1.956-.708 2.352-1.896l.648-.6z"/>
  </svg>
);

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
    id: "gloria_martin_valverde",
    title: "Gloria",
    artist: "Martín Valverde",
    lyrics: `Gloria,  Gloria,
Gloria, Gloria.
A Jesús El Señor,
al Cordero de Dios.
Al Nombre sobre todo nombre. (x2)
Gloria, Glo- ria,
Gloria, Glo- ria,
A Jesús El Señor,
al Cordero de Dios.
Al Nombre sobre todo nombre. (x2)
Al Nombre sobre
todo nombre.`
  },
  {
    id: "surge_valentia_berit",
    title: "Surge Valentía",
    artist: "Berit",
    lyrics: `Hoy acepto seguirte
dejar viejas certezas atrás.
Arriesgar mis verdades,
abrazar la inquietud
ir más allá.
Tus brazos extendidos
marcan el horizonte al final.
Encuentro tu mirada,
escapo del temor
que me ancla en mi barca.
Pero dudo y espero
que el viento sople menos,
que el sol alumbre más.
Surge valentía, disipa las dudas
de este corazón que teme al cruzar
las fronteras que limitan lo conocido
allá mar adentro
y sobre el agua caminar.
En tus huellas mis pasos
en tus manos la fuerza del mar
como tú quiero amar
las miserias del mundo
como tú, a mi debilidad.
Pero dudo y espero
que el viento sople menos,
que el sol alumbre más.
Surge valentía, disipa las dudas
de este corazón que teme al cruzar
las fronteras que limitan lo conocido
allá mar adentro
y sobre el agua caminar.
Surge valentía
y despunta en mí tu modo,
tus huellas, tus llagas,
tu forma de amar.
Y cuando cansado,
peligre tropezaaar…
Surge valentiiiiiiiiaaaaa
Surge valentiiiiiiiiaaaaa.`
  },
  {
    id: "noche_hakuna",
    title: "Noche",
    artist: "Hakuna",
    lyrics: `Por tu iglesia, que te espera a oscuras
Por tu pueblo, que te reza guardando la
aurora.
Te rogamos, te rogamos.
Por las naciones paganas
que tienen sed de ti sin saberlo,
Ten piedad, ten piedad.
Por los pueblos oprimidos,
por el totalitarismo y la opresión de la
mentira.
Por aquellos perseguidos por tu nombre
que se ocultan para orar
y aquellos extraídos de su hogar.
Por sus perseguidores,
cegados por el odio.
Perdónales, Padre,
no saben lo que hacen.
Por los que no nos aman,
por los que no sabemos amar.
Por los que sufren y agonizan,
y hoy duermen en el hospital.
Por los que hoy es su última noche
cuyos ojos no verán el nuevo día.
Ten piedad, ten piedad.
Por todos los que sufren la tentación del
suicidio.
Por los dispuestos a dejar ganar al mal.
Por aquellos cuyas noches son interminables
Y a los que en la angustia les ha quitado la
paz.
Kyrie Eleison, Kyrie Eleison,
Kyrie Eleison, Kyrie Eleison, Kyrie Eleison.
Por aquellos que trabajan
en la prostitución
y se ven obligados a vender su amor.
Por los que caen en la trampa,
del vicio y las drogas.
Por los que hoy duermen en prisión,
por los que hoy esperan su ejecución.
Por aquellos a los que torturan.
Por criminales, por los ladrones,
por los que erran en soledad.
Por los que sufren
a indiferencia de los demás.
Kyrie Eleison, Kyrie Eleison.
Por la ciudad, por todos sus habitantes,
que en sus sueños, solo existas Tú.
Por nuestros difuntos,
que aún no han visto Tu rostro.
Por los alejados entre la multitud
Por los niños que descansan
en el seno de su madre.
Por las mujeres que van a dar a luz.
Para que reine tu paz en cada hogar.
Por los que quieren saciar tu sed de amar
Kyrie Eleison, Kyrie Eleison Kyrie Eleison,
Kyrie Eleison, Kyrie Eleison, Kyrie Eleison,
Ten piedad, ten piedad, ten piedad.
Ten piedad, ten piedad, ten piedad.
Ten piedad, ten piedad, ten piedad
Ten piedad, Señor, ten piedad.`
  },
  {
    id: "anima_christi",
    title: "Anima Christi",
    artist: "Tradicional",
    lyrics: `Anima Christi, sanctifica me.
Corpus Christi, salva me.
Sanguis Christi, inebria me.
Aqua lateris Christi, lava me.`
  },
  {
    id: "tu_el_unico_rey_tuyo",
    title: "TÚ el único REY",
    artist: "Tuyo",
    lyrics: `Tú, el Único Rey que tiene que reinar,
El Único Señor al que voy a alabar.
Hoy levanto el corazón al que lo conquistó,
simplemente porque Tú eres Dios.
Tú, el Único Rey que tiene que reinar,
El Único Señor al que voy a alabar.
Hoy levanto el corazón al que lo conquistó,
simplemente porque Tú eres Dios.`
  },
  {
    id: "la_guadalupana",
    title: "La Guadalupana",
    artist: "M. Esperón, E. Cortázar",
    lyrics: `Desde el cielo, una hermosa mañana
desde el cielo, una hermosa mañana,
la Guadalupana, la Guadalupana,
la Guadalupana bajó al Tepeyac.
La Guadalupana, la Guadalupana,
la Guadalupana bajó al Tepeyac.
Suplicante, juntaba sus manos
Suplicante, juntaba sus manos.
Y eran mexicanos, y eran mexicanos
Y eran mexicanos, su porte y su faz.
Y eran mexicanos, y eran mexicanos
Y eran mexicanos, su porte y su faz.
Su llegada llenó de alegría,
su llegada llenó de alegría.
De luz y armonía, de luz y armonía,
de luz y armonía todo el Anáhuac
de luz y armonía, de luz y armonía
de luz y armonía todo el Anáhuac.
Desde entonces, para el mexicano,
desde entonces, para el mexicano.
Ser Guadalupano, ser Guadalupano,
ser Guadalupano es algo esencial.
Ser Guadalupano, ser Guadalupano,
ser Guadalupano es algo esencial.`
  }
];

// ── Diagrama Vectorial del Santo Rosario ──
const RosaryVisualDiagram = () => (
  <div className="rosario-diagram-container">
    <svg className="rosario-diagram-svg" viewBox="0 0 340 440" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="goldBead" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FAF7F2" />
          <stop offset="60%" stopColor="#C5944E" />
          <stop offset="100%" stopColor="#8A6028" />
        </radialGradient>
        <radialGradient id="largeBead" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FAF7F2" />
          <stop offset="60%" stopColor="#5C3D2E" />
          <stop offset="100%" stopColor="#2D1B0E" />
        </radialGradient>
      </defs>

      {/* Decade Loop */}
      <ellipse cx="170" cy="150" rx="125" ry="105" stroke="#C5944E" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />

      {/* 5 Decade Mystery Beads */}
      {/* 3er Misterio (Top) */}
      <circle cx="170" cy="45" r="9" fill="url(#largeBead)" stroke="#C5944E" strokeWidth="1.5" />
      <text x="170" y="30" textAnchor="middle" fill="#5C3D2E" fontSize="9.5" fontWeight="bold">3er Misterio</text>

      {/* 2do Misterio (Top Right) */}
      <circle cx="285" cy="100" r="9" fill="url(#largeBead)" stroke="#C5944E" strokeWidth="1.5" />
      <text x="292" y="92" textAnchor="start" fill="#5C3D2E" fontSize="9.5" fontWeight="bold">2do Misterio</text>

      {/* 1er Misterio (Bottom Right) */}
      <circle cx="275" cy="210" r="9" fill="url(#largeBead)" stroke="#C5944E" strokeWidth="1.5" />
      <text x="282" y="224" textAnchor="start" fill="#5C3D2E" fontSize="9.5" fontWeight="bold">1er Misterio</text>

      {/* 5to Misterio (Bottom Left) */}
      <circle cx="65" cy="210" r="9" fill="url(#largeBead)" stroke="#C5944E" strokeWidth="1.5" />
      <text x="58" y="224" textAnchor="end" fill="#5C3D2E" fontSize="9.5" fontWeight="bold">5to Misterio</text>

      {/* 4to Misterio (Top Left) */}
      <circle cx="55" cy="100" r="9" fill="url(#largeBead)" stroke="#C5944E" strokeWidth="1.5" />
      <text x="48" y="92" textAnchor="end" fill="#5C3D2E" fontSize="9.5" fontWeight="bold">4to Misterio</text>

      {/* Decade Bead Sample */}
      <circle cx="293" cy="155" r="4.5" fill="url(#goldBead)" />
      <text x="302" y="158" fill="#8C7B6B" fontSize="8" fontStyle="italic">10 Ave Marías</text>

      {/* Centerpiece (Medal) */}
      <polygon points="170,255 182,274 158,274" fill="#C5944E" stroke="#5C3D2E" strokeWidth="1" />
      <circle cx="170" cy="268" r="3.5" fill="#FAF7F2" />
      <text x="170" y="290" textAnchor="middle" fill="#5C3D2E" fontSize="9.5" fontWeight="bold">La Salve</text>

      {/* Lower Chain */}
      <line x1="170" y1="274" x2="170" y2="370" stroke="#C5944E" strokeWidth="2" />

      {/* Gloria / Fatima Bead */}
      <circle cx="170" cy="302" r="6.5" fill="url(#largeBead)" stroke="#C5944E" strokeWidth="1" />
      <text x="183" y="305" fill="#5C3D2E" fontSize="8.5" fontWeight="600">Gloria / Fátima</text>

      {/* 3 Ave Marías (Faith, Hope, Charity) */}
      <circle cx="170" cy="322" r="5" fill="url(#goldBead)" />
      <circle cx="170" cy="336" r="5" fill="url(#goldBead)" />
      <circle cx="170" cy="350" r="5" fill="url(#goldBead)" />
      <text x="183" y="339" fill="#8C7B6B" fontSize="8">3 Ave Marías (Fe, Esperanza, Caridad)</text>

      {/* Our Father Bead */}
      <circle cx="170" cy="368" r="6.5" fill="url(#largeBead)" stroke="#C5944E" strokeWidth="1" />
      <text x="183" y="371" fill="#5C3D2E" fontSize="8.5" fontWeight="600">Padre Nuestro</text>

      {/* Crucifix */}
      <g transform="translate(170, 400)">
        <rect x="-3.5" y="-16" width="7" height="30" rx="1.5" fill="#5C3D2E" stroke="#C5944E" strokeWidth="1" />
        <rect x="-12" y="-9" width="24" height="7" rx="1.5" fill="#5C3D2E" stroke="#C5944E" strokeWidth="1" />
        <circle cx="0" cy="-5.5" r="2" fill="#FAF7F2" />
        <text x="0" y="24" textAnchor="middle" fill="#5C3D2E" fontSize="9" fontWeight="bold">Cruz: Señal de la Cruz y Credo</text>
      </g>
    </svg>
  </div>
);

// Apple-style premium haptic vibration helper
const triggerHaptic = (type: 'light' | 'medium' | 'success' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      if (type === 'light') {
        navigator.vibrate(15); // Crisp, light taptic click
      } else if (type === 'medium') {
        navigator.vibrate(25); // Clear pulse for interactions
      } else if (type === 'success') {
        navigator.vibrate([15, 30, 15]); // Double tap sensation
      }
    } catch (e) {
      console.warn("Vibration API failed", e);
    }
  }
};

export default function Landing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [events, setEvents] = useState<Array<any>>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Deep linking initial section
  const [initialSection, setInitialSection] = useState<string | null>(null);

  // App & Prayer Language state with auto-detection from system/browser
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');
  const [guiaLang, setGuiaLang] = useState<'es' | 'en'>('es');

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('en')) {
        setActiveLang('en');
        setGuiaLang('en');
      }
    }
  }, []);

  // Global 450ms Long-Press Tooltip & Tactile Vibration Handler
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let longPressTimer: NodeJS.Timeout | null = null;
    let startX = 0;
    let startY = 0;
    let activeElement: HTMLElement | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-tooltip]') as HTMLElement;
      if (!target) return;

      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      activeElement = target;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;

      longPressTimer = setTimeout(() => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
          try {
            navigator.vibrate([20]);
          } catch {}
        }
        target.classList.add('tooltip-active');
      }, 450);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!longPressTimer) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const distance = Math.hypot(currentX - startX, currentY - startY);

      if (distance > 10) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
        if (activeElement) {
          activeElement.classList.remove('tooltip-active');
          activeElement = null;
        }
      }
    };

    const handleTouchEnd = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      if (activeElement) {
        const el = activeElement;
        setTimeout(() => {
          el?.classList.remove('tooltip-active');
        }, 1500);
        activeElement = null;
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      if (longPressTimer) clearTimeout(longPressTimer);
    };
  }, []);

  // Helper to update URL with clean query parameters without page refresh
  const setModalUrl = useCallback((
    modal: string | null, 
    extraParams?: { 
      seccion?: string | null; 
      deck?: string | null; 
      cancion?: string | null;
      misterio?: string | null;
      variante?: string | null;
      etapa?: string | number | null;
      lang?: string | null;
    }
  ) => {
    const params = new URLSearchParams();
    if (modal) {
      params.set('modal', modal);
      if (extraParams?.deck) params.set('deck', extraParams.deck);
      if (extraParams?.seccion) params.set('seccion', extraParams.seccion);
      if (extraParams?.cancion) params.set('cancion', extraParams.cancion);
      if (extraParams?.misterio) params.set('misterio', extraParams.misterio);
      if (extraParams?.variante) params.set('variante', extraParams.variante);
      if (extraParams?.etapa !== undefined && extraParams?.etapa !== null) {
        params.set('etapa', String(extraParams.etapa));
      }
      if (extraParams?.lang) params.set('lang', extraParams.lang);
    }
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  }, [pathname, router]);

  // Recursos Modals States
  const [showCancionero, setShowCancionero] = useState(false);
  const [showOraciones, setShowOraciones] = useState(false);
  const [showGuiaMisa, setShowGuiaMisa] = useState(false);
  const [showLecturasInResponses, setShowLecturasInResponses] = useState(false);
  const [showConfesion, setShowConfesion] = useState(false);
  const [activeConfesionTab, setActiveConfesionTab] = useState<'pasos' | 'mandamientos' | 'iglesia' | 'capitales' | 'oraciones' | 'todos'>('pasos');

  // Cancionero state
  const [songs] = useState<Array<{ id: string; title: string; artist: string; lyrics: string }>>(defaultSongs);

  // Oraciones state & Deck Architecture
  const [activeOracionDeck, setActiveOracionDeck] = useState<'comunidad' | 'basicas' | 'alimentos' | 'rosario'>('comunidad');
  const [activeOracionIdx, setActiveOracionIdx] = useState(0);
  const [selectedMysteryType, setSelectedMysteryType] = useState<MysteryType>(() => getMysteryTypeForDay());
  const [selectedRosaryVariant, setSelectedRosaryVariant] = useState<RosaryVariant>('mexicana');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const prefs = JSON.parse(localStorage.getItem('rosaryVariantPrefs') || '{"mexicana":0,"misionera":0,"universal":0,"latin":0}');
        let highestVariant = 'mexicana' as RosaryVariant;
        let highestScore = -1;
        (Object.keys(prefs) as RosaryVariant[]).forEach(k => {
          if (prefs[k as RosaryVariant] > highestScore) {
            highestScore = prefs[k as RosaryVariant];
            highestVariant = k as RosaryVariant;
          }
        });
        setSelectedRosaryVariant(highestVariant);
      } catch (e) { }
    }
  }, []);
  const [activeRosarioSubDeck, setActiveRosarioSubDeck] = useState<'all' | 'opening' | 'mysteries' | 'concluding'>('all');
  const [decadeBeadsCount, setDecadeBeadsCount] = useState<number>(0);
  const [openRepeatsState, setOpenRepeatsState] = useState<Record<string, boolean>>({});
  const [oracionTransition, setOracionTransition] = useState<{
    prevIdx: number | null;
    action: 'next' | 'prev' | null;
    isTransitioning: boolean;
  }>({ prevIdx: null, action: null, isTransitioning: false });

  // Increment decade counter with native vibration feedback (25ms bead, 15-30-15ms completion)
  const handleIncrementDecadeCounter = useCallback(() => {
    setDecadeBeadsCount(prev => {
      const next = (prev + 1) % 11; // 0 -> 1 -> ... -> 10 -> 0
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          if (next === 10) {
            navigator.vibrate([15, 30, 15]);
          } else if (next > 0) {
            navigator.vibrate([25]);
          }
        } catch {
          // Ignore
        }
      }
      return next;
    });
  }, []);

  const toggleRepeatItem = useCallback((key: string) => {
    setOpenRepeatsState(prev => ({
      ...prev,
      [key]: prev[key] === false ? true : false
    }));
  }, []);

  const toggleAllRepeats = useCallback((cardId: string) => {
    setOpenRepeatsState(prev => {
      const keys = Object.keys(prev).filter(k => k.startsWith(cardId));
      const anyClosed = keys.some(k => prev[k] === false);
      const nextVal = anyClosed;
      const updated = { ...prev };
      for (let i = 0; i < 4; i++) {
        updated[`${cardId}-rp-${i}`] = nextVal;
      }
      return updated;
    });
  }, []);

  // Get current active deck cards list
  const currentOracionesList = useMemo<PrayerCard[]>(() => {
    switch (activeOracionDeck) {
      case 'basicas':
        return oracionesBasicas;
      case 'alimentos':
        return getFoodPrayersDeck();
      case 'rosario':
        return getSantoRosarioDeck(selectedMysteryType, selectedRosaryVariant, activeRosarioSubDeck);
      case 'comunidad':
      default:
        return oracionesComunidad;
    }
  }, [activeOracionDeck, selectedMysteryType, selectedRosaryVariant, activeRosarioSubDeck]);

  const DECKS_ORDER: Array<'comunidad' | 'basicas' | 'alimentos' | 'rosario'> = ['comunidad', 'basicas', 'alimentos', 'rosario'];
  const activeDeckIndex = useMemo(() => DECKS_ORDER.indexOf(activeOracionDeck), [activeOracionDeck]);
  const activeDeckColorTone = useMemo(() => calculateDeckHSL(activeDeckIndex), [activeDeckIndex]);

  const handleSwitchOracionDeck = (deck: 'comunidad' | 'basicas' | 'alimentos' | 'rosario') => {
    if (deck === activeOracionDeck) return;
    triggerHaptic('light');
    setActiveOracionDeck(deck);
    setDecadeBeadsCount(0);

    let targetIdx = 0;
    if (deck === 'alimentos') {
      targetIdx = new Date().getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
    }
    setActiveOracionIdx(targetIdx);

    if (deck === 'rosario') {
      setSelectedMysteryType(getMysteryTypeForDay());
    }
    setModalUrl('oraciones', { 
      deck,
      misterio: deck === 'rosario' ? selectedMysteryType : undefined,
      variante: deck === 'rosario' ? selectedRosaryVariant : undefined,
      etapa: targetIdx + 1,
      lang: activeLang
    });
  };

  const handleSwitchMystery = (mystery: MysteryType) => {
    if (mystery === selectedMysteryType) return;
    triggerHaptic('light');
    setSelectedMysteryType(mystery);
    setActiveOracionIdx(0);
    setDecadeBeadsCount(0);
    setModalUrl('oraciones', {
      deck: 'rosario',
      misterio: mystery,
      variante: selectedRosaryVariant,
      etapa: 1,
      lang: activeLang
    });
  };

  const handleSwitchRosaryVariant = (variant: RosaryVariant) => {
    if (variant === selectedRosaryVariant) return;
    triggerHaptic('light');
    setSelectedRosaryVariant(variant);
    
    if (typeof window !== 'undefined') {
      try {
        const prefs = JSON.parse(localStorage.getItem('rosaryVariantPrefs') || '{"mexicana":0,"misionera":0,"universal":0,"latin":0}');
        prefs[variant] = (prefs[variant] || 0) + 1;
        localStorage.setItem('rosaryVariantPrefs', JSON.stringify(prefs));
      } catch (e) {}
    }

    setActiveOracionIdx(0);
    setDecadeBeadsCount(0);
    setModalUrl('oraciones', {
      deck: 'rosario',
      misterio: selectedMysteryType,
      variante: variant,
      etapa: 1,
      lang: activeLang
    });
  };

  const handlePrevDeck = () => {
    const currentIdx = DECKS_ORDER.indexOf(activeOracionDeck);
    const newIdx = (currentIdx - 1 + DECKS_ORDER.length) % DECKS_ORDER.length;
    handleSwitchOracionDeck(DECKS_ORDER[newIdx]);
  };

  const handleNextDeck = () => {
    const currentIdx = DECKS_ORDER.indexOf(activeOracionDeck);
    const newIdx = (currentIdx + 1) % DECKS_ORDER.length;
    handleSwitchOracionDeck(DECKS_ORDER[newIdx]);
  };

  // Guía de Misa state
  type GuiaSectionId = 'lecturas' | 'respuestas' | 'cantos' | 'misterio' | 'liturgia' | 'biblia' | 'precepto';

  const GUIA_SECTIONS: Array<{ id: GuiaSectionId; title: string }> = [
    { id: 'lecturas', title: 'Lecturas del Día' },
    { id: 'respuestas', title: 'Respuestas y Diálogos' },
    { id: 'cantos', title: 'Cantos Litúrgicos' },
    { id: 'misterio', title: 'El Misterio Pascual' },
    { id: 'liturgia', title: 'Año Litúrgico' },
    { id: 'biblia', title: 'Citas Bíblicas' },
    { id: 'precepto', title: 'Misas de Precepto' },
  ];

  const [activeGuiaTab, setActiveGuiaTab] = useState<GuiaSectionId>('lecturas');
  const [dailyReadings, setDailyReadings] = useState<MassReadingsResponse | null>(null);
  const [isLoadingReadings, setIsLoadingReadings] = useState(false);
  const [selectedMexicanHymn, setSelectedMexicanHymn] = useState<string>('gloriaMejia');

  const fetchDailyReadings = useCallback(async (force = false) => {
    if (dailyReadings && !force) return;
    setIsLoadingReadings(true);
    try {
      const res = await fetch('/api/mass-readings');
      if (res.ok) {
        const data: MassReadingsResponse = await res.json();
        setDailyReadings(data);
      }
    } catch (err) {
      console.error('Error fetching daily mass readings:', err);
    } finally {
      setIsLoadingReadings(false);
    }
  }, [dailyReadings]);

  useEffect(() => {
    if (showGuiaMisa || activeGuiaTab === 'lecturas') {
      fetchDailyReadings();
    }
  }, [showGuiaMisa, activeGuiaTab, fetchDailyReadings]);
  
  const handlePrevGuia = () => {
    const currentIdx = GUIA_SECTIONS.findIndex(s => s.id === activeGuiaTab);
    const newIdx = (currentIdx - 1 + GUIA_SECTIONS.length) % GUIA_SECTIONS.length;
    const newTab = GUIA_SECTIONS[newIdx].id;
    setActiveGuiaTab(newTab);
    setModalUrl('guia', { seccion: newTab });
    triggerHaptic('light');
  };

  const handleNextGuia = () => {
    const currentIdx = GUIA_SECTIONS.findIndex(s => s.id === activeGuiaTab);
    const newIdx = (currentIdx + 1) % GUIA_SECTIONS.length;
    const newTab = GUIA_SECTIONS[newIdx].id;
    setActiveGuiaTab(newTab);
    setModalUrl('guia', { seccion: newTab });
    triggerHaptic('light');
  };

  const [showAppleMusicGuia, setShowAppleMusicGuia] = useState(false);
  const [activeMisaSectionIdx, setActiveMisaSectionIdx] = useState(0);

  // Sync state with clean URL parameters
  useEffect(() => {
    const modal = searchParams.get('modal');
    const seccion = searchParams.get('seccion');
    const deck = searchParams.get('deck');
    const cancion = searchParams.get('cancion');
    const misterio = searchParams.get('misterio');
    const variante = searchParams.get('variante');
    const etapa = searchParams.get('etapa');
    const lang = searchParams.get('lang');
    
    // Default to closed
    setShowCancionero(false);
    setShowOraciones(false);
    setShowGuiaMisa(false);
    setShowConfesion(false);
    setShowAppleMusicGuia(false);

    if (lang && (lang === 'es' || lang === 'en')) {
      setActiveLang(lang);
      setGuiaLang(lang);
    }

    if (modal === 'cancionero') {
      setShowCancionero(true);
      if (cancion) {
        const sIdx = songs.findIndex(s => s.id.toString() === cancion);
        if (sIdx !== -1) setActiveSongIdx(sIdx);
      }
    } else if (modal === 'oraciones') {
      setShowOraciones(true);
      const isAlimentos = deck === 'alimentos';
      if (deck && (deck === 'comunidad' || deck === 'basicas' || deck === 'alimentos' || deck === 'rosario')) {
        setActiveOracionDeck(deck);
      }
      if (misterio && ['gozosos', 'dolorosos', 'gloriosos', 'luminosos'].includes(misterio)) {
        setSelectedMysteryType(misterio as any);
      }
      if (variante && ['mexicana', 'misionera', 'universal', 'latin'].includes(variante)) {
        setSelectedRosaryVariant(variante as any);
      }
      if (etapa) {
        const parsedEtapa = parseInt(etapa, 10);
        if (!isNaN(parsedEtapa) && parsedEtapa >= 1) {
          setActiveOracionIdx(parsedEtapa - 1);
        }
      } else if (isAlimentos || (!deck && activeOracionDeck === 'alimentos')) {
        setActiveOracionIdx(new Date().getDay());
      }
    } else if (modal === 'guia') {
      setShowGuiaMisa(true);
      if (seccion && GUIA_SECTIONS.some(s => s.id === seccion)) {
        setActiveGuiaTab(seccion as any);
      } else {
        setActiveGuiaTab('lecturas');
      }
    } else if (modal === 'guia_misa_interactiva') {
      setShowAppleMusicGuia(true);
      if (seccion) {
        setInitialSection(seccion);
        const idx = massResponses.findIndex(r => 
          r.title.es.toLowerCase().replace(/\s+/g, '-') === seccion ||
          r.title.en.toLowerCase().replace(/\s+/g, '-') === seccion
        );
        if (idx !== -1) setActiveMisaSectionIdx(idx);
      }
    } else if (modal === 'confesion') {
      setShowConfesion(true);
    }
  }, [searchParams, songs]);
  // Cancionero view states
  const [activeSongIdx, setActiveSongIdx] = useState(0);
  const [songTransition, setSongTransition] = useState<{
    prevIdx: number | null;
    action: 'next' | 'prev' | null;
    isTransitioning: boolean;
  }>({ prevIdx: null, action: null, isTransitioning: false });

  // Load active oracion index from localStorage
  useEffect(() => {
    try {
      const savedIdx = localStorage.getItem("active_oracion_index");
      if (savedIdx) {
        const idx = parseInt(savedIdx, 10);
        if (idx >= 0 && idx < oracionesComunidad.length) {
          setActiveOracionIdx(idx);
        }
      }
    } catch (e) {
      console.error("Error loading active oracion index", e);
    }
  }, []);

  // Lock body scroll when any modal is open to prevent background scrolling
  useEffect(() => {
    if (showCancionero || showOraciones || showGuiaMisa || showConfesion || showAppleMusicGuia) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [showCancionero, showOraciones, showGuiaMisa, showConfesion, showAppleMusicGuia]);

  const [isClosingModal, setIsClosingModal] = useState<string | null>(null);
  const [bounceBtn, setBounceBtn] = useState<string | null>(null);

  // Fidget-style touch and mouse tracking for active cards
  const cardTouchStartX = useRef<number | null>(null);
  const cardTouchStartY = useRef<number | null>(null);
  const cardDragIntent = useRef<'horizontal' | 'vertical' | null>(null);
  const isCardMouseDown = useRef<boolean>(false);
  const [cardDragX, setCardDragX] = useState(0);

  const handleCardTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation(); // Stop bubble to prevent sliding the bottom sheet down
    cardTouchStartX.current = e.touches[0].clientX;
    cardTouchStartY.current = e.touches[0].clientY;
    cardDragIntent.current = null;
    setCardDragX(0);
  };

  const handleCardTouchMove = (e: React.TouchEvent) => {
    if (cardTouchStartX.current === null || cardTouchStartY.current === null) return;
    
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    const deltaX = clientX - cardTouchStartX.current;
    const deltaY = clientY - cardTouchStartY.current;

    if (!cardDragIntent.current) {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        cardDragIntent.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      }
    }

    if (cardDragIntent.current === 'horizontal') {
      e.stopPropagation();
      setCardDragX(deltaX);
    }
  };

  const handleCardTouchEnd = (modalType: string) => {
    if (cardTouchStartX.current === null) return;
    
    if (cardDragIntent.current !== 'vertical') {
      const thresholdX = 80; // 80px horizontal swipe threshold
      
      if (cardDragX > thresholdX) {
        // Swipe right -> previous card (infinite modulo)
        if (modalType === 'cancionero') {
          handleSongNav(activeSongIdx - 1);
        } else {
          handleOracionNav(activeOracionIdx - 1);
        }
      } else if (cardDragX < -thresholdX) {
        // Swipe left -> next card (infinite modulo)
        if (modalType === 'cancionero') {
          handleSongNav(activeSongIdx + 1);
        } else {
          handleOracionNav(activeOracionIdx + 1);
        }
      }
    }
    
    // Reset drag offsets
    setCardDragX(0);

    cardTouchStartX.current = null;
    cardTouchStartY.current = null;
    cardDragIntent.current = null;
    isCardMouseDown.current = false;
  };

  const handleCardMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left-click
    cardTouchStartX.current = e.clientX;
    cardTouchStartY.current = e.clientY;
    cardDragIntent.current = null;
    isCardMouseDown.current = true;
    setCardDragX(0);
  };

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!isCardMouseDown.current || cardTouchStartX.current === null || cardTouchStartY.current === null) return;
    const deltaX = e.clientX - cardTouchStartX.current;
    const deltaY = e.clientY - cardTouchStartY.current;
    if (!cardDragIntent.current) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        cardDragIntent.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      }
    }
    if (cardDragIntent.current === 'horizontal') {
      setCardDragX(deltaX);
    }
  };

  const handleCardMouseUp = (modalType: string) => {
    if (!isCardMouseDown.current) return;
    isCardMouseDown.current = false;
    handleCardTouchEnd(modalType);
  };

  // Deck Switcher Bar Swipe Navigation
  const switcherTouchStartX = useRef<number | null>(null);
  const isSwitcherDragging = useRef<boolean>(false);

  const handleSwitcherTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    switcherTouchStartX.current = clientX;
    isSwitcherDragging.current = true;
  };

  const handleSwitcherTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSwitcherDragging.current || switcherTouchStartX.current === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : ('clientX' in e ? e.clientX : null);
    if (clientX !== null) {
      const deltaX = clientX - switcherTouchStartX.current;
      if (deltaX < -35) {
        handleNextDeck();
      } else if (deltaX > 35) {
        handlePrevDeck();
      }
    }
    switcherTouchStartX.current = null;
    isSwitcherDragging.current = false;
  };

  const closeModalWithAnimation = (modalType: string) => {
    triggerHaptic('light');
    setModalUrl(null);
    setIsClosingModal(null);
    
    // Trigger the physical bounce feedback on the button that launched it
    setBounceBtn(modalType);
    setTimeout(() => {
      setBounceBtn(null);
    }, 400);
  };

  const handleOracionNav = (newIdx: number) => {
    const N = currentOracionesList.length;
    if (N <= 0) return;
    const wrappedIdx = (newIdx + N) % N;
    if (wrappedIdx === activeOracionIdx) return;

    triggerHaptic('light');
    setDecadeBeadsCount(0); // Reset beads tracker for new card

    let action: 'next' | 'prev' = 'next';
    if (newIdx < activeOracionIdx) {
      action = 'prev';
    }
    if (activeOracionIdx === 0 && wrappedIdx === N - 1) {
      action = 'prev';
    } else if (activeOracionIdx === N - 1 && wrappedIdx === 0) {
      action = 'next';
    }

    setOracionTransition({
      prevIdx: activeOracionIdx,
      action,
      isTransitioning: true
    });
    setActiveOracionIdx(wrappedIdx);
    if (activeOracionDeck === 'comunidad') {
      localStorage.setItem("active_oracion_index", String(wrappedIdx));
    }
    setModalUrl('oraciones', {
      deck: activeOracionDeck,
      misterio: activeOracionDeck === 'rosario' ? selectedMysteryType : undefined,
      variante: activeOracionDeck === 'rosario' ? selectedRosaryVariant : undefined,
      etapa: wrappedIdx + 1,
      lang: activeLang
    });

    setTimeout(() => {
      setOracionTransition({
        prevIdx: null,
        action: null,
        isTransitioning: false
      });
    }, 400);
  };



  const handleSongNav = (newIdx: number) => {
    const N = songs.length;
    if (N <= 1) return;
    const wrappedIdx = (newIdx + N) % N;
    if (wrappedIdx === activeSongIdx) return;

    triggerHaptic('light');

    let action: 'next' | 'prev' = 'next';
    if (newIdx < activeSongIdx) {
      action = 'prev';
    }
    if (activeSongIdx === 0 && wrappedIdx === N - 1) {
      action = 'prev';
    } else if (activeSongIdx === N - 1 && wrappedIdx === 0) {
      action = 'next';
    }

    setSongTransition({
      prevIdx: activeSongIdx,
      action,
      isTransitioning: true
    });
    setActiveSongIdx(wrappedIdx);
    setModalUrl('cancionero', { cancion: songs[wrappedIdx].id.toString() });

    setTimeout(() => {
      setSongTransition({
        prevIdx: null,
        action: null,
        isTransitioning: false
      });
    }, 400);
  };
  const handleMisaNav = (newIdx: number) => {
    const N = massResponses.length;
    if (N <= 1) return;
    const wrappedIdx = (newIdx + N) % N;
    if (wrappedIdx === activeMisaSectionIdx) return;

    triggerHaptic('light');
    setActiveMisaSectionIdx(wrappedIdx);
    const slug = massResponses[wrappedIdx].title.es.toLowerCase().replace(/\s+/g, '-');
    setModalUrl('guia_misa_interactiva', { seccion: slug });
  };




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
          <div className="nav-brand" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            <img src="/logo-pandilla.png" alt="Logo La Pandilla de Jesús" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span className="nav-brand-name">La Pandilla de Jesús</span>
              <span className="nav-brand-sub">Grupo Juvenil Catolico . Queretaro</span>
            </div>
          </div>
        </div>
        
        {/* Desktop Links */}
        <ul className="nav-links">
          <li><Link href="/calendario">Eventos</Link></li>
          <li>
            <a 
              href="https://instagram.com/lapandilladejesusqro" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-social-icon-link"
              aria-label="Instagram"
              title="Instagram: @lapandilladejesusqro"
            >
              <InstagramIcon size={17} />
            </a>
          </li>
          <li>
            <a 
              href="https://threads.net/@lapandilladejesusqro" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-social-icon-link"
              aria-label="Threads"
              title="Threads: @lapandilladejesusqro"
            >
              <ThreadsIcon size={17} />
            </a>
          </li>
          <li>
            <a 
              href="https://facebook.com/lapandilladejesusqro" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-social-icon-link"
              aria-label="Facebook"
              title="Facebook: @lapandilladejesusqro"
            >
              <FacebookIcon size={17} />
            </a>
          </li>
          <li>
            <a href="https://wa.me/5214422497485" target="_blank" rel="noopener noreferrer" className="nav-cta-wa" data-tooltip="Escríbenos por WhatsApp para unirte o resolver tus dudas">
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button 
          className={`nav-mobile-btn ${mobileMenuOpen ? "active" : ""}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          data-tooltip="Abrir menú de navegación móvil"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Mobile Dropdown Overlay */}
        <div className={`nav-mobile-overlay ${mobileMenuOpen ? "open" : ""}`}>
          <ul className="nav-mobile-links">
            <li><Link href="/calendario" onClick={() => setMobileMenuOpen(false)}>Eventos y Preceptos</Link></li>
            <li>
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); setModalUrl('guia'); triggerHaptic('medium'); }}
                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}
              >
                Guía de Misa y Lecturas
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); setModalUrl('oraciones'); triggerHaptic('medium'); }}
                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}
              >
                Oraciones y Santo Rosario
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); setModalUrl('cancionero'); triggerHaptic('medium'); }}
                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}
              >
                Cancionero de Horas Santas
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); setModalUrl('confesion'); triggerHaptic('medium'); }}
                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}
              >
                Guía de Confesión
              </button>
            </li>
            <li><Link href="/donaciones" onClick={() => setMobileMenuOpen(false)}>Donaciones</Link></li>
            <li className="nav-mobile-social-row">
              <a href="https://instagram.com/lapandilladejesusqro" target="_blank" rel="noopener noreferrer" className="nav-mobile-social-icon" title="Instagram">
                <InstagramIcon size={18} />
              </a>
              <a href="https://threads.net/@lapandilladejesusqro" target="_blank" rel="noopener noreferrer" className="nav-mobile-social-icon" title="Threads">
                <ThreadsIcon size={18} />
              </a>
              <a href="https://facebook.com/lapandilladejesusqro" target="_blank" rel="noopener noreferrer" className="nav-mobile-social-icon" title="Facebook">
                <FacebookIcon size={18} />
              </a>
            </li>
            <li>
              <a 
                href="https://wa.me/5214422497485" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-mobile-cta-wa"
                onClick={() => setMobileMenuOpen(false)}
                data-tooltip="Escríbenos por WhatsApp para unirte o resolver tus dudas"
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
                    <div className="contact-value">
                      Primer martes de cada mes 20:00 - Reunión de formación<br />
                      Tercer viernes de cada mes - Plática de psicología impartida por Silvia Ocadiz<br />
                      Domingo 13:00 - Misa comunitaria (nos ubicamos al fondo a la izquierda pegados al altar; siempre se busca ayuda para la colecta)
                    </div>
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
                  data-tooltip="Unirse al canal de comunicación y chat grupal de WhatsApp"
                >
                  <WhatsAppIcon size={16} /> WhatsApp Comunidad
                </a>
                
                <Link href="/calendario" className="dynamic-btn btn-events tooltip-down" data-tooltip="Ver el calendario mensual completo de retiros, temas y asambleas">
                  Calendario de Eventos
                </Link>
              </div>

              {/* Social Media Row inside Dashboard Hero Card */}
              <div className="dashboard-social-row">
                <a 
                  href="https://instagram.com/lapandilladejesusqro" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="dashboard-social-chip"
                  title="Instagram: @lapandilladejesusqro"
                >
                  <InstagramIcon size={14} /> Instagram
                </a>
                <a 
                  href="https://threads.net/@lapandilladejesusqro" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="dashboard-social-chip"
                  title="Threads: @lapandilladejesusqro"
                >
                  <ThreadsIcon size={14} /> Threads
                </a>
                <a 
                  href="https://facebook.com/lapandilladejesusqro" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="dashboard-social-chip"
                  title="Facebook: @lapandilladejesusqro"
                >
                  <FacebookIcon size={14} /> Facebook
                </a>
              </div>
            </div>

            {/* CARD 2 — Templo Sede */}
            <div className="info-card templo-card anim-fadeup anim-delay-1" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "2rem", color: "var(--text-dark)", marginBottom: "1rem" }}>Templo Sede: Parroquia de La Sagrada Familia</h2>
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
                  data-tooltip="Visitar el sitio web oficial de la Parroquia de La Sagrada Familia"
                >
                  Visitar Sitio Web Parroquial
                </a>
              </div>
            </div>

            {/* CARD 3 — Donaciones de la Comunidad */}
            <div className="info-card donaciones-card anim-fadeup anim-delay-2" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>🕊️</span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>Donaciones de la Comunidad</h3>
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: "1.55", color: "var(--text-body)", marginBottom: "1.25rem" }}>
                  Apoya las misiones, retiros Kerigma, convivencias y apostolados juveniles de La Pandilla de Jesús.
                </p>
                <Link 
                  href="/donaciones" 
                  className="btn-ver-eventos"
                  style={{ display: "flex", justifyContent: "center", textDecoration: "none", width: "100%" }}
                  data-tooltip="Conocer cómo apoyar a las misiones y actividades de la comunidad"
                >
                  Apoyar a la Comunidad
                </Link>
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
                <Link href="/calendario" className="btn-ver-calendar" data-tooltip="Ver toda la planeación y el calendario de eventos del mes">Ver todo</Link>
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
                  className={`recursos-btn btn-cancionero ${bounceBtn === 'cancionero' ? 'bounce-active' : ''}`} 
                  onClick={() => { setModalUrl('cancionero', { cancion: songs[activeSongIdx]?.id?.toString() || '1' }); triggerHaptic('medium'); }}
                  data-tooltip="Abrir el cancionero de Horas Santas con letras de cantos"
                >
                  <div className="recursos-icon-circle">
                    <img src="/cancionero-icon.svg" alt="Cancionero" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                  </div>
                  Cancionero
                </button>

                <button 
                  className={`recursos-btn btn-oraciones ${bounceBtn === 'oraciones' ? 'bounce-active' : ''}`} 
                  onClick={() => { setModalUrl('oraciones', { deck: activeOracionDeck }); triggerHaptic('medium'); }}
                  data-tooltip="Abrir el tarjetero interactivo de oraciones diarias y comunitarias"
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
                  className={`recursos-btn btn-guia ${bounceBtn === 'guia' ? 'bounce-active' : ''}`} 
                  onClick={() => { setModalUrl('guia', { seccion: activeGuiaTab }); triggerHaptic('medium'); }}
                  data-tooltip="Abrir Guía de Misa para principiantes"
                >
                  <div className="recursos-icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  Guía de Misa
                </button>

                <button 
                  className={`recursos-btn btn-confesion ${bounceBtn === 'confesion' ? 'bounce-active' : ''}`} 
                  onClick={() => { setModalUrl('confesion'); triggerHaptic('medium'); }}
                  data-tooltip="Abrir guía práctica para el sacramento de la confesión"
                >
                  <div className="recursos-icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20" />
                      <path d="M7 8h10" />
                    </svg>
                  </div>
                  Guía de Confesión
                </button>

                <button 
                  className={`recursos-btn btn-rosario ${bounceBtn === 'rosario' ? 'bounce-active' : ''}`} 
                  onClick={() => { 
                    setActiveOracionDeck('rosario'); 
                    setModalUrl('oraciones', { deck: 'rosario' }); 
                    triggerHaptic('medium'); 
                  }}
                  data-tooltip="Rezar el Santo Rosario con guía interactiva"
                >
                  <div className="recursos-icon-circle">
                    <span style={{ fontSize: '18px' }}>📿</span>
                  </div>
                  Santo Rosario
                </button>

                <button 
                  className={`recursos-btn btn-seguir-misa ${bounceBtn === 'seguir-misa' ? 'bounce-active' : ''}`} 
                  onClick={() => { 
                    setActiveGuiaTab('respuestas'); 
                    setModalUrl('guia', { seccion: 'respuestas' }); 
                    triggerHaptic('medium'); 
                  }}
                  data-tooltip="Seguir la Misa: lecturas, salmos, respuestas y cantos litúrgicos"
                >
                  <div className="recursos-icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                      <path d="M12 6v7l3-3" />
                    </svg>
                  </div>
                  Seguir la Misa
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
                <button className="faq-question" onClick={() => toggleFaq(idx)} data-tooltip="Hacer clic para expandir o contraer la respuesta a esta pregunta">
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
          <p>Ven a conocernos en persona o síguenos y escríbenos directamente en nuestras redes oficiales.</p>
          <div className="cta-buttons">
            <Link href="/calendario" className="btn-insta" style={{ fontSize: "1rem", padding: "0.8rem 1.75rem" }} data-tooltip="Consultar la agenda completa de eventos y retiros del mes">
              Ver Calendario de Eventos
            </Link>
            <a
              href="https://wa.me/5214422497485"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa"
              style={{ fontSize: "1rem", padding: "0.8rem 1.75rem" }}
              data-tooltip="Escríbenos directamente por WhatsApp para unirte a la comunidad"
            >
              <WhatsAppIcon size={18} /> WhatsApp Comunidad
            </a>
          </div>

          <div className="cta-social-pills-row">
            <a
              href="https://instagram.com/lapandilladejesusqro"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-social-pill"
              title="Instagram: @lapandilladejesusqro"
            >
              <InstagramIcon size={16} /> Instagram
            </a>
            <a
              href="https://threads.net/@lapandilladejesusqro"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-social-pill"
              title="Threads: @lapandilladejesusqro"
            >
              <ThreadsIcon size={16} /> Threads
            </a>
            <a
              href="https://facebook.com/lapandilladejesusqro"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-social-pill"
              title="Facebook: @lapandilladejesusqro"
            >
              <FacebookIcon size={16} /> Facebook
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
            
            <div className="footer-social-row">
              <a 
                href="https://instagram.com/lapandilladejesusqro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-icon-btn"
                aria-label="Instagram @lapandilladejesusqro"
                title="Instagram @lapandilladejesusqro"
              >
                <InstagramIcon size={18} />
              </a>
              <a 
                href="https://threads.net/@lapandilladejesusqro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-icon-btn"
                aria-label="Threads @lapandilladejesusqro"
                title="Threads @lapandilladejesusqro"
              >
                <ThreadsIcon size={18} />
              </a>
              <a 
                href="https://facebook.com/lapandilladejesusqro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-icon-btn"
                aria-label="Facebook @lapandilladejesusqro"
                title="Facebook @lapandilladejesusqro"
              >
                <FacebookIcon size={18} />
              </a>
              <a 
                href="https://wa.me/5214422497485" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-icon-btn"
                aria-label="WhatsApp Comunidad"
                title="WhatsApp Comunidad"
              >
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-meta-container">
            <span className="footer-copy">© 2026 La Pandilla de Jesús · lapandilladejesusqro.org</span>
            <ul className="footer-links">
              <li><Link href="/calendario">Eventos</Link></li>
              <li><Link href="/donaciones">Donaciones</Link></li>
              <li>
                <a href="https://instagram.com/lapandilladejesusqro" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
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
      <GlobalModal
        isOpen={showCancionero}
        isClosing={false}
        onClose={() => setModalUrl(null)}
        className="apple-music-mode"
        hideCloseBtn={true}
      >
        <AppleMusicLyrics
          title={songs[activeSongIdx]?.title || "Cancionero"}
          subtitle={`de ${songs[activeSongIdx]?.artist || "Desconocido"} (${activeSongIdx + 1} de ${songs.length})`}
          onClose={() => setModalUrl(null)}
          onPrev={() => handleSongNav(activeSongIdx - 1)}
          onNext={() => handleSongNav(activeSongIdx + 1)}
          lines={songs[activeSongIdx]?.lyrics.split('\n').map(l => ({ text: l, isLeft: true })) || []}
        />
      </GlobalModal>

      {/* Oraciones Modal */}
      <GlobalModal
        isOpen={showOraciones}
        isClosing={isClosingModal === 'oraciones'}
        onClose={() => closeModalWithAnimation('oraciones')}
        className="deck-modal-layout"
        headerAction={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', marginRight: '4px' }}>
            <button 
              type="button"
              className="oracion-lang-toggle-btn"
              style={{ margin: 0, padding: '2px 8px', fontSize: '0.75rem', height: '26px' }}
              onClick={() => {
                const nextLang = activeLang === 'es' ? 'en' : 'es';
                setActiveLang(nextLang);
                setGuiaLang(nextLang);
                triggerHaptic('light');
                setModalUrl('oraciones', {
                  deck: activeOracionDeck,
                  misterio: activeOracionDeck === 'rosario' ? selectedMysteryType : undefined,
                  variante: activeOracionDeck === 'rosario' ? selectedRosaryVariant : undefined,
                  etapa: activeOracionIdx + 1,
                  lang: nextLang
                });
              }}
              aria-label="Cambiar idioma / Switch language"
              title={activeLang === 'es' ? "Switch to English" : "Cambiar a Español"}
            >
              {activeLang === 'es' ? '🇲🇽 ES' : '🇺🇸 EN'}
            </button>
            {activeOracionDeck === 'rosario' && (
              <button
                type="button"
                className="rosario-top-counter-btn"
                style={{ margin: 0, padding: '2px 8px', fontSize: '0.75rem', height: '26px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrementDecadeCounter();
                }}
                aria-label={activeLang === 'en' ? `Decade bead counter: ${decadeBeadsCount} of 10` : `Contador de cuentas del misterio: ${decadeBeadsCount} de 10`}
                title={activeLang === 'en' ? `Decade counter: ${decadeBeadsCount}/10 (Tap to count)` : `Contador de cuentas: ${decadeBeadsCount}/10 (Toca para contar)`}
              >
                📿 {decadeBeadsCount}/10
              </button>
            )}
          </div>
        }
        style={{
          ['--deck-active-hsl' as any]: activeDeckColorTone.hslString,
          ['--deck-active-gradient' as any]: activeDeckColorTone.gradientString,
          ['--deck-active-border' as any]: activeDeckColorTone.accentBorder,
          ['--deck-active-badge-bg' as any]: activeDeckColorTone.badgeBg,
          ['--deck-active-badge-text' as any]: activeDeckColorTone.badgeText,
          ['--deck-active-indicator' as any]: activeDeckColorTone.indicatorActive,
          ...activeDeckColorTone.cssVariables,
        }}
      >
        {/* Top Control Bar with Grouped Deck Switcher */}
        <div className="oracion-top-bar">
          <div className="oracion-deck-switcher-new" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="deck-arrows-group">
              <button 
                onClick={handlePrevDeck} 
                style={{ color: activeDeckColorTone.hslString }}
                aria-label={activeLang === 'en' ? "Previous deck" : "Mazo anterior"}
              >
                ◀
              </button>
              <button 
                onClick={handleNextDeck} 
                style={{ color: activeDeckColorTone.hslString }}
                aria-label={activeLang === 'en' ? "Next deck" : "Siguiente mazo"}
              >
                ▶
              </button>
            </div>
            <div className="deck-title-row">
              <span className="title">
                {activeOracionDeck === 'comunidad' && (activeLang === 'en' ? "Community Prayers" : "Oraciones de la Comunidad")}
                {activeOracionDeck === 'basicas' && (activeLang === 'en' ? "Basic Prayers" : "Oraciones Básicas")}
                {activeOracionDeck === 'alimentos' && (activeLang === 'en' ? "Food & Meal Prayers" : "Bendición de Alimentos")}
                {activeOracionDeck === 'rosario' && (activeLang === 'en' ? `Holy Rosary (${MISTERIOS_DATA[selectedMysteryType].nameEn || MISTERIOS_DATA[selectedMysteryType].name})` : `Santo Rosario (${MISTERIOS_DATA[selectedMysteryType].name})`)}
              </span>
              <span className="indicator" style={{ color: activeDeckColorTone.hslString }}>
                • {activeOracionIdx + 1}/{currentOracionesList.length}
              </span>
            </div>
          </div>
        </div>

        <div className="recursos-modal-body">
          <div 
            className="stacked-deck-container"
            style={{
              ['--deck-active-hsl' as any]: activeDeckColorTone.hslString,
              ['--deck-active-gradient' as any]: activeDeckColorTone.gradientString,
              ['--deck-active-border' as any]: activeDeckColorTone.accentBorder,
            }}
          >
            {currentOracionesList.map((oracion, idx) => {
              let cardClass = "stacked-card";
              const { prevIdx, action, isTransitioning } = oracionTransition;

              if (isTransitioning && idx === prevIdx) {
                cardClass += action === 'next' ? ' swiped-left' : ' swiped-right';
              } else {
                const N = currentOracionesList.length;
                const diff = (idx - activeOracionIdx + N) % N;
                
                if (diff === 0) {
                  cardClass += " active";
                } else if (diff === 1) {
                  cardClass += " next";
                } else if (diff === 2) {
                  cardClass += " next-behind";
                } else {
                  cardClass += " far-behind";
                }
              }
              
              const N = currentOracionesList.length;
              const diff = (idx - activeOracionIdx + N) % N;
              const isActive = diff === 0 && !isTransitioning;

              const activeCardStyle: React.CSSProperties = {
                ...(isActive && (cardDragX !== 0) ? {
                  transform: `translate3d(${cardDragX}px, 0, 0) rotate(${cardDragX * 0.04}deg) scale(1)`,
                  boxShadow: '0 24px 48px rgba(45, 27, 14, 0.22), 0 8px 18px rgba(45, 27, 14, 0.12)',
                  zIndex: 20,
                  transition: 'none',
                  cursor: 'grabbing'
                } : (isActive && cardDragX === 0 ? {
                  transition: 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease, border-color 0.3s ease',
                  cursor: 'grab'
                } : {})),
                borderTop: `3px solid ${activeDeckColorTone.hslString}`,
              };
              
              return (
                <div 
                  key={oracion.id || idx} 
                  className={cardClass}
                  style={activeCardStyle}
                  onTouchStart={isActive ? handleCardTouchStart : undefined}
                  onTouchMove={isActive ? handleCardTouchMove : undefined}
                  onTouchEnd={isActive ? () => handleCardTouchEnd('oraciones') : undefined}
                  onTouchCancel={isActive ? () => handleCardTouchEnd('oraciones') : undefined}
                  onMouseDown={isActive ? handleCardMouseDown : undefined}
                  onMouseMove={isActive ? handleCardMouseMove : undefined}
                  onMouseUp={isActive ? () => handleCardMouseUp('oraciones') : undefined}
                  onMouseLeave={isActive ? () => handleCardMouseUp('oraciones') : undefined}
                >
                  <h4>{oracion.titleEn && activeLang === 'en' ? oracion.titleEn : oracion.title}</h4>
                  {oracion.subtitle && (
                    <p className="song-artist">
                      {activeLang === 'en' && oracion.subtitleEn ? oracion.subtitleEn : oracion.subtitle}
                    </p>
                  )}
                  
                  {oracion.isConfigCard ? (
                    <div className="rosario-config-box" onClick={(e) => e.stopPropagation()}>
                      {/* Ultra-Minimalist Rosary Config */}
                      <div className="minimal-rosary-config">
                        
                        {/* Selector de Tradición (System Native) */}
                        <div className="minimal-rosary-dropdown-wrapper" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                          <label htmlFor="rosary-variant-select" className="minimal-rosary-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                            {activeLang === 'en' ? 'Choose Tradition' : 'Tradición a rezar'}
                          </label>
                          <select 
                            id="rosary-variant-select"
                            value={selectedRosaryVariant} 
                            onChange={(e) => handleSwitchRosaryVariant(e.target.value as RosaryVariant)}
                            className="system-native-select"
                            style={{ 
                              width: '100%', 
                              padding: '0.5rem', 
                              fontSize: '1rem', 
                              borderRadius: '8px',
                              border: '1px solid var(--border-subtle)',
                              background: 'var(--surface-card)',
                              color: 'var(--text-dark)'
                            }}
                          >
                            <option value="mexicana">{activeLang === 'en' ? '🇲🇽 Mexican Tradition' : '🇲🇽 Tradición Mexicana'}</option>
                            <option value="misionera">{activeLang === 'en' ? '🌍 Missionary Rosary' : '🌍 Rosario Misionero'}</option>
                            <option value="universal">{activeLang === 'en' ? '🇻🇦 Universal Roman' : '🇻🇦 Universal / Romano'}</option>
                            <option value="latin">{activeLang === 'en' ? '🏛️ Traditional Latin' : '🏛️ Latín Clásico'}</option>
                          </select>
                        </div>

                        {/* Botón Iniciar */}
                        <button
                          type="button"
                          className="rosario-start-prayer-btn minimal-start-btn" 
                          onClick={() => {
                            triggerHaptic('medium');
                            handleOracionNav(1);
                          }}
                        >
                          <span>{activeLang === 'en' ? 'Start Praying' : 'Comenzar a Rezar'}</span>
                          <span style={{ fontSize: '1.1rem' }}>▶</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Visual Guide Rosary Diagram Card */}
                      {oracion.isRosaryGuide && <RosaryVisualDiagram />}

                      {/* 5-Element Mystery Card Structure */}
                      {oracion.isMysteryCard ? (
                        <div className="rosario-mystery-5elements-container">
                          {/* Element 1: AI Generated Artwork */}
                          <div className="rosario-artwork-container" style={{ padding: '0 0 16px 0', border: 'none', background: 'transparent' }}>
                            <img 
                              src={`/rosary-art/${oracion.image}.png`} 
                              alt="Mystery Artwork" 
                              style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }} 
                            />
                            <span className="rosario-artwork-caption" style={{ marginTop: '12px', fontSize: '1rem' }}>
                              {activeLang === 'en' 
                                ? `Mystery ${oracion.mysteryNumber || ''}` 
                                : `Misterio ${oracion.mysteryNumber || ''}`}
                            </span>
                          </div>

                          {/* Element 2: Scriptural Citation Reference */}
                          {oracion.biblicalRef && (
                            <div className="rosario-element-section rosario-element-citation">
                              <span className="rosario-element-badge">
                                📖 {activeLang === 'en' ? 'Biblical Citation' : 'Cita Bíblica'}
                              </span>
                              <span className="rosario-citation-text">{oracion.biblicalRef}</span>
                            </div>
                          )}

                          {/* Element 3: Direct Scripture Text */}
                          {(oracion.scriptureText || oracion.scriptureTextEn) && (
                            <div className="rosario-element-section rosario-element-scripture">
                              <span className="rosario-element-badge">
                                📜 {activeLang === 'en' ? 'Scripture Reading' : 'Lectura de la Palabra'}
                              </span>
                              <blockquote className="rosario-scripture-quote">
                                «{activeLang === 'en' && oracion.scriptureTextEn ? oracion.scriptureTextEn : oracion.scriptureText}»
                              </blockquote>
                            </div>
                          )}

                          {/* Element 4: Deep Meditation */}
                          {(oracion.mysteryMeditation || oracion.mysteryMeditationEn) && (
                            <div className="rosario-element-section rosario-element-meditation">
                              <span className="rosario-element-badge">
                                🕊️ {activeLang === 'en' ? 'Contemplative Meditation' : 'Meditación Contemplativa'}
                              </span>
                              <p className="rosario-meditation-text">
                                {activeLang === 'en' && oracion.mysteryMeditationEn ? oracion.mysteryMeditationEn : oracion.mysteryMeditation}
                              </p>
                            </div>
                          )}

                          {/* Element 5: Reflection Question for the Decade */}
                          {(oracion.reflectionQuestion || oracion.reflectionQuestionEn) && (
                            <div className="rosario-element-section rosario-element-reflection">
                              <span className="rosario-element-badge">
                                💭 {activeLang === 'en' ? 'Decade Reflection Question' : 'Pregunta de Reflexión para la Decena'}
                              </span>
                              <p className="rosario-reflection-question">
                                {activeLang === 'en' && oracion.reflectionQuestionEn ? oracion.reflectionQuestionEn : oracion.reflectionQuestion}
                              </p>
                            </div>
                          )}

                          {/* Element 6: Repeated Prayers Accordion (Padre Nuestro, Ave Maria, Gloria, etc.) */}
                          {oracion.repeatedPrayers && oracion.repeatedPrayers.length > 0 && (
                            <div className="rosario-element-section rosario-element-prayers" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                              <span className="rosario-element-badge">
                                🙏 {activeLang === 'en' ? 'Prayers for this Decade' : 'Oraciones de esta Decena'}
                              </span>
                              
                              <div className="repeated-prayers-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                                {oracion.repeatedPrayers.map((rp, rpIdx) => {
                                  const repeatId = `${oracion.id}-rp-${rpIdx}`;
                                  const isOpen = openRepeatsState[repeatId] || false;
                                  
                                  return (
                                    <div key={rpIdx} className="repeated-prayer-accordion" style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenRepeatsState(prev => ({ ...prev, [repeatId]: !isOpen }));
                                        }}
                                        style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isOpen ? 'var(--cream)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                      >
                                        <span style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                                          {activeLang === 'en' && rp.titleEn ? rp.titleEn : rp.title} 
                                        </span>
                                        <span style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                                      </button>
                                      
                                      {isOpen && (
                                        <div style={{ padding: '0 1rem 1rem 1rem', background: 'var(--cream)' }}>
                                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
                                            {activeLang === 'en' && rp.textEn ? rp.textEn : rp.text}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          
                        </div>
                      ) : (
                        <div className="oracion-card-body-text" style={{ whiteSpace: 'pre-wrap' }}>
                          {(oracion.textEn && activeLang === 'en' ? oracion.textEn : oracion.text)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="deck-nav">
            <button 
              className="deck-nav-btn" 
              onClick={() => handleOracionNav(activeOracionIdx - 1)}
            >
              ◀ {activeLang === 'en' ? 'Previous' : 'Anterior'}
            </button>
            <span className="deck-counter">
              {activeOracionIdx + 1} {activeLang === 'en' ? 'of' : 'de'} {currentOracionesList.length}
            </span>
            <button 
              className="deck-nav-btn" 
              onClick={() => handleOracionNav(activeOracionIdx + 1)}
            >
              {activeLang === 'en' ? 'Next' : 'Siguiente'} ▶
            </button>
          </div>
        </div>
      </GlobalModal>

      {/* Guia de Misa Modal */}
      <GlobalModal
        isOpen={showGuiaMisa}
        isClosing={isClosingModal === 'guia'}
        onClose={() => closeModalWithAnimation('guia')}
        style={{ maxWidth: '650px' }}
      >
        {/* Top Control Bar with clearance for top-right close button */}
        <div className="oracion-top-bar">
          <div className="oracion-deck-switcher-bar">
            <button 
              type="button"
              className="deck-switch-arrow-btn"
              onClick={handlePrevGuia}
              aria-label="Sección anterior"
              title="Sección anterior"
            >
              ◀
            </button>
            <div className="deck-switch-info">
              <span className="deck-switch-badge">Sección {GUIA_SECTIONS.findIndex(s => s.id === activeGuiaTab) + 1}/{GUIA_SECTIONS.length}</span>
              <span className="deck-switch-title">
                {GUIA_SECTIONS.find(s => s.id === activeGuiaTab)?.title}
              </span>
            </div>
            <button 
              type="button"
              className="deck-switch-arrow-btn"
              onClick={handleNextGuia}
              aria-label="Siguiente sección"
              title="Siguiente sección"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="recursos-modal-body">
          {/* Quick tab switcher pills */}
          <div className="guia-tabs">
            {GUIA_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                className={`guia-tab-btn ${activeGuiaTab === sec.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveGuiaTab(sec.id);
                  setModalUrl('guia', { seccion: sec.id });
                  triggerHaptic('light');
                }}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* TAB 1: Lecturas del Día (Live Scraper) */}
          {activeGuiaTab === 'lecturas' && (
            <div className="guia-content-panel">
              <div className="lecturas-header-banner">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 className="lecturas-day-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                    {dailyReadings?.liturgicalDay || 'Liturgia Cotidiana de la Palabra'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => fetchDailyReadings(true)}
                    disabled={isLoadingReadings}
                    style={{ background: 'var(--surface-card, #fff)', border: '1px solid var(--gold)', borderRadius: '4px', padding: '0.25rem 0.6rem', fontSize: '0.78rem', color: 'var(--text-dark)', cursor: 'pointer', fontWeight: 600 }}
                    title="Actualizar lecturas de hoy"
                  >
                    {isLoadingReadings ? 'Cargando...' : '↻ Actualizar'}
                  </button>
                </div>
                {dailyReadings?.saint && (
                  <div className="lecturas-saint-badge">
                    <span>✝</span> {dailyReadings.saint}
                  </div>
                )}
                {dailyReadings?.isFallback && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    (Liturgia común / modo sin conexión)
                  </div>
                )}
              </div>

              {isLoadingReadings && !dailyReadings ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--gold-dark)' }}>
                  <p style={{ fontWeight: 600 }}>Cargando la Liturgia de la Palabra de hoy...</p>
                </div>
              ) : (
                <div className="lecturas-container">
                  {/* Primera Lectura */}
                  <div className="lecturas-reading-card">
                    <div className="lecturas-card-header">
                      <span className="lecturas-card-label">Primera Lectura</span>
                      <span className="lecturas-citation">{dailyReadings?.firstReading?.citation || 'Primera Lectura'}</span>
                    </div>
                    <div className="lecturas-text">
                      {dailyReadings?.firstReading?.text}
                    </div>
                    <div className="lecturas-acclamation">
                      Palabra de Dios. — <strong>Te alabamos, Señor.</strong>
                    </div>
                  </div>

                  {/* Salmo Responsorial */}
                  <div className="lecturas-reading-card">
                    <div className="lecturas-card-header">
                      <span className="lecturas-card-label">Salmo Responsorial</span>
                      <span className="lecturas-citation">{dailyReadings?.psalm?.citation || 'Salmo'}</span>
                    </div>
                    {dailyReadings?.psalm?.response && (
                      <div className="lecturas-response-box">
                        <strong>R.</strong> {dailyReadings.psalm.response}
                      </div>
                    )}
                    <div className="lecturas-text">
                      {dailyReadings?.psalm?.text}
                    </div>
                  </div>

                  {/* Segunda Lectura (si existe en domingos/solemnidades) */}
                  {dailyReadings?.secondReading && (
                    <div className="lecturas-reading-card">
                      <div className="lecturas-card-header">
                        <span className="lecturas-card-label">Segunda Lectura</span>
                        <span className="lecturas-citation">{dailyReadings.secondReading.citation}</span>
                      </div>
                      <div className="lecturas-text">
                        {dailyReadings.secondReading.text}
                      </div>
                      <div className="lecturas-acclamation">
                        Palabra de Dios. — <strong>Te alabamos, Señor.</strong>
                      </div>
                    </div>
                  )}

                  {/* Santo Evangelio */}
                  <div className="lecturas-reading-card" style={{ borderColor: 'rgba(212, 160, 23, 0.5)', background: 'rgba(255, 252, 245, 0.95)' }}>
                    <div className="lecturas-card-header">
                      <span className="lecturas-card-label" style={{ color: 'var(--gold-dark)', fontWeight: 800 }}>✠ Santo Evangelio</span>
                      <span className="lecturas-citation">{dailyReadings?.gospel?.citation || 'Santo Evangelio'}</span>
                    </div>
                    <div className="lecturas-text" style={{ fontWeight: 500 }}>
                      {dailyReadings?.gospel?.text}
                    </div>
                    <div className="lecturas-acclamation">
                      Palabra del Señor. — <strong>Gloria a ti, Señor Jesús.</strong>
                    </div>
                  </div>

                  {/* Meditación Patrística */}
                  {dailyReadings?.meditation && (
                    <div className="lecturas-reading-card" style={{ background: 'rgba(245, 240, 232, 0.6)' }}>
                      <div className="lecturas-card-header">
                        <span className="lecturas-card-label">Meditación y Reflexión</span>
                        <span className="lecturas-citation" style={{ fontSize: '0.85rem' }}>{dailyReadings.meditation.author}</span>
                      </div>
                      <div className="lecturas-text" style={{ fontStyle: 'italic', fontSize: '0.88rem' }}>
                        «{dailyReadings.meditation.text}»
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Respuestas y Diálogos de la Misa */}
          {activeGuiaTab === 'respuestas' && (
            <div className="guia-content-panel">
              <h4>Respuestas y Diálogos de la Santa Misa</h4>
              <p style={{ marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Sigue cada diálogo entre el celebrante y la asamblea, las oraciones privadas del sacerdote y las posturas litúrgicas (de pie, sentados, de rodillas) estructuradas en los 5 momentos del Misal Romano:
              </p>

              {/* Lecturas del Día (duplicated summary) */}
              {dailyReadings && (
                <div style={{ marginBottom: '1.5rem', background: 'rgba(255, 252, 245, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setShowLecturasInResponses(prev => !prev)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📖 Lecturas del Día</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{dailyReadings.liturgicalDay || 'Liturgia de la Palabra'}</div>
                    </div>
                    <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: showLecturasInResponses ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                  </button>
                  {showLecturasInResponses && (
                    <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {dailyReadings.saint && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', fontStyle: 'italic' }}>✝ {dailyReadings.saint}</div>
                      )}
                      <div className="lecturas-reading-card">
                        <div className="lecturas-card-header">
                          <span className="lecturas-card-label">Primera Lectura</span>
                          <span className="lecturas-citation">{dailyReadings.firstReading?.citation}</span>
                        </div>
                        <div className="lecturas-text">{dailyReadings.firstReading?.text}</div>
                        <div className="lecturas-acclamation">Palabra de Dios. — <strong>Te alabamos, Señor.</strong></div>
                      </div>
                      <div className="lecturas-reading-card">
                        <div className="lecturas-card-header">
                          <span className="lecturas-card-label">Salmo Responsorial</span>
                          <span className="lecturas-citation">{dailyReadings.psalm?.citation}</span>
                        </div>
                        {dailyReadings.psalm?.response && (
                          <div className="lecturas-response-box"><strong>R.</strong> {dailyReadings.psalm.response}</div>
                        )}
                        <div className="lecturas-text">{dailyReadings.psalm?.text}</div>
                      </div>
                      {dailyReadings.secondReading && (
                        <div className="lecturas-reading-card">
                          <div className="lecturas-card-header">
                            <span className="lecturas-card-label">Segunda Lectura</span>
                            <span className="lecturas-citation">{dailyReadings.secondReading.citation}</span>
                          </div>
                          <div className="lecturas-text">{dailyReadings.secondReading.text}</div>
                          <div className="lecturas-acclamation">Palabra de Dios. — <strong>Te alabamos, Señor.</strong></div>
                        </div>
                      )}
                      <div className="lecturas-reading-card" style={{ borderColor: 'rgba(212, 160, 23, 0.5)', background: 'rgba(255, 252, 245, 0.95)' }}>
                        <div className="lecturas-card-header">
                          <span className="lecturas-card-label" style={{ color: 'var(--gold-dark)', fontWeight: 800 }}>✠ Santo Evangelio</span>
                          <span className="lecturas-citation">{dailyReadings.gospel?.citation}</span>
                        </div>
                        <div className="lecturas-text" style={{ fontWeight: 500 }}>{dailyReadings.gospel?.text}</div>
                        <div className="lecturas-acclamation">Palabra del Señor. — <strong>Gloria a ti, Señor Jesús.</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {massResponses.map((sec, sIdx) => (
                  <div 
                    key={sIdx}
                    style={{ 
                      background: 'var(--surface-card, #fdfbf7)', 
                      border: '1px solid var(--border-subtle)', 
                      borderRadius: 'var(--radius-xs)', 
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase' }}>
                        Parte {sIdx + 1} de {massResponses.length}
                      </span>
                      <h5 style={{ margin: '0.15rem 0 0', fontSize: '1rem', color: 'var(--text-dark)' }}>
                        {sec.title[guiaLang]}
                      </h5>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {sec.parts.length} momentos litúrgicos
                      </span>
                    </div>
                    <button
                      type="button"
                      className="recursos-btn btn-guia"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', borderRadius: 'var(--radius-xs)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      onClick={() => {
                        setActiveMisaSectionIdx(sIdx);
                        const slug = sec.title.es.toLowerCase().replace(/\s+/g, '-');
                        setModalUrl('guia_misa_interactiva', { seccion: slug });
                      }}
                    >
                      Abrir en Letras ▶
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                <button
                  type="button"
                  className="recursos-btn btn-guia"
                  style={{ margin: '0 auto', maxWidth: '340px', display: 'inline-flex', padding: '0.9rem 1.6rem', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 700 }}
                  onClick={() => {
                    setActiveMisaSectionIdx(0);
                    const slug = massResponses[0]?.title?.es?.toLowerCase().replace(/\s+/g, '-') || 'ritos-iniciales';
                    setModalUrl('guia_misa_interactiva', { seccion: slug });
                  }}
                >
                  Abrir Modo Interactivo Completo ▶
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Cantos Litúrgicos Mexicanos */}
          {activeGuiaTab === 'cantos' && (
            <div className="guia-content-panel">
              <h4>Cantos Litúrgicos Mexicanos</h4>
              <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                Versiones cantadas tradicionales de la liturgia en México (música de Alejandro Mejía y tradición litúrgica nacional):
              </p>

              <div className="cantos-selector-grid">
                {Object.entries(MEXICAN_SUNG_HYMNS).map(([key, hymn]) => (
                  <button
                    key={key}
                    type="button"
                    className={`canto-select-btn ${selectedMexicanHymn === key ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedMexicanHymn(key);
                      triggerHaptic('light');
                    }}
                  >
                    {hymn.title}
                  </button>
                ))}
              </div>

              {MEXICAN_SUNG_HYMNS[selectedMexicanHymn] && (
                <div className="canto-lyrics-card">
                  <div className="canto-card-meta">
                    <div>
                      <h5 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>
                        {MEXICAN_SUNG_HYMNS[selectedMexicanHymn].title}
                      </h5>
                      <span className="canto-composer-tag">
                        Compositor: {MEXICAN_SUNG_HYMNS[selectedMexicanHymn].composer}
                      </span>
                    </div>
                    <span className="canto-moment-badge">
                      {MEXICAN_SUNG_HYMNS[selectedMexicanHymn].liturgicalMoment}
                    </span>
                  </div>

                  <div className="canto-lyrics-text">
                    {MEXICAN_SUNG_HYMNS[selectedMexicanHymn].lyrics}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: El Misterio Pascual */}
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

          {/* TAB 5: Año Litúrgico */}
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

          {/* TAB 6: Citas Bíblicas */}
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

          {/* TAB 7: Misas de Precepto */}
          {activeGuiaTab === 'precepto' && (
            <div className="guia-content-panel">
              <h4>Calendario de Misas de Precepto</h4>
              <p>
                Además de todos los domingos del año, la Iglesia manda participar de la Santa Misa en estos días santos de precepto:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-light)' }}>1 de Enero</strong>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>
                    Santa María, Madre de Dios.
                  </p>
                </div>

                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-light)' }}>Jueves de la Sexta Semana de Pascua</strong>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>
                    La Ascensión del Señor. (En muchos lugares se traslada al domingo siguiente).
                  </p>
                </div>

                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-light)' }}>Jueves después de la Santísima Trinidad</strong>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>
                    Corpus Christi. (Frecuentemente trasladado al domingo siguiente).
                  </p>
                </div>

                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-light)' }}>15 de Agosto</strong>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>
                    La Asunción de la Virgen María.
                  </p>
                </div>

                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-light)' }}>1 de Noviembre</strong>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>
                    Fiesta de Todos los Santos.
                  </p>
                </div>

                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-light)' }}>8 de Diciembre</strong>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>
                    La Inmaculada Concepción.
                  </p>
                </div>

                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-light)' }}>25 de Diciembre</strong>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>
                    La Natividad de nuestro Señor Jesucristo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </GlobalModal>

      {/* Guía de Confesión Modal */}
      <GlobalModal
        isOpen={showConfesion}
        isClosing={isClosingModal === 'confesion'}
        onClose={() => closeModalWithAnimation('confesion')}
        className="confesion-modal-layout"
      >
        {/* Top Control Bar with Tab Switcher & Language Toggle */}
        <div className="oracion-top-bar">
          <div className="confesion-tab-switcher-bar">
            {[
              { id: 'pasos', label: activeLang === 'en' ? '5 Steps' : '5 Pasos', icon: '🕊️' },
              { id: 'mandamientos', label: activeLang === 'en' ? '10 Commandments' : '10 Mandamientos', icon: '📜' },
              { id: 'iglesia', label: activeLang === 'en' ? 'Church' : 'Iglesia', icon: '⛪' },
              { id: 'capitales', label: activeLang === 'en' ? 'Capital Sins' : 'Pecados Capitales', icon: '⚠️' },
              { id: 'oraciones', label: activeLang === 'en' ? 'Prayers' : 'Oraciones', icon: '🙏' },
              { id: 'todos', label: activeLang === 'en' ? 'All' : 'Todo', icon: '📖' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`confesion-nav-pill ${activeConfesionTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveConfesionTab(tab.id as any);
                  triggerHaptic('light');
                }}
              >
                <span className="pill-icon">{tab.icon}</span>
                <span className="pill-text">{tab.label}</span>
              </button>
            ))}
          </div>

          <button 
            type="button"
            className="oracion-lang-toggle-btn"
            onClick={() => {
              const nextLang = activeLang === 'es' ? 'en' : 'es';
              setActiveLang(nextLang);
              setGuiaLang(nextLang);
              triggerHaptic('light');
              setModalUrl('confesion', { lang: nextLang });
            }}
            aria-label="Cambiar idioma / Switch language"
            title={activeLang === 'es' ? "Switch to English" : "Cambiar a Español"}
          >
            {activeLang === 'es' ? '🇲🇽 ES' : '🇺🇸 EN'}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="confesion-modal-body">
          {/* Hero Banner: Title, Subtitle, Biblical Quote & Sanctuary Environment */}
          <div className="confesion-hero-card">
            <div className="confesion-hero-badge">
              {activeLang === 'en' ? 'Sacrament of Reconciliation' : 'Sacramento de la Reconciliación'}
            </div>
            <h3 className="confesion-hero-title">
              {CONFESION_DATA.header.title[activeLang]}
            </h3>
            <p className="confesion-hero-sub">
              {CONFESION_DATA.header.subtitle[activeLang]}
            </p>

            <div className="confesion-biblical-box">
              <span className="confesion-quote-mark">“</span>
              <p className="confesion-quote-text">
                {CONFESION_DATA.header.biblicalQuote.text[activeLang]}
              </p>
              <span className="confesion-quote-ref">
                — {CONFESION_DATA.header.biblicalQuote.ref}
              </span>
            </div>

            <div className="confesion-sanctuary-notice">
              <span className="sanctuary-icon">🏛️</span>
              <div>
                <strong>{CONFESION_DATA.header.sanctuaryContext.title[activeLang]}:</strong>{" "}
                {CONFESION_DATA.header.sanctuaryContext.text[activeLang]}
              </div>
            </div>
          </div>

          {/* Section: Oración Preparatoria (when tab is 'oraciones' or 'todos') */}
          {(activeConfesionTab === 'oraciones' || activeConfesionTab === 'todos') && (
            <div className="confesion-card prayer-card">
              <div className="confesion-card-header">
                <span className="confesion-card-icon">🙏</span>
                <h4>{CONFESION_DATA.oracionPreparatoria.title[activeLang]}</h4>
              </div>
              <p className="confesion-prayer-body">
                {CONFESION_DATA.oracionPreparatoria.text[activeLang]}
              </p>
            </div>
          )}

          {/* Section: 5 Pasos para una Buena Confesión */}
          {(activeConfesionTab === 'pasos' || activeConfesionTab === 'todos') && (
            <div className="confesion-section-group">
              <div className="confesion-section-header">
                <span className="confesion-section-badge">🕊️</span>
                <h4>
                  {activeLang === 'en' ? '5 Steps for a Good Confession' : 'Cinco Pasos para una Buena Confesión'}
                </h4>
              </div>

              <div className="confesion-steps-grid">
                {CONFESION_DATA.cincoPasos.map((step) => (
                  <div key={step.number} className="confesion-step-card">
                    <div className="step-header">
                      <span className="step-number-bubble">{step.number}</span>
                      <h5 className="step-title">{step.title[activeLang]}</h5>
                    </div>
                    <p className="step-summary">{step.summary[activeLang]}</p>

                    {step.qualities && (
                      <div className="step-qualities-box">
                        <div className="step-qualities-label">
                          {step.inPersonaChristi?.[activeLang]}
                        </div>
                        <div className="qualities-chips-row">
                          {step.qualities.map((q) => (
                            <div key={q.name.es} className="quality-card">
                              <div className="quality-head">
                                <span className="quality-icon">{q.icon}</span>
                                <span className="quality-name">{q.name[activeLang]}</span>
                              </div>
                              <div className="quality-desc">{q.desc[activeLang]}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.pastoralNote && (
                      <div className="step-pastoral-note">
                        <span className="note-icon">📌</span>
                        <p>{step.pastoralNote[activeLang]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: 10 Mandamientos de la Ley de Dios */}
          {(activeConfesionTab === 'mandamientos' || activeConfesionTab === 'todos') && (
            <div className="confesion-section-group">
              <div className="confesion-section-header">
                <span className="confesion-section-badge">📜</span>
                <div>
                  <h4>
                    {activeLang === 'en' ? '10 Commandments of God' : '10 Mandamientos de la Ley de Dios'}
                  </h4>
                  <p className="confesion-section-desc">
                    {activeLang === 'en' ? 'Examination of Conscience: reflect on each fault to prepare your heart.' : 'Examen de Conciencia: reflexiona en cada falta para disponer el corazón.'}
                  </p>
                </div>
              </div>

              <div className="confesion-mandamientos-grid">
                {CONFESION_DATA.examenMandamientos.map((m) => (
                  <div key={m.number} className="confesion-mandamiento-card">
                    <div className="mandamiento-card-head">
                      <span className="mandamiento-badge">{m.number}</span>
                      <h5>{m.title[activeLang]}</h5>
                    </div>
                    <ul className="mandamiento-faltas-list">
                      {m.faltas[activeLang].map((falta, fIdx) => (
                        <li key={fIdx}>{falta}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Mandamientos de la Iglesia */}
          {(activeConfesionTab === 'iglesia' || activeConfesionTab === 'todos') && (
            <div className="confesion-section-group">
              <div className="confesion-section-header">
                <span className="confesion-section-badge">⛪</span>
                <div>
                  <h4>{CONFESION_DATA.mandamientosIglesia.title[activeLang]}</h4>
                  <span className="confesion-alert-badge">
                    ⚠️ {CONFESION_DATA.mandamientosIglesia.warning[activeLang]}
                  </span>
                </div>
              </div>

              <div className="confesion-iglesia-grid">
                {CONFESION_DATA.mandamientosIglesia.items.map((item) => (
                  <div key={item.number} className="confesion-iglesia-card">
                    <div className="iglesia-card-head">
                      <span className="iglesia-badge">{item.number}º</span>
                      <h5>{item.title[activeLang]}</h5>
                    </div>
                    <p className="iglesia-card-desc">{item.desc[activeLang]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Pecados Capitales */}
          {(activeConfesionTab === 'capitales' || activeConfesionTab === 'todos') && (
            <div className="confesion-section-group">
              <div className="confesion-section-header">
                <span className="confesion-section-badge">⚠️</span>
                <div>
                  <h4>{CONFESION_DATA.pecadosCapitales.title[activeLang]}</h4>
                  <p className="confesion-section-desc">
                    {activeLang === 'en' ? 'Recognize root vices and disorderly tendencies to confess them with sincerity.' : 'Reconoce las raíces del pecado y tendencias desordenadas para confesarlas con sincero dolor.'}
                  </p>
                </div>
              </div>

              <div className="confesion-capitales-grid">
                {CONFESION_DATA.pecadosCapitales.items.map((sin) => (
                  <div key={sin.number} className="confesion-capital-card">
                    <div className="capital-card-head">
                      <span className="capital-icon">{sin.icon}</span>
                      <h5>{sin.name[activeLang]}</h5>
                    </div>
                    <p className="capital-definition">{sin.definition[activeLang]}</p>
                    <div className="capital-manifestations">
                      <strong>{activeLang === 'en' ? 'Manifestations / Sins:' : 'Manifestaciones / Faltas:'}</strong>
                      <ul>
                        {sin.manifestations[activeLang].map((man, mIdx) => (
                          <li key={mIdx}>{man}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Oración Final (Acto de Arrepentimiento) */}
          {(activeConfesionTab === 'oraciones' || activeConfesionTab === 'todos') && (
            <div className="confesion-card prayer-card final-prayer">
              <div className="confesion-card-header">
                <span className="confesion-card-icon">✨</span>
                <h4>{CONFESION_DATA.oracionFinal.title[activeLang]}</h4>
              </div>
              <p className="confesion-prayer-body">
                {CONFESION_DATA.oracionFinal.text[activeLang]}
              </p>
            </div>
          )}

          {/* Ecclesiastical Seal */}
          <div className="confesion-seal">
            <span className="seal-cross">✠</span>
            <p>{CONFESION_DATA.sello[activeLang]}</p>
          </div>
        </div>
      </GlobalModal>

      {/* Guia de Misa Apple Music Style */}
      <GlobalModal
        isOpen={showAppleMusicGuia}
        isClosing={false}
        onClose={() => setModalUrl(null)}
        className="apple-music-mode"
        hideCloseBtn={true}
      >
        <AppleMusicLyrics
          title="Guía de Misa"
          subtitle={`${massResponses[activeMisaSectionIdx].title[guiaLang]} (${activeMisaSectionIdx + 1} de ${massResponses.length})`}
          langToggle={
            <button 
              className="lang-toggle-btn" 
              onClick={(e) => { e.stopPropagation(); setGuiaLang(l => l === 'es' ? 'en' : 'es'); }}
            >
              {guiaLang === 'es' ? '🇺🇸 English' : '🇲🇽 Español'}
            </button>
          }
          onClose={() => setModalUrl(null)}
          onPrev={() => handleMisaNav(activeMisaSectionIdx - 1)}
          onNext={() => handleMisaNav(activeMisaSectionIdx + 1)}
          onSectionChange={(sectionName) => setModalUrl('guia_misa_interactiva', { seccion: sectionName.toLowerCase().replace(/\s+/g, '-') })}
          initialSection={initialSection}
          lines={[
            { text: `---SECTION---${massResponses[activeMisaSectionIdx].title[guiaLang]}` },
            ...massResponses[activeMisaSectionIdx].parts.flatMap(part => [
              { text: `---SECTION---${part.title[guiaLang]}` },
              ...part.lines[guiaLang].map(l => ({
                text: l.text,
                speaker: l.speaker,
                isLeft: l.speaker === 'Sacerdote' || l.speaker === 'Celebrant' || l.speaker === 'Priest' || l.speaker === 'Diácono'
              }))
            ])
          ]}
        />
      </GlobalModal>

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
