-- ============================================================
-- Migration 005: Projects Schema
-- Tables: divisions, employees, projects, project_resources,
--         milestones, delivery_thoughts
-- ============================================================

-- 1. divisions
CREATE TABLE IF NOT EXISTS divisions (
  id                      SERIAL PRIMARY KEY,
  name                    VARCHAR(100) NOT NULL UNIQUE,
  active_project_count    INTEGER DEFAULT 0,
  delivery_manager_count  INTEGER DEFAULT 0,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- 2. employees
DO $$ BEGIN
  CREATE TYPE employee_role_type AS ENUM (
    'delivery_manager',
    'sales_manager',
    'project_lead',
    'tech_lead',
    'client_partner',
    'program_manager',
    'onsite_dm',
    'engineer',
    'pmo_analyst'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS employees (
  id             SERIAL PRIMARY KEY,
  full_name      VARCHAR(255) NOT NULL,
  employee_code  VARCHAR(50)  NOT NULL UNIQUE,
  title          VARCHAR(100),
  role_type      employee_role_type NOT NULL,
  skills         TEXT[],
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 3. projects
CREATE TABLE IF NOT EXISTS projects (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  customer_id     INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  division_id     INTEGER REFERENCES divisions(id) ON DELETE SET NULL,

  -- Engagement
  project_type      VARCHAR(20)  NOT NULL,
  engagement_model  VARCHAR(30),
  status            VARCHAR(20)  NOT NULL DEFAULT 'Active',

  -- Classification tags
  offering    VARCHAR(100),
  domain      VARCHAR(100),
  geography   VARCHAR(100),
  currency    VARCHAR(10),

  -- Team
  delivery_manager_id  INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  sales_manager_id     INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  project_lead_id      INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  tech_lead_id         INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  client_partner_id    INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  program_manager_id   INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  onsite_dm_id         INTEGER REFERENCES employees(id) ON DELETE SET NULL,

  -- Timeline
  start_date     DATE,
  end_date       DATE,
  contract_link  TEXT,

  -- Health scores (0–100)
  overall_health_score   INTEGER CHECK (overall_health_score BETWEEN 0 AND 100),
  service_quality_score  INTEGER CHECK (service_quality_score BETWEEN 0 AND 100),
  financial_health_score INTEGER CHECK (financial_health_score BETWEEN 0 AND 100),

  -- Delivery health (FP projects)
  spi                          NUMERIC(4,2),
  cpi                          NUMERIC(4,2),
  effort_variance              NUMERIC(6,2),
  budgeted_hours               NUMERIC(10,2),
  logged_hours                 NUMERIC(10,2),
  planned_completion_percentage NUMERIC(5,2),

  -- Financials
  margin_percentage  NUMERIC(5,2),
  total_booked       NUMERIC(14,2),
  total_invoiced     NUMERIC(14,2),
  total_received     NUMERIC(14,2),
  total_outstanding  NUMERIC(14,2),
  total_overdue      NUMERIC(14,2),
  avg_ageing_days    INTEGER,

  -- CSAT
  csat_score  NUMERIC(3,1) CHECK (csat_score BETWEEN 0 AND 5),
  csat_trend  VARCHAR(10),

  -- Assessment
  last_assessment_date    DATE,
  assessment_overdue_days INTEGER,

  -- Overview
  project_overview TEXT,

  -- AI-generated fields
  ai_highlights   TEXT[],
  ai_concerns     TEXT[],
  ai_next_steps   TEXT[],
  ai_evaluated_at TIMESTAMPTZ,

  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes on projects
CREATE INDEX IF NOT EXISTS idx_projects_customer_id        ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_division_id        ON projects(division_id);
CREATE INDEX IF NOT EXISTS idx_projects_delivery_manager_id ON projects(delivery_manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_status             ON projects(status);

-- 4. project_resources
CREATE TABLE IF NOT EXISTS project_resources (
  id                    SERIAL PRIMARY KEY,
  project_id            INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  employee_id           INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  sow_role              VARCHAR(100),
  allocation_percentage NUMERIC(5,2),
  billing_type          VARCHAR(20),
  allocation_start      DATE,
  allocation_end        DATE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_resources_project_id ON project_resources(project_id);

-- 5. milestones
CREATE TABLE IF NOT EXISTS milestones (
  id               SERIAL PRIMARY KEY,
  project_id       INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name             VARCHAR(255),
  status           VARCHAR(20),
  planned_date     DATE,
  actual_date      DATE,
  is_chronic_delay BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 6. delivery_thoughts
CREATE TABLE IF NOT EXISTS delivery_thoughts (
  id             SERIAL PRIMARY KEY,
  project_id     INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id      INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  thought_text   TEXT NOT NULL,
  health_status  VARCHAR(20),
  ai_summary     TEXT,
  ai_risks       TEXT[],
  ai_actions     TEXT[],
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_thoughts_project_id ON delivery_thoughts(project_id);
