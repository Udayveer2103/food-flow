

# Calieori - Implementation Plan

## Overview
A reality-first food balancing app for students and young adults with a warm, friendly design that handles uncertainty gracefully. We'll start with core features and add advanced pattern awareness later.

---

## Phase 1: Foundation & Authentication

### 1.1 Design System
- Warm color palette with soft oranges, gentle yellows, and cream backgrounds
- Rounded corners throughout for an approachable feel
- Friendly typography that's easy to read
- Mobile-responsive layout that works equally well on all devices

### 1.2 Authentication Flow
- Email & password signup/login screens with warm, welcoming design
- After signup: onboarding screen to collect:
  - Diet type selection (Veg / Egg / Non-veg) with friendly icons
  - Optional goal field (stored but not emphasized)

### 1.3 Backend Setup
- Supabase database with tables for Users, FoodLogs, DailyStatus, and DailySpend
- Row-level security so each user only sees their own data

---

## Phase 2: Food Logging (Core Feature)

### 2.1 Food Entry Interface
- Six food category buttons: Mess Meal, Home Food, Outside Food, Milk, Protein Shake, Fruit
- Each category shows as a friendly, tappable card
- Portion size selector with visual indicators:
  - Smaller (−15%)
  - Usual (default)
  - Heavier (+15%)

### 2.2 Food Database
- Pre-loaded food presets with calorie ranges and protein amounts
- Ability for users to add custom food entries
- All calorie data stored and shown as ranges only (e.g., "300-400 cal"), never exact numbers

### 2.3 Price Tracking
- Optional price input for: Outside food, Milk, Protein shake, Fruit
- Helper text for outside food: "Outside food varies a lot. Choose portion size to keep estimates realistic."
- Price band indicators (₹ / ₹₹ / ₹₹₹)

---

## Phase 3: Daily View & Status

### 3.1 Daily Snapshot
- Clean card showing today's summary:
  - Calorie range with status (Low / OK / High)
  - Protein amount with status (Low / OK)
- No charts, no recommendations, no warnings
- Recent food logs listed below in chronological order

### 3.2 Balancing View (What-If Awareness)
- Only appears when protein is low
- Shows protein gap clearly
- Displays possible add-ons filtered by user's diet type
- Uses neutral language: "If you add this…"
- Never says "recommended"

### 3.3 End-of-Day Status
- Simple status shown at day's end: Balanced or Slightly Off
- Neutral, observational tone throughout

---

## Phase 4: Tracking & Summaries

### 4.1 Streaks & Consistency
- Daily streak counter for consecutive balanced days
- Weekly progress: "X of 7 balanced days this week"
- Visual consistency dots
- Always shows qualifier: "Based on days you logged"

### 4.2 Weekly Summary Screen
- Balanced days count
- Average protein (approximate)
- Most common food source
- Predominant price band
- All based only on logged days

### 4.3 Weekly Trends Screen
- Pattern awareness, not improvement focus
- Shows: balanced vs unbalanced days, protein consistency, food source distribution, portion usage, cost distribution
- No better/worse framing

### 4.4 Money Log Screen
- Spending reflection only
- Grouped by date showing: outside food spend, add-on spend, total
- No budgets, limits, or alerts

---

## Phase 5: Advanced Pattern Awareness

### 5.1 Eating Archetype
- Classification based on last 4-7 logged days:
  - Mess-dependent, Outside-heavy, Protein-conscious, Inconsistent, Balanced routine
- Shows archetype name with 1-2 sentence neutral description
- No advice given

### 5.2 Situational Insights
- One contextual observation at a time
- Based on: time of day, weekday vs weekend, spending patterns
- Rotating insights with neutral tone

### 5.3 Monthly Snapshot
- "This Month at a Glance" with:
  - Overall balance tone, protein consistency, outside food frequency
  - Average daily spend, most common food source
- Always includes: "Based on days you logged"
- Hidden if insufficient data

---

## Graceful Data Handling (Throughout)
- Missing days are never shown as failures
- No empty state warnings
- Sections hide when data is insufficient
- Never compare against full weeks/months unless data exists
- All summaries explicitly mention they're based on logged days only

---

## What We're Building First (MVP)
1. ✅ Authentication & onboarding
2. ✅ Food logging with all categories & portion sizes
3. ✅ Daily snapshot & status
4. ✅ Balancing view for low protein
5. ✅ End-of-day status
6. ✅ Basic streaks & consistency

The weekly/monthly views, pattern awareness, and money tracking will be added as we expand.

