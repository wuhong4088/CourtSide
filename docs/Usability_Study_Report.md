# Usability Study Report — CourtSide

**Author:** Harini Thirunavukkarasan (Partner A: Games & Match History; also covers cross-feature fixes made to Partner B's Courts collection as a result of this study)

---

## Application Scope

**Application description:**
CourtSide is a full-stack web app for recreational sports players. It lets users organize and join pickup games, track personal match performance over time, discover and review local sports courts, and manage packing checklists for their gear.

**Users – Target audience:**
- **Alex (The Social Athlete)** — 24, recently moved to Boston, plays pickup basketball, wants to find games at his skill level without messy group-chat coordination.
- **Taylor (The Competitive Tracker)** — 28, plays tennis and pickleball multiple times a week, wants to log every score and outcome to track a personal win rate over time.
- **Jordan (The Community Recommender)** — 35, pickleball enthusiast, wants to recommend and rate local courts so other players can find good places to play.
- **Morgan (The Forgetful Player)** — 22, busy college student, wants a simple pre-game checklist so she doesn't forget gear before rushing to a game.

**Data description:**
`games` (sport, date/time, skill level, host, location, max players, participants), `match_results` (sport, date, score, WIN/LOSS/TIE outcome, linked to a user), `courts` (name, address, sport, reviews array with average rating), `checklists` (title and gear items with checked state, linked to a user).

**Main tasks – use cases:**
- **T1** — Create a new pickup game for a specific sport, date/time, skill level, and location.
- **T2** — Find, join, and then leave a pickup game matching a specific sport and skill level.
- **T3** — Log a match result and verify the win rate updates correctly.
- **T4** — Add a review and rating for a sports court.
- **T5** — Search and filter the court directory to find a specific type of court.
- **T6** — Create a gear checklist, add an item, and check off a packed item.

---

## Experiment

Preparation (introduction script, consent, demographics questions, task scripts, and recording setup) followed the plan in `Usability_Study_Materials.md`. Three participants completed all six tasks and a post-task Google Form with 5-point Likert scales (1 = Strongly Disagree, 5 = Strongly Agree) for effectiveness and intuitiveness on each task, plus an overall rating and open comments.

### Participant 1 — 8/12/2026

**Demographics:** Age 25–34 · Plays pickup sports Monthly · App comfort 5/5 · Has used a similar app before: Yes

**Post-test Likert scores & comments:**

| Task | Success | Intuitive | Comment |
|---|---|---|---|
| T1 Create a Game | 5 | 5 | "Show all the verified court locations in drop down box." |
| T2 Find/Join/Leave | 5 | 5 | "Have a dashboard of currently joined games." |
| T3 Log Match Result | 5 | 5 | "Would be nice if we could filter by sport." |
| T4 Add Court Review | 5 | 5 | — |
| T5 Search Courts | 5 | 5 | "Would be nice to be able to search by zip code as well." |
| T6 Gear Checklist | 5 | 5 | "Better input box when adding an item or making changes." |
| **Overall** | **5** | **5** | "A dashboard to show joined games." |

### Participant 2 — 8/13/2026

**Demographics:** Age 25–34 · Plays pickup sports Monthly · App comfort 5/5 · Has used a similar app before: No

**Post-test Likert scores & comments:**

| Task | Success | Intuitive | Comment |
|---|---|---|---|
| T1 Create a Game | 5 | 4 | — |
| T2 Find/Join/Leave | 5 | 5 | "1. Grey out past events. 2. Too easy to join and leave a game currently — might need an additional validation step." |
| T3 Log Match Result | 4 | 4 | "Option for TIE, not just WIN/LOSS." |
| T4 Add Court Review | 5 | 5 | — |
| T5 Search Courts | 5 | 5 | — |
| T6 Gear Checklist | 5 | 5 | — |
| **Overall** | **5** | **5** | "Common Gear Checklist when you create and join a game." |

### Participant 3 — 8/14/2026

**Demographics:** Age 18–24 · Plays pickup sports Weekly · App comfort 5/5 · Has used a similar app before: Yes

**Post-test Likert scores & comments:**

| Task | Success | Intuitive | Comment |
|---|---|---|---|
| T1 Create a Game | 5 | 5 | "Contact number for quick connect or rather having a group chat option by host for each game created (if possible)." |
| T2 Find/Join/Leave | 5 | 5 | "Knowing more about the group... in terms of their expertise level." |
| T3 Log Match Result | 5 | 4 | "1. Game wise filter. 2. Host submitting the match result after each game if relevant." |
| T4 Add Court Review | 5 | 3 | "Overrides the review of others currently... Needs to be added and not overridden." |
| T5 Search Courts | 5 | 5 | "Good." |
| T6 Gear Checklist | 5 | 5 | "Great one." |
| **Overall** | **5** | **5** | "Great app for a sporty person who plays frequently and is in search for the right group and the right place to play. Makes things easier to get ready for the game from a gear checklist aspect as well." |

### Aggregate Likert Scores (average of 3 participants)

| Task | Avg. Success | Avg. Intuitive |
|---|---|---|
| T1 Create a Game | 5.0 | 4.7 |
| T2 Find/Join/Leave | 5.0 | 5.0 |
| T3 Log Match Result | 4.7 | 4.3 |
| T4 Add Court Review | 5.0 | 4.3 |
| T5 Search Courts | 5.0 | 5.0 |
| T6 Gear Checklist | 5.0 | 5.0 |
| **Overall** | **5.0** | **5.0** |

---

## Prioritized List of Issues and Corresponding Changes

### Must

**Issue:** Joining/leaving a pickup game had no confirmation step, making it too easy to accidentally join or leave (P2, T2).
**Change:** Added a `confirm()` prompt before both Join and Leave in `GameFeed.jsx`.
**Priority:** Must
**Was it implemented? How?** Yes — implemented and verified end-to-end (confirm dialog blocks the action until accepted).

**Issue:** Match results only supported WIN/LOSS; no way to log a tie (P2, T3). This also exposed a latent stats bug: `losses = total - wins` would have silently counted any tie as a loss.
**Change:** Added a TIE outcome option; recomputed Win Rate as `wins / (wins + losses)`, excluding ties from the decisive-game denominator; added a "Ties" stat card.
**Priority:** Must
**Was it implemented? How?** Yes — implemented in `MatchHistory.jsx` and verified with a 1-win/1-loss/1-tie scenario (correctly shows 50% win rate).

### Should

**Issue:** Two participants independently asked for a way to see which games they've joined, without scrolling the full feed (P1, T2 and final comments).
**Change:** Added a "My Games Only" filter toggle to `GameFeed.jsx`.
**Priority:** Should
**Was it implemented? How?** Yes — toggle filters the feed to only games the current user has joined.

**Issue:** Past/expired games were still shown as joinable, with no visual distinction from upcoming games (P2, T2).
**Change:** Games whose scheduled time has passed are now greyed out with a "Past Game" badge and a disabled Join button.
**Priority:** Should
**Was it implemented? How?** Yes — implemented in `GameFeed.jsx`.

**Issue:** Court reviews were stored as a single field that any logged-in user's "Write/Update Review" action would silently overwrite — one user's review replaced another's entirely (P3, T4).
**Change:** Reworked `courts` to store a `reviews` array; each review is owned by its author, new reviews are appended rather than overwriting, and only the original author can edit or delete their own review (enforced server-side). Existing courts are normalized on read — no destructive migration was needed.
**Priority:** Should
**Was it implemented? How?** Yes — implemented in `routes/courts.js` and `CourtDirectory.jsx`; verified two different users can review the same court independently, ownership is enforced (403 on cross-user edit/delete attempts), and the average rating recalculates correctly.

### Could

**Issue:** No way to filter Match History by sport (P1, T3).
**Change:** Added a sport filter to `MatchHistory.jsx`; the stats cards now reflect the filtered sport rather than always showing all-time totals.
**Priority:** Could
**Was it implemented? How?** Yes — verified filtering to Basketball correctly recomputes Total/Wins/Losses/Ties/Win Rate for that sport only.

**Issue:** The "Add Item" input on the Gear Checklist felt cramped compared to the rest of the app (P1, T6).
**Change:** Resized `.add-item-input` to match the app-wide `.form-control` standard (was 0.85rem/4px padding, now 0.9rem/8px).
**Priority:** Could
**Was it implemented? How?** Yes — simple CSS fix.

**Issue:** Requested ability to search courts by zip code (P1, T5).
**Change:** None needed — confirmed the existing address-based search already matches zip codes, since they're embedded in the stored address string (verified: searching "02215" returns 1,004 matching courts).
**Priority:** Could
**Was it implemented? How?** N/A — already supported.

### Would (documented, not implemented — time-boxed as future work)

**Issue:** Create Game's Location field is free text; participant wanted a dropdown of verified courts from the Court Directory (P1, T1).
**Change:** Would require sourcing `/api/courts` into `CreateGame.jsx` and coupling the Games feature to Courts data.
**Priority:** Would
**Was it implemented? How?** No — deferred due to cross-feature scope and time constraints.

**Issue:** Wanted a way to contact other players or a group chat per game (P3, T1).
**Change:** Would require a messaging/contact feature, out of scope for the current timeline.
**Priority:** Would
**Was it implemented? How?** No — deferred; a lighter alternative (visible host contact info) could be a future iteration.

**Issue:** Wanted to see other participants' individual skill levels, not just the game's overall skill level (P3, T2).
**Change:** Would require adding a skill-level attribute to user profiles, which isn't currently modeled.
**Priority:** Would
**Was it implemented? How?** No — deferred, requires a schema change.

**Issue:** Wanted a "game-wise" filter on Match History, and for hosts to submit results automatically after a game (P3, T3).
**Change:** Would require linking `match_results` to a specific `game` (optional `gameId` reference) and building host-side result submission.
**Priority:** Would
**Was it implemented? How?** No — deferred, requires a schema change and cross-feature workflow.

**Issue:** Wanted a shared/auto-suggested gear checklist when creating or joining a game (P2, final comments).
**Change:** Cross-feature integration between Games and Gear Checklist.
**Priority:** Would
**Was it implemented? How?** No — deferred as a joint stretch goal with Partner B.
