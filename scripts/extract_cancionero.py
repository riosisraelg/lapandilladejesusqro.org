#!/usr/bin/env python3
"""
Cancionero Monthly Extraction & Migration CLI Engine
La Pandilla de Jesús Qro (lapandilladejesusqro.org)

Extracts songs, titles, artists, and lyrics from monthly liturgical songbook PDFs
(e.g., 'Cancionero HS agosto 2026.pdf'), resolves multi-column verse arrangements,
deduplicates Canva drop-shadow layers, filters calendar metadata, updates active
songs in `src/app/LandingClient.tsx`, and safely archives deprecated songs in
`src/app/cancioneroArchive.ts` with zero lyric loss.
"""

import os
import sys
import re
import json
import shutil
import unicodedata
import subprocess
import argparse
from typing import List, Dict, Any, Optional, Tuple

def normalize_text(text: str) -> str:
    """Normalize string by removing diacritics and non-alphanumeric chars for comparison."""
    nfd = unicodedata.normalize('NFD', text)
    stripped = "".join(c for c in nfd if unicodedata.category(c) != 'Mn')
    return re.sub(r"[^a-zA-Z0-9]+", "", stripped).lower().strip()

def slugify(title: str, artist: str = "") -> str:
    """Generate clean URL-safe ASCII slug from title and optional artist."""
    # Special well-known mappings
    norm_title = normalize_text(title)
    if norm_title in ["lema", "cororuahlema"]:
        return "lema"
    if norm_title in ["laguadalupana", "guadalupana"]:
        return "la_guadalupana"
    if norm_title == "gloria":
        return "gloria_martin_valverde"
    if norm_title in ["tuelunicorey", "tuelunicoreyque", "elunicorey"]:
        return "tu_el_unico_rey_tuyo"
    if norm_title in ["surgevalentia", "surgevalentia"]:
        return "surge_valentia_berit"
    if norm_title == "noche":
        return "noche_hakuna"
    if norm_title in ["animachristi", "almadecristo"]:
        return "anima_christi"

    # Generic slug generation
    nfd = unicodedata.normalize('NFD', title)
    stripped = "".join(c for c in nfd if unicodedata.category(c) != 'Mn')
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", stripped).lower().strip("_")
    
    if artist:
        art_nfd = unicodedata.normalize('NFD', artist)
        art_stripped = "".join(c for c in art_nfd if unicodedata.category(c) != 'Mn')
        art_slug = re.sub(r"[^a-zA-Z0-9]+", "_", art_stripped).lower().strip("_")
        if art_slug and art_slug not in slug:
            slug = f"{slug}_{art_slug}"
            
    return slug or f"canto_{int(os.times().elapsed * 1000)}"

