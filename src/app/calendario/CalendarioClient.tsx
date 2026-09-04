"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import GlobalModal from "../../components/GlobalModal";
import { useSearchParams } from "next/navigation";
import { fetchICalFeed, cleanDescription } from "../../utils/icalParser";
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
  <svg width={size} height={size} viewBox="0 0 192 192" fill="currentColor">
    <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.481 72.7301C80.8935 64.5126 89.2604 60.9168 97.2039 60.9168C97.2798 60.9168 97.3556 60.9168 97.4322 60.9175C110.669 61.0023 120.914 69.6054 122.407 84.4443C114.776 83.4735 106.398 83.1772 97.3756 83.5604C67.4344 84.8329 49.3361 99.8872 50.3259 123.149C51.3503 147.218 72.7663 158.455 93.3089 158.455C109.914 158.455 122.259 150.941 128.531 137.078C133.722 147.469 143.084 153.256 156.444 153.256C168.016 153.256 177.387 147.669 181.71 137.95C186.297 127.639 187.355 113.111 187.355 96.0001C187.355 42.9806 146.903 0 96 0C42.9806 0 0 42.9806 0 96C0 149.019 42.9806 192 96 192C128.273 192 156.709 176.103 173.844 151.724L160.016 140.237C146.104 160.103 122.844 173.084 96 173.084C53.4277 173.084 18.9164 138.572 18.9164 96C18.9164 53.4277 53.4277 18.9164 96 18.9164C137.24 18.9164 168.438 52.6102 168.438 96.0001C168.438 111.458 167.579 123.639 164.298 131.01C161.761 136.711 156.241 139.771 149.52 139.771C139.816 139.771 133.914 133.821 133.914 121.218C133.914 117.818 134.254 114.181 134.925 110.375C138.257 91.4674 146.331 89.288 141.537 88.9883ZM93.9922 142.284C81.8286 142.284 68.6186 136.082 67.9944 121.39C67.4377 108.283 77.2917 99.8872 96.9064 99.0543C104.996 98.7107 112.441 99.0307 119.068 99.9883C116.581 132.846 103.882 142.284 93.9922 142.284Z" />
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const NotesGCalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="15" y2="18"/>
  </svg>
);

const MapPinGCalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CalendarGCalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const getEventCategoryColor = (event: any) => {
  if (event.isPrecepto) return "#f58220";
  const primaryType = (event.types && event.types[0]) || event.type || "Otro";
  switch (primaryType.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
    case "precepto": return "#f58220";
    case "misa": return "#1a73e8";
    case "oracion": return "#0d904f";
    case "retiro": return "#9c27b0";
    case "colecta": return "#f29900";
    case "mision": return "#d93025";
    case "reunion": return "#e8710a";
    case "apostolado": return "#12b5cb";
    default: return "#5f6368";
  }
};

const formatGoogleDate = (dateStr: string, timeStr?: string) => {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr + "T12:00:00");
  const weekday = dateObj.toLocaleDateString("es-ES", { weekday: "long" });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString("es-ES", { month: "long" });
  
  const formattedDate = `${capitalizedWeekday}, ${day} de ${month}`;
  if (timeStr && timeStr !== "Todo el día") {
    return `${formattedDate} · ${timeStr}`;
  }
  return formattedDate;
};

const formatRecurrenceText = (rrule?: string, event?: any) => {
  if (!rrule) {
    if (event?.isPrecepto) return "✝ Misa de Precepto Obligatorio";
    return null;
  }
  const upper = rrule.toUpperCase();
  if (upper.includes("FREQ=MONTHLY")) {
    if (upper.includes("BYDAY=2TU")) return "Mensual el segundo martes";
    if (upper.includes("BYDAY=1TU")) return "Mensual el primer martes";
    if (upper.includes("BYDAY=3TU")) return "Mensual el tercer martes";
    if (upper.includes("BYDAY=4TU")) return "Mensual el cuarto martes";
    if (upper.includes("BYDAY=")) return "Mensual en día programado";
    return "Mensual";
  }
  if (upper.includes("FREQ=WEEKLY")) return "Semanal";
  if (upper.includes("FREQ=YEARLY")) return "Anual";
  if (upper.includes("FREQ=DAILY")) return "Diario";
  return "Evento recurrente";
};

