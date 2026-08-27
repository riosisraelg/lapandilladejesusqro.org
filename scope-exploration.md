# Scope Exploration - lapandilladejesusqro.org

## Feature: Prayers for Food (Bendición de los alimentos) & Deck System Enhancements
*(See previous sections for Big Picture, Stakeholders, and Edge Cases regarding Decks and Food Prayers)*

---

## 4. Features & Functionality (Full Scope Additions)

### Feature 2: Event Image Previews & URLs [SRS 9.1.3]
- **Dynamic OG Images**: Events need a system to generate custom image previews for rich social sharing (Open Graph).
- **Unique URLs & Modals**: Each event must have a unique, shareable URL. Visiting this URL should trigger the existing modal system to display the event's detailed information.

### Feature 3: Rosary UI Overhaul [SRS 9.1.4]
- **Minimalist Structure**: Redesign the Rosary UI to match the website's minimalist style while keeping current functionality.
- **Mystery Components**: Each mystery must sequentially display: an image, citation reference, direct text, meditation, and a reflection question.
- **Prayer Listing & Controls**: Prayers must be listed completely (no cut-offs). Repeated prayers must be nested with a control to open and read the full text.
- **Counter Relocation**: Move the prayer counter to a single button at the top (next to the 'X' close button). Tapping it increments the count and triggers a device vibration.
- **Deck Segregation**: Main and self-prayers must be segregated into their own dedicated decks. Apply this universally to all Rosaries.

### Feature 4: Mass Guide Enhancements & Daily Scraping [SRS 9.1.5]
- **Content Completion**: Research and add missing priest dialogues (especially during Communion) and traditional Mexican sung versions of prayers (e.g., Gloria).
- **Daily Scraping System**: Implement a web scraper to fetch the daily mass readings (Lecturas, Salmos) from trusted sources to auto-populate the day's mass.
- **UI Relocation**: Remove the Mass Guide from its current section and turn it into a prominent, standalone button.

### Feature 5: Misas de Precepto (Holy Days of Obligation) [SRS 9.1.6]
- **Calendar Integration**: Research and inject all Misas de Precepto (both common and uncommon) into the annual "Jesus calendar".
- **Event Modal & Add-to-Calendar**: Clicking these days must open a new event modal (layered over the existing calendar modal) displaying info, with a button to add the event to the user's personal calendar (synced with the main public calendar).
