# bench.md — DamcoWorks Bench Screen: Complete Reverse Engineering

**Session date:** 2026-03-25  
**URL:** https://damco-780-test.outsystems.app/DamcoWorks/Bench  
**Logged-in user:** Kaushki Singh — PMO Analyst  
**Roles Given to user:** DM, DW_Admin
**Total bench count at time of capture:** 210

---

## 1. LAYOUT

### Overall Structure
- Full-viewport single-page application built on OutSystems
- Left sidebar (fixed, 75px wide) + Main content area (fluid)
- Main content top-down: Topbar → Department Tabs → Summary Cards → Skills Row → Table → Pagination → Footer
- No right panel visible by default; right sidebar (500px) opens on person-name click

### Topbar
- Height: 58px
- Background: `#ffffff`
- Contains: DamcoWorks logo (top-left), navigation icons (left sidebar), user avatar + name (top-right)
- No global search bar in the topbar

### Left Sidebar
- Width: 75px
- Background: `#101726`
- Icons + label layout (icon on top, text below)
- 5 nav items: Customers, Delivery, Projects, People, Bench
- Active item (Bench): red background `#e32200`, white icon and label
- Inactive items: icon + label in `#272b30` (dark charcoal), transparent background
- Active item has red `#e32200` fill background on the icon container

### Department Tabs Row
- Background: `#ffffff`
- Border: `1px solid #dee2e6`
- Class: `filter-top-box card`
- Each tab is a `.filter-option` flex container
- **Inactive tab:** transparent background, label `#595959`, count in same color `11px`
- **Active tab (All):** background `rgba(99,102,241,0.1)` = `#6366f11a`, border `2px solid #4338ca`, class `active`
- Tab label font: 13px, `#595959`
- Count number: 11px, `#595959`
- People icon (🧑) precedes the count number in each tab

**Department Tabs visible:**
| Tab | Count | State |
|-----|-------|-------|
| Technology Services | 106 | Inactive |
| Insurance | 32 | Inactive |
| ITES | 63 | Inactive |
| Marketing Services | 0 | Inactive |
| Salesforce | 9 | Inactive |
| All | 210 | **Active** |

- Tooltip on the people-icon in each tab: `"Delivery Managers"` (dark balloon `#272b30`, white text)

### Summary Cards Row
- 4 cards in a carousel (Splide.js slider with Previous/Next slide arrows)
- Card background: `#ffffff`
- Card border: `1px solid #dee2e6`
- Previous/Next slide buttons: white background, faint border, arrows visible

### Skills Row
- Label `"Bench by Skills:"`: 13px, weight 600, `#595959`
- Scrollable horizontal chip row with scrollbar visible
- Download button (⬇ icon) at far right: triggers export

### Table
- Border: `1px solid #dee2e6`, border-radius: `4px`
- Table header background: `#f1f1f1`
- Row border-bottom: `1px solid #dee2e6`
- Hover state: needs clarification (no matching CSS hover rule found for rows)
- Row height: variable (auto, depends on content — typically 120–160px per row due to stacked data)

### Pagination Row
- "Items per page" select: options 5, 10, 15, 20, **25** (default selected), 100
- Pagination counter: `"1 to 25 of 210"` in `#6a7178`, class `pagination-counter`
- Pagination buttons: `border-radius: 8px`
  - Active page button: background `#373f50`, white text
  - Inactive page buttons: white background, `#595959` text
  - Prev/Next buttons: white background, `#595959`
- Total pages: 9 (210 records / 25 per page)

### Footer
- Background: `#494949`
- Text: `"© Damcoworks. All RightsReserved"` + links: Privacy Statement | Copyright | Terms & Conditions
- Text color: white (implied from dark background)

### Spacing
- Sidebar nav items: evenly distributed vertically, icon+label stacked center-aligned
- Summary cards: carousel with even padding
- Table cells: `padding: 4px` on HR Decision field; table cells have `border: 1px solid #dee2e6`
- Summary card inner values: `font-size: 18px`, `font-weight: 600`

---

## 2. THEME

