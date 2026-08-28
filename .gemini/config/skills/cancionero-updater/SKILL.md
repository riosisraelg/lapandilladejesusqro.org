---
name: cancionero-updater
description: >-
  Autonomous monthly songbook updater for lapandilladejesusqro.org. Extracts songs from monthly PDF songbooks, updates active repertoire in LandingClient.tsx, archives displaced songs safely into cancioneroArchive.ts with zero lyric loss, and verifies application build and test integrity.
---

# Cancionero Monthly Updater Skill

An autonomous, repeatable engineering skill for updating the liturgical songbook on `lapandilladejesusqro.org` each month. This skill enables AI agents and engineers to ingest new monthly PDF songbooks (e.g. Canva exports), extract structured lyrics and metadata, update active rotation in `LandingClient.tsx`, archive displaced songs safely in `cancioneroArchive.ts`, and enforce strict compilation and regression test gates.

---

## 1. Prerequisites & Toolchain Verification

Before initiating monthly songbook extraction, verify that the required local toolchain is installed and accessible.

### 1.1 Toolchain Verification Commands
Run the following commands in the project root directory:

```bash
# 1. Verify Ghostscript (Required for PDF stream decomposition & Type0 font extraction)
which gs || which /opt/homebrew/bin/gs
gs --version

# 2. Verify Python 3 (CLI extraction engine)
python3 --version

# 3. Verify Node.js and npm (Next.js application and test runner)
node --version
npm --version
```

### 1.2 Required Toolchain Matrix
| Tool | Minimum Version | Purpose | Fallback / Resolution |
|---|---|---|---|
| **Ghostscript (`gs`)** | `9.50+` | Extracts layout-aware text streams from Canva Type0/CID fonts | `brew install ghostscript` |
| **Python 3** | `3.9+` | Runs `scripts/extract_cancionero.py` extraction and diff engine | Included in macOS / `brew install python3` |
| **Node.js** | `20.0+` | Runs Next.js 15, `scripts/extract_cancionero.mjs`, and test suites | `brew install node` / `nvm use` |

---

## 2. CLI Tooling Reference & Architecture

The repository provides both a Python extraction engine and a Node.js CLI wrapper:
- **Python Engine**: `scripts/extract_cancionero.py`
- **Node CLI Wrapper**: `scripts/extract_cancionero.mjs`

Both scripts accept identical arguments and follow the CLI contract defined below.

### 2.1 CLI Flags & Options
```bash
python3 scripts/extract_cancionero.py --pdf <path> [options]
# OR
node scripts/extract_cancionero.mjs --pdf <path> [options]
```

| Flag | Argument | Default | Description |
|---|---|---|---|
| `--pdf` | `<file_path>` | *(Required)* | Absolute or relative path to the monthly PDF songbook. |
| `--mode` | `dry-run` \| `extract` \| `apply` | `dry-run` | Operation mode (see §2.2). |
| `--out` | `<output_json_path>` | `None` | Optional file path to export extracted songs as JSON. |
| `--landing-file` | `<file_path>` | `src/app/LandingClient.tsx` | Path to active song component file. |
| `--archive-file` | `<file_path>` | `src/app/cancioneroArchive.ts` | Path to long-term archived song store. |
| `--no-backup` | *flag* | `False` | Disables creation of `.bak` files prior to file updates. |
| `--strict` | *flag* | `False` | Enforces strict validation (fails if 0 songs extracted or fields missing). |

### 2.2 Execution Modes Explained

1. **`--mode extract`**:
   - Parses the target PDF and outputs structured JSON data conforming to the `Song` schema.
   - If `--out` is specified, writes formatted JSON to the file; otherwise outputs to stdout.
   - Does **not** modify any project source files.

2. **`--mode dry-run`**:
   - Performs complete extraction and cross-references extracted songs against current active songs in `LandingClient.tsx` and archived songs in `cancioneroArchive.ts`.
   - Computes set differences ($S_{new}$, $S_{retained}$, $S_{deprecated}$).
   - Prints a formatted diff table in the terminal.
   - Does **not** modify any files on disk.

3. **`--mode apply`**:
   - Performs extraction and diff computation.
   - Creates automatic `.bak` backups: `LandingClient.tsx.bak` and `cancioneroArchive.ts.bak`.
   - Appends all displaced songs ($S_{prev} \setminus S_{new}$) into `src/app/cancioneroArchive.ts`.
   - Replaces the `const defaultSongs = [ ... ];` array in `src/app/LandingClient.tsx` with the new monthly repertoire.
   - Preserves all surrounding React hooks, JSX, modal handlers, and CSS in `LandingClient.tsx`.

