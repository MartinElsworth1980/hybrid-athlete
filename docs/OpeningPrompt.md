# Claude Code Kickoff Prompt — 8-Week Hybrid Athlete Web App

---

## Project context

You are building a **personal 8-week hybrid athlete training web application** for a single user. This is a full-featured, production-quality fitness tracker combining a progressive training program (3 gym sessions + 3 runs per week), a nutrition dashboard with meal plans and recipes, and a weekly progress system — all baked with real program data, not placeholder content.

The program data is pre-defined and hardcoded into the app. There is no CMS, no admin panel, no user authentication. This is a personal tool — think of it as a beautifully crafted digital training journal and dashboard.

---

## Tech stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State**: React Context API + `localStorage` for persistence
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **No backend required** — all data is local

---

## Design brief

**Tone**: Refined athletic precision. Not a generic fitness app. Think Nike Training Club meets a bespoke coaching dashboard. Clean, intentional, confident.

**Aesthetic direction**:
- Dark mode default with a polished light mode toggle
- Typography: pair a strong geometric display font (e.g. DM Sans, Syne, or Outfit for headings) with a clean readable body font — no Inter, no Roboto
- Color palette: deep near-black backgrounds in dark mode, crisp off-whites in light mode, with a single bold accent color (electric amber `#F59E0B`) used sparingly and intentionally
- Cards with subtle glass-morphism in dark mode, clean elevated shadows in light mode
- Smooth transitions between views (100–200ms ease)
- Progress rings, animated progress bars, and streak counters for gamification
- Mobile-responsive — it must work on phone (used at the gym / on runs)
- Every section should feel like it belongs in the same design system — no mix of styles

---

## Application structure

### Pages / views

1. **Dashboard** (home) — current week overview, today's session, calorie targets, streak counter, weekly progress summary
2. **Program** — 8-week calendar overview, click into any week to see the full week schedule
3. **Today's Session** — detailed view of today's workout or run with sets/reps/RPE, timers, and a completion logger
4. **Nutrition** — daily meal plan based on day type (gym/run/long run/rest), calorie and macro targets, recipe library
5. **Recipes** — full searchable/filterable recipe library (breakfast, lunch, snacks) with macros and meal prep rating
6. **Progress** — weekly log of completed sessions, weights lifted, run distances, and body weight tracking

### Navigation
Persistent bottom nav on mobile, left sidebar on desktop. Include: Dashboard, Program, Today, Nutrition, Recipes, Progress.

---

## Program data to hardcode

### Weekly schedule (repeating every week, distances/weights scale)

| Day | Session |
|-----|---------|
| Monday | Upper Body A — horizontal push/pull, strength focus |
| Tuesday | Easy Run + strides |
| Wednesday | Upper Body B — vertical push/pull, hypertrophy focus |
| Thursday | Lower Body — strength + hypertrophy |
| Friday | Quality Run (tempo/fartlek, varies by week) |
| Saturday | Rest / active recovery |
| Sunday | Long Slow Run |

### Gym sessions — Upper Body A (Monday)

| Exercise | Sets × Reps | RPE | Rest |
|----------|-------------|-----|------|
| Barbell Bench Press | 4 × 4–6 | 7–8 | 3–4 min |
| Barbell Bent-Over Row | 4 × 6–8 | 7–8 | 2–3 min |
| Incline Dumbbell Press | 3 × 8–10 | 7–8 | 90 sec |
| Seated Cable Row | 3 × 10–12 | 8 | 90 sec |
| Dumbbell Lateral Raise | 3 × 12–15 | 8 | 60 sec |
| Tricep Pushdown | 3 × 10–12 | 8 | 60 sec |
| Barbell Curl | 3 × 10–12 | 8 | 60 sec |

### Gym sessions — Upper Body B (Wednesday)

| Exercise | Sets × Reps | RPE | Rest |
|----------|-------------|-----|------|
| Overhead Press | 4 × 6–8 | 7–8 | 3 min |
| Weighted Pull-Up / Lat Pulldown | 4 × 6–8 | 7–8 | 2–3 min |
| Dumbbell Flat Press | 3 × 8–10 | 7–8 | 90 sec |
| Chest-Supported Row | 3 × 10–12 | 8 | 90 sec |
| Face Pulls | 3 × 15–20 | 7 | 60 sec |
| Incline Dumbbell Curl | 3 × 10–12 | 8 | 60 sec |
| Overhead Tricep Extension | 3 × 10–12 | 8 | 60 sec |

### Gym sessions — Lower Body (Thursday)

| Exercise | Sets × Reps | RPE | Rest |
|----------|-------------|-----|------|
| Barbell Back Squat | 4 × 4–6 | 7–8 | 3–5 min |
| Romanian Deadlift | 3 × 6–8 | 7–8 | 2–3 min |
| Bulgarian Split Squat | 3 × 8–10 each | 7–8 | 90 sec |
| Leg Curl | 3 × 10–12 | 8 | 90 sec |
| Leg Extension | 3 × 10–12 | 8 | 90 sec |
| Calf Raise | 3 × 12–15 | 8 | 60 sec |
| Ab Wheel / Plank | 3 × 10–12 | 7 | 60 sec |

