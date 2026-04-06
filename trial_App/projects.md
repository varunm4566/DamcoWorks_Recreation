

- **Sidebar**: 75px wide, fixed left, full height
- **Topbar**: 58px tall, full width, fixed top
- **Main content area**: starts at x=75px, y=58px
- **Right drawer panel**: slides in from right edge (full height, ~75% viewport width) when clicking a project row
- **Footer**: fixed at bottom, `background: rgb(73, 73, 73)`, full width

### Grid/Column Structure
- Division tab bar: horizontal row of clickable tabs
- KPI area: single-row carousel of 5 cards
- Filter bar: single flex row
- Data table: standard HTML table with sticky first column, horizontal scroll

---

## 2. THEME & VISUAL DESIGN

### Color Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-primary` | `#E32200` | `rgb(227, 34, 0)` | Primary brand, buttons, active nav item, active tab underline, Clear All button |
| `--color-sidebar-bg` | `#101726` | `rgb(16, 23, 38)` | Left sidebar background |
| `--color-topbar-bg` | `#FFFFFF` | `rgb(255, 255, 255)` | Topbar / header background |
| `--color-page-bg` | `#F7F8FC` | `rgb(247, 248, 252)` | Main page background |
| `--color-card-bg` | `#FFFFFF` | `rgb(255, 255, 255)` | Card / table row background |
| `--color-card-border` | `#DEE2E6` | `rgb(222, 226, 230)` | Card border |
| `--color-table-header-bg` | `#F1F1F1` | `rgb(241, 241, 241)` | Table sticky column header |
| `--color-text-primary` | `#181818` | `rgb(24, 24, 24)` | Primary text |
| `--color-text-secondary` | `#595959` | `rgb(89, 89, 89)` | Secondary/body text |
| `--color-text-dark` | `#27282B` (approx) | `rgb(39, 43, 48)` | Dark body text, filter icon |
| `--color-text-user-name` | `#35353A` | `rgb(53, 53, 58)` | Topbar username |
| `--color-border-light` | `#D9D9D9` | `rgb(217, 217, 217)` | Filter chip border |
| `--color-border-medium` | `#DEE2E6` | `rgb(222, 226, 230)` | Card/filter box border |
| `--color-tooltip-bg` | `#272B30` | `rgb(39, 43, 48)` | Tooltip background |
| `--color-tooltip-text` | `#FFFFFF` | `rgb(255, 255, 255)` | Tooltip text |
| `--color-footer-bg` | `#494949` | `rgb(73, 73, 73)` | Footer background |

### Status Badge Colors

| Status | Background | Text Color | Border Radius |
|--------|-----------|------------|---------------|
| **Healthy** | `#DCFFE3` `rgb(220, 255, 227)` | `rgb(0, 0, 0)` | `20px` (pill) |
| **Caution** | `#FFF6EA` `rgb(255, 246, 234)` | `rgb(0, 0, 0)` | `20px` (pill) |
| **At Risk** | `#FFE0DD` `rgb(255, 224, 221)` | `rgb(0, 0, 0)` | `20px` (pill) |
| **Severe Overburn** | `#FFE0DD` `rgb(255, 224, 221)` | `#E32200` `rgb(227, 34, 0)` | `4px` |
| **Overdue** (assessment pill) | `#FEE2E2` `rgb(254, 226, 226)` | `#B91C1C` `rgb(185, 28, 28)` | `8px` |
| **No Work** | `#F1F1F1` `rgb(241, 241, 241)` | `rgb(0, 0, 0)` | `4px` |
| **Active** | `#DCFFE3` `rgb(220, 255, 227)` | `rgb(0, 0, 0)` | `20px` (pill) |

### Health Score Dot Colors (fa-circle icon)
| Score Range | Status | Color |
|-------------|--------|-------|
| ≥ 85 | Healthy | `rgb(72, 143, 49)` (green) |
| 60–84 | Caution | `rgb(247, 103, 7)` (orange) |
| 0–59 | At Risk | `rgb(227, 34, 0)` (red) |

