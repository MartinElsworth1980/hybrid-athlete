# CLAUDE.md — 8-Week Hybrid Athlete App

## What this project is

A personal 8-week hybrid athlete training web application. Single user. No backend. No auth. All program data is hardcoded. Think of it as a beautifully crafted digital coaching dashboard that knows what week you're in, what you're doing today, and keeps you accountable.

This is a **personal tool**, not a product. Optimise for usability and polish over extensibility.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + CSS custom properties for theming |
| State | React Context API |
| Persistence | `localStorage` only |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Google Fonts (loaded in `index.html`) |

No backend. No database. No external API calls except Google Fonts.

---

## Project structure

```
src/
  components/
    layout/         Sidebar, BottomNav, Header, ThemeToggle
    dashboard/      WeekOverview, TodayCard, StreakBadge, MacroRings
    program/        WeekCalendar, DayCard, PhaseIndicator
    session/        ExerciseCard, SetRow, RestTimer, CompletionButton
    nutrition/      MacroDayTarget, MealSlot, MacroRingChart
    recipes/        RecipeCard, RecipeModal, RecipeFilter
    progress/       WeekGrid, RunLogCard, LiftLogCard, BodyWeightChart
  context/
    AppContext.jsx   Global state — theme, logs, startDate, currentWeek
  data/
    program.js      All 8-week training data (exercises, runs, periodisation)
    nutrition.js    Day-type calorie/macro targets
    recipes.js      Full recipe library with macros and details
  hooks/
    useCurrentDay.js   Returns today's session type and week number
    useLocalStorage.js Wrapper around localStorage reads/writes
  pages/
    Dashboard.jsx
    Program.jsx
    TodaySession.jsx
    Nutrition.jsx
    Recipes.jsx
    Progress.jsx
```

---

## localStorage keys

```js
"hybrid_start_date"     // ISO date string — when week 1 started
"hybrid_theme"          // "dark" | "light"
"hybrid_session_logs"   // { "YYYY-MM-DD": { completed: bool, exercises: [...] } }
"hybrid_run_logs"       // { "YYYY-MM-DD": { distance: number, time: string, pace: string } }
"hybrid_macro_logs"     // { "YYYY-MM-DD": { protein: number, carbs: number, fat: number } }
"hybrid_weight_logs"    // { "YYYY-MM-DD": number }
```

All reads/writes go through the `useLocalStorage` hook. Never access `localStorage` directly in components.

---

## Design system rules

### Theme

CSS custom properties defined in `:root` and `[data-theme="light"]`. Never hardcode colors in components — always use variables.

```css
/* Dark mode (default) */
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-card: #1a1a1a;
  --bg-card-hover: #202020;
  --border: #2a2a2a;
  --text-primary: #f5f5f5;
  --text-secondary: #a3a3a3;
  --text-muted: #525252;
  --accent: #F59E0B;
  --accent-dim: rgba(245, 158, 11, 0.15);
  --success: #22c55e;
  --warning: #f97316;
  --error: #ef4444;
}

/* Light mode */
[data-theme="light"] {
  --bg-primary: #fafafa;
  --bg-secondary: #f4f4f5;
  --bg-card: #ffffff;
  --bg-card-hover: #f9f9f9;
  --border: #e4e4e7;
  --text-primary: #09090b;
  --text-secondary: #52525b;
  --text-muted: #a1a1aa;
  /* accent stays the same */
}
```

### Typography

- Display/headings: **Syne** (Google Fonts) — `font-family: 'Syne', sans-serif`
- Body: **DM Sans** (Google Fonts) — `font-family: 'DM Sans', sans-serif`
- Monospace (weights, paces, numbers): **JetBrains Mono** — `font-family: 'JetBrains Mono', monospace`

### Spacing and layout

- Cards: `border-radius: 12px`, `padding: 20px`
- Sidebar width (desktop): `240px`
- Bottom nav height (mobile): `64px`
- Mobile breakpoint: `768px`
- Content max-width: `1200px`

### Motion

- Page transitions: `150ms ease-out` opacity + slight translateY
- Card hover: `transform: translateY(-2px)`, `150ms ease`
- Progress bars: animate width on mount with `500ms ease-out`
- Theme toggle: `200ms` transition on `background-color` and `color`
- Keep it subtle — this is a training tool, not a marketing site

---

## Data shape reference

### Program day object

```js
{
  dayOfWeek: 1,               // 0 = Sunday, 1 = Monday, etc.
  type: "gym",                // "gym" | "run" | "rest"
  sessionKey: "upper_a",     // "upper_a" | "upper_b" | "lower" | "easy_run" | "quality_run" | "long_run"
  label: "Upper Body A",
  nutritionType: "gym",      // "gym" | "easy_run" | "long_run" | "rest"
}
```

