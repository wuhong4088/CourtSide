# Final Project: Accessibility & Usability Enhancements

This document summarizes the changes implemented to address accessibility issues and improve overall usability. These updates ensure the application is keyboard-navigable and meets WCAG AA contrast standards.

---

## 1. Color Contrast Updates

The design system color variables in `index.css` were updated to ensure a minimum contrast ratio of 4.5:1 on light backgrounds.

- **Primary Blue (`--primary`)**: Changed from `#007bff` to `#0056b3` (Contrast ratio: 6.08:1 on white).
- **Secondary Gray (`--secondary`)**: Changed from `#6c757d` to `#4b5563` (Contrast ratio: 6.66:1 on white).
- **Accent Green (`--accent`)**: Changed from `#28a745` to `#196f3d` (Contrast ratio: 6.21:1 on white).
- **Danger Red (`--danger`)**: Changed from `#dc3545` to `#b01a27` (Contrast ratio: 6.95:1 on white).

### Layout Adjustments
- Replaced hardcoded `#007bff` in `Navbar.css`, `Home.css`, and `GearChecklist.css` with `var(--primary)`.
- Replaced hardcoded `#dc3545` in `Navbar.jsx` and `GearChecklist.css` with `var(--danger)`.
- Changed win/loss text colors in `MatchHistory.jsx` from `#22c55e` and `#ef4444` to `var(--accent)` and `var(--danger)` to resolve stats card contrast issues.

---

## 2. Link Distinguishability

To ensure text links do not rely solely on color to be distinguishable:
- **Footer Link**: Underlined the class link ("CS 5610 Web Development") in `Footer.css` by default.
- **Sport Category Links**: Underlined popular sport links ("Browse Badminton Games →", etc.) in `Home.css` by default.

---

## 3. Keyboard Navigation

Added custom focus states in `index.css` using `:focus-visible` to ensure a clear focus outline is visible when navigating the app via the Tab key:

```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}
```

---

## 4. Semantic Markup and ARIA Attributes

Added explicit labels and screen-reader context to inputs and icon buttons:
- **Search & Filters**: Added `aria-label` to search inputs and filter dropdowns in `CourtDirectory.jsx` and `GameFeed.jsx`.
- **Delete Triggers**: Added `aria-label="Remove item"` to the cross symbol (`&times;`) button in `GearChecklist.jsx`.
- **Typography**: Set `index.css` main font family to `'Inter', Arial, Helvetica, sans-serif` to match the imported Google Fonts font.

---

## 5. Usability & User Interview Enhancements

Based on usability study findings from interviews with 3 participants, we implemented several iterations to resolve identified pain points:

- **Action Buttons Semantic Coding (Must)**: Defined `--success` (Emerald Green) and `.btn-success` CSS variables/classes. Unified all positive action and approval buttons (Join, Add, Save, Create Game, Create New Game) across `GameFeed.jsx`, `CourtDirectory.jsx`, `GearChecklist.jsx`, `MatchHistory.jsx`, and `CreateGame.jsx` to be green, and destructive actions (Delete, Leave) to be Crimson Red (`btn-danger`), ensuring full color-palette consistency.
- **Removed Developer Jargon & Polished Copy**: Cleaned up internal/developer-facing placeholder terms and technical jargon on the frontend (e.g. replaced the raw "run seeding script" warning on the Homepage with a polished, production-ready state message: "No recommended courts available at this time.") to remove any mechanical or unpolished "AI/template feel".
- **Homepage Onboarding Section (Should)**: Inserted a step-by-step "How to Use CourtSide" instructional guide with 4 cards explaining the main workflows to improve task clarity for first-time users.
- **Game Feed Date Filter (Should)**: Added a Calendar Date Filter in `GameFeed.jsx` and updated the `routes/games.js` backend to support server-side regex filtering, enabling users to scan for games on specific dates easily.
- **Immediate Toast Feedback & Participant List (Must)**: 
  - Rendered joined co-participants lists on each game card.
  - Implemented an animated floating success toast message on game join that auto-dismisses after 3 seconds.
