# Content Structure

This document defines the content taxonomy for the TST Prep dashboard — what exists today, how it maps to the WordPress/LearnDash backend, and how it should be restructured in the new dashboard.

---

## Current State (as seen in production)

The current dashboard is split across multiple separate pages, accessible via the main nav and a navigation-only dashboard landing page.

### Page: Dashboard Home (navigation only)
> URL: My Dashboard

A near-empty page with three large navigation cards:
- **Free Practice**
- **Courses**
- **Practice Tests**

PDF resources are not in the dashboard at all — they live under the main nav "Free Resources" dropdown. This split means a logged-in student has to leave the dashboard context to access PDF materials.

---

### Page: Free PDF Resources
> Currently under "Free Resources" in the main navigation — not part of the dashboard

Two groups of downloadable content:

**Free TOEFL Practice Test – PDF Format**
- Complete Practice Test #1 for the 2026 TOEFL
- Complete Practice Test #2 for the 2026 TOEFL

**TOEFL Free PDF Resources**
- 100 Practice Questions for the TOEFL Reading Section
- 100 Practice Questions for the TOEFL Listening Section
- Speaking and Writing Self-Grading Rubrics for Students
- Free Practice Questions for the TOEFL Speaking Section
- Free Practice Questions for the TOEFL Writing Section

All items are download cards with no filtering, no search, no preview. Available to all users.

---

### Page: Free Practices
> Split layout — two mismatched UI patterns on the same page

**Left column: TOEFL Test Samples**
Plain text links (no images, no progress):
- Listening Practice Test #1
- Reading Practice Test #1
- Speaking Practice Test #1
- Writing Practice Test #1

These are links to 4 individual LearnDash quiz-courses. Together they form one complete practice test, but there is no visual grouping or combined score.

**Right column: TOEFL Practice Samples**
Proper LearnDash course cards (thumbnail, progress bar, START COURSE button):
- Free Interactive Listening Practice Questions for the TOEFL Test
- Free Interactive Reading Practice Questions for the TOEFL Test
- Free Interactive Speaking Practice Questions for the TOEFL Test
- Free Interactive Writing Practice Questions for the TOEFL Test

The inconsistency between the two columns (text links vs. course cards) is a visual artifact of how they were built — not an intentional design choice.

---

### Page: Courses
> 6 LearnDash course cards in a 3-column grid

All show 0% progress with a "START COURSE" button. No distinction between course types.

Current courses:
1. Emergency Course for the TOEFL® – 2026
2. Introduction to the Score Builder for the TOEFL Test
3. The TOEFL Listening Score Builder Course – 2026
4. The TOEFL Reading Score Builder Course – 2026
5. The TOEFL Speaking Score Builder Course – 2026
6. The TOEFL Writing Score Builder Course – 2026

Paid access only. Free users see nothing (blank page or redirect, not a locked preview).

---

### Page: Practice Tests
> 60 individual LearnDash quiz-courses displayed in a 4-quadrant grid

Sortable by "Test Section" or "Test Number". Each quadrant shows 15 tests:

| Section | Tests |
|---|---|
| Reading | Test #1 – #15 |
| Listening | Test #1 – #15 |
| Speaking | Test #1 – #15 |
| Writing | Test #1 – #15 |