### Tag Pill Colors (Colored `<span class="color-tag">`)
| Tag Type | Background | CSS Class |
|----------|-----------|-----------|
| Offering | `#DEF9FF` `rgb(222, 249, 255)` | `bg-blue-cyan` |
| Domain | `#F6DAFF` `rgb(246, 218, 255)` | `bg-purple-pink` |
| Geography | `#E5EBFE` `rgb(229, 235, 254)` | `bg-blue-light` |
| Currency | `#FFF6EA` `rgb(255, 246, 234)` | `bg-orange-light` |
| Status (Active) | `#DCFFE3` `rgb(220, 255, 227)` | `bg-green-light` |
| Status (At Risk badge) | `#FFE0DD` `rgb(255, 224, 221)` | `bg-pink-light` |

All color tags: `border-radius: 20px`, `padding: 2px 8px`, `font-size: 12px`

### Division Tab Colors
| State | Background | Border |
|-------|-----------|--------|
| **Active** | `rgba(99, 102, 241, 0.1)` (light indigo) | `2px solid rgb(67, 56, 202)` (indigo) |
| **Inactive** | `transparent` | none |

### KPI Slide Colors
| State | Background | Border |
|-------|-----------|--------|
| **Active slide** | `rgb(238, 242, 255)` | `2px solid rgb(99, 102, 241)` |
| **Inactive slide** | `rgb(255, 255, 255)` | `1px solid rgb(222, 226, 230)` |

All KPI cards: `border-radius: 8px`

### SPI / CPI / Variance Value Colors
| Value | Color |
|-------|-------|
| > 1.0 (good) SPI | `rgb(55, 178, 77)` green |
| < 1.0 (bad) SPI | `rgb(227, 34, 0)` red |
| CPI bad (-1) | `rgb(227, 34, 0)` red |
| Variance (overburn) | `rgb(227, 34, 0)` red |
| Margin positive | `rgb(55, 178, 77)` green, `font-size: 14px`, `font-weight: 600` |
| Margin negative | `rgb(227, 34, 0)` red, `font-size: 14px`, `font-weight: 600` |
| Days remaining | `rgb(72, 143, 49)` green |
| Days overdue | `rgb(227, 34, 0)` red |

### Timeline Period Badges (People tab)
| Role Category | Background | Border Radius |
|--------------|-----------|---------------|
| Delivery Owner card | `rgb(246, 244, 255)` lavender | `8px` |

### Typography
- **Font Family**: `Lato, sans-serif` (primary), `FontAwesome` (icons)
- **Base font size**: `13px` / `13.008px`
- **Font weights used**: 400 (normal), 500, 600 (semi-bold), 700 (bold)

| Element | Font Size | Font Weight | Color |
|---------|-----------|-------------|-------|
| Page body | 13px | 400 | `#595959` |
| Project name (link) | 13–14px | 600/700 | `#181818` |
| Section labels ("Delivery Manager") | 10–11px | 400 | `#595959` |
| DM/SM names | 13px | 600 | `#181818` |
| Health score number | 16px | 700 | status color |
| Column headers | 13px | 600–700 | `#181818` |
| Tag pills | 12px | 400 | `rgb(0,0,0)` |
| Margin value | 14px | 600 | status color |
| SPI/CPI values | 12px | 400 | status color |
| "Latest" label | 10px | 400, italic | `#595959` |
| User name (topbar) | 14px | 600 | `rgb(53, 53, 58)` |
| User role (topbar) | 12px | 400 | `#595959` |
| KPI metric value | 22–24px | 700 | `#181818` |
| KPI label | 13px | 400 | `#595959` |
| KPI subtext | 12px | 400 | `#595959` |
| "Revenue at Risk" value | 22px | 700 | `#E32200` (red) |

