### 3.2 Top Header Bar
- **Height:** [needs clarification]
- **Background:** `#ffffff`
- **Left side:** Application logo/name "DamcoWorks" [needs clarification on exact logo]
- **Right side:** User profile section showing "Kaushki Singh" with dropdown arrow `▼`
- **Border:** Bottom border separating header from content [needs clarification — color]

### 3.3 Left Navigation Sidebar
- **Background:** `#101726` (dark navy)
- **Width:** [needs clarification — estimated ~220px]
- **Items visible (top to bottom):**
  1. [Logo/Brand area at top]
  2. Navigation items (exact labels [needs clarification] — Projects is one of them)
  3. Active item has a red `#e32200` left-border indicator
  4. Active item text may be white/highlighted vs inactive (`#272b30`)
- **Bottom of sidebar:** [needs clarification — may contain settings or user profile link]

### 3.4 Main Content Area
- **Background:** `#f7f8fc`
- **Top:** Division tabs row
- **Below tabs:** KPI cards row (horizontally scrollable or wrapping)
- **Below KPI cards:** Filter toolbar row
- **Below filter toolbar:** Data table
- **Bottom:** Pagination bar

### 3.5 Detail Drawer (when open)
- Slides in from the **right side** of the viewport
- Overlays the table content (partial overlay — table is still partially visible on left)
- Has its own header with project name, close button `×`, and navigation arrows `<` `>`
- Width: [needs clarification — estimated ~50–60% of viewport]
- Tabs inside the drawer: 10 tabs (documented in Section 12)

---

## Section 4: Navigation Specification

### 4.1 Top Navigation (Division Tabs)

Located immediately below the header, above the KPI cards. These are page-level tab filters.

| Tab Label | Behavior |
|---|---|
| Technology Services | Filters table to Technology Services division projects |
| Insurance | Filters table to Insurance division projects |
| ITES | Filters table to ITES division projects |
| Marketing Services | Filters table to Marketing Services division projects |
| Salesforce | Filters table to Salesforce division projects |
| Staffing | Filters table to Staffing division projects |
| All | Shows projects from all divisions |

- **Default active tab on load:** "Technology Services"
- **Active tab style:** [needs clarification — appears underlined or highlighted with a color indicator]
- **Inactive tab style:** Plain text
- **Interaction:** Single click to switch division; table data updates immediately

### 4.2 Left Sidebar Navigation

- The left sidebar contains app-wide navigation links
- "MyProjects" (Projects) is the currently active page
- Other navigation items visible [needs clarification on full list — may include: Dashboard, Customers, Projects, Assessments, Reports, Settings]
- Active item indicated by red `#e32200` left-border highlight

### 4.3 User Profile Dropdown

- **Location:** Top-right of header
- **Trigger:** Click on the `▼` arrow next to "Kaushki Singh"
- **Items in dropdown:**
  1. **Logout** button — logs the user out of the application
- **No other items observed** in the dropdown for PMO Analyst role

---

## Section 5: Global Search Specification

### 5.1 Search Trigger

- **Location:** Filter toolbar row, positioned as a magnifying glass icon `🔍` (icon-only button initially)
- **Icon background:** `#f3f4f6`
- **Behavior:** Clicking the magnifying glass icon expands an inline search input field

### 5.2 Search Input State

- **Placeholder text:** "Please type project name here"
- **Input width:** Expands inline within the filter toolbar
- **Submit method:** Press **Enter** key (NOT on keystroke — search does NOT filter as you type)
- **Clear method:** Click the `×` chip that appears, or press Escape to collapse search bar

### 5.3 Search Result Behavior

- After pressing Enter, a filter chip appears: `Customer/Project : [search term] ×`
- The table filters to show matching rows
- Example: Typing "Agora" and pressing Enter → chip "Customer/Project : Agora ×" appears → table shows 2 rows matching "Agora"
- Clicking `×` on the chip removes the search filter

### 5.4 Search Scope

- Searches across both **Customer name** and **Project name** fields (as indicated by chip label "Customer/Project")
- Case sensitivity: [needs clarification]
- Partial match: [needs clarification — likely substring match]

### 5.5 Empty Search Result State

- [needs clarification — not tested with a term that yields 0 results]

---

## Section 6: Filter Specification

