/**
 * ============================================================================
 * UNIVERSAL CALENDAR EXPORT UTILITIES (RFC 5545, GOOGLE, OUTLOOK, YAHOO, APPLE)
 * ============================================================================
 * Genera enlaces y archivos universales compatibles con todos los ecosistemas:
 * Google Calendar (Web/App), Outlook.com (Web), Outlook Desktop (Office),
 * Apple Calendar (iOS/macOS), y Yahoo Calendar.
 * ============================================================================
 */

export interface CalendarEventPayload {
  id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  dtstart?: string;
  dtend?: string;
  description?: string;
  location?: string;
}

export function escapeICalText(text: string = ''): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n');
}

export function cleanICalDate(dtLine: string = ''): string {
  const colonIdx = dtLine.indexOf(':');
  return colonIdx !== -1 ? dtLine.substring(colonIdx + 1).trim() : dtLine.trim();
}

/**
 * Genera el enlace directo para añadir el evento a Google Calendar (Web/Mobile)
 */
export function generateGoogleCalendarUrl(event: CalendarEventPayload): string {
  let datesStr = '';
  if (event.dtstart && event.dtend) {
    const start = cleanICalDate(event.dtstart);
    const end = cleanICalDate(event.dtend);
    datesStr = `${start}/${end}`;
  } else {
    const dc = event.date.replace(/-/g, '');
    datesStr = `${dc}/${dc}`;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: datesStr,
    details: event.description || '',
    location: event.location || 'Parroquia de la Sagrada Familia, Querétaro',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Genera el enlace directo para Outlook Web (Outlook.live.com)
 */
export function generateOutlookWebUrl(event: CalendarEventPayload): string {
  let startdt = event.date;
  let enddt = event.date;
  let allday = 'true';

  if (event.dtstart && event.dtend) {
    const cleanStart = cleanICalDate(event.dtstart);
    const cleanEnd = cleanICalDate(event.dtend);

    if (cleanStart.includes('T')) {
      const formatISO = (val: string) => {
        const y = val.substring(0, 4);
        const m = val.substring(4, 6);
        const d = val.substring(6, 8);
        const hh = val.substring(9, 11);
        const mm = val.substring(11, 13);
        const ss = val.substring(13, 15) || '00';
        return `${y}-${m}-${d}T${hh}:${mm}:${ss}Z`;
      };
      startdt = formatISO(cleanStart);
      enddt = formatISO(cleanEnd);
      allday = 'false';
    }
  }

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt,
    enddt,
    allday,
    body: event.description || '',
    location: event.location || 'Parroquia de la Sagrada Familia, Querétaro',
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Genera el enlace directo para Yahoo Calendar
 */
export function generateYahooCalendarUrl(event: CalendarEventPayload): string {
  const dc = event.date.replace(/-/g, '');
  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: dc,
    et: dc,
    desc: event.description || '',
    in_loc: event.location || 'Parroquia de la Sagrada Familia, Querétaro',
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

/**
 * Genera el contenido textual RFC 5545 iCalendar (.ics)
 */
export function generateICSContent(event: CalendarEventPayload): string {
  const titleEscaped = escapeICalText(event.title || '');
  const descEscaped = escapeICalText(event.description || '');
  const locEscaped = escapeICalText(event.location || 'Parroquia de la Sagrada Familia, Querétaro');
  const dc = event.date.replace(/-/g, '');

  let dtStartLine = '';
  let dtEndLine = '';

  if (event.dtstart && event.dtend) {
    const start = cleanICalDate(event.dtstart);
    const end = cleanICalDate(event.dtend);

    if (start.includes('T')) {
      dtStartLine = `DTSTART:${start}`;
      dtEndLine = `DTEND:${end}`;
    } else {
      dtStartLine = `DTSTART;VALUE=DATE:${start}`;
      dtEndLine = `DTEND;VALUE=DATE:${end}`;
    }
  } else {
    // Para eventos de todo el día según RFC 5545, DTEND es el día siguiente (exclusivo)
    const d = new Date(event.date + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + 1);
    const nextDay = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;

    dtStartLine = `DTSTART;VALUE=DATE:${dc}`;
    dtEndLine = `DTEND;VALUE=DATE:${nextDay}`;
  }

  const uid = `${event.id || 'event-' + dc}-${Date.now()}`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//La Pandilla de Jesus//Eventos//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}@lapandilladejesusqro.org`,
    `SUMMARY:${titleEscaped}`,
    dtStartLine,
    dtEndLine,
    `DESCRIPTION:${descEscaped}`,
    `LOCATION:${locEscaped}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/**
 * Inicia la acción de guardar o abrir el archivo .ics
 */
export function downloadICSFile(event: CalendarEventPayload): void {
  if (typeof window === 'undefined') return;

  const icsString = generateICSContent(event);
  const safeName = (event.title || 'evento')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');
  const filename = `${safeName}.ics`;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

  if (isIOS) {
    // En iOS, el data URI redirige directamente al parseador nativo que abre la app Calendario 
    // y muestra la interfaz de "Añadir Evento".
    window.location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsString)}`;
    return;
  }

  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });

  // Web Share API para Android y otros sistemas (abre el menú compartir donde pueden elegir Calendario)
  if (navigator.canShare) {
    const file = new File([blob], filename, { type: 'text/calendar' });
    if (navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: event.title,
      }).catch((err) => {
        console.warn('Share failed, falling back to download', err);
        executeFallback(blob, filename);
      });
      return;
    }
  }

  executeFallback(blob, filename);
}

function executeFallback(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
