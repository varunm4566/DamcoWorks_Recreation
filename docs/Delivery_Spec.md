# Delivery Page — Specification

> **URL:** `/DamcoWorks/Delivery` | **Active Sidebar Item:** Delivery | **Date:** 2026-03-29  
> **Global UI (header, sidebar, footer, colors, typography base):** See `MyProjects_Screen_Specification.md` §1–§5, §13 or global design system file.

---

## 1. Main Content Structure

```
[Division Tabs — 3 tabs]
[KPI Summary — 3 grouped card sections]
[Section Header: "Delivery" + Download/Expand buttons]
[Filter Bar: chips + Clear Filters]
[Delivery Data Table]
```

Background: `#F7F8FC`, padding 14px. Active sidebar item: **Delivery** (`#E32200` bg).

---

## 2. Division Filter Tab Bar

Full-width white card, `1px solid #DEE2E6`, radius 4px, mb 12px. Flex row, equal-width tabs.

| Tab | Default |
|-----|---------|
| **Technology Services** | ✅ Selected on load |
| **Insurance** | |
| **Both** | Combined data |

**Default tab:** padding 12px 16px, text 14px/400 `#595959`, transparent bg, no border.  
**Active tab:** bg `rgba(99,102,241,0.1)`, border `2px solid #4338CA`, text `#000`.  
**On click:** updates KPI values + filters table + updates "Division" filter chip.

---

## 3. KPI Summary Cards

3-group horizontal flex row (not a carousel), gap 12px, mb 16px.

**Card styling:** bg `#FFF`, border `1px solid #DEE2E6`, radius 8px, padding 16px.  
**Sub-card dividers:** `1px solid #E0E0E0` vertical, 16px horizontal gap.  
**Sub-card text:** Title 13px/400/`#000` · Big Number 20px/700/`#000` · Sub-label 11px/400/`#595959`.

### Group 1: Delivery & Product Leadership
**Left border accent:** `3px solid #E32200` · **Title:** 13px/600/`#595959`

| Role | Count | Sub-label |
|------|-------|-----------|
| Program Managers | **4** | Acting PgM(s) : 5 |
| Product Owners | **0** | Acting PO(s) : 2 |
| Delivery Managers | **21** | Acting DM(s) : 18 |
| Onsite Delivery Managers | **3** | Acting Onsite DM(s) : 5 |
| Product Development Managers | **0** | Acting PDM(s) : 3 |

### Group 2: Execution Leads
**Left border accent:** `3px solid #E32200` · **Title:** 13px/600/`#595959`

| Role | Count | Sub-label |
|------|-------|-----------|
| Project Leads | **4** | Acting PL(s) : 2 |
| Functional Leads | **0** | Acting FL(s) : 2 |
| Technical Leads | **12** | Acting TL(s) : 3 |

### Group 3: Portfolio
**No accent border** · **Title:** 13px/600/`#595959`

| Metric | Count |
|--------|-------|
| Active Customers | **95** |
| Active Projects | **138** |

**Interaction:** Values update on division tab change. Big numbers may be clickable (cursor: pointer). Sub-labels are informational (acting/interim holders).

---

## 4. Section Header Row

Flex row, space-between. mt 16px, mb 8px.

**Left:** "Delivery" — 18px/700/`#000`.

**Right — Action Buttons** (shared style: bg `#FFF`, border `1px solid #DEE2E6`, radius 4px, padding 6px 12px, h 36px, w ~44px, hover bg `#F1F3F5`):

| Button | Icon | Behavior |
|--------|------|----------|
| Download | Down-arrow SVG | Exports filtered data as Excel/CSV |
| Expand | Expand-corners SVG | Toggles fullscreen. Active: `2px solid #E32200` border |

---

## 5. Active Filter Bar

Flex row, align-items center, padding 8px 0, mb 8px.

| Element | Style |
|---------|-------|
| "Filters:" label | 13px/400/`#595959` |
| Filter chips | bg transparent, border `1px solid #D9D9D9`, radius 4px, padding 3px 8px. Bold label 12px/600/`#101213` + value 12px/400/`#595959` + "×" remove |
| "Clear Filters" btn | bg `#E32200`, color `#FFF`, radius 4px, padding 4px 12px, h 25px |

**Default chip on load:** "Division : Technology Services ×"  
**Clear Filters:** removes all chips, resets to unfiltered state.

---

## 6. Delivery Data Table

Full-width, horizontal scroll if needed. bg `#FFF`, border `1px solid #DEE2E6`, border-collapse separate.

### Multi-Level Header (3 rows)

**All headers:** bg `#F1F1F1`, border `1px solid #DEE2E6`, padding 10px, text `#000`.

**Row 1 — Group headers:**

| Header | Span | Notes |
|--------|------|-------|
| Name/Role | rowspan 3 | Left-aligned |
| Customer | rowspan 3 | Center |
| Active Project | rowspan 3 | Center |
| Collaborating With | colspan 9 | Center, spans sub-groups below |
| Engineering Team | colspan 2 | Center |

**Row 2 — Sub-group headers (under "Collaborating With"):**

| Sub-group | Columns |
|-----------|---------|
| Execution Leads | TL, FL, PL |
| Delivery & Product Leadership | DM, Onsite DM, PDM, PFM, PgM, PO |

**Row 3 — Individual columns (under "Engineering Team"):**
- **by Head Count** · **by Allocation**

### All 14 Columns

