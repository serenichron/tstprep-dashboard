# History Submission View

This document describes the design, data model, state management, and component structure of the **Submission History** page — the most feature-rich view in the TST Prep dashboard.

**Route:** `/history`
**Files:**
- `src/routes/history/+page.svelte` — all UI, state, and inline mock data
- `src/routes/history/+page.ts` — sets `prerender = true`

---

## Purpose

The History page gives students a complete record of every test and practice attempt, broken down by TOEFL section. It surfaces trends, score trajectories, and per-section analytics to help students understand where they're improving and where to focus next.

---

## Layout Overview

The page has three stacked zones:

```
┌─────────────────────────────────────────┐
│  Sticky Header  (z-40, top: 56px)       │
│  • Overall score gauge                  │
│  • Five section summary cards           │
├─────────────────────────────────────────┤
│  Sticky Section Bar  (z-40)             │
│  • Tab strip: Complete / R / L / W / S  │
│  • Sparkline + test filter + mode filter│
├─────────────────────────────────────────┤
│  Detail Panel  (scrollable)             │
│  • Paginated submission rows            │
└─────────────────────────────────────────┘
```

A **Trend Modal** (z-99 backdrop) overlays the full page when the sparkline is clicked.

---

## Sticky Header

Shows the student's overall score at a glance.

