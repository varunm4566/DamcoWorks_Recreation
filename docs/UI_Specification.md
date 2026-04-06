# DamcoWorks — UI Specification & Design System

> **Application:** DamcoWorks ERP (DW_Recreation)
> **Stack:** React + Vite + TailwindCSS
> **Last updated:** 2026-03-28

This document is the single source of truth for all UI decisions — colors, typography, layout, gradients, component patterns, and interaction states. Every new screen or component must reference this spec.

---

## 1. Overview

| Property | Value |
|----------|-------|
| Font | Lato (Google Fonts) — weights 400, 600, 700 |
| Base font size | 13px |
| Font smoothing | antialiased |
| Page background | `#F7F8FC` |
| Border radius | `rounded` (4px), `rounded-lg` (8px), `rounded-full` (pills) |
| Transition | `transition-colors` (Tailwind default 150ms) |

---

## 2. Color Palette

All colors are registered as Tailwind tokens in `tailwind.config.js`.

### Brand
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-red` | `#E32200` | Primary CTA, active nav, icons, error states |
| `brand-navy` | `#101726` | Sidebar background |

### Page & Layout
| Token | Hex | Usage |
|-------|-----|-------|
| `page` | `#F7F8FC` | Main page background |
| `card` | `#E1E2E4` | Card solid background (fallback only — use gradient in practice) |
| `table-header` | `#F1F1F1` | `<thead>` background |
| `row-even` | `#F5F5F5` | Every odd-index data row (`index % 2 === 1`) |
| `footer-bg` | `#494949` | Footer bar |
| `border` | `#DEE2E6` | All borders (cards, inputs, table cells) |
| `border-light` | `#E0DFDF` | Lighter dividers |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#0A0D12` | Headings, strong values |
| `text-secondary` | `#4D5156` | Body text |
| `text-muted` | `#595959` | Labels, placeholders, sub-text |
| `text-dark` | `#272B30` | Alternate dark text |
| `active-txt` | `#008000` | Active / online status |

### Health
| Token | Hex | Usage |
|-------|-----|-------|
| `health-green` | `#0C8B14` | SPI/CPI good, health dot green |
| `health-orange` | `#E58715` | Health dot amber/caution |
| `health-red` | `#FA0000` | Health dot red / at risk |

### Status Pills
| State | Background | Text |
|-------|-----------|------|
| Healthy / Good | `#DCFFE3` | `#000000` |
| At Risk | `#FFE0DD` | `#000000` |
| N/A | — | `text-muted` |
| Caution | `#FFF6EA` | `#000000` |

### Tier Badges (Customers)
| Token | Background | Text |
|-------|-----------|------|
| `tier-rc-bg` / `tier-rc-text` | `#FFEEEE` | `#E32200` |
| `tier-gold-bg` / `tier-gold-text` | `#FFFBE8` | `#7C6A00` |
| `tier-strat-bg` / `tier-strat-text` | `#DDE3FF` | `#0023C2` |

### Filter Chips
| Token | Hex | Usage |
|-------|-----|-------|
| `chip-active-bg` | `#ADCFAD` | Active state chip bg |
| `chip-blue-bg` | `#CDE1FF` | Blue chip bg |
| `chip-blue-text` | `#2680FF` | Blue chip text |

### Tag Pills (Projects)
| Category | Token | Hex |
|----------|-------|-----|
| Offering | `tag-offering` | `#DEF9FF` |
| Domain | `tag-domain` | `#F6DAFF` |
| Geography | `tag-geography` | `#E5EBFE` |
| Currency | `tag-currency` | `#FFF6EA` |
| Status | `tag-status` | `#DCFFE3` |
| Risk | `tag-risk` | `#FFE0DD` |

### Division Tab / Indigo
| Token | Value | Usage |
|-------|-------|-------|
| `indigo-tab` | `#4338CA` | Active tab border + text |
| `indigo-tab-bg` | `rgba(99,102,241,0.1)` | Active tab background |

### Overdue / Alert
| Token | Hex | Usage |
|-------|-----|-------|
| `overdue-bg` | `#FEE2E2` | Overdue badge background |
| `overdue-text` | `#B91C1C` | Overdue badge text |

### Misc
| Token | Hex | Usage |
|-------|-----|-------|
| `avatar` | `#330033` | User avatar background |

---

## 3. Typography Scale

