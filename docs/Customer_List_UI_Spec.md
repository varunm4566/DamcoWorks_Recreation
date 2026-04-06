# Customer List UI Specification

## Overview
A CRM-style Customer List dashboard page for "Damcoworks" (branded as "Nuts & Bolts"). The layout consists of a fixed top header bar, a fixed left sidebar navigation, a stats carousel section, a toolbar row, a filter row, and a horizontally-scrollable data table with pagination.

---

## 1. Overall Page Layout

```
+--------------------------------------------------+
| TOP HEADER BAR (height: 58px, white bg)          |
+--------+-----------------------------------------+
| LEFT   |  MAIN CONTENT AREA                       |
| SIDE   |  - Stats Carousel (5 cards)              |
| BAR    |  - Toolbar Row (toggle + currency + btns)|
| (75px) |  - Filter Row                            |
|        |  - Data Table (horizontally scrollable)  |
|        |  - Pagination                            |
+--------+-----------------------------------------+
| FOOTER (height: 22px, dark gray #494949)         |
+--------------------------------------------------+
```

- **Page background:** `rgb(247, 248, 252)` / `#F7F8FC`
- **Font family:** `Lato, sans-serif`
- **Base font size:** `13px`
- **Main content padding:** `14px`

---

## 2. Top Header Bar

- **Background:** `#FFFFFF`
- **Height:** `58px`
- **Box shadow:** `rgba(0,0,0,0.15) 0px 3px 5px 0px`
- **Layout:** Flex row, space-between alignment

### Left: Logo / Brand
- Grid/dots icon (4 squares) in red (`#E32200`) followed by text **"Nuts & Bolts"** in dark font
- Logo area has class `header-logo`

### Right: User Profile
- Circular user avatar photo (dark purple background `rgb(51,0,51)`)
- **"USER HOT"** badge label underneath avatar (small badge, red/orange)
- User name: **"Varun Mishra"** — dark text, ~14px, font-weight 600
- User role: **"Software Engineer II"** — gray text `#595959`, 12px
- Dropdown caret chevron icon next to name

---

## 3. Left Sidebar Navigation

- **Background:** `rgb(16, 23, 38)` / `#101726` (very dark navy blue)
- **Width:** `75px` (fixed, icon-only)
- **Layout:** Vertical flex column, items centered

### Navigation Items
Each nav item is a vertical stack (icon on top, label below), full width:

| Item | Icon | State |
|------|------|-------|
| **Customers** | Person with checkmark icon | **Active** |
| **Delivery** | Person with delivery icon | Default |
| **Projects** | Person with grid icon | Default |
| **People** | Person/group icon | Default |
| **Bench** | Person with seat icon | Default |

#### Active State (Customers)
- Background: `rgb(227, 34, 0)` / `#E32200` (red fill)
- Text + icon: white
- Full 75px width highlight block

#### Default State
- Background: transparent (inherits `#101726`)
- Text + icon color: `rgb(39, 43, 48)` / `#272B30` (slightly lighter than sidebar)

#### Item Dimensions
- Width: 75px (full sidebar width)
- Icon: ~24px, centered
- Label: ~12px, centered below icon

---

## 4. Statistics Cards Carousel

A horizontally-sliding carousel (Splide.js) with **5 stat cards** in a row.

### Card Style
- **Background:** `rgb(225, 226, 228)` / `#E1E2E4`
- **Border:** `1px solid rgb(222, 226, 230)` / `#DEE2E6`
- **Border radius:** `8px`
- **Padding:** `16px`
- **Width:** ~`260px` each
- **Height:** ~`126px`
- No box-shadow

### Card Internal Layout
```
+---------------------------------------+--------+
| TITLE TEXT  [ℹ️]                      | [ICON] |
| Subtitle / period label               | circle |
+---------------------------------------+--------+
| LARGE VALUE / NUMBER                           |
| Sub-note (small gray text)                     |
+------------------------------------------------+
```

- **Title text:** 13px, color `#4D5156`, normal weight
- **ℹ️ info icon:** Small circle "i", clickable, opens tooltip
- **Icon circle (top-right):** White rounded square ~48×48px containing a red SVG/FontAwesome icon. Icon color: `#E32200`.
- **Large value:** ~24–28px, bold/700, dark `#000`
- **Sub-note:** ~11px, gray `#4D5156`

### The 5 Cards

#### Card 1 — Active Projects
- Title: **Active Projects**
- Sub: *Excluded 13 DamcoIP Project(s)*
- Value: **343**
- Status row: **253** 🟢 **78** 🟠 **12** 🔴
  - Dots: green `rgb(12,139,20)`, orange `rgb(229,135,21)`, red `rgb(250,0,0)`
  - Each dot ~12px circle
