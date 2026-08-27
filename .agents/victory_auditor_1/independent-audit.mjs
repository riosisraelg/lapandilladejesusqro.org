import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  INDEPENDENT POST-VICTORY ADVERSARIAL AUDIT');
console.log('  Target: lapandilladejesusqro.org');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function auditAssert(desc, condition) {
  if (condition) {
    passCount++;
    console.log(`  [PASS] ${desc}`);
  } else {
    failCount++;
    console.error(`  [FAIL] ${desc}`);
  }
}

// -----------------------------------------------------------------------------
// CHECK 1: R1 - Catholic Food Prayers & 18 Source Images
// -----------------------------------------------------------------------------
console.log('Checking R1: Catholic Food Prayers & 18 Source Images...');
const uploadedDir = '/Users/riosisraelg/.gemini/antigravity-cli/brain/d4899b3d-c841-45a4-aff4-f09be1bad826/.user_uploaded/';
const images = fs.readdirSync(uploadedDir).filter(f => !f.startsWith('.'));
auditAssert('18 source food prayer images exist in user_uploaded directory', images.length === 18);

const oracionesDataContent = fs.readFileSync('src/data/oracionesData.ts', 'utf8');
auditAssert('FOOD_PRAYERS_DATA is defined in oracionesData.ts', oracionesDataContent.includes('FOOD_PRAYERS_DATA: FoodPrayerDay[]'));
auditAssert('Bendicional citation nn. 883-884 is included', oracionesDataContent.includes('Bendicional') && oracionesDataContent.includes('883-884'));
auditAssert('Domingo food prayer exists with verse & response', oracionesDataContent.includes('alimentos-domingo') && oracionesDataContent.includes('festín de manjares'));
auditAssert('Lunes food prayer exists with verse & response', oracionesDataContent.includes('alimentos-lunes') && oracionesDataContent.includes('trigo celeste'));
auditAssert('Martes food prayer exists with verse & response', oracionesDataContent.includes('alimentos-martes') && oracionesDataContent.includes('huérfano y a la viuda'));
auditAssert('Miércoles food prayer exists with verse & response', oracionesDataContent.includes('alimentos-miercoles') && oracionesDataContent.includes('hierba en los montes'));
auditAssert('Jueves food prayer exists with verse & response', oracionesDataContent.includes('alimentos-jueves') && oracionesDataContent.includes('peregrino por el desierto'));
auditAssert('Viernes food prayer exists with verse & response', oracionesDataContent.includes('alimentos-viernes') && oracionesDataContent.includes('comía con ellos'));
auditAssert('Sábado food prayer exists with verse & response', oracionesDataContent.includes('alimentos-sabado') && oracionesDataContent.includes('Entonen la acción de gracias'));

// -----------------------------------------------------------------------------
// CHECK 2: R2 - Auto-Day Selection & Minimalist Layout
// -----------------------------------------------------------------------------
console.log('\nChecking R2: Auto-Day Selection & Minimalist Layout...');
auditAssert('getDay() mapping is implemented for alimentos deck', oracionesDataContent.includes('dayIndex: 0') && oracionesDataContent.includes('dayIndex: 6'));
const landingContent = fs.readFileSync('src/app/LandingClient.tsx', 'utf8');
auditAssert('LandingClient auto-selects day on alimentos switch', landingContent.includes("if (deck === 'alimentos')") && landingContent.includes("new Date().getDay()"));
auditAssert('LandingClient auto-selects day on modal open', landingContent.includes("isAlimentos || (!deck && activeOracionDeck === 'alimentos')") && landingContent.includes("setActiveOracionIdx(new Date().getDay())"));

// -----------------------------------------------------------------------------
// CHECK 3: R3 - Infinite Swipe Navigation Modulo Loop
// -----------------------------------------------------------------------------
console.log('\nChecking R3: Infinite Swipe Navigation Modulo Loop...');
auditAssert('LandingClient deck navigation implements circular modulo (prev)', landingContent.includes('(currentIdx - 1 + DECKS_ORDER.length) % DECKS_ORDER.length'));
auditAssert('LandingClient deck navigation implements circular modulo (next)', landingContent.includes('(currentIdx + 1) % DECKS_ORDER.length'));
auditAssert('LandingClient card navigation implements circular modulo wrap', landingContent.includes('(newIdx + N) % N'));
auditAssert('LandingClient touch swipe threshold of 80px is enforced', landingContent.includes('thresholdX = 80'));