### 6.1 Filter Toolbar Overview

The filter toolbar is a horizontal row containing:
1. **All Projects / My Projects toggle** (leftmost)
2. **Active filter chips** (inline, dismissible)
3. **Clear All** button (appears when filters are active)
4. **Select DM/PDM** dropdown
5. **Search icon** (magnifying glass)
6. **Download/Export icon** (arrow-down-from-cloud or similar)
7. **Filter icon** (funnel) — opens the side filter panel

### 6.2 All Projects / My Projects Toggle

- **Location:** Leftmost item in the filter toolbar
- **States:**
  - **All Projects (ON/Blue/Active):** Shows projects from all DMs/PDMs in the selected division
  - **My Projects (OFF/Grey):** Shows only projects where the logged-in user is the DM/PDM
- **Default state on load:** All Projects = ON (active/blue)
- **Behavior:** Single click to toggle; table data updates immediately
- **Visual:** Toggle switch (pill shape), blue when "All Projects" is active, grey when "My Projects" is active

### 6.3 Active Filter Chips

- Appear inline in the filter toolbar between the toggle and the Clear All button
- Each chip shows: `[Filter Category]: [Filter Value] ×`
- Clicking `×` on a chip removes that individual filter
- Examples observed:
  - `Division: Technology Services ×`
  - `Critical Attention: Total ×`
  - `Customer/Project: Agora ×`
- Multiple chips can be active simultaneously
- **Default filter on first load:** "Critical Attention: Total ×" (pre-applied)

### 6.4 Clear All Button

- **Label:** "Clear All"
- **Location:** Appears in the filter toolbar when one or more filter chips are active
- **Behavior:** Clicking removes ALL active filter chips simultaneously (including Division chip, KPI chips, and search chips)
- **After clicking:** All chips disappear; Division tab resets to "All" state
- **Color:** `#e32200` (red/primary color) [needs clarification — may be text-only or button style]

### 6.5 Select DM/PDM Dropdown

- **Label:** "Select DM/PDM" (placeholder text)
- **Location:** Filter toolbar, right of filter chips area
- **Behavior:** Click to open a searchable dropdown list
- **Dropdown contents:**
  - Search input at top of dropdown
  - List of DM/PDM names (alphabetically ordered)
  - Names observed: Abha Tripathi, Abhinav Singh, [more names — full list needs clarification]
- **Selection behavior:** Selecting a DM/PDM filters the table to that person's projects
- **Multi-select:** [needs clarification]
- **Clear selection:** [needs clarification]

### 6.6 Column-Level Filters

Each filterable column header has a filter icon (▼ or funnel). Clicking it opens a mini filter dropdown.

#### Project Column Filter
- **Filter by:** "Select" dropdown with options:
  - Select (default/blank)
  - Customer
  - Project
  - Project Type
  - Engagement Model
- **Buttons:** Cancel | Apply
- **Behavior:** Select an option from dropdown, click Apply to filter; Cancel to dismiss without filtering

#### People Column Filter
- [needs clarification — observed but content not fully captured]

#### Overall Health Column Filter
- [needs clarification]

#### Delivery Health Column Filter
- [needs clarification]

#### Assessment Status Column Filter
- [needs clarification]

#### Delivery Thoughts Column Filter
- [needs clarification]

#### Financials Column Filter
- [needs clarification]

#### CSAT Column Filter
- [needs clarification]

#### Milestone Health Column Filter
- [needs clarification]

> NOTE: Tags column, Timeline & Contract column — filter icons presence [needs clarification]

### 6.7 Filter Panel (Side Panel)

- **Trigger:** Click the funnel/filter icon button in the filter toolbar (rightmost icon)
- **Appearance:** A panel slides in (from right or appears as an overlay) containing multiple filter sections
- **Panel Header:** [needs clarification — may have "Filters" title and close button]

#### Filter Panel Sections:

**1. Projects Yet to Start** (toggle)
- Type: Toggle switch
- Default state: ON (active) — observed as ON when panel was opened
- Behavior: When ON, includes projects that have not yet started in the results

**2. No Active Work** (toggle)
- Type: Toggle switch
- Default state: ON (active) — observed as ON when panel was opened
- Behavior: When ON, includes projects with no active work

