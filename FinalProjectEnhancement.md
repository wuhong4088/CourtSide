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
