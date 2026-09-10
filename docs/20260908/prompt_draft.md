# Teamwork Project Prompt — Final

> Status: Launched — Running in background via teamwork_preview
> Goal: Wait for the teamwork multi-agent system to complete the task.

Upgrade the Mass Readings web scraper to accurately fetch the complete text of all daily readings, and dynamically integrate them into their exact canonical order within the Mass Guide UI. Configure the main Mass button to open directly to this guide.

Working directory: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org
Integrity mode: development

## Requirements

### R1. Overhaul the Daily Readings Scraper (API)
Improve the existing mass readings API (`src/app/api/mass-readings/route.ts` or similar) to accurately scrape and return the FULL text of the daily liturgy. This must reliably include the full citations, the First Reading, the entire Responsorial Psalm (including the recurring response phrase and all verses), the Second Reading (if applicable), the Alleluia, and the Gospel. 

### R2. Canonical UI Integration
In the Guía de Misa modal (`LandingClient.tsx`), remove the old accordion approach. Instead, dynamically inject the fetched daily readings directly into their exact liturgical sequence within the "Liturgia de la Palabra" section. The flow must be continuous: Primera Lectura → Salmo Responsorial → Segunda Lectura → Aleluya → Evangelio, seamlessly fitting between the initial rites and the Homily/Creed.

### R3. Direct Access & Auto-fetch
Modify the main "Seguir la Misa" / "Guía de Misa" button on the landing page so that it opens the modal directly to the start of the mass, and ensure the readings are automatically fetched without requiring the user to press a manual "load" button.

## Acceptance Criteria

### API Scraper Accuracy
- [ ] Programmatic/Manual: Triggering the API returns a complete JSON object containing the exact and full text for today's Psalm (with response) and Gospel, matching official liturgical sources.

### UI Integration
- [ ] Manual: Navigating to the "Liturgia de la Palabra" section in the modal displays the fetched readings sequentially in the correct liturgical order, without breaking the existing swipeable layout.
- [ ] Manual: Opening the Mass Guide from the main menu automatically triggers the fetch and lands the user in the correct initial view.