**Key problem:** A "full practice test" (e.g., TOEFL Practice Test #3) is actually 4 separate LearnDash courses (Reading #3, Listening #3, Speaking #3, Writing #3). There is no test-level grouping, no combined score, and no way to track a full test result. Students must navigate to each section quiz independently.

Paid access: 15 tests. Free access: 2 tests (tests #1 and #2 are free).

---

## Brand Identity

- **Primary color:** Teal/green (~#009B77)
- **Logo:** TST Prep with shield/badge icon
- **Typography:** Bold black headings, teal accent on key words (e.g., "TOEFL **Free Practices**")
- **Style:** Clean, professional, stock photography for course thumbnails

---

## Proposed Content Taxonomy (New Dashboard)

The new dashboard collapses all pages into one unified experience with clear content type distinctions.

### Content Type 1: Full Practice Tests

**What it is:** A complete, timed, scored TOEFL or DET simulation. 4 sections taken as a unit, producing a single composite score (1.0–6.0).

**Current backend:** 4 LearnDash courses per test (one per section), linked by test number. No native "test" post type yet — this is in progress on the WP side.

**UX in new dashboard:**
- Each test shown as a single card with section breakdown
- Shows best score, last attempt date, number of attempts
- Timed, distraction-free test-taking mode
- Post-test analytics: section scores, time per question, question-type breakdown
- Score saved to Submission History

**Access:**
- Free: Tests #1 and #2
- Paid: Tests #1–#15

---

### Content Type 2: Practice Questions

**What it is:** Non-timed, interactive question sets for a specific section. Immediate feedback after each question.

**Current backend:** LearnDash courses categorized as practice samples (the right column on the Free Practices page).

**UX in new dashboard:**
- Cards organized by section (R / L / S / W)
- Shows completion % and question count
- Filter by section and question type
- Instant feedback with explanation after each question

**Access:**
- Free: 1 set per section (4 total — current free interactive courses)
- Paid: Full library (to be expanded)

---

### Content Type 3: Skill Courses

**What it is:** Structured learning paths with instructional content, tips, and exercises. The only content with real teaching (not just quizzes).

**Current backend:** The 6 LearnDash courses on the Courses page.

**Current courses:**
- Emergency Course (general)
- Introduction to Score Builder (general)
- Reading, Listening, Speaking, Writing Score Builder (one per section)

**UX in new dashboard:**
- Clearly labeled as "Courses" or "Study Guides"
- Section tagging (R / L / S / W / General)
- Linear progression with lesson/unit count
- Progress bar
- Ratings

**Access:**
- Paid only (locked + upsell CTA for free users)

---

### Content Type 4: Resource Library

**What it is:** Downloadable PDF reference materials. Currently separate from the dashboard entirely.

**Current items:**
- 2 PDF practice tests (full tests in PDF format)
- 100 Reading practice questions (PDF)
- 100 Listening practice questions (PDF)
- Speaking & Writing self-grading rubrics
- Free Speaking practice questions (PDF)
- Free Writing practice questions (PDF)

**UX in new dashboard:**
- Brought into the dashboard as a dedicated section
- Card grid with section tag, description, download button
- Searchable
- Free access for all users

---

## Content Access Matrix

| Content Type | Free User | Paid User |
|---|---|---|
| Resource Library (PDFs) | ✅ All | ✅ All |
| Practice Questions | ✅ 1 set per section | ✅ Full library |
| Full Practice Tests | ✅ Tests #1–#2 | ✅ Tests #1–#15 |
| Skill Courses | 🔒 Visible, locked | ✅ All enrolled |

**Visibility rule:** All content is always visible. Locked items show a card with a lock icon and upsell CTA. Nothing is hidden.

---

## Scoring Model

- **Scale:** 1.0 – 6.0 in 0.5 increments (TOEFL/DET style)
- **Composite score:** Average of 4 section scores
- **Displayed as:** `4.5 / 6` in the dashboard header and submission history
- **Section scores:** Stored individually, combined for display

---

## LearnDash REST API — Key Endpoints

```
GET /wp-json/ldlms/v2/courses                  List all courses
GET /wp-json/ldlms/v2/courses/{id}             Single course detail
GET /wp-json/ldlms/v2/courses/{id}/steps       Lessons and quizzes in a course
GET /wp-json/ldlms/v2/users/{id}/courses       Courses the user is enrolled in
GET /wp-json/ldlms/v2/users/{id}/quizzes       User's quiz attempt history
GET /wp-json/ldlms/v2/quizzes/{id}             Quiz detail
```

**Custom endpoints needed (not native to LearnDash):**
- Group 4 section courses into a single "test" object
- Calculate composite score (1–6) from 4 section scores
- Store and retrieve star ratings per course/test
- Gamification data: streaks, XP, badges, league rank
- Submission history with filters and pagination