**3. Offerings** (collapsible, expandable)
- Type: Collapsible section with `>` arrow
- Default state: Collapsed
- When expanded: Shows a multi-column checkbox grid of all available Offerings
- Full list of offerings: [needs clarification — observed as multi-column grid, many items]
- Selection: Multi-select checkboxes

**4. Geography** (collapsible)
- Type: Collapsible section
- Default state: Collapsed
- Contents: [needs clarification]

**5. Domain** (collapsible)
- Type: Collapsible section
- Default state: Collapsed
- Contents: [needs clarification]

**6. Currency** (collapsible)
- Type: Collapsible section
- Default state: Collapsed
- Contents: [needs clarification]

**7. Status** (collapsible)
- Type: Collapsible section
- Default state: Collapsed
- Contents: [needs clarification — likely: Active, Completed, On Hold, etc.]

**8. Division** (collapsible)
- Type: Collapsible section
- Default state: Collapsed
- Contents: [needs clarification — mirrors the division tabs]

#### Filter Panel Action Buttons (at the bottom of panel):

| Button Label | Style | Behavior |
|---|---|---|
| Reset to Default | Secondary (white bg, border) | Resets all filter panel selections to default state |
| Apply | Primary (`#e32200` bg, white text) | Applies selected filters and closes panel |

---

## Section 7: Sort Specification

### 7.1 Sortable Columns

The following columns have sort icons (`⇕` bidirectional arrows):

| Column | Sort Icon Location | Behavior Observed |
|---|---|---|
| Project | In column header, next to label | Clicking cycles through: Default → Ascending → Descending |
| Tags | [needs clarification] | [needs clarification] |
| People | [needs clarification] | [needs clarification] |
| Overall Health | [needs clarification] | [needs clarification] |
| Delivery Health | [needs clarification] | [needs clarification] |
| Assessment Status | [needs clarification] | [needs clarification] |
| Delivery Thoughts | [needs clarification] | [needs clarification] |
| Financials | [needs clarification] | [needs clarification] |
| CSAT | [needs clarification] | [needs clarification] |
| Milestone Health | [needs clarification] | [needs clarification] |
| Timeline & Contract | [needs clarification] | [needs clarification] |

### 7.2 Sort States

- **Default (Unsorted):** `⇕` icon (both arrows visible, neutral)
- **Ascending:** Up arrow highlighted [needs clarification on exact visual]
- **Descending:** Down arrow highlighted [needs clarification on exact visual]
- **Multi-column sort:** [needs clarification — not tested]

### 7.3 Sort Persistence

- Sort state persists while on the page [needs clarification — does it persist across navigation?]

---

## Section 8: Table / Data Grid Specification

### 8.1 Table Location

Below the filter toolbar, spanning the full width of the main content area.

### 8.2 Column Headers (Full List, Left to Right)

| # | Column Label | Has ⓘ Info Icon | Has Sort ⇕ | Has Filter ▼ | Notes |
|---|---|---|---|---|---|
| 1 | Project | No | Yes | Yes | Project name + Customer name |
| 2 | Tags | Yes | [needs clarification] | [needs clarification] | Colored tag pills |
| 3 | People | Yes | [needs clarification] | Yes | DM/PDM avatar/name |
| 4 | Overall Health | Yes | [needs clarification] | Yes | Health score + status badge |
| 5 | Delivery Health | Yes | [needs clarification] | Yes | Health score + status badge |
| 6 | Assessment Status | No | [needs clarification] | Yes | Badge + external link icon |
| 7 | Delivery Thoughts | No | [needs clarification] | Yes | Text or badge |
| 8 | Financials | Yes | [needs clarification] | Yes | Financial summary |
| 9 | CSAT | Yes | [needs clarification] | Yes | CSAT score + trend arrow |
| 10 | Milestone Health | Yes | [needs clarification] | Yes | Milestone status |
| 11 | Timeline & Contract | No | [needs clarification] | [needs clarification] | Timeline info + Contract link |

### 8.3 Column Details

#### Column 1: Project
- **Content:** Two lines — Line 1: Project Name (as a clickable link), Line 2: Customer Name
- **Project name link:** Clicking opens the project detail drawer (right-side panel)
- **Customer name:** Plain text or separate clickable link [needs clarification]
- **Width:** Widest column — fixed or auto-expanding