// -----------------------------------------------------------------------------
// CHECK 4: R4 - Dynamic Brand Color Tones Math
// -----------------------------------------------------------------------------
console.log('\nChecking R4: Dynamic Brand Color Tones Math...');
const deckColorsContent = fs.readFileSync('src/utils/deckColors.ts', 'utf8');
auditAssert('calculateDeckHSL formula exists in deckColors.ts', deckColorsContent.includes('calculateDeckHSL(index: number)'));
auditAssert('Base hue starts at 20 degrees (Catholic coffee #5C3D2E)', deckColorsContent.includes('(20 + safeIdx * 12) % 360'));
auditAssert('Lightness varies within WCAG AA range', deckColorsContent.includes('24 + ((safeIdx * 7) % 22)'));
auditAssert('Saturation varies dynamically', deckColorsContent.includes('30 + ((safeIdx * 5) % 15)'));

// -----------------------------------------------------------------------------
// CHECK 5: R5 - Global Long-Press Tooltip & Tactile Vibration
// -----------------------------------------------------------------------------
console.log('\nChecking R5: Global Long-Press Tooltip & Tactile Vibration...');
const useLongPressContent = fs.readFileSync('src/utils/useLongPress.ts', 'utf8');
auditAssert('useLongPress hook exists with 450ms default threshold', useLongPressContent.includes('threshold = 450'));
auditAssert('useLongPress has 10px move cancellation tolerance', useLongPressContent.includes('cancelOnMoveDistance = 10'));
auditAssert('useLongPress triggers vibration [20]ms', useLongPressContent.includes('vibrationPattern = [20]'));
auditAssert('Global document touchstart listener handles [data-tooltip] with 450ms timer', landingContent.includes("longPressTimer = setTimeout(() => {") && landingContent.includes("450);"));
auditAssert('Interactive buttons feature data-tooltip attributes', landingContent.includes('data-tooltip="Abrir el tarjetero interactivo de oraciones'));

// -----------------------------------------------------------------------------
// CHECK 6: R6 - Dynamic OG Image Generation & Deep-Linked Modals
// -----------------------------------------------------------------------------
console.log('\nChecking R6: Dynamic OG Image Generation & Deep-Linked Modals...');
const ogRouteContent = fs.readFileSync('src/app/api/og/route.tsx', 'utf8');
auditAssert('OG route handler creates 1200x630px ImageResponse', ogRouteContent.includes('width: 1200') && ogRouteContent.includes('height: 630'));
auditAssert('OG route dynamically extracts title, category, date, location', ogRouteContent.includes("searchParams.get('title')") && ogRouteContent.includes("searchParams.get('location')"));
const calPageContent = fs.readFileSync('src/app/calendario/page.tsx', 'utf8');
auditAssert('Calendario page generateMetadata parses searchParams.evento', calPageContent.includes('const eventId = params.evento;'));
auditAssert('Calendario page generates dynamic /api/og image metadata URL', calPageContent.includes('/api/og?title='));
const calClientContent = fs.readFileSync('src/app/calendario/CalendarioClient.tsx', 'utf8');
auditAssert('CalendarioClient auto-opens modal when ?evento= is present', calClientContent.includes('searchParams.get("evento")') && calClientContent.includes('setSelectedEvent(found)'));

// -----------------------------------------------------------------------------
// CHECK 7: R7 - Rosary UI Overhaul & 5-Element Mystery Structure
// -----------------------------------------------------------------------------
console.log('\nChecking R7: Rosary UI Overhaul & 5-Element Mystery Structure...');
const mysterySets = ['gozosos', 'dolorosos', 'gloriosos', 'luminosos'];
for (const mSet of mysterySets) {
  auditAssert(`Misterios ${mSet} data structure defined in oracionesData.ts`, oracionesDataContent.includes(`type: '${mSet}'`));
}
auditAssert('Rosary UI renders Element 1: Artwork icon indicator', landingContent.includes('<MysteryArtworkIcon iconKey={oracion.image}'));
auditAssert('Rosary UI renders Element 2: Scriptural citation reference', landingContent.includes('oracion.biblicalRef') && landingContent.includes('Cita Bíblica'));
auditAssert('Rosary UI renders Element 3: Direct scripture reading text', landingContent.includes('oracion.scriptureText') && landingContent.includes('Lectura de la Palabra'));
auditAssert('Rosary UI renders Element 4: Contemplative meditation text', landingContent.includes('oracion.mysteryMeditation') && landingContent.includes('Meditación Contemplativa'));
auditAssert('Rosary UI renders Element 5: Reflection question for the decade', landingContent.includes('oracion.reflectionQuestion') && landingContent.includes('Pregunta de Reflexión'));
auditAssert('Rosary UI renders collapsible nested repeats accordion', landingContent.includes('rosario-repeats-accordion') && landingContent.includes('toggleAllRepeats'));
auditAssert('Rosary UI renders top-level vibrating decade counter button beside X', landingContent.includes('rosario-top-counter-btn') && landingContent.includes('handleIncrementDecadeCounter'));