- Footer: *2 added & 0 closed this month*

#### Card 2 — New Logos
- Title: **New Logos** + ℹ️
- Sub: *CFY (Apr-Mar)*
- Value: **74** (clickable)
- Footer: *(1) acquired this month* (clickable link)

#### Card 3 — Booked Sales
- Title: **Booked Sales** + ℹ️
- Sub: *CFY (Apr-Mar)*
- Value: **$6.68M** (clickable)

#### Card 4 — Revenue
- Title: **Revenue** + ℹ️
- Sub: *CFY (Apr-Mar)*
- Value: **$2.34M** (clickable)

#### Card 5 — Active Customers
- Title: **Active Customers** + ℹ️
- Value: **173** (clickable)

### Carousel Controls
- Prev / Next arrow buttons (left/right sides)
- White bg, no border, muted gray color `rgba(16,16,16,0.3)`

---

## 5. Toolbar Row

Horizontal flex row between stat cards and filter row.

### Left
- Text: **"My Customers"** — gray `#595959`, 13px
- **Toggle switch** (ON state active) — ~58×22px pill toggle
- Text: **"All Customers"** — gray `#595959`, 13px

### Right
- Text: **"INR"** — gray `#595959`, 13px
- **Toggle switch** (toggled to USD) — ~54×22px pill toggle
- Text: **"USD"** — gray `#595959`, 13px
- **Search button:** white bg, `1px solid #DEE2E6`, radius 4px, magnifier icon (🔍)
- **Download button:** same style, download icon (⬇)
- **Expand button:** same style, expand/fullscreen icon (⛶)

---

## 6. Filter Row

- **"Filters:"** label — `#595959`, 13px
- **Filter chip:** "Customer Status : Active ×"
  - Transparent background
  - Color: `#595959`
  - "×" close/remove icon (inline after text)
  - Padding-bottom: 4px
- **"Clear Filters" button:**
  - Background: `#E32200`
  - Color: `#FFFFFF`
  - Border: none
  - Border-radius: `4px`
  - Padding: `0px 8px`

---

## 7. Data Table

### Container
- Horizontally scrollable
- Border: `1px solid #DEE2E6`

### Column Headers (thead)
- **Row background:** `rgb(241,241,241)` / `#F1F1F1`
- **Text:** 14px, `#000000`, font-weight 600
- **Border-bottom:** `1px solid #DEE2E6`
- **Padding:** `4px 16px`
- **"Customer" column:** position sticky (frozen)

#### Header Column Details

| Column | Sort | Filter | Info Icon | Sub-label |
|--------|------|--------|-----------|-----------|
| Customer | ⇅ | ▼ | — | — |
| Booked Sales | ⇅ + red↓ | ▼ | ℹ️ | CFY (Apr-Mar) |
| Revenue | ⇅ + red↓ | ▼ | ℹ️ | CFY (Apr-Mar) |
| Project Health | — | — | ℹ️ | — |
| At Risk | ⇅ | — | ℹ️ | — |
| Tier | ⇅ | ▼ | — | — |
| CSAT | ⇅ | ▼ | — | — |
| Sales Owner | ⇅ | ▼ | — | — |
| Client Partner | ⇅ | ▼ | — | — |
| CP Ownership | ⇅ | ▼ | — | — |
| Incentive Eligibility | ⇅ | ▼ | — | — |
| Client Co-Partner | ⇅ | ▼ | — | — |
| DM/PDM | ⇅ | ▼ | — | — |
| Industry | ⇅ | ▼ | — | — |
| Referenceable | ⇅ | ▼ | — | — |
| Customer Status | ⇅ | ▼ | — | — |

### Table Body

#### Row Alternating Colors
- **White rows:** `#FFFFFF` (rows 1, 3, 5…)
- **Light gray rows:** `#F5F5F5` (rows 2, 4, 6…)
- **Cell padding:** `4px 16px`
- **Cell border-bottom:** `1px solid #DEE2E6`
- **Vertical-align:** middle

### Customer Column Cell

```
[AVATAR] [Customer Name]
         [(Active)] or [(New)]
```

