# UX Vision & Brainstorm

This document defines the intended user experience for the new TST Prep dashboard — the design philosophy, key features, user flows, and ideas sourced from competitive research and brainstorming.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **SvelteKit** (Svelte 5, runes mode) |
| Styling | **Tailwind CSS** v4 |
| Rendering | `adapter-static` — fully prerendered, deployed to GitHub Pages |
| Reactivity | **Svelte 5 Runes** — `$state`, `$derived`, `$derived.by`, `$props` |
| Routing | SvelteKit file-based routing |
| Data (mock) | `src/lib/data/content.ts` — deterministic mock data |

### Svelte 5 Runes Architecture

All components use Svelte 5 runes (no legacy mode):

- **Props**: `let { prop, prop2 = default } = $props()`
- **State**: `let value = $state(initialValue)`
- **Derived**: `const x = $derived(expression)` / `$derived.by(() => { ... })`
- **Events**: `onclick={handler}` (not `on:click`)
- **Children**: `{@render children()}` (not `<slot />`)
- **Page state**: `import { page } from '$app/state'` (not `$app/stores`)

### Responsive Design

The dashboard is mobile-first and works across all screen sizes:

- **Mobile** (< 1024px): Sidebar hidden as slide-in drawer, triggered by hamburger in top header
- **Tablet** (768px–1023px): Same as mobile, wider content area
- **Desktop** (≥ 1024px): Sidebar permanently visible at left, `lg:ml-60` content offset

Tailwind breakpoints used: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)

---

## Core UX Philosophy

**From: enrollment-gated, fragmented pages**
**To: unified, discovery-first, progress-driven dashboard**

Three principles guide every design decision:

1. **Show everything, lock gracefully.** A student should always see the full scope of what TST Prep offers. Locked content shows a preview + upsell — never a blank space. Discovery drives conversion.

2. **Progress is the product.** The score (1.0–6.0) is the single most motivating element for a TOEFL student. Every screen should reinforce movement toward a target score.

3. **Different content, different UX.** Practice questions, full tests, courses, and PDFs serve completely different purposes and need completely different interfaces. They should look and feel different, not just be categorized differently.

---

## Problems Solved by the New Dashboard

| Current Problem | New Solution |
|---|---|
| Navigation-only landing page wastes a click | Home dashboard = real content with progress, streaks, and recommendations |
| PDFs siloed outside the dashboard | Resource Library brought in as a first-class dashboard section |
| Free Practice page has two mismatched UI patterns | Unified card design, consistent layout across all content types |
| Practice Tests show 60 individual section quizzes | Tests grouped as complete units (4 sections = 1 test), with composite scoring |
| Locked content is invisible to free users | All content visible; locked items show locked state + upsell CTA |
| No score or progress tracking visible | Score forecast, section breakdown, and weekly progress on home screen |
| No gamification or engagement hooks | Streak counter, XP, badges, league system |

---

## Dashboard Sections

### 1. Home (Dashboard Landing)

The first screen a logged-in student sees. Replaces the current navigation-only page.

**Left/main area:**
- **Score widget** — Current estimated score `X.0 / 6`, with a target score input and a trend line showing progress over last 4–6 weeks. Visual: SVG arc gauge.
- **Next recommended action** — Cards with clear CTAs: "You haven't tried Speaking yet → Start Speaking Practice"
- **Weekly activity summary** — Questions answered, tests taken, time studied this week

**Right sidebar / secondary area:**
- **Streak counter** — Days studied in a row (flame icon)
- **Score badge** — Current overall score displayed prominently
- **Continue Studying** — In-progress practice sets with completion %

