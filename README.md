# Playlink Game Library (POC)

## Run

```bash
npm install
npm run dev
```
Open http://localhost:5173

## Implemented
- UI stack: React 19 + Vite 6 + TypeScript 5, Tailwind v4 (Vite plugin) + SCSS Modules + CSS Variables (`--pl-*`).
- Routing: React Router v7 with `RootLayout` (header with SearchBar, ThemeSwitch, mobile Filters) and `GamesPage` at `/` and `/games`.
- State: Context API with strict actions (search/providers/types/favoritesOnly/favorites). No Zustand.
- Theme: `.theme-dark` class on `<html>`, respects system theme, persisted to localStorage.
- Data: `/public/api/mockGames.json` (10 games). `useGames()` adds 400–600ms delay, memoized client filtering, exposes meta providers/types.
- Components: `GameCard` (+module SCSS), `CardSkeleton`, `SearchBar` (250ms debounce), `FilterChips` (desktop), `MobileFilterDrawer` (mobile).
- Persistence: Favorites stored in localStorage (`pl-favorites`), hydrated on load and written through on change.
- Accessibility: focus-visible rings, role="switch" for theme, `aria-pressed` on toggles, `aria-live="polite"` for result count, 44px targets, ESC closes drawer and restores focus.

## Filters
- Desktop: chips for Providers/Types/Favorites above the grid; Space/Enter toggles. "Clear all" appears when any filter or search is active.
- Mobile: header "Filters" opens a bottom drawer (focus trap, ESC to close, Apply to confirm, focus returns to trigger). Clear all included.

## Styling
- Tailwind v4 via `@tailwindcss/vite` plugin. `src/styles/tailwind.css` imports Tailwind; `src/styles/index.scss` uses `@use` to load tokens/base.
- Global utility classes in SCSS: `.card`, `.card--hoverlift`, `.btn`, `.focus-ring`, `.visually-hidden`.
- All colors from CSS variables with `--pl-` prefix; utilities like `bg-[color:var(--pl-color-surface)]` are used where needed.

## Dev Notes
- Alias `@` → `src` configured in `vite.config.ts` and `tsconfig.json`.
- Scripts: `npm run dev`, `npm run build`, `npm run preview`, `npm run typecheck`.
- Known: thumbnails in mock data are placeholders; add images under `public/thumbs/` if desired.

## Screenshots
- [placeholder] Light mode
- [placeholder] Dark mode
- [placeholder] Loading skeletons