### Colors

| Token / Use | Hex | RGB |
|-------------|-----|-----|
| Page background | `#f7f8fc` | rgb(247,248,252) |
| White (cards, table, topbar) | `#ffffff` | rgb(255,255,255) |
| Sidebar background | `#101726` | rgb(16,23,38) |
| Active nav item (Bench) | `#e32200` | rgb(227,34,0) |
| Dark charcoal (nav icons inactive) | `#272b30` | rgb(39,43,48) |
| Text secondary / labels | `#595959` | rgb(89,89,89) |
| Text primary / person name | `#000000` | rgb(0,0,0) |
| URGENT badge bg | `#c92a2a` | rgb(201,42,42) |
| CRITICAL badge bg | `#ef4444` | rgb(239,68,68) |
| MODERATE badge bg | `#fbbf24` | rgb(251,191,36) |
| Tooltip balloon bg | `#272b30` | rgb(39,43,48) |
| Active pagination button | `#373f50` | rgb(55,63,80) |
| Active department tab bg | `rgba(99,102,241,0.1)` | — |
| Active department tab border | `#4338ca` | rgb(67,56,202) |
| Green: positive margin/alloc | `#02942e` | rgb(2,148,46) |
| Red: low allocation / flag | `#ef4444` | rgb(239,68,68) |
| Aging 0–30 days | `#059669` | rgb(5,150,105) |
| Aging 31–60 days | `#d97706` | rgb(217,119,6) |
| Aging 61–90 days | `#dc2626` | rgb(220,38,38) |
| Aging >90 days | `#7f1d1d` | rgb(127,29,29) |
| Actionable bench value (blue) | `#1a79cb` | rgb(26,121,203) |
| Projected Bench Cost (red text) | `#7f1d1d` | rgb(127,29,29) |
| Forecast value (neutral) | `#4d5156` | rgb(77,81,86) |
| TBD text (italic gray) | `#858686` | rgb(133,134,134) |
| Table border | `#dee2e6` | rgb(222,226,230) |
| HR Decision dropdown border | `#bfbfbf` | rgb(191,191,191) |
| Total Bench pill border | `#4c8bf5` | rgb(76,139,245) |
| Total Bench pill bg | `#eef4ff` | rgb(238,244,255) |
| Billed text (green) | `#488f31` | rgb(72,143,49) |
| Role tag bg (T&M/FP/BYT) | `#dee2e6` | rgb(222,226,230) |
| Team Member - Developer (blue link) | `#1d4ed8` | rgb(29,78,216) |
| Skill tag in People cell | `#dee2e6` | rgb(222,226,230) |
| Skills row chip border | `#d3d3d3` | rgb(211,211,211) |
| Skills row chip bg | `#f5f5f5` | rgb(245,245,245) |
| Skills chip text | `#808080` | rgb(128,128,128) |
| Table header bg | `#f1f1f1` | rgb(241,241,241) |
| Footer bg | `#494949` | rgb(73,73,73) |
| Next 30 Days link | `#1a79cb` | rgb(26,121,203) |
| Remarks text (filled) | `#4d5156` | rgb(77,81,86) |

### Typography

| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| Person name | 13px | 600 | `#000000` |
| Employee ID / department | 12px | 400 | `#595959` |
| Employee type (Employee/Cons) | 12px | 400 | `#595959` |
| Skill tag in People cell | 12px | 400 | `#595959` |
| Bench by Skills label | 13px | 600 | `#595959` |
| Card section title (Bench Composition) | 14px | 600 | `#595959` |
| Aging values (7, 135, 0, 4) | 18px | 600 | color-coded |
| Summary card values (146, 285) | 18px | 600 | `#4d5156` / `#1a79cb` |
| Projected Monthly Cost (₹2.1L) | 18px | 600 | `#7f1d1d` |
| Table header labels | 14px | 600 | `#000000` |
| URGENT/CRITICAL/MODERATE label | 12px | 400 | `#ffffff` |
| Days count (688, 1610…) | 12px | 600 | `#000000` |
| "days" word | 12px | 400 | `#595959` |
| "Since [date]" | 12px | 400 | `#595959` |
| Project name | 12px | 600 | `#000000` |
| Team Member - Developer | 11px | 400 | `#1d4ed8` |
| T&M / FP / BYT tag | 11px | 400 | `#595959` |
| "Billed" text | 11px | 600 | `#488f31` |
| "Not Billed" text | 11px | 400 | `#595959` |
| Resource Margin % (green) | 11px | 600 | `#02942e` |
| Allocation % (green/red) | 11px | 600 | `#02942e` / `#ef4444` |
| Date range | 11px | 400 | `#595959` |
| Duration (N Month(s)) | 11px | 400 | `#595959` |
| DM: label | 12px | 400 | `#595959` |
| DM name | 12px | 600 | `#000000` |
| Monthly CTC label | 13px | 400 | `#595959` |
| CTC value (₹ X,XXX) | 12px | 600 | `#000000` |
| "NA" performance | 12px | 400 | `#000000` |
| TBD (timeline) | 12px | italic | `#858686` |
| Skills row chips | 11px | 400 | `#808080` |
| Non-Actionable label | 9px | 400 | `#595959` |
| Next 30 Days | 10px | 400 | `#1a79cb` |
| Pagination counter | 13px | 400 | `#6a7178` |

### Border Radius
- Status badges (URGENT/CRITICAL/MODERATE): `8px`
- Summary card pills (Total Bench, Employees…): `8px`
- Role tags (T&M/FP/BYT): `4px`
- Skill tag in People cell: `4px`
- HR Decision dropdown container: `0px` (rectangular)
- Modal/Popup: `8px`
- Tooltip balloon: `4px`
- Table: `4px`
- Export button area: needs clarification
- Pagination buttons: `8px`
- Cancel/Save buttons: `4px`
- Textarea in modal: `8px`

### Shadows
- Modal/Popup shadow: `rgba(0,0,0,0.1) 0px 8px 10px 0px`
- Right sidebar shadow: `rgba(0,0,0,0.1) 0px 6px 8px 0px`
- Modal backdrop: `rgba(0,0,0,0.25)`

### Icon Style
- Font Awesome icons used throughout (`fa fa-flag`, `fa fa-user`, `fa fa-1x`)
- Flag icon: `fa-flag` class, color `#ef4444` (red)
- Info icon: circle ℹ button, used in Financial Impact
- Sort icon: double vertical arrows ⬆⬇ (up/down arrow indicator)
- Filter icon: funnel/filter symbol next to column headers
- Download/Export icon: ⬇ arrow-in-box (standard download symbol)
- People icon in department tabs: outline person-group symbol

---

## 3. NAVIGATION

### Left Sidebar Items (top to bottom)
| Item | Icon | State when active |
|------|------|-------------------|
| Customers | people group icon | red bg `#e32200` |
| Delivery | delivery/truck icon | red bg |
| Projects | project/grid icon | red bg |
| People | single person icon | red bg |
| **Bench** | bench/person-on-bench icon | **red bg `#e32200`** — currently active |

- Active state: red `#e32200` background on icon area, white label
- Inactive state: dark icon in `#272b30`, white/light label

### Department Tabs (top of main content)
| Tab | Count | Notes |
|-----|-------|-------|
| Technology Services | 106 | — |
| Insurance | 32 | — |
| ITES | 63 | — |
| Marketing Services | 0 | Zero-count tab visible |
| Salesforce | 9 | — |
| All | 210 | **Active by default**, highlighted with indigo border/bg |

- Tooltip on people-icon beside count: `"Delivery Managers"` — indicates the icon represents DMs, not headcount
- Clicking a tab filters the table and summary cards to that division
- Zero-count tab (Marketing Services 0) is still visible and clickable

---

## 4. SUMMARY CARDS

### Bench Composition Card (1 of 4)
Title: **"Bench Composition"** — 14px, weight 600, `#595959`