### Borders & Radius
- Cards: `border: 1px solid rgb(222, 226, 230)`, `border-radius: 4px`
- Buttons (primary): `border-radius: 4px`
- Buttons (secondary): `border-radius: 4px`
- Status pills: `border-radius: 20px`
- Overdue pill: `border-radius: 8px`
- Badge tags: `border-radius: 4px`
- Filter chips: `border: 1px solid rgb(217, 217, 217)`, `border-radius: 4px`
- Table rows: no border-radius
- Right panel cards: `border-radius: 8px`
- Active division tab: `border-radius: 0px` (rectangle), but with `2px solid indigo` border

### Shadows
- Topbar: `box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 5px 0px`
- Cards: `box-shadow: none`

### Icon Style
- **Library**: Font Awesome (fa-*)
- **Style**: Solid filled
- **Key icons used**:
  - `fa-info-circle` — tooltip triggers (column headers, KPI cards)
  - `fa-circle` — health score dot (colored)
  - `fa-sort` / `fa-sort-up` / `fa-sort-down` — column sort arrows (color: `rgb(128, 128, 128)`)
  - `fa-filter` — column filter trigger (color: `rgb(39, 43, 48)`)
  - `fa-search` — search button icon
  - `fa-download` — export button
  - `fa-exclamation-circle` — overdue assessment warning icon (red)
  - `fa-external-link` / link icon — assessment status external link button (blue)
  - `fa-user` / person icon — headcount icon
  - `fa-clock` — calendar/timeline icons
  - `fa-file` / contract icon — contract link
- **Info icon color**: `rgb(77, 81, 86)`
- **Sort icon color**: `rgb(128, 128, 128)` (gray)

### Design Language
- **Flat design** with minimal shadows (only topbar shadow)
- Clean white cards on light gray background
- Indigo/violet accent color for active division tabs
- Red (`#E32200`) as primary brand/action color
- Consistent use of colored pill/badge system for status values
- Font Awesome icons throughout (not outline style)
- No glassmorphism, no gradients (except subtle KPI card backgrounds)

---

## 3. NAVIGATION

### Top-Level Topbar (`header.main-header`)
- **Background**: White `rgb(255, 255, 255)`
- **Height**: 58px
- **Shadow**: `0px 3px 5px rgba(0,0,0,0.15)`
- **Left**: DamcoWorks logo (DW monogram in red, "Damco**Works**" text, "Works" in bold black)
- **Right**: User avatar (circular, purple background with "USER HOT" badge), username "Kaushki Singh" (14px, weight 600), role "PMO Analyst" (12px, weight 400), dropdown chevron

### Left Sidebar (`aside.aside-navigation`)
- **Background**: `rgb(16, 23, 38)` (dark navy)
- **Width**: 75px
- **Position**: Fixed left, full height
- **Navigation items** (icon + label, vertical stack):
  1. `Customers` — icon: person/users, link: `/DamcoWorks/Customer_List`
  2. `Delivery` — icon: delivery/truck, link: `/DamcoWorks/Delivery`
  3. `Projects` — icon: folder/grid (**active**), link: `/DamcoWorks/MyProjects`
  4. `People` — icon: person group, link: `/DamcoWorks/Overview`
  5. `Bench` — icon: person, link: `/DamcoWorks/Bench`

- **Active item**: `background: rgb(227, 34, 0)` (red square block, full width of sidebar)
- **Inactive items**: White icon + label on dark navy background
- **Icon color**: White for all items
- **Label**: Centered below icon, 10–11px, white

### Division Tab Bar (below sidebar, above KPI cards)
A horizontal scrollable tab strip (carousel using Splide.js library):
- **Previous/Next slide arrows**: White circular buttons (`border-radius: 50%`)
- **Tab options**: Technology Services, Insurance, ITES, Marketing Services, Salesforce, Staffing, All
- Each tab shows: **Division Name** + 🔲 count badge (active projects) + 👤 count badge (delivery managers)
- **Active tab**: `background: rgba(99, 102, 241, 0.1)`, `border: 2px solid rgb(67, 56, 202)`
- **Inactive tab**: transparent background, no border
- **Count badges** (active division): `background: rgb(224, 231, 255)`, `border-radius: 4px`, `padding: 3px 4px`
- **Count badges** (inactive division): `background: rgb(243, 244, 246)`, `border-radius: 4px`