| # | Column | Sortable | Filterable | Width |
|---|--------|----------|------------|-------|
| 1 | Name/Role | ✅ ↕ | ✅ funnel | ~200px |
| 2 | Customer | ✅ ↕ | — | ~120px |
| 3 | Active Project | ✅ ↕ | — | ~110px |
| 4 | TL | ✅ ↕ | — | ~60px |
| 5 | FL | ✅ ↕ | — | ~60px |
| 6 | PL | ✅ ↕ | — | ~60px |
| 7 | DM | ✅ ↕ | — | ~60px |
| 8 | Onsite DM | ✅ ↕ | — | ~80px |
| 9 | PDM | ✅ ↕ | — | ~60px |
| 10 | PFM | ✅ ↕ | — | ~60px |
| 11 | PgM | ✅ ↕ | — | ~60px |
| 12 | PO | ✅ ↕ | — | ~60px |
| 13 | by Head Count | ✅ ↕ | — | ~100px |
| 14 | by Allocation | ✅ ↕ | — | ~100px |

### Column Content

**Col 1 — Name/Role:** Name 13px/600/`#000` + role below 12px/400/`#595959`. Roles: Project Lead, Technical Lead, Delivery Manager, Program Manager, Product Owner, etc. Has sort ↕ + filter funnel.

**Col 2 — Customer:** Integer count of assigned customers. Center.

**Col 3 — Active Project:** Integer count. Center.

**Cols 4–12 — Collaborating With (TL–PO):** Integer collaboration counts. Center.

**Col 13 — by Head Count:** Integer team head count. Center.

**Col 14 — by Allocation:** Decimal FTE (up to 2 decimals, e.g., 10.05, 9.1, 0.3). Center.

### Data Display Rules

| Value Type | Display | Color | Weight |
|------------|---------|-------|--------|
| Non-zero integer | "1", "3", "12" | `#000` | 600–700 |
| Zero | "0" | `#595959` | 400 |
| Not applicable | "NA" | `#595959` | 400 |
| Decimal (allocation) | "10.05", "0.3" | `#000` | 400 |

**Row styling:** bg `#FFF` (no alternating), border-bottom `1px solid #DEE2E6`, cell padding 10px 12px, vertical-align middle, hover `#F5F5F5`. No row click action.

### Name/Role Filter (Funnel)
Inline dropdown: role-type checkboxes (Project Lead, Technical Lead, Delivery Manager, etc.) + name text search + Apply (`#E32200`) / Cancel buttons. Applied filter → chip in filter bar.

---

## 7. Sorting

Default: Name/Role ascending (alphabetical). Single-column sort only.  
States: ↕ unsorted → ↑ ascending (click once) → ↓ descending (click again).

---

## 8. Interaction Summary

| Component | Action | Result |
|-----------|--------|--------|
| Division tabs | Click | Filters KPIs + table, updates chip |
| KPI big numbers | Click (possibly) | May filter table |
| Filter chip × | Click | Removes that filter |
| Clear Filters | Click | Removes all chips |
| Download btn | Click | Exports filtered data |
| Expand btn | Click | Toggles fullscreen |
| Sort icons ↕ | Click | Sorts column asc/desc |
| Name/Role funnel | Click | Opens filter dropdown |
| Table rows | Hover only | `#F5F5F5` highlight, no click |

---

## 9. State Management (React)

```typescript
interface DeliveryPageState {
  activeDivision: 'technology_services' | 'insurance' | 'both';
  filters: { division: string | null; nameRole: string | null; roleType: string[] | null };
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  isFullscreen: boolean;
  kpiData: {
    deliveryLeadership: Record<string, { count: number; acting: number }>;
    executionLeads: Record<string, { count: number; acting: number }>;
    portfolio: { activeCustomers: number; activeProjects: number };
  };
  tableData: DeliveryPerson[];
}

interface DeliveryPerson {
  id: number;
  name: string;
  role: string;
  customerCount: number;
  activeProjectCount: number;
  collaboratingWith: Record<'tl'|'fl'|'pl'|'dm'|'onsiteDm'|'pdm'|'pfm'|'pgm'|'po', number | 'NA'>;
  engineeringTeam: { headCount: number; allocation: number };
  divisionId: number;
}
```

---

## 10. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/delivery/kpi?division={id}` | GET | KPI summary for selected division |
| `/api/delivery/table?division={id}&sort={col}&order={dir}&role={type}` | GET | Table data with filters/sorting |
| `/api/delivery/export?division={id}&format=xlsx` | GET | Export filtered data |
| `/api/divisions` | GET | Division list for tabs |

---

## 11. Database Schema (PostgreSQL)

```sql
CREATE TABLE divisions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE delivery_persons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(100) NOT NULL,
  division_id INTEGER REFERENCES divisions(id),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE person_customer_assignments (
  id SERIAL PRIMARY KEY,
  person_id INTEGER REFERENCES delivery_persons(id),
  customer_id INTEGER REFERENCES customers(id),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE person_project_assignments (
  id SERIAL PRIMARY KEY,
  person_id INTEGER REFERENCES delivery_persons(id),
  project_id INTEGER REFERENCES projects(id),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE engineering_team_metrics (
  id SERIAL PRIMARY KEY,
  person_id INTEGER REFERENCES delivery_persons(id),
  head_count INTEGER DEFAULT 0,
  allocation DECIMAL(10,2) DEFAULT 0.00,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collaboration counts: computed via view joining person_project_assignments
-- KPI summary: materialized view grouping delivery_persons by role + division
```