### 8-week running plan

| Week | Long Run (Sun) | Easy Run (Tue) | Quality Run (Fri) |
|------|----------------|----------------|-------------------|
| 1 | 10 km | 5 km easy | Strides only |
| 2 | 12 km | 5.5 km + strides | 5 km easy |
| 3 | 14 km | 6 km + strides | Fartlek 5 km |
| 4 | 9 km (cutback) | 4.5 km easy | 4.5 km easy |
| 5 | 15.5 km | 6.5 km + strides | Fartlek 7 km |
| 6 | 17 km | 7 km + strides | Tempo 7 km |
| 7 | 19 km | 7 km + strides | Fartlek/Tempo 7.5 km |
| 8 | 21 km | 6 km (reduced) | Easy 5.5 km |

### Gym periodisation by week

| Week | Phase | RPE | Sets on Main Lifts |
|------|-------|-----|--------------------|
| 1 | Adaptation | 6 | 3 |
| 2 | Build 1 | 7 | 3 |
| 3 | Build 2 | 7–8 | 3–4 |
| 4 | **Deload** | 5–6 | 2 |
| 5 | Build 3 | 7–8 | 3–4 |
| 6 | Build 4 | 8 | 4 |
| 7 | Peak | 8–9 | 4 |
| 8 | **Deload** | 5–6 | 2 |

---

## Nutrition data to hardcode

### Calorie and macro targets by day type

| Day Type | Calories | Protein | Carbs | Fat |
|----------|----------|---------|-------|-----|
| Gym day | 2,950 | 155 g | 350 g | 90 g |
| Easy run day | 3,100 | 155 g | 420 g | 80 g |
| Long run day | 3,350 | 155 g | 500 g | 75 g |
| Rest day | 2,750 | 155 g | 270 g | 90 g |

---

## Recipe library to hardcode

### Breakfasts (15 recipes)

Build all of these with full macros, prep time, meal prep rating (1–5 stars), and a short description:

| Name | Protein | Calories | Prep | Meal Prep |
|------|---------|----------|------|-----------|
| Cottage Cheese Egg Bites | 30g | 230 | 35 min | ★★★★★ |
| Turkey Sausage Breakfast Casserole | 31g | 280 | 50 min | ★★★★★ |
| Boursin Mushroom Spinach Quiche | 33g | 350 | 60 min | ★★★★ |
| Sheet Pan Egg White Wraps | 31g | 320 | 30 min | ★★★★ |
| Veggie-Loaded Egg Muffins | 25g | 210 | 30 min | ★★★★★ |
| Protein Overnight Oats (with powder) | 35g | 400 | 5 min | ★★★★★ |
| Protein Overnight Oats (no powder) | 27g | 400 | 5 min | ★★★★★ |
| Cinnamon Roll Baked Oatmeal | 25g | 300 | 45 min | ★★★★ |
| Greek Yogurt Protein Bowl (berry) | 41g | 330 | 3 min | ★★★ |
| Greek Yogurt Berry Bowl (no powder) | 38g | 441 | 3 min | ★★★ |
| Fluffy Protein Pancakes (oat-based) | 37g | 500 | 20 min | ★★★★ |
| 4-Ingredient Protein Pancakes | 53g | 370 | 15 min | ★★★★ |
| Chocolate PB Protein Smoothie | 35g | 420 | 3 min | ★★★★ |
| Berry Blast Recovery Smoothie | 35g | 380 | 3 min | ★★★★ |
| Make-Ahead Breakfast Burritos | 32g | 450 | 30 min (batch 10) | ★★★★★ |

### Lunches (15 recipes)

| Name | Protein | Calories | Prep | Meal Prep |
|------|---------|----------|------|-----------|
| Chicken Burrito Bowl, Cilantro Lime Rice | 52g | 530 | 40 min | ★★★★★ |
| Garlic Herb Chicken Rice Bowls | 48g | 485 | 40 min | ★★★★★ |
| Buffalo Chicken Rice Bowl | 43g | 415 | 20 min | ★★★★ |
| Chicken Taco Rice Bowls | 45g | 520 | 30 min | ★★★★★ |
| Greek Chicken Meatball Bowl, Tzatziki | 38g | 480 | 35 min | ★★★★ |
| Ground Turkey Chili | 33g | 350 | 40 min | ★★★★★ |
| Spicy Beef Mac and Cheese | 42g | 500 | 30 min | ★★★★ |
| Korean BBQ Chicken Bowls | 35g | 544 | 20 min | ★★★★ |
| Teriyaki Salmon Rice Bowl | 41g | 520 | 25 min | ★★★★ |
| Crispy Salmon Fried Rice | 45g | 531 | 25 min | ★★★★★ |
| Mediterranean Salmon Quinoa Bowl | 34g | 550 | 30 min | ★★★★ |
| Copycat Sweetgreen Harvest Bowl | 35g | 520 | 45 min | ★★★★ |
| Chicken Caesar Pasta Salad | 35g | 450 | 25 min | ★★★★ |
| Avocado Tuna Salad on Everything Bagel | 35g | 420 | 10 min | ★★★ |
| Grilled Steak Salad, Sweet Vinaigrette | 28g | 400 | 20 min | ★★★ |

