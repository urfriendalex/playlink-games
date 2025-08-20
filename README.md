# Playlink Game Library (POC)

## Run

```bash
npm install
npm run dev
```
Open http://localhost:5173

## Implemented (Phase 1–2)
- Styles foundation: SCSS + CSS variables (prefixed `--pl-`) + Tailwind utilities.
- Router v7: `RootLayout` with header, `GamesPage` at `/` and `/games`.
- Context API: filters (search/providers/types/favoritesOnly) and favorites map.
- Theme switch: toggles `.theme-dark`, respects system, persists to localStorage.
- Mock API + hook: `/api/mockGames.json` with client filtering and delay.
- Core components: `GameCard`, `CardSkeleton`, `SearchBar`.

## Notes
- No inline styles; SCSS modules + global classes + Tailwind utilities only.
- Accessibility: focus-visible rings, aria-pressed, role="switch", aria-live.

## Screenshots
- [placeholder] Light mode
- [placeholder] Dark mode
- [placeholder] Loading skeletons