### Footer
- **Background**: `rgb(73, 73, 73)` dark gray
- **Content**: "© Damcoworks. All Rights Reserved" + links: Privacy Statement | Copyright | Terms & Conditions
- **Link color**: light/white text

---

## 4. KPI CARDS CAROUSEL

### Container
- Carousel using **Splide.js** library
- Shows 5 KPI metric cards
- Has Previous/Next arrow buttons (white circular)
- Active slide has indigo border and light blue background

### KPI Cards (5 total visible)

**Card 1: Critical Attention** (active/highlighted)
- Label: "Critical Attention" + ℹ️ info icon
- Value: **6** (large, red `#E32200`, weight 700)
- Sub-label: "Projects needing intervention"
- Tooltip: "Projects requiring immediate attention based on any of the following conditions: Overall Health Score..."
- Active state: `background: rgb(238, 242, 255)`, `border: 2px solid rgb(99, 102, 241)`

**Card 2: Revenue at Risk**
- Label: "Revenue at Risk" + ℹ️
- Value: **$107.53K** (red color, large)
- Sub-label: "Payment Overdue > 90 days"
- Tooltip: "Total value of overdue invoices across all projects that are outstanding for more than 90 days..."

**Card 3: Delivery Performance Index**
- Label: "Delivery Performance Index" + ℹ️
- Value: **50** (large, dark text)
- Sub-label: "Projects with SPI < 0.9"
- Tooltip: "Average Schedule Performance Index (SPI) for FP active projects..."

**Card 4: Customer Confidence**
- Label: "Customer Confidence" + ℹ️
- Value: **7** (large, dark text)
- Sub-label: "Division Average: 4.2/5"
- Tooltip: "Projects with Customer Confidence Score ≤ 3.0 (Out of 5)"

**Card 5: Active Project**
- Label: "Active Project" + ℹ️
- Value: **138** (large, dark text)
- Sub-labels: "BYT / T&M: 61", "FP: 77", "Staffing: 0"
- Tooltip: "Total number of active projects, including Project type (BYT, T&M, FP and Contractual)"

All KPI cards: `background: rgb(255, 255, 255)`, `border: 1px solid rgb(222, 226, 230)`, `border-radius: 4px`

---

## 5. FILTER BAR

The filter bar sits between the KPI carousel and the data table. It is a single flex row.

### Elements (left to right):

1. **"All Projects" Toggle**
   - Toggle switch (iOS-style pill toggle)
   - CSS class: `switch margin-x-s`
   - When ON: shows all projects; when OFF: shows only assigned projects
   - Label "All Projects" appears to the right of toggle

2. **Active Filter Chips** (applied filters shown as tags)
   - Each chip shows: `[Category] : [Value] ×`
   - Example: `Division : Technology Services ×`
   - Style: `border: 1px solid rgb(217, 217, 217)`, `border-radius: 4px`, `padding: 2–4px 8px`, transparent background
   - The "×" is a link (`<a href="#">`) that removes the filter
   - Multiple chips appear side-by-side

3. **"Clear All" Button**
   - Style: `background: rgb(227, 34, 0)`, `color: white`, `border-radius: 4px`, `padding: 0 8px`, `font-size: 13px`
   - CSS class: `btn btn-small white-space-nowrap btn-primary`
   - Clears all active filters

4. **Select DM/PDM Dropdown** (right side)
   - Searchable multi-select dropdown (custom `vscomp` virtual select component)
   - Placeholder: "Select DM/PDM"
   - Has a clear button (×)
   - Opens a search box + listbox of DM names
   - Search placeholder: "Search..."
   - Filters table by selected Delivery Manager / PDM