#### Column 2: Tags
- **Content:** Multiple colored pill/badge tags per row
- **Tag types observed:** Offering, Domain, Geography, Currency, Status
- **Tag colors:** Each tag type has a distinct background color [needs clarification — exact hex per tag type]
- **ⓘ tooltip text:** [needs clarification — tooltip was hovered but exact text not confirmed]
- **Overflow behavior:** If many tags, row height may expand or tags may overflow [needs clarification]

#### Column 3: People
- **Content:** DM/PDM name with avatar initials circle
- **Avatar:** Circular badge with initials, colored background [needs clarification on color scheme for avatars]
- **ⓘ tooltip text:** [needs clarification — tooltip was hovered, text not captured]
- **Behavior on click:** [needs clarification — may open DM profile or filter by DM]

#### Column 4: Overall Health
- **Content:** Numerical health score + colored status badge
- **Badge states:** Healthy | Caution | At Risk | N/A
- **Badge colors:** [needs clarification — approx green/amber/red/grey]
- **ⓘ tooltip text:** [needs clarification — tooltip was hovered, text not confirmed]

#### Column 5: Delivery Health
- **Content:** Similar to Overall Health — score + badge
- **Badge states:** Healthy | Caution | At Risk | N/A [needs clarification]
- **ⓘ tooltip text:** Tooltip was hovered — text: [needs clarification]

#### Column 6: Assessment Status
- **Content:** Status badge + (if applicable) an **external link icon** `↗`
- **Status badge examples observed:** [needs clarification on full list of statuses]
- **"Overdue by X day(s)" badge:** Appears when assessment is overdue — shows count of overdue days
- **External link icon behavior:** Clicking opens a new browser tab at `/DamcoWorks/Assessments?ProjectId=[ID]`
- **Tooltip on overdue badge:** [needs clarification]

#### Column 7: Delivery Thoughts
- **Content:** Text or badge indicating delivery thought/sentiment
- **Contents:** [needs clarification]

#### Column 8: Financials
- **Content:** Financial summary — likely shows burn, revenue, margin data [needs clarification]
- **"Severe Overburn" badge:** A warning badge visible on some rows, exact text: "Severe Overburn"
- **Negative Margin ⚠ icon:** A warning triangle `⚠` icon appears on rows with negative margin
  - **Tooltip on ⚠:** "Negative Margin"
- **ⓘ tooltip text:** [needs clarification]

#### Column 9: CSAT
- **Content:** CSAT score (numerical, e.g., 4.2) + trend indicator arrow
- **Trend arrows observed:**
  - `=` (flat/neutral — no change)
  - `↗` (upward trend — improving)
  - [needs clarification — downward arrow `↘` likely also exists]
- **Trend arrow tooltip text:** [needs clarification]
- **ⓘ tooltip text:** [needs clarification]

#### Column 10: Milestone Health
- **Content:** Milestone status badge or indicator
- **States:** [needs clarification]
- **ⓘ tooltip text:** [needs clarification]

#### Column 11: Timeline & Contract
- **Content:** Timeline information + "Contract" clickable link
- **"Contract" link:** Clickable; likely opens contract document or detail view [needs clarification on destination]
- **Timeline info:** May include start date, end date, remaining duration [needs clarification]

### 8.4 Row Behavior

- **Row hover state:** Background color changes on hover [needs clarification — exact hover color hex]
- **Row click behavior:** Clicking anywhere on a row opens the right-side detail drawer for that project
- **Row height:** [needs clarification — may vary based on tag count in Tags column]
- **Striping:** [needs clarification — alternating row colors or all same?]

### 8.5 Table Default State

- Default sort: [needs clarification — appears unsorted or sorted by some implicit field]
- Default filter on load: "Critical Attention: Total" pre-applied
- Default division: Technology Services tab
- Default items per page: 10

### 8.6 Empty State

- [needs clarification — not observed; unknown what is shown when no rows match]

---

## Section 9: Row Actions Specification

### 9.1 Inline Row Actions

No dedicated action column observed (no Edit/Delete/View buttons in each row). Row actions are accessed via:

1. **Clicking anywhere on the row** → Opens the **Detail Drawer** (see Section 12)
2. **Clicking the external link icon** in Assessment Status column → Opens Assessments page in new tab
3. **Clicking the "Contract" link** in Timeline & Contract column → Opens contract detail [needs clarification]
4. **Clicking the project name link** → May open project detail [needs clarification — could open drawer or navigate to project page]

### 9.2 Row Hover State

- Background color changes on hover [needs clarification — exact hex]
- No additional action buttons revealed on hover (no hover-reveal action buttons observed)

---

## Section 10: Bulk Actions Specification

### 10.1 Bulk Selection

- **No checkboxes observed** in the leftmost column of table rows
- **No "Select All" checkbox** observed in the column header
- **Conclusion:** Bulk actions do NOT appear to be available on the Projects page for the PMO Analyst role
- [needs clarification — bulk actions may exist for Admin role but were not observed]

---

## Section 11: Page-Level Actions Specification

### 11.1 KPI Cards (Top of Content Area)

Five KPI cards displayed horizontally:

#### KPI Card 1: Critical Attention
- **Label:** "Critical Attention"
- **Value:** Numerical count (e.g., 6)
- **ⓘ Tooltip text:** "Projects requiring immediate attention based on any of the following conditions: Overall Health Score ≤ 65; CSAT ≤ 3; 90+ days overdue AND amount is 50K+; These projects are classified as At Risk."
- **Click behavior:** Clicking the value applies a "Critical Attention: Total" filter chip to the table
- **Sub-labels/breakdown:** May show sub-categories (Total, etc.) [needs clarification]

#### KPI Card 2: Revenue at Risk
- **Label:** "Revenue at Risk"
- **Value:** Currency amount [needs clarification on exact value]
- **ⓘ Tooltip text:** "Total value of overdue invoices across all projects that are outstanding for more than 90 days. This represents immediate revenue collection risk and requires finance team intervention. Only invoices from the last five years are included."
- **Click behavior:** [needs clarification — may filter table by revenue at risk projects]

#### KPI Card 3: Delivery Performance Index
- **Label:** "Delivery Performance Index"
- **Value:** Percentage or index number [needs clarification]
- **ⓘ Tooltip text:** [needs clarification]
- **Click behavior:** [needs clarification]

#### KPI Card 4: Customer Confidence
- **Label:** "Customer Confidence"
- **Value:** Score or percentage [needs clarification]
- **ⓘ Tooltip text:** [needs clarification]
- **Click behavior:** [needs clarification]

#### KPI Card 5: Active Project
- **Label:** "Active Project"
- **Value:** Numerical count [needs clarification]
- **ⓘ Tooltip text:** [needs clarification]
- **Click behavior:** [needs clarification]

#### KPI Carousel Controls
- **Previous slide button** `<`: Located on left side of KPI card row — navigates to previous KPI card(s) if cards overflow viewport
- **Next slide button** `>`: Located on right side of KPI card row — navigates to next KPI card(s)
- [needs clarification — whether cards scroll/carousel or are always fully visible]

### 11.2 "Summarize This Page" Button

- **Observed in initial screenshot** but disappeared after filters were cleared
- **Label:** "Summarize This Page" [needs clarification on exact label]
- **Behavior:** [needs clarification — may trigger an AI-powered summary of current filtered data]
- **Visibility condition:** [needs clarification — may only appear under certain filter conditions]

---

## Section 12: Export Specification

### 12.1 Export Trigger

- **Location:** Filter toolbar, icon button (download/export icon — arrow pointing down from cloud or similar)
- **Icon background:** `#f3f4f6`
- **Behavior:** Single click opens a dropdown menu with export options

### 12.2 Export Dropdown Options

| Option Label | Behavior |
|---|---|
| Project Details | Downloads an export file containing project details for all current filtered rows |
| Financial | Downloads a financial data export |
| Milestone | Downloads milestone data export |
| Delivery Health | Downloads delivery health data export |

### 12.3 Export Behavior

- After clicking an export option (e.g., "Project Details"), a **loading spinner** appears briefly
- The file downloads directly to the user's browser (no modal/confirmation step)
- File format: [needs clarification — likely XLSX or CSV]
- File name: [needs clarification]
- Export scope: Appears to respect currently active filters (exports visible/filtered data, not all data) [needs clarification]

---

## Section 13: Modal & Drawer Specifications

### 13.1 Project Detail Drawer

