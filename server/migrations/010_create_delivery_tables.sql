-- Migration 010: Delivery module tables
-- Divisions, delivery persons, assignments, and engineering metrics

-- ─── Divisions ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS divisions (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- ─── Delivery Persons ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS delivery_persons (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  role        VARCHAR(100) NOT NULL,
  division_id INTEGER REFERENCES divisions(id),
  is_active   BOOLEAN DEFAULT true
);

-- ─── Person → Customer assignments ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS person_customer_assignments (
  id          SERIAL PRIMARY KEY,
  person_id   INTEGER REFERENCES delivery_persons(id),
  customer_id INTEGER,               -- soft ref to customers table
  is_active   BOOLEAN DEFAULT true
);

-- ─── Person → Project assignments ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS person_project_assignments (
  id         SERIAL PRIMARY KEY,
  person_id  INTEGER REFERENCES delivery_persons(id),
  project_id INTEGER,               -- soft ref to projects table
  is_active  BOOLEAN DEFAULT true
);

-- ─── Engineering team metrics ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS engineering_team_metrics (
  id         SERIAL PRIMARY KEY,
  person_id  INTEGER REFERENCES delivery_persons(id) UNIQUE,
  head_count INTEGER        DEFAULT 0,
  allocation DECIMAL(10,2)  DEFAULT 0.00,
  updated_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ─── Collaboration counts ────────────────────────────────────────────────────
-- Stores how many of each peer-role type a given person collaborates with.
-- role_type values: tl, fl, pl, dm, onsite_dm, pdm, pfm, pgm, po
CREATE TABLE IF NOT EXISTS person_collaborations (
  id           SERIAL PRIMARY KEY,
  person_id    INTEGER REFERENCES delivery_persons(id),
  role_type    VARCHAR(20) NOT NULL,
  count        INTEGER DEFAULT 0,
  UNIQUE(person_id, role_type)
);

-- ─── Seed: Divisions ─────────────────────────────────────────────────────────
INSERT INTO divisions (id, name, is_active) VALUES
  (1, 'Technology Services', true),
  (2, 'Insurance',           true)
ON CONFLICT (id) DO NOTHING;

-- ─── Seed: Delivery Persons ───────────────────────────────────────────────────
-- Technology Services division (id=1)
INSERT INTO delivery_persons (name, role, division_id, is_active) VALUES
  -- Program Managers (4)
  ('Aakash Verma',        'Program Manager',              1, true),
  ('Bhavna Sharma',       'Program Manager',              1, true),
  ('Chirag Mehta',        'Program Manager',              1, true),
  ('Deepika Nair',        'Program Manager',              1, true),
  -- Delivery Managers (21)
  ('Esha Kapoor',         'Delivery Manager',             1, true),
  ('Farhan Qureshi',      'Delivery Manager',             1, true),
  ('Gaurav Singh',        'Delivery Manager',             1, true),
  ('Harpreet Kaur',       'Delivery Manager',             1, true),
  ('Ishaan Patel',        'Delivery Manager',             1, true),
  ('Jyoti Mishra',        'Delivery Manager',             1, true),
  ('Karan Bhatia',        'Delivery Manager',             1, true),
  ('Lavanya Reddy',       'Delivery Manager',             1, true),
  ('Manish Yadav',        'Delivery Manager',             1, true),
  ('Nalini Gupta',        'Delivery Manager',             1, true),
  ('Omkar Joshi',         'Delivery Manager',             1, true),
  ('Priya Saxena',        'Delivery Manager',             1, true),
  ('Rahul Chandra',       'Delivery Manager',             1, true),
  ('Sanya Malhotra',      'Delivery Manager',             1, true),
  ('Tarun Khanna',        'Delivery Manager',             1, true),
  ('Usha Pillai',         'Delivery Manager',             1, true),
  ('Vinay Desai',         'Delivery Manager',             1, true),
  ('Waqar Ali',           'Delivery Manager',             1, true),
  ('Xenia Thomas',        'Delivery Manager',             1, true),
  ('Yash Agrawal',        'Delivery Manager',             1, true),
  ('Zara Khan',           'Delivery Manager',             1, true),
  ('Arun Pillai',         'Delivery Manager',             1, true),
  ('Bindu Krishnan',      'Delivery Manager',             1, true),
  -- Onsite Delivery Managers (3)
  ('Craig Wallace',       'Onsite Delivery Manager',      1, true),
  ('Diana Prince',        'Onsite Delivery Manager',      1, true),
  ('Ethan Hunt',          'Onsite Delivery Manager',      1, true),
  -- Technical Leads (12)
  ('Faisal Rahman',       'Technical Lead',               1, true),
  ('Gita Shukla',         'Technical Lead',               1, true),
  ('Hrithik Bose',        'Technical Lead',               1, true),
  ('Isha Tripathi',       'Technical Lead',               1, true),
  ('Jayant Kumar',        'Technical Lead',               1, true),
  ('Kavya Nambiar',       'Technical Lead',               1, true),
  ('Lokesh Verma',        'Technical Lead',               1, true),
  ('Meera Narayanan',     'Technical Lead',               1, true),
  ('Nikhil Pandey',       'Technical Lead',               1, true),
  ('Ojasvi Singh',        'Technical Lead',               1, true),
  ('Pradeep Rao',         'Technical Lead',               1, true),
  ('Qasim Shah',          'Technical Lead',               1, true),
  -- Project Leads (4)
  ('Rashmi Tiwari',       'Project Lead',                 1, true),
  ('Sameer Iyer',         'Project Lead',                 1, true),
  ('Tanvi Wadekar',       'Project Lead',                 1, true),
  ('Uma Shankar',         'Project Lead',                 1, true)
ON CONFLICT DO NOTHING;

-- ─── Seed: Engineering team metrics ──────────────────────────────────────────
INSERT INTO engineering_team_metrics (person_id, head_count, allocation)
SELECT dp.id,
  CASE dp.role
    WHEN 'Delivery Manager'         THEN floor(random()*8 + 3)::int
    WHEN 'Program Manager'          THEN floor(random()*12 + 5)::int
    WHEN 'Onsite Delivery Manager'  THEN floor(random()*6 + 2)::int
    WHEN 'Technical Lead'           THEN floor(random()*5 + 2)::int
    WHEN 'Project Lead'             THEN floor(random()*4 + 1)::int
    ELSE 0
  END,
  ROUND((random()*9 + 1)::numeric, 2)
FROM delivery_persons dp
ON CONFLICT (person_id) DO NOTHING;

-- ─── Seed: Customer assignments (approx 95 active customers spread across persons) ──
-- Each person gets 1–5 customer assignments
INSERT INTO person_customer_assignments (person_id, customer_id, is_active)
SELECT dp.id,
       generate_series(1, floor(random()*4 + 1)::int),
       true
FROM delivery_persons dp
ON CONFLICT DO NOTHING;

-- ─── Seed: Project assignments (approx 138 active projects spread across persons) ──
INSERT INTO person_project_assignments (person_id, project_id, is_active)
SELECT dp.id,
       generate_series(1, floor(random()*5 + 1)::int),
       true
FROM delivery_persons dp
ON CONFLICT DO NOTHING;

-- ─── Seed: Collaboration counts ───────────────────────────────────────────────
INSERT INTO person_collaborations (person_id, role_type, count)
SELECT dp.id, role_type, floor(random()*6)::int
FROM delivery_persons dp
CROSS JOIN (VALUES ('tl'),('fl'),('pl'),('dm'),('onsite_dm'),('pdm'),('pfm'),('pgm'),('po')) AS r(role_type)
ON CONFLICT (person_id, role_type) DO NOTHING;

-- ─── KPI Summary View ─────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW delivery_kpi_summary AS
SELECT
  d.id                          AS division_id,
  d.name                        AS division_name,
  dp.role,
  COUNT(dp.id)                  AS role_count
FROM delivery_persons dp
JOIN divisions d ON d.id = dp.division_id
WHERE dp.is_active = true
GROUP BY d.id, d.name, dp.role;
