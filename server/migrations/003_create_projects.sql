-- ============================================================
-- Migration 003: Projects module tables
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
  id                    SERIAL PRIMARY KEY,
  name                  VARCHAR(255) NOT NULL,
  client_name           VARCHAR(255),
  client_id             INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  division              VARCHAR(100),
  project_type          VARCHAR(50),
  engagement_model      VARCHAR(100),
  status                VARCHAR(50) DEFAULT 'active',
  tags                  JSONB DEFAULT '[]',

  -- People
  pdm_name              VARCHAR(255),
  dm_name               VARCHAR(255),
  sm_name               VARCHAR(255),
  headcount             INTEGER DEFAULT 0,
  fte                   DECIMAL(5,1) DEFAULT 0,

  -- Overall Health
  health_score          INTEGER,
  service_quality       VARCHAR(50),
  financial_health      VARCHAR(50),
  customer_confidence   DECIMAL(3,1),

  -- Delivery Health
  spi                   DECIMAL(5,2),
  cpi                   DECIMAL(5,2),
  variance_percent      DECIMAL(8,2),

  -- Financials
  margin_percent        DECIMAL(5,2),
  overburn_percent      DECIMAL(8,2),
  revenue_at_risk       DECIMAL(15,2) DEFAULT 0,
  severe_overburn       BOOLEAN DEFAULT false,

  -- CSAT
  csat_trend            VARCHAR(20),

  -- Assessment / Risk flags
  assessment_overdue    BOOLEAN DEFAULT false,
  overdue_days          INTEGER DEFAULT 0,
  is_critical_attention BOOLEAN DEFAULT false,

  -- Timeline & Contract
  contract_start_date   DATE,
  contract_end_date     DATE,
  contract_value        DECIMAL(15,2),

  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);

-- Add new columns to existing table (safe to run on existing data)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS engagement_model   VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS margin_percent     DECIMAL(5,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS overburn_percent   DECIMAL(8,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS csat_trend         VARCHAR(20);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_start_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_end_date  DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_value     DECIMAL(15,2);

-- ============================================================

CREATE TABLE IF NOT EXISTS project_delivery_thoughts (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  note       TEXT NOT NULL,
  author     VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================

CREATE TABLE IF NOT EXISTS project_milestones (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL,
  due_date   DATE,
  status     VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_division        ON projects(division);
CREATE INDEX IF NOT EXISTS idx_projects_status          ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_health_score    ON projects(health_score);
CREATE INDEX IF NOT EXISTS idx_projects_tags            ON projects USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_delivery_thoughts_proj   ON project_delivery_thoughts(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project       ON project_milestones(project_id);
