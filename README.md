## Playlink Game Library (POC)

## How to run

- npm install
- npm run dev
- Open http://localhost:5173

## Implemented vs. What’s next

- Implemented
  - React 19 + Vite 6 + TypeScript 5 + React Router v7
  - Tailwind v4 (Vite plugin) + SCSS Modules + CSS Variables (`--pl-*`)
  - Routes: `RootLayout` (SearchBar, ThemeSwitch, mobile Filters, logo) → `GamesPage` at `/` and `/games`
  - Context API: filters (search/providers/types/favoritesOnly) and favorites map
  - Dark mode: toggles `.theme-dark`, respects system, persisted to localStorage
  - Mock API: `/public/api/mockGames.json`; `useGames()` adds delay, filtering, meta; filter/url sync
  - Components: `GameCard`, `CardSkeleton`, `SearchBar`, `FilterChips`, `MobileFilterDrawer`, `GridSizeSwitch`, `Logo`
  - A11y: focus-visible, role="switch", `aria-pressed`, `aria-live`, ESC, focus trap/restore, 44px targets
  - Micro-interactions: card hover lift, favorite pop (reduced motion fallback), theme transition (reduced motion off)
  - Persistence: favorites (`pl-favorites`), grid columns (`pl-grid-cols`)
- What’s next
  - Provider logos refinement per brand, richer empty/error states, Storybook, PWA basics

## Design Tokens

### Surfaces

| Token                  | Value                                           |
| ---------------------- | ----------------------------------------------- |
| `--pl-color-bg`        | light: `var(--pl-white)`; dark: `#0e0e0e`       |
| `--pl-color-surface`   | light: `#f7f7f7`; dark: `var(--pl-card-grey)`   |
| `--pl-color-surface-2` | light: `#ededed`; dark: `var(--pl-second-grey)` |
| `--pl-color-border`    | light: `#d1d1d1`; dark: `#2a2a2a`               |

### Text

| Token                   | Value                                     |
| ----------------------- | ----------------------------------------- |
| `--pl-color-text`       | light: `#1a1a1a`; dark: `var(--pl-white)` |
| `--pl-color-text-muted` | light: `#666`; dark: `#aaa`               |

### Accent

| Token                         | Value                          |
| ----------------------------- | ------------------------------ |
| `--pl-color-primary`          | light: `#4a4a4a`; dark: `#999` |
| `--pl-color-primary-contrast` | `var(--pl-white)`              |

### Radii & Shadow

| Token            | Value                        |
| ---------------- | ---------------------------- |
| `--pl-radius-sm` | `6px`                        |
| `--pl-radius-md` | `12px`                       |
| `--pl-radius-lg` | `20px`                       |
| `--pl-shadow-1`  | `0 2px 8px rgba(0,0,0,.08)`  |
| `--pl-shadow-2`  | `0 6px 18px rgba(0,0,0,.16)` |

### Spacing

| Token          | Value  |
| -------------- | ------ |
| `--pl-space-1` | `4px`  |
| `--pl-space-2` | `8px`  |
| `--pl-space-3` | `12px` |
| `--pl-space-4` | `16px` |
| `--pl-space-6` | `24px` |
| `--pl-space-8` | `32px` |

### Typography & Motion

| Token                        | Value                                                   |
| ---------------------------- | ------------------------------------------------------- |
| `--pl-font-sans`             | `Fkdisplay, Arial, sans-serif`                          |
| `--pl-fs-sm`                 | `14px`                                                  |
| `--pl-fs-md`                 | `16px`                                                  |
| `--pl-fs-lg`                 | `18px`                                                  |
| `--pl-fs-xl`                 | `22px`                                                  |
| `--pl-lh-normal`             | `1.4`                                                   |
| `--pl-ease`                  | `cubic-bezier(.2,.8,.2,1)`                              |
| `--pl-dur-fast`              | `120ms`                                                 |
| `--pl-dur-med`               | `200ms`                                                 |
| `--pl-provider-logo-filter`  | light: `contrast(1) brightness(0.9)`; dark: `invert(1)` |
| `--pl-provider-logo-opacity` | `0.6`                                                   |
| `--pl-elastic-ease-out`      | custom elastic easing for color reveal                  |

## UI States (screenshots)

- Light
- Dark
- Loading (skeletons with stagger)
- Mobile Filters Drawer

Capture tips

- Use browser DevTools → Toggle device toolbar for mobile sizes
- macOS: Shift+Cmd+4 (area capture). Windows: Win+Shift+S
- Place screenshots in the repo or paste into the PR description

## Accessibility

- Roles & ARIA
  - Theme: `role="switch"` + `aria-checked`
  - Favorite + filter chips: `aria-pressed`
  - Drawer: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
  - Results: `aria-live="polite"`
- Focus
  - `.focus-ring` outlines on all interactive elements
  - Space/Enter toggles chips; ESC closes drawer; focus returns to trigger
- Motion
  - `prefers-reduced-motion`: hover lift becomes shadow-only; favorite pop → opacity tick; theme transition disabled; skeletons lose stagger
- Touch targets
  - All chips/buttons ≥ 44px
- Contrast
  - Token-driven surfaces/text meet AA in light/dark

## Filters & URL Sync

- Desktop: `FilterChips` above grid; Favorites-only chip included; **FilterChipsSkeleton** shows during loading
- Mobile: “Filters” button opens bottom drawer; focus trap, ESC to close, Apply to confirm; disabled while loading
- URL sync: `search`, `providers`, `types`, `favorites` → URL query; hydration on initial load; back/forward supported

## Thumbnails & Placeholders

- Thumbnails: lazy, async decode, responsive sizes
- Default: grayscale(100%) contrast(1.05); color reveals on card hover/focus
- Transition easing: `var(--pl-elastic-ease-out)`
- Placeholder: `/public/placeholders/game-thumb.svg` (subtle pink tint), squared edges; automatically used on load error

## Grid Controls

- `GridSizeSwitch`:
  - Desktop (md+): 2/3/4 columns; Mobile: 1/2 columns
  - Selection persists as `pl-grid-cols`; disabled during loading
  - Auto-adjusts on breakpoint changes:
    - If Mobile and 3/4 selected → switches to 2
    - If Desktop and 1 selected → switches to 3
- Skeleton grid respects selected column count

## Provider Logos

- Monochrome-safe inline logos sized to 16px; appearance uses tokens:
  - `--pl-provider-logo-filter`, `--pl-provider-logo-opacity`
- Rendered as decorative next to provider name (empty alt, `aria-hidden="true"`)

## Data sets

- Base: `/api/mockGames.json`
- Extended: `/api/mockGamesExt.json` (30 items) — switch the fetch URL in `src/hooks/useGames.ts` to demo large grids
- Both include a mix of working and missing thumbnails to demonstrate fallback handling

## Performance & Loading

- Skeleton cards with staggered (negative-delay) pulse; reduced-motion disables stagger
- Filters skeleton bar during loading
- Debounced URL updates (≈250ms) and Search debounce (250ms)

## Styling & Architecture

- Tailwind v4 via Vite plugin: imported in `src/styles/tailwind.css`
- SCSS entry `src/styles/index.scss` uses `@use` to load tokens/base
- Global classes: `.card`, `.card--hoverlift`, `.btn`, `.focus-ring`, `.visually-hidden`
- Alias `@` → `src` in Vite + TSConfig

## Tooling

- Prettier configured
  - Format: `npm run format`
  - Check: `npm run format:check`

## Notes

- Mock thumbnails are placeholders; add images under `public/game-banners/` to expand coverage
- Favorites persist via `localStorage` key `pl-favorites`
