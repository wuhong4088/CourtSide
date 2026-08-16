# Final Project: Design Document Enhancements — CourtSide

This document outlines the design enhancements, HCI principles, usability studies, and updated schemas implemented for the **Final Project: Usability & Accessibility Iteration**, building upon the base system described in [DESIGN.md](DESIGN.md).

---

## 1. Project Enhancements & Iteration Focus

Following usability feedback and audits, our iteration focused on upgrading the CourtSide application based on **HCI Design Principles**, **Lighthouse 100% Accessibility Audits**, and **Usability Study Feedback**.

Key general enhancements include:
- **Homepage Onboarding**: An interactive 4-step "How to Use" guide for instant first-time orientation.
- **User Control & Participation**: Complete "Join Game" and "Leave Game" functionality with instant confirmation popups and dynamic participant badge updates.
- **Improved Data Validation**: Enhanced forms and authentication checks with strict validation and user feedback messages.

---

## 2. Updated User Stories (Usability Iteration)

### Partner A Features (@Harini Thirunavukkarasan)
- **Safe Coordination**: As Alex, I want to confirm my action before joining or leaving a pickup game so that I do not accidentally register or drop out due to misclicks.
- **Schedule Browsing**: As Alex, I want to filter games by a specific calendar date and see who has already joined so that I can decide which matches fit my schedule and skill level.
- **My Joined Games**: As Alex, I want to toggle a filter showing only the games I have joined so that I have a quick dashboard of my schedule.
- **Complete History Tracking**: As Taylor, I want to log my match results with a `TIE` outcome option, opponent names, and court location metadata so that I have a rich, precise record of my performances.
- **Sport-wise Performance**: As Taylor, I want to filter my logged matches by sport and see recomputed totals (Wins, Losses, Ties, Win Rate) so that I can track my stats on a sport-by-sport basis.

### Partner B Features (@Wu Hung Hsiao — Your Focus)
- **Map-like Court Directory**: As Jordan, I want to search and select a court first to view its details and existing reviews before submitting a new review, mimicking a familiar mapping workflow.
- **Independent Reviews**: As Jordan, I want my court reviews to append to the listing rather than overwriting existing community reviews, ensuring each player's feedback is preserved.
- **Legible Packing Progress**: As Morgan, I want the packing checklist counter text and add-item inputs to be large and legible on my mobile screen so that I can easily verify gear on the go.

---

## 3. Use Cases (Usability Improvements)

### Use Case 1: Date Filtering & Safe Joining (Alex)
1. **Actor**: Alex (Social Athlete)
2. **Pre-conditions**: Alex is logged in.
3. **Flow of Events**:
   - Alex navigates to the **Find Games** page.
   - Alex selects a date (e.g. "2026-08-15") using the new Calendar Date Filter.
   - The feed queries the MongoDB backend to return matching games for that date.
   - Alex reviews a game card, checking the **Players Joined** list (avatar tags) to see who has registered.
   - Alex clicks **Join Game**. The browser prompts: *"Are you sure you want to join this game?"*
   - Alex confirms. The player count increases, a green success toast appears on the bottom-right for 3 seconds, and Alex's avatar badge appears.
   - Alex clicks the **My Games Only** toggle to verify this game appears on their dashboard.

### Use Case 2: Logging a Score, Opponent & Ties (Taylor)
1. **Actor**: Taylor (Competitive Tracker)
2. **Pre-conditions**: Taylor completed a game.
3. **Flow of Events**:
   - Taylor goes to the **Match History** page.
   - Taylor clicks **Add New Result**.
   - Taylor fills in the modal form: Sport ("Pickleball"), Date, Opponent ("Alex"), Court/Location ("Boston Common"), Score ("11 - 11"), and Result ("TIE").
   - Taylor clicks **Save Result**.
   - The result is written to MongoDB. The frontend re-calculates the stats card. The tie is logged under a new "Ties" counter, and the Win Rate formula excludes the tie from the denominator: `wins / (wins + losses)`.
   - Taylor selects "Pickleball" in the Sport Filter; the stats cards dynamically re-calculate to show only Pickleball stats.

### Use Case 3: Two-Stage Court Map Discovery & Multiple Reviews (Jordan)
1. **Actor**: Jordan (Community Recommender)
2. **Pre-conditions**: Jordan is logged in.
3. **Flow of Events**:
   - Jordan navigates to the **Court Directory** page.
   - Jordan clicks **View Details & Reviews** on a court card.
   - The UI enters the Details View, displaying all existing community reviews.
   - Jordan clicks **Write/Update Review**. A modal opens prompting only for Rating and Review text.
   - Jordan fills in the review and clicks **Save Review**.
   - The system appends this review to the court's reviews array in MongoDB and recalculates the average rating.
   - The UI immediately renders the updated review. Jordan has Edit/Delete privileges only on their own review.
   - Jordan clicks **Back to Directory** to return to the full list.

---

## 4. Design System & 100% Lighthouse Accessibility

