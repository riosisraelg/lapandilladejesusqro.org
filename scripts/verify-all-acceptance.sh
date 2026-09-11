#!/usr/bin/env bash
# ==============================================================================
# Master Acceptance Criteria Verification Script
# Project: lapandilladejesusqro.org — Tripartite Liturgical Platform Ecosystem
# Governing Specifications: ORIGINAL_REQUEST.md & docs/srs.md
# ==============================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}        MASTER ACCEPTANCE VERIFICATION HARNESS (5 CRITERIA)                   ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo "Root Directory: $ROOT_DIR"
echo "Timestamp:      $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo ""

# ------------------------------------------------------------------------------
# 1. Acceptance Criteria 1: Subproject 1 (Scraper) Programmatic Test
# ------------------------------------------------------------------------------
echo -e "${YELLOW}▶ [1/5] Verifying AC-1: Subproject 1 (Spanish Scraper) Programmatic Test...${NC}"
(
  cd "$ROOT_DIR/subprojects/spanish-mass-readings"
  npm test
)
echo -e "${GREEN}✔ AC-1 PASSED: Subproject 1 successfully fetches, parses, and validates lectionary.${NC}\n"

# ------------------------------------------------------------------------------
# 2. Acceptance Criteria 2: Subproject 1 Git, Remote & CalVer Tag Verification
# ------------------------------------------------------------------------------
echo -e "${YELLOW}▶ [2/5] Verifying AC-2: Subproject 1 Git Repo, Remote & CalVer Tag...${NC}"
(
  cd "$ROOT_DIR/subprojects/spanish-mass-readings"
  bash scripts/verify-git-calver.sh
)
echo -e "${GREEN}✔ AC-2 PASSED: Subproject 1 Git repository, remote origin, and CalVer tag verified.${NC}\n"

# ------------------------------------------------------------------------------
# 3. Acceptance Criteria 3: Subproject 2 (Mining Tool) Separation & Chat Alignment
# ------------------------------------------------------------------------------
echo -e "${YELLOW}▶ [3/5] Verifying AC-3: Subproject 2 Ingestion, Separation & Chat Alignment...${NC}"
(
  cd "$ROOT_DIR/subprojects/mass-transcript-miner"
  npm test
  node tests/test-alignment.mjs
  node tests/test-segmenter.mjs
  node tests/test-dialogue.mjs
)
echo -e "${GREEN}✔ AC-3 PASSED: Subproject 2 transcript mining and chat alignment data verified.${NC}\n"

# ------------------------------------------------------------------------------
# 4. Acceptance Criteria 4: Scraper Integration Dual-Call & Combined Dataset
# ------------------------------------------------------------------------------
echo -e "${YELLOW}▶ [4/5] Verifying AC-4: Scraper Integration (English + Spanish Scrapers & Combined Dataset)...${NC}"
(
  node "$ROOT_DIR/scripts/test-scraper-integration.mjs"
)
echo -e "${GREEN}✔ AC-4 PASSED: Host application dual-scraper integration verified successfully.${NC}\n"

# ------------------------------------------------------------------------------
# 5. Acceptance Criteria 5: Codebase Extraction Provenance Verification
# ------------------------------------------------------------------------------
echo -e "${YELLOW}▶ [5/5] Verifying AC-5: Codebase Extraction Provenance Audit...${NC}"
(
  node "$ROOT_DIR/scripts/verify-extraction-provenance.mjs"
)
echo -e "${GREEN}✔ AC-5 PASSED: Extraction provenance from ~/teamwork_projects/guadalupe_mass_interactive confirmed.${NC}\n"

# ------------------------------------------------------------------------------
# Final Synthesis
# ------------------------------------------------------------------------------
echo -e "${GREEN}==============================================================================${NC}"
echo -e "${GREEN}    ALL 5 ACCEPTANCE CRITERIA ARE 100% VERIFIED AND PASSING SUCCESSFULLY!      ${NC}"
echo -e "${GREEN}==============================================================================${NC}"
echo -e "  [AC-1] Subproject 1 Scraper Programmatic Test       : ${GREEN}PASSED${NC}"
echo -e "  [AC-2] Subproject 1 Git, GitHub Remote & CalVer Tag : ${GREEN}PASSED${NC}"
echo -e "  [AC-3] Subproject 2 Mining Tool & Chat Alignment    : ${GREEN}PASSED${NC}"
echo -e "  [AC-4] Scraper Integration Dual Combined Dataset    : ${GREEN}PASSED${NC}"
echo -e "  [AC-5] Codebase Extraction Provenance Audit         : ${GREEN}PASSED${NC}"
echo -e "${GREEN}==============================================================================${NC}"
exit 0
