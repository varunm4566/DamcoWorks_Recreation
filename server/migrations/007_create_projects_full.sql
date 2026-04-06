-- 007_create_projects_full.sql
-- Full projects table with all columns needed for MyProjects screen

DROP TABLE IF EXISTS project_delivery_thoughts CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
  id                    SERIAL PRIMARY KEY,
  name                  VARCHAR(255) NOT NULL,
  client_name           VARCHAR(255) NOT NULL,
  client_id             INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  division              VARCHAR(100) NOT NULL,
  project_type          VARCHAR(50) NOT NULL,
  status                VARCHAR(50) DEFAULT 'active',
  tags                  JSONB DEFAULT '[]',
  pdm_name              VARCHAR(255),
  sm_name               VARCHAR(255),
  dm_name               VARCHAR(255),
  headcount             INTEGER DEFAULT 0,
  fte                   NUMERIC(6,2) DEFAULT 0,
  health_score          INTEGER,
  service_quality       VARCHAR(50),
  financial_health      VARCHAR(50),
  spi                   NUMERIC(4,2),
  cpi                   NUMERIC(4,2),
  variance_percent      NUMERIC(6,2) DEFAULT 0,
  assessment_overdue    BOOLEAN DEFAULT false,
  overdue_days          INTEGER DEFAULT 0,
  severe_overburn       BOOLEAN DEFAULT false,
  revenue_at_risk       NUMERIC(14,2) DEFAULT 0,
  is_critical_attention BOOLEAN DEFAULT false,
  customer_confidence   NUMERIC(3,1),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_division ON projects(division);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX idx_projects_critical ON projects(is_critical_attention) WHERE is_critical_attention = true;

CREATE TABLE project_delivery_thoughts (
  id              SERIAL PRIMARY KEY,
  project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  note            TEXT NOT NULL,
  author          VARCHAR(255) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_delivery_thoughts_project ON project_delivery_thoughts(project_id);
CREATE INDEX idx_delivery_thoughts_latest ON project_delivery_thoughts(project_id, created_at DESC);
