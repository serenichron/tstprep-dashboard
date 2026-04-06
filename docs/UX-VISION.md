# UX Vision & Brainstorm

This document defines the intended user experience for the new TST Prep dashboard — the design philosophy, key features, user flows, and ideas sourced from competitive research and brainstorming.

---

## Core UX Philosophy

**From: enrollment-gated, fragmented pages**
**To: unified, discovery-first, progress-driven dashboard**

Three principles guide every design decision:

1. **Show everything, lock gracefully.** A student should always see the full scope of what TST Prep offers. Locked content shows a preview + upsell — never a blank space. Discovery drives conversion.

2. **Progress is the product.** The score (1.0–6.0) is the single most motivating element for a TOEFL/DET student. Every screen should reinforce movement toward a target score.

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
- **Score widget** — Current estimated score `X.0 / 6`, with a target score input and a trend line showing progress over last 4 weeks. Visual: horizontal gauge or arc chart.
- **Next recommended action** — One card with a clear CTA: "You haven't tried Speaking yet → Start Speaking Practice Test #1" or "You got 62% on Reading questions → Review weak spots"
- **Weekly activity summary** — Questions answered, tests taken, time studied this week

**Right sidebar / secondary area:**
- **Streak counter** — Days studied in a row, with a small flame icon. Fear of losing the streak is a stronger motivator than earning rewards.
- **Score badge** — Current overall score displayed prominently (`4.5 / 6`)
- **Quick links** — Submission History (with last score badge), Resource Library

