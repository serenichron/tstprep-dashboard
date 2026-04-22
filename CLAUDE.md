# CLAUDE.md

Project-specific instructions for Claude Code working in this repo.

## Stack

- **SvelteKit 5** with **Svelte 5 runes mode** (not legacy Svelte 3/4)
- **Tailwind CSS v4** with custom brand tokens (see `tailwind.config.js`)
- **TypeScript** throughout
- **adapter-static** — builds to plain HTML/CSS/JS, deployed to GitHub Pages

## Conventions

### Always use modern Svelte 5 runes — never legacy syntax

| Use                                   | Not                           |
| ------------------------------------- | ----------------------------- |
| `let { foo } = $props()`              | `export let foo`              |
| `let x = $state(0)`                   | plain reactive `let x = 0`    |
| `const y = $derived(x * 2)`           | `$: y = x * 2`                |
| `$effect(() => { ... })`              | `$: { ... }` block            |
| `onclick={fn}`                        | `on:click={fn}`               |
| `{@render children()}` + `$props()`   | `<slot />`                    |
| Callback props (`onChange: () => …`)  | `createEventDispatcher`       |

The entire `src/` is already runes — keep it that way.

### Styling

- Use Tailwind utilities first. Brand colors: `brand-green`, `brand-green-light`, `brand-green-dark`, `brand-pink` (defined in `tailwind.config.js`).
- Shared component classes live in `src/app.css` under `@layer components` (`.card`, `.btn-primary`, `.nav-link`, etc.) — reuse them.
- Icons are inline SVGs. Reuse existing paths where possible (e.g. the section icons in `src/routes/history/+page.svelte` — `iconPaths` object — are the canonical Reading/Listening/Speaking/Writing set).

### Design approach

- Mobile-first. Break to tablet/desktop with `sm:` and `lg:` prefixes.
- Sidebar collapses on desktop (`lg:w-14`) and slides in as drawer on mobile.
- Don't add emojis to UI unless explicitly requested.

## Project structure

- `src/routes/` — SvelteKit pages (home, library, history, progress, quiz)
- `src/lib/components/` — shared UI components (Sidebar, ScoreGauge, etc.)
- `src/lib/data/content.ts` — mock content data (tests, courses, user)
- `src/lib/types/index.ts` — TypeScript types
- `src/lib/userState.svelte.ts` — reactive user state (plan, access control)
- `src/lib/quiz/` — portable quiz funnel component + cohort scenarios

## Backend

No real backend exists yet. All data is mock. When backend arrives it will be
LearnDash REST endpoints — see `CONTENT-STRUCTURE.md` for the planned API shape.

## Working style

The primary user is a product designer vibe-coding. Explain things
non-technically when asked, default to short responses, and favor
editing existing files over creating new ones.
