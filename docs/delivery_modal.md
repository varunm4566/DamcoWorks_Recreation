# Delivery Modal — UI & Functional Specification

> **Application:** DamcoWorks (OutSystems)
> **Module:** Delivery / People
> **Component:** Person Detail Modal
> **Trigger:** Click on any numeric value (headcount/team count) in the Delivery screen table
> **Documented:** 2026-03-29

---

## 1. Modal Structure

```
┌─────────────────────────────────────────────────────────┐
│  MODAL HEADER                                    [×]    │
│  Person Name (bold)                                     │
│  ( Role )  (muted)                                      │
├─────────────────────────────────────────────────────────┤
│  [Customers  N]  [Projects  N]  [Engineering Team  N]   │  ← Tab Bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TAB CONTENT AREA                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Modal Container

| Property | Value |
|---|---|
| Background | `#FFFFFF` |
| Border radius | `8px` |
| Box shadow | Standard modal overlay shadow |
| Overlay/backdrop | Semi-transparent gray |
| Max width | ~`1200px` |
| Close button | `×` — top-right corner of header |

---

## 3. Modal Header

| Element | Style |
|---|---|
| Person Name | Bold, ~`16px`, `#000000` |
| Role (below name) | `( Role Label )` — muted gray, ~`13px`, `#595959`, italic parentheses |
| Close `×` button | Top-right, gray icon, closes modal on click |
| Bottom border | `1px solid #DEE2E6` separating header from tab bar |

**Example:**
```
Abhinav Garg
( Project Lead )
```

---

## 4. Tab Bar

Three tabs displayed horizontally below the header. Each tab shows a **count badge** (amber/orange pill with number).

| Tab | Badge Count Source |
|---|---|
| **Customers** | Number of customers associated |
| **Projects** | Number of projects associated |
| **Engineering Team** | Total headcount across all projects |

### Tab Styling
| State | Style |
|---|---|
| **Active** | Red underline (`#E32200`), label in red/bold |
| **Inactive** | No underline, gray label `#595959` |
| Count badge | Amber/orange background (`~#F59E0B`), white or dark text, border-radius `20px`, padding `2px 8px`, font-size `12px` |

---

## 5. Tab 1: Customers

### Layout
A simple data table listing all customers associated with this person.

### Columns

| Column | Description | Width |
|---|---|---|
| **Customer** | Customer/company name | ~`35%` |
| **Type** | Engagement type (e.g., Direct) | ~`20%` |
| **Project Count** | Number of projects with this customer | ~`15%` |
| **Projects** | Project name(s) listed | ~`30%` |

### Table Styling
- Header row: `#F5F5F5` bg, `14px`, semi-bold `600`, `#000000`
- Body rows: white bg, `13px`, `#4D5156`
- Cell padding: `8px 12px`
- Row border: `1px solid #DEE2E6`
- No row hover action (display only)

### Sample Data Structure
```
| Customer                        | Type   | Project Count | Projects                                      |
|---------------------------------|--------|---------------|-----------------------------------------------|
| Agora Wealth Corp.              | Direct | 1             | Agora - Product Development Services         |
| Sword Group                     | Direct | 1             | Sword - Al Taresh Data Migration Services     |
| ExlService.com, LLC             | Direct | 1             | EXL - Dynamics 365 F&O Implementation         |
| KA Hospitality Private Limited  | Direct | 1             | ABNAH - Jolies Mobile App Dev & Web Dev       |
```

---

## 6. Tab 2: Projects

### Layout
A data table listing all projects associated with this person, with core team details.

### Toolbar (top-right of tab)
- **"To be Started"** toggle switch (pill toggle, default OFF)
  - When ON: includes projects yet to start in the list
  - When OFF: shows only active/ongoing projects

### Columns

| Column | Description | Width |
|---|---|---|
| **Project Name** | Full project name | ~`30%` |
| **Customer** | Associated customer name | ~`20%` |
| **Model** | Engagement model: `BYT`, `T&M`, `FP` | ~`8%` |
| **Start Date** | Project start date (`Mon DD, YYYY`) | ~`12%` |
| **End Date** | Project end date (`Mon DD, YYYY`) | ~`12%` |
| **Core Team** | Role assignments within the project | ~`18%` |