**Score Gauge** — An SVG arc gauge (radius 46, center 60,54) spanning 180° × 2.36 (from `0.82π` to `2.18π`). The filled arc represents the current weighted score on the 1–6 scale. Color thresholds: ≥ 5.0 green (#00b189), ≥ 3.5 amber (#f0a030), < 3.5 red (#ff5859).

**Section Summary Cards** — One card per section tab (Complete Tests, Reading, Listening, Writing, Speaking). Each shows:
- Average score (rounded to nearest 0.5)
- Best score
- Total submission count

---

## Sticky Section Bar

A horizontal strip that sits below the header. It has three parts:

### 1. Tab Strip
Five tabs: **Complete Tests**, **Reading**, **Listening**, **Writing**, **Speaking**. Clicking a tab updates the `sec` state variable and resets pagination to page 1.

Section color coding:
| Section | Color |
|---|---|
| Reading | `#3b82f6` (blue) |
| Listening | `#8b5cf6` (purple) |
| Writing | `#ec4899` (pink) |
| Speaking | `#f97316` (orange) |
| Complete Tests | `#00b189` (green) |

### 2. Sparkline
An inline SVG trend line (180×42 px) showing the last 10 scored submissions for the active section. Clicking it opens the Trend Modal. The label below the sparkline shows the delta vs. all-time average (e.g., `+0.5` in green or `−0.5` in red).

### 3. Filters
Two custom dropdowns on the right side of the bar:

- **Test Number** — "All" or tests 1–15. Filters both the sparkline and the detail rows.
- **Mode** — "All", "Test Mode", or "Practice Mode". Filters all derived data globally.

---

## Detail Panel

The panel content switches based on the active tab.

### Section View (Reading / Listening / Writing / Speaking)

A paginated list of submissions sorted newest-first, 20 per page. Each row shows:

| Field | Notes |
|---|---|
| Test # | e.g., "Test 3" |
| Date + Time | Formatted as "Apr 14, 2026 · 9:15 AM" |
| Mode badge | "Test" (blue) or "Practice" (gray) |
| Score | Colored bar (green/amber/red) + value like "4.5/6" |
| Sub-part breakdown | Key/value pairs from `details`, e.g., `Part 1: 10/12` |
| AI-pending indicator | Shown when `scoreAvailable = false` |

Writing and Speaking entries may have `scoreAvailable: false` because those sections require human or AI grading. Rows in this state display "AI grading pending" instead of a score.

Pagination controls appear at the bottom when `totalDatePages > 1`. Changing the test filter resets `datePage` to 1.

### Complete Tests View

Shows full 4-section test attempts. Each row includes:
- Test number and date
- Duration (e.g., "1h 32m")
- Composite score (average of all four section scores, rounded to nearest 0.5), shown as "N/A" when any section score is pending
- Section score chips: `R: 4.0`, `L: 3.5`, `S: —`, `W: 3.5`

Complete tests with `mode: 'practice'` are hidden when the Mode filter is set to "Test Mode" (and vice versa). Because `COMPLETE` entries have no `mode` field, the complete-test list is hidden entirely when "Practice Mode" is selected.

---

## Trend Modal

A full-screen overlay with a large line chart of the last 10 scored submissions for the active section (filtered by the current test-number filter).

**Chart dimensions:** 400×160 px, with padding `pL=32, pR=14, pT=16, pB=32`.

**Y-axis:** Score scale 1–6, with tick labels at each integer.

**X-axis:** No tick labels; the first, middle, and last submission dates appear below the chart.

**Reference lines (dashed):**
- Gray — all-time average across all submissions in scope
- Colored (section color) — average of the last 10 points shown

**Hover tooltip:** Appears when the cursor is within ~20px of a data point. Shows the exact score and date.

**Legend:** Displays the delta between the last-10 average and the all-time average (e.g., `+0.5 vs. all-time avg`).

Close by clicking the backdrop or the × button.

---

## Data Model

### Section Submission (`MOCK` array)

```ts
{
  id:             string;          // e.g. 'r0', 'l12', 'w3', 's5'
  section:        'Reading' | 'Listening' | 'Writing' | 'Speaking';
  testNumber:     number;          // 1–15
  mode:           'test' | 'practice';
  score:          number | null;   // 1.0–6.0 in 0.5 steps, null = pending
  scoreAvailable: boolean;         // false = AI/human grading in progress
  date:           string;          // ISO 8601
  details:        Record<string, string>; // sub-part label → "X/Y" or "not graded"
}
```

Mock counts: Reading 25, Listening 22, Writing 23, Speaking 13.

### Complete Test Submission (`COMPLETE` array)

```ts
{
  id:         string;
  testNumber: number;
  date:       string;           // ISO 8601
  duration:   string;           // e.g. "1h 32m"
  scores:     Record<'Reading' | 'Listening' | 'Speaking' | 'Writing', number | null>;
  composite:  number | null;    // null when any section score is null
}
```

Mock count: 12 complete test attempts.

---

## State Variables

| Variable | Type | Purpose |
|---|---|---|
| `sec` | `string` | Active section tab |
| `mode` | `'all' \| 'test' \| 'practice'` | Global mode filter |
| `testFilter` | `number \| 'all'` | Active test-number filter |
| `datePage` | `number` | Current pagination page (1-indexed) |
| `modeOpen` | `boolean` | Mode dropdown open/closed |
| `testOpen` | `boolean` | Test number dropdown open/closed |
| `trendOpen` | `boolean` | Trend modal visible |
| `trendHovIdx` | `number \| null` | Hovered data point index in trend modal |

---

## Derived Computations

| Derived | Description |
|---|---|
| `data` | `MOCK` filtered by the global `mode` |
| `stats` | Per-section `{ avg, best, count, aiCount, trend[] }` — computed from `data` |
| `secAvg` | Mean of the four section averages (Reading, Listening, Writing, Speaking) |
| `ctAvg` | Average composite score across complete tests |
| `genScore` | Weighted overall score: mean of `secAvg` and `ctAvg`; falls back to `secAvg` alone |
| `genBest` | Mean of per-section best scores |
| `rows` | Section submissions for active `sec`, sorted by test number then date desc |
| `byDateRows` | `rows` sorted strictly by date descending |
| `filteredByDate` | `byDateRows` filtered by `testFilter` |
| `pagedDateRows` | `filteredByDate` sliced to the current `datePage` |
| `trendAllPts` | Trend points for active section, filtered by `testFilter` |
| `trendData` | Sparkline SVG data (last 10 of `trendAllPts`) |
| `trendPopupData` | Full modal chart data with coordinates, reference lines, hover positions |
| `gaugeScore` | Equals `genScore`; drives the gauge fill angle |

All averages are rounded to the nearest 0.5 using `roundHalf(v) = Math.round(v * 2) / 2`.

---

## Helper Functions

| Function | Signature | Purpose |
|---|---|---|
| `fmtScore` | `(v) → string \| null` | `4` → `"4.0"`, `4.5` → `"4.5"` |
| `fmtScoreFull` | `(v) → string \| null` | `4.5` → `"4.5/6"` |
| `fmtD` | `(iso) → string` | `"2026-04-14T09:15:00"` → `"Apr 14, 2026"` |
| `fmtT` | `(iso) → string` | `"2026-04-14T09:15:00"` → `"9:15 AM"` |
| `scoreColor` | `(v) → hex` | Green / amber / red threshold coloring |
| `roundHalf` | `(v) → number` | Rounds to nearest 0.5 |
| `arcPath` | `(sa, ea) → SVG d` | Generates gauge arc path string |
| `buildTrend` | `(pts, allTimeAvg?) → TrendData \| null` | Builds sparkline SVG data and delta label |

---

## Svelte 5 Runes Usage

The file uses only Svelte 5 runes — no legacy reactive syntax.

- `$state` for all mutable UI state
- `$derived` / `$derived.by` for all computed values
- `onclick` handlers (not `on:click`)
- No `export let` — the page takes no props
