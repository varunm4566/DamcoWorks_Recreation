# Customer Detail Screen — Full Specification

> **Customer:** Cube Content Governance Global Limited
> **URL Pattern:** `/DamcoWorks/CustomerDetailDelivery?CustomerId={CustomerId}`
> **Application:** DamcoWorks (OutSystems)
> **Date Documented:** March 29, 2026

---

## Table of Contents
1. [Global Header & Navigation](#1-global-header--navigation)
2. [Left Sidebar — List of Sections](#2-left-sidebar--list-of-sections)
3. [Customer Header Card (Shared Across All Sections)](#3-customer-header-card-shared-across-all-sections)
4. [Section: Delivery](#4-section-delivery)
   - 4.1 [Projects Accordion](#41-projects-accordion)
   - 4.2 [Current FY Revenue Accordion](#42-current-fy-revenue-accordion)
   - 4.3 [Profit Margin Accordion](#43-profit-margin-accordion)
   - 4.4 [Lifetime Revenue Accordion](#44-lifetime-revenue-accordion)
   - 4.5 [Billing Milestones and Invoices Accordion](#45-billing-milestones-and-invoices-accordion)
   - 4.6 [Bookings Accordion](#46-bookings-accordion)
5. [Section: Stakeholders](#5-section-stakeholders)
6. [Section: Logs (Activities)](#6-section-logs-activities)
7. [Common UI Patterns & Components](#7-common-ui-patterns--components)
8. [Backend & API Notes](#8-backend--api-notes)

---

## 1. Global Header & Navigation

### Top Navigation Bar
- **Left:** Application logo (DamcoWorks icon / three red dots)
- **Center:** Main navigation menu:
  - Customers (links to `/DamcoWorks/Customer_List`)
  - Delivery (links to `/DamcoWorks/Delivery`)
  - Projects (links to `/DamcoWorks/MyProjects`)
  - People (links to `/DamcoWorks/Overview`)
  - Bench (links to `/DamcoWorks/Bench`)
- **Right:** Logged-in user avatar + name + role (e.g., "Varun Mishra / Software Engineer II")
  - Clicking user name shows a dropdown with logout/profile options

### Breadcrumb
- Format: `Customers / {SectionName}`
- "Customers" is a clickable link back to Customer_List
- Section name is the current active section (e.g., "Delivery", "Stakeholders", "Activities")

---

## 2. Left Sidebar — List of Sections

- **Header:** "List of Sections" with a collapse toggle icon (hamburger-style)
- **Sections Listed:**
  1. **Delivery** — navigates to `/DamcoWorks/CustomerDetailDelivery?CustomerId={id}`
  2. **Stakeholders** — navigates to `/DamcoWorks/CustomerDetailStakeholder?CustomerId={id}`
  3. **Client Connects** — navigates to `/DamcoWorks/CustomerDetailKSOConnect?CustomerId={id}`
  4. **Logs** — navigates to `/DamcoWorks/CustomerDetailActivities?CustomerId={id}`
- Active section is highlighted in red/maroon with left border indicator
- Sidebar is collapsible via the toggle icon (collapses to icon-only state)
- All navigation is SPA-style (page reload to new URL but same layout)

---

## 3. Customer Header Card (Shared Across All Sections)

Displayed at the top of every section page. Contains:

| Element | Description |
|---|---|
| **Avatar** | Placeholder user image (circular, grey default avatar) |
| **Company Name** | E.g., "Cube Content Governance Global Limited" (large bold heading) |
| **Industry** | Label + value, e.g., "Business Consulting Services" (bold) |
| **Sales Owner** | Clickable pill/badge button (e.g., "Neha Panchal") — shows tooltip with full name on hover |
| **Client Partner** | Clickable pill/badge link (e.g., "Mohit Gupta") with pencil/edit icon — clicking opens a Client Partner selection modal (searchable multi-select list with Cancel/Save) |
| **Booked Sales KPI Card** | Title: "Booked Sales" + info (i) icon, Sub-label: "CFY (Apr-Mar)", Value: e.g., "$200.38K", Icon: people/contract icon. Tooltip on i: "The total value of contracts booked within the current financial year, which spans from April to March." |
| **Revenue KPI Card** | Title: "Revenue" + info (i) icon, Sub-label: "CFY (Apr-Mar)", Value: e.g., "$258.65K", Icon: invoice icon. Tooltip on i: "Sum of all invoices generated, excluding written-off or voided invoices, regardless of payment status." |

---

## 4. Section: Delivery

**URL:** `/DamcoWorks/CustomerDetailDelivery?CustomerId={id}`
**Page Title:** "Delivery"

The Delivery page contains 6 accordion sections within the Projects area. All accordions can be independently expanded/collapsed.

---

### 4.1 Projects Accordion

**Label:** "Projects"

#### Project List Sub-header
- **Title:** "Project List" + parenthetical: "(Unique Headcount: 125)" — shows total unique headcount across all projects
- **Sub-label:** "Revenue & Cost: FP – since project start; BYT/T&M – last 12 months" (explains revenue calculation methodology)

#### Project List Toolbar (top-right controls)
| Control | Type | Behavior |
|---|---|---|
| **INR/USD toggle** | Checkbox toggle switch | Switches currency display between INR and USD across the entire Project List table |
| **Search icon** | Icon button | Opens an inline search bar with placeholder "Please type project name here" + search submit button. Filters table by project name. |
| **Download icon** | Icon button | Downloads the project list data as a file (CSV/Excel) |
| **Display button** | Button with grid icon | Opens a "Display Columns" dropdown panel showing all available columns as toggleable chips. Current default: Project, Overall Health, Financial Health, Service Quality Health, AI Insights, Thoughts, Total Revenue, Total Cost, Profit Margin, Status. Optional columns: Division, Department, Duration, Model, Onsite Delivery Manager, Tech Lead, Delivery Manager, Project Lead, Program Manager, Contracts, Work Status, Delivery Head. Panel has "Reset to Default" button and "Apply" button. |

#### Project List Table Columns (Horizontally Scrollable)
The table has a **horizontal scrollbar** to accommodate all columns. Default visible columns:

| Column | Sortable | Filterable | Description |
|---|---|---|---|
| **Project** | Yes | Yes (text filter) | Project name — clickable link. Clicking opens Overall Health / Service Quality popup modal |
| **Overall Health** | Yes | Yes (dropdown) | Color-coded badge: Green=Healthy, Amber=Caution, Red=At Risk. Clicking opens Service Quality Popup |
| **Financial Health** | Yes | Yes (dropdown) | Color-coded badge. Clicking opens Financial Health Popup |
| **Service Quality** | Yes | Yes (dropdown) | Color-coded badge. Clicking opens Service Quality details |
| **Project Pulse by AI** | No | No | AI-generated sentiment tag (e.g., "Holding steady for now", "Progress on the right track", "Things are looking good") + brief summary text. Clicking opens Project Pulse by AI Modal |
| **Delivery Thoughts** | No | No | Latest weekly delivery update — shows truncated text + "By: {Author}, at: {timestamp}". Has a chat bubble icon on column header. Row has tooltip with full text on hover. |
| **Status** | Yes | Yes (dropdown) | "Active" (green pill) or "Inactive" (red pill) |
| **Total Revenue** | Yes | Yes (dropdown) | Total revenue amount in selected currency |
| **Total Cost** | Yes | Yes (dropdown) | Total cost amount in selected currency |
| **Profit Margin** | Yes | Yes (dropdown) | Profit margin % |

**Additional columns (via Display toggle):**
- Division, Department, Duration (date range), Model (T&M / FP), Onsite Delivery Manager, Tech Lead, Delivery Manager, Project Lead, Program Manager, Contracts (link icon), Work Status, Delivery Head, Allocation %, Billing %

**Column Sorting:** Click column headers to toggle ascending/descending
**Column Filtering:** Click the funnel icon on filterable columns to open inline filter panel with dropdown or text input + Cancel/Apply buttons

#### Pagination Controls (Project List)
- **Items per page:** Dropdown (5, 10, 15, 20, 25, 100)
- **Current:** "1 to 5 of 7 items" (text display)
- **Navigation:** Previous, Page numbers (1, 2, ...), Next buttons
- **Note:** 7 total projects (5 shown per page by default, 2 on page 2)

---

#### Project Row Clickable Elements

##### Overall Health / Service Quality Popup (clicking Overall Health badge or project name)
- **Modal Header:** Project name + overall health badge (e.g., "Healthy") + info icon
- **Sub-header:** "Engagement Model: T&M"
- **Section: Service Quality**
  - **Delivery Manager** subsection: Shows delivery manager's weekly thoughts (full text)
  - **Margin:** Shows margin % (e.g., "100%") + health badge — Margin info icon has tooltip
  - **Payment Timeliness:** Shows avg delay in days + note "(avg delay based on last five invoices)" + health badge
- **Accordion: Health Score Breakdown** (expandable/collapsible)
  - Table with: Component | Weightage | Earned Score (with info tooltip) | Weighted Score
  - Rows: Service Quality (40%, 100, 40), Margin (25%, 100, 25), Payment Timeliness (35%, 100, 35), Total (100%, -, 100)
- **Close button** (X) top-right

##### Financial Health Popup (clicking Financial Health badge)
- **Modal Header:** Project name + "Engagement Model: T&M"
- **Section: Financial Health** + overall status badge (e.g., "Healthy")
- **Two metric cards side-by-side:**
  - **MARGIN** card: Shows margin % (e.g., "94%"), Target %, Gap value, health dot indicator
  - **PAYMENT TIMELINESS** card: Shows avg delay (e.g., "0 days avg delay"), Violations count
- **Section: Payterm Violations (Last 5 Invoices)** — note: "* Payterm days: 60"
  - Table with columns: Invoice# | Invoice Sent Date | Invoice Due Date | Payment Receive Date | Remarks
  - Status dot indicators (green/amber) per row
  - Remarks examples: "Paid on time", "Not overdue", "Paid X days late (Violation #N)"
- **Accordion: Benchmark** (expandable/collapsible)
  - **Margin Benchmark:** Green: >40%, Amber: 11-40%, Red: <=10%
  - **Payment Benchmark:** Green: Avg delay <=30 days, Amber: Avg delay 31-60 days, Red: Avg delay >60 days
- **Close button** (X)

##### Project Pulse by AI Modal (clicking AI Pulse badge)
- **Modal Header:** Project name
- **Sub-header:** "Customer Name | Client Project | T&M"
- **Two tabs:** "Project Pulse by AI" (active) | "Delivery Thoughts"

**Project Pulse by AI Tab:**
- **AI Highlights** section (purple/themed card):
  - "Re-evaluate" button (top-right) — triggers re-generation of AI analysis
  - AI-generated summary paragraph about project status
  - Color-coded sentiment tag pill (e.g., "Holding steady for now", "Progress on the right track")
  - **Some Immediate actions suggested by AI:** — bulleted list of AI recommendations
  - Example: "Customer feedback missing for the past 2 months; suggest capturing it to improve visibility."

**Delivery Thoughts Tab:**
- Chronological list (newest first) of weekly delivery updates
- Each entry shows: Date header (e.g., "Feb 20, 2026"), Author + role (e.g., "Devinder Singh Rawat (PM Thoughts)"), timestamp (e.g., "6:43PM"), full thought text

---

### 4.2 Current FY Revenue Accordion

**Label:** "Current FY Revenue"
**State:** Expanded by default (can collapse)

#### Toolbar
| Control | Description |
|---|---|
| **All Projects / Active / Inactive** tab buttons | Filters revenue data by project status. "All Projects" has a checkmark when active. |
| **INR/USD toggle** | Switches currency display |
| **Download icon** | Downloads revenue data |

#### Revenue Table Columns
| Column | Sortable | Filterable | Description |
|---|---|---|---|
| **Month** | Yes | Yes | Month-year (e.g., "Jan - 26") |
| **Revenue** | Yes | Yes | Revenue for the month (e.g., "$24.97K") |
| **MOM Change** | Yes | No | Month-over-month % change with trend arrow icon (green up or red down) |
| **Cumulative Revenue** | Yes | Yes | Running total (e.g., "$258.65K") |
| **Projects** | Yes | Yes | Number of active projects contributing |
| **View Breakdown** | No | No | Eye icon button — clicking opens Project Wise Breakdown modal |

**Pagination:** Items per page (5,10,15,20,25,100), "1 to 5 of 10 items", navigation buttons

#### Project Wise Breakdown Modal (View Breakdown eye icon)
- **Header:** "Project Wise Breakdown"
- **Sub-header:** "N Projects | {Month-Year}" (e.g., "4 Projects | Jan - 26")
- **Table:** Project Name | Revenue | Percentage
- Breaks down which project contributed what % of revenue for that month
- **Close button** (X)

---

### 4.3 Profit Margin Accordion

**Label:** "Profit Margin"
**State:** Collapsed by default (expandable by clicking header)

#### Summary Metrics (when expanded)
- **Margin:** % highlighted in color + total profit value in brackets, e.g., "90% ($2,493,129)"
- **Total Revenue:** e.g., "$2,770,721"
- **Total Cost:** e.g., "$275,592"

#### Two Tabs: BYT & T&M | FP

**BYT & T&M Tab:**
- **Time filter button:** "Last 12 Months" (pill button)
- **INR/USD toggle** + **Download icon**
- **Table columns:** Month | Project (count) | Revenue | Cost | Profit | Margin % | Status
  - Margin % highlighted in green color
  - Status shows "All" (mix) or specific status
  - Each row has an **expand (+) / collapse (-) toggle** to show project-level breakdown
  - **Expanded row sub-table:** Month | Project | Revenue | Cost | Profit | Margin % | Status (per project with Active/Inactive badge)
- Column filters on applicable columns
- **Pagination:** Items per page + navigation

**FP Tab (Fixed Price):**
- **Summary line:** "Margin: 100%($403) | Total Revenue: $403 | Total Cost: $0"
- **INR/USD toggle** + **Download icon**
- **Table columns:** Project | Milestone (count) | Start Date | End Date | Booked Value | Cost Till Date | Margin % | Revenue | Status
  - Each row has an **expand (+) toggle** to show milestone-level breakdown
  - **Expanded sub-table:** Project | Milestone name | Start Date | End Date | Booked Value | Revenue | Status
  - Milestone Status badge (e.g., "Payment Received" in teal/cyan)
- Column filters on applicable columns

---

### 4.4 Lifetime Revenue Accordion

**Label:** "Lifetime Revenue"
**Sub-label:** "Onboarded On: {Date} ({Years} Years, {Months} Months)" — e.g., "Onboarded On: Apr 03, 2019 (6 Years, 11 Months)"
**State:** Collapsed by default

#### Toolbar
- **All Projects / Active / Inactive** tab buttons
- **INR/USD toggle**
- **Download icon**

#### Table Columns
| Column | Sortable | Filterable | Description |
|---|---|---|---|
| **FY** | Yes | Yes (text filter: Contains/Starts With/Ends With/Equals) | Financial Year (e.g., "2025-26") |
| **Revenue** | Yes | Yes | Annual revenue (e.g., "$258.59K") |
| **YOY Change** | Yes | No | Year-over-year % change with arrow indicators |
| **Cumulative Revenue** | Yes | Yes | Running cumulative total |
| **Projects** | Yes | Yes | Number of projects in that FY |
| **View Breakdown** | No | No | Eye icon — opens Project Wise Breakdown modal for that year |

**Pagination:** Items per page dropdown, "1 to 5 of 7 items" (7 financial years), navigation

---

### 4.5 Billing Milestones and Invoices Accordion

**Label:** "Billing Milestones and Invoices"
**State:** Collapsed by default

#### Summary Header (when expanded)
- **Total Account Receivables:** Large bold figure (e.g., "$102.63K")
- **INR/USD toggle** + **Download icon**
- **Color-coded metric strip:**
  - Green **Invoiced:** $984.72K
  - Green **Received:** $934.68K
  - Yellow **Outstanding:** $50.04K
  - Red **Overdue:** $25.08K
  - Yellow **To be Invoiced:** $-882.09K (negative indicates over-invoiced/future billing)

#### Project-level Accordions (nested, one per project)
Each project is a collapsible accordion row showing:
- **Header:** "Project: {Project Name}" + Total Invoiced | Total Received | Total Outstanding | Payterm days: {N}
- **Expand toggle:** chevron icon
- **When expanded:** Shows invoice details table

#### Invoice Detail Table (per project, horizontally scrollable)
| Column | Sortable | Filterable | Description |
|---|---|---|---|
| **Milestone** | Yes | No | Milestone name (FP) or billing period |
| **Milestone Due Dt** | Yes | Yes | Milestone due date |
| **Invoice#** | Yes | Yes | Invoice number (e.g., "CUB/1904/0001") |
| **Invoice Dt** | Yes | Yes | Invoice date |
| **Payment Due Dt** | Yes | Yes | Payment due date |
| **Payment Received On** | Yes | Yes | Actual payment receipt date |
| **Invoice Amount** | Yes | No | Invoice value |
| **Days Overdue** | Yes | Yes | Number of days past due date (dash if not overdue) |
| **Status** | Yes | Yes | E.g., "Payment Received" (teal badge) |

**Pagination per project:** Items per page dropdown + status count (e.g., "304 items" for large projects)

---

### 4.6 Bookings Accordion

**Label:** "Bookings"
**Sub-label:** "CFY (Apr-Mar)"
**State:** Collapsed by default

#### Summary Line (when expanded)
- **Total Booked Sales:** (e.g., $200.38K)
- **| New Business:** (e.g., $0.00K)
- **| Existing Business:** (e.g., $200.38K)
- **INR/USD toggle** + **Download icon**

#### Bookings Table Columns (Horizontally Scrollable)
| Column | Sortable | Filterable | Description |
|---|---|---|---|
| **Project** | Yes | Yes | Project name |
| **Engagement Model** | Yes | Yes | T&M or FP |
| **Sales Owner** | Yes | Yes | Assigned sales owner name |
| **Program Manager** | Yes | Yes | Assigned program manager name |
| **Total Booked Sales** | Yes | Yes | Total value booked for CFY |
| **Contract Ending On** | Yes | Yes | Contract end date |
| **Total Invoiced** | Yes | No | Total invoiced against bookings |

Each row has an **expand (+) toggle** showing month-wise booking breakdown:
- **Sub-table columns:** Month | Booked (NN — New Names) | Booked (EN — Existing Names) | Booked (EE — Existing Expansion)

---

## 5. Section: Stakeholders

**URL:** `/DamcoWorks/CustomerDetailStakeholder?CustomerId={id}`
**Page Title:** "Stakeholders"
**Breadcrumb:** Customers / Stakeholders

### Stakeholders Tab
- Single tab: "Stakeholders" (underlined/active indicator)
- **"Manage Stakeholders" button** (top-right) — opens the Manage Stakeholders modal

### Stakeholders Table (Horizontally Scrollable)
| Column | Sortable | Filterable | Description |
|---|---|---|---|
| **Name** | Yes | Yes | Full name of stakeholder |
| **Designation** | Yes | Yes | Job title (e.g., "Publishing Operations Director", "QA Analyst") |
| **Relationship Type** | Yes | Yes | Type of relationship (e.g., "Sales SPOC", "Delivery SPOC", "Accounting SPOC") |
| **Stakeholder Role** | Yes | Yes | Role classification (e.g., "Decision Maker") |
| **Email** | Yes | Yes | Email address |
| **Contact Number** | Yes | Yes | Phone number |
| **Last Contact Date** | No | No | Date of last contact (may be empty) |
| **Reporting Manager** | Yes | Yes | Name of reporting manager (may be empty) |

**No pagination** shown (small dataset — 5 stakeholders on single page).

**Sample Data:**
- Rob West — Publishing Operations Director — Sales SPOC
- Annabel Phillips — QA Analyst — Delivery SPOC
- Nicola Player — Resource/Vendor Co-ordinator — Accounting SPOC
- Andrej Skripic — Head of Data Operations — Delivery SPOC
- Test POC Test — Test — Delivery SPOC / Decision Maker

---

### Manage Stakeholders Modal

Opens via "Manage Stakeholders" button. Full-screen overlay modal with two panels.

**Layout:** Two-panel modal
- **Left Panel:** Current Stakeholders list
- **Right Panel:** Add / Edit Stakeholder form

#### Left Panel — Current Stakeholders
- **Header:** "Current Stakeholder {N}" (count badge, e.g., "5")
- **"+ Add Stakeholder" button** — switches right panel to Add form (blank fields)
- **Search input field** — filters the stakeholder list by name (real-time or on submit)
- **Stakeholder list items:** Circular avatar with initials + Full Name + Designation
  - Clicking a stakeholder item populates the right panel with their data for editing

#### Right Panel — Add Stakeholder / Edit Stakeholder Form
**Form Title:** "Add Stakeholder" or "Edit Stakeholder"

| Field | Type | Required | Options/Notes |
|---|---|---|---|
| **Select image** | Image upload area | No | Circle avatar with camera icon; supports photo upload |
| **Salutation** | Dropdown | No | Mr., Ms., Dr., etc. |
| **First Name** | Text input | Yes | |
| **Last Name** | Text input | Yes | |
| **Designation** | Text input | Yes | Job title/designation |
| **Email** | Email input | Yes | |
| **Contact Number** | Text input | No | Phone number |
| **Relationship Type** | Dropdown | Yes | Options: Delivery SPOC, Sales SPOC, Accounting SPOC, etc. |
| **Status** | Dropdown | Yes | Active, Inactive |
| **LinkedIn Profile** | Text/URL input | No | LinkedIn URL |
| **Stakeholder Role** | Dropdown | No | Options: Decision Maker, Influencer, etc. |
| **Reports To** | Text input | No | Name of reporting manager |
| **Reporting Manager Designation** | Text input | No | Designation of reporting manager |

**Form Buttons:**
- **Cancel** — closes modal without saving
- **Save** (Add mode) / **Update** (Edit mode) — submits form; validates required fields; API call to create/update stakeholder

---

## 6. Section: Logs (Activities)

**URL:** `/DamcoWorks/CustomerDetailActivities?CustomerId={id}`
**Page Title:** "Activities" (sidebar label: "Logs")
**Breadcrumb:** Customers / Activities

Tracks assignment changes for Client Partner and Client Co-Partner roles on this customer account.

### Two Tabs

#### Tab 1: Client Partner Logs (default active)

**Table Columns:**
| Column | Description |
|---|---|
| **Client Partner** | Name of the assigned client partner (e.g., "Mohit Gupta") |
| **Added On** | Date the assignment was made + "by: {person}" sub-line showing who created the record |
| **Updated On** | Date of last update + person (if the assignment was updated; empty if not yet updated) |

**Sample Data:**
- Mohit Gupta — Added On: June 24, 2025 by: Mohit Gupta — Updated On: (empty)

**Purpose:** Provides an audit trail of who was assigned as Client Partner for this customer and when.

#### Tab 2: Client Co-Partner Logs

**Table Columns:** Client Co-Partner | Added On | Updated On (identical structure to Client Partner Logs)

**Empty State Display:**
- Illustrated empty box graphic
- Text: "There are no logs to display."
- Shown when no co-partner has been assigned

**Purpose:** Tracks co-partner assignment history for the customer.

---

### Client Partner Assignment (from Header — edit pencil icon)

Clicking the pencil/edit icon next to "Client Partner: {Name}" in the customer header opens a **Client Partner selection modal**:

| Element | Description |
|---|---|
| **Modal Title** | "Client Partner" |
| **Search input** | Text field to filter the people list by name |
| **People list** | Scrollable list with checkbox + avatar (initials) + name for each person |
| **Cancel button** | Closes modal without making changes |
| **Save button** | Saves selected person(s) as Client Partner; creates a new audit entry in Client Partner Logs |

This is a searchable, checkbox-based multi-select list. The list includes all internal employees eligible to be assigned as Client Partner.

---

## 7. Common UI Patterns & Components

### Currency Toggle (INR / USD)
- Present on: Project List, Current FY Revenue, Profit Margin, Lifetime Revenue, Billing Milestones, Bookings
- Type: Toggle switch (styled checkbox as a slider)
- **INR** on left, **USD** on right
- **Behavior:** Toggling reloads/recalculates all monetary values in the respective accordion in the selected currency

### Download Icon
- Present on: Project List, Current FY Revenue, Profit Margin, Lifetime Revenue, Billing Milestones, Bookings
- **Behavior:** Downloads the corresponding table data as a file (likely CSV or Excel)
- No confirmation dialog

### Column Filters
- Triggered by funnel icon next to column header
- **Types:**
  - **Dropdown filter:** "--Select--" default, options load dynamically
  - **Text filter:** Contains | Starts With | Ends With | Equals combobox + text input
- **Action Buttons:** Cancel (closes without applying) | Apply (applies filter and reloads data)
- Multiple filters can be active simultaneously (AND logic)

### Column Sorting
- Triggered by clicking column header (shows up/down arrows)
- Toggles between ascending and descending

### Pagination Component
- **Items per page dropdown:** 5 | 10 | 15 | 20 | 25 | 100
- **Status text:** "X to Y of Z items"
- **Navigation buttons:** Previous (<) | Page numbers | Next (>)
- Changing items per page reloads the list with new page size

### Accordion Pattern
- **Collapsed state:** Shows title + optional subtitle, chevron pointing down
- **Expanded state:** Shows full content, chevron pointing up
- Clicking the accordion header toggles expand/collapse
- Multiple accordions can be open simultaneously on the Delivery page

### Health Status Badges
- **Healthy** — Green background, white text
- **Caution** — Amber/orange background, dark text
- **At Risk** — Red/pink background, dark text
- Used in: Project List (Overall Health, Financial Health, Service Quality), Financial Health popup

### Project Pulse AI Sentiment Tags
- **"Holding steady for now"** — Light peach/amber background
- **"Progress on the right track"** — Light green background
- **"Things are looking good"** — Light green background
- AI-generated classification of weekly project status

### Tooltip Pattern
- Info (i) icons throughout show hover/click tooltips with explanatory text
- Used on: Booked Sales, Revenue KPI cards, Margin in Financial Health popup, Earned Score in Health Score Breakdown
- Tooltips appear as styled popover boxes positioned near the trigger element

### Empty State
- When no data is present: open box illustration + descriptive message ("There are no logs to display.")
- Used in: Client Co-Partner Logs tab

### Modal Dialogs
- Standard: Header title + body content + close (X) button + action buttons
- Used for: Project health details, Project Wise Breakdown, Project Pulse by AI, Manage Stakeholders, Client Partner selection
- Background overlay dims the rest of the page

---

## 8. Backend & API Notes

### URL Parameters
- **CustomerId** — Integer ID passed as URL query parameter to scope all data to a specific customer (e.g., `?CustomerId=689`)
- All API/data calls on the page use CustomerId as the primary filter

### Data Sources (Inferred from UI)
| Section | Data Entity | Notes |
|---|---|---|
| Customer Header | Customer master record | Company name, industry, avatar, KPI values |
| Booked Sales KPI | Bookings aggregation | CFY (Apr–Mar) total bookings |
| Revenue KPI | Invoice aggregation | Sum of all non-voided/non-written-off invoices for CFY |
| Project List | Projects table | Filtered by CustomerId; includes health scores |
| Overall / Financial / Service Quality Health | Health scoring engine | Computed from margin, payment timeliness, delivery manager input |
| Project Pulse by AI | AI/LLM analysis engine | On-demand generation; "Re-evaluate" triggers fresh AI analysis |
| Delivery Thoughts | Weekly delivery update entries | PM-submitted weekly logs, one per project per week |
| Current FY Revenue | Invoice/revenue aggregation | Monthly breakdown per project, Apr–Mar FY |
| Profit Margin (BYT & T&M) | Cost + Revenue aggregation (monthly) | Last 12 months rolling |
| Profit Margin (FP) | Fixed Price milestone records | Since project start |
| Lifetime Revenue | Historical revenue records | Year-wise, since account onboarding |
| Billing Milestones | Milestone + Invoice records | Per project, tracks full invoicing lifecycle |
| Bookings | Contract/booking records | CFY, with NN/EN/EE revenue classification |
| Stakeholders | Stakeholder contact records | Customer-scoped contact list |
| Logs / Activities | Partner assignment audit trail | Records Client Partner/Co-Partner assignment changes with who & when |

### Real-time / Interactive Behaviors
- **AI Re-evaluate:** Clicking "Re-evaluate" in Project Pulse by AI triggers a fresh LLM call; updates AI Highlights and action suggestions
- **Currency toggle:** Reloads displayed monetary values in INR or USD
- **Filter/Sort:** Server-side — API call on each filter/sort change
- **Pagination:** Server-side — API fetches new page slice on pagination change
- **Display Columns:** Client-side show/hide — no API call needed
- **Manage Stakeholders Save/Update:** POST/PUT API call to create or update stakeholder record
- **Client Partner Edit Save:** PUT/PATCH API call to update customer's client partner; creates a new audit log entry in Activities

### Financial Year Definition
- **CFY (Apr-Mar):** Financial year runs April to March
- Booked Sales and Revenue KPI cards show Current Financial Year totals only
- Lifetime Revenue table shows historical year-over-year data since customer onboarding

### Health Score Calculation (Financial Health)
Based on three weighted components:
- **Service Quality:** 40% weight — based on delivery manager's weekly assessment (PM Thoughts)
- **Margin:** 25% weight — actual project margin vs. target margin
- **Payment Timeliness:** 35% weight — average invoice payment delay (based on last 5 invoices)
- **Benchmark thresholds:**
  - Margin: Green >40%, Amber 11–40%, Red <=10%
  - Payment: Green <=30 days avg delay, Amber 31–60 days, Red >60 days

### Bookings Classification
- **NN (New Names):** Revenue from brand new clients/contracts
- **EN (Existing Names):** Revenue from existing client relationships (renewals/continuations)
- **EE (Existing Expansion):** Revenue from expanded services to existing clients

### Invoice Status Values
- **Payment Received** — Payment has been received
- **Not overdue** — Invoice is within payment terms
- **Paid on time** — Paid before or on due date
- **Paid X days late (Violation #N)** — Late payment, tracked as violation #N for that project

---

*End of customer_detail.md — Full specification for Customer Detail screen (Delivery, Stakeholders, Logs)*