### Snacks (10)

| Name | Protein | Calories | Notes |
|------|---------|----------|-------|
| PB Protein Balls (3) | 16g | 300 | Freezes 6 months |
| Homemade Protein Granola Bars | 12g | 180 | Batch cook |
| Cottage Cheese + Fruit Bowl | 25g | 250 | Casein = slow release |
| Turkey & Cheese Roll-Ups (4) | 24g | 200 | Zero cooking |
| Greek Yogurt Parfait | 20g | 220 | Probiotics |
| Hard-Boiled Eggs (3) + Apple | 19g | 300 | Batch boil Sunday |
| Beef/Turkey Jerky (2 oz) | 20g | 160 | Gym bag staple |
| Edamame with Sea Salt | 17g | 190 | Microwave 3 min |
| Banana + Nut Butter + Hemp Seeds | 16g | 280 | Pre-workout |
| Post-Workout Protein Shake | 38g | 350 | Fastest recovery |

---

## Features to build

### Core (build all of these)

1. **Auto-detect current week and day** from a configurable program start date. Display the correct session for today automatically.
2. **Session completion logger** — mark sets done, log actual weights used, mark session complete. Persists to `localStorage`.
3. **Progressive overload tracker** — for each exercise, show the last logged weight and suggest a small increase.
4. **Run logger** — log actual distance, time, and pace per run session. Display against the week's target.
5. **Macro tracker** — daily macro rings (protein/carbs/fat). User can log meals from the recipe library or enter custom macros.
6. **Streak counter** — consecutive days with at least one logged session.
7. **8-week progress grid** — 56-day visual grid, colour-coded: complete / partial / missed / upcoming / today.
8. **Dark/light mode toggle** — persisted to `localStorage`, smooth CSS transition.

### Nice-to-have (build if time allows after core is complete)

- Rest timer that auto-starts between sets with a subtle sound/vibration
- Weekly summary card every Sunday with key stats
- Motivational quote tied to the current training phase
- Nutrition tips for the current day type on the dashboard

---

## Component architecture

```
src/
  components/
    layout/       Sidebar, BottomNav, Header, ThemeToggle
    dashboard/    WeekOverview, TodayCard, StreakBadge, MacroRings
    program/      WeekCalendar, DayCard, PhaseIndicator
    session/      ExerciseCard, SetRow, RestTimer, CompletionButton
    nutrition/    MacroDayTarget, MealSlot, MacroRingChart
    recipes/      RecipeCard, RecipeModal, RecipeFilter
    progress/     WeekGrid, RunLogCard, LiftLogCard, BodyWeightChart
  context/
    AppContext     Global state: currentWeek, theme, logs, startDate
  data/
    program.js    All 8-week training data
    nutrition.js  Day-type macro targets and meal timing
    recipes.js    Full recipe library
  hooks/
    useCurrentDay  Returns today's session type and week number
    useLocalStorage Wrapper for localStorage reads/writes
  pages/
    Dashboard, Program, TodaySession, Nutrition, Recipes, Progress
```

---

## localStorage data structure

```js
"hybrid_start_date"     // ISO date string — when week 1 began
"hybrid_theme"          // "dark" | "light"
"hybrid_session_logs"   // { "2025-04-07": { completed: true, exercises: [...] } }
"hybrid_run_logs"       // { "2025-04-08": { distance: 5.2, time: "28:30", pace: "5:29" } }
"hybrid_macro_logs"     // { "2025-04-07": { protein: 142, carbs: 310, fat: 88 } }
"hybrid_weight_logs"    // { "2025-04-07": 77.5 }
```

---

## Quality bar

- **Zero placeholder content** — every recipe, exercise, run target, and macro number is real data from the program above
- Every page fully functional on first load
- Works entirely offline — no external API calls except Google Fonts
- Clean "reset program" option in settings to wipe all logs and restart
- Responsive: 375px mobile minimum → 768px tablet → 1280px desktop
- Dark mode is the default
- No lorem ipsum, no "Coming soon", no broken empty states

---

## Build order

1. Scaffold Vite + React + Tailwind
2. Set up theme system (CSS variables, dark/light toggle, localStorage)
3. Build the data layer: `program.js`, `nutrition.js`, `recipes.js` — foundation first
4. Implement `AppContext` and `useCurrentDay` hook
5. **Dashboard page** — primary view, get this right first
6. **Today's Session page** — most-used screen, highest priority after dashboard
7. **Recipes library** — search, filter, recipe modal
8. **Nutrition page** — macro targets, day-type display, meal logging
9. **Program calendar** — 8-week overview + week detail view
10. **Progress page** — week grid, run log, lift log, weight chart
11. Polish pass: transitions, mobile nav, empty states, accessibility

Make decisions and proceed. Only ask if something is genuinely ambiguous.