const EVENT_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "Precepto", label: "Preceptos" },
  { key: "Retiro", label: "Retiros" },
  { key: "Misa", label: "Misas" },
  { key: "Oración", label: "Oración" },
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
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

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
      setCopiedEventId(ev.id);
      setTimeout(() => setCopiedEventId(null), 2500);
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

  const getWeekRange = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const day = d.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    
    // Start week on Monday, end on Sunday
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondayDay = monday.getDate();
    const sundayDay = sunday.getDate();
    const mondayMonth = monday.toLocaleDateString("es-ES", { month: "long" });
    const sundayMonth = sunday.toLocaleDateString("es-ES", { month: "long" });

    let label = "";
    if (mondayMonth === sundayMonth) {
      label = `Semana del ${mondayDay} al ${sundayDay} de ${mondayMonth}`;
    } else {
      label = `Semana del ${mondayDay} de ${mondayMonth} al ${sundayDay} de ${sundayMonth}`;
    }

    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const dayM = String(monday.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${dayM}`;

    return { key, label };
  };

  const eventsGroupedByWeek = useMemo(() => {
    const groups: { key: string; label: string; events: any[] }[] = [];
    const map = new Map<string, { key: string; label: string; events: any[] }>();

    filteredEvents.forEach((ev) => {
      const { key, label } = getWeekRange(ev.date);
      if (!map.has(key)) {
        const group = { key, label, events: [] as any[] };
        map.set(key, group);
        groups.push(group);
      }
      map.get(key)!.events.push(ev);
    });

    return groups;
  }, [filteredEvents]);

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
          <div className="nav-brand" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ display: 'block' }}>
              <img src="/logo-pandilla.png" alt="Logo La Pandilla de Jesús" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <span className="nav-brand-name">La Pandilla de Jesús</span>
              </Link>
              <span className="nav-brand-sub">Comunidad católica · Querétaro</span>
            </div>
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
          <div className="nav-mobile-content">
            {/* 1. SECCIÓN: PÁGINAS */}
            <div className="nav-mobile-section">
              <span className="nav-mobile-section-label">Páginas</span>
              <ul className="nav-mobile-pages-list">
                <li>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="nav-mobile-page-link">
                    <span className="nav-mobile-page-icon">🏠</span>
                    <span className="nav-mobile-page-title">Inicio</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calendario" onClick={() => setMobileMenuOpen(false)} className="nav-mobile-page-link">
                    <span className="nav-mobile-page-icon">📅</span>
                    <span className="nav-mobile-page-title">Eventos</span>
                  </Link>
                </li>
                <li>
                  <Link href="/donaciones" onClick={() => setMobileMenuOpen(false)} className="nav-mobile-page-link">
                    <span className="nav-mobile-page-icon">💛</span>
                    <span className="nav-mobile-page-title">Donaciones</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* 2. SECCIÓN: ATAJOS RÁPIDOS Y RECURSOS INTERACTIVOS */}
            <div className="nav-mobile-section">
              <span className="nav-mobile-section-label">Atajos y Recursos Interactivos</span>
              <div className="nav-mobile-shortcuts-list">
                {/* 1. Interactivo de Misa */}
                <Link 
                  href="/?modal=guia"
                  className="nav-mobile-shortcut-btn priority-high"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="shortcut-icon">📖</span>
                  <div className="shortcut-info">
                    <span className="shortcut-title">Guía de Misa y Lecturas</span>
                    <span className="shortcut-desc">Lecturas de hoy, Ordinario y Respuestas</span>
                  </div>
                  <span className="shortcut-badge">Interactivo</span>
                </Link>

                {/* 2. Santo Rosario */}
                <Link 
                  href="/?modal=oraciones&deck=rosario"
                  className="nav-mobile-shortcut-btn priority-high"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="shortcut-icon">📿</span>
                  <div className="shortcut-info">
                    <span className="shortcut-title">Santo Rosario</span>
                    <span className="shortcut-desc">Misterios del día, Citas Bíblicas y Frutos</span>
                  </div>
                  <span className="shortcut-badge">Interactivo</span>
                </Link>

                {/* 3. Oraciones de Comida */}
                <Link 
                  href="/?modal=oraciones&deck=alimentos"
                  className="nav-mobile-shortcut-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="shortcut-icon">🍽️</span>
                  <div className="shortcut-info">
                    <span className="shortcut-title">Bendición de Alimentos</span>
                    <span className="shortcut-desc">Oraciones para bendecir la mesa y acción de gracias</span>
                  </div>
                </Link>

                {/* 4. El Ángelus */}
                <Link 
                  href="/?modal=oraciones&deck=basicas"
                  className="nav-mobile-shortcut-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="shortcut-icon">🕊️</span>
                  <div className="shortcut-info">
                    <span className="shortcut-title">El Ángelus</span>
                    <span className="shortcut-desc">Memoria de la Encarnación y Regina Caeli</span>
                  </div>
                </Link>

                {/* 5. Cancionero de Horas Santas */}
                <Link 
                  href="/?modal=cancionero"
                  className="nav-mobile-shortcut-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="shortcut-icon">🎵</span>
                  <div className="shortcut-info">
                    <span className="shortcut-title">Cancionero de Horas Santas</span>
                    <span className="shortcut-desc">Letras, acordes y modo interactivo</span>
                  </div>
                </Link>

                {/* 6. Guía de Confesión */}
                <Link 
                  href="/?modal=confesion"
                  className="nav-mobile-shortcut-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="shortcut-icon">✝️</span>
                  <div className="shortcut-info">
                    <span className="shortcut-title">Guía de Confesión</span>
                    <span className="shortcut-desc">Examen de conciencia y pasos del sacramento</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* 3. SECCIÓN: REDES Y CONTACTO */}
            <div className="nav-mobile-footer-section">
              <div className="nav-mobile-social-row">
                <a href="https://instagram.com/lapandilladejesusqro" target="_blank" rel="noopener noreferrer" className="nav-mobile-social-icon" title="Instagram">
                  <InstagramIcon size={18} />
                </a>
                <a href="https://threads.net/@lapandilladejesusqro" target="_blank" rel="noopener noreferrer" className="nav-mobile-social-icon" title="Threads">
                  <ThreadsIcon size={18} />
                </a>
                <a href="https://facebook.com/lapandilladejesusqro" target="_blank" rel="noopener noreferrer" className="nav-mobile-social-icon" title="Facebook">
                  <FacebookIcon size={18} />
                </a>
              </div>
              <a 
                href="https://wa.me/5214422497485" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-mobile-cta-wa"
                onClick={() => setMobileMenuOpen(false)}
                data-tooltip="Escríbenos por WhatsApp para unirte o resolver tus dudas"
              >
                <WhatsAppIcon size={18} /> WhatsApp Comunidad
              </a>
            </div>
          </div>
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
                eventsGroupedByWeek.map((group) => (
                  <div key={group.key} className="event-week-section">
                    <div className="event-week-header">
                      <div className="event-week-title">
                        <CalendarSmIcon />
                        <span>{group.label}</span>
                      </div>
                      <span className="event-week-count">
                        {group.events.length} {group.events.length === 1 ? 'evento' : 'eventos'}
                      </span>
                    </div>

                    {group.events.map((ev) => (
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
                            style={{ 
                              background: copiedEventId === ev.id ? "#20ba5a" : "transparent",
                              color: copiedEventId === ev.id ? "#fff" : "inherit",
                              maxWidth: copiedEventId === ev.id ? "120px" : "44px",
                              padding: "0.5rem",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px"
                            }}
                            data-tooltip={copiedEventId === ev.id ? "¡Enlace copiado al portapapeles!" : "Copiar enlace directo compartible de este evento"}
                            aria-label="Compartir evento"
                          >
                            {copiedEventId === ev.id ? (
                              <>
                                <CopyIcon />
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Copiado</span>
                              </>
                            ) : (
                              <ShareIcon />
                            )}
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
                    ))}
                  </div>
                ))
              )}
              <div className="upcoming-info-note" style={{ marginTop: "1.5rem" }}>
                <p>
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

          {/* Structured Navigation Columns */}
          <div className="footer-columns-container">
            {/* Col 1: Páginas y Templo Sede */}
            <div className="footer-col">
              <span className="footer-col-title">Páginas y Sede</span>
              <ul className="footer-col-links">
                <li><Link href="/">Inicio</Link></li>
                <li><Link href="/calendario">Eventos y Preceptos</Link></li>
                <li><Link href="/donaciones">Donaciones</Link></li>
                <li>
                  <a href="https://lasagradafamiliaqro.org/" target="_blank" rel="noopener noreferrer">
                    Parroquia Sagrada Familia
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/5214422497485" target="_blank" rel="noopener noreferrer">
                    Asambleas (Martes 8 PM)
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 2: Recursos de la Misa */}
            <div className="footer-col">
              <span className="footer-col-title">Guía de la Misa</span>
              <ul className="footer-col-links">
                <li><Link href="/?modal=guia&seccion=lecturas">Lecturas de Hoy</Link></li>
                <li><Link href="/?modal=guia_misa_interactiva&seccion=rito-de-entrada">Respuestas y Ordinario</Link></li>
                <li><Link href="/?modal=guia&seccion=cantos">Cantos Litúrgicos</Link></li>
                <li><Link href="/?modal=guia&seccion=misterio">Plegarias y Misterio Pascual</Link></li>
              </ul>
            </div>

            {/* Col 3: Oración y Devociones */}
            <div className="footer-col">
              <span className="footer-col-title">Oración y Devoción</span>
              <ul className="footer-col-links">
                <li><Link href="/?modal=oraciones&deck=rosario">Santo Rosario Interactivo</Link></li>
                <li><Link href="/?modal=oraciones&deck=alimentos">Bendición de Alimentos</Link></li>
                <li><Link href="/?modal=oraciones&deck=comunidad">Oraciones de la Pandilla</Link></li>
                <li><Link href="/?modal=oraciones&deck=basicas&etapa=10">El Ángelus y Regina Caeli</Link></li>
              </ul>
            </div>

            {/* Col 4: Alabanza y Sacramentos */}
            <div className="footer-col">
              <span className="footer-col-title">Alabanza y Sacramentos</span>
              <ul className="footer-col-links">
                <li><Link href="/?modal=cancionero">Cancionero de Horas Santas</Link></li>
                <li><Link href="/?modal=confesion">Guía de Confesión y Examen</Link></li>
                <li><Link href="/calendario">Misas de Precepto CEM</Link></li>
                <li>
                  <a href="/api/calendar" target="_blank" rel="noopener noreferrer">
                    Descargar Calendario (.ics)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-meta-container">
            <span className="footer-copy">© 2026 La Pandilla de Jesús · lapandilladejesusqro.org</span>
            <ul className="footer-links">
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/calendario">Eventos</Link></li>
              <li><Link href="/donaciones">Donaciones</Link></li>
              <li>
                <a href="https://instagram.com/lapandilladejesusqro" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://threads.net/@lapandilladejesusqro" target="_blank" rel="noopener noreferrer">
                  Threads
                </a>
              </li>
              <li>
                <a href="https://facebook.com/lapandilladejesusqro" target="_blank" rel="noopener noreferrer">
                  Facebook
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

      {/* ── ADD TO CALENDAR MODAL (GOOGLE CALENDAR STYLE LAYOUT) ── */}
      <GlobalModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && (
          <div className="gcal-modal-wrapper">
            {/* Scrollable Event Information Body */}
            <div className="gcal-scrollable-body" style={{ paddingTop: '0.5rem' }}>
              {/* 1. Header: Title + Date/Time + Recurrence (Without color badge next to title) */}
              <div className="gcal-row gcal-title-row">
                <div className="gcal-content-col" style={{ paddingLeft: '2px' }}>
                  <h3 className="gcal-event-title">{selectedEvent.title}</h3>
                  <div className="gcal-event-datetime">
                    {formatGoogleDate(selectedEvent.date, selectedEvent.time)}
                  </div>
                  {formatRecurrenceText(selectedEvent.rrule, selectedEvent) && (
                    <div className="gcal-event-recurrence">
                      {formatRecurrenceText(selectedEvent.rrule, selectedEvent)}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Location (if present) with Google Maps link */}
              {selectedEvent.location && (
                <div className="gcal-row">
                  <div className="gcal-icon-col">
                    <MapPinGCalIcon />
                  </div>
                  <div className="gcal-content-col">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gcal-location-link"
                      title="Abrir ubicación en Google Maps"
                      data-tooltip="Abrir en Google Maps"
                    >
                      <span>{selectedEvent.location}</span>
                      <ExternalLinkIcon />
                    </a>
                  </div>
                </div>
              )}

              {/* 3. Description (if present) */}
              {selectedEvent.description && (
                <div className="gcal-row">
                  <div className="gcal-icon-col">
                    <NotesGCalIcon />
                  </div>
                  <div className="gcal-content-col">
                    <div className="gcal-description-text">
                      {cleanDescription(selectedEvent.description)}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Calendar / Source with Google Calendar link */}
              <div className="gcal-row">
                <div className="gcal-icon-col">
                  <CalendarGCalIcon />
                </div>
                <div className="gcal-content-col">
                  <a
                    href={googleSubscribeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gcal-calendar-link"
                    title="Abrir o sincronizar en Google Calendar"
                    data-tooltip="Abrir calendario oficial en Google Calendar"
                  >
                    <div className="gcal-calendar-name">
                      <span>lapandilladejesusqro.org</span>
                      <ExternalLinkIcon />
                    </div>
                    <div className="gcal-calendar-sub">La Pandilla de Jesús · Querétaro</div>
                  </a>
                </div>
              </div>
            </div>

            {/* 5. Pinned Bottom Sync / Export Actions */}
            <div className="gcal-actions-section gcal-actions-pinned">
              <div className="gcal-actions-label">Sincronizar y Compartir</div>
              <div className="gcal-actions-grid">
                <a
                  href={generateGoogleCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gcal-action-btn"
                  onClick={() => setSelectedEvent(null)}
                  title="Google Calendar"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </a>
                <a
                  href={generateOutlookWebUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gcal-action-btn"
                  onClick={() => setSelectedEvent(null)}
                  title="Outlook"
                >
                  <OutlookIcon />
                  <span>Outlook</span>
                </a>
                <a
                  href={generateYahooCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gcal-action-btn"
                  onClick={() => setSelectedEvent(null)}
                  title="Yahoo"
                >
                  <YahooIcon />
                  <span>Yahoo</span>
                </a>
                <button
                  onClick={() => { downloadICSFile(selectedEvent); setSelectedEvent(null); }}
                  className="gcal-action-btn"
                  title="Apple / iCal"
                >
                  <AppleIcon />
                  <span>Apple</span>
                </button>
              </div>

              <button
                onClick={() => handleCopyEventLink(selectedEvent)}
                className={`gcal-share-btn ${copiedEventId === selectedEvent.id ? 'copied' : ''}`}
              >
                {copiedEventId === selectedEvent.id ? <CopyIcon /> : <ShareIcon />}
                <span>{copiedEventId === selectedEvent.id ? "¡Enlace Copiado al Portapapeles!" : "Copiar Enlace Directo"}</span>
              </button>
            </div>
          </div>
        )}
      </GlobalModal>

      {/* ── SUBSCRIBE TO CALENDAR FEED MODAL ── */}
      <GlobalModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
      >
        <div className="recursos-modal-body" style={{ marginTop: 0, paddingRight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
            <h3 className="calendar-modal-title" style={{ textAlign: 'left', fontSize: '1.35rem', margin: '0' }}>Suscribirse al Calendario</h3>
            <p className="calendar-modal-desc" style={{ textAlign: 'left', color: 'var(--text-light)', margin: '0', fontSize: '0.9rem', padding: 0 }}>
              Sincroniza <strong>todos los eventos</strong> de La Pandilla de Jesús en tu dispositivo. Se actualizará automáticamente en tiempo real.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={googleSubscribeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-btn calendar-btn-google"
                onClick={() => setShowSubscribeModal(false)}
                style={{ display: 'flex', justifyContent: 'center', padding: '10px', fontSize: '0.95rem', borderRadius: '10px' }}
              >
                <GoogleIcon /> Google Calendar (Web)
              </a>
              <a
                href={appleOutlookSubscribeLink}
                className="calendar-btn calendar-btn-ical"
                onClick={() => setShowSubscribeModal(false)}
                style={{ display: 'flex', justifyContent: 'center', padding: '10px', fontSize: '0.95rem', borderRadius: '10px' }}
              >
                <AppleIcon /> Apple Calendar / Outlook
              </a>
              <button
                onClick={handleCopyLink}
                className="calendar-btn calendar-btn-outlook"
                style={{
                  background: copiedLink ? "#20ba5a" : "",
                  color: copiedLink ? "#fff" : "",
                  transition: "all 0.3s",
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '10px',
                  fontSize: '0.95rem',
                  borderRadius: '10px'
                }}
              >
                <CopyIcon /> {copiedLink ? "¡Enlace Copiado!" : "Copiar Enlace iCal"}
              </button>
            </div>
          </div>
        </div>
      </GlobalModal>
    </>
  );
}
