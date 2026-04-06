-- 012_customer_detail_tables.sql
-- New tables and project columns for the Customer Detail page
-- Covers: Stakeholders, Partner Logs, Monthly/Yearly Revenue, Bookings

-- ── 1. Add missing columns to projects ───────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS overall_health        VARCHAR(50);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_revenue_usd     DECIMAL(14,2) DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_cost_usd        DECIMAL(14,2) DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_pulse_sentiment    VARCHAR(120);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_pulse_actions      JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS unique_headcount       INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS department            VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS delivery_head         VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS payment_timeliness_days INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS payterm_days          INTEGER DEFAULT 60;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_pulse_summary      TEXT;

-- ── 2. customer_stakeholders ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_stakeholders (
  id                       SERIAL PRIMARY KEY,
  customer_id              INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  salutation               VARCHAR(20),
  first_name               VARCHAR(100) NOT NULL,
  last_name                VARCHAR(100),
  designation              VARCHAR(255),
  email                    VARCHAR(255),
  contact_number           VARCHAR(50),
  relationship_type        VARCHAR(100),
  stakeholder_role         VARCHAR(100),
  status                   VARCHAR(20) DEFAULT 'active',
  linkedin_url             VARCHAR(500),
  reports_to               VARCHAR(255),
  reports_to_designation   VARCHAR(255),
  last_contact_date        DATE,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_stakeholders_customer ON customer_stakeholders(customer_id);

-- ── 3. customer_partner_logs ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_partner_logs (
  id            SERIAL PRIMARY KEY,
  customer_id   INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  partner_type  VARCHAR(30) NOT NULL,   -- 'client_partner' | 'client_co_partner'
  partner_name  VARCHAR(255) NOT NULL,
  added_on      DATE NOT NULL DEFAULT CURRENT_DATE,
  added_by      VARCHAR(255),
  updated_on    DATE,
  updated_by    VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_partner_logs_customer ON customer_partner_logs(customer_id);

-- ── 4. customer_monthly_revenue ──────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_monthly_revenue (
  id            SERIAL PRIMARY KEY,
  customer_id   INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  month_year    VARCHAR(10) NOT NULL,   -- 'YYYY-MM'
  revenue_usd   DECIMAL(12,2) DEFAULT 0,
  revenue_inr   DECIMAL(14,2) DEFAULT 0,
  project_count INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_monthly_rev_customer ON customer_monthly_revenue(customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_monthly_rev_unique ON customer_monthly_revenue(customer_id, month_year);

-- ── 5. customer_yearly_revenue ───────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_yearly_revenue (
  id            SERIAL PRIMARY KEY,
  customer_id   INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  fy_year       VARCHAR(10) NOT NULL,   -- 'YYYY-YY'
  revenue_usd   DECIMAL(12,2) DEFAULT 0,
  revenue_inr   DECIMAL(14,2) DEFAULT 0,
  project_count INTEGER DEFAULT 0,
  onboarded_on  DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_yearly_rev_customer ON customer_yearly_revenue(customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_yearly_rev_unique ON customer_yearly_revenue(customer_id, fy_year);

-- ── 6. customer_bookings ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_bookings (
  id                 SERIAL PRIMARY KEY,
  customer_id        INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  project_name       VARCHAR(255) NOT NULL,
  engagement_model   VARCHAR(50),
  sales_owner        VARCHAR(255),
  program_manager    VARCHAR(255),
  total_booked_usd   DECIMAL(12,2) DEFAULT 0,
  total_booked_inr   DECIMAL(14,2) DEFAULT 0,
  contract_ending_on DATE,
  total_invoiced_usd DECIMAL(12,2) DEFAULT 0,
  total_invoiced_inr DECIMAL(14,2) DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON customer_bookings(customer_id);

-- ── 7. customer_booking_months ───────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_booking_months (
  id          SERIAL PRIMARY KEY,
  booking_id  INTEGER NOT NULL REFERENCES customer_bookings(id) ON DELETE CASCADE,
  month_year  VARCHAR(10) NOT NULL,
  booked_nn   DECIMAL(12,2) DEFAULT 0,   -- New Names
  booked_en   DECIMAL(12,2) DEFAULT 0,   -- Existing Names
  booked_ee   DECIMAL(12,2) DEFAULT 0    -- Existing Expansion
);
CREATE INDEX IF NOT EXISTS idx_booking_months_booking ON customer_booking_months(booking_id);

-- ── 8. Seed demo data ────────────────────────────────────────────
DO $$
DECLARE
  demo_cid  INTEGER;
  proj_id1  INTEGER;
  proj_id2  INTEGER;
  proj_id3  INTEGER;
  proj_id4  INTEGER;
  proj_id5  INTEGER;
  bk_id1    INTEGER;
  bk_id2    INTEGER;
  bk_id3    INTEGER;
  bk_id4    INTEGER;
BEGIN
  -- Use first customer as demo
  SELECT id INTO demo_cid FROM customers ORDER BY id LIMIT 1;
  IF demo_cid IS NULL THEN RETURN; END IF;

  -- ── Seed/update projects for demo customer ──────────────────
  -- Upsert-style: insert if not present, update if already there
  INSERT INTO projects (
    name, client_name, client_id, division, project_type, engagement_model, status,
    service_quality, financial_health, overall_health,
    total_revenue_usd, total_cost_usd, margin_percent,
    ai_pulse_sentiment, ai_pulse_summary,
    ai_pulse_actions,
    headcount, unique_headcount, payterm_days, payment_timeliness_days,
    contract_start_date, contract_end_date,
    dm_name, program_manager, project_lead, tech_lead, delivery_head
  )
  SELECT
    'Cube - Providing Rulebook Name Inventories',
    (SELECT name FROM customers WHERE id = demo_cid),
    demo_cid, 'Technology Services', 'T&M', 'T&M', 'active',
    'healthy', 'healthy', 'healthy',
    6276.00, 627.60, 90.0,
    'Holding steady for now',
    'The team remains proactive and fully engaged, maintaining steady progress with no major blockers.',
    '["Customer feedback missing for the past 2 months; suggest capturing it to improve visibility.", "Consider scheduling a quarterly review to align on roadmap priorities."]'::jsonb,
    8, 8, 60, 0,
    '2023-04-01', '2026-03-31',
    'Devinder Singh Rawat', 'Devinder Singh Rawat', NULL, NULL, 'Mohit Gupta'
  WHERE NOT EXISTS (
    SELECT 1 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - Providing Rulebook Name Inventories'
  )
  RETURNING id INTO proj_id1;

  IF proj_id1 IS NULL THEN
    SELECT id INTO proj_id1 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - Providing Rulebook Name Inventories' LIMIT 1;
  END IF;

  INSERT INTO projects (
    name, client_name, client_id, division, project_type, engagement_model, status,
    service_quality, financial_health, overall_health,
    total_revenue_usd, total_cost_usd, margin_percent,
    ai_pulse_sentiment, ai_pulse_summary, ai_pulse_actions,
    headcount, unique_headcount, payterm_days, payment_timeliness_days,
    contract_start_date, contract_end_date,
    dm_name, program_manager, project_lead, tech_lead, delivery_head
  )
  SELECT
    'Cube - Updating Monitored Rule Books',
    (SELECT name FROM customers WHERE id = demo_cid),
    demo_cid, 'Technology Services', 'T&M', 'T&M', 'active',
    'healthy', 'healthy', 'healthy',
    152157.30, 9591.60, 93.7,
    'Progress on the right track',
    'The team''s performance remains strong as they continue delivering consistent results.',
    '["Schedule a 1-on-1 with the client to discuss upcoming milestones.", "Review sprint velocity trend and flag any slowdowns proactively."]'::jsonb,
    24, 24, 60, 0,
    '2022-01-15', '2026-03-31',
    'Devinder Singh Rawat', 'Devinder Singh Rawat', NULL, NULL, 'Mohit Gupta'
  WHERE NOT EXISTS (
    SELECT 1 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - Updating Monitored Rule Books'
  )
  RETURNING id INTO proj_id2;

  IF proj_id2 IS NULL THEN
    SELECT id INTO proj_id2 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - Updating Monitored Rule Books' LIMIT 1;
  END IF;

  INSERT INTO projects (
    name, client_name, client_id, division, project_type, engagement_model, status,
    service_quality, financial_health, overall_health,
    total_revenue_usd, total_cost_usd, margin_percent,
    ai_pulse_sentiment, ai_pulse_summary, ai_pulse_actions,
    headcount, unique_headcount, payterm_days, payment_timeliness_days,
    contract_start_date, contract_end_date,
    dm_name, program_manager, project_lead, tech_lead, delivery_head
  )
  SELECT
    'Cube - Web Monitoring of Rulebooks',
    (SELECT name FROM customers WHERE id = demo_cid),
    demo_cid, 'Technology Services', 'T&M', 'T&M', 'active',
    'healthy', 'healthy', 'healthy',
    93943.80, 16110.60, 82.8,
    'Progress on the right track',
    'The project is progressing steadily with a well-coordinated team handling the web monitoring pipeline.',
    '["Verify that the monitoring alerting thresholds are current.", "Confirm SLA metrics are being tracked per client agreement."]'::jsonb,
    18, 18, 60, 0,
    '2022-06-01', '2026-03-31',
    'Hitendra Singh Karki', 'Hitendra Singh Karki', NULL, NULL, 'Mohit Gupta'
  WHERE NOT EXISTS (
    SELECT 1 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - Web Monitoring of Rulebooks'
  )
  RETURNING id INTO proj_id3;

  IF proj_id3 IS NULL THEN
    SELECT id INTO proj_id3 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - Web Monitoring of Rulebooks' LIMIT 1;
  END IF;

  INSERT INTO projects (
    name, client_name, client_id, division, project_type, engagement_model, status,
    service_quality, financial_health, overall_health,
    total_revenue_usd, total_cost_usd, margin_percent,
    ai_pulse_sentiment, ai_pulse_summary, ai_pulse_actions,
    headcount, unique_headcount, payterm_days, payment_timeliness_days,
    contract_start_date, contract_end_date,
    dm_name, program_manager, project_lead, tech_lead, delivery_head
  )
  SELECT
    'Cube - XML Tagging of Extracted Data',
    (SELECT name FROM customers WHERE id = demo_cid),
    demo_cid, 'Technology Services', 'FP', 'FP', 'active',
    'healthy', 'healthy', 'healthy',
    30339.90, 1833.60, 94.0,
    'Things are looking good',
    'The project is progressing smoothly with consistent deliverables meeting client expectations.',
    '["Document the XML schema changes for audit trail purposes.", "Ensure UAT sign-off is scheduled for the upcoming milestone."]'::jsonb,
    6, 6, 60, 0,
    '2024-07-01', '2026-06-30',
    'Devinder Singh Rawat', 'Devinder Singh Rawat', NULL, NULL, 'Mohit Gupta'
  WHERE NOT EXISTS (
    SELECT 1 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - XML Tagging of Extracted Data'
  )
  RETURNING id INTO proj_id4;

  IF proj_id4 IS NULL THEN
    SELECT id INTO proj_id4 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - XML Tagging of Extracted Data' LIMIT 1;
  END IF;

  INSERT INTO projects (
    name, client_name, client_id, division, project_type, engagement_model, status,
    service_quality, financial_health, overall_health,
    total_revenue_usd, total_cost_usd, margin_percent,
    ai_pulse_sentiment, ai_pulse_summary, ai_pulse_actions,
    headcount, unique_headcount, payterm_days, payment_timeliness_days,
    contract_start_date, contract_end_date,
    dm_name, program_manager, project_lead, tech_lead, delivery_head
  )
  SELECT
    'Cube - Data Collection from Govt Regulatory Websites',
    (SELECT name FROM customers WHERE id = demo_cid),
    demo_cid, 'Technology Services', 'T&M', 'T&M', 'inactive',
    'healthy', 'at_risk', 'caution',
    65.00, 0.00, 100.0,
    'Holding steady for now',
    'Project is currently inactive. Final billing is in progress.',
    '[]'::jsonb,
    3, 3, 60, 0,
    '2023-01-01', '2024-12-31',
    'Devinder Singh Rawat', 'Devinder Singh Rawat', NULL, NULL, 'Mohit Gupta'
  WHERE NOT EXISTS (
    SELECT 1 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - Data Collection from Govt Regulatory Websites'
  )
  RETURNING id INTO proj_id5;

  IF proj_id5 IS NULL THEN
    SELECT id INTO proj_id5 FROM projects
    WHERE client_id = demo_cid AND name = 'Cube - Data Collection from Govt Regulatory Websites' LIMIT 1;
  END IF;

  -- ── Delivery Thoughts ─────────────────────────────────────────
  IF proj_id1 IS NOT NULL THEN
    INSERT INTO project_delivery_thoughts (project_id, note, author, created_at)
    VALUES
      (proj_id1, 'This week, we haven''t received any new assignments. The team remains proactive and fully engaged with current tasks.', 'Devinder Singh Rawat', NOW() - INTERVAL '7 days'),
      (proj_id1, 'Team completed inventory validation for 1,200 rulebooks. No blockers identified.', 'Devinder Singh Rawat', NOW() - INTERVAL '14 days')
    ON CONFLICT DO NOTHING;
  END IF;

  IF proj_id2 IS NOT NULL THEN
    INSERT INTO project_delivery_thoughts (project_id, note, author, created_at)
    VALUES
      (proj_id2, 'This week, we received 366 files for processing. The team''s performance remains strong as they continue delivering consistent results.', 'Devinder Singh Rawat', NOW() - INTERVAL '5 days'),
      (proj_id2, 'Processed 342 rule book updates. Client confirmed all deliveries met quality standards.', 'Devinder Singh Rawat', NOW() - INTERVAL '12 days')
    ON CONFLICT DO NOTHING;
  END IF;

  IF proj_id3 IS NOT NULL THEN
    INSERT INTO project_delivery_thoughts (project_id, note, author, created_at)
    VALUES
      (proj_id3, 'This week, the inventory stands at 62,703 records monitored. The project is progressing steadily with a well-coordinated team.', 'Hitendra Singh Karki', NOW() - INTERVAL '6 days')
    ON CONFLICT DO NOTHING;
  END IF;

  IF proj_id4 IS NOT NULL THEN
    INSERT INTO project_delivery_thoughts (project_id, note, author, created_at)
    VALUES
      (proj_id4, 'This week, we received 5 SOWs for tagging. The project is progressing smoothly with consistent deliverables.', 'Devinder Singh Rawat', NOW() - INTERVAL '4 days')
    ON CONFLICT DO NOTHING;
  END IF;

  -- ── Stakeholders ──────────────────────────────────────────────
  INSERT INTO customer_stakeholders (customer_id, salutation, first_name, last_name, designation, email, contact_number, relationship_type, stakeholder_role, status, last_contact_date)
  VALUES
    (demo_cid, 'Mr.',  'Rob',     'West',      'Publishing Operations Director', 'rob.west@cube.com',       '+44 20 7946 0001', 'Sales SPOC',       'Decision Maker', 'active', '2026-01-15'),
    (demo_cid, 'Ms.',  'Annabel', 'Phillips',  'QA Analyst',                    'annabel.phillips@cube.com','+44 20 7946 0002', 'Delivery SPOC',    NULL,             'active', NULL),
    (demo_cid, 'Ms.',  'Nicola',  'Player',    'Resource/Vendor Co-ordinator',  'nicola.player@cube.com',  '+44 20 7946 0003', 'Accounting SPOC',  NULL,             'active', NULL),
    (demo_cid, 'Mr.',  'Andrej',  'Skripic',   'Head of Data Operations',       'andrej.skripic@cube.com', '+44 20 7946 0004', 'Delivery SPOC',    NULL,             'active', NULL),
    (demo_cid, NULL,   'Test',    'POC Test',  'Test',                          'test.poc@cube.com',       NULL,              'Delivery SPOC',    'Decision Maker', 'active', NULL)
  ON CONFLICT DO NOTHING;

  -- ── Partner Logs ──────────────────────────────────────────────
  INSERT INTO customer_partner_logs (customer_id, partner_type, partner_name, added_on, added_by)
  VALUES
    (demo_cid, 'client_partner', 'Mohit Gupta', '2025-06-24', 'Mohit Gupta')
  ON CONFLICT DO NOTHING;

  -- ── Monthly Revenue (CFY Apr 2025 – Jan 2026) ─────────────────
  INSERT INTO customer_monthly_revenue (customer_id, month_year, revenue_usd, revenue_inr, project_count)
  VALUES
    (demo_cid, '2026-01', 24970.00, 2079553.00, 4),
    (demo_cid, '2025-12', 23650.00, 1969547.00, 4),
    (demo_cid, '2025-11', 21230.00, 1768398.00, 3),
    (demo_cid, '2025-10', 26700.00, 2223270.00, 4),
    (demo_cid, '2025-09', 24710.00, 2058263.00, 4),
    (demo_cid, '2025-08', 23100.00, 1924137.00, 4),
    (demo_cid, '2025-07', 22050.00, 1836742.00, 3),
    (demo_cid, '2025-06', 24300.00, 2024190.00, 4),
    (demo_cid, '2025-05', 23800.00, 1982538.00, 4),
    (demo_cid, '2025-04', 22750.00, 1894810.00, 3)
  ON CONFLICT (customer_id, month_year) DO NOTHING;

  -- ── Yearly Revenue (historical) ───────────────────────────────
  INSERT INTO customer_yearly_revenue (customer_id, fy_year, revenue_usd, revenue_inr, project_count, onboarded_on)
  VALUES
    (demo_cid, '2025-26', 258590.00, 21550045.00, 4, '2019-04-03'),
    (demo_cid, '2024-25', 235400.00, 19613970.00, 4, '2019-04-03'),
    (demo_cid, '2023-24', 198700.00, 16554105.00, 3, '2019-04-03'),
    (demo_cid, '2022-23', 187300.00, 15605565.00, 3, '2019-04-03'),
    (demo_cid, '2021-22', 165400.00, 13783290.00, 2, '2019-04-03'),
    (demo_cid, '2020-21', 142100.00, 11839333.00, 2, '2019-04-03'),
    (demo_cid, '2019-20', 101000.00,  8414300.00, 1, '2019-04-03')
  ON CONFLICT (customer_id, fy_year) DO NOTHING;

  -- ── Bookings ──────────────────────────────────────────────────
  INSERT INTO customer_bookings (customer_id, project_name, engagement_model, sales_owner, program_manager, total_booked_usd, total_booked_inr, contract_ending_on, total_invoiced_usd, total_invoiced_inr)
  VALUES
    (demo_cid, 'Cube - Updating Monitored Rule Books',            'T&M', 'Neha Panchal', 'Devinder Singh Rawat', 68000.00, 5664400.00, '2026-03-31', 152157.30, 12674707.00),
    (demo_cid, 'Cube - Web Monitoring of Rulebooks',              'T&M', 'Neha Panchal', 'Hitendra Singh Karki', 72000.00, 5997600.00, '2026-03-31',  93943.80,  7825070.00),
    (demo_cid, 'Cube - XML Tagging of Extracted Data',            'FP',  'Neha Panchal', 'Devinder Singh Rawat', 32000.00, 2665600.00, '2026-06-30',  30339.90,  2527307.00),
    (demo_cid, 'Cube - Providing Rulebook Name Inventories',      'T&M', 'Neha Panchal', 'Devinder Singh Rawat', 28380.00, 2363382.00, '2026-03-31',    627.60,    52271.00)
  ON CONFLICT DO NOTHING;

  -- Booking months for first booking
  SELECT id INTO bk_id1 FROM customer_bookings
  WHERE customer_id = demo_cid AND project_name = 'Cube - Updating Monitored Rule Books' LIMIT 1;

  IF bk_id1 IS NOT NULL THEN
    INSERT INTO customer_booking_months (booking_id, month_year, booked_nn, booked_en, booked_ee)
    VALUES
      (bk_id1, '2025-04', 0, 6000.00, 0),
      (bk_id1, '2025-05', 0, 6000.00, 0),
      (bk_id1, '2025-06', 0, 6000.00, 0),
      (bk_id1, '2025-07', 0, 5500.00, 0),
      (bk_id1, '2025-08', 0, 5500.00, 0),
      (bk_id1, '2025-09', 0, 5500.00, 0),
      (bk_id1, '2025-10', 0, 6167.00, 0),
      (bk_id1, '2025-11', 0, 6167.00, 0),
      (bk_id1, '2026-01', 0, 6166.00, 0),
      (bk_id1, '2026-02', 0, 6000.00, 0),
      (bk_id1, '2026-03', 0, 5000.00, 0)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