| Size | Weight | Usage |
|------|--------|-------|
| 28px | bold | Detail panel large metric values |
| 20px | bold | KPI card values, detail metric cards |
| 18px | bold | (deprecated — replaced by 20px for KPI values) |
| 17px | semibold | Detail panel project name header |
| 15px | semibold | App header brand name |
| 14px | semibold | Column headers, KPI card titles, user name in header |
| 13px | regular/semibold | Body text, tab labels, toolbar, drawer tabs |
| 12px | regular | Table cell content, sub-labels, chip text |
| 11px | regular | Tag pills, chip labels, milestone sub-text, footer |
| 10px | regular | "Latest" italic label in Delivery Thoughts |
| 8px | bold | Header role badge (USER HOT) |

---

## 4. Layout Dimensions

```
┌─────────────────────────────────────────────────────┐
│  Header (h-[58px], bg-white, shadow)                │
├────────┬────────────────────────────────────────────┤
│        │  Main Content                              │
│ Side   │  p-[14px]                                  │
│ bar    │                                            │
│ w-[75] │  <Outlet />  (page content)                │
│ bg-    │                                            │
│ navy   ├────────────────────────────────────────────┤
│        │  Footer (h-[22px], bg-footer-bg)           │
└────────┴────────────────────────────────────────────┘
```

| Element | Dimension | Token |
|---------|-----------|-------|
| Header | 58px height | `h-[58px]` |
| Sidebar | 75px width | `w-[75px]` |
| Footer | 22px height | `h-[22px]` |
| Content padding | 14px all sides | `p-[14px]` |
| Card gap | 12px | `gap-3` |
| Card border radius | 8px | `rounded-lg` |

---

## 5. Gradients

### KPI Summary Cards (inactive)
```css
background: linear-gradient(135deg, #FFFFFF 0%, #E4E5E7 100%);
border: 1px solid #DEE2E6;
box-shadow: 0 1px 3px rgba(0,0,0,0.06);
```

### KPI Summary Cards (active / clicked)
```css
background-color: #EEF2FF;
border: 2px solid #6366F1;
box-shadow: 0 2px 8px rgba(99,102,241,0.2);
```

### KPI Card hover
```css
filter: brightness(0.97);   /* Tailwind: hover:brightness-[0.97] */
```

---

## 6. Component Patterns

### 6.1 Division Tab Bar

```
┌──────────────────────────────────────────────────────────┐
│  Tech Services  │ Insurance │ ITES │ … │ Staffing │ All  │
│  [icon] 138  [icon] 44      │ …                          │
└──────────────────────────────────────────────────────────┘
```

- Container: `bg-white border border-border rounded`
- Each tab: `flex-1 flex-col items-center justify-center` — equal width, centered
- Active tab: `border-b-2 border-indigo-tab bg-indigo-tab-bg text-indigo-tab font-semibold`
- Inactive tab: `border-b-2 border-transparent text-text-muted hover:bg-gray-50`
- Count chips: `bg-gray-100 rounded px-1.5 py-0.5 text-[11px]` with small icon
- Minimum tab width: `min-w-[80px]` (prevents extreme squish on small screens)

### 6.2 KPI Summary Cards

- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-3`
- Inactive bg: **diagonal gradient** (see section 5)
- Active bg: indigo tint (see section 5)
- Icon box (top-right): `w-8 h-8 bg-white rounded-lg` + `box-shadow: 0 1px 3px rgba(0,0,0,0.10)`; icon color `text-brand-red`
- Title: `text-[13px] font-semibold text-text-muted`
- Value: `text-[20px] font-bold` — color `#E32200` for risk cards, `#0A0D12` for neutral
- Sub-label: `text-[11px] text-text-secondary`

### 6.3 Data Table

- Container: `border border-border rounded overflow-hidden`
- `<thead>`: `sticky top-0 z-30 bg-table-header`
- Column header cells: `text-[14px] font-semibold text-black px-[10px] py-[10px]`
- Data rows alternating:
  - Even index (0, 2, 4…): `bg-white`
  - Odd index (1, 3, 5…): `bg-row-even` (`#F5F5F5`)
- Row hover: `hover:bg-[#EEF2FF]` (light indigo)
- Sticky first column: same bg class as its row (`bg-white` or `bg-row-even`) + `z-10`
- Cell padding: `px-[10px] py-[10px] align-top`
- Cell border: `border border-border`
- Empty state: centered "No projects found." + red "Clear Filters" button

### 6.4 Filter Chips (Active Filters Bar)

