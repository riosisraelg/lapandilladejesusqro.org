#!/usr/bin/env python3
"""
Unit and Integration Tests for Cancionero Extraction & Migration CLI Engine
La Pandilla de Jesús Qro (lapandilladejesusqro.org)
"""

import os
import sys
import json
import unittest
import subprocess
from extract_cancionero import (
    normalize_text,
    slugify,
    PdfExtractionEngine,
    CancioneroMigrationEngine
)

class TestCancioneroExtractor(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.pdf_path = "/Users/riosisraelg/Downloads/Cancionero HS agosto 2026.pdf"
        cls.landing_file = "src/app/LandingClient.tsx"
        cls.archive_file = "src/app/cancioneroArchive.ts"
        cls.engine = PdfExtractionEngine(cls.pdf_path)

    def test_pdf_page_count(self):
        """Verify PDF contains exactly 9 pages."""
        pages = self.engine.get_page_count()
        self.assertEqual(pages, 9, f"Expected 9 pages, found {pages}")

    def test_extract_all_songs_count(self):
        """Verify exactly 7 active songs are extracted from August 2026 PDF."""
        songs = self.engine.extract_all_songs()
        self.assertEqual(len(songs), 7, f"Expected 7 songs, extracted {len(songs)}")

    def test_song_schema_conformance(self):
        """Verify all extracted songs have non-empty id, title, artist, category, lyrics."""
        songs = self.engine.extract_all_songs()
        for song in songs:
            self.assertIn("id", song)
            self.assertIn("title", song)
            self.assertIn("artist", song)
            self.assertIn("lyrics", song)
            self.assertIn("category", song)
            self.assertTrue(len(song["id"]) > 0, "Song ID must not be empty")
            self.assertTrue(len(song["title"]) > 0, "Song title must not be empty")
            self.assertTrue(len(song["artist"]) > 0, "Song artist must not be empty")
            self.assertTrue(len(song["lyrics"]) > 0, "Song lyrics must not be empty")
            self.assertRegex(song["id"], r"^[a-z0-9_]+$", "Song ID must be valid alphanumeric slug")

    def test_two_column_reconstruction_surge_valentia(self):
        """Verify Surge Valentía (Page 4) multi-column verses are correctly reconstructed."""
        songs = {s["id"]: s for s in self.engine.extract_all_songs()}
        self.assertIn("surge_valentia_berit", songs)
        song = songs["surge_valentia_berit"]
        self.assertEqual(song["title"], "Surge Valentía")
        self.assertEqual(song["artist"], "Berit")
        lyrics = song["lyrics"]
        self.assertIn("Hoy acepto seguirte", lyrics)
        self.assertIn("Tus brazos extendidos", lyrics)
        self.assertIn("Surge valentía, disipa las dudas", lyrics)
        self.assertIn("En tus huellas mis pasos", lyrics)
        self.assertIn("Surge valentiiiiiiiiaaaaa", lyrics)
        # Ensure column 1 opening precedes column 2 outro
        idx_open = lyrics.index("Hoy acepto seguirte")
        idx_outro = lyrics.index("peligre tropezaaar…")
        self.assertLess(idx_open, idx_outro)

    def test_two_column_reconstruction_noche(self):
        """Verify Noche (Page 5) multi-column petitions are correctly reconstructed."""
        songs = {s["id"]: s for s in self.engine.extract_all_songs()}
        self.assertIn("noche_hakuna", songs)
        song = songs["noche_hakuna"]
        self.assertEqual(song["title"], "Noche")
        self.assertEqual(song["artist"], "Hakuna")
        lyrics = song["lyrics"]
        self.assertIn("Por tu iglesia, que te espera a oscuras", lyrics)
        self.assertIn("Por las naciones paganas", lyrics)
        self.assertIn("Por los pueblos oprimidos", lyrics)
        self.assertIn("Por aquellos que trabajan", lyrics)
        self.assertIn("Kyrie Eleison", lyrics)
        self.assertIn("Ten piedad, Señor, ten piedad.", lyrics)

    def test_slugify_rules(self):
        """Verify slugification handles accents, special chars, and casing."""
        self.assertEqual(slugify("Surge Valentía", "Berit"), "surge_valentia_berit")
        self.assertEqual(slugify("Noche", "Hakuna"), "noche_hakuna")
        self.assertEqual(slugify("Gloria", "Martín Valverde"), "gloria_martin_valverde")
        self.assertEqual(slugify("Anima Christi", "Tradicional"), "anima_christi")
        self.assertEqual(slugify("TÚ el único REY", "Tuyo"), "tu_el_unico_rey_tuyo")
        self.assertEqual(slugify("La Guadalupana", "M. Esperón, E. Cortázar"), "la_guadalupana")

    def test_diff_calculation_invariants(self):
        """Verify migration invariant: no songs lost, active + archived = total unique."""
        songs = self.engine.extract_all_songs()
        migration = CancioneroMigrationEngine(
            landing_path=self.landing_file,
            archive_path=self.archive_file,
            backup=False
        )
        diff = migration.calculate_diff(songs)
        self.assertEqual(len(diff["next_active"]), 7)
        self.assertEqual(len(diff["updated_archive"]), 17)

    def test_cli_execution_extract_mode(self):
        """Verify CLI --mode extract outputs valid JSON."""
        res = subprocess.run(
            [sys.executable, "scripts/extract_cancionero.py", "--pdf", self.pdf_path, "--mode", "extract"],
            capture_output=True,
            text=True
        )
        self.assertEqual(res.returncode, 0)
        parsed = json.loads(res.stdout)
        self.assertEqual(len(parsed), 7)

    def test_cli_execution_dry_run_mode(self):
        """Verify CLI --mode dry-run prints summary without error."""
        res = subprocess.run(
            [sys.executable, "scripts/extract_cancionero.py", "--pdf", self.pdf_path, "--mode", "dry-run"],
            capture_output=True,
            text=True
        )
        self.assertEqual(res.returncode, 0)
        self.assertIn("CANCIONERO MIGRATION DIFF", res.stdout)
        self.assertIn("Source PDF Total Songs Extracted : 7", res.stdout)

if __name__ == "__main__":
    unittest.main(verbosity=2)
