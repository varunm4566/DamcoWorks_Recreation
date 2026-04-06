# MyProjects Screen — Full UI & Functional Specification

> **Application:** DamcoWorks (OutSystems)  
> **Module:** Projects  
> **Screen Name:** MyProjects  
> **URL:** /DamcoWorks/MyProjects  
> **Viewport (default):** 1400×860px (responsive: desktop landscape)  
> **Documented:** 2026-03-26

---

## 1. Overall Page Layout

The screen is divided into three major structural zones:

```
┌──────────────────────────────────────────────────────────────┐
│  TOP HEADER BAR  (height: 58px, bg: #ffffff)                 │
│  Logo (left)                          User Profile (right)   │
├──────┬───────────────────────────────────────────────────────┤
│ SIDE │  MAIN CONTENT AREA (bg: #F7F8FC, padding: 14px)       │
│ NAV  │                                                       │
│ 75px │  [Division Filter Tab Bar]                            │
│      │  [Summary KPI Cards Row — Carousel]                   │
│      │  [Active Filter Chips + Action Bar]                   │
│      │  [Projects Data Table]                                │
└──────┴───────────────────────────────────────────────────────┘
```

---

## 2. Color Palette

### Brand / Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#E32200` | Primary buttons, active nav item, Clear All button |
| `--color-secondary` | `#94122C` | Secondary brand color |
| `--orange` | `#CA3F16` | Orange accent |
| `--yellow` | `#FF9408` | Yellow accent |

### Background Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--canvas-bg` / `--primary-lightest-gray` | `#F7F8FC` | Page/body background |
| `--side-nav-bg` | `#101726` | Sidebar navigation background |
| `--side-nav-hover` | `#252E42` | Sidebar nav item hover state |
| White | `#FFFFFF` | Cards, table rows, header bar, dropdown toggles |
| `--primary-bg-gray` | `#F4F4F4` | Table header row background |
| Light gray | `#F1F1F1` | Table header bg (computed) |
| Summary card bg | `#E1E2E4` (rgb 225,226,228) | KPI Summary card background |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary-text` | `#0A0D12` | Dark primary text |
| `--secondary-text` / `--body-color` | `#4D5156` / `#595959` | Body/secondary text |
| `--primary-dark` | `#0A0D12` | Dark headings |
| Black | `#000000` | Table header text, tag labels |
| White | `#FFFFFF` | Text on primary buttons, sidebar icons |

### Semantic / Status Colors
| Name | Hex | Usage |
|------|-----|-------|
| Red (primary) | `#E32200` / `#FA0000` | Critical values (Critical Attention count, Revenue at Risk value) |
| Red (dark) | `#96180F` | Error states |
| Red (medium) | `#DB3131` | Red text secondary |
| Green (primary) | `#01854C` | — |
| Green (score) | `rgb(55,178,77)` | Health score 75-100 (Green) |
| Amber/Orange | `rgb(247,103,7)` | Health score 50-74 (Amber) |
| Red (health) | `#E32200` | Health score 0-49 (Red) |
| Overdue pill bg | `#FEE2E2` (rgb 254,226,226) | Assessment overdue badge bg |
| Overdue pill text | `#B91C1C` (rgb 185,28,28) | Assessment overdue badge text |

### Tag / Chip Colors (color-tag pills)
| CSS Class | Background | Usage Example |
|-----------|-----------|---------------|
| `bg-blue-cyan` | `rgb(222, 249, 255)` | Service line (e.g. Manufacturing and Logistics) |
| `bg-purple-pink` | `rgb(246, 218, 255)` | Technology tags (e.g. Manufacturing, Salesforce) |
| `bg-blue-light` | `rgb(229, 235, 254)` | Geography tags (e.g. GCC, USA) |
| `bg-orange-light` | `rgb(255, 246, 234)` | Currency tags (e.g. USD, INR) |
| `bg-green-light` | `rgb(220, 255, 227)` | Status Active, Healthy badge |
| `bg-pink-light` | `rgb(255, 224, 221)` | At Risk badge, Severe Overburn badge |

