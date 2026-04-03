# DamcoWorks – Customer List Page: Complete UI/UX Documentation

> **Application:** DamcoWorks (OutSystems)
> **Page URL:** `/DamcoWorks/Customer_List`
> **Page Title:** Customer_List
> **Logged-in User:** Varun Mishra – Software Engineer II

---

## 1. Overall Theme & Design System

### Brand & Color Palette

| Element | Color / Style |
|---|---|
| Primary brand color | Dark red / crimson (`#B5121B` approx.) |
| Logo | "DamcoWorks" logotype with "DW" monogram in top-left |
| Left sidebar background | Dark charcoal / near-black (`#1E1E2E` approx.) |
| Sidebar icon – active state | Red/crimson icon on dark background |
| Main content background | White / off-white |
| Header bar | White, fixed at top |
| KPI card background | Light grey/white with subtle drop shadow |
| Table header background | Light grey (`#F5F5F5` approx.) |
| Table row hover | Light grey highlight |
| Primary buttons | Red/crimson fill, white text (e.g., Apply, Clear Filters) |
| Secondary buttons | White fill, grey border (e.g., Cancel) |
| Active filter tag | Light grey badge with "×" close icon |
| Tier badge – Red Carpet | Red fill, white star icon (★) |
| Tier badge – Gold | Yellow/gold fill, white star icon (★) |
| Tier badge – Strategic | Blue fill, white star icon (★) |
| Project Health – Healthy | Green filled circle (●) |
| Project Health – Caution | Amber/orange filled circle (●) |
| Project Health – At Risk | Red filled circle (●) |
| CSAT detail button | Light blue rounded pill |
| Customer avatar | Colored circular avatar with 2-letter white initials |
| Currency/toggle switches | Dark pill toggle switch |
| Fullscreen active button | Red border highlight |

### Typography
- Sans-serif font family throughout (Inter or similar)
- Page headers: medium weight
- Table column headers: semi-bold, with sort/filter icons inline
- Data cells: regular weight, slightly smaller than headers
- KPI primary values: large, bold numerals
- Filter/badge labels: small, regular
- Tooltips: small text, dark background, rounded bubble