- **Two-Stage Court Directory Redesign (Could)**: Separated court search and discovery from the review process. Users now search court cards, click "View Details & Reviews" to view specific location pages containing the reviews, and click a separate "Write/Update Review" button to open the rating modal, resolving confusion.
- **Expanded Match Records (Could)**: Updated `MatchHistory.jsx` and `routes/matches.js` to support Opponent Name and Court/Location fields, presenting default values ("N/A", "Local Court") when blank and allowing full card edits.
- **Legible Packing Progress**: Increased the packed counter text size in `GearChecklist.css` from `0.75rem` to `0.85rem` to improve accessibility.

---

## 6. Follow-Up Changes from the 3-Participant Usability Study (Partner A: Harini Thirunavukkarasan)

After the design pass above, a second usability study with 3 participants (Google Form, Likert scale) surfaced further pain points across both partners' features. The following changes were implemented directly in response:

- **Join/Leave Confirmation (Must)**: Added a `confirm()` prompt before both joining and leaving a game in `GameFeed.jsx`. Participant feedback: "Too easy to join and leave a game currently — might need an additional validation step."
- **TIE Outcome + Corrected Win-Rate Math (Must)**: Added a `TIE` option to Match Result outcomes in `MatchHistory.jsx` and `routes/matches.js` handling. Fixed a latent stats bug where `losses = total - wins` would have silently counted any tie as a loss; Win Rate is now computed as `wins / (wins + losses)`, excluding ties from the decisive-game denominator, with a new "Ties" stat card. Participant feedback: "Option for TIE, not just WIN/LOSS."
- **"My Games Only" Filter (Should)**: Added a filter toggle to `GameFeed.jsx` showing only games the current user has joined, addressing repeated feedback for "a dashboard to show joined games" (raised independently by two participants).
- **Past Games Greyed Out (Should)**: Games whose scheduled time has passed are now visually muted with a "Past Game" badge and a disabled Join button in `GameFeed.jsx`. Participant feedback: "Grey out past events."
- **Sport Filter on Match History (Could)**: Added a sport filter to `MatchHistory.jsx`; the stats cards (Total/Wins/Losses/Ties/Win Rate) now recompute for the filtered sport rather than always showing all-time totals. Participant feedback: "Would be nice if we could filter by sport."
- **Court Reviews No Longer Overwrite Each Other (Should, Partner B's collection)**: Courts previously stored a single `review`/`rating` field that any logged-in user's "Write/Update Review" action would silently overwrite. `routes/courts.js` and `CourtDirectory.jsx` were reworked so each court stores a `reviews` array; each review is owned by its author, appended (not replaced) when a new user reviews the same court, and only editable/deletable by its own author (enforced server-side, 403 otherwise). Existing courts are normalized on read with zero data migration required. Participant feedback: "Overrides the review of others currently... Needs to be added and not overridden."
- **Checklist "Add Item" Input Resized (Could, Partner B's collection)**: `.add-item-input` in `GearChecklist.css` was shrunk far below the app's standard `.form-control` sizing (0.85rem/4px padding vs. 0.9rem/8px elsewhere). Resized to match. Participant feedback: "better input box when adding an item or making changes."
- **Zip Code Search — Verified, No Change Needed**: A participant asked for court search by zip code; confirmed the existing address-based search already matches zip codes since they're embedded in the stored address string (tested: searching "02215" returns 1,004 matching courts).

### Documented but not implemented (time-boxed as future work)
- **Group chat / contact info per game** (Would) — real-time messaging is out of scope for the current timeline; a lighter alternative (e.g., a visible host contact field) could be a future iteration.
- **Per-participant skill level in the joined-players list** (Would) — requires adding a skill-level attribute to user profiles, not currently modeled.
- **Linking match results to a specific game / "game-wise" filter** (Would) — `match_results` is not currently linked to `games`; would require a schema change (optional `gameId` reference).
- **Host submitting the match result automatically** (Would) — cross-feature automation between Games and Match History, deferred.
- **Create Game location as a dropdown of verified courts** (Would) — cross-feature coupling between Games and Courts, deferred.
- **Shared/auto-suggested gear checklist when creating or joining a game** (Would) — joint feature between Partner A and Partner B, deferred as a stretch goal.