### Border Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary-border` | `#E0E0E0` | General card/cell borders |
| `--primary-border-gray` | `#E0E0E0` | Table cell borders |
| Filter chip border | `#D9D9D9` (rgb 217,217,217) | Active filter chip border |
| Division tab selected | `#4338CA` (rgb 67,56,202) | Active division tab border (2px solid) |
| Division tab selected bg | `rgba(99,102,241,0.1)` | Active division tab background tint |

---

## 3. Typography

| Element | Font Size | Font Weight | Color |
|---------|-----------|-------------|-------|
| KPI Card Title | 14px | 600 (Semi-bold) | `#595959` |
| KPI Card Big Number | 18px | 700 (Bold) | Red `#FA0000` or Black |
| KPI Card Sub-label | 12px | 400 | `#4D5156` |
| Division Tab Label | 13px | 400 | `#595959` |
| Table Header | 14px | 600 | `#000000` |
| Table Body Text | 12px–13px | 400 | `#595959` |
| Project Name (link) | 12px | 400 | `#4D5156` |
| Person Name | 12px | 600 | `#000000` |
| Role Label | 14px | 400 | `#595959` |
| Color Tags / Pills | 12px | 400 | `#000000` |
| Border Tags | 11.2px | 400 | `#000000` |
| Health Score Number | 12px | 600 | Green/Amber/Red depending on value |
| Filter Chip Label | 12px | 400/600 | `#101213` (bold part) / `#595959` |
| "Latest" stamp | 10px | 400 italic | `#595959` |
| Timestamp in thoughts | 12px | 400 | `#595959` |
| Overdue badge text | 12px | 400 | `#B91C1C` |
| Severe Overburn badge | 12px | 700 | `#E32200` |

---

## 4. Top Header Bar

**Height:** 58px  
**Background:** `#FFFFFF`  
**Box Shadow:** `rgba(0,0,0,0.15) 0px 3px 5px 0px`  
**Padding:** `1px 10px`  

### Contents
- **Left:** Application logo (red/black dot grid icon, ~38×38px)
- **Right:** User profile section
  - Avatar: circular image with "USER HOT" placeholder badge (purple-ish circle, ~38×38px)
  - User Name: "Varun Mishra" — 14px, semi-bold, `#0A0D12`
  - User Role: "Software Engineer II" — smaller, `#595959`
  - Dropdown chevron (▼) to open profile menu

---

## 5. Left Sidebar Navigation

**Width:** 75px  
**Height:** Full viewport height  
**Background:** `#101726` (dark navy)  
**Position:** Fixed left  

### Navigation Items (top to bottom)
Each nav item is 75px wide × ~79px tall with icon + label stacked vertically.

| Item | Icon | Active State | Link |
|------|------|-------------|------|
| Customers | People/user icon | Normal | `/DamcoWorks/Customer_List` |
| Delivery | Delivery icon | Normal | `/DamcoWorks/Delivery` |
| **Projects** | Project icon | **Active** — `#E32200` bg | `/DamcoWorks/MyProjects` |
| People | Person icon | Normal | `/DamcoWorks/Overview` |
| Bench | Bench icon | Normal | `/DamcoWorks/Bench` |

**Icon color (inactive):** White (`#FFFFFF`)  
**Label color (inactive):** White, 11px  
**Active item bg:** `#E32200` (primary red)  
**Hover state bg:** `#252E42`  

---

## 6. Division Filter Tab Bar

**Container class:** `.filter-top-box.card`  
**Background:** `#FFFFFF`  
**Border:** `1px solid #DEE2E6`  
**Border Radius:** 4px  
**Display:** flex (horizontal row)  
**Margin Bottom:** 12px  

This is the horizontal scrollable tab bar at the very top of the main content area. It shows business division filters.

