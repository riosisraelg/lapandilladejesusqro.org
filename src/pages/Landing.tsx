import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchICalFeed } from "../utils/icalParser";
import { ICAL_FEED_URL } from "../config";
import "./Landing.css";

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
        <Link 
          to="/calendario" 
          style={{ color: "var(--gold)", textDecoration: "underline", fontWeight: "600" }}
        >
          Calendario
        </Link>{" "}
        de esta página.
      </span>
    )
  }
];

export default function Landing() {
  const [events, setEvents] = useState<Array<any>>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

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

    return {
      today: todayList,
      tomorrow: tomorrowList,
      remaining: remainingList,
      hasAny: thisWeek.length > 0
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
          <li><Link to="/calendario">Eventos</Link></li>
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
            <li><Link to="/calendario" onClick={() => setMobileMenuOpen(false)}>Eventos</Link></li>
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
                
                <Link to="/calendario" className="dynamic-btn btn-events">
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

          {/* CARD 3 (RIGHT) — Eventos de la Semana */}
          <div className="upcoming-card anim-fadeup anim-delay-2">
            <div className="upcoming-header">
              <div className="upcoming-title-group">
                <h3>Eventos próximos</h3>
                <p>Planificados para la semana en curso</p>
              </div>
              <Link to="/calendario" className="btn-ver-calendar">Ver todo</Link>
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
              <span className="stat-number">100+</span>
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
            <Link to="/calendario" className="btn-insta" style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}>
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
              <li><Link to="/calendario">Eventos</Link></li>
              <li>
                <a href="https://wa.me/5214422497485" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

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
