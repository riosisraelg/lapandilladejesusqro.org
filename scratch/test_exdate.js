import rrulePkg from 'rrule';
const { rrulestr } = rrulePkg;

const dtstart = 'DTSTART;TZID=America/Mexico_City:20260530T110000';
const rrule = 'FREQ=WEEKLY;BYDAY=SA';
const exdate = 'EXDATE;TZID=America/Mexico_City:20260606T110000'; // June 6 excluded

const input = `${dtstart}\nRRULE:${rrule}\n${exdate}`;

try {
  console.log("Input to rrulestr:");
  console.log(input);
  
  const rule = rrulestr(input, { forceset: true });
  console.log("Rule set created:", rule.toString());
  
  const occurrences = rule.between(new Date("2026-05-29T00:00:00Z"), new Date("2026-06-20T00:00:00Z"));
  console.log("Occurrences:");
  occurrences.forEach(o => console.log(o.toISOString()));
} catch (e) {
  console.error(e);
}