**Main metric row:**
- `Total Bench 210` — pill with blue border `#4c8bf5`, bg `#eef4ff`, border-radius `8px`, clickable link → filters table
- `Employees 146` — pill with grey border `#dddddd`, bg `#fafafa`
- `Cons (Retainer) 47` — same pill style
- `Cons (T&M) 4` — same pill style

**Non-Actionable sub-row** (9px, `#595959`):
- Label: "Non-Actionable (Included Above)"
- `Maternity 2` | `Notice 3` | `Parked 10` | `Long Leave 0` — all clickable pills

### Financial Impact Card (2 of 4)
Title: **"Financial Impact"**

| Metric | Value | Color |
|--------|-------|-------|
| Actionable Bench ℹ | 146 | `#1a79cb` (blue), 18px bold |
| Projected Monthly Bench Cost ℹ | ₹2.1L | `#7f1d1d` (dark red), 18px bold |

- Left accent bar: blue vertical bar on left edge of Actionable Bench
- **Actionable Bench ℹ tooltip:** `"Excl. Parked, Const (T&M), Maternity, Notice, and Long Leave"` — dark balloon `#272b30`, white text
- **Projected Monthly Bench Cost ℹ tooltip:** `"Actionable Only"` — same dark balloon

### Current Bench Aging Card (3 of 4)
Title: **"Current Bench Aging"**

| Bracket | Count | Color |
|---------|-------|-------|
| 0–30 Days | 7 | `#059669` (emerald green) |
| 31–60 Days | 135 | `#d97706` (amber/orange) |
| 61–90 Days | 0 | `#dc2626` (red) |
| >90 Days | 4 | `#7f1d1d` (dark maroon) |

- All counts: 18px, weight 600
- Each is a clickable link that filters the table

### Forecast Card (4 of 4)
Title: **"Forecast"**

| Metric | Value | Color |
|--------|-------|-------|
| Future Bench | 285 | `#4d5156` (neutral gray), 18px bold |
| Next 30 Days | (link) | `#1a79cb` (blue), 10px |

---

## 5. SKILLS ROW

- Label: `"Bench by Skills:"` — 13px, weight 600, `#595959`
- Horizontally scrollable row with scroll indicator bar at bottom
- Each chip: link element with border `1px solid #d3d3d3`, bg `#f5f5f5`, border-radius `10px`, padding `3px 6px`, font 11px, color `#808080`
- Clicking a chip filters the table to show only people with that skill

**All visible skills with counts:**
1. AI/ML (2)
2. Blockchain (1)
3. Business Analysis (Insurance) (7)
4. Business Analysis (Technology Services) (1)
5. Cloud Infrastructure and Security (2)
6. Data Engineering (8)
7. Data Processing (63)
8. Data Visualization (9)
9. Database Admin (1)
10. Delivery Management (1)
11. IBM iSeries (2)
12. JAVA (6)
13. Javascript (10)
14. Low Code Tools (1)
15. Microsoft Dev (Insurance) (16)
16. Microsoft Dev (Technology Services) (17)
17. Mobile (6)
18. MS Business Apps (4)
19. Mule (2)
20. Node (1)
21. Outsystems (7)
22. PHP (6)
23. Product Management (Insurance) (1)
24. Python (5)
25. QA & Testing (Insurance) (8)
26. QA & Testing (Technology Services) (12)
27. Rapadit (1)
28. RPA (1)
29. Salesforce (9)
30. (more chips cut off — scrollable)

**Download Button (Export):** ⬇ icon, positioned at the far right end of the Skills row, same line. Clicking it triggers the export flow — a blue toast appears: `"Please wait while your sheet is being prepared."` — sheet/Excel download initiated.

---

## 6. GLOBAL SEARCH

**There is NO global search bar on the Bench page.**

The topbar header contains only the DamcoWorks logo, left sidebar nav, and user avatar with name/role. No search input, search icon, or search placeholder is present in the page header or above the table.

The only search-like functionality is the People column filter (funnel icon), which opens a dropdown allowing search by "People" name or "Emp Code".

---

## 7. FILTERS