**What NOT to show on home:**
- Full course grids (that's the Library section)
- Detailed analytics (that's the Progress section)
- Everything at once — home is a launchpad, not a catalog

---

### 2. Content Library

The main content discovery page. Replaces the current Courses, Free Practice, and Practice Tests pages.

**Design principle:** Show everything. Use tabs or a sidebar filter to switch between content types. Locked items get a lock badge + "Unlock" CTA, not removal.

**Tabs (or left-nav sections):**
- Full Practice Tests
- Practice Questions
- Skill Courses
- Resource Library

**Each content type has its own card design:**

| Content Type | Card Shows |
|---|---|
| Full Practice Test | Test #, section icons (R/L/S/W), best score, last attempt, lock status |
| Practice Question Set | Section tag, question count, completion %, difficulty |
| Skill Course | Thumbnail, title, section tag, lesson count, progress bar, star rating |
| PDF Resource | Section tag, title, short description, download button |

**Filtering:**
- By section: All / Reading / Listening / Speaking / Writing
- By status: All / Not Started / In Progress / Completed
- By access: All / Free / Locked (upsell filter)

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
- Time per question vs. peer average
- Question-type accuracy breakdown
- "Add to Submission History" (automatic)
- CTA: "Review answers" / "Retake" / "Work on weak areas"

---

### 4. Submission History

Accessible from the home screen (icon + badge showing last score).

**Summary row at top:**
- Best composite score: `X.0 / 6`
- Tests taken: N
- Questions answered: N
- Study streak: N days

**Table / card list:**
- Each row: Date, content type (Test / Practice / Course), title, score or % correct, time spent, section scores if applicable
- Filterable by content type, section, date range
- Click to expand → see question-level breakdown for that attempt

**Score trajectory chart:**
- Line chart showing composite score over time (last 30 days default)
- Toggle by section (overlay or separate lines)

---

### 5. Progress & Analytics

More detailed than the home widget. For students who want to go deep.

- **Section heatmap:** Which question types are strongest/weakest (e.g., "Reading: Inference → 45% correct")
- **Time management:** Average time per question by type vs. peer average
- **Completion map:** Visual grid of all 60 test sections — which are done, scores, locked
- **Peer percentile:** Where this student ranks vs. all students (opt-in)

---

## Upsell Strategy

Based on research: conversions happen after users experience real value, not before.

**Do not gate the landing/home screen.** Free users get a real dashboard with real data from their 2 free tests and 4 practice sets.

**Upsell trigger moments:**

1. **After completing first free test** → "You scored 3.5. Students who take 5+ tests improve by an average of 1.0 point. Unlock 13 more tests → [Upgrade]"
2. **On a locked course/test card** → Lock icon, greyed-out card, small "Unlock with Premium" badge — not hidden, just locked
3. **After a score plateau** → "Your score hasn't changed in 2 weeks. Try a Score Builder Course to break through → [Unlock Courses]"
4. **From peer comparison** → "Students in the top 25% take an average of 8 full tests. You've taken 2. [Get full access]"
5. **Time-based** → "Your exam is in 3 weeks. Make every session count → [Upgrade now]" (requires exam date input)

**Upsell placement rules:**
- Never interrupt mid-test
- Always show after a natural stopping point (end of test, end of practice set)
- Locked cards in the library are passive upsells — always visible, never intrusive
- One active upsell CTA per screen maximum

---

## Gamification Layer

Gamification should be **secondary to real progress**. Serious test-takers are motivated by scores, not badges. Use gamification to reinforce habits, not replace value.

### Streak System
- Count of consecutive days with any study activity
- Visible on home screen (flame icon + count)
- "You're on a 7-day streak!" notification on login
- Streak freeze: 1 per week (paid feature) — you can miss one day without losing the streak
- Losing a streak should feel like a loss → stronger motivator than earning one

### XP & Levels
- Earn XP for: completing questions, finishing tests, logging in, improving score
- Level system: Beginner → Practitioner → Advanced → Expert → Master
- XP milestones unlock cosmetic rewards (profile badge, score card themes)
- Keep levels visible but not dominant in the UI — a sidebar widget, not a hero element

### Badges
Milestone badges (earned once, displayed on profile):
- First test completed
- First score improvement
- 100 questions answered
- 7-day streak
- Completed all 4 section courses
- Score of 5.0+ achieved
- Etc.

### League System (optional, future)
- Weekly cohorts of ~20 students, ranked by XP earned that week
- Top 3 get promoted to a higher league
- Bottom 5 get demoted
- Low effort to build but strong engagement driver

### Ratings
- Star ratings (1–5) on courses, practice tests, and question sets
- Shown on content cards (average rating + count)
- Students can rate after completing content
- Ratings help surface the best content and add social proof

---

## Competitive Insights (Research Summary)

From research on Magoosh, BestMyTest, TestGlider, ETS TOEFL TestReady, Kaplan, and Duolingo:

### What the best platforms do
- **Score forecast:** Chart showing projected score trajectory toward goal. This is the #1 most motivating feature for test-takers (BestMyTest, ETS).
- **Question-type breakdown:** Not just overall % — which specific question types does this student fail? (e.g., "Reading: Inference questions → 42%")
- **Peer comparison:** How does this student compare to others at the same level?
- **Adaptive recommendations:** "Based on your performance, practice Speaking next" — drives session starts
- **Mobile-first video lessons:** Students watch during commute, not just desktop
- **Pause/resume on full tests:** Students have lives. Allow pausing (with time recorded)
- **AI scoring for Speaking/Writing:** This is becoming table stakes for DET platforms (DETpractice.com, DreamyDET)

### What doesn't work
- Gamification without real progress data feels hollow to motivated test-takers
- Over-emphasis on badges alienates serious students
- Aggressive early upsells before value is demonstrated tank conversion
- Showing only enrolled content = students don't know what they're missing

### Features specific to TOEFL/DET prep to add later
- **AI scoring for Speaking responses** (record audio → instant score + feedback)
- **AI scoring for Writing responses** (submit text → score + suggestions)
- **Exam date countdown** ("47 days until your exam")
- **Study plan generator** (input exam date + current score + target score → weekly schedule)
- **Vocabulary builder** (spaced repetition for academic vocabulary)
- **Speaking sample library** (rated sample answers for Speaking questions)

---

## User Flows

### First-time free user
1. Registers → lands on Home dashboard (empty state with welcome message + "Start here" CTA)
2. Home shows: 2 free tests available, 4 practice sets available, resources available
3. Recommended first action: "Take Free Practice Test #1 to get your baseline score"
4. Takes test → sees score → score appears in History and on Home
5. Sees locked content on Library page → upsell CTA triggered naturally

### Returning paid user
1. Logs in → Home shows: streak count, last score, recommended next action
2. Clicks "Continue where you left off" or picks from Library
3. Finishes test → score updates on Home chart
4. Checks Progress page to see trend over time

### Free user converting to paid
1. After free test #2 completes → post-test results screen shows upsell: "Unlock 13 more tests"
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
