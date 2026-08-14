# CourtSide — Usability Study Materials (Whole App)

**Author:** Harini Thirunavukkarasan (shared study — reusable by Wu Hung Hsiao for his own report)
**Scope:** All four features — Find/Create/Join/Leave Games, Match History, Court Directory, Gear Checklist
**Timing:** Run on the **current** app, before the design/accessibility pass. Findings here directly inform which design and accessibility fixes to prioritize next.

Use this file as source material for the Usability Study Report template. Everything below is ready to copy in directly.

---

## 1. Application Scope (for the report template)

**Application description:**
CourtSide is a full-stack web app for recreational sports players. It lets users organize and join pickup games, track personal match performance over time, discover and review local sports courts, and manage packing checklists for their gear.

**Users – Target audience:**
- **Alex (The Social Athlete)** — 24, recently moved to Boston, plays pickup basketball, wants to find games at his skill level without messy group-chat coordination.
- **Taylor (The Competitive Tracker)** — 28, plays tennis and pickleball multiple times a week, wants to log every score and outcome to track a personal win rate over time.
- **Jordan (The Community Recommender)** — 35, pickleball enthusiast, wants to recommend and rate local courts so other players can find good places to play.
- **Morgan (The Forgetful Player)** — 22, busy college student, wants a simple pre-game checklist so she doesn't forget gear before rushing to a game.

**Data description:**
The app stores and displays, in four MongoDB collections:
- **games** — sport, date/time, skill level, host, location, max players, current participants
- **match_results** — sport, date, score, WIN/LOSS outcome, linked to a user
- **courts** — name, address, sport, star rating, written review
- **checklists** — a title and a list of gear items with checked/unchecked state, linked to a user

All data is fetched and updated live through a Node/Express REST API from a React frontend.

**Main tasks – use cases:**
- **T1** — Create a new pickup game for a specific sport, date/time, skill level, and location. *(Partner A)*
- **T2** — Find, join, and then leave a pickup game matching a specific sport and skill level. *(Partner A)*
- **T3** — Log a match result and verify the win rate updates correctly. *(Partner A)*
- **T4** — Add a review and rating for a sports court. *(Partner B)*
- **T5** — Search and filter the court directory to find a specific type of court. *(Partner B)*
- **T6** — Create a gear checklist, add an item, and check off a packed item. *(Partner B)*

---

## 2. Moderator Script (read to each participant)

### Introduction (read verbatim)
> "Hi [Name], thanks so much for helping me out today. I'm testing an app called CourtSide that helps people find pickup sports games, track match results, discover courts, and manage packing checklists. This should take about 25–35 minutes.
>
> Before we start — is it okay if I record your screen and audio for this session?" *(wait for verbal consent)*
>
> "Great, thank you. A couple of things to keep in mind: I'm testing the app, not you — there's no wrong way to do this, and if something feels confusing or hard to find, that's exactly the kind of feedback I need. Please think out loud as you go: tell me what you're looking at, what you expect to happen, and what you're trying to do next.
>
> You can stop or take a break at any time, no questions asked. And I'd like you to imagine you're someone who plays pickup sports regularly — try to approach this the way that person would, not as someone testing software."

### Script for intuitiveness (initial approach)
> "Before I give you any specific tasks, I'm going to open the homepage. Take about 30 seconds just to look around — and as you do, tell me out loud what you think this app is for, and what you'd click on first."

*(Do not name buttons or pages. Just observe where they go and what they say.)*

### Script for T1 — Create a Pickup Game
> "Imagine you just moved to a new city and want to play basketball tomorrow evening with people around your skill level. Using CourtSide, set up a game for other players to join."

### Script for T2 — Find, Join, and Leave a Game
> "Now imagine you consider yourself an advanced tennis player and you're looking for a match. Find a tennis game that fits an advanced skill level and join it. Then — imagine your plans changed and you can no longer make it — undo that and leave the game."

### Script for T3 — Log a Match Result
> "Let's say you played a basketball game last night and won 21 to 16. Log that result in the app, and tell me what your win rate shows after you've added it."