### Department Tab Filters (top)
- Clicking any department tab (Technology Services, Insurance, ITES, Marketing Services, Salesforce, All) filters the entire page (summary cards + table)
- Active tab shown with indigo highlight

### Skills Row Chip Filters
- Clicking any skill chip filters the table to show only people with that primary skill
- Multiple chips can be selected (behavior: needs clarification on multi-select)
- Scrollable row — more chips hidden to the right

### People Column Filter (funnel icon ▼)
- Triggered by clicking the funnel icon (🔽) next to "People ⬆⬇" in the table header
- Opens a small dropdown panel inline below the column header
- Contains:
  - **Dropdown select:** options `"People"` and `"Emp Code"` (filter by person name or employee code)
  - **Text input:** blank, no placeholder — type to search
  - **Cancel** button: white bg, `#dee2e6` border, black text, `4px` border-radius
  - **Apply** button: `#e32200` red bg, white text, `4px` border-radius
- Pressing Escape or clicking Cancel dismisses filter panel without changes
- Clicking Apply applies the filter

### No Other Column Filters Visible
- Attention Status, Last Project, Performance Rating, HR Decision, Context/Remarks, Timeline columns have no filter icons
- Only **People** column has both sort (⬆⬇) and filter (funnel) icons

### Clear Filters
- No explicit "Clear Filters" button observed on the Bench page (unlike the Customer_List page which has one)

---

## 8. SORTING

### Sortable Columns
| Column | Sortable | Default Sort | Sort Indicator |
|--------|----------|--------------|----------------|
| People | ✅ Yes | Descending by bench days (longest first) | ⬆⬇ double arrow icon |
| Attention Status | ❌ No visible sort icon | — | — |
| Last Project | ❌ No visible sort icon | — | — |
| Performance Rating | ❌ No visible sort icon | — | — |
| HR Decision | ❌ No visible sort icon | — | — |
| Context / Remarks | ❌ No visible sort icon | — | — |
| Timeline | ❌ No visible sort icon | — | — |

- **Default sort:** Bench days descending (highest bench days first — URGENT >90d cases at top)
- **Sort indicator style:** Up/down double arrow icon (⬆⬇) next to column label, always visible for People column
- **Clicking once:** Sorts ascending (A→Z alphabetical by person name)
- **Clicking again:** Returns to default (or descending)
- Sort and filter icon both visible in People column header simultaneously

---

## 9. TABLE

### Column Headers
| # | Column | Span | Notes |
|---|--------|------|-------|
| 1 | People ⬆⬇ 🔽 | Single | Sortable + filterable |
| 2 | Attention Status | Single | No sort/filter |
| 3 | Last Project | Single | No sort/filter |
| 4 | Performance Rating | Single | No sort/filter |
| 5–7 | Action Plan & Remarks | Grouped header spanning 3 sub-columns | Italic, `#595959` |
| 5a | HR Decision | Sub-column | — |
| 5b | Context / Remarks | Sub-column | — |
| 5c | Timeline | Sub-column | — |

- **"Action Plan & Remarks"** is a super-header (colspan 3), italic, `#595959`, centered
- Table header background: `#f1f1f1`
- Header font: 14px, weight 600, `#000000`
- Table border: `1px solid #dee2e6`, border-radius `4px`

### Data Types Per Column
| Column | Data Type |
|--------|-----------|
| People | Person name (link) + ID + division + type + skill tag |
| Attention Status | Badge + days count + since-date |
| Last Project | Project name + role badge + billing tags + margin box + alloc box + DM name + date range + duration |
| Performance Rating | Monthly CTC value (+ optional flag) + Performance label + value or "NA" (+ flag) |
| HR Decision | Dropdown select (custom anchor-based) |
| Context / Remarks | Editable textarea (inline) |
| Timeline | Text display "TBD" or date value |

### Row Borders
- `border-bottom: 1px solid #dee2e6` between rows
- No striped rows

---

## 10. ROW ANATOMY

Each row is a full-height multi-cell grid row. Below is the complete anatomy per column:

### Column 1 — People
```
[Person Full Name]  ← 13px, weight 600, #000000, clickable link → opens profile modal
[EmpCode] | [Division]  ← 12px, #595959
[Employee Type]  ← 12px, #595959
  values: "Employee" | "Cons(T&M)" | "Cons(Retainer)"
[Primary Skill Tag]  ← chip: bg #dee2e6, border-radius 4px, 12px, #595959
  e.g. "Microsoft Dev (Technology Services)", "Mobile", "QA & Testing (Insurance)"
```

### Column 2 — Attention Status
```
┌─────────────────────────────┐
│  [STATUS BADGE]             │  ← Pill, border-radius 8px, 12px text, white
│  > 90d / 61-90d / 31-60d   │  ← Sub-label inside badge
└─────────────────────────────┘
  [NNN] days                   ← Bold count + "days" label, 12px
  Since [Mon DD, YYYY]         ← 12px, #595959
```

**Badge styles:**
- `URGENT > 90d`: bg `#c92a2a`, white text
- `CRITICAL 61-90d`: bg `#ef4444`, white text
- `MODERATE 31-60d`: bg `#fbbf24`, white text
- Badge for 0–30d: not observed in current dataset (needs clarification if "LOW" or "WATCH" label exists)

### Column 3 — Last Project
```
[Project Name]  ← 12px, weight 600, #000000
[Team Role]  ← 11px, #1d4ed8 (blue link style)
  e.g. "Team Member - Developer"

[Engagement Type Tag]  ← chip: bg #dee2e6, 4px radius, 11px, #595959
  values: "T&M" | "FP" | "BYT" | "-" (if none)

[Billing Status]  ← 11px
  "Billed" → weight 600, #488f31 (green)
  "Not Billed" → #595959

┌──────────────┬───────────────┐
│ Resource      │  Allocation:  │  ← labels: 12px, #595959
│ Margin:       │               │  ← border: 1px solid #bfbfbf
│ [value]%      │  [value]%     │  ← border-radius 4px
└──────────────┴───────────────┘
  Margin/Allocation value colors:
    - Positive margin (≥15%): #02942e (green, weight 600)
    - Low/negative: #ef4444 (red, weight 600)
    - "NA": #595959 plain

DM:  [DM Full Name]  ← label 12px #595959; name 12px weight 600 #000000

[MMM DD, YYYY - MMM DD, YYYY]  ← date range, 11px, #595959
([N Month(s)])  ← duration, 11px, #595959

Edge case — No Project Assigned (Soumya Prakash Mondal):
  Shows "-" for project name, "-" for role, no tags, "0%" margin and "0%" alloc (red), DM: "-", "(0 Month(s))"
```

### Column 4 — Performance Rating
```
Monthly CTC  ← label 13px, #595959
₹ [X,XXX]   ← 12px, weight 600, #000000
  [🚩 flag if CTC = 0] ← red flag icon #ef4444
    Tooltip on flag: "Data Not Available (Missing CTC)"

Performance  ← label 13px, #595959
[value] or NA  ← 12px, #000000
  [🚩 flag always shown when NA] ← red flag icon #ef4444
    Tooltip on flag: "Data Not Available (Missing Rating)"
```

### Column 5a — HR Decision
```
[Custom Dropdown]  ← anchor element, border 1px solid #bfbfbf, height ~28px, width ~186px
  Placeholder: "Select HR Decision"
  Or shows selected value: e.g. "Long Leave/Sabbatical"
  Chevron icon (▼) on right side
  Clicking → opens "Update Action Plan" modal (see Section 19)
```

### Column 5b — Context / Remarks
```
[Inline text area / link]  ← clickable anchor
  Empty state: blank rectangle with light bg #f3f4f6
  Filled: shows truncated text in #4d5156, 12px
  Clicking → opens "Update Action Plan" modal
  Example: "Processing his January amount this time. T&M Consultant...."
           "Maternity Leave"
           "First invoice is yet to come."
```

### Column 5c — Timeline
```
TBD  ← italic, 12px, #858686
  (or actual date if set)
  Clicking → opens "Update Action Plan" modal
```