---

## 3. Step-by-Step Standard Operating Procedure (SOP)

Follow this 6-step SOP for executing monthly updates (e.g. September 2026, October 2026, and beyond):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MONTHLY SONG REFRESH WORKFLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘
  Step 1: Sanity Check      ──> Verify `gs`, `python3`, `node`, and Git branch
  Step 2: PDF Ingestion     ──> Locate `Cancionero HS <mes> <año>.pdf`
  Step 3: Dry-Run Diff      ──> `node scripts/extract_cancionero.mjs --pdf ... --mode dry-run`
  Step 4: Apply Migration   ──> `node scripts/extract_cancionero.mjs --pdf ... --mode apply`
  Step 5: Validation Gates  ──> Run unit tests, E2E suite, and Next.js build
  Step 6: Git Commit        ──> Commit changes with semantic versioning
```

### Step 1: Toolchain & Repository Sanity Check
Ensure your working directory is the project root and check Git status:
```bash
cd /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org
git status
```

### Step 2: Locate the Target Monthly PDF
Verify that the new monthly songbook PDF exists (typically in `~/Downloads` or the project root):
```bash
ls -lh "/Users/riosisraelg/Downloads/Cancionero HS <mes> 2026.pdf"
```

### Step 3: Run Dry-Run Extraction & Inspect the Diff
Execute the extraction script in `dry-run` mode to inspect the songs and diff table:
```bash
node scripts/extract_cancionero.mjs \
  --pdf "/Users/riosisraelg/Downloads/Cancionero HS <mes> 2026.pdf" \
  --mode dry-run
```

**Checklist for Reviewing Diff Table:**
- [ ] Number of extracted songs matches the expected song count in the PDF.
- [ ] Special pages (e.g. Calendar, Back Cover) are excluded or captured as non-song entries.
- [ ] Lema / Entry prayer is captured with correct category and ID (`lema`).
- [ ] Multi-column lyrics are properly reconstructed in sequential order.
- [ ] Deprecated songs are flagged for safe migration to `cancioneroArchive.ts`.

### Step 4: Apply the Migration
Execute the script in `apply` mode:
```bash
node scripts/extract_cancionero.mjs \
  --pdf "/Users/riosisraelg/Downloads/Cancionero HS <mes> 2026.pdf" \
  --mode apply
```

### Step 5: Post-Migration Validation Gates
Run the full verification pipeline. **All three gates must pass with 0 errors:**

```bash
# Gate 1: Extraction & Layout Unit Tests
python3 scripts/test_extract_cancionero.py

# Gate 2: Full Application E2E Test Suite (5 Tiers, 157+ assertions)
npm test