5. **Search Button** (🔍 magnifying glass icon)
   - Clicking expands a search input field inline
   - Search input placeholder: "Please type project name here"
   - Has a submit button (🔍)
   - Filters table by project name

6. **Export/Download Button** (⬇️ download icon)
   - Opens a dropdown menu with 4 export options:
     - `Project Details` (CSV/Excel)
     - `Financial` (CSV/Excel)
     - `Milestone` (CSV/Excel)
     - `Delivery Health` (CSV/Excel)
   - Each option triggers a file download

7. **Filter Button** (funnel icon 🔽)
   - Opens a right-aligned dropdown panel "Filter By"
   - Filter panel contains:
     - **"Projects Yet to Start"** — toggle switch (ON by default)
     - **"No Active Work"** — toggle switch (ON by default)
     - **"Offerings"** — accordion (chevron ›) → expandable checkbox list
     - **"Geography"** — accordion (chevron ›) → expandable checkbox list
     - **"Domain"** — accordion (chevron ›) → expandable checkbox list
     - **"Currency"** — accordion (chevron ›) → expandable checkbox list
     - **"Status"** — accordion (chevron ›) → expandable checkbox list (Active/Inactive)
     - **"Division"** — accordion (chevron ›) → expandable checkbox list
   - Bottom actions: **"Reset to Default"** (white button) + **"Apply"** (red primary button)
   - All accordion sections have `background: rgb(245, 246, 250)` header, expand in-place

---

## 6. DATA TABLE

### Table Structure
- HTML `<table>` with `<thead>` and `<tbody>`
- **First column** (Project): sticky/fixed left (`class: sticky-col`), `background: rgb(241, 241, 241)` for header
- Remaining columns: horizontally scrollable
- **Column filter dropdowns**: Each column has a sort icon (⇅) and optionally a filter icon (▼)

### Visible Columns (in order):

| # | Column Name | Width | Data Type | Has Sort | Has Filter | Has Tooltip |
|---|-------------|-------|-----------|----------|------------|-------------|
| 1 | **Project** | 250px | Text + badges | ↕ sort | ▼ filter dropdown | No |
| 2 | **Tags** | 264px | Colored pill badges | No | No | ℹ️ info |
| 3 | **People** | 160px | Person info + counts | ↕ sort | ▼ filter dropdown | ℹ️ info |
| 4 | **Overall Health** | 220px | Score + badge rows | ↕ sort | ▼ filter dropdown | ℹ️ info |
| 5 | **Delivery Health** | 166px | SPI/CPI/Variance metrics | ↕ sort | ▼ filter dropdown | ℹ️ info |
| 6 | ~~Governance Health~~ | 0 (hidden) | — | — | — | — |
| 7 | **Assessment Status** | 206px | Status pill + external link | ↕ sort | ▼ filter dropdown | No |
| 8 | **Delivery Thoughts** | 225px | Text (truncated) + date | ↕ sort | ▼ filter dropdown | No |
| 9 | **Financials** | 160px | % + currency amounts | ↕ sort | ▼ filter dropdown | ℹ️ info |
| 10 | **CSAT** | 120px | Number + icon | ↕ sort | ▼ filter dropdown | ℹ️ info |
| 11 | **Milestone Health** | 220px | Counts | ↕ sort | ▼ filter dropdown | ℹ️ info |
| 12 | ~~Quality~~ | 0 (hidden) | — | — | — | — |
| 13 | ~~Risks by AI~~ | 0 (hidden) | — | — | — | — |
| 14 | **Timeline & Contract** | 192px | Date range + days | ↕ sort | ▼ filter dropdown | ℹ️ info |

### Column Detail Specs

#### Column 1: Project
Content per row:
- **Project name**: Bold link (`<a href="#">`), dark text, clicking opens right detail panel
- **Client/Company name**: Secondary text, lighter weight, below project name
- **"No Work" badge** (optional): `background: rgb(241, 241, 241)`, `border-radius: 4px`, `padding: 2px 6px`, appears inline next to project name
- **Type badges** (bottom): `Client Project` + engagement type (`BYT`, `FP`, `T&M`) — styled as border-only tags (`border-tag display-inline-block`, `border-radius: 5px`, `padding: 2px 5px`)