### Division Tabs (current data)
| Division | Projects Count | DM Count |
|----------|---------------|----------|
| Technology Services | 138 | 44 |
| Insurance | 58 | 19 |
| ITES | 27 | 7 |
| Marketing Services | 16 | 6 |
| Salesforce | 41 | 6 |
| Staffing | 76 | 6 |
| **All** | **356** | **88** |

### Tab Item Structure
Each tab item (class: `.filter-option.display-flex.align-items-center`):
- **Padding:** 8px
- **Cursor:** pointer
- **Default state:**
  - Background: transparent
  - Border: none
  - Text: Division name (span, 13px, `#595959`)
- **Active/Selected state** (class adds `.active`):
  - Background: `rgba(99, 102, 241, 0.1)` (indigo tint)
  - Border: `2px solid #4338CA` (indigo/purple)
- **Each tab shows two info-chips** (right side of label):
  - Chip 1: Project count with briefcase/project icon — bg: `rgb(243,244,246)`, border-radius: 4px, padding: 3px 4px
  - Chip 2: DM count with user icon — same styling

### Interaction
- **Click** on any division tab → filters the Summary KPI Cards AND the project list below to that division's data
- The "All" tab shows totals across all divisions (default/selected state on load)
- Active tab gets indigo border + light indigo background

---

## 7. Summary KPI Cards (Carousel)

