-- 008_add_missing_project_columns.sql
-- Adds 7 columns that were lost when migration 007 dropped and recreated the projects table.
-- Also recreates project_milestones which was dropped in 007.

ALTER TABLE projects ADD COLUMN IF NOT EXISTS engagement_model     VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS margin_percent       DECIMAL(5,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS overburn_percent     DECIMAL(8,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS csat_trend           VARCHAR(20);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_start_date  DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_end_date    DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_value       DECIMAL(15,2);

CREATE TABLE IF NOT EXISTS project_milestones (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL,
  due_date   DATE,
  status     VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestones_project ON project_milestones(project_id);
