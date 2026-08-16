# Final Project: Design Document Enhancements — CourtSide

This document outlines the design enhancements, updated user stories, use cases, and database schemas implemented for the **Final Project: Usability & Accessibility Iteration**, building upon the base system described in [DESIGN.md](DESIGN.md).

---

## 1. Project Enhancements Overview

Following usability studies with 6 participants (across two rounds of testing), several core workflows were iterated on to resolve user confusion, improve accessibility (WCAG AA contrast, keyboard outlines), and align with expected map and sports-feed patterns.

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

## 4. Enhanced Database Schemas

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
*Note: Existing courts are automatically normalized on read by the Express backend API so that old data is safely adapted without requiring complex database migrations.*