**Trigger:** Click anywhere on a table row (or click the project name link)
**Type:** Side drawer sliding in from the right
**Width:** [needs clarification — estimated 50–60% of viewport width]
**Overlay:** Partial — table remains partially visible to the left

#### Drawer Header
- **Project name:** Displayed prominently at top of drawer [exact styling needs clarification]
- **Customer name:** Displayed below project name [needs clarification]
- **Close button:** `×` — clicking closes the drawer and returns to full table view
- **Navigation arrows:** `<` (previous project) and `>` (next project) — navigate between rows in the current table view without closing the drawer

#### Drawer Tabs (10 tabs, left to right)

| Tab # | Tab Label | Content Summary |
|---|---|---|
| 1 | Overview & Insights | High-level project summary, key insights, KPI snapshot for this project |
| 2 | People & Ownership | DM, PDM, team members, ownership details |
| 3 | Overall Health | Detailed health breakdown with scores and indicators |
| 4 | Delivery Health | Detailed delivery health metrics |
| 5 | Delivery Thoughts | Delivery team notes/comments/assessments |
| 6 | Financials | Financial details: budget, burn, revenue, margin |
| 7 | CSAT | Customer satisfaction scores over time, trend, feedback |
| 8 | Milestone Health | Milestone list with status for each |
| 9 | Timeline & Contracts | Timeline dates, contract information, contract links |
| 10 | Quality | Quality metrics and assessments |

#### Tab 1: Overview & Insights
- **Content:** [needs clarification — captured but full content not documented]
- **"Re-evaluate" button:** Visible somewhere in this drawer (exact tab location [needs clarification])
  - **Label:** "Re-evaluate"
  - **Behavior:** [needs clarification — likely triggers a re-evaluation of health scores or assessment]
  - **Click result:** [needs clarification — not tested]

#### Tab 2: People & Ownership
- **Content:** Team roster, DM/PDM assignment, client partner info [needs clarification on exact fields]

#### Tab 3: Overall Health
- **Content:** Health score breakdown, contributing factors, historical trend [needs clarification]

#### Tab 4: Delivery Health
- **Content:** Delivery health detailed view [needs clarification]

#### Tab 5: Delivery Thoughts
- **Content:** Free-text notes or structured assessment of delivery sentiment [needs clarification]

#### Tab 6: Financials
- **Content:** Budget vs actuals, burn rate, revenue, margin data [needs clarification on exact fields and formatting]

#### Tab 7: CSAT
- **Content:** Customer satisfaction score, trend chart, feedback entries [needs clarification]

#### Tab 8: Milestone Health
- **Content:** List of milestones with status (On Track / Delayed / Completed, etc.) [needs clarification]

#### Tab 9: Timeline & Contracts
- **Content:** Project start/end dates, contract type, contract links [needs clarification]
- **Contract links:** Clickable — destination [needs clarification]

#### Tab 10: Quality
- **Content:** Quality metrics, defect rates, quality assessment [needs clarification]

---

## Section 14: Tooltip Inventory

All confirmed tooltips documented here. "Needs clarification" items were hovered but text not fully captured.