**Container class:** `.osui-carousel.project-slider` (Splide carousel)  
**Card class:** `.card-image-box.splide__slide`  
**Card Background:** `rgb(225, 226, 228)` (#E1E2E4)  
**Card Border:** `1px solid #DEE2E6`  
**Card Border Radius:** 8px  
**Card Padding:** `12px 10px`  
**Card Layout:** Horizontal row, all 5 visible simultaneously on desktop  

There are **5 KPI summary cards**, each a clickable component:

### Card 1: Critical Attention
- **Title:** "Critical Attention" — 14px, semi-bold, `#595959`, class: `.card-top-head`
- **Info icon (ℹ):** tooltip on hover with full definition
- **Main Value:** "19" — 18px, bold, **color: `#FA0000` (red)** — class: `.card-big-head.red-text.cursor-pointer`
- **Sub-label:** "Projects needing intervention" — 12px, `#4D5156` — class: `.font-size-small.cursor-pointer`
- **Tooltip definition:** "Projects requiring immediate attention based on an algorithm..."
- **Click action:** Filters the project list to show only critical attention projects
- **Background image:** Faint diagonal wave/pattern (decorative)

### Card 2: Revenue at Risk
- **Title:** "Revenue at Risk" — 14px, semi-bold, `#595959`
- **Main Value:** "$148.81K" — 18px, bold, **color: `#FA0000` (red)**
- **Sub-label:** "Payment Overdue > 90 days" — 12px, `#4D5156`
- **Tooltip definition:** "Total value of overdue invoices across all projects..."
- **Click action:** Filters list to show projects with overdue revenue

### Card 3: Delivery Performance Index
- **Title:** "Delivery Performance Index" — 14px, semi-bold, `#595959`
- **Main Value:** "79" — 18px, bold, **color: black/neutral**
- **Sub-label:** "Projects with SPI < 0.9" — 12px, `#4D5156`
- **Click action:** Filters list to show projects with SPI below threshold

### Card 4: Customer Confidence
- **Title:** "Customer Confidence" — 14px, semi-bold, `#595959`
- **Main Value:** "16" — 18px, bold, **color: black/neutral**
- **Sub-label:** "Division Average: 4.2/5" — 12px, `#4D5156`
- **Click action:** Filters list to show projects related to customer confidence metric

### Card 5: Active Project
- **Title:** "Active Project" — 14px, semi-bold, `#595959`
- **Main Value:** "356" — 18px, bold, **color: black** (class: `.card-big-head.red-text` but color is black here)
- **Sub-labels (3 rows):**
  - "BYT / T&M: 118" — 12px, `#4D5156`
  - "FP: 162" — 12px, `#4D5156`, right-aligned
  - "Staffing: 76" — 12px, `#4D5156`
- **Click action:** Resets or filters by project type (BYT/T&M, FP, Staffing)

### KPI Card Interaction
- Each card number and sub-label has `cursor-pointer` class
- Clicking the value/sub-label applies a filter to the list below (top filter chip updates to reflect the applied filter)
- When a division tab is selected, these KPI values update dynamically to reflect that division

---

## 8. Active Filter Bar

**Container class:** `.filtertable-container.card-container.full-height.margin-top-base`  
**Background:** `#FFFFFF`  
**Border Radius:** 8px  
**Padding:** 10px  
**Layout:** flex row, space-between (left: chips, right: controls)

The filter bar sits between the KPI cards and the data table. It shows currently applied filters as removable chips and provides filter controls.

### Left Side: Active Filter Chips

**Container class:** `.display-flex.align-items-center.filter-list-items`  
**Padding:** `0 0 4px`

Each filter chip (class: `.filter-box.OSInline`):
- **Background:** transparent
- **Border:** `1px solid #D9D9D9`
- **Border Radius:** 4px
- **Padding:** `3px 5px`
- **Margin-right:** xs (4–8px on last chip no margin)

**Chip Structure:**
- Bold label part (e.g., "Division") — 12px, color: `#101213`, class: `.text-neutral-10`
- Value part (e.g., ": All") — 12px, color: `#595959`
- **"×" close/remove button** — clicking removes that filter

**Default chips on load:**
1. "Division : All ×"
2. "Active Project : Total ×"

**Clear All Button** (class: `.btn.btn-small.btn-primary`):
- Background: `#E32200`
- Color: `#FFFFFF`
- Border Radius: 4px
- Padding: `0px 8px`
- Height: 25px
- Clears all active filter chips at once

### Right Side: Filter Controls

**Layout:** flex row, aligned right

1. **Select DM/PDM Dropdown** (Virtual Select component, class: `.vscomp-ele-wrapper`):
   - Width: 180px
   - Toggle button bg: `#FFFFFF`, border: `1px solid #DEE2E6`, border-radius: 4px
   - Padding: `4px 54px 4px 16px`
   - Placeholder text: "Select DM/PDM"
   - Has search input inside dropdown
   - Has clear button (×)
   - Filters list by selected Delivery Manager or Product Development Manager

2. **Search Button** (magnifier icon, class: `.filter-btn`):
   - Background: transparent
   - Border: `1px solid #DEE2E6`
   - Border Radius: 4px
   - Padding: `6px 12px`
   - Width: 50px, Height: 36px
   - Opens a search/input for text search across projects

3. **Download Button** (download icon, class: `.btn.filter-btn.mr-0`):
   - Background: `#F1F3F5`
   - Border: `1px solid #DEE2E6`
   - Border Radius: 4px
   - Padding: `6px 12px`
   - Height: 36px
   - Exports/downloads the current filtered list

4. **Global Filter Button** (funnel icon, class: `.filter-btn`):
   - Background: transparent
   - Border: `1px solid #DEE2E6`
   - Border Radius: 4px
   - Padding: `6px 12px`
   - Opens the Global Filter Panel (slide-in/dropdown)

### Global Filter Panel (Funnel Icon)
A fly-in or dropdown panel with accordion sections:

**Header:** "Filter By"

**Quick Filters (toggle checkboxes):**
- Projects Yet to Start
- No Active Work

**Accordion Sections:**
- **Offerings:** ADI Low Codes, AI and Agents, Application Development and Integrations, AS/400, Assessment Management System, Banking & Financial Services, BPO, BrokerEdge - Product, BrokerEdge US Product, Business Process Automation, Cloud, Corporate Pulse, CRM - Customer Onboarding, CRM Nexus Implementation, Damco Inspection System, Data and Visualisation, Digital Asset Threat Monitoring, Enterprise Platforms, Healthcare, Infra and Security, Insurance, InsureEdge - General, InsureEdge - Health, InsureEdge - Life, InsureEdge US Product, Intelligent Document Processing, ISV & Software, Light CRM Initiative, Managed Services, Manufacturing and Logistics, Marketing, Microsoft, Nuts and Bolts Mobile App, Nuts and Bolts Web Portal, Outsystems, Phishing Service Platform, RAPADIT Product Development, Retail, Salesforce, Staffing, Tech Strategy, Testing, UI Path, UX, Web3
- **Geography:** Africa, APAC (outside India), Canada, Caribbean, GCC, India, Mainland Europe, South America, UK, USA
- **Domain:** Automotive, Business Consulting Services, Charity, Digital Media and Advertising, Education, Energy and Utilities, Financial Services, Health and Social Care, Hi-Tech, Human Resources and Recruitment, Insurance, Manufacturing, Publishing and Media, Real Estate and Building Management, Retail and Consumer Products, Security, Telecom, Transportation and logistics, Travel and Hospitality
- **Currency:** AED, AUD, CAD, Euro, GBP, INR, USD, ZAR
- **Status:** Active, Inactive
- **Division:** Insurance, ITeS, Marketing Services, Salesforce, Staffing, Technology Services

**Buttons:**
- Reset to Default
- Apply (primary, `#E32200`)

---

## 9. Projects Data Table

**Container class:** `.table-responsive.projects-table.left-column-sticky-table`  
**Table class:** `.border-table.table`  
**Border Collapse:** separate  
**Row class:** `.table-row`  
**Row background:** `#FFFFFF`  
**Cell padding:** 10px  
**Cell border:** `1px solid #DEE2E6`  
**Cell vertical-align:** top  

### Table Header
- **Background:** `#F1F1F1`
- **Text color:** `#000000`
- **Font size:** 14px
- **Font weight:** 600 (semi-bold)
- **Padding:** 10px
- **Border:** `1px solid #DEE2E6`

### Visible Columns (default view)

| # | Column | Sticky | Sortable | Filterable | Notes |
|---|--------|--------|----------|------------|-------|
| 1 | **Project** | ✅ Yes | ✅ (↕) | ✅ (▼) | Sticky left column |
| 2 | **Tags** | No | No | ℹ tooltip | Color-coded tag pills |
| 3 | **People** | No | ✅ (↕) | ✅ (▼) | PDM, SM, headcount, FTE |
| 4 | **Overall Health** | No | ✅ (↕) | ✅ (▼) | Score + 3 sub-metrics |
| 5 | **Delivery Health** | No | No | No | SPI, CPI, Variance |
| 6 | **Assessment Status** | No | ✅ (↕) | ✅ (▼) | Overdue badge + external link |
| 7 | **Delivery Thoughts** | No | No | No | Latest note + timestamp |

### Hidden Columns (togglable via column config)
Governance Health, Financials, CSAT, Milestone Health, Quality, Risks by AI, Timeline & Contract, People (expanded), Contribution, SOW Role, Allocation, Billing, Duration, Created On, Milestone, Invoice No, Value, Invoiced Due Date, Status, Triggered On, Triggered By, Client POC, Response Received, Score, Testimonial, Planned Triggering Date, Actual Triggering Date

---

## 10. Column Details

### Column 1: Project (Sticky)
**Width:** ~250px (sticky-col class)  
**Background:** `#FFFFFF` (sticky while scrolling horizontally)

Content per row:
- **Project Name** (clickable link, `href="#"`): 12px, color `#4D5156`, opens right-side fly-in panel
- **Client/Company Name:** 12px, secondary text `#595959`
- **Type/Tag Badges** (border-tag pills):
  - Style: transparent bg, `1px solid #DDDDDD`, border-radius 5px, padding `2px 5px`, font-size 11.2px
  - Examples: "Damco Accelerator", "Client Project", "T&M", "FP"

### Column 2: Tags
Color-coded pill tags (class: `.color-tag`):
- **Border Radius:** 20px (fully rounded)
- **Padding:** `2px 8px`
- **Font size:** 12px

Tag categories and colors:
| Category | Background |
|----------|-----------|
| Service Line (e.g. App Dev & Integrations, Manufacturing & Logistics) | `#DEF9FF` (blue-cyan) |
| Domain (e.g. Financial Services, Travel and Hospitality) | `#F6DAFF` (purple-pink) |
| Geography (e.g. India, USA, GCC) | `#E5EBFE` (blue-light) |
| Currency (e.g. INR, USD) | `#FFF6EA` (orange-light) |
| Status (Active, Inactive) | `#DCFFE3` (green-light) |
| At Risk / Warning | `#FFE0DD` (pink-light) |

### Column 3: People
Content per row:
- **Role label** ("Product Development Manager" or "Delivery Manager"): 14px, `#595959`
- **Person Name:** 12px, **bold/600**, `#000000`, class: `.display-block.black-600`
- **Sales Manager label** + name (same styling)
- **Separator line**
- **Head Count:** numeric value — 12px, `#101213`, class: `.stat-value.display-block.text-neutral-10` + user icon (fa-user)
- **FTE Value** (e.g. "0.7 FTE"): 12px, `#101213`, class: `.display-block.stat-value.text-neutral-10`

### Column 4: Overall Health
Sub-rows per cell:
1. **Health Score** — label + numeric score
   - Score color coding:
     - 75–100: Green `rgb(55, 178, 77)`
     - 50–74: Amber `rgb(247, 103, 7)`
     - 0–49: Gray/Black (insufficient data or red)
   - Score shown as colored dot + number
2. **Service Quality** — label + status pill
   - "Healthy" pill: bg `#DCFFE3`, color `#000000`, border-radius 20px
   - "At Risk" pill: bg `#FFE0DD`, color `#000000`, border-radius 20px
   - "N/A" pill: transparent bg
3. **Financial Health** — label + status pill (same pill styles)

### Column 5: Delivery Health
Sub-rows per cell:
1. **SPI** (Schedule Performance Index): "SPI: N/A" or "SPI: 0.92"
   - Value < 1.0: color `#E32200` (red), class: `.red-text`
   - Value ≥ 1.0: color `#37B24D` (green), class: `.text-green`
2. **CPI** (Cost Performance Index): "CPI: N/A" or "CPI: -1"
   - Negative value: color `#E32200` (red), class: `.red-text`
   - Positive %: green text
3. **Variance**: "Variance -" or "Variance 0%" or "Variance 212%"
   - Positive/high variance: red text

### Column 6: Assessment Status
- **Default (no assessment):** dash "-"
- **Overdue badge** (class: `.status-pill.overdue`):
  - Background: `#FEE2E2`
  - Color: `#B91C1C`
  - Border Radius: 8px
  - Padding: `4px 10px`
  - Example text: "⚠ Overdue by 25 day(s)"
- **External link icon** (□↗): opens assessment in new context
- **Severe Overburn badge** (class: `.badge-tag.bg-pink-light.red-text`):
  - Background: `#FFE0DD`
  - Color: `#E32200`
  - Border Radius: 4px
  - Padding: `2px 6px`
  - Font: 12px, bold

### Column 7: Delivery Thoughts
**Width:** ~225px  
Content per row:
- **"Latest"** label: 10px, italic, `#595959`, class: `.display-inline-block.font-italic.margin-bottom-xs`
- **Thought text:** 12–13px, `#595959`, truncated with ellipsis
- **Timestamp + Author:** "Feb 16, 2026 3:18PM | Author Name" — 12px, `#595959`, class: `.display-block`

---

## 11. Row Interaction

- **Click on any row cell** (except the project name link) → opens a **right-side fly-in panel** (slide-in modal) showing full project details
- **Click on Project Name link** → also opens fly-in panel
- **Row hover state:** subtle highlight (standard browser hover)
- The fly-in panel contains: Project Overview, Overall Health details, Margin, Milestone Health, CSAT, Outstanding, SPI, CPI, and additional tabs

---

## 12. Sorting & Filtering on Columns

Columns with sort (↕ icon) allow ascending/descending sort on click.  
Columns with filter (▼ icon) open a column-level filter dropdown.  
The ℹ icon on column headers opens a tooltip with the metric definition.

---

## 13. Spacing & Layout Tokens

| Token | Value |
|-------|-------|
| Base padding (main content) | 14px |
| Card padding | 12px 10px |
| Filter bar padding | 10px |
| Filter chip padding | 3px 5px |
| Table cell padding | 10px |
| Table header padding | 10px |
| Tag pill padding | 2px 8px |
| Border tag padding | 2px 5px |
| Button border-radius | 4px |
| Card border-radius | 8px |
| Tag pill border-radius | 20px |
| Overdue badge border-radius | 8px |

---

## 14. Component Interaction Summary

| Component | Clickable | Filter Behavior | Visual Feedback |
|-----------|-----------|-----------------|-----------------|
| Division tabs | ✅ Yes | Filters KPI cards + table by division | Active tab: indigo border + tint bg |
| KPI Card value | ✅ Yes | Filters table rows (e.g. only critical projects) | Filter chip appears in filter bar |
| KPI Card sub-label | ✅ Yes | Same as card value click | Filter chip appears |
| Filter chip × | ✅ Yes | Removes that filter | Chip disappears |
| Clear All button | ✅ Yes | Removes all active filters | All chips disappear |
| Select DM/PDM dropdown | ✅ Yes | Filters table by selected DM/PDM | Value shown in dropdown |
| Search button | ✅ Yes | Opens text search for project name | Input appears |
| Download button | ✅ Yes | Downloads filtered list as file | — |
| Global filter button | ✅ Yes | Opens filter panel (fly-in/dropdown) | Panel slides in |
| Table row / project name | ✅ Yes | Opens right-side fly-in detail panel | Panel slides in from right |
| Column sort icons (↕) | ✅ Yes | Sorts table by that column | Icon indicates direction |
| Column filter icons (▼) | ✅ Yes | Opens column-level filter dropdown | Dropdown appears |

---

## 15. Filter State Visibility

When any filter is active, it appears as a **chip** in the Active Filter Bar:
- Chip shows: **"[Filter Name] : [Value] ×"**
- Bold part (filter name) in `#101213`
- Value part in `#595959`
- Border: `1px solid #D9D9D9`
- Border Radius: 4px
- Clicking the chip (×) removes that specific filter
- Clicking "Clear All" removes all chips and resets view

---

## 16. Implementation Notes for Plot/React Rebuild

1. **State management needed:**
   - `activeDivision` (null = All)
   - `activeKpiFilter` (null or one of: criticalAttention, revenueAtRisk, dpi, customerConfidence, activeProject)
   - `selectedDmPdm` (null or user ID)
   - `globalFilters` (object with: offerings[], geography[], domain[], currency[], status[], division[])
   - `searchText` (string)
   - `sortColumn` + `sortDirection`
   - `columnFilters` (per-column filter map)

2. **Filter chips** are derived state — computed from any active filter combination

3. **KPI cards** values must re-compute when `activeDivision` changes

4. **Table data** filters by the AND combination of all active filters

5. **Carousel** for KPI cards uses Splide.js (or equivalent) but on desktop all 5 are visible without scrolling

6. **Virtual Select** (`vscomp`) for DM/PDM dropdown — width 180px, has search + clear

7. **Sticky column:** Project column stays fixed on horizontal scroll (CSS: `position: sticky; left: 0; z-index: 2`)

8. **Row click** should open a right-side drawer/fly-in panel (not a new page)
