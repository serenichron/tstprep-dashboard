# TST Prep Dashboard

A SvelteKit dashboard prototype for the TST Prep TOEFL 2026 preparation platform.

## Tech Stack

- **SvelteKit** — file-based routing, `adapter-static` for GitHub Pages deployment
- **Svelte 5** — runes mode (`$state`, `$derived`, `$props`) throughout
- **Tailwind CSS** v4 — utility-first styling, mobile-first breakpoints
- **TypeScript** — strict types across all components and data

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ScoreGauge.svelte     # SVG arc gauge for current/target score
│   │   ├── ProgressBar.svelte    # Reusable horizontal progress bar
│   │   ├── SectionBadge.svelte   # R/L/S/W colored section indicator
│   │   ├── StarRating.svelte     # Star rating display component
│   │   └── Sidebar.svelte        # Navigation sidebar (drawer on mobile)
│   ├── data/
│   │   └── content.ts            # All mock data (user, tests, sets, courses)
│   └── types.ts                  # Shared TypeScript types
├── routes/
│   ├── +layout.svelte            # Root layout: mobile header + sidebar
│   ├── +page.svelte              # Dashboard home
│   ├── library/+page.svelte      # Content library (tests, sets, courses)
│   ├── history/+page.svelte      # Submission history with analytics
│   └── progress/+page.svelte     # Progress & achievements
docs/
├── CONTENT-STRUCTURE.md          # Content taxonomy, TOEFL 2026 question types, API
└── UX-VISION.md                  # Design philosophy, user flows, gamification
```

## Svelte 5 Runes

This project uses Svelte 5 runes exclusively. No legacy `export let`, `$:`, or `on:` syntax.

```svelte
<!-- Props -->
let { user, onClose }: { user: User; onClose?: () => void } = $props();

<!-- State -->
let activeTab = $state<'tests' | 'sets'>('tests');

<!-- Derived -->
const filtered = $derived(items.filter(i => i.section === activeTab));

<!-- Complex derived -->
const stats = $derived.by(() => {
  const total = items.reduce((sum, i) => sum + i.score, 0);
  return { total, avg: total / items.length };
});

<!-- Events -->
<button onclick={() => activeTab = 'sets'}>Sets</button>

<!-- Children -->
let { children }: { children: Snippet } = $props();
{@render children()}
```

Page navigation reactivity uses `$app/state` (runes-native):

```svelte
import { page } from '$app/state';
const activeHref = $derived.by(() => {
  const current = page.url.pathname;
  // ...
});
```

## Responsive Design

Mobile-first layout:

- **Mobile** (< 1024px): hamburger header, sidebar as slide-in drawer
- **Desktop** (≥ 1024px): permanent sidebar, `lg:ml-60` content offset

Key layout classes in `+layout.svelte`:
```html
<main class="flex-1 lg:ml-60 min-h-screen pt-14 lg:pt-0">
```

## Getting Started

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build     # outputs to build/
```

Deployed to GitHub Pages via GitHub Actions on push to `main`. Static assets are served from the repo's Pages URL.

Development branch: `claude/setup-svelte-tst-prep-8P48o`

## TOEFL 2026 Question Types

See `docs/CONTENT-STRUCTURE.md` for the full list of question type IDs and labels used throughout the dashboard (progress tracking, submission history analytics).

Quick reference:

| Section | Question Types |
|---|---|
| Reading | `reading_academic_passage`, `reading_complete_the_words`, `reading_daily_life` |
| Listening | `listening_listen_and_choose`, `listening_conversation`, `listening_academic_talk` |
| Speaking | `speaking_listen_and_repeat`, `speaking_take_an_interview` |
| Writing | `writing_build_a_sentence`, `writing_write_an_email`, `writing_academic_discussion` |