| # | Element | Location | Trigger | Tooltip Text |
|---|---|---|---|---|
| 1 | Critical Attention ⓘ | KPI card | Hover | "Projects requiring immediate attention based on any of the following conditions: Overall Health Score ≤ 65; CSAT ≤ 3; 90+ days overdue AND amount is 50K+; These projects are classified as At Risk." |
| 2 | Revenue at Risk ⓘ | KPI card | Hover | "Total value of overdue invoices across all projects that are outstanding for more than 90 days. This represents immediate revenue collection risk and requires finance team intervention. Only invoices from the last five years are included." |
| 3 | Delivery Performance Index ⓘ | KPI card | Hover | [needs clarification] |
| 4 | Customer Confidence ⓘ | KPI card | Hover | [needs clarification] |
| 5 | Active Project ⓘ | KPI card | Hover | [needs clarification] |
| 6 | Tags ⓘ | Table column header | Hover | [needs clarification] |
| 7 | People ⓘ | Table column header | Hover | [needs clarification] |
| 8 | Overall Health ⓘ | Table column header | Hover | [needs clarification] |
| 9 | Delivery Health ⓘ | Table column header | Hover | [needs clarification] |
| 10 | Financials ⓘ | Table column header | Hover | [needs clarification] |
| 11 | CSAT ⓘ | Table column header | Hover | [needs clarification] |
| 12 | Milestone Health ⓘ | Table column header | Hover | [needs clarification] |
| 13 | Negative Margin ⚠ icon | Table row — Financials cell | Hover | "Negative Margin" |
| 14 | "Severe Overburn" badge | Table row — Financials cell | Hover | [needs clarification] |
| 15 | "Chronic Delays" badge | Table row — [column needs clarification] | Hover | [needs clarification] |
| 16 | CSAT trend `=` icon | Table row — CSAT cell | Hover | [needs clarification] |
| 17 | CSAT trend `↗` icon | Table row — CSAT cell | Hover | [needs clarification] |
| 18 | Assessment Status overdue badge | Table row — Assessment Status cell | Hover | [needs clarification] |
| 19 | Tag pills | Table row — Tags cell | Hover | [needs clarification] |
| 20 | External link icon | Table row — Assessment Status cell | Hover | [needs clarification] |
| 21 | Division tabs | Top tabs | Hover | [needs clarification — may have no tooltip] |
| 22 | Download/Export icon | Filter toolbar | Hover | [needs clarification] |
| 23 | Filter (funnel) icon | Filter toolbar | Hover | [needs clarification] |
| 24 | Search (magnifying glass) icon | Filter toolbar | Hover | [needs clarification] |

---

## Section 15: Notification & Feedback States

### 15.1 Loading States

- **Export download:** After clicking an export option, a brief **loading spinner** appears over the download button area before the file download initiates
- **Table data loading:** [needs clarification — a spinner or skeleton loader likely appears when filters change]
- **Drawer content loading:** [needs clarification — tabs may show loading state when switching]

### 15.2 Success States

- [needs clarification — no toast/snackbar notifications observed, but may exist for actions like Re-evaluate]

### 15.3 Error States

- [needs clarification]

### 15.4 Empty States

- **Table empty state:** [needs clarification]
- **Filter panel — no results:** [needs clarification]
- **Drawer tab — no data:** [needs clarification]

---

## Section 16: Role-Based Access Control (RBAC) Matrix

> NOTE: Only the PMO Analyst role was observed during this session. Other role behaviors are inferred or unknown.

| Feature | Admin | DM/PDM | PMO Analyst (observed) | Member | Viewer |
|---|---|---|---|---|---|
| View all projects (All Projects toggle) | Yes | Yes | Yes | [needs clarification] | [needs clarification] |
| View own projects only (My Projects toggle) | Yes | Yes | Yes | [needs clarification] | [needs clarification] |
| Open project detail drawer | Yes | Yes | Yes | [needs clarification] | [needs clarification] |
| Export data | Yes | Yes | Yes | [needs clarification] | [needs clarification] |
| Use search & filters | Yes | Yes | Yes | [needs clarification] | [needs clarification] |
| Click "Re-evaluate" in drawer | [needs clarification] | [needs clarification] | Visible (click not tested) | [needs clarification] | [needs clarification] |
| Bulk select/delete projects | Yes | [needs clarification] | Not observed | [needs clarification] | [needs clarification] |
| Edit project details | [needs clarification] | [needs clarification] | Not observed | [needs clarification] | [needs clarification] |
| Select DM/PDM filter | Yes | Yes | Yes | [needs clarification] | [needs clarification] |
| View Financials tab | Yes | Yes | Yes (observed) | [needs clarification] | [needs clarification] |
| View CSAT tab | Yes | Yes | Yes (observed) | [needs clarification] | [needs clarification] |
| Access Assessments (external link) | Yes | Yes | Yes (opens new tab) | [needs clarification] | [needs clarification] |

---

## Section 17: Edge Cases & Empty/Error States

| Scenario | Expected Behavior | Observed? |
|---|---|---|
| Search with no matching results | Show empty state message in table | Not tested |
| All filters applied with no matching projects | Show empty state message | Not tested |
| Network error during data load | Show error state | Not tested |
| Export fails | Show error notification | Not tested |
| Re-evaluate on a project | [needs clarification] | Not tested |
| Drawer navigation `>` when on last row | Arrow disabled or wraps | Not tested |
| Drawer navigation