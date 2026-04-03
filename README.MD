# TST Prep Dashboard

A user-facing dashboard for [TST Prep](https://tstprep.com) — a test preparation platform helping students succeed on the TOEFL and Duolingo English Test.

## Project Overview

This project is a SvelteKit web application providing students with a personalized learning experience, including:

- **User Dashboard** — personalized home with progress overview and recommendations
- **Quiz History** — review past quiz attempts, scores, and performance trends
- **Quiz Funnel** — guided quiz experience that walks students through exam content
- Additional functionality to be defined

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) — full-stack Svelte framework
- TypeScript
- TBD: styling, state management, backend/API integration

## Status

> Early development. Project structure and design decisions are being finalized.

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  lib/         # Shared components, utilities, stores
  routes/      # SvelteKit file-based routing
  app.html     # Root HTML template
```

## Notes for Developers

- Coming from React? Svelte is component-based like React but with no virtual DOM. Components are `.svelte` files with `<script>`, `<style>`, and markup in a single file.
- State is reactive by default — no `useState`, just declare a variable with `let` and Svelte tracks it.
- Routing is file-based via `src/routes/`, similar to Next.js App Router.