### Script for T4 — Add a Court Review
> "Imagine you just played at a great new court and want other players to know about it. Add that court to the directory with a rating and a short review."

### Script for T5 — Search the Court Directory
> "Now imagine you're looking specifically for a pickleball court. Use the app to find one."

### Script for T6 — Gear Checklist
> "Imagine you have a basketball game coming up and want to make sure you don't forget anything. Create a checklist for it, add one item to it, and check off an item as if you'd already packed it."

---

## 3. Google Form — Sections & Questions

Create one Google Form with the sections below. Keep every question optional / offer "Prefer not to answer" on demographics.

### Section 1 — Demographics
1. What is your age range? *(Under 18 / 18–24 / 25–34 / 35–44 / 45–54 / 55+ / Prefer not to answer)*
2. How often do you play recreational or pickup sports? *(Never / A few times a year / Monthly / Weekly / Multiple times a week / Prefer not to answer)*
3. How comfortable are you using new apps or websites in general? *(1 = Not at all comfortable — 5 = Very comfortable)*
4. Have you used an app to find sports games, log workouts, review venues, or track match results before? *(Yes / No / Not sure)*
   - If yes, which app(s)? *(open text, optional)*

### Section 2 — Task 1: Create a Pickup Game
5. I was able to successfully create a pickup game. *(1 = Strongly Disagree — 5 = Strongly Agree)*
6. Creating a game felt easy and intuitive. *(1–5)*
7. Any comments about this task? *(open text, optional)*

### Section 3 — Task 2: Find, Join, and Leave a Game
8. I was able to successfully find, join, and then leave a game matching the criteria. *(1–5)*
9. Finding, joining, and leaving a game felt easy and intuitive. *(1–5)*
10. Any comments about this task? *(open text, optional)*

### Section 4 — Task 3: Log a Match Result
11. I was able to successfully log a match result and see my updated win rate. *(1–5)*
12. Logging a result felt easy and intuitive. *(1–5)*
13. Any comments about this task? *(open text, optional)*

### Section 5 — Task 4: Add a Court Review
14. I was able to successfully add a court with a rating and review. *(1–5)*
15. Adding a court review felt easy and intuitive. *(1–5)*
16. Any comments about this task? *(open text, optional)*

### Section 6 — Task 5: Search the Court Directory
17. I was able to successfully find a court matching what I was looking for. *(1–5)*
18. Searching the court directory felt easy and intuitive. *(1–5)*
19. Any comments about this task? *(open text, optional)*

### Section 7 — Task 6: Gear Checklist
20. I was able to successfully create a checklist, add an item, and check one off. *(1–5)*
21. Managing the checklist felt easy and intuitive. *(1–5)*
22. Any comments about this task? *(open text, optional)*

### Section 8 — Overall
23. Overall, the app was effective for what I was trying to do. *(1–5)*
24. Overall, the app was easy and intuitive to use. *(1–5)*
25. Do you have any final comments or suggestions for improvement? *(open text, optional)*

---

## 4. Recording setup checklist
- [ ] Screen recording tool ready (e.g., QuickTime, OBS, Zoom local recording)
- [ ] Microphone tested for think-aloud audio
- [ ] Consent script read and verbal "yes" captured on the recording itself
- [ ] Google Form link ready to send immediately after each session
- [ ] Participant's device/browser noted (for reproducing any bugs found)
- [ ] App reset to a clean, known state before each session (e.g., a fresh test account) so tasks are reproducible across participants

---

## 5. After each session
Per the report template: immediately after each participant leaves, jot down what you remember before rewatching anything. Then rewatch the recording specifically looking for moments of hesitation, confusion, or frustration — those become your "Detailed notes" entries and feed the "Prioritized list of issues" section.

Since this study runs **before** the design/accessibility pass, the issues you log here should become the actual input to that next phase — prioritize them (Must/Should/Could/Would), then note in the report which ones you fixed and how.