Column filter: Dropdown select with options (e.g., filter by project type)
Column sort: Both ascending and descending

#### Column 2: Tags
Content: Colored pill badges in groups:
- **Offering tags**: `background: rgb(222, 249, 255)` (cyan-blue), `border-radius: 20px`
- **Domain tags**: `background: rgb(246, 218, 255)` (purple-pink), `border-radius: 20px`
- **Geography tags**: `background: rgb(229, 235, 254)` (light indigo), `border-radius: 20px`
- **Currency tags**: `background: rgb(255, 246, 234)` (light orange), `border-radius: 20px`
- **Status tag**: `background: rgb(220, 255, 227)` (light green), `border-radius: 20px`

Info icon tooltip: "Project classification tags including Offering (service type), Domain (client sector), Customer's Name..."
All tag pills: `font-size: 12px`, `padding: 2px 8px`

#### Column 3: People
Content:
- Label "Delivery Manager" (10px, secondary color)
- DM name (13px, weight 600, dark)
- Label "Sales Manager" (10px, secondary color)  
- SM name (13px, weight 600, dark)
- 👤 headcount number (icon + number, clickable — shows tooltip "Head Count")
- `X FTE` allocation (clickable — shows tooltip "Allocation by FTE")

Column filter: Dropdown select (filter by DM/SM name)
Info icon tooltip: "Project team composition. Shows Delivery Manager (DM) and Sales Manager name, total headcount (number of people)..."

#### Column 4: Overall Health
Content (3 sub-rows):
- Row 1: "Health Score" label + colored dot icon (fa-circle) + numeric score
  - Dot colors: green (≥85), orange (60–84), red (0–59)
- Row 2: "Service Quality" + status badge (Healthy/Caution/At Risk)
- Row 3: "Financial Health" + status badge (Healthy/Caution/At Risk)

Status badge styles: `border-radius: 20px`, `padding: 2px 8px`, `font-size: 12px`
- Healthy: `background: rgb(220, 255, 227)`
- Caution: `background: rgb(255, 246, 234)`  
- At Risk: `background: rgb(255, 224, 221)`

Column filter: Dropdown (filter by health status)
Info icon tooltip explains the weighted score formula.

#### Column 5: Delivery Health
Content:
- "SPI: {value}" — value colored green (>1) or red (<1)
- "CPI: {value}" — value colored red if negative
- "Variance {percentage}%" — percentage in red if high
- Optional: "⚠ Severe Overburn" badge — `background: rgb(255, 224, 221)`, `color: rgb(227, 34, 0)`, `border-radius: 4px`, `padding: 2px 6px`, bold

All values: `font-size: 12px`

Column filter: Dropdown
Info icon tooltip: "Schedule and cost performance metrics for fixed price (FP) project delivery..."

#### Column 7: Assessment Status
Content:
- Either a dash "-" (no assessment)
- Or a red pill: `⓪ Overdue by X day(s)` — `background: rgb(254, 226, 226)`, `color: rgb(185, 28, 28)`, `border-radius: 8px`
- External link icon (🔗) next to the pill, shown when overdue
- The circle-exclamation icon is red: Font Awesome `fa-exclamation-circle`

Column filter: Dropdown
Sort: Ascending/descending

#### Column 8: Delivery Thoughts
Content:
- "Latest" label: italic, 10px, secondary gray
- Truncated thought text (multi-line, truncated with ellipsis or hidden overflow)
- Date/time + Author name: "Feb 19, 2026 2:12PM | Arpit Gupta", 11px, secondary gray

Column filter: Text search input
Sort: Ascending/descending