**Avatar:**
- Shape: Circle, 32×32px, border-radius 100px
- Background: `rgb(51,0,51)` / `#330033` (dark purple)
- Text: 2-letter initials (uppercase), white, 13px, font-weight 600
- Display: inline-flex, align-items center, justify-content center
- flex-shrink: 0 (doesn't shrink)

**Customer Name Link:**
- Color: `rgb(77,81,86)` / `#4D5156`
- Font: 13px, regular (400)
- No underline
- Clickable (href="#")

**"(Active)" status:**
- Green text: `rgb(0,128,0)` / `#008000`
- Font size: 10px
- Inline with or just after customer name

**"(New)" badge:**
- Gray text: `#4D5156`
- Font size: 10px
- Displayed on new line below customer name (class: `display-block font-size-xs`)

### Booked Sales / Revenue Cells
- Text: values like `$200.38K`, `$6.68M`
- Color: `#4D5156`, 13px regular

### Project Health Cell
- Pattern: `[N]🟢[N]🟠[N]🔴`
- Count number before each dot, 13px, `#4D5156`
- Dots: filled circles, ~12px
  - Green `rgb(12,139,20)`
  - Orange `rgb(229,135,21)`
  - Red `rgb(250,0,0)`

### At Risk Cell
- Usually blank/empty
- Shows count if any

### Tier Badge Cell

| Tier Value | Chip BG | Chip Text | Star Color |
|-----------|---------|-----------|------------|
| **Red Carpet** | `rgb(255,238,238)` | `rgb(227,34,0)` | `#E32200` (★) |
| **Gold** | `rgb(255,251,232)` | `rgb(124,106,0)` | `#7C6A00` (★) |
| **Strategic** | `rgb(221,227,255)` | `rgb(0,35,194)` | `#0023C2` (★) |

- Shape: pill (border-radius ~20px)
- Padding: ~`4px 10px`
- Font size: ~12px
- Includes ★ icon before text

### CSAT Cell
- Format: `[score link] [trend indicator]`
- Score link: e.g., `4/5`, `5/5`, `3/5`
  - Color: `#4D5156`
  - 13px, clickable
- **"=" neutral trend circle:**
  - Background: `rgb(205,225,255)` / `#CDE1FF`
  - Color: `rgb(38,128,255)` / `#2680FF`
  - Font size: 15px
  - Small circle badge shape
- If no CSAT: shows `--` (gray dash)

### Sales Owner / Client Partner Cells
- Plain text name, `#4D5156`, 13px
- May wrap to two lines for long names

### CP Ownership Cell
- Custom checkbox (unchecked by default)
- ~18px × 18px
- Unchecked: gray/empty border

### Incentive Eligibility Cell
- Custom checkbox
- **Checked state:** green background/checkmark, `rgb(12,139,20)`
- **Unchecked state:** gray/empty

### Client Co-Partner Cell
- Plain text name (may be empty)

### DM/PDM Cell
- Name text + optional `+N` count bubble
- **`+N` badge:**
  - Background: `rgb(205,225,255)` / `#CDE1FF`
  - Color: `rgb(38,128,255)` / `#2680FF`
  - Border-radius: 20px
  - Font size: ~11px
  - Inline after name
- Sub-label below name: e.g., *(Technology Services)*, *(ITeS)*, *(Insurance)*
  - Font size: ~11px, italic/smaller, gray `#4D5156`

### Industry Cell
- Plain text, `#4D5156`, 13px
- May be two-line (e.g., "Business Consulting Services", "Transportation and logistics")

### Referenceable Cell
- Custom checkbox (unchecked by default)

### Customer Status Cell
- **"Active" badge:**
  - Background: `rgb(173,207,173)` / `#ADCFAD` (muted green)
  - Text color: `#000000`
  - Border-radius: `20px`
  - Font size: `12px`
  - Padding: `6px 10px`

---

## 8. Column Filter Dropdowns

Clicking the filter ▼ icon on a column header opens an inline dropdown panel:

- White background, bordered
- Dropdown contains:
  - **Text input** (for name-based filters: Customer, Sales Owner, Client Partner, etc.)
    OR
  - **Select/Combobox** (for value-based filters: Customer Status, Tier, CSAT, etc.)
    - Default option: "--Select--" or "Select"
  - **Cancel** button
  - **Apply** button

---

## 9. Pagination Footer

### Items Per Page
- Label: **"Items per page"** — 13px, `#595959`
- Select box with options: 5, 10, 15, 20, **25** (selected), 100
- Status text: **"1 to 25 of 173 items"** — 13px, `#595959`

### Page Number Buttons
- **Default state:**
  - Background: `#FFFFFF`
  - Border: `1px solid rgb(224,223,223)`
  - Border-radius: 4px
  - Color: `#595959`
  - Font size: 13px
- **Active/selected page (1):**
  - Background: `#E32200` (red)
  - Color: `#FFFFFF`
  - Same border-radius

- Layout: `< 1 2 3 4 … 7 >`
- `<` prev and `>` next arrow buttons, same style as default
- `…` ellipsis for skipped pages (text, not button)

---

## 10. Footer Bar

- **Background:** `rgb(73,73,73)` / `#494949`
- **Height:** `22px`
- **Layout:** Flex row, space-between
- **Left:** *"© Damcoworks. All RightsReserved"* — light/white text
- **Right:** Links separated by space: **"Privacy Statement"** | **"Copyright"** | **"Terms & Conditions"**
  - Link color: lighter on dark background

---

## 11. Complete Color Palette

```css
/* Brand */
--brand-red:        #E32200;  /* rgb(227, 34, 0) */
--brand-dark-navy:  #101726;  /* rgb(16, 23, 38) */

/* Backgrounds */
--bg-page:          #F7F8FC;  /* rgb(247, 248, 252) */
--bg-white:         #FFFFFF;
--bg-card:          #E1E2E4;  /* rgb(225, 226, 228) */
--bg-table-header:  #F1F1F1;  /* rgb(241, 241, 241) */
--bg-row-even:      #F5F5F5;  /* rgb(245, 245, 245) */
--bg-footer:        #494949;  /* rgb(73, 73, 73) */

/* Borders */
--border-color:     #DEE2E6;  /* rgb(222, 226, 230) */
--border-light:     #E0DFDF;  /* rgb(224, 223, 223) — pagination */

/* Text */
--text-primary:     #0A0D12;
--text-secondary:   #4D5156;  /* rgb(77, 81, 86) */
--text-muted:       #595959;  /* rgb(89, 89, 89) */
--text-dark:        #272B30;  /* rgb(39, 43, 48) */

/* Status Colors */
--color-healthy:    #0C8B14;  /* rgb(12, 139, 20) */
--color-caution:    #E58715;  /* rgb(229, 135, 21) */
--color-at-risk:    #FA0000;  /* rgb(250, 0, 0) */
--color-active-txt: #008000;  /* rgb(0, 128, 0) */

/* Tier Badges */
--tier-rc-bg:       #FFEEEE;  /* rgb(255, 238, 238) */
--tier-rc-text:     #E32200;  /* rgb(227, 34, 0) */
--tier-gold-bg:     #FFFBE8;  /* rgb(255, 251, 232) */
--tier-gold-text:   #7C6A00;  /* rgb(124, 106, 0) */
--tier-strat-bg:    #DDE3FF;  /* rgb(221, 227, 255) */
--tier-strat-text:  #0023C2;  /* rgb(0, 35, 194) */

/* Chip Colors */
--chip-active-bg:   #ADCFAD;  /* rgb(173, 207, 173) */
--chip-blue-bg:     #CDE1FF;  /* rgb(205, 225, 255) */
--chip-blue-text:   #2680FF;  /* rgb(38, 128, 255) */

/* Avatar */
--avatar-bg:        #330033;  /* rgb(51, 0, 51) */
```

---

## 12. Typography Reference

```
Font: Lato, sans-serif

Base:            13px / 400 / #4D5156
Table th:        14px / 600 / #000000
Stat card title: 13px / 400 / #4D5156
Stat card value: 24px / 700 / #000000
Customer name:   13px / 400 / #4D5156
(Active) label:  10px / 400 / #008000
(New) label:     10px / 400 / #4D5156
Avatar initials: 13px / 600 / #FFFFFF
Tier badge:      12px / 400 / (varies)
Status chip:     12px / 400 / #000000
Filter label:    13px / 400 / #595959
Nav item label:  12px / 400 / #FFFFFF (active) / #272B30 (default)
User name:       14px / 600 / dark
User role:       12px / 400 / #595959
```

---

## 13. Spacing & Sizing Reference

```
Header height:          58px
Sidebar width:          75px
Footer height:          22px
Main content padding:   14px
Stat card width:        ~260px
Stat card height:       ~126px
Stat card padding:      16px
Stat card border-radius: 8px
Table cell padding:     4px 16px
Avatar size:            32×32px
Avatar border-radius:   100px (full circle)
Toggle height:          22px
Toggle width:           54–58px
Pagination btn radius:  4px
Clear Filters radius:   4px
Clear Filters padding:  0px 8px
Active status radius:   20px
Active status padding:  6px 10px
```

---

## 14. Notes for Masking / Placeholder Data

Since functionality is masked, use these placeholder approaches:
- Customer names: use realistic company names
- Dollar values: use `$XXX.XXK` format
- Project health: show 3 colored dots with counts
- CSAT: show `N/5` format with trend indicator
- Avatar initials: first 2 letters of company name, uppercase
- Tier: randomize among Red Carpet / Gold / Strategic
- Status: show "Active" for most rows
- Pagination: "1 to 25 of 173 items"