# Gate 3: Next.js Production Compilation & TypeScript Typecheck
npm run build
```

### Step 6: Git Versioning & Commit
When all gates pass, stage and commit the updated files:
```bash
git add src/app/LandingClient.tsx src/app/cancioneroArchive.ts
git commit -m "feat(cancionero): update active songs for <Mes> <Año> and archive displaced songs"
```

---

## 4. Data Migration Rules & Mathematical Invariants

The migration engine enforces strict set-theoretic invariants to guarantee **zero lyric loss** across all monthly cycles.

### 4.1 Set Relations & Definitions
Let:
- $S_{prev}$: The set of active songs in `src/app/LandingClient.tsx` prior to update.
- $A_{prev}$: The set of archived songs in `src/app/cancioneroArchive.ts` prior to update.
- $S_{new}$: The set of songs extracted from the new monthly PDF.
- $S_{next}$: The resulting active song set in `src/app/LandingClient.tsx`.
- $A_{next}$: The resulting archived song set in `src/app/cancioneroArchive.ts`.

### 4.2 Invariants
1. **Active Repertoire Replacement**:
   $$S_{next} = S_{new}$$
2. **Non-Destructive Cumulative Archive**:
   $$A_{next} = A_{prev} \cup (S_{prev} \setminus S_{new})$$
3. **Conservation of All Lyrics (Zero Loss)**:
   $$\forall s \in (S_{prev} \cup A_{prev}), \quad s \in (S_{next} \cup A_{next})$$
   *No song is ever deleted from the system.*
4. **Identifier Uniqueness**:
   $$\forall s_1, s_2 \in S_{next}, \quad s_1 \neq s_2 \implies s_1.\text{id} \neq s_2.\text{id}$$
   $$\forall a_1, a_2 \in A_{next}, \quad a_1 \neq a_2 \implies a_1.\text{id} \neq a_2.\text{id}$$

### 4.3 Song Data Contract
Every song object in `LandingClient.tsx` and `cancioneroArchive.ts` adheres to:

```typescript
export interface Song {
  id: string;        // Alphanumeric URL slug (e.g. "surge_valentia_berit")
  title: string;     // Full title string (e.g. "Surge Valentía")
  artist: string;    // Composer/Artist (e.g. "Berit", "Martín Valverde", "Tradicional")
  lyrics: string;    // Complete multiline lyrics with newline separation
  category?: string; // Liturgical category (e.g. "Alabanza", "Comunión")
}
```

### 4.4 Slugification & ID Generation Algorithm
Song IDs are generated deterministically:
1. Decompose Unicode characters (NFD) and remove diacritical accents (`á` $\to$ `a`, `é` $\to$ `e`, `ñ` $\to$ `n`).
2. Replace all non-alphanumeric character sequences with underscores `_`.
3. Convert to lowercase and trim leading/trailing underscores.
4. If an artist is present, append the artist slug to prevent collisions between different songs of the same title (e.g. `noche_hakuna`, `surge_valentia_berit`).

---

## 5. Canva PDF Layout & Parsing Engine Details (Troubleshooting Guide)

Canva-generated liturgical songbooks possess unique layout and typography patterns that require special parsing strategies.

### 5.1 Type0 / CID Adobe-Identity-UCS Font CMaps
- **Issue**: Standard PDF text extractors (e.g. naive string extractors) output garbled glyph codes or empty strings because Canva subsets fonts into Type0/CID fonts with custom `/ToUnicode` CMaps.
- **Solution**: The engine uses Ghostscript `txtwrite` (`-sDEVICE=txtwrite`), which resolves `/ToUnicode` CMaps down to valid UTF-8 characters.

### 5.2 Multi-Column Verse Reconstruction
- **Issue**: Songs like *"Surge Valentía"* (Page 4) or *"Noche"* (Page 5) format verses into 2 columns. A naive top-to-bottom parser will interleave column 1 line 1 with column 2 line 1.
- **Solution**: The parser analyzes horizontal token coordinates:
  - If a page has 3 or more lines with 2 token clusters separated by $\ge 2$ spaces, it activates 2-column mode.
  - Left column tokens are collected into `col1`, right column tokens into `col2`.
  - Final lyrics are assembled sequentially: `\n.join(col1 + col2)`.

### 5.3 Canva Drop-Shadow Layer Deduplication
- **Issue**: Text with decorative Canva drop shadows renders duplicate text glyphs at slight offsets $(x+\delta, y+\delta)$.
- **Solution**: The parser collapses identical consecutive strings at matching or near-matching vertical line positions.

### 5.4 Calendar, Motto, and Back-Cover Filtering
- **Page 1 (Cover / Lema)**: Extracted as special song entry `lema` (`"Coro RUAH (Lema)"`) with category `"Lema / Entrada"`.
- **Page 2 (Calendar Schedule)**: Detected via keywords (`"calendario"`, `"jardines de la hacienda"`, `"capuchinas"`) and skipped from song rotation.
- **Page 9 (Back Cover)**: Detected via slogan keywords (`"viva cristo rey"`, `"coro ruah"`) and skipped from song rotation.

---

## 6. Automated Rollback & Recovery Procedures

If `npm run build` or `npm test` fails after running `--mode apply`:

### Immediate Rollback Command:
```bash
# Restore files from automatic .bak backups
cp src/app/LandingClient.tsx.bak src/app/LandingClient.tsx
cp src/app/cancioneroArchive.ts.bak src/app/cancioneroArchive.ts

# Confirm restoration
npm test
npm run build
```

---

## 7. Quick Reference Cheat Sheet

```bash
# 1. Preview changes (Dry run)
node scripts/extract_cancionero.mjs --pdf "path/to/cancionero.pdf" --mode dry-run

# 2. Apply migration (Updates LandingClient.tsx and cancioneroArchive.ts)
node scripts/extract_cancionero.mjs --pdf "path/to/cancionero.pdf" --mode apply

# 3. Verify everything
python3 scripts/test_extract_cancionero.py && npm test && npm run build

# 4. Rollback if necessary
cp src/app/LandingClient.tsx.bak src/app/LandingClient.tsx
cp src/app/cancioneroArchive.ts.bak src/app/cancioneroArchive.ts
```
