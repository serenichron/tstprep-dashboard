# TST Prep Dashboard

A headless SvelteKit frontend for the [TST Prep](https://tstprep.com) student dashboard — a test preparation platform helping students succeed on the TOEFL and Duolingo English Test (DET).

## Project Overview

This project replaces a fragmented, Elementor-built multi-page dashboard with a unified, modern student experience. It communicates with an existing WordPress + LearnDash backend via REST APIs.

**Core sections:**
- **Home Dashboard** — score forecast, weekly progress, streaks, next recommended action
- **Content Library** — all courses, tests, and resources (free + locked), with upsell CTAs
- **Skill Courses** — paid, skill-focused quiz-based courses (Reading, Listening, Speaking, Writing)
- **Practice Questions** — free and paid sets of targeted drills by section
- **Full Practice Tests** — timed, simulated TOEFL/DET exams (4-section, scored 1–6)
- **Resource Library** — free PDF reference materials, searchable
- **Submission History** — quiz and test history, scores, and performance analytics
- Additional sections to be defined

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | [SvelteKit](https://kit.svelte.dev/) + TypeScript |
| Styling | TBD (Tailwind CSS likely) |
| Backend CMS | WordPress + LearnDash + Uncanny Owl |
| Data API | WordPress REST API + LearnDash REST API |
| Auth | WordPress cookie auth / JWT (TBD) |
| Hosting | TBD |

## Backend APIs

- WordPress REST: `https://[site]/wp-json/wp/v2/`
- LearnDash REST: `https://[site]/wp-json/ldlms/v2/`
- Custom endpoints: to be added for features not natively supported

## Project Documentation

| Doc | Description |
|---|---|
| [Content Structure](docs/CONTENT-STRUCTURE.md) | Content taxonomy, types, and data model |
| [UX Vision](docs/UX-VISION.md) | Dashboard UX vision, user flows, and brainstorm |

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  lib/
    api/         # WordPress & LearnDash API clients
    components/  # Shared UI components
    stores/      # Svelte stores (user, progress, etc.)
    types/       # TypeScript types
  routes/
    (dashboard)/ # Protected dashboard routes
    (auth)/      # Login / register
  app.html       # Root HTML template
docs/            # Project documentation
```

## Notes for Developers Coming from React

- Svelte components are `.svelte` files — one file holds `<script>`, `<style>`, and markup
- No virtual DOM, no `useState` — declare `let count = 0` and Svelte tracks it reactively
- Routing is file-based in `src/routes/`, similar to Next.js App Router
- `$lib` is an alias for `src/lib/` — use it for imports
- SvelteKit handles SSR, routing, and data loading via `+page.ts` / `+page.server.ts` files

## Status

> Early development — architecture and design decisions are being finalized.