---

## 11. ATTENTION STATUS

### Badge Style
- Shape: rounded rectangle, border-radius `8px`
- Padding: `2px 20px`
- Font size: 12px, weight 400, color white `#ffffff`
- Width: auto (text-driven)
- Contains TWO lines of text:
  - Line 1: Status label (URGENT / CRITICAL / MODERATE)
  - Line 2: Threshold label (> 90d / 61-90d / 31-60d)

### Status Levels and Colors
| Status | Threshold | Badge BG | Text Color |
|--------|-----------|----------|------------|
| URGENT | > 90d | `#c92a2a` | white |
| CRITICAL | 61–90d | `#ef4444` | white |
| MODERATE | 31–60d | `#fbbf24` | white |
| (0–30d status) | 0–30d | needs clarification | — |

### Days Counter Format
```
[NNN] days
Since [Mon DD, YYYY]
```
- `NNN` = bold numeric value (e.g. `688`, `1610`, `205`, `114`)
- "days" = 12px, `#595959` weight 400
- "Since [date]" = 12px, `#595959`

### Observed Values in Dataset
- 688 days since May 06, 2024
- 1610 days since Oct 27, 2021 (longest on bench — edge case >365 days)
- 205 days since Sep 01, 2025
- 114 days since Dec 01, 2025
- 212 days since Aug 25, 2025
- 193 days since Sep 13, 2025
- 149 days since Oct 27, 2025
- 37 days since Feb 16, 2026

---

## 12. LAST PROJECT COLUMN

### Full Anatomy
```
[Project Name]
  → 12px, weight 600, #000000
  → Appears as plain text (NOT a hyperlink in table)
  → Can be empty (shows "-") if no last project

[Role Badge]
  → "Team Member - Developer" (most common)
  → 11px, #1d4ed8 (blue, link-styled)
  → No background / border on this element itself

[Engagement Type Tags] + [Billing Tag] — on same row
  Engagement Type: chip bg #dee2e6, border-radius 4px, 11px #595959
    Values: "T&M" | "FP" | "BYT"
    Missing when no project: shows "-"
  Billing:
    "Billed" → 11px, weight 600, #488f31 (green)
    "Not Billed" → 11px, #595959
    Missing tag row: shows "-   -  Not Billed"

[Margin / Allocation Box]
  Two-cell mini-grid:
  ┌───────────────────┬──────────────────┐
  │ Resource Margin:  │   Allocation:    │
  │   [value]%        │   [value]%       │
  └───────────────────┴──────────────────┘
  Border: 1px solid #bfbfbf, border-radius 4px
  Labels: 12px #595959
  Value colors:
    ≥ positive threshold: #02942e green, weight 600
    Low (e.g. 5%, 0%): #ef4444 red, weight 600
    "NA": #595959
  Examples: 30%, 18%, 100%, 5% (red), NA, 0% (red)

[DM line]
  "DM:" [DM Name]
  Label: 12px #595959
  Name: 12px weight 600 #000000
  "-" when no DM assigned

[Date Range]
  [MMM DD, YYYY - MMM DD, YYYY]
  11px, #595959
  "-" when no project

[(N Month(s))]
  11px, #595959
  "(0 Month(s))" when duration is less than a month or no project
```

### Billing Tag Types Observed
| Tag | Background | Color | Example rows |
|-----|-----------|-------|--------------|
| T&M | `#dee2e6` | `#595959` | Shishant Dixit, Hitakshi Soma |
| FP | `#dee2e6` | `#595959` | Ajit Jain, Manoj Gupta Bondada |
| BYT | `#dee2e6` | `#595959` | Jaidev Bangar, Aman Bhagirath |
| (none) | — | — | Mrutyunjay Sahu (Not Billed) |

---

## 13. PERFORMANCE COLUMN

### Layout
Monthly CTC      ← sub-label, 13px, #595959
₹ X,XXX          ← value, 12px, weight 600, #000000
[🚩]              ← red flag if CTC = ₹0 (missing data)
Performance      ← sub-label, 13px, #595959
[value] or NA    ← 12px, #000000
[🚩]              ← red flag always shown when NA