### Layout Structure
```
┌──────────────────────────────────────────────────────────────────┐
│                     TOP HEADER BAR (fixed)                       │
│  [DW Logo + DamcoWorks]                    [User: Varun Mishra]  │
├─────────┬────────────────────────────────────────────────────────┤
│  LEFT   │  KPI CAROUSEL (5 cards: Prev ← [cards] → Next)        │
│  SIDE-  ├────────────────────────────────────────────────────────┤
│  BAR    │  TOOLBAR: [My/All Toggle]  [INR/USD] [🔍] [⬇️] [⛶]   │
│         ├────────────────────────────────────────────────────────┤
│ Customers│ FILTER BAR: Filters: [Customer Status: Active ×]  [Clear Filters] │
│ Delivery├────────────────────────────────────────────────────────┤
│ Projects│  DATA GRID (horizontally scrollable, 16 columns)       │
│ People  │  ┌──────┬────────────┬─────────┬─────┬───── ...       │
│ Bench   │  │ Cust │ Bkd Sales  │ Revenue │ PH  │ ...            │
│         │  ├──────┼────────────┼─────────┼─────┼─────           │
│         │  │ rows │            │         │     │                 │
│         │  └──────┴────────────┴─────────┴─────┴─────           │
│         ├────────────────────────────────────────────────────────┤
│         │  PAGINATION: [Items/page: 25▼]  [1 to 25 of 173]  [‹ 1 2 3 … 7 ›] │
├─────────┴────────────────────────────────────────────────────────┤
│  FOOTER: © Damcoworks  |  Privacy Statement  Copyright  T&C      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Page Sections – Detailed Description

### 2.1 Top Header Bar (Banner)

| Element | Details |
|---|---|
| Logo | "DW" monogram + "DamcoWorks" text (top-left). Acts as home link. |
| User avatar | Circular profile image with "USER HOT" badge indicator |
| User name | "Varun Mishra" displayed in bold |
| User title | "Software Engineer II" in smaller text |
| Dropdown arrow | Chevron (▾) next to name – likely expands to profile/logout options |

---

### 2.2 Left Sidebar Navigation

Vertical icon+label menu. Collapsible (hamburger toggle at top).

| Icon | Label | Route | Notes |
|---|---|---|---|
| 👤 | Customers | `/DamcoWorks/Customer_List` | **Active page** – highlighted in red |
| 📦 | Delivery | `/DamcoWorks/Delivery` | |
| 📁 | Projects | `/DamcoWorks/MyProjects` | |
| 👥 | People | `/DamcoWorks/Overview` | |
| 🪑 | Bench | `/DamcoWorks/Bench` | |

Active page item shows red icon + red left border or background highlight.

---

### 2.3 KPI Summary Card Carousel

Five summary metric cards in a horizontal carousel. Navigation via **Previous** (‹) and **Next** (›) arrow buttons on either side.

#### Card 1 – Active Projects
| Field | Value |
|---|---|
| Title | Active Projects |
| Subtitle | "Excluded 16 DamcoIP Project(s)" |
| Primary Value | **343** |
| Breakdown | 253 ● Healthy (green) / 78 ● Caution (orange) / 12 ● At Risk (red) |
| Footer | "2 added & 0 closed this month" |
| Icon | Red circular icon (person/project silhouette) |

#### Card 2 – New Logos
| Field | Value |
|---|---|
| Title | New Logos ℹ️ |
| Subtitle | CFY (Apr-Mar) |
| Primary Value | **74** |
| Footer | "(1) acquired this month" |
| Tooltip | "Customers who have been onboarded during the current financial year. A customer is considered a 'New Logo' if their first engagement was booked within this financial year, and they retain this status throughout the year." |
| Link | Value is clickable (navigates to filtered view) |

#### Card 3 – Booked Sales
| Field | Value |
|---|---|
| Title | Booked Sales ℹ️ |
| Subtitle | CFY (Apr-Mar) |
| Primary Value | **$6.68M** |
| Tooltip | "The total value of contracts booked within the current financial year, which spans from April to March." |
| Link | Value is clickable |

#### Card 4 – Revenue
| Field | Value |
|---|---|
| Title | Revenue ℹ️ |
| Subtitle | CFY (Apr-Mar) |
| Primary Value | **$2.34M** |
| Tooltip | "Sum of all invoices generated, excluding written-off or voided invoices, regardless of payment status." |
| Link | Value is clickable |

#### Card 5 – Active Customers
| Field | Value |
|---|---|
| Title | Active Customers ℹ️ |
| Primary Value | **173** |
| Tooltip | "Customers who currently have at least one active engagement or project with the organization." |
| Link | Value is clickable |

---

### 2.4 Toolbar

A full-width control row between the KPI cards and filter bar.

#### Left Side
- **"My Customers" ← [Toggle Switch] → "All Customers"**
  - Dark pill toggle switch
  - Default position: **All Customers** (toggle is ON / right)
  - When switched to "My Customers": filters list to only the logged-in user's assigned customers
  - When "All Customers": shows full list (default)

#### Right Side (left to right)
| Control | Icon/Label | Type | Behavior |
|---|---|---|---|
| Currency Toggle | `INR ● USD` | Toggle switch | Switches all monetary values in the grid between INR and USD display. Default = USD. |
| Search | 🔍 | Icon button | Expands an inline search input: placeholder = "Please type customer name here". Has a submit (search) button. Collapses when Escape is pressed or focus leaves. |
| Download | ⬇️ | Icon button | Triggers download/export of current filtered customer list (likely Excel .xlsx or CSV). |
| Fullscreen | ⛶ | Icon button | Toggles an expanded/fullscreen view of the data grid (collapses surrounding UI). Active state = red border on button icon. Click again to exit fullscreen. |

---

### 2.5 Active Filters Bar

A persistent row displayed below the toolbar whenever any filter is active.

| Element | Description |
|---|---|
| "Filters:" label | Static grey label on the left |
| Filter tag badges | Removable pill badges showing each applied filter. Format: `Column Name : Value ×` |
| "×" on each tag | Removes only that specific filter |
| "Clear Filters" button | Red filled button — removes ALL active filters at once |

**Default page load state:** `Customer Status : Active ×` is pre-applied.

Multiple filters can be active simultaneously and appear as multiple tags side by side.

---

### 2.6 Data Grid

The main customer data table. Horizontally scrollable. Default sort: Revenue (CFY Apr-Mar) Descending. Shows 25 rows per page by default (173 total records in Active state).

#### Full Column Specification

| # | Column Header | Data Type | Sortable | Has Filter | Filter Input Type |
|---|---|---|---|---|---|
| 1 | Customer | Text + Hyperlink | ✅ (↕) | ✅ | Dropdown: Select / Customer / Status |
| 2 | Booked Sales – CFY (Apr-Mar) ℹ️ | Currency (K/M) | ✅ (↕) | ✅ | Dropdown: --Select-- / Range / Greater Then / Less Then |
| 3 | Revenue – CFY (Apr-Mar) ℹ️ | Currency (K/M) | ✅ (↕) | ✅ | Dropdown: --Select-- / Range / Greater Then / Less Then |
| 4 | Project Health ℹ️ | Visual dot indicators | ❌ | ❌ | Info tooltip only (no filter) |
| 5 | At Risk ℹ️ | Boolean indicator | ✅ (↕) | ❌ | Info tooltip only (no filter) |
| 6 | Tier | Colored badge | ✅ (↕) | ✅ | Text input (free-text search) |
| 7 | CSAT | Numeric score + button | ✅ (↕) | ✅ | Dropdown: --Select-- / Range / Greater Then / Less Then |
| 8 | Sales Owner | Text | ✅ (↕) | ✅ | Text input (free-text search) |
| 9 | Client Partner | Text | ✅ (↕) | ✅ | Text input (free-text search) |
| 10 | CP Ownership | Checkbox (read-only) | ✅ (↕) | ✅ | Dropdown: --Select-- / True / False |
| 11 | Incentive Eligibility | Checkbox (read-only) | ❌ | ✅ | Dropdown: --Select-- / True / False |
| 12 | Client Co-Partner | Text | ✅ (↕) | ✅ | Text input (free-text search) |
| 13 | DM/PDM | Text + overflow badge | ✅ (↕) | ✅ | Text input (free-text search) |
| 14 | Industry | Text | ✅ (↕) | ✅ | Text input (free-text search) |
| 15 | Referenceable | Checkbox (read-only) | ✅ (↕) | ✅ | Dropdown: --Select-- / True / False |
| 16 | Customer Status | Text | ✅ (↕) | ✅ | Dropdown: --Select-- / Active / [other statuses] |

---

#### Per-Row Data Elements

Each customer row contains the following 19 data elements:

1. **Customer Avatar** – Circular badge with 2-letter initials (e.g., "CC", "SM", "SL"). Background color is consistent per customer (appears hash-assigned). White text on colored background.

2. **Customer Name** – Hyperlink text. Clicking opens the Customer Detail page in a **new browser tab**: `/DamcoWorks/CustomerDetailDelivery?CustomerId={id}`

3. **Status Label** – Inline text in grey parentheses: `(Active)`, `(Inactive)`, etc.

4. **(New) Badge** – Optional small grey inline badge: `(New)` — displayed only for customers newly onboarded within the current financial year.

5. **Booked Sales** – Currency in abbreviated K format (e.g., `$200.38K`). Displayed in **green text**.

6. **Revenue** – Currency in abbreviated K format (e.g., `$258.59K`). Displayed in **green text**.

7. **Project Health Dots** – A series of colored dot indicators showing project health counts:
   - Format: `N ● (green) N ● (orange) N ● (red)`
   - N = number of projects in that health state
   - Tooltip on column header explains: Green = Healthy, Orange = Caution, Red = At Risk

8. **At Risk Indicator** – Visual indicator. Empty cell means no at-risk projects.

9. **Tier Badge** – Colored badge with star prefix:
   - `★ Red Carpet` — Red badge background
   - `★ Gold` — Yellow/gold badge background
   - `★ Strategic` — Blue badge background

10. **CSAT Score** – Numeric score displayed as `X/5` (e.g., `4/5`, `5/5`, `3/5`). If no CSAT data: shows `--`.

11. **CSAT "=" Button** – Light blue rounded pill button next to the score. Clicking opens the **CSAT Survey Modal Popup**. Only shown when a CSAT score exists.

12. **Sales Owner** – Full name of the assigned Sales Owner (e.g., "Neha Panchal", "Andrew M Spada").

13. **Client Partner** – Full name of the assigned Client Partner (e.g., "Mohit Gupta", "Vineet Kumar"). May be empty.

14. **CP Ownership** – Read-only checkbox. Grey unchecked square = not confirmed. (No green check in most rows.)

15. **Incentive Eligibility** – Read-only checkbox. Green ✅ = eligible. Empty = not eligible.

16. **Client Co-Partner** – Name of co-partner (optional, many rows are empty).

17. **DM/PDM** – Name of Delivery Manager/Project Delivery Manager. May include a **`+N` overflow badge** (e.g., `+6`, `+1`) in blue indicating additional DMs. Hover/click badge to see all. Also shows the practice/business unit in parentheses (e.g., `(ITeS)`, `(Technology Services)`, `(Salesforce)`).

18. **Industry** – Industry category text (e.g., Insurance, Hi-Tech, Manufacturing, Transportation and logistics, Financial Services, Publishing and Media, Health and Social Care).

19. **Referenceable** – Read-only checkbox. Green ✅ = referenceable. Empty = not referenceable.

20. **Customer Status** – Text status (e.g., "Active").

---

### 2.7 Column Sorting Details

| State | Visual Indicator | Behavior |
|---|---|---|
| Unsorted | ↕ (up-down arrows) | Both arrows shown |
| Ascending | ↑ | Click column header once |
| Descending | ↓ | Click column header again |
| Default | Revenue (CFY Apr-Mar) – Descending | Pre-applied on page load |

---

### 2.8 Column Filter Details

#### How Filters Work (UX Flow):
1. Click the **funnel (▼) icon** next to a column header
2. A **filter popup** appears inline (dropdown or text input depending on column)
3. Select/enter the filter value
4. Click **Apply** (red button) to apply → filter tag appears in the Active Filters Bar
5. Click **Cancel** (white/grey button) to close without applying
6. Applied filters show as tags: `Column Name : Value ×`
7. The column's funnel icon turns **highlighted/red** when a filter is active

#### Filter Types by Column:

**Dropdown: Select / Customer / Status** (Customer column)
- Sort/group the Customer column by name or status

**Dropdown: --Select-- / Range / Greater Then / Less Then** (Booked Sales, Revenue, CSAT)
- Range: enter a min and max numeric value
- Greater Then: enter a single numeric threshold
- Less Then: enter a single numeric threshold

**Text Input (free-text search)** (Tier, Sales Owner, Client Partner, Client Co-Partner, DM/PDM, Industry)
- A plain text input field
- Enter a string; Apply filters by partial/full text match

**Dropdown: --Select-- / True / False** (CP Ownership, Incentive Eligibility, Referenceable)
- True = checkbox is checked
- False = checkbox is unchecked

**Dropdown: --Select-- / Active / [other statuses]** (Customer Status)
- Filter by customer lifecycle status

---

### 2.9 CSAT Survey Modal Popup

Triggered by clicking the **"="** button (light blue pill) in the CSAT column.

| Element | Details |
|---|---|
| Modal title | "CSAT Survey" |
| Customer name | Shown as subtitle below the title |
| Close button | × icon in the top-right corner of the modal |
| Modal backdrop | Grey overlay behind modal |
| Table columns | Score | POC (Point of Contact) | Response Date | Testimonials |
| Score format | Decimal number (e.g., 5.00) |
| POC | Name of the person who responded (e.g., "Annabel Phillips") |
| Response Date | Formatted date (e.g., "09 Jun 2025") |
| Testimonials | Text feedback / testimonial message (may be empty) |
| Multiple rows | One row per survey submission; multiple entries possible |

---

### 2.10 Pagination Bar

Located at the bottom of the page, below the data grid.

| Control | Details |
|---|---|
| "Items per page" label | Static label on the left |
| Page size dropdown | Options: **5**, **10**, **15**, **20**, **25** (default), **100** |
| Record counter | Dynamic text: "1 to 25 of 173 items" |
| Previous page button (‹) | Navigates to the previous page; disabled on page 1 |
| Page number buttons | Numbered buttons: 1, 2, 3, 4, … (ellipsis), 7 (last page) |
| Next page button (›) | Navigates to the next page; disabled on last page |
| Active page | Currently active page number is highlighted (filled dark background) |

---

### 2.11 Footer

Fixed at the bottom of the viewport.

| Element | Details |
|---|---|
| Copyright text | "© Damcoworks. All Rights Reserved" (left-aligned) |
| Privacy Statement | Link (right area) |
| Copyright | Link (right area) |
| Terms & Conditions | Link (right area) |

---

## 3. Functionality Summary

### 3.1 Navigation

| Action | Behavior |
|---|---|
| Click sidebar "Customers" | Stays on Customer List page (currently active) |
| Click sidebar "Delivery" | Navigates to `/DamcoWorks/Delivery` |
| Click sidebar "Projects" | Navigates to `/DamcoWorks/MyProjects` |
| Click sidebar "People" | Navigates to `/DamcoWorks/Overview` |
| Click sidebar "Bench" | Navigates to `/DamcoWorks/Bench` |
| Click customer name in grid | Opens `/DamcoWorks/CustomerDetailDelivery?CustomerId={id}` in a **new tab** |
| Click KPI card values | Navigates to filtered/drill-down views (linked via `href="#"`) |
| Click DamcoWorks logo | Navigates to home/main page |

---

### 3.2 Filtering

| Filter | Behavior |
|---|---|
| My Customers / All Customers toggle | Switches between personal and full customer list view |
| Column filter (funnel icon) | Opens inline popup; Apply/Cancel buttons; adds tag to filter bar |
| Active filter tag "×" | Removes that single specific filter immediately |
| "Clear Filters" button | Removes ALL active filters at once |
| Default load filter | Customer Status: Active (pre-applied) |
| Multiple simultaneous filters | Supported; all shown as separate tags |
| Numeric filter (Range) | Requires min and max value inputs |
| Numeric filter (Greater Then / Less Then) | Requires single numeric threshold |
| Text filter | Free-text partial/full match |
| Boolean filter | True / False dropdown |
| Status filter | Single-select dropdown |

---

### 3.3 Search

| Feature | Details |
|---|---|
| Trigger | Click the 🔍 magnifying glass icon in the toolbar (right side) |
| Input appearance | Inline text input expands with placeholder: "Please type customer name here" |
| Submit | Click the search button (🔍) within the expanded input, or press Enter |
| Scope | Searches by customer name |
| Dismiss | Press Escape key or click away from the search input |
| After search | Results filter the data grid; search term may appear as active filter tag |

---

### 3.4 Download / Export

| Feature | Details |
|---|---|
| Trigger | Click the ⬇️ download icon in the toolbar (right side) |
| Scope | Exports the **currently filtered** customer list |
| Format | Likely Microsoft Excel (.xlsx) or CSV — standard OutSystems export behavior |
| Behavior | Browser download initiates immediately |

---

### 3.5 Currency Toggle

| Feature | Details |
|---|---|
| Options | INR ← [Toggle] → USD |
| Default | USD (toggle is on right/USD side) |
| Effect | All monetary columns (Booked Sales, Revenue) and KPI cards switch between INR and USD display format |

---

### 3.6 Fullscreen Toggle

| Feature | Details |
|---|---|
| Trigger | Click the ⛶ expand/fullscreen icon in the toolbar (rightmost) |
| Effect | Expands the data grid to a larger/fullscreen view, collapsing or hiding surrounding UI elements |
| Active state | Button gets a **red border** highlight when fullscreen is active |
| Toggle off | Click the same button again to return to normal view |

---

### 3.7 Sorting

| Feature | Details |
|---|---|
| Sortable columns | Customer, Booked Sales, Revenue, At Risk, Tier, CSAT, Sales Owner, Client Partner, CP Ownership, DM/PDM, Industry, Referenceable, Customer Status |
| Non-sortable columns | Project Health, Incentive Eligibility |
| Trigger | Click on the column header text |
| Toggle behavior | Click once = ascending; click again = descending |
| Visual indicators | ↕ = unsorted, ↑ = ascending, ↓ = descending |
| Default sort | Revenue CFY (Apr-Mar) — Descending |

---

### 3.8 CSAT Survey Popup

| Feature | Details |
|---|---|
| Trigger | Click the "=" pill button in the CSAT column of any row |
| Visibility | Only shown when a CSAT score exists for that customer |
| Display | Modal overlay with table of survey responses |
| Data shown | Score (e.g., 5.00), POC name, Response Date, Testimonials text |
| Multiple entries | Can show multiple rows for multiple survey responses |
| Close | Click the × button in the top-right of the modal |

---

### 3.9 Pagination

| Feature | Details |
|---|---|
| Default page size | 25 items per page |
| Available page sizes | 5, 10, 15, 20, 25, 100 |
| Total records (default Active filter) | 173 items |
| Total pages (25 per page) | 7 pages |
| Navigation | Numbered page buttons + Previous (‹) / Next (›) arrows |
| Filter impact | Changing filters updates total count and resets to page 1 |
| Persistence | Filters persist when navigating between pages |

---

### 3.10 Tooltip Info Icons (ℹ️)

| Location | Tooltip Text |
|---|---|
| New Logos card | "Customers who have been onboarded during the current financial year. A customer is considered a 'New Logo' if their first engagement was booked within this financial year, and they retain this status throughout the year." |
| Booked Sales card | "The total value of contracts booked within the current financial year, which spans from April to March." |
| Revenue card | "Sum of all invoices generated, excluding written-off or voided invoices, regardless of payment status." |
| Active Customers card | "Customers who currently have at least one active engagement or project with the organization." |
| Booked Sales column | Same as card tooltip above |
| Revenue column | Same as card tooltip above |
| Project Health column | Legend: Healthy (green ●) / Caution (orange ●) / At Risk (red ●) |
| At Risk column | "A customer is considered 'At Risk' if any of their active projects are currently marked as 'red' or caution status." |

---

## 4. Customer Detail Page (Linked Page Overview)

**URL Pattern:** `/DamcoWorks/CustomerDetailDelivery?CustomerId={id}`

Opens in a **new browser tab** when clicking any customer name.

### Header Section
| Element | Details |
|---|---|
| Breadcrumb | Customers / Delivery |
| Left panel sub-navigation | Delivery (active) | Stakeholders | Client Connects | Logs |
| Company placeholder image | Grey silhouette avatar (no company logo) |
| Company name | Bold large text (e.g., "Cube Content Governance Global Limited") |
| Industry | Labelled field (e.g., "Business Consulting Services") |
| Sales Owner | Labelled name (e.g., "Neha Panchal") |
| Client Partner | Labelled name with pencil edit icon (e.g., "Mohit Gupta ✏️") |

### KPI Mini-Cards (on detail page)
| Card | Value |
|---|---|
| Booked Sales (CFY Apr-Mar) | e.g., $200.38K |
| Revenue (CFY Apr-Mar) | e.g., $258.65K |

### Projects Sub-Table
| Column | Description |
|---|---|
| Project | Project name (hyperlink) |
| Overall Health | Badge: Healthy (green) / Caution (yellow-orange) / At Risk (red-pink) / Inactive (grey) |
| Financial Health | Badge: same color system |
| Service Quality | Badge: same color system |
| Project Pulse by AI | AI-generated short summary text with headline (e.g., "Holding steady for now", "Progress on the right track") |
| Delivery Thoughts | Manual delivery update text + author name + timestamp |
| Status | Badge: Active (green) / Inactive (grey) |
| Total Revenue | Currency value |

### Projects Table Toolbar
| Control | Details |
|---|---|
| INR/USD toggle | Same currency toggle as main page |
| Search icon | Searches by project name |
| Download icon | Exports project list |
| Display icon | Column visibility settings (show/hide columns) |

### Projects Pagination
| Feature | Details |
|---|---|
| Default page size | 5 items |
| Unique headcount | Shown in brackets: "Project List (Unique Headcount: 125)" |
| Revenue scope label | "Revenue & Cost: FP – since project start; BYT/T&M – last 12 months" |

---

## 5. User Scenarios & Use Cases

| # | Scenario | Steps |
|---|---|---|
| 1 | View all active customers | Page loads with Customer Status: Active pre-applied; 173 records shown |
| 2 | Switch to my own customers | Click "My Customers" side of the toggle switch |
| 3 | Filter by a specific tier | Click funnel icon (▼) in Tier column → type tier name (e.g., "Gold") → Click Apply |
| 4 | Filter by revenue range | Click funnel (▼) in Revenue column → select "Range" → enter min/max → Apply |
| 5 | Filter customers greater than a sales value | Click funnel (▼) in Booked Sales column → select "Greater Then" → enter value → Apply |
| 6 | Filter by Sales Owner | Click funnel (▼) in Sales Owner column → type name → Apply |
| 7 | Filter only referenceable customers | Click funnel (▼) in Referenceable column → select "True" → Apply |
| 8 | Filter by CP Ownership confirmed | Click funnel (▼) in CP Ownership column → select "True" → Apply |
| 9 | Search for a specific customer | Click 🔍 toolbar icon → type customer name → press Enter |
| 10 | Export the filtered list | Click ⬇️ download icon → file downloads to browser |
| 11 | View CSAT survey responses | Click "=" pill button in CSAT column of any customer row → popup modal |
| 12 | Drill into a customer's detail | Click the customer's name hyperlink → new tab opens at CustomerDetailDelivery |
| 13 | Sort by Booked Sales descending | Click "Booked Sales" column header once (ascending), click again (descending) |
| 14 | Remove a specific filter | Click "×" on a specific filter tag in the Active Filters Bar |
| 15 | Clear all active filters | Click the red "Clear Filters" button |
| 16 | Switch to INR display | Click INR side of the INR/USD toggle switch in the toolbar |
| 17 | Change items shown per page | Use "Items per page" dropdown at bottom → select 5/10/15/20/25/100 |
| 18 | Navigate to page 3 | Click page number "3" in the pagination bar |
| 19 | Expand grid to fullscreen | Click ⛶ icon (rightmost toolbar button); red border confirms active |
| 20 | Read a column definition | Hover over any ℹ️ info icon on column headers or KPI cards |

---

## 6. Technical Notes for Rebuilding on Another Platform

| Aspect | Details |
|---|---|
| Original platform | OutSystems (low-code platform) |
| Recommended rebuild stacks | React + TypeScript, Angular, Vue.js, or similar SPA frameworks |
| Routing | URL parameter pattern: `?CustomerId={id}` for detail pages |
| Financial year convention | April–March (Indian FY) |
| Monetary abbreviations | K = thousands, M = millions |
| Default filter on load | Customer Status: Active must be pre-applied on page initialization |
| Checkbox columns | CP Ownership, Incentive Eligibility, Referenceable are **read-only** in list view |
| Avatar colors | Consistent per customer – recommend hashing customer ID to select from a predefined color palette |
| CSAT score scale | X out of 5 (e.g., 4/5 = 4 out of 5) |
| DM/PDM overflow | Shows "+N" badge when more than 1 DM exists; expanding reveals all names |
| Customer link behavior | Opens in a new browser tab (target="_blank") |
| Filters | Applied server-side or via API; persist across page navigation within session |
| Grid scroll | Horizontal scroll on data grid only; vertical scroll for rows |
| KPI cards | Carousel (slider) behavior with previous/next arrow buttons; 5 cards total |
| Currency toggle | Must affect all monetary fields simultaneously (Booked Sales, Revenue, KPI cards) |
| Tier values | Possible values observed: Red Carpet, Gold, Strategic |
| Industry values observed | Insurance, Hi-Tech, Manufacturing, Transportation and logistics, Financial Services, Publishing and Media, Health and Social Care, Business Consulting Services, Automotive, Energy and Utilities |
| CSAT popup | Modal dialog overlay; table of survey responses; no editing capability |
| Download scope | Exports currently filtered/searched results, not the full unfiltered dataset |
| Fullscreen | Toggles expanded state; typically hides sidebar/header for more grid space |
| Session | User is pre-authenticated (Varun Mishra – Software Engineer II) |

---

## 7. Component Checklist for Rebuild

- [ ] Fixed top header bar with logo + user profile dropdown
- [ ] Collapsible left sidebar with 5 navigation items + active state highlighting
- [ ] KPI carousel (5 cards) with previous/next navigation and info tooltips
- [ ] Toolbar: My/All Customers toggle, INR/USD currency toggle, search input, download button, fullscreen toggle
- [ ] Active filter tags bar with individual "×" remove and global "Clear Filters" button
- [ ] Data grid with 16 columns, horizontal scroll, sticky Customer column (optional)
- [ ] Column sort indicators (↕ / ↑ / ↓) with click-to-sort toggle behavior
- [ ] Per-column filter popups with Apply/Cancel actions
- [ ] Filter types: text input, numeric (range/gt/lt), boolean (true/false), status dropdown
- [ ] Customer avatar component (2-letter initials, hash-colored circles)
- [ ] Tier badge component (3 variants: Red Carpet, Gold, Strategic)
- [ ] Project Health dot indicator component (green/orange/red dots with counts)
- [ ] CSAT score display with "=" button trigger
- [ ] CSAT Survey modal popup (table: Score, POC, Response Date, Testimonials)
- [ ] Read-only checkbox display (CP Ownership, Incentive Eligibility, Referenceable)
- [ ] DM/PDM overflow badge (+N) component
- [ ] (New) customer badge indicator
- [ ] Pagination bar (items per page dropdown + page navigation)
- [ ] Footer with copyright + legal links
- [ ] Customer Detail page (separate route) with delivery, stakeholders, client connects, logs tabs
- [ ] Tooltip component for ℹ️ icons

---

*Document generated via automated UI analysis of the DamcoWorks Customer_List page.*
*Analysis date: March 2026*