#### Column 9: Financials
Content:
- Margin percentage: large (14px, weight 600), colored green or red
- "Margin" label
- ⚠️ icon (optional, appears when negative margin)
- "$XXK Received" — secondary text, green color
- "$XXK Outstanding" — amber/orange color
- "$XXK Overdue" — red color

Column filter: Dropdown
Info icon tooltip explains margin calculation.

#### Column 10: CSAT
Content:
- Numeric CSAT score (1–5 scale), left-aligned
- "=" icon in a blue circle (`background: rgb(205, 225, 255)`, `color: rgb(38, 128, 255)`, `border-radius: 50%`) — represents "no change" trend
- Or up/down arrow trend indicator

Column filter: Dropdown
Info icon: "Current CSAT (Customer Satisfaction) score on a 1-5 scale, from the most recent survey. → 4.5-5: ..."

#### Column 11: Milestone Health
Content (two columns within the cell):
- Left: "{N} In Progress", "{N} Extended"
- Right: "{N} Completed", "{N} Overdue"
- Optional: "⊙ Chronic Delays" badge (red dot + text)

Column filter: Dropdown
Info icon: "Milestone health score (0-100%). Shows count of completed milestones, overdue milestones..."

#### Column 14: Timeline & Contract
Content:
- Date range: "May 02, 2022 - Apr 30, 2026" (13px, dark)
- Status line:
  - "🟢 37 days remaining" — `color: rgb(72, 143, 49)` green, with green circle icon
  - "🔴 24 days overdue" — `color: rgb(227, 34, 0)` red, with red clock icon
- "📄 Contract" link — blue link text, doc icon

Column filter: Dropdown
Info icon: "Project duration and status. Shows start date, end date, and days remaining/overdue..."

### Column Sort Behavior
- Sort icons: up arrow / down arrow / both (unsorted) — `rgb(128, 128, 128)` gray
- Clicking column header or sort icon toggles asc/desc
- Column filter icon (funnel) opens an inline dropdown with a `<select>` and Cancel/Apply buttons

### Column Filter Dropdown (inline)
- Position: below column header
- Contains: Label ("Filter"), `<select>` dropdown with "Select" default option + filter options, "Cancel" button (white), "Apply" button (red primary)
- For text columns (Delivery Thoughts, Risks by AI): text `<input type="search">` instead of select

