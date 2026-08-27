"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchICalFeed } from "../../utils/icalParser";
import { ICAL_FEED_URL } from "../../config";
import { getMisasDePrecepto, PreceptoEvent } from "../../data/preceptoData";
import {
  generateGoogleCalendarUrl,
  generateOutlookWebUrl,
  generateYahooCalendarUrl,
  downloadICSFile,
} from "../../utils/calendarExport";

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

const YahooIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l6 8v8h4v-8l6-8h-4l-4 6-4-6z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.1.09 2.23-.58 2.95-1.39z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const EVENT_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "Precepto", label: "Preceptos" },
  { key: "Retiro", label: "Retiros" },
  { key: "Oración", label: "Misas" },
  { key: "Colecta", label: "Colectas" },
  { key: "Misión", label: "Misiones" },
  { key: "Reunión", label: "Reuniones" },
  { key: "Apostolado", label: "Apostolados" },
  { key: "Otro", label: "Otros" },
];

export default function Calendario() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Array<any>>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const icalUrl = ICAL_FEED_URL;
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEventLink, setCopiedEventLink] = useState(false);

  const googleSubscribeLink = useMemo(() => {
    return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(ICAL_FEED_URL)}`;
  }, []);

  const appleOutlookSubscribeLink = useMemo(() => {
    if (ICAL_FEED_URL.startsWith("https://")) {
      return ICAL_FEED_URL.replace("https://", "webcal://");
    } else if (ICAL_FEED_URL.startsWith("http://")) {
      return ICAL_FEED_URL.replace("http://", "webcal://");
    }
    return `webcal://${ICAL_FEED_URL}`;
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ICAL_FEED_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEventLink = (ev: any) => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/calendario?evento=${encodeURIComponent(ev.id)}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedEventLink(true);
      setTimeout(() => setCopiedEventLink(false), 2500);
    }
  };

  useEffect(() => {
    document.body.classList.add("landing-body");
    return () => document.body.classList.remove("landing-body");
  }, []);

  // Fetch external Google Calendar events & generate Misas de Precepto
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const preceptoList = [
          ...getMisasDePrecepto(currentYear),
          ...getMisasDePrecepto(currentYear + 1),
        ];

        let icsEvents: any[] = [];
        if (icalUrl) {
          try {
            icsEvents = await fetchICalFeed(icalUrl);
          } catch (feedErr) {
            console.error("Error fetching iCal feed:", feedErr);
          }
        }

        const map = new Map<string, any>();
        icsEvents.forEach((e) => map.set(e.id, e));
        preceptoList.forEach((e) => {
          if (!map.has(e.id)) {
            map.set(e.id, e);
          }
        });

        const combined = Array.from(map.values()).sort(
          (a, b) => new Date(a.date + "T00:00:00").getTime() - new Date(b.date + "T00:00:00").getTime()
        );

        setEvents(combined);
      } catch (err) {
        console.error("Error loading events", err);
      }
    };
    fetchEvents();
  }, [icalUrl]);

  // Deep-link auto open modal when ?evento=[id] is present
  useEffect(() => {
    const targetId = searchParams.get("evento");
    if (targetId && events.length > 0) {
      const found = events.find((e) => e.id === targetId);
      if (found) {
        setSelectedEvent(found);
      }
    }
  }, [searchParams, events]);

  const embedSrc = useMemo(() => {
    if (icalUrl && icalUrl.includes("calendar.google.com")) {
      const match = icalUrl.match(/\/ical\/([^\/]+)\/public/);
      if (match && match[1]) {
        return `https://calendar.google.com/calendar/embed?src=${match[1]}&ctz=America%2FMexico_City&mode=MONTH&showPrint=0&showTabs=0&showCalendars=0&showTz=0`;
      }
    }
    return `https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FMexico_City&mode=MONTH&showPrint=0&showTabs=0&showCalendars=0&showTz=0`;
  }, [icalUrl]);

  const currentMonthEventsInfo = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0);

    const getLocalDateString = (dateObj: Date) => {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    const todayStr = getLocalDateString(today);
    const endOfMonthStr = getLocalDateString(lastDay);
    const monthName = today.toLocaleDateString("es-ES", { month: "long" });
    const rangeStr = `del ${today.getDate()} al ${lastDay.getDate()} de ${monthName}`;

    return {
      todayStr,
      endOfMonthStr,
      rangeStr,
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const currentMonthList = events.filter(
      (e) => e.date >= currentMonthEventsInfo.todayStr && e.date <= currentMonthEventsInfo.endOfMonthStr
    );
    if (activeFilter === "all") return currentMonthList;
    return currentMonthList.filter((e) => {
      if (activeFilter === "Precepto") {
        return e.isPrecepto || (e.types && e.types.includes("Precepto"));
      }
      if (e.types && e.types.length > 0) {
        return e.types.includes(activeFilter);
      }
      return e.type === activeFilter;
    });
  }, [events, activeFilter, currentMonthEventsInfo]);

  const formatDate = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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
          <li>
            <Link href="/">Inicio</Link>
          </li>
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
            <a
              href="https://wa.me/5214422497485"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta-wa"
              data-tooltip="Escríbenos por WhatsApp para unirte o resolver tus dudas"
            >
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
            <li>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/donaciones" onClick={() => setMobileMenuOpen(false)}>
                Donaciones
              </Link>
            </li>
            <li className="nav-mobile-social-row">
              <a
                href="https://instagram.com/lapandilladejesusqro"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-mobile-social-icon"
                title="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://threads.net/@lapandilladejesusqro"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-mobile-social-icon"
                title="Threads"
              >
                <ThreadsIcon size={18} />
              </a>
              <a
                href="https://facebook.com/lapandilladejesusqro"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-mobile-social-icon"
                title="Facebook"
              >
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

      {/* ── MAIN ── */}
      <main className="landing-main">
        <section className="events-section" style={{ marginTop: "1rem" }}>
          <div className="events-section-header">
            <div>
              <h2>Centro de Eventos & Misas de Precepto</h2>
              <p>Consulta el calendario completo con solemnidades litúrgicas y actividades parroquiales.</p>
            </div>
            <button
              className="btn-insta"
              onClick={() => setShowSubscribeModal(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              data-tooltip="Suscripción automatizada de todo el calendario en tu celular o computadora"
            >
              <CalendarSmIcon /> Sincronizar Calendario Completo
            </button>
          </div>

          <div className="events-layout">
            {/* Google Calendar Embed */}
            <div className="calendar-embed-wrapper">
              <iframe src={embedSrc} title="Calendario de La Pandilla de Jesús"></iframe>
            </div>

            {/* Event Sidebar */}
            <div className="event-sidebar">
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-dark)", margin: 0 }}>
                  Eventos Próximos
                </h3>
                <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: 0 }}>
                  Mostrando agenda mensual {currentMonthEventsInfo.rangeStr && `(${currentMonthEventsInfo.rangeStr})`}
                </p>
              </div>
              <div className="filter-pills">
                {EVENT_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    className={`filter-pill ${activeFilter === f.key ? "active" : ""}`}
                    onClick={() => setActiveFilter(f.key)}
                    title={`Filtrar eventos por la categoría: ${f.label}`}
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
                      <div className="event-type-badges-container">
                        {ev.isPrecepto && (
                          <span className="event-type-badge precepto">
                            ✝ Precepto
                          </span>
                        )}
                        {(ev.types && ev.types.length > 0 ? ev.types : [ev.type || "Otro"])
                          .filter((t: string) => t !== "Precepto")
                          .map((t: string) => (
                            <span
                              key={t}
                              className={`event-type-badge ${t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                            >
                              {t}
                            </span>
                          ))}
                      </div>
                      <span className="event-detail-time">
                        <ClockSmIcon />
                        {formatDate(ev.date)}
                        {ev.time && ev.time !== "Todo el día" && ` · ${ev.time}`}
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
                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className="btn-agendar"
                        style={{ background: "transparent" }}
                        data-tooltip="Sincronizar esta actividad individual con tu Google Calendar, Outlook o Apple Calendar"
                      >
                        <CalendarSmIcon /> Agendar
                      </button>
                      <button
                        onClick={() => handleCopyEventLink(ev)}
                        className="btn-agendar"
                        style={{ background: "transparent", maxWidth: "44px", padding: "0.5rem" }}
                        data-tooltip="Copiar enlace directo compartible de este evento"
                        aria-label="Compartir evento"
                      >
                        <ShareIcon />
                      </button>
                      {ev.lumaLink && (
                        <a
                          href={ev.lumaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-luma-sm"
                          data-tooltip="Ver detalles y registro de asistencia en la plataforma Luma"
                        >
                          Info Luma <ExternalLinkIcon />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div className="upcoming-info-note" style={{ marginTop: "1.5rem" }}>
                <p>
                  * Esta sección muestra la planeación completa de eventos y Misas de Precepto según las normas de la Conferencia del Episcopado Mexicano (CEM) y el Código de Derecho Canónico (Canon 1246).
                </p>
                <p style={{ marginTop: "8px" }}>
                  Haz clic en "Agendar" en cualquier evento para sincronizarlo con tu cuenta de Google, Apple o Outlook personal.
                </p>
              </div>
            </div>
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
              <li>
                <Link href="/">Inicio</Link>
              </li>
              <li>
                <Link href="/donaciones">Donaciones</Link>
              </li>
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

      {/* ── ADD TO CALENDAR MODAL ── */}
      {selectedEvent && (
        <div className="calendar-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="calendar-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="calendar-modal-close-btn"
              onClick={() => setSelectedEvent(null)}
              data-tooltip="Cerrar esta ventana emergente"
            >
              <CloseIcon />
            </button>
            <div className="calendar-modal-icon-wrap">
              <CalendarCheckIcon />
            </div>
            <h3 className="calendar-modal-title">{selectedEvent.title}</h3>
            {selectedEvent.isPrecepto && (
              <div style={{ marginBottom: "0.5rem" }}>
                <span className="event-type-badge precepto">
                  ✝ Misa de Precepto Obligatorio
                </span>
              </div>
            )}
            <p className="calendar-modal-desc">
              {selectedEvent.description || "Sincroniza este evento directamente con tu proveedor de calendario personal o compártelo."}
            </p>
            <div style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "1rem", textAlign: "center" }}>
              📅 <strong>{formatDate(selectedEvent.date)}</strong>
              {selectedEvent.time && ` · ${selectedEvent.time}`}
              <br />
              📍 {selectedEvent.location || "Parroquia de la Sagrada Familia, Querétaro"}
            </div>

            <div className="calendar-modal-buttons">
              <a
                href={generateGoogleCalendarUrl(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-btn calendar-btn-google"
                onClick={() => setSelectedEvent(null)}
                data-tooltip="Sincronizar este evento individual en Google Calendar (Web)"
              >
                <GoogleIcon /> Google Calendar
              </a>
              <a
                href={generateOutlookWebUrl(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-btn calendar-btn-outlook"
                onClick={() => setSelectedEvent(null)}
                data-tooltip="Sincronizar este evento en tu calendario de Outlook.com (Web)"
              >
                <OutlookIcon /> Outlook.com
              </a>
              <a
                href={generateYahooCalendarUrl(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-btn calendar-btn-yahoo"
                onClick={() => setSelectedEvent(null)}
                data-tooltip="Sincronizar este evento en Yahoo Calendar (Web)"
              >
                <YahooIcon /> Yahoo Calendar
              </a>
              <button
                onClick={() => {
                  downloadICSFile(selectedEvent);
                  setSelectedEvent(null);
                }}
                className="calendar-btn calendar-btn-ical"
                data-tooltip="Descargar archivo universal .ics compatible con Apple Calendar y Outlook Desktop"
              >
                <AppleIcon /> iCal (Apple / Outlook)
              </button>
              <button
                onClick={() => handleCopyEventLink(selectedEvent)}
                className="calendar-btn calendar-btn-share"
                data-tooltip="Copiar enlace compartible con vista previa dinámica de imagen OG"
              >
                <ShareIcon /> {copiedEventLink ? "¡Enlace Copiado!" : "Compartir Enlace del Evento"}
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="calendar-btn calendar-btn-cancel"
                data-tooltip="Cerrar esta ventana emergente"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBSCRIBE TO CALENDAR FEED MODAL ── */}
      {showSubscribeModal && (
        <div className="calendar-modal-overlay" onClick={() => setShowSubscribeModal(false)}>
          <div className="calendar-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="calendar-modal-close-btn"
              onClick={() => setShowSubscribeModal(false)}
              data-tooltip="Cerrar esta ventana emergente"
            >
              <CloseIcon />
            </button>
            <div className="calendar-modal-icon-wrap">
              <CalendarCheckIcon />
            </div>
            <h3 className="calendar-modal-title">Suscribirse al Calendario</h3>
            <p className="calendar-modal-desc">
              Sincroniza <strong>todos los eventos</strong> de La Pandilla de Jesús en tu dispositivo. Cualquier cambio en la agenda se actualizará automáticamente.
            </p>
            <div className="calendar-modal-buttons">
              <a
                href={googleSubscribeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-btn calendar-btn-google"
                onClick={() => setShowSubscribeModal(false)}
                data-tooltip="Añadir suscripción automatizada del calendario completo en tu Google Calendar (Web)"
              >
                <GoogleIcon /> Google Calendar (Web)
              </a>
              <a
                href={appleOutlookSubscribeLink}
                className="calendar-btn calendar-btn-ical"
                onClick={() => setShowSubscribeModal(false)}
                data-tooltip="Añadir suscripción en la app nativa de tu dispositivo (Apple Calendar en iPhone/Mac o Outlook)"
              >
                <AppleIcon /> Apple Calendar / Outlook (Celular/PC)
              </a>
              <button
                onClick={handleCopyLink}
                className="calendar-btn calendar-btn-outlook"
                style={{
                  background: copiedLink ? "#20ba5a" : "",
                  color: copiedLink ? "#fff" : "",
                  transition: "all 0.3s",
                }}
                data-tooltip="Copiar la URL del feed de eventos (.ics) para pegarlo e importarlo manualmente"
              >
                <CopyIcon /> {copiedLink ? "¡Enlace Copiado!" : "Copiar Enlace iCal"}
              </button>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="calendar-btn calendar-btn-cancel"
                data-tooltip="Cerrar esta ventana emergente"
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