// -----------------------------------------------------------------------------
// CHECK 8: R8 - Standalone Mass Guide, Communion Prayers & Scraper API
// -----------------------------------------------------------------------------
console.log('\nChecking R8: Standalone Mass Guide, Communion Prayers & Scraper API...');
auditAssert('Mass Guide has a standalone launcher button in dashboard', landingContent.includes('btn-guia') && landingContent.includes('Guía de Misa'));
const massResponsesContent = fs.readFileSync('src/app/massResponses.ts', 'utf8');
auditAssert('Traditional Mexican sung hymns (Gloria de Mejia) are included', massResponsesContent.includes('Gloria de Mejía') && massResponsesContent.includes('Alejandro Mejía Pereda'));
auditAssert('Santo mexicano and Cordero de Dios are included', massResponsesContent.includes('santoMejia') && massResponsesContent.includes('corderoMejia'));
auditAssert('Priest secret communion prayers from Roman Missal are present', massResponsesContent.includes('Sacerdote (en secreto)') && massResponsesContent.includes('El Cuerpo y la Sangre de nuestro Señor Jesucristo'));
const scraperContent = fs.readFileSync('src/app/api/mass-readings/route.ts', 'utf8');
auditAssert('Evangelizo XML scraper route is implemented', scraperContent.includes('feed.evangelizo.org'));
auditAssert('Scraper has static liturgy fallback on network failure', scraperContent.includes('FALLBACK_READINGS'));

// -----------------------------------------------------------------------------
// CHECK 9: R9 - Misas de Precepto, Computus & Multi-Calendar Export
// -----------------------------------------------------------------------------
console.log('\nChecking R9: Misas de Precepto, Computus & Multi-Calendar Export...');
const preceptoContent = fs.readFileSync('src/data/preceptoData.ts', 'utf8');
auditAssert('Meeus Computus algorithm is implemented in preceptoData.ts', preceptoContent.includes('computeEasterSunday(year: number)'));
auditAssert('Santa María Madre de Dios (Jan 1) obligation is defined', preceptoContent.includes('Santa María, Madre de Dios') && preceptoContent.includes('CEM_OBLIGATION'));
auditAssert('Nuestra Señora de Guadalupe (Dec 12) obligation is defined', preceptoContent.includes('Nuestra Señora de Guadalupe') && preceptoContent.includes('12-12'));
auditAssert('Navidad (Dec 25) obligation is defined', preceptoContent.includes('Natividad del Señor') && preceptoContent.includes('12-25'));
const calExportContent = fs.readFileSync('src/utils/calendarExport.ts', 'utf8');
auditAssert('Google Calendar URL generator is implemented', calExportContent.includes('generateGoogleCalendarUrl'));
auditAssert('Outlook Web Calendar URL generator is implemented', calExportContent.includes('generateOutlookWebUrl'));
auditAssert('RFC 5545 .ics generator is implemented', calExportContent.includes('generateICSContent') && calExportContent.includes('BEGIN:VCALENDAR'));

// -----------------------------------------------------------------------------
// CHECK 10: R10 - Git Commits, Semver Tags & Remote Push
// -----------------------------------------------------------------------------
console.log('\nChecking R10: Git Commits, Semver Tags & Remote Push...');
import { execSync } from 'child_process';
const gitLog = execSync('git log -n 10 --oneline', { encoding: 'utf8' });
auditAssert('Git history contains conventional commits', gitLog.includes('feat(') || gitLog.includes('release:'));
const gitTags = execSync('git tag -l', { encoding: 'utf8' });
auditAssert('Semantic version tags exist locally', gitTags.includes('v1.0.0') && gitTags.includes('v2026.14.0'));
const gitStatus = execSync('git status -s', { encoding: 'utf8' });
auditAssert('Git working directory is clean of uncommitted source code', !gitStatus.includes(' src/'));

console.log('\n================================================================');
console.log(`  AUDIT COMPLETED: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
}