### Core Team Cell Structure
Each cell lists 4 role lines:
```
Technical Lead:          [Name or --]
Delivery Manager:        [Name or --]
Onsite Delivery Manager: [Name or --]
Program Manager:         [Name or --]
```
- Role label: `12px`, gray `#595959`
- Person name: `12px`, `#000000`, inline after label
- `--` displayed when role is unassigned

### Table Styling
- Header row: `#F5F5F5` bg, `14px`, semi-bold `600`, `#000000`
- Body rows: white bg, `13px`, `#4D5156`
- Cell padding: `10px 12px`
- Row border: `1px solid #DEE2E6`
- Vertical align: top

### Sample Data Structure
```
| Project Name                              | Customer                        | Model | Start Date   | End Date     |
|-------------------------------------------|---------------------------------|-------|--------------|--------------|
| Agora - Product Development Services      | Agora Wealth Corp.              | BYT   | May 02, 2022 | Apr 30, 2026 |
| EXL - Dynamics 365 F&O Implementation     | ExlService.com, LLC             | T&M   | Oct 07, 2024 | Apr 14, 2026 |
| ABNAH - Jolies Mobile App Dev & Web Dev   | KA Hospitality Private Limited  | FP    | Jun 16, 2025 | Feb 28, 2026 |
| Sword - Al Taresh Data Migration Services | Sword Group                     | FP    | Jul 14, 2025 | Mar 31, 2026 |
```

---

## 7. Tab 3: Engineering Team

### Layout
A detailed table showing all engineering team members across all projects under this person.

### Structure
The table groups members **by project**. Each project section spans multiple rows (one per team member), with the **Project** and **Core Team** columns merged/spanned across those rows.

### Columns

| Column | Description | Width |
|---|---|---|
| **Project** | Project name (rowspan across all members) | ~`18%` |
| **Core Team** | Role assignments for the project (rowspan) | ~`18%` |
| **Name** | Team member name | ~`14%` |
| **Title** | Job title (e.g., Senior Software Engineer I) | ~`16%` |
| **Role** | Project role (e.g., Senior Software Engineer) | ~`14%` |
| **Allocation %** | Allocation percentage + date range below | ~`10%` |
| **Billing %** | Billing percentage | ~`10%` |

### Allocation % Cell Structure
```
100 %
May 02, 2022 - Apr 30, 2026
```
- Percentage: `13px`, right-aligned, `#000000`
- Date range: `11px`, gray `#595959`, displayed below on new line

### Core Team Cell Structure (same as Projects tab)
```
Technical Lead:          [Name or --]
Delivery Manager:        [Name or --]
Onsite Delivery Manager: [Name or --]
Program Manager:         [Name or --]
```

### Table Styling
- Header row: `#F5F5F5` bg, `14px`, semi-bold `600`, `#000000`
- Body rows: alternating or white bg, `13px`, `#4D5156`
- Cell padding: `8px 12px`
- Row border: `1px solid #DEE2E6`
- Vertical align: top
- Project + Core Team cells: `vertical-align: top`, `rowspan` = number of team members in that project

---

## 8. Trigger Behavior

| Trigger | Source Screen | Data Loaded |
|---|---|---|
| Click on headcount number in Delivery table | Delivery screen row | Person name, role, all 3 tab data |
| Default tab on open | — | **Customers** tab is active by default |

---

## 9. Interaction Summary

| Element | Behavior |
|---|---|
| `×` close button | Closes modal, returns to Delivery screen |
| Tab click | Switches tab content; active tab gets red underline |
| "To be Started" toggle (Projects tab) | Filters project list to include/exclude not-yet-started projects |
| Modal backdrop click | May close modal (standard modal behavior) |
| Table rows | Display only — no click actions on rows |

---

## 10. Database Tables (PostgreSQL — Reference)

The modal draws data from the following entities:

| Tab | Primary Tables |
|---|---|
| Customers | `customers`, `projects`, `project_assignments` |
| Projects | `projects`, `project_core_team`, `employees` |
| Engineering Team | `projects`, `project_core_team`, `project_allocations`, `employees` |

> Person identity (name + role) is sourced from the `employees` or `people` table based on the ID passed when the modal is triggered.

---

## 11. Spacing & Layout Tokens

| Token | Value |
|---|---|
| Modal header padding | `16px 20px` |
| Tab bar padding | `0 20px` |
| Tab item padding | `10px 16px` |
| Table cell padding | `8px 12px` |
| Tab count badge border-radius | `20px` |
| Tab count badge padding | `2px 8px` |
| Active tab border-bottom | `2px solid #E32200` |
