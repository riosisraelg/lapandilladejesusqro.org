import { rrulestr } from 'rrule';

/**
 * iCal (.ics) Feed Parser Utility for La Pandilla de Jesús
 * Pure client-side parsing of public Google Calendars without heavy dependencies
 */

export interface ParsedEvent {
  id: string;
  title: string;
  type: string;
  date: string; // YYYY-MM-DD
  time?: string;
  location: string;
  description: string;
  isExternalICS: boolean;
  dtstart?: string;
  dtend?: string;
  rrule?: string;
  exdates?: string[];
}

/**
 * Guesses the event type based on the text of the title/summary to map to our UI badge/filter system
 */
const guessEventType = (title: string): string => {
  // Quitar acentos/diacríticos y pasar a minúsculas para una coincidencia robusta
  const t = (title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (t.includes("retiro")) return "Retiro";
  if (
    t.includes("colecta") || 
    t.includes("viveres") || 
    t.includes("despensa") || 
    t.includes("donacion") || 
    t.includes("acopio")
  ) return "Colecta";
  if (
    t.includes("oracion") || 
    t.includes("misa") || 
    t.includes("hora santa") || 
    t.includes("sagrario") || 
    t.includes("rosario") || 
    t.includes("rezo") || 
    t.includes("adoracion")
  ) return "Oración";
  if (
    t.includes("mision") || 
    t.includes("misionar") || 
    t.includes("evangelizacion")
  ) return "Misión";
  if (
    t.includes("reunion") || 
    t.includes("tema") || 
    t.includes("formacion") || 
    t.includes("clase") || 
    t.includes("taller") || 
    t.includes("caridad") || 
    t.includes("hospital") || 
    t.includes("tortas") || 
    t.includes("apostolado") || 
    t.includes("servicio")
  ) return "Reunión";
  
  return "Otro";
};

// Helper to parse date and time from iCal DTSTART/DTEND string
const parseDateTime = (dtStr: string): { date: string; time: string; jsDate?: Date } | null => {
  if (!dtStr) return null;
  
  // Remove parameters if it contains ':' (e.g. DTSTART;TZID=America/Mexico_City:20260528T190000 -> 20260528T190000)
  let raw = dtStr;
  const colonIdx = raw.indexOf(":");
  if (colonIdx !== -1) {
    raw = raw.substring(colonIdx + 1);
  }
  raw = raw.trim();

  // If it's a date-only format like 20260528
  if (!raw.includes("T")) {
    if (raw.length === 8) {
      const y = raw.substring(0, 4);
      const m = raw.substring(4, 6);
      const d = raw.substring(6, 8);
      return { date: `${y}-${m}-${d}`, time: "Todo el día" };
    }
    return null;
  }

  // Format: YYYYMMDDTHHMMSS(Z)
  // e.g. 20260528T190000Z
  const y = raw.substring(0, 4);
  const m = raw.substring(4, 6);
  const d = raw.substring(6, 8);
  const datePart = `${y}-${m}-${d}`;

  const tIndex = raw.indexOf("T");
  const tStr = raw.substring(tIndex + 1);
  const hh = tStr.substring(0, 2);
  const mm = tStr.substring(2, 4);
  const ss = tStr.substring(4, 6) || "00";

  let timePart = `${hh}:${mm}`;
  let jsDate: Date | undefined;

  // If it ends with Z (UTC time), parse it as a standard Date object to convert to the user's browser timezone!
  if (raw.endsWith("Z")) {
    const utcISO = `${y}-${m}-${d}T${hh}:${mm}:${ss}Z`;
    const dateObj = new Date(utcISO);
    if (!isNaN(dateObj.getTime())) {
      jsDate = dateObj;
      const localHH = String(dateObj.getHours()).padStart(2, "0");
      const localMM = String(dateObj.getMinutes()).padStart(2, "0");
      timePart = `${localHH}:${localMM}`;
      
      const localY = dateObj.getFullYear();
      const localM = String(dateObj.getMonth() + 1).padStart(2, "0");
      const localD = String(dateObj.getDate()).padStart(2, "0");
      return { date: `${localY}-${localM}-${localD}`, time: timePart, jsDate };
    }
  }

  return { date: datePart, time: timePart };
};

/**
 * Helper to expand a recurring event using the 'rrule' library
 */
const expandRecurringEvent = (baseEvent: any): ParsedEvent[] => {
  if (!baseEvent.rrule) return [baseEvent];

  try {
    // Reconstruct the iCal string for rrulestr
    let rruleInput = `RRULE:${baseEvent.rrule}`;
    
    if (baseEvent.dtstart) {
      rruleInput = `${baseEvent.dtstart}\n${rruleInput}`;
    } else {
      const cleanDate = baseEvent.date.replace(/-/g, "");
      rruleInput = `DTSTART:${cleanDate}T000000Z\n${rruleInput}`;
    }

    if (baseEvent.exdates && baseEvent.exdates.length > 0) {
      rruleInput = `${rruleInput}\n${baseEvent.exdates.join('\n')}`;
    }

    // Set forceset: true to handle potential EXDATEs properly
    const rule = rrulestr(rruleInput, { forceset: true });
    
    const now = new Date();
    // Use UTC representations of today/horizon to query rrule in a timezone-agnostic manner
    const todayUTC = new Date(Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0
    ));
    
    const horizonUTC = new Date(Date.UTC(
      now.getFullYear(),
      now.getMonth() + 6,
      now.getDate(),
      23, 59, 59
    ));

    const occurrences = rule.between(todayUTC, horizonUTC, true);

    if (occurrences.length === 0) {
      return [baseEvent];
    }

    const cleanTitle = baseEvent.title.toLowerCase().replace(/[^a-z0-9]/g, "");

    return occurrences.map((dateObj) => {
      const instance = { ...baseEvent };
      
      const y = dateObj.getUTCFullYear();
      const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getUTCDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      instance.date = dateStr;
      instance.id = `ical-${dateStr}-${cleanTitle}`;
      
      return instance as ParsedEvent;
    });
  } catch (error) {
    console.error("Error expanding recurring event with rrule:", error, baseEvent);
    return [baseEvent];
  }
};