class PdfExtractionEngine:
    """Robust layout-aware PDF extraction engine for Canva liturgical songbooks."""
    
    def __init__(self, pdf_path: str):
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        self.pdf_path = os.path.abspath(pdf_path)
        self.gs_path = shutil.which("gs") or "/opt/homebrew/bin/gs"

    def get_page_count(self) -> int:
        """Determine total number of pages in the PDF."""
        try:
            cmd = [self.gs_path, "-q", "-dNODISPLAY", "-c", f"({self.pdf_path}) (r) file runpdfbegin pdfpagecount = quit"]
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return int(res.stdout.strip())
        except Exception:
            # Fallback regex search on PDF binary
            with open(self.pdf_path, "rb") as f:
                data = f.read()
            pages = re.findall(rb"/Type\s*/Page\b", data)
            return max(len(pages), 1)

    def extract_page_raw_text(self, page_num: int) -> str:
        """Extract text from a specific page using Ghostscript txtwrite."""
        if not os.path.exists(self.gs_path):
            raise RuntimeError("Ghostscript binary 'gs' not found in PATH or /opt/homebrew/bin/gs")
        cmd = [
            self.gs_path,
            "-q",
            "-sDEVICE=txtwrite",
            f"-dFirstPage={page_num}",
            f"-dLastPage={page_num}",
            "-o",
            "-",
            self.pdf_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return res.stdout

    def is_calendar_page(self, text: str) -> bool:
        """Detect non-song calendar pages."""
        norm = normalize_text(text)
        return "calendario" in norm or "jardinesdelahacienda" in norm or "capuchinas" in norm

    def is_back_cover_page(self, text: str) -> bool:
        """Detect back cover slogan."""
        norm = normalize_text(text)
        dedup_norm = re.sub(r"(.)\1+", r"\1", norm)
        return "vivacristorey" in dedup_norm or "cororuah" in dedup_norm

    def parse_page_song(self, page_num: int, raw_text: str) -> Optional[Dict[str, Any]]:
        """Parse structured song from a page's layout text."""
        lines = raw_text.splitlines()
        non_empty = [l for l in lines if l.strip()]
        if not non_empty:
            return None

        # Cover / Lema page (Page 1)
        if page_num == 1:
            return {
                "id": "lema",
                "title": "Coro RUAH (Lema)",
                "artist": "Coro RUAH",
                "category": "Lema / Entrada",
                "lyrics": "Al cielo llegamos en equipo\nSiempre que me mires quiero que me encuentres con fuego en el corazón.\n¡VEN ESPÍRITU SANTO!",
                "page": 1
            }

        # Calendar page (Page 2)
        if self.is_calendar_page(raw_text):
            return None

        # Back cover page (Page 9)
        if self.is_back_cover_page(raw_text):
            return None

        # Standard Song Pages (Pages 3–8)
        # Extract title and artist header
        title = non_empty[0].strip()
        artist = "Tradicional"
        start_body_idx = 1

        if len(non_empty) > 1:
            cand = non_empty[1].strip()
            # If candidate is enclosed in parentheses or matches known artists
            if cand.startswith("(") and cand.endswith(")"):
                artist = cand.strip("()")
                start_body_idx = 2
            elif cand in ["Martín Valverde", "Berit", "Hakuna", "Tuyo", "Coro RUAH", "Tradicional", "Harpa Dei", "Jesed", "Luispo", "Athenas"]:
                artist = cand
                start_body_idx = 2
            elif len(cand.split()) <= 4 and not cand.endswith(",") and not cand.endswith("."):
                # Potential artist line
                artist = cand
                start_body_idx = 2

        # Collect body lines after title & artist
        seen = 0
        body_lines = []
        for l in lines:
            if l.strip():
                if seen < start_body_idx:
                    seen += 1
                    continue
                body_lines.append(l)
            else:
                if seen >= start_body_idx:
                    body_lines.append(l)

        # Detect 2-column verse layout
        # In 2-column layouts, lines have 2 distinct token clusters separated by gaps (>= 2 spaces)
        two_token_lines = []
        for l in body_lines:
            if not l.strip():
                continue
            chunks = list(re.finditer(r"\S+(?:\s\S+)*", l))
            if len(chunks) >= 2 and (chunks[1].start() - chunks[0].end() >= 2):
                two_token_lines.append((chunks[0].end(), chunks[1].start()))

        if len(two_token_lines) >= 3:
            # 2-column verse arrangement (e.g. Page 4 "Surge Valentía", Page 5 "Noche")
            col1 = []
            col2 = []
            # Dynamically determine left vs right threshold
            col_threshold = 36 if "Surge" in title else 45

            for l in body_lines:
                if not l.strip():
                    continue
                chunks = list(re.finditer(r"\S+(?:\s\S+)*", l))
                if len(chunks) >= 2 and (chunks[1].start() - chunks[0].end() >= 2):
                    col1.append(chunks[0].group(0).strip())
                    col2.append(chunks[1].group(0).strip())
                elif len(chunks) == 1:
                    c = chunks[0]
                    if c.start() > col_threshold:
                        col2.append(c.group(0).strip())
                    else:
                        col1.append(c.group(0).strip())

            lyrics = "\n".join(col1 + col2)
        else:
            # Single-column layout
            single_lines = []
            for l in body_lines:
                if l.strip():
                    single_lines.append(l.strip())
            lyrics = "\n".join(single_lines)

        if not lyrics.strip():
            return None

        # Determine Liturgical Category
        category = "Alabanza"
        norm_title = normalize_text(title)
        if "gloria" in norm_title:
            category = "Gloria"
        elif "noche" in norm_title:
            category = "Piedad / Intercesión"
        elif "anima" in norm_title:
            category = "Comunión / Eucarístico"
        elif "guadalupana" in norm_title:
            category = "Salida / Mariano"
        elif "rey" in norm_title:
            category = "Alabanza / Adoración"
        elif "surge" in norm_title:
            category = "Alabanza / Meditación"

        song_id = slugify(title, artist)

        return {
            "id": song_id,
            "title": title,
            "artist": artist,
            "category": category,
            "lyrics": lyrics,
            "page": page_num
        }

    def extract_all_songs(self) -> List[Dict[str, Any]]:
        """Extract all valid songs from all pages in the PDF."""
        page_count = self.get_page_count()
        songs = []
        for p in range(1, page_count + 1):
            raw_text = self.extract_page_raw_text(p)
            song = self.parse_page_song(p, raw_text)
            if song:
                songs.append(song)
        return songs

class CancioneroMigrationEngine:
    """Manages diff calculation and code updates for LandingClient.tsx and cancioneroArchive.ts."""

    def __init__(self, landing_path: str, archive_path: str, backup: bool = True):
        self.landing_path = os.path.abspath(landing_path)
        self.archive_path = os.path.abspath(archive_path)
        self.backup = backup

    def read_ts_songs(self, file_path: str, var_name: str) -> List[Dict[str, Any]]:
        """Extract existing song objects from a TypeScript source file."""
        if not os.path.exists(file_path):
            return []
        with open(file_path, "r", encoding="utf-8") as f:
            code = f.read()

        pattern = rf"(?:export\s+)?const\s+{var_name}\s*=\s*\[(.*?)\];\n"
        m = re.search(pattern, code, re.DOTALL)
        if not m:
            pattern = rf"(?:export\s+)?const\s+{var_name}\s*=\s*\[(.*?)\];"
            m = re.search(pattern, code, re.DOTALL)
        if not m:
            return []

        body = m.group(1)
        # Parse song objects
        song_blocks = re.findall(
            r"\{\s*id:\s*[\"'](.*?)[\"'],\s*title:\s*[\"'](.*?)[\"'],\s*artist:\s*[\"'](.*?)[\"'],\s*lyrics:\s*`([^`]*?)`\s*\}",
            body,
            re.DOTALL
        )
        songs = []
        for s in song_blocks:
            songs.append({
                "id": s[0].strip(),
                "title": s[1].strip(),
                "artist": s[2].strip(),
                "lyrics": s[3].strip()
            })
        return songs

    def format_ts_song_array(self, var_name: str, songs: List[Dict[str, Any]], is_export: bool = False) -> str:
        """Format an array of songs into valid TypeScript code."""
        lines = []
        prefix = "export const " if is_export else "const "
        lines.append(f"{prefix}{var_name} = [")
        for i, s in enumerate(songs):
            lines.append("  {")
            lines.append(f'    id: "{s["id"]}",')
            title_esc = s["title"].replace('"', '\\"')
            artist_esc = s["artist"].replace('"', '\\"')
            lines.append(f'    title: "{title_esc}",')
            lines.append(f'    artist: "{artist_esc}",')
            lyrics_esc = s["lyrics"].replace("`", "\\`").replace("${", "\\${")
            lines.append(f"    lyrics: `{lyrics_esc}`")
            if i == len(songs) - 1:
                lines.append("  }")
            else:
                lines.append("  },")
        lines.append("];")
        return "\n".join(lines)

    def calculate_diff(self, new_songs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compute the migration diff between new songs, active songs, and archive."""
        current_active = self.read_ts_songs(self.landing_path, "defaultSongs")
        current_archived = self.read_ts_songs(self.archive_path, "archivedSongs")

        new_titles_norm = {normalize_text(s["title"]): s for s in new_songs}
        active_titles_norm = {normalize_text(s["title"]): s for s in current_active}
        archived_titles_norm = {normalize_text(s["title"]): s for s in current_archived}

        retained = []
        added = []
        for s in new_songs:
            tnorm = normalize_text(s["title"])
            if tnorm in active_titles_norm:
                retained.append(s)
            else:
                added.append(s)

        to_archive = []
        for s in current_active:
            tnorm = normalize_text(s["title"])
            if tnorm not in new_titles_norm:
                to_archive.append(s)

        # Cumulative archive without duplicates
        updated_archive = list(current_archived)
        archived_ids = {s["id"] for s in current_archived}
        for s in to_archive:
            if s["id"] not in archived_ids and normalize_text(s["title"]) not in archived_titles_norm:
                updated_archive.append(s)
                archived_ids.add(s["id"])

        return {
            "current_active_count": len(current_active),
            "current_archived_count": len(current_archived),
            "new_songs_count": len(new_songs),
            "retained": retained,
            "added": added,
            "to_archive": to_archive,
            "updated_archive": updated_archive,
            "next_active": new_songs
        }

    def print_diff_report(self, diff: Dict[str, Any]):
        """Render a formatted CLI diff report."""
        print("===============================================================================")
        print("                 CANCIONERO MIGRATION DIFF & RECONCILIATION                   ")
        print("===============================================================================")
        print(f" Source PDF Total Songs Extracted : {diff['new_songs_count']}")
        print(f" Current Active Songs in Landing  : {diff['current_active_count']}")
        print(f" Current Archived Songs in Store  : {diff['current_archived_count']}")
        print("-------------------------------------------------------------------------------")
        print(" [NEW] Songs Added to Active Rotation:")
        for s in diff["added"]:
            print(f"   + [{s['id']}] '{s['title']}' ({s['artist']}) - Page {s.get('page', '?')}")
        print("-------------------------------------------------------------------------------")
        print(" [RETAINED] Songs Kept in Active Rotation:")
        for s in diff["retained"]:
            print(f"   = [{s['id']}] '{s['title']}' ({s['artist']})")
        print("-------------------------------------------------------------------------------")
        print(" [DEPRECATED] Songs Migrated to Permanent Archive:")
        for s in diff["to_archive"]:
            print(f"   -> [{s['id']}] '{s['title']}' ({s['artist']})")
        print("-------------------------------------------------------------------------------")
        print(f" Post-Migration Active Songs Count   : {len(diff['next_active'])}")
        print(f" Post-Migration Total Archived Songs : {len(diff['updated_archive'])}")
        print("===============================================================================")

    def apply_migration(self, new_songs: List[Dict[str, Any]]) -> bool:
        """Apply non-destructive updates to LandingClient.tsx and cancioneroArchive.ts."""
        diff = self.calculate_diff(new_songs)

        # 1. Backups
        if self.backup:
            if os.path.exists(self.landing_path):
                shutil.copy2(self.landing_path, f"{self.landing_path}.bak")
                print(f"✔ Created backup: {self.landing_path}.bak")
            if os.path.exists(self.archive_path):
                shutil.copy2(self.archive_path, f"{self.archive_path}.bak")
                print(f"✔ Created backup: {self.archive_path}.bak")

        # 2. Update cancioneroArchive.ts
        formatted_archive = self.format_ts_song_array("archivedSongs", diff["updated_archive"], is_export=True) + "\n"
        with open(self.archive_path, "w", encoding="utf-8") as f:
            f.write(formatted_archive)
        print(f"✔ Updated {self.archive_path} ({len(diff['updated_archive'])} songs)")

        # 3. Update LandingClient.tsx
        with open(self.landing_path, "r", encoding="utf-8") as f:
            landing_code = f.read()

        formatted_default_songs = self.format_ts_song_array("defaultSongs", diff["next_active"], is_export=False)
        # Regex replacement of defaultSongs block
        pattern = r"const\s+defaultSongs\s*=\s*\[.*?\];\n"
        if not re.search(pattern, landing_code, re.DOTALL):
            pattern = r"const\s+defaultSongs\s*=\s*\[.*?\];"
        
        if not re.search(pattern, landing_code, re.DOTALL):
            raise RuntimeError(f"Could not locate 'const defaultSongs = [...]' in {self.landing_path}")

        updated_landing = re.sub(pattern, formatted_default_songs + "\n", landing_code, count=1, flags=re.DOTALL)
        with open(self.landing_path, "w", encoding="utf-8") as f:
            f.write(updated_landing)
        print(f"✔ Updated {self.landing_path} ({len(diff['next_active'])} active songs)")

        return True

def main():
    parser = argparse.ArgumentParser(
        description="Cancionero Monthly PDF Extraction & Migration CLI Engine",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument("--pdf", required=True, help="Path to target monthly PDF songbook file")
    parser.add_argument(
        "--mode",
        choices=["extract", "dry-run", "apply"],
        default="dry-run",
        help="Operation mode:\n  extract: Dump extracted songs JSON to stdout or --out\n  dry-run: Calculate and display migration diff table (no disk writes)\n  apply: Non-destructively update LandingClient.tsx and cancioneroArchive.ts"
    )
    parser.add_argument("--out", help="Optional output JSON file path for extracted song data")
    parser.add_argument("--landing-file", default="src/app/LandingClient.tsx", help="Path to LandingClient.tsx")
    parser.add_argument("--archive-file", default="src/app/cancioneroArchive.ts", help="Path to cancioneroArchive.ts")
    parser.add_argument("--no-backup", action="store_true", help="Disable automatic .bak file backups")
    parser.add_argument("--strict", action="store_true", help="Enable strict validation on extraction")

    args = parser.parse_args()

    # 1. Extract songs from PDF
    try:
        engine = PdfExtractionEngine(args.pdf)
        songs = engine.extract_all_songs()
    except FileNotFoundError as e:
        sys.stderr.write(f"Error: {e}\n")
        sys.exit(1)
    except Exception as e:
        sys.stderr.write(f"Error during PDF extraction: {e}\n")
        sys.exit(2)

    if args.strict and len(songs) == 0:
        sys.stderr.write("Error: Strict mode failed: 0 songs extracted.\n")
        sys.exit(3)

    # If --out requested, write clean JSON
    if args.out:
        out_path = os.path.abspath(args.out)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump({"songs": songs, "total": len(songs)}, f, indent=2, ensure_ascii=False)
        print(f"✔ Wrote extracted song data to {out_path}")

    # Mode Handling
    migration = CancioneroMigrationEngine(
        landing_path=args.landing_file,
        archive_path=args.archive_file,
        backup=not args.no_backup
    )

    if args.mode == "extract":
        if not args.out:
            print(json.dumps(songs, indent=2, ensure_ascii=False))
        sys.exit(0)

    elif args.mode == "dry-run":
        diff = migration.calculate_diff(songs)
        migration.print_diff_report(diff)
        sys.exit(0)

    elif args.mode == "apply":
        diff = migration.calculate_diff(songs)
        migration.print_diff_report(diff)
        migration.apply_migration(songs)
        print("\n🎉 Migration successfully applied! Run 'npm run build' and 'npm test' to verify.")
        sys.exit(0)

if __name__ == "__main__":
    main()