### CTC Format
- Symbol: `₹` (Indian Rupee)
- Format: `₹ X,XXX` — space between ₹ and number, comma as thousands separator
- Examples: `₹ 1,187` | `₹ 0` | `₹ 2,095` | `₹ 2,500` | `₹ 833` | `₹ 475`
- Zero CTC (₹ 0): displays normally but with a red 🚩 flag icon appended

### Flag Icon
- Icon: Font Awesome `fa-flag`, class `icon color-flag-red fa fa-flag fa-1x`
- Color: `#ef4444` (red)
- Tooltip (hover): `"Data Not Available (Missing CTC)"` — for CTC flag
- Tooltip (hover): `"Data Not Available (Missing Rating)"` — for Performance flag
- Tooltip style: dark balloon `#272b30`, white text, border-radius `4px`, padding `8px`

### Performance Value
- Shows `NA` when no rating data (all observed rows show NA)
- `NA` text: 12px, class `black-600`, color `#000000`
- Flag: always present alongside NA

---

## 14. ACTION PLAN COLUMNS

### 14a — HR Decision (Dropdown)
- Element: `<a href="#">` with class `edit-container full-width display-flex justify-content-space-between`
- Border: `1px solid #bfbfbf`, height `28px`, width `~186px`
- Inner: `<span>` showing current value or placeholder
- Placeholder text: `"Select HR Decision"` in `#595959`
- Chevron `▼` icon on right
- Background: transparent

**Full dropdown options (from modal):**
1. Select HR Decision *(placeholder)*
2. Project Identified/Yet to be started
3. Extension Expected
4. Project Ramp-down/Closure
5. Internal Redeployment/Additional Support
6. Performance Concern & PIP
7. Bench Resource
8. Long Leave/Sabbatical
9. Partial Allocation
10. Resigned

- Clicking the dropdown cell opens the **"Update Action Plan" modal** (not an inline dropdown)

### 14b — Context / Remarks (Textarea)
- Displayed inline in the table as a light-colored rectangle
- Background: `#f3f4f6` (light gray)
- Empty state: blank rectangle
- Filled state: shows truncated text, `#4d5156`, 12px
- Clicking opens the **"Update Action Plan" modal**

### 14c — Timeline
- Displays `TBD` as italic text, 12px, `#858686`
- Positioned right-aligned in the cell
- Clicking opens the **"Update Action Plan" modal**
- (No timeline values other than "TBD" observed in current dataset)

---

## 15. ROW ACTIONS

### Always-Visible Actions
- **People name** (column 1): always clickable link → opens profile modal/drawer
- **HR Decision dropdown** (column 5a): always clickable → opens Update Action Plan modal
- **Context/Remarks area** (column 5b): always clickable → opens Update Action Plan modal
- **Timeline field** (column 5c): always clickable → opens Update Action Plan modal

### No hover-only action buttons observed
- No edit/delete/view icon buttons that appear on row hover
- No row-level action menu (…)
- All interactions are through the always-visible inline column elements

---

## 16. BULK ACTIONS

**No bulk selection checkboxes or bulk action buttons are visible on the Bench page.**
- No "Select All" checkbox in table header
- No individual row checkboxes
- No bulk delete, bulk assign, or bulk export per-row selection
- Export is page-level only (all records, not selected rows)

---

## 17. EXPORT

### Button
- Position: Far right end of the **Skills Row** (top of the table area, same horizontal line as skill chips)
- Icon: ⬇ (downward arrow in a tray — standard download icon)
- Background: white/light, no visible border ring
- No text label — icon only

### Behavior
- Single click → shows blue toast banner at top of page:
  - Text: `"Please wait while your sheet is being prepared."`
  - Toast background: blue (approximately `#1d4ed8` or similar) with white text and ℹ info icon
  - Toast appears center-top, then auto-dismisses
  - File is prepared server-side and downloaded automatically
- Format: Excel/spreadsheet (sheet format