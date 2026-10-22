# WanderWise — End-to-End (E2E) Test Checklist

Use this checklist to manually verify all user journeys, UI controls, security boundaries, and edge cases across the application.

---

## 1. Authentication & Session Management
- [ ] **Public Landing Page**: Navigate to `/`. Confirm hero, feature cards, sample trip previews, and CTA buttons render without layout glitches.
- [ ] **Demo Mode One-Click Login**:
  - Click **Sign In** from navbar.
  - Click **"One-Click Demo Sign-In"**.
  - Verify redirection to `/dashboard` with banner confirming Demo Mode active.
- [ ] **User Registration**:
  - Navigate to `/signup`.
  - Enter full name, email, and password (< 6 chars). Confirm validation error triggers.
  - Enter valid password (>= 6 chars). Confirm account created and redirected to dashboard.
- [ ] **Sign Out**:
  - Click user avatar in navbar -> **Sign Out**.
  - Verify session token cleared from storage and redirected to landing page.
- [ ] **Protected Route Enforcement**:
  - While logged out, try navigating directly to `/dashboard` or `/plan`.
  - Verify automatic redirection to `/login` with prompt.

---

## 2. 5-Step Trip Wizard (`/plan`)
- [ ] **Step 1 (Destination & Dates)**:
  - Leave destination blank and click continue. Confirm validation error.
  - Enter "Kyoto, Japan".
  - Pick start date and end date where end date precedes start date. Confirm validation warning.
  - Pick valid 4-day range. Verify calculated duration badge shows "4 Days".
- [ ] **Step 2 (Travelers & Budget)**:
  - Select traveler type: "Couple".
  - Adjust traveler count to 2.
  - Set total budget to 3,200 USD. Verify calculated daily allocation updates dynamically.
- [ ] **Step 3 (Style & Interests)**:
  - Toggle style tier to "Balanced".
  - Toggle daily pace to "Moderate".
  - Select interests: "Culture & Heritage", "Food & Culinary", "Sightseeing". Confirm tag pills activate with checkmarks.
- [ ] **Step 4 (Requirements & Notes)**:
  - Fill in dietary restriction (e.g. "Pescatarian, loves matcha and ramen").
  - Fill in accessibility (e.g. "Prefers subway elevator access").
  - Add special request (e.g. "Include a traditional tea ceremony").
- [ ] **Step 5 (Review & Generation)**:
  - Verify all brief items match selections.
  - Click **"Generate Personalized Itinerary"**.
  - Verify animated loading indicator appears with helpful progress hints.
  - Confirm automatic redirect to `/itinerary/:id` upon completion.

---

## 3. Itinerary View & Daily Timeline (`/itinerary/:id`)
- [ ] **Day Tabs**:
  - Click **Day 1**, **Day 2**, etc. Confirm activities change accordingly.
  - Click **View All Days**. Confirm sequential timeline of all days rendered.
- [ ] **Activity Cards**:
  - Verify time slot tags (Morning, Afternoon, Evening) have color-coded badges.
  - Verify estimated cost badge displays correct currency (`$`, `€`, `¥`).
  - Verify local tip box displays underneath relevant activities.
- [ ] **Accommodations & Transit**:
  - Confirm daily lodging box shows hotel name and estimated nightly cost.
  - Confirm transit box shows neighborhood-specific mobility advice.
- [ ] **Budget Tracker (`BudgetSummary`)**:
  - Check the progress bar comparing total target budget vs calculated sum of activities + lodging.
  - Confirm variance badge displays green "Within Budget" or red "Exceeds Budget".

---

## 4. Live Editing & Recalculation
- [ ] **Inline Activity Edit**:
  - On an activity card, click the edit (pencil) icon.
  - Change activity title and increase estimated cost from $25 to $150.
  - Click **Save**.
  - Verify the activity card updates and the **Budget Summary** total cost immediately increases by $125!
- [ ] **Add Activity**:
  - Click **"+ Add Activity to Day"**.
  - Fill in modal: Title, slot (Afternoon), duration (60m), cost ($40).
  - Click **Add Activity**. Verify new activity appears in the timeline and daily cost updates.
- [ ] **Delete Activity**:
  - Click the trash icon on an activity. Confirm activity removed and daily budget decreases.
- [ ] **Single Day Regeneration**:
  - Click **"Regenerate Day"**.
  - Verify spinning indicator and confirmation toast.
  - Check that the day's activities refresh with new alternative suggestions while preserving the other days intact!

---

## 5. Itinerary Management & Saved Trips (`/trips`)
- [ ] **Save Itinerary**: Click **"Save Itinerary"** button. Confirm success toast appears.
- [ ] **Saved Trips List**:
  - Navigate to `/trips`.
  - Confirm newly saved trip appears in the grid with destination photo, dates, and total budget.
- [ ] **Search & Filter**:
  - Type destination name into search bar. Confirm real-time filtering.
  - Change style dropdown to "Luxury" or "Balanced". Confirm filter matching.
- [ ] **Delete Trip Modal**:
  - Click trash icon on a trip card.
  - Confirm accessible `ConfirmModal` pops up warning that deletion is permanent.
  - Click **Delete**. Confirm trip is deleted and removed from the view with notification.

---

## 6. PDF Export & Print Quality
- [ ] Click **"Print / PDF"** on the itinerary page.
- [ ] Confirm browser print preview dialogue opens.
- [ ] Check print layout:
  - Navigation header, sidebar, demo banner, and action buttons are cleanly hidden (`@media print`).
  - Itinerary days format cleanly with page break hints and high contrast text.

---

## 7. Security & Error Handling
- [ ] **Database RLS Policies**:
  - Verify that authenticated queries in Supabase PostgreSQL restrict rows to `auth.uid() = user_id`.
- [ ] **Malformed Input Validation**:
  - Verify backend rejects negative budget, invalid dates, or malformed time slot enum with HTTP 422.
- [ ] **404 Not Found Page**:
  - Navigate to `/non-existent-route`.
  - Confirm custom 404 page renders with "Return to Dashboard" action.
