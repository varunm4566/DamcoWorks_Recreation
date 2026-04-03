# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DamcoWorks Recreation — a full-stack ERP application for Damco Solutions, being rebuilt from OutSystems to a modern web stack. See [docs/implementation-plan.md](docs/implementation-plan.md) for phase status.

**Stack:** React + Vite + TailwindCSS · Node.js + Express · PostgreSQL · JWT auth

## Commands

```bash
npm run dev      # Vite dev server (frontend, port 5173)
npm run server   # Express API server (backend, port 3000)
npm run build    # Production build
npm run lint     # ESLint
```

Database migrations are plain SQL files in `server/migrations/`. Run them manually in order against PostgreSQL.

## Architecture

### Data Flow
```
React page → src/api/*.js (fetch wrappers) → Express routes → server/models/*.js → PostgreSQL
```

- `src/api/` files are thin fetch wrappers — one file per domain (auth, customers, projects, etc.). They handle base URL, headers, and error normalization.
- `server/routes/` files handle HTTP routing and input validation only.
- `server/models/` files contain all SQL — routes never write raw SQL directly.
- `server/middleware/auth.middleware.js` validates JWT and attaches `req.user`.
- `server/middleware/role.middleware.js` guards routes by role (Admin, Manager, Employee).

### Auth Flow
Login → `POST /api/auth/login` → returns JWT → stored client-side → sent as `Authorization: Bearer <token>` on every request → `auth.middleware.js` validates → `req.user` available in all subsequent handlers.

### Frontend Routing
React Router handles all client-side routing. Protected routes check `AuthContext` for a valid session. `src/context/` holds `AuthContext` and `ThemeContext`.

## API Response Shape

All endpoints must return this shape — no exceptions:
```js
// Success
{ success: true, data: { ... } }

// Error
{ success: false, error: "Human-readable message" }
```

## Coding Rules

- All DB queries in `server/models/` only — never raw SQL in route files
- Functional React components only
- `async/await` only — no `.then()` chains
- Named exports preferred over default exports
- 2-space indentation

## Domain Glossary

| Term | Meaning |
|------|---------|
| Bench | Employees not currently assigned to any active project |
| Resource | An employee allocated to a project with a defined role/percentage |
| Module | A major functional area (Dashboard, Customers, Projects, etc.) |

## Implementation Phases

**Phase 1 — Foundation (current)**
Authentication, JWT, protected routes, base layout (sidebar + topbar), user management

**Phase 2 — Core Modules**
Dashboard (KPIs, charts), Customer CRUD, Project management, Bench tracking, Resource allocation

**Phase 3 — Advanced**
Reports + PDF export, Notifications, Admin panel, Deployment

## Design System

See [docs/UI_Specification.md](docs/UI_Specification.md) for the full design system — colors, gradients, typography, layout dimensions, component patterns (tabs, KPI cards, tables, filters, tags), interaction states, shadows, and animations. All new screens and components must follow this spec.

## API Usage
- Prefer batching questions rather than making rapid sequential calls
- Pause between large operations