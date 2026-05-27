"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchICalFeed } from "../../utils/icalParser";
import { ICAL_FEED_URL } from "../../config";
;

// ── SVG Icons ──
const ClockSmIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);

const MapPinSmIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const CalendarSmIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CalendarCheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <polyline points="9 16 11 18 15 14"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M8 14h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 18h.01"/>
    <path d="M12 18h.01"/>
    <path d="M16 18h.01"/>
  </svg>
);

const OutlookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M12 14v4"/>
    <path d="M10 14h4"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.1.09 2.23-.58 2.95-1.39z"/>
  </svg>
);

const EVENT_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "Retiro", label: "Retiros" },
  { key: "Oración", label: "Misas" },
  { key: "Colecta", label: "Colectas" },
  { key: "Misión", label: "Misiones" },
  { key: "Reunión", label: "Reuniones" },
  { key: "Otro", label: "Otros" },
];

export default function Calendario() {
  const [events, setEvents] = useState<Array<any>>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const icalUrl = ICAL_FEED_URL;

  useEffect(() => {
    document.body.classList.add("landing-body");
    return () => document.body.classList.remove("landing-body");
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch and parse external iCal events
        let icsEvents: any[] = [];
        if (icalUrl) {
          icsEvents = await fetchICalFeed(icalUrl);
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

  const embedSrc = useMemo(() => {
    if (icalUrl && icalUrl.includes("calendar.google.com")) {
      const match = icalUrl.match(/\/ical\/([^\/]+)\/public/);
      if (match && match[1]) {
        return `https://calendar.google.com/calendar/embed?src=${match[1]}&ctz=America%2FMexico_City&mode=MONTH&showPrint=0&showTabs=0&showCalendars=0&showTz=0`;
      }
    }
    // Fallback embed src
    return `https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FMexico_City&mode=MONTH&showPrint=0&showTabs=0&showCalendars=0&showTz=0`;
  }, [icalUrl]);

  const filteredEvents = useMemo(() => {
    const upcoming = events.filter((e) => new Date(e.date + "T23:59:59") >= new Date());
    if (activeFilter === "all") return upcoming;
    return upcoming.filter((e) => e.type === activeFilter);
  }, [events, activeFilter]);

  const formatDate = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });

  const cleanICalDate = (dtLine: string) => {
    if (!dtLine) return "";
    const colonIdx = dtLine.indexOf(":");
    return colonIdx !== -1 ? dtLine.substring(colonIdx + 1).trim() : dtLine.trim();
  };

  const buildGCalLink = (ev: any) => {
    let datesStr = "";
    if (ev.dtstart && ev.dtend) {
      const start = cleanICalDate(ev.dtstart);
      const end = cleanICalDate(ev.dtend);
      datesStr = `${start}/${end}`;
    } else {
      const dc = ev.date.replace(/-/g, "");
      datesStr = `${dc}/${dc}`;
    }
    const p = new URLSearchParams({
      action: "TEMPLATE", text: ev.title, dates: datesStr,
      details: ev.description || "", location: ev.location || "",
    });
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
  };

  const buildOutlookLink = (ev: any) => {
    let startdt = ev.date;
    let enddt = ev.date;
    let allday = "true";
    
    if (ev.dtstart && ev.dtend) {
      const cleanStart = cleanICalDate(ev.dtstart);
      const cleanEnd = cleanICalDate(ev.dtend);
      
      if (cleanStart.includes("T")) {
        const formatISO = (val: string) => {
          const y = val.substring(0, 4);
          const m = val.substring(4, 6);
          const d = val.substring(6, 8);
          const hh = val.substring(9, 11);
          const mm = val.substring(11, 13);
          const ss = val.substring(13, 15) || "00";
          return `${y}-${m}-${d}T${hh}:${mm}:${ss}Z`;
        };
        startdt = formatISO(cleanStart);
        enddt = formatISO(cleanEnd);
        allday = "false";
      }
    }
    
    const p = new URLSearchParams({
      path: "/calendar/action/compose", rru: "addevent",
      subject: ev.title, startdt, enddt, allday,
      body: ev.description || "", location: ev.location || "",
    });
    return `https://outlook.live.com/calendar/0/deeplink/compose?${p.toString()}`;
  };

  const downloadICSFile = (ev: any) => {
    const titleEscaped = ev.title.replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');
    const descEscaped = (ev.description || '').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');
    const locEscaped = (ev.location || '').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');

    let dtStartLine = "";
    let dtEndLine = "";

    if (ev.dtstart && ev.dtend) {
      const start = cleanICalDate(ev.dtstart);
      const end = cleanICalDate(ev.dtend);
      
      if (start.includes("T")) {
        dtStartLine = `DTSTART:${start}`;
        dtEndLine = `DTEND:${end}`;
      } else {
        dtStartLine = `DTSTART;VALUE=DATE:${start}`;
        dtEndLine = `DTEND;VALUE=DATE:${end}`;
      }
    } else {
      const d = new Date(ev.date + "T12:00:00");
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);

      const formatDateICS = (dateObj: Date) => {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${y}${m}${day}`;
      };

      const dtStart = formatDateICS(d);
      const dtEnd = formatDateICS(nextDay);
      dtStartLine = `DTSTART;VALUE=DATE:${dtStart}`;
      dtEndLine = `DTEND;VALUE=DATE:${dtEnd}`;
    }

    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//La Pandilla de Jesus//Eventos//ES',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${titleEscaped}`,
      dtStartLine,
      dtEndLine,
      `DESCRIPTION:${descEscaped}`,
      `LOCATION:${locEscaped}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    const icsString = icsLines.join('\r\n');
    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ev.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`nav ${mobileMenuOpen ? "nav-expanded" : ""}`}>
        <div className="nav-left">
          <div className="nav-brand">
            <Link href="/" style={{ textDecoration: "none" }}>
              <span className="nav-brand-name">La Pandilla de Jesús</span>
            </Link>
            <span className="nav-brand-sub">Comunidad católica · Querétaro</span>
          </div>
        </div>
        
        {/* Desktop Links */}
        <ul className="nav-links">
          <li><Link href="/">Inicio</Link></li>
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
            <li><Link href="/" onClick={() => setMobileMenuOpen(false)}>Inicio</Link></li>
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

      {/* ── MAIN ── */}
      <main className="landing-main">
        <section className="events-section" style={{ marginTop: "1rem" }}>
          <div className="events-section-header">
            <h2>Centro de Eventos</h2>
            <p>Consulta el calendario completo para ver detalles de cada actividad y apuntarte.</p>
          </div>

          <div className="events-layout">
            {/* Google Calendar Embed */}
            <div className="calendar-embed-wrapper">
              <iframe
                src={embedSrc}
                title="Calendario de La Pandilla de Jesús"
              ></iframe>
            </div>

            {/* Event Sidebar */}
            <div className="event-sidebar">
              <div className="filter-pills">
                {EVENT_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    className={`filter-pill ${activeFilter === f.key ? "active" : ""}`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredEvents.length === 0 ? (
                <div className="events-empty">
                  <p>No hay eventos con este filtro en este momento.</p>
                </div>
              ) : (
                filteredEvents.map((ev) => (
                  <div key={ev.id} className="event-detail-card">
                    <div className="event-detail-top">
                      <span className={`event-type-badge ${(ev.type || "otro").toLowerCase()}`}>
                        {ev.type || "Evento"}
                      </span>
                      <span className="event-detail-time">
                        <ClockSmIcon />
                        {formatDate(ev.date)}{ev.time && ev.time !== "Todo el día" && ` · ${ev.time}`}
                      </span>
                    </div>
                    <h4>{ev.title}</h4>
                    {ev.location && (
                      <div className="event-detail-location">
                        <MapPinSmIcon />
                        {ev.location}
                      </div>
                    )}
                    <div className="event-detail-actions">
                      <button onClick={() => setSelectedEvent(ev)} className="btn-agendar" style={{ background: 'transparent' }}>
                        <CalendarSmIcon /> Agendar
                      </button>
                      {ev.lumaLink && (
                        <a href={ev.lumaLink} target="_blank" rel="noopener noreferrer" className="btn-luma-sm">
                           Info Luma <ExternalLinkIcon />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

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
              <li><Link href="/">Inicio</Link></li>
              <li>
                <a href="https://wa.me/5214422497485" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* ── ADD TO CALENDAR MODAL ── */}
      {selectedEvent && (
        <div className="calendar-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="calendar-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="calendar-modal-close-btn" onClick={() => setSelectedEvent(null)}>
              <CloseIcon />
            </button>
            <div className="calendar-modal-icon-wrap">
              <CalendarCheckIcon />
            </div>
            <h3 className="calendar-modal-title">Agregar al Calendario</h3>
            <p className="calendar-modal-desc">
              Sincroniza <strong>"{selectedEvent.title}"</strong> directamente con tu proveedor de calendario o descarga el archivo.
            </p>
            <div className="calendar-modal-buttons">
              <a
                href={buildGCalLink(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-btn calendar-btn-google"
                onClick={() => setSelectedEvent(null)}
              >
                <GoogleIcon /> Google Calendar
              </a>
              <a
                href={buildOutlookLink(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-btn calendar-btn-outlook"
                onClick={() => setSelectedEvent(null)}
              >
                <OutlookIcon /> Outlook.com
              </a>
              <button
                onClick={() => {
                  downloadICSFile(selectedEvent);
                  setSelectedEvent(null);
                }}
                className="calendar-btn calendar-btn-ical"
              >
                <AppleIcon /> iCal (Apple / Outlook)
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="calendar-btn calendar-btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
