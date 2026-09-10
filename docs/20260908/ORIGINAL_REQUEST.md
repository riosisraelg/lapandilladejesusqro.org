# Original User Request

## Initial Request — 2026-08-27T05:52:27Z

# Teamwork Project Prompt — Draft

> Requested team: Use a very large team of agents.

Update the application's Deck system to improve navigation animations, introduce dynamic styling, and populate a new "Prayers for Food" deck. Additionally, overhaul the Rosary UI, implement event image generation and sharing, build a daily mass scraper, and integrate Misas de Precepto into the calendar.

Working directory: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org
Integrity mode: development

## Requirements

### R1. Transcribe and Structure Prayers (Food)
Extract the exact text from the 18 provided images containing the Catholic daily prayers for meals. Include both "Antes de las comidas" and "Después de las comidas" for every day (Sunday to Saturday). Remove the existing food prayers and insert these as a new deck in sequential order. Set default language to Spanish.

### R2. Auto-Day Selection & Minimalist Layout (Decks)
The food deck must automatically detect the current day of the week and open directly to that day's prayer, while allowing manual swiping to other days. Maximize screen space for content (similar to the existing Rosary layout).

### R3. Infinite Swipe Animations (Decks)
Remove current complex deck animations. Implement a minimal swipe-left/swipe-right gesture to navigate between decks, acting as an infinite loop (swiping past the last deck loops smoothly to the first).

### R4. Dynamic Color Tones (Decks)
Visually distinguish different decks by dynamically calculating different tones or gradients of the main brand color in the code (e.g., varying HSL lightness by index).

### R5. Long-Press Tooltips (Global)
Maintain the global usability standard: a long-press on any button must trigger an info description/tooltip.

### R6. Event Image Previews & Shareable Modals
Add functionality to events to generate custom image previews (OG Images) when sharing links. Each event must have a unique URL. Visiting the URL should open the existing modal system to display the event's detailed info.

### R7. Rosary UI Overhaul
Redesign the Rosary UI to be minimalist and match the website style. 
- **Mysteries**: Sequentially display an image, citation reference, direct text, meditation, and a reflection question.
- **Prayers**: Display full text (no cut-offs). Nested lists for repeated prayers with a control to open/collapse them. Main and self-prayers get their own dedicated decks. Apply to all rosaries.
- **Counter**: Move the counter to a simple button at the top beside the 'X' button. Tapping it increments the count and triggers device vibration.

### R8. Mass Guide Enhancement & Daily Scraping
- **Content**: Research and complete missing priest dialogues (especially Communion) and add traditional Mexican sung versions of prayers (e.g., Gloria).
- **Scraping**: Create a web scraping system fetching daily mass readings (Salmos, Lecturas) from trusted sites to auto-populate the day's mass.
- **UI**: Make the Mass Guide a standalone button and remove its current section.

### R9. Misas de Precepto (Calendar)
Research all "Misas de Precepto" (Holy Days of Obligation, including uncommon ones) and integrate them into the annual Jesus calendar. Create an event modal for these days featuring a button to add the event to the user's personal calendar (compatible with all accounts and the main public calendar).

### R10. Autonomous Execution & Version Control (USER OVERRIDE)
Work entirely autonomously without asking for permission. Develop all features and make granular git commits as you progress. Create semantic version tags for each commit. When all work is finished, push all the commits and version tags to the remote repository so it deploys to production for the user to check in the morning.

## Verification Resources
- The 18 source images for the food prayers are provided in the artifact directory (/Users/riosisraelg/.gemini/antigravity-cli/brain/d4899b3d-c841-45a4-aff4-f09be1bad826).

## Acceptance Criteria

### Deck & Content Updates
- [ ] Programmatic: Food prayers successfully replaced and auto-select current day.
- [ ] Manual: Swipe animations infinite-loop cleanly; colors generate dynamically.

### Events & Calendar
- [ ] Programmatic: Shared event links render custom preview images.
- [ ] Manual: Misas de Precepto appear on the calendar, open a layered modal, and successfully add to the user's native calendar.

### Rosary UI
- [ ] Manual: Rosary UI features top-level vibrating counter, full untruncated text, and collapsible nested repeats.
- [ ] Manual: Mysteries display all 5 required elements (image, citation, text, meditation, question).

### Mass Guide
- [ ] Programmatic: Scraper successfully fetches and displays the current day's Salmos and Lecturas.
- [ ] Manual: Mass guide is accessible via a new standalone button and includes updated Mexican sung lyrics.

### Workflow
- [ ] Programmatic: Work is completed autonomously, with granular git commits, version tags, and a final push to the remote repository.