Format: **`Label : Value ×`**

```
Division : Technology Services   Critical Attention : Total ×   [Clear All]
```

- Chip wrapper: `border border-[#D9D9D9] rounded px-[5px] py-[3px] text-[12px]`
- Label: `font-semibold text-[#101213]`
- Value: `text-text-muted ml-1`
- Remove button: `&times;` in `text-gray-400 hover:text-gray-600`
- Division chip is permanent (no ×)
- Clear All button: `bg-brand-red text-white text-[12px] rounded px-2 py-[3px] h-[25px]`

### 6.5 Tag Pills

```jsx
<span style={{ backgroundColor: TAG_COLORS[category] }} className="inline-block rounded px-[6px] py-[2px] text-[11px] text-black">
  {value}
</span>
```

Category → color mapping: see Section 2 tag colors.

### 6.6 Health Badge (Score)

| Score range | Color | Background |
|-------------|-------|------------|
| 75 – 100 | `#0C8B14` (green) | `rgba(12,139,20,0.1)` |
| 50 – 74 | `#E58715` (orange) | `rgba(229,135,21,0.1)` |
| 0 – 49 | `#FA0000` (red) | `rgba(250,0,0,0.1)` |

Displayed as: colored dot + score number, or colored badge.

### 6.7 Status Pills

```jsx
<span className="inline-block rounded-full px-2 py-[2px] text-[12px]"
  style={{ backgroundColor: isHealthy ? '#DCFFE3' : '#FFE0DD', color: '#000' }}>
  {status}
</span>
```

---

## 7. Interaction States

| State | Pattern |
|-------|---------|
| Hover (rows) | `hover:bg-[#EEF2FF]` — light indigo tint |
| Hover (tabs) | `hover:bg-gray-50` |
| Hover (cards) | `hover:brightness-[0.97]` |
| Hover (buttons) | `hover:bg-red-700` for red buttons; `hover:bg-gray-200` for icon buttons |
| Active / selected | Indigo border `#6366F1` + bg `#EEF2FF` (tabs, KPI cards) |
| Active nav item | `bg-brand-red text-white` in sidebar |
| Loading skeleton | `animate-pulse` with gradient bg |
| Disabled | `opacity-50 cursor-not-allowed` |

---

## 8. Shadows

| Usage | Value |
|-------|-------|
| Card (default inactive) | `0 1px 3px rgba(0,0,0,0.06)` |
| Card (active/elevated) | `0 2px 8px rgba(99,102,241,0.2)` |
| Header | `rgba(0,0,0,0.15) 0px 3px 5px 0px` |
| Icon box in KPI card | `0 1px 3px rgba(0,0,0,0.10)` |
| Detail panel | `shadow-xl` (Tailwind) |
| Dropdown menu | `shadow-lg` (Tailwind) |

---

## 9. Animations

| Name | Definition | Usage |
|------|-----------|-------|
| `slideInRight` | `translateX(100%) → translateX(0)`, 0.25s ease-out | Detail flyout panel, Global filter panel |
| `animate-pulse` | Tailwind built-in | Skeleton loaders |
| `transition-colors` | Tailwind default 150ms | Row hover, tab hover, button hover |
| `transition-all` | Tailwind default 150ms | KPI card active state |

---

## 10. Spacing Conventions

| Context | Value |
|---------|-------|
| Section gap (components on page) | `mb-3` (12px) |
| Cell padding (table) | `px-[10px] py-[10px]` |
| Card inner padding | `p-3` (12px) |
| Toolbar padding | `px-3 py-2` |
| Content area padding | `p-[14px]` |
| Chip padding | `px-[5px] py-[3px]` |
| Tag pill padding | `px-[6px] py-[2px]` |
| Detail panel padding | `px-6 py-5` |

---

## 11. Scrollbars

All scrollable containers use `.custom-scrollbar`:

```css
::-webkit-scrollbar        { width: 8px; height: 8px; }
::-webkit-scrollbar-track  { background: #f1f1f1; }
::-webkit-scrollbar-thumb  { background: #c1c1c1; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
```

---

## 12. Z-Index Scale

| Layer | Value |
|-------|-------|
| Sticky table column | `z-10` |
| Sticky table header | `z-30` |
| Header bar | `z-30` |
| Dropdown menus | `z-50` |
| Detail panel overlay | `z-50` |
| Column filter dropdown | `z-50` |

---

*End of UI Specification*