**What NOT to show on home:**
- Full course grids (that's the Library section)
- Detailed analytics (that's the Progress section)
- Everything at once — home is a launchpad, not a catalog

---

### 2. Content Library

The main content discovery page. Replaces Courses, Free Practice, and Practice Tests pages.

**Tabs:**
- Full Practice Tests
- Practice Questions
- Skill Courses

**Each content type has its own card design:**

| Content Type | Card Shows |
|---|---|
| Full Practice Test | Test #, section icons (R/L/S/W), best score, last attempt, lock status |
| Practice Question Set | Section tag, question count, completion %, difficulty |
| Skill Course | Thumbnail, title, section tag, lesson count, progress bar, star rating |

**Filtering:**
- By section: All / Reading / Listening / Speaking / Writing
- By access: All / Free / Locked

---

### 3. Full Practice Test — Taking Mode

Completely separate UX from the library. Distraction-free.

- No sidebar, no navigation
- Timer visible at top
- Section-by-section flow (Reading → Listening → Speaking → Writing)
- No feedback during the test
- "Submit Test" at end → post-test results screen

**Post-test results screen:**
- Overall composite score (`X.0 / 6`)
- Section breakdown (4 scores)
- Question-type accuracy (keyed by IDs in CONTENT-STRUCTURE.md)
- "Add to Submission History" (automatic)
- CTA: "Review answers" / "Retake" / "Work on weak areas"

---

### 4. Submission History

Accessible from the sidebar.

**Summary row at top:**
- Best composite score, tests taken, questions answered, streak

**Table / card list:**
- Date, content type, title, score, time spent, section breakdown
- Filterable by content type, section, date range
- Click to expand → question-level breakdown

**Score trajectory chart:**
- Line chart showing composite score over time
- Toggle by section

---

### 5. Progress & Analytics

Detailed analytics for students who want to go deep.

- **Question-type heatmap:** Performance per question type using IDs from CONTENT-STRUCTURE.md
- **Section breakdown:** Score per section with trend
- **XP & Level:** Progress bar toward next level
- **Badges:** Achievement milestones

---

## Upsell Strategy

Based on research: conversions happen after users experience real value, not before.

**Do not gate the landing/home screen.** Free users get a real dashboard with real data from their 2 free tests and 4 practice sets.

**Upsell trigger moments:**

1. **After completing first free test** → "You scored 3.5. Students who take 5+ tests improve by an average of 1.0 point. Unlock 13 more tests → [Upgrade]"
2. **On a locked course/test card** → Lock icon, greyed-out card, small "Unlock with Premium" badge — not hidden, just locked
3. **After a score plateau** → "Your score hasn't changed in 2 weeks. Try a Score Builder Course to break through → [Unlock Courses]"
4. **From peer comparison** → "Students in the top 25% take an average of 8 full tests. [Get full access]"
5. **Time-based** → "Your exam is in 3 weeks. Make every session count → [Upgrade now]"

**Upsell placement rules:**
- Never interrupt mid-test
- Always show after a natural stopping point
- Locked cards in the library are passive upsells — always visible, never intrusive
- One active upsell CTA per screen maximum

---

## Gamification Layer

Gamification should be **secondary to real progress**. Serious test-takers are motivated by scores, not badges.

### Streak System
- Count of consecutive days with any study activity
- Visible on home screen (flame icon + count)
- Streak freeze: 1 per week (paid feature)

### XP & Levels
- Earn XP for: completing questions, finishing tests, logging in, improving score
- Level system: Beginner → Practitioner → Advanced → Expert → Master
- XP milestones unlock cosmetic rewards

### Badges
- First test completed
- First score improvement
- 100 questions answered
- 7-day streak
- Completed all 4 section courses
- Score of 4.0+ / 5.0+ achieved

### League System (optional, future)
- Weekly cohorts of ~20 students, ranked by XP earned that week
- Top 3 get promoted, bottom 5 get demoted

---

## Competitive Insights (Research Summary)

From research on Magoosh, BestMyTest, TestGlider, ETS TOEFL TestReady, Kaplan, and Duolingo:

### What the best platforms do
- **Score forecast:** Chart showing projected score trajectory toward goal
- **Question-type breakdown:** Which specific question types does this student fail?
- **Peer comparison:** How does this student compare to others at the same level?
- **Adaptive recommendations:** "Based on your performance, practice Speaking next"
- **Mobile-first experience:** Students study on phones during commute
- **Pause/resume on full tests:** Students have lives — allow pausing

### What doesn't work
- Gamification without real progress data feels hollow
- Over-emphasis on badges alienates serious students
- Aggressive early upsells before value is demonstrated tank conversion
- Showing only enrolled content = students don't know what they're missing

### Features specific to TOEFL 2026 prep to add later
- **AI scoring for Speaking responses** (record audio → instant score + feedback)
- **AI scoring for Writing responses** (submit text → score + suggestions)
- **Exam date countdown** ("47 days until your exam")
- **Study plan generator** (input exam date + current score + target score → weekly schedule)
- **Vocabulary builder** (spaced repetition for academic vocabulary)
- **Speaking sample library** (rated sample answers)

---

## User Flows

### First-time free user
1. Registers → lands on Home dashboard
2. Home shows: 2 free tests available, 4 practice sets, resources
3. Recommended first action: "Take Free Practice Test #1 to get your baseline score"
4. Takes test → sees score → score appears in History and on Home
5. Sees locked content on Library page → upsell CTA triggered naturally

### Returning paid user
1. Logs in → Home shows: streak count, last score, recommended next action
2. Clicks "Continue where you left off" or picks from Library
3. Finishes test → score updates on Home chart
4. Checks Progress page to see trend over time

### Free user converting to paid
1. After free test #2 completes → post-test results screen shows upsell
2. Or: visits Library → sees locked tests with lock badges → clicks "Unlock"
3. Or: receives "plateau" notification after 2 weeks at same score

---

## Open Questions

- [ ] Will the new dashboard be embedded in WordPress (iframe) or a fully separate domain/subdomain?
- [ ] Authentication: WordPress session cookie, JWT, or OAuth?
- [ ] Will Speaking/Writing scoring be human, AI, or self-grading (rubrics) initially?
- [ ] Is there a LearnDash "group" or custom taxonomy to link 4 section courses into one test?
- [ ] What's the exam date source — does the user input it, or is it inferred?
- [ ] Will DET content be in the same dashboard or a separate product?
- [ ] Does the rating system write back to WordPress, or live only in the SvelteKit DB?
- [ ] Is there a custom post type for "test" planned on the WP side, and what's the timeline?
