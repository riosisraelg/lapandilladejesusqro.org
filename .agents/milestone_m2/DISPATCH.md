## 2026-08-27T06:49:46Z
Implement Requirements R3 and R4:
1. **Infinite Swipe Animations (R3)**:
   - In `src/app/LandingClient.tsx` and `src/app/global.css`, remove complex legacy deck animations.
   - Implement a minimal swipe-left / swipe-right gesture to navigate between decks, acting as a clean infinite loop (swiping past the last deck loops smoothly to the first, e.g. using circular modulo indexing across `DECKS_ORDER`).
2. **Dynamic Brand Color Tones (R4)**:
   - Visually distinguish different decks by dynamically calculating different tones or gradients of the main brand color in code (e.g. varying HSL lightness/saturation by deck index based on `--coffee: #5C3D2E`, HSL(20, 33%, 27%)).
   - Apply dynamic CSS variables or styles to deck cards, headers, and navigation indicators.
3. **Build & Test**:
   - Run `npm run build` and `npm test` to ensure zero compilation errors and 100% passing test suites.