/**
 * Parses raw iCal (.ics) text format into a clean array of structured ParsedEvent items
 */
export function parseICS(icsText: string): ParsedEvent[] {
  const events: ParsedEvent[] = [];
  const lines = icsText.split(/\r?\n/);
  let currentEvent: any = null;
  let inEvent = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle unfolded lines (iCal lines starting with a space/tab are a continuation of the previous line)
    while (i + 1 < lines.length && (lines[i+1].startsWith(" ") || lines[i+1].startsWith("\t"))) {
      line += lines[i+1].substring(1);
      i++;
    }

    if (line.startsWith("BEGIN:VEVENT")) {
      currentEvent = {};
      inEvent = true;
      continue;
    }

    if (line.startsWith("END:VEVENT")) {
      if (currentEvent && currentEvent.title && (currentEvent.dtstart || currentEvent.date)) {
        // Resolve start date and time
        if (currentEvent.dtstart) {
          const startInfo = parseDateTime(currentEvent.dtstart);
          if (startInfo) {
            currentEvent.date = startInfo.date;
            
            const endInfo = parseDateTime(currentEvent.dtend);
            if (endInfo && endInfo.time && endInfo.time !== "Todo el día" && startInfo.time !== "Todo el día") {
              currentEvent.time = `${startInfo.time} - ${endInfo.time}`;
            } else {
              currentEvent.time = startInfo.time;
            }
          }
        }

        if (currentEvent.date) {
          // Build unique stable ID based on title and date
          const cleanTitle = currentEvent.title.toLowerCase().replace(/[^a-z0-9]/g, "");
          currentEvent.id = `ical-${currentEvent.date}-${cleanTitle}`;
          currentEvent.type = guessEventType(currentEvent.title);
          currentEvent.isExternalICS = true;

          if (currentEvent.rrule) {
            const expanded = expandRecurringEvent(currentEvent);
            events.push(...expanded);
          } else {
            events.push(currentEvent as ParsedEvent);
          }
        }
      }
      currentEvent = null;
      inEvent = false;
      continue;
    }

    if (inEvent && currentEvent) {
      const match = line.match(/^([^:;]+)(?:;[^:]*)?:(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // Unescape standard iCal characters
        value = value
          .replace(/\\,/g, ",")
          .replace(/\\;/g, ";")
          .replace(/\\n/g, "\n")
          .replace(/\\N/g, "\n")
          .replace(/\\\\/g, "\\");

        if (key === "SUMMARY") {
          currentEvent.title = value === "Busy" ? "Evento Programado" : value;
        } else if (key === "DESCRIPTION") {
          currentEvent.description = value;
        } else if (key === "LOCATION") {
          currentEvent.location = value;
        } else if (key === "DTSTART") {
          currentEvent.dtstart = line;
        } else if (key === "DTEND") {
          currentEvent.dtend = line;
        } else if (key === "RRULE") {
          currentEvent.rrule = value;
        } else if (key === "EXDATE") {
          if (!currentEvent.exdates) {
            currentEvent.exdates = [];
          }
          currentEvent.exdates.push(line);
        }
      }
    }
  }

  return events;
}

/**
 * Fetches and parses a public iCal (.ics) feed URL bypassing CORS using a secure proxy
 */
export async function fetchICalFeed(icsUrl: string): Promise<ParsedEvent[]> {
  if (!icsUrl) return [];

  // Usar nuestra propia ruta de API local de Next.js como proxy en producción/desarrollo
  // Esto elimina la dependencia del proxy público inestable corsproxy.io y resuelve el error 403.
  const isBrowser = typeof window !== 'undefined';
  const fetchUrl = isBrowser ? '/api/calendar' : icsUrl;

  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch iCal feed: ${response.statusText}`);
    }
    const text = await response.text();
    return parseICS(text);
  } catch (error) {
    console.error("Error fetching or parsing iCal feed", error);
    return [];
  }
}