### Exercise object

```js
{
  id: "bench_press",
  name: "Barbell Bench Press",
  sets: 4,
  repRange: "4-6",
  rpe: "7-8",
  restSeconds: 210,          // 3.5 min average
  notes: "Control the eccentric. Full ROM.",
  muscleGroup: "chest",
}
```

### Week config object (one per week, array of 8)

```js
{
  week: 1,
  phase: "Adaptation",
  rpeTarget: 6,
  mainLiftSets: 3,
  longRunKm: 10,
  easyRunKm: 5,
  qualityRun: { type: "easy", description: "Easy run + 4×20sec strides", km: 5 },
  notes: "Conservative start. Focus on form and getting into the routine.",
  isDeload: false,
}
```

### Recipe object

```js
{
  id: "chicken_burrito_bowl",
  name: "Chicken Burrito Bowl",
  category: "lunch",          // "breakfast" | "lunch" | "snack"
  calories: 530,
  macros: { protein: 52, carbs: 48, fat: 14 },
  prepMinutes: 40,
  mealPrepRating: 5,          // 1–5
  mealPrepNotes: "Batch cook chicken + rice Sunday. Lasts 5 days.",
  tags: ["meal-prep", "high-protein", "rice-bowl"],
  description: "Grilled chicken thighs over cilantro lime rice with black beans, corn, and fresh salsa. 52g protein and genuinely good.",
  ingredients: [...],         // array of strings
  method: [...],              // array of step strings
}
```

---

## Core logic

### Week and day detection

```js
// useCurrentDay.js
const startDate = localStorage.getItem("hybrid_start_date"); // "2025-04-07"
const today = new Date();
const daysSinceStart = differenceInDays(today, parseISO(startDate));
const currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 8); // clamp to 8
const dayOfWeek = today.getDay(); // 0 = Sunday
```

Week 1 starts on the Monday of the configured start date. If `hybrid_start_date` is not set, show an onboarding screen to set it.

### Progressive overload

For each exercise, track `{ exerciseId, date, weight, repsCompleted }` in `hybrid_session_logs`. When displaying a session, look up the most recent log for that exercise and suggest weight + 2.5kg for upper body compounds, + 2.5–5kg for lower body compounds, + 1–2.5kg for isolation work.

### Streak calculation

Count consecutive calendar days (from today backwards) where at least one session log exists with `completed: true`. Missed rest days do not break the streak.

---

## Pages — purpose and priority

| Page | Purpose | Priority |
|------|---------|----------|
| Dashboard | At-a-glance: today's session, macros, streak, week progress | 1 — build first |
| TodaySession | Step-by-step session execution with logging | 2 — most-used screen |
| Recipes | Searchable/filterable recipe library | 3 |
| Nutrition | Daily macro targets, meal logging, day-type display | 4 |
| Program | 8-week calendar overview + week detail | 5 |
| Progress | Logged sessions, run data, lift history, weight chart | 6 |

---

## What not to build

- No user accounts or auth
- No API calls (except Google Fonts CDN)
- No admin panel or content management
- No social features, sharing, or exports
- No push notifications (web app, not native)
- No animations that run longer than 300ms or block interaction
- No modals that are more than 1 level deep

---

## Coding conventions

- Functional components only — no class components
- One component per file, named to match the file
- `data/` files export plain JS objects/arrays — no logic in data files
- All date manipulation via `date-fns` (add as dependency)
- No inline styles except for dynamic values (e.g. progress bar width as a percentage)
- Tailwind for layout and spacing; CSS variables for colors and typography
- Keep components under ~150 lines. Split if they grow beyond that.
- Comment non-obvious logic — especially the week/day detection and progressive overload lookups

---

## Definition of done

A feature is complete when:
- It works correctly on mobile (375px) and desktop (1280px)
- It reads and writes to localStorage correctly with no data loss on refresh
- Dark mode and light mode both look intentional and polished
- It handles the empty state (no logs yet) gracefully
- No console errors or warnings

---

## Program quick reference

**Weekly schedule:**
Mon = Upper A (gym) | Tue = Easy Run | Wed = Upper B (gym) | Thu = Lower Body (gym) | Fri = Quality Run | Sat = Rest | Sun = Long Run

**Long run progression:** 10 → 12 → 14 → 9 (deload) → 15.5 → 17 → 19 → 21 km

**Gym deload weeks:** Week 4 and Week 8 (cut sets to 2, RPE 5–6)

**Protein target:** 155g every day regardless of day type

**Accent color:** `#F59E0B` (amber) — use sparingly, maximum impact