### Row States
- **Default**: White background, thin bottom border
- **Hover**: No visible hover state change (standard cursor)
- **Clicked**: Opens right detail panel (row itself doesn't change style)
- No row checkboxes/selection in current filter state

### Pagination Bar
- Located below the table
- Left: "Items per page" label + dropdown select: options 5, 10, 15, 20, **25** (selected), 100
- Center: "{start} to {end} of {total} items" — e.g., "1 to 6 of 6 items"
- Right: Page navigation buttons (< 1 2 3 ... N >)
- Current page button has filled/highlighted style

---

## 7. RIGHT DETAIL PANEL (Project Drawer)

Triggered by clicking a project name/row. Opens as a full-height overlay from the right side (~75% viewport width). Has an X close button at top right.

### Panel Header
- Project name (large, bold, clickable ">" for more detail / full page view)
- Client/company name (secondary text below)

### Tab Navigation
Tabs across the top (scrollable horizontally). Active tab underlined with `rgb(227, 34, 0)` red:

1. **Overview & Insights** (default active)
2. **People & Ownership** (with headcount badge: e.g., "9")
3. **Overall Health**
4. **Delivery Health**
5. **Delivery Thoughts**
6. **Financials**
7. **CSAT**
8. **Milestone Health**
9. **Timeline & Contracts**
10. **Quality**

### Tab 1: Overview & Insights

#### Section: Delivery Thoughts & Insights (AI section)
- Header: ✦ "Delivery Thoughts & Insights" (sparkle icon for AI)
- "Re-evaluate" button (top right): white button, `border-radius: 4px`, `border: 1px solid`, calls AI re-analysis
- Three column grid:
  - **Highlights** (green header): bullet points of positive project highlights
  - **Concerns** (red header): bullet points of risk items
  - **Next Steps** (blue header): action items suggested by AI

#### Section: Project Metadata
Grid of 6 fields (2 rows × 3 columns):
- Row 1: Project Type | Engagement Model | Timeline
- Row 2: Client Partner | Sales Manager | Delivery Manager

#### Section: Project Overview
- Bold italic paragraph describing the project

#### KPI Summary Cards (4 cards, horizontal row)
| Card | Value Example | Color |
|------|---------------|-------|
| Overall Health | 61 | orange (Caution) |
| Margin | 65% | green |
| Milestone Health | 17% | red |
| CSAT | 1/5 | red |

Secondary row of metric cards:
| Card | Example |
|------|---------|
| Total Outstanding | $16K |
| Schedule Performance Index | 0.81 |
| Cost Performance Index | -0.99 |

### Tab 2: People & Ownership

#### Section: Core Team
Three card groups:

**Delivery Owner card** (`background: rgb(246, 244, 255)`, `border-radius: 8px`):
- Delivery Manager name + Onsite DM (empty if none)

**Client Relation card**:
- Program Manager | Client Partner | Sales Manager

**Leadership card**:
- Project Lead | Tech Lead

#### Section: Engineering Team
- Headcount: N | FTE by Allocation: X FTE
- Sub-table with columns: **People** ↕ ▼ | **Contribution** ↕ ▼ | **SOW Role** ↕ ▼ | **Allocation** ↕ ▼ | **Billing** ↕ ▼ | **Duration** ↕ ▼
- Each person row: Name (bold), Employee ID + Title, Skill tags (border tags)
- Pagination: Items per page (5/10/15/20/25/100) | "{start} to {end} of {total} items" | Page nav

### Tab 3: Overall Health

Displays health score breakdown:
- **"Overall Health score"** label + score value (e.g., 61) + status word (e.g., "Caution" with ℹ️)

**Health Components** (3 cards in a row):
Each card has:
- Component name (Service Quality / Margin / Payment Timelines)
- Score value (0–100)
- Weight: X%
- "Contributes: N Points"
- Colored progress bar (green for high, orange for medium, red for low)

**Calculation Formula** section:
- Formula text: `Overall Health = Sum of (Component Score * Weight)`
- Detailed calculation shown
- Score thresholds:
  - ≥ 85 → Healthy
  - 60–84 → Caution
  - 0–59 → At Risk

### Tab 4: Delivery Health

Three metric cards (horizontal row):
1. **SPI (Schedule Performance Index)**: value + status label in parentheses (e.g., "(Behind schedule)") + formula
2. **CPI (Cost Performance Index)**: value + status label + formula
3. **Effort Variance (for FP only)**: percentage + status label

Metrics table below:
- Budgeted Hours | Logged Hours | Planned End Date | % Complete

**Burnt Hours Ratio** section:
- Value + status label "(Efficient)"
- Legend: 🟢 Less than 1.2: Efficient | 🟡 1.2-1.5: Concerning | 🔴 Greater than 1.5: Critical

### Tab 5: Delivery Thoughts

**AI Summary** section:
- Header: ✦ "AI Summary" + timestamp
- Summary paragraph text
- Status badge (e.g., "Needs focused attention") — orange/amber pill
- **Risks** section with ❗ bullet items (red exclamation icon)
- **Some Immediate actions suggested by AI** — purple bullet items

**Timeline** section (chronological log):
- Each entry: Avatar circle (initials/color) + Author name + Status badge (Healthy/At Risk/Caution) + Date/time
- Full thought text body (paragraph)
- Entries ordered newest-first

### Tab 6: Financials

**Summary metrics** (4 cards, 2 rows):
Row 1: Avg Ageing | Total Booked ℹ️ | Total Invoiced | Margin ℹ️
Row 2: Invoiced | Received | Outstanding | Overdue

Small note: "Figure represent the last 5 year for BYT/T&M