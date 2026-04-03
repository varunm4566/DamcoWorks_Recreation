# MyProjects Screen — Final Converged Functional & UI Specification (Enhanced)

> **Application:** DamcoWorks (OutSystems)  
> **Module:** Projects  
> **Screen:** MyProjects  
> **Version:** Final (Enhanced with Interaction Logic + UI Details)

---

# 1. OBJECTIVE

A unified dashboard to:
- Monitor KPIs
- Filter & analyze projects
- Drill down into detailed project insights

---

# 2. LAYOUT STRUCTURE

- Header (58px)
- Sidebar (75px)
- Main Content
- Right Drawer (60–75% width)
- Footer (fixed)

---

# 3. DIVISION TABS (TOP CONTAINERS)

## Behavior (Enhanced)
- All division containers are **clickable**
- Clicking a division:
  - Filters **KPI values**
  - Filters **table data**
  - Adds filter chip: `Division : [Selected Division] ×`

## Tabs:
- Technology Services
- Insurance
- ITES
- Marketing Services
- Salesforce
- Staffing
- All

## UI Styling:
- Active:
  - Background: `rgba(99,102,241,0.1)`
  - Border: `2px solid #4338CA`
- Inactive: Transparent

---

# 4. KPI CARDS (CLICKABLE LOGIC)

## All KPI cards are CLICKABLE and act as filters

### 4.1 Critical Attention
- Filters projects where:
  - High risk conditions
- Adds chip: `Critical Attention : Total`

### 4.2 Revenue at Risk
- Filters projects where:
  - Payments overdue > 90 days
- Adds chip: `Revenue at Risk : Yes`

### 4.3 Delivery Performance Index
- Filters projects where:
  - SPI < 0.9
- Adds chip: `SPI < 0.9`

### 4.4 Customer Confidence
- Filters projects where:
  - CSAT < 3.5
- Adds chip: `CSAT < 3.5`

### 4.5 Active Projects
- Filters projects where:
  - Status = Active
- Adds chip: `Status : Active`

## UI Design:
- Background: `#E1E2E4`
- Active Card:
  - Border: `2px solid #6366F1`
  - Background: `#EEF2FF`
- Value Colors:
  - Critical / Revenue: `#E32200`
  - Neutral KPIs: `#181818`

---

# 5. FILTER BAR (ENHANCED LOGIC)

## Filter Chip Behavior
- Every interaction adds a chip
- Division + KPI + Search all appear together

---

# 6. COLUMN-LEVEL FILTERING (ENHANCED)

## Generic Behavior
- Click filter icon → dropdown opens
- First dropdown = **Filter Type Selector**
- Second input = **Dynamic input (text/select)**

---

## 6.1 Project Column Filter

### Step 1: Select Filter Type
- Project
- Customer
- Project Type
- Engagement Model

### Step 2: Input Field
- Text input OR dropdown (based on type)

### Result:
- Filters table dynamically

---

## 6.2 People Column Filter
- Filter by:
  - Delivery Manager
  - Sales Manager

---

## 6.3 Overall Health Filter
- Filter by:
  - Health Score
  - Service Quality
  - Financial Health

---

## 6.4 Other Columns

All columns support filtering based on their data:
- Delivery Health → SPI, CPI, Variance
- Financials → Margin, Overburn
- CSAT → Score
- Milestone → Status
- Timeline → Dates / duration

---

# 7. DATA TABLE INTERACTIONS

## Row Click Behavior
- Clicking ANY cell opens detail drawer

## Empty State
- "No projects found"
- CTA: Clear Filters

---

# 8. DETAIL DRAWER (RIGHT FLYOUT)

## Trigger
- Click on any row

## Behavior
- Slides from right
- Overlay with navigation tabs

---

## 8.1 Navigation Tabs (FINAL)

1. Overview & Insights
2. People & Ownership
3. Overall Health
4. Delivery Health
5. Delivery Thoughts
6. Financials
7. CSAT
8. Milestone Health
9. Timeline & Contract
10. Quality

---

## 8.2 Tab Data Mapping (IMPORTANT)

Each tab maps to table column data:

### Overview & Insights
- Project summary
- Key metrics

### People & Ownership
- Delivery Manager
- Sales Manager
- Headcount
- FTE

### Overall Health
- Score
- Service Quality
- Financial Health

### Delivery Health
- SPI
- CPI
- Variance

### Delivery Thoughts
- Notes
- Latest update

### Financials
- Margin
- Overburn

### CSAT
- Score
- Trend

### Milestone Health
- Status

### Timeline & Contract
- Duration
- Contract info

### Quality
- Quality metrics (future scope)

---

# 9. UI DESIGN SYSTEM (MERGED)

## Colors

### Primary
- `#E32200` → Primary red

### Backgrounds
- Page: `#F7F8FC`
- Cards: `#FFFFFF`
- KPI: `#E1E2E4`

### Status Colors
- Healthy: `#DCFFE3`
- Caution: `#FFF6EA`
- At Risk: `#FFE0DD`

### Tags
- Offering: `#DEF9FF`
- Domain: `#F6DAFF`
- Geography: `#E5EBFE`
- Currency: `#FFF6EA`

---

## Typography
- Font: Lato
- Base: 13px

---

## Icons
- FontAwesome

---

# 10. PERFORMANCE

- Load < 2s
- Filters < 500ms

---

# 11. FINAL NOTES

This document now includes:
- Full UI
- Full filtering logic
- KPI interactions
- Division interactions
- Drawer mapping
- Design system

---

**End of Enhanced Specification**