To create a clean, accessible layout, the application was upgraded under strict accessibility criteria:
- **Typography**: Integrated **Google Font Inter** with a structured font-weight hierarchy (700 bold headings, 400 body text) ensuring primary elements are salient and read from the top-left.
- **Semantic Color Palette (C.R.A.P. Principles)**:
  - **Emerald Green (`--success`: `#196f3d`)**: Repeated for positive approval actions (Join Game, Save Review, Add Checklist, Save/Create Game).
  - **Crimson Red (`--danger`: `#b01a27`)**: Reserved for destructive/cancellation actions (Leave Game, Delete Match, Remove Item, Delete Court).
- **Lighthouse 100% Accessibility Audits**:
  - Achieved a **100% accessibility score** on Chrome DevTools with zero warnings.
  - **Full Keyboard Operability**: Universal visible focus indicator outlines on all elements enabling complete navigation via Tab and Enter keys.
  - **ARIA Support**: Added explicit input labels and `aria-label` tags on icon buttons and controls for screen-reader support.

---

## 5. HCI & Usability Principles (Shneiderman's Eight Golden Rules)

We mapped our usability iteration changes directly to **Shneiderman's Eight Golden Rules of Interface Design**:
1. **Strive for Consistency**: Standardized semantic button colors (emerald green for approvals, crimson red for cancellations) and typography across all pages.
2. **Cater to Universal Usability**: Delivered 100% keyboard accessibility, `:focus-visible` focus ring styles, and screen-reader `aria-label` support.
3. **Offer Informative Feedback**: Added animated success toast alerts that float in upon joining a game (disappearing in 3 seconds) and real-time checklist progress tracking bars.
4. **Permit Easy Reversal of Actions**: Provided flexible options to leave joined games (with confirmation prompts) or delete checklist items.
5. **Reduce Short-term Memory Load**: Added the step-by-step onboarding guide on the homepage so users immediately understand the 4 core workflows.

---

## 6. Usability Study Overview & Likert Scores

The usability study comprised moderated testing sessions with screen and audio recording utilizing the think-aloud protocol across **6 tasks** with participants.

### Average Likert Scores by Task (1-5 scale, where 5 is best)
| Task | Description | Success Score | Intuitiveness Score |
|---|---|:---:|:---:|
| **T1** | Create a pickup game | **5.0 / 5.0** | **4.7 / 5.0** |
| **T2** | Find / Join / Leave a game | **5.0 / 5.0** | **5.0 / 5.0** |
| **T3** | Log a match result | **4.7 / 5.0** | **4.3 / 5.0** |
| **T4** | Add a court review | **5.0 / 5.0** | **4.3 / 5.0** |
| **T5** | Search court directory | **5.0 / 5.0** | **5.0 / 5.0** |
| **T6** | Manage gear checklist | **5.0 / 5.0** | **5.0 / 5.0** |

---

## 7. Priority Matrix & Implementation Status

### MUST — Implemented
- **Confirm Dialog before Join/Leave**: Added double-checks on game feeds to prevent accidental sign-ups/leaves.
- **Tie Outcome Support**: Expanded match logging to include TIE results and fixed stats formulas to avoid counting ties as losses.

### SHOULD — Implemented
- **"My Games Only" Filter**: Toggled dashboard view listing only games the current user registered for.
- **Muted Past Games**: Muted past matches visually with a "Past Game" badge and disabled buttons.
- **Court Reviews Appending**: Redesigned reviews array in MongoDB so users append reviews, avoiding overwriting other community entries.

### COULD — Implemented
- **Sport Filter on Match History**: Stats cards dynamically filter and recompute per-sport.
- **Gear Checklist Input Resized**: Shrunk/resized checklist input styling to match standard app form-controls.
- **Zip Code address match**: Confirmed address matching handles zip code queries.

### WOULD — Deferred (Future Work)
- **Verified Court Dropdown**: Restrict game creation locations to verified court listings.
- **Game Group Chat / Host Contact**: Built-in communication channels for players.
- **Skill Levels in Player Badge**: Show individual participant skill ratings inside joined rosters.
- **Auto-Submit Scores**: Host auto-submission of results upon game time completion.
- **Shared Checklists**: Suggested packing templates based on the sport of a joined game.

---

## 8. Enhanced Database Schemas

To support multiple reviews and expanded match history details, the MongoDB collections were enhanced:

### `match_results` Collection
```json
{
  "_id": "ObjectId",
  "sport": "string",
  "userId": "string",
  "score": "string",
  "outcome": "string (WIN, LOSS, or TIE)",
  "date": "string (YYYY-MM-DD)",
  "opponent": "string",
  "location": "string",
  "createdAt": "date"
}
```

### `courts` Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "address": "string",
  "sport": "string",
  "rating": "float (Average of all reviews)",
  "reviews": [
    {
      "author": "string",
      "rating": "float",
      "text": "string",
      "createdAt": "date"
    }
  ],
  "createdAt": "date"
}
```
