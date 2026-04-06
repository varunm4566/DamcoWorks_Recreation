-- ============================================================
-- Seed 001: Projects Screen Data
-- Order: divisions → employees → projects → project_resources
--         → milestones → delivery_thoughts
-- ============================================================

-- ----------------------------------------------------------------
-- 1. DIVISIONS
-- ----------------------------------------------------------------
INSERT INTO divisions (name, active_project_count, delivery_manager_count) VALUES
  ('Technology Services', 3, 2),
  ('Insurance',           2, 1),
  ('ITES',                1, 1);


-- ----------------------------------------------------------------
-- 2. EMPLOYEES
-- ----------------------------------------------------------------
INSERT INTO employees (full_name, employee_code, title, role_type, skills) VALUES
  ('Anita Sharma',    'EMP001', 'Senior Delivery Manager',   'delivery_manager', ARRAY['Stakeholder Management','Agile','Risk Management']),
  ('Rohit Verma',     'EMP002', 'Delivery Manager',          'delivery_manager', ARRAY['Scrum','JIRA','Client Relations']),
  ('Priya Nair',      'EMP003', 'Sales Manager',             'sales_manager',    ARRAY['Business Development','CRM','Negotiation']),
  ('Karan Mehta',     'EMP004', 'Project Lead',              'project_lead',     ARRAY['Java','Spring Boot','Microservices']),
  ('Sneha Pillai',    'EMP005', 'Tech Lead',                 'tech_lead',        ARRAY['React','Node.js','TypeScript','PostgreSQL']),
  ('Vivek Joshi',     'EMP006', 'Senior Software Engineer',  'engineer',         ARRAY['Python','Django','AWS','Docker']),
  ('Meera Krishnan',  'EMP007', 'Software Engineer',         'engineer',         ARRAY['React','TailwindCSS','REST APIs']),
  ('Arun Das',        'EMP008', 'PMO Analyst',               'pmo_analyst',      ARRAY['MS Project','Reporting','Risk Logs']);


-- ----------------------------------------------------------------
-- 3. PROJECTS  (customer_id = 1 assumed from existing customers)
-- ----------------------------------------------------------------
INSERT INTO projects (
  name, customer_id, division_id,
  project_type, engagement_model, status,
  offering, domain, geography, currency,
  delivery_manager_id, sales_manager_id, project_lead_id, tech_lead_id,
  start_date, end_date,
  overall_health_score, service_quality_score, financial_health_score,
  spi, cpi, effort_variance, budgeted_hours, logged_hours, planned_completion_percentage,
  margin_percentage, total_booked, total_invoiced, total_received, total_outstanding, total_overdue, avg_ageing_days,
  csat_score, csat_trend,
  last_assessment_date, assessment_overdue_days,
  project_overview,
  ai_highlights, ai_concerns, ai_next_steps, ai_evaluated_at
) VALUES

-- Project 1: Healthy FP project (Technology Services)
(
  'Nexus Insurance Portal', 1,
  (SELECT id FROM divisions WHERE name = 'Technology Services'),
  'FP', 'Client Project', 'Active',
  'Digital Transformation', 'Insurance', 'North America', 'USD',
  (SELECT id FROM employees WHERE employee_code = 'EMP001'),
  (SELECT id FROM employees WHERE employee_code = 'EMP003'),
  (SELECT id FROM employees WHERE employee_code = 'EMP004'),
  (SELECT id FROM employees WHERE employee_code = 'EMP005'),
  '2024-06-01', '2025-03-31',
  90, 88, 92,
  1.08, 1.12, -8.50, 4800.00, 4392.00, 75.00,
  28.50, 480000.00, 360000.00, 340000.00, 20000.00, 0.00, 18,
  4.5, 'up',
  '2025-03-10', 0,
  'End-to-end digital transformation of the client insurance portal including policy management, claims processing, and customer self-service features.',
  ARRAY['Delivered Phase 1 ahead of schedule','Strong client satisfaction with new UX','Team velocity consistently above baseline'],
  ARRAY['Minor scope creep risk in Phase 2 integrations'],
  ARRAY['Finalize Phase 2 scope sign-off by Apr 5','Schedule UAT kick-off for claims module'],
  '2025-03-20 09:00:00'
),

-- Project 2: Caution T&M project (Technology Services)
(
  'CloudMigrate Pro', 1,
  (SELECT id FROM divisions WHERE name = 'Technology Services'),
  'T&M', 'Client Project', 'Active',
  'Cloud & Infrastructure', 'Financial Services', 'Europe', 'USD',
  (SELECT id FROM employees WHERE employee_code = 'EMP001'),
  (SELECT id FROM employees WHERE employee_code = 'EMP003'),
  (SELECT id FROM employees WHERE employee_code = 'EMP004'),
  (SELECT id FROM employees WHERE employee_code = 'EMP005'),
  '2024-09-01', '2025-06-30',
  72, 75, 68,
  NULL, NULL, NULL, NULL, NULL, NULL,
  22.00, 310000.00, 155000.00, 130000.00, 25000.00, 8000.00, 34,
  3.8, 'flat',
  '2025-02-15', 38,
  'Migration of on-premises data warehouse and application workloads to AWS cloud infrastructure across 3 European data centres.',
  ARRAY['Core infra migration 60% complete','Strong collaboration with client DevOps team'],
  ARRAY['Invoice aging above threshold','Assessment overdue by 38 days','Two legacy integration points still unresolved'],
  ARRAY['Raise overdue invoice escalation with finance','Schedule assessment review this week','Resolve legacy API dependencies'],
  '2025-03-18 11:30:00'
),

-- Project 3: Caution BYT project (Insurance)
(
  'ClaimTrack Automation', 1,
  (SELECT id FROM divisions WHERE name = 'Insurance'),
  'BYT', 'Client Project', 'Active',
  'Process Automation', 'Insurance', 'North America', 'USD',
  (SELECT id FROM employees WHERE employee_code = 'EMP002'),
  (SELECT id FROM employees WHERE employee_code = 'EMP003'),
  (SELECT id FROM employees WHERE employee_code = 'EMP004'),
  (SELECT id FROM employees WHERE employee_code = 'EMP005'),
  '2024-11-01', '2025-08-31',
  65, 70, 60,
  NULL, NULL, NULL, NULL, NULL, NULL,
  19.50, 210000.00, 105000.00, 90000.00, 15000.00, 5000.00, 42,
  3.5, 'down',
  '2025-03-01', 0,
  'Automation of manual claims intake and adjudication workflows using RPA and rule-based engines to reduce claim cycle time by 40%.',
  ARRAY['RPA bots live in UAT environment','Claims cycle time reduced by 28% in pilot'],
  ARRAY['CSAT trending downward','Financial health below target','Resource ramp-up delayed by 2 weeks'],
  ARRAY['Address client concerns raised in last steering meeting','Accelerate resource onboarding','Review billing burn rate'],
  '2025-03-15 14:00:00'
),

-- Project 4: At Risk FP project (Insurance)
(
  'PolicyCore Rebuild', 1,
  (SELECT id FROM divisions WHERE name = 'Insurance'),
  'FP', 'Client Project', 'Active',
  'Application Modernisation', 'Insurance', 'North America', 'USD',
  (SELECT id FROM employees WHERE employee_code = 'EMP002'),
  (SELECT id FROM employees WHERE employee_code = 'EMP003'),
  (SELECT id FROM employees WHERE employee_code = 'EMP004'),
  (SELECT id FROM employees WHERE employee_code = 'EMP005'),
  '2024-04-01', '2025-05-31',
  42, 48, 38,
  0.82, 0.76, 22.50, 6200.00, 7595.00, 68.00,
  12.00, 560000.00, 336000.00, 270000.00, 66000.00, 30000.00, 61,
  2.9, 'down',
  '2025-01-20', 63,
  'Full rebuild of the legacy policy administration system onto a modern Java microservices architecture with React frontend.',
  ARRAY['Core policy CRUD modules delivered'],
  ARRAY['SPI and CPI both below 1.0 — schedule and cost at risk','Assessment overdue 63 days','High invoice overdue balance','Effort variance at +22.5%'],
  ARRAY['Immediate steering committee review required','Engage client on revised delivery timeline','Initiate cost recovery plan with finance'],
  '2025-03-22 08:00:00'
),

-- Project 5: No Work status (Technology Services)
(
  'DataVault Analytics', 1,
  (SELECT id FROM divisions WHERE name = 'Technology Services'),
  'T&M', 'Client Project', 'No Work',
  'Data & Analytics', 'Retail', 'North America', 'USD',
  (SELECT id FROM employees WHERE employee_code = 'EMP001'),
  (SELECT id FROM employees WHERE employee_code = 'EMP003'),
  NULL, NULL,
  '2024-01-15', '2024-12-31',
  55, 60, 50,
  NULL, NULL, NULL, NULL, NULL, NULL,
  15.00, 180000.00, 180000.00, 175000.00, 5000.00, 5000.00, 75,
  3.2, 'flat',
  '2024-11-10', 0,
  'Analytics platform build for retail client. Project is currently in a hold state pending client budget approval for Phase 2.',
  ARRAY['Phase 1 delivered and accepted'],
  ARRAY['No active work — client budget under review','Outstanding payment on final milestone'],
  ARRAY['Follow up with client on Phase 2 budget decision','Collect outstanding invoice'],
  '2025-03-01 10:00:00'
),

-- Project 6: Healthy Internal project (ITES)
(
  'InternalOps Dashboard', 1,
  (SELECT id FROM divisions WHERE name = 'ITES'),
  'BYT', 'Internal', 'Active',
  'Internal Tools', 'Operations', 'Global', 'USD',
  (SELECT id FROM employees WHERE employee_code = 'EMP002'),
  NULL,
  (SELECT id FROM employees WHERE employee_code = 'EMP004'),
  (SELECT id FROM employees WHERE employee_code = 'EMP005'),
  '2025-01-06', '2025-06-30',
  88, 90, 85,
  NULL, NULL, NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  NULL, 'up',
  '2025-03-05', 0,
  'Internal operations dashboard for PMO to track project health, bench strength, and resource utilisation across all divisions.',
  ARRAY['On track with fortnightly sprint cadence','Positive feedback from PMO stakeholders'],
  ARRAY['Design review pending for reports module'],
  ARRAY['Complete reports module wireframes by Apr 1'],
  '2025-03-21 16:00:00'
);


-- ----------------------------------------------------------------
-- 4. PROJECT_RESOURCES
-- ----------------------------------------------------------------
INSERT INTO project_resources (project_id, employee_id, sow_role, allocation_percentage, billing_type, allocation_start, allocation_end)
SELECT p.id, e.id, r.sow_role, r.alloc, r.billing, r.astart::DATE, r.aend::DATE
FROM (VALUES
  -- Nexus Insurance Portal (project 1)
  ('Nexus Insurance Portal',    'EMP006', 'Senior Backend Engineer',    100.00, 'Billable',     '2024-06-01', '2025-03-31'),
  ('Nexus Insurance Portal',    'EMP007', 'Frontend Developer',          100.00, 'Billable',     '2024-06-01', '2025-03-31'),
  -- CloudMigrate Pro (project 2)
  ('CloudMigrate Pro',          'EMP006', 'Cloud Engineer',              50.00,  'Billable',     '2024-09-01', '2025-06-30'),
  ('CloudMigrate Pro',          'EMP007', 'UI Developer',                50.00,  'Billable',     '2024-09-01', '2025-06-30'),
  -- ClaimTrack Automation (project 3)
  ('ClaimTrack Automation',     'EMP006', 'RPA Developer',               100.00, 'Billable',     '2024-11-01', '2025-08-31'),
  ('ClaimTrack Automation',     'EMP007', 'Frontend Developer',          100.00, 'Billable',     '2024-11-01', '2025-08-31'),
  -- PolicyCore Rebuild (project 4)
  ('PolicyCore Rebuild',        'EMP006', 'Backend Engineer',            100.00, 'Billable',     '2024-04-01', '2025-05-31'),
  ('PolicyCore Rebuild',        'EMP007', 'React Developer',             100.00, 'Billable',     '2024-04-01', '2025-05-31'),
  ('PolicyCore Rebuild',        'EMP008', 'PMO Analyst',                 50.00,  'Non-Billable', '2024-04-01', '2025-05-31'),
  -- DataVault Analytics (project 5)
  ('DataVault Analytics',       'EMP006', 'Data Engineer',               0.00,   'Billable',     '2024-01-15', '2024-12-31'),
  -- InternalOps Dashboard (project 6)
  ('InternalOps Dashboard',     'EMP007', 'Full Stack Developer',        50.00,  'Non-Billable', '2025-01-06', '2025-06-30'),
  ('InternalOps Dashboard',     'EMP008', 'PMO Analyst',                 100.00, 'Non-Billable', '2025-01-06', '2025-06-30')
) AS r(pname, ecode, sow_role, alloc, billing, astart, aend)
JOIN projects p ON p.name = r.pname
JOIN employees e ON e.employee_code = r.ecode;


-- ----------------------------------------------------------------
-- 5. MILESTONES
-- ----------------------------------------------------------------
INSERT INTO milestones (project_id, name, status, planned_date, actual_date, is_chronic_delay)
SELECT p.id, m.mname, m.mstatus, m.pdate::DATE, m.adate::DATE, m.chronic
FROM (VALUES
  -- Nexus Insurance Portal
  ('Nexus Insurance Portal', 'Project Kick-off',           'Completed',   '2024-06-01', '2024-06-01', FALSE),
  ('Nexus Insurance Portal', 'Phase 1 — Core Portal',      'Completed',   '2024-09-30', '2024-09-25', FALSE),
  ('Nexus Insurance Portal', 'Phase 2 — Claims Module',    'In Progress', '2025-02-28', NULL,          FALSE),
  ('Nexus Insurance Portal', 'UAT Sign-off',               'Upcoming',    '2025-03-31', NULL,          FALSE),
  -- CloudMigrate Pro
  ('CloudMigrate Pro',       'Infra Assessment',           'Completed',   '2024-09-30', '2024-10-05', FALSE),
  ('CloudMigrate Pro',       'Data Centre 1 Migration',    'Completed',   '2024-12-15', '2024-12-20', FALSE),
  ('CloudMigrate Pro',       'Data Centre 2 Migration',    'Overdue',     '2025-02-28', NULL,          TRUE),
  ('CloudMigrate Pro',       'Data Centre 3 Migration',    'Upcoming',    '2025-05-31', NULL,          FALSE),
  -- ClaimTrack Automation
  ('ClaimTrack Automation',  'RPA Bot Development',        'Completed',   '2025-01-31', '2025-01-31', FALSE),
  ('ClaimTrack Automation',  'UAT — Intake Bots',          'In Progress', '2025-03-15', NULL,          FALSE),
  ('ClaimTrack Automation',  'UAT — Adjudication Bots',    'Upcoming',    '2025-04-30', NULL,          FALSE),
  ('ClaimTrack Automation',  'Go-Live',                    'Upcoming',    '2025-06-30', NULL,          FALSE),
  -- PolicyCore Rebuild
  ('PolicyCore Rebuild',     'Architecture Design',        'Completed',   '2024-06-30', '2024-07-15', FALSE),
  ('PolicyCore Rebuild',     'Core Policy CRUD',           'Completed',   '2024-10-31', '2024-11-20', TRUE),
  ('PolicyCore Rebuild',     'Premium Calculation Engine', 'Overdue',     '2025-01-31', NULL,          TRUE),
  ('PolicyCore Rebuild',     'Document Management Module', 'Overdue',     '2025-03-15', NULL,          TRUE),
  ('PolicyCore Rebuild',     'Full UAT & Go-Live',         'Upcoming',    '2025-05-31', NULL,          FALSE),
  -- DataVault Analytics
  ('DataVault Analytics',    'Phase 1 Delivery',           'Completed',   '2024-08-31', '2024-08-31', FALSE),
  ('DataVault Analytics',    'Phase 1 Client Acceptance',  'Completed',   '2024-09-30', '2024-10-05', FALSE),
  ('DataVault Analytics',    'Phase 2 Kick-off',           'Upcoming',    '2025-04-01', NULL,          FALSE),
  -- InternalOps Dashboard
  ('InternalOps Dashboard',  'Sprint 1 — Data Layer',      'Completed',   '2025-01-31', '2025-01-31', FALSE),
  ('InternalOps Dashboard',  'Sprint 2 — Project Health',  'Completed',   '2025-02-28', '2025-02-28', FALSE),
  ('InternalOps Dashboard',  'Sprint 3 — Reports Module',  'In Progress', '2025-03-31', NULL,          FALSE),
  ('InternalOps Dashboard',  'Sprint 4 — Final Polish',    'Upcoming',    '2025-05-31', NULL,          FALSE)
) AS m(pname, mname, mstatus, pdate, adate, chronic)
JOIN projects p ON p.name = m.pname;


-- ----------------------------------------------------------------
-- 6. DELIVERY THOUGHTS
-- ----------------------------------------------------------------
INSERT INTO delivery_thoughts (project_id, author_id, thought_text, health_status, ai_summary, ai_risks, ai_actions, created_at)
SELECT p.id, e.id, d.thought, d.hstatus, d.ai_sum, d.risks, d.actions, d.ts::TIMESTAMPTZ
FROM (VALUES
  -- Nexus Insurance Portal
  ('Nexus Insurance Portal', 'EMP001',
   'Phase 1 delivered 5 days ahead of schedule. Client extremely satisfied with new UI. Phase 2 scope doc under review — expecting sign-off by end of week.',
   'Healthy',
   'Project on track with positive client sentiment. Phase 2 planning in final stages.',
   ARRAY['Minor scope expansion risk in Phase 2'],
   ARRAY['Get Phase 2 scope signed off this week','Schedule UAT planning session'],
   '2025-03-10 10:00:00'),
  ('Nexus Insurance Portal', 'EMP001',
   'Phase 2 sprint 1 kicked off. Team velocity strong at 42 story points. No blockers reported. Invoice #INV-2024-08 received on time.',
   'Healthy',
   'Strong sprint start with no blockers. Financials healthy.',
   ARRAY[]::TEXT[],
   ARRAY['Maintain current velocity','Confirm integration test environment readiness'],
   '2025-01-15 09:30:00'),
  ('Nexus Insurance Portal', 'EMP008',
   'Initial health review complete. All KPIs green. Team morale high post Phase 1 success.',
   'Healthy',
   'All project health indicators in green range.',
   ARRAY[]::TEXT[],
   ARRAY['Continue fortnightly health check cadence'],
   '2024-12-01 14:00:00'),

  -- CloudMigrate Pro
  ('CloudMigrate Pro', 'EMP001',
   'Data Centre 2 migration delayed due to client-side firewall changes not completed on time. Raised dependency in last steering meeting. Client acknowledged the delay.',
   'Caution',
   'Schedule slippage on DC2 migration due to client dependency. Invoice aging elevated.',
   ARRAY['DC2 migration may push DC3 timeline','Aging invoices could impact revenue recognition'],
   ARRAY['Get written confirmation of new DC2 date','Escalate overdue invoice with client finance team'],
   '2025-03-12 11:00:00'),
  ('CloudMigrate Pro', 'EMP001',
   'DC1 migration completed successfully with zero downtime. Performance benchmarks exceeded by 15%. Client very pleased with outcome.',
   'Healthy',
   'DC1 completed above expectations. Client confidence high.',
   ARRAY[]::TEXT[],
   ARRAY['Apply lessons learned to DC2 migration plan'],
   '2024-12-22 16:00:00'),
  ('CloudMigrate Pro', 'EMP008',
   'Assessment overdue — last review was 38 days ago. Recommending immediate scheduling with DM and client.',
   'Caution',
   'Assessment cadence broken. Needs immediate action.',
   ARRAY['Prolonged gap in formal assessment increases delivery risk'],
   ARRAY['Schedule assessment review within 3 business days'],
   '2025-03-20 09:00:00'),

  -- ClaimTrack Automation
  ('ClaimTrack Automation', 'EMP002',
   'UAT for intake bots underway. 3 defects raised — 2 minor, 1 medium. Client flagged concern about bot decision accuracy in edge cases. Addressing this sprint.',
   'Caution',
   'UAT in progress with defects. Client has raised accuracy concerns.',
   ARRAY['Accuracy concerns may delay UAT sign-off','CSAT trending down — requires client engagement'],
   ARRAY['Fix medium defect P1 this sprint','Arrange bot accuracy demo for client stakeholders'],
   '2025-03-14 13:00:00'),
  ('ClaimTrack Automation', 'EMP002',
   'Resource ramp-up delayed by 2 weeks due to background check backlog. Impacting sprint capacity. Spoke to HR — new joiner now confirmed for April 7.',
   'Caution',
   'Resourcing gap impacting capacity. New hire confirmed.',
   ARRAY['Sprint capacity reduced for next 2 sprints','Financial burn rate tracking below plan'],
   ARRAY['Re-baseline sprint capacity with current team','Update project plan to reflect delayed ramp-up'],
   '2025-02-20 10:30:00'),
  ('ClaimTrack Automation', 'EMP008',
   'Monthly financial review: burn rate at 82% of plan. Overdue balance growing. Recommend billing review.',
   'Caution',
   'Financial metrics below target. Proactive review needed.',
   ARRAY['Continued underbilling could affect margin'],
   ARRAY['Review T&M billing submission with client','Align on monthly invoice schedule'],
   '2025-01-28 15:00:00'),

  -- PolicyCore Rebuild
  ('PolicyCore Rebuild', 'EMP002',
   'Steering committee escalation raised. CPI at 0.76 and SPI at 0.82 — both red. Client is aware. Recovery plan being drafted with delivery lead and finance.',
   'At Risk',
   'Critical delivery metrics in red. Recovery plan underway.',
   ARRAY['Further schedule slippage could trigger contract penalties','Overdue invoices exceeding $30K','Team morale impacted by extended crunch'],
   ARRAY['Present recovery plan at steering meeting next Tuesday','Negotiate revised milestone dates with client','Initiate resource augmentation request'],
   '2025-03-18 08:30:00'),
  ('PolicyCore Rebuild', 'EMP002',
   'Premium Calculation Engine delayed for second time. Original date was Nov 30, revised to Jan 31, now March — still not done. Marking as chronic delay.',
   'At Risk',
   'Chronic delay on core module. Third date slip recorded.',
   ARRAY['Chronic delay eroding client trust','Downstream modules blocked on PCE completion'],
   ARRAY['Root cause analysis with tech lead this week','Consider splitting PCE into sub-deliverables'],
   '2025-02-05 11:00:00'),
  ('PolicyCore Rebuild', 'EMP008',
   'Assessment 63 days overdue. No formal health review conducted since January. Escalating to DM.',
   'At Risk',
   'Assessment significantly overdue. Governance gap identified.',
   ARRAY['Absence of formal review masks true risk exposure'],
   ARRAY['Schedule emergency assessment review immediately'],
   '2025-03-22 07:30:00'),

  -- DataVault Analytics
  ('DataVault Analytics', 'EMP001',
   'Project on hold — no active work. Client budget under review for Phase 2. Phase 1 fully delivered and accepted. Final payment of $5K still outstanding.',
   'Caution',
   'Hold state confirmed. Phase 1 closed. Awaiting Phase 2 budget decision.',
   ARRAY['Budget decision delay may push Phase 2 start to Q3','Outstanding payment risk if client deprioritises project'],
   ARRAY['Follow up with client sponsor on Phase 2 budget timeline','Collect final Phase 1 invoice'],
   '2025-02-28 14:00:00'),
  ('DataVault Analytics', 'EMP001',
   'Phase 1 acceptance sign-off received. All deliverables accepted without issues. Client satisfied.',
   'Healthy',
   'Phase 1 successfully closed.',
   ARRAY[]::TEXT[],
   ARRAY['Archive project artefacts','Send Phase 2 proposal to client'],
   '2024-10-06 10:00:00'),

  -- InternalOps Dashboard
  ('InternalOps Dashboard', 'EMP002',
   'Sprint 3 started. Reports module design approved by PMO. Development underway. On track for April release.',
   'Healthy',
   'Sprint 3 progressing well. Stakeholder approval received for reports.',
   ARRAY[]::TEXT[],
   ARRAY['Complete reports module by sprint end','Begin Sprint 4 planning'],
   '2025-03-03 09:00:00'),
  ('InternalOps Dashboard', 'EMP002',
   'Sprint 2 demo well received by PMO leadership. Project health and bench tracking features signed off. Good internal adoption expected.',
   'Healthy',
   'Sprint 2 delivered with strong stakeholder buy-in.',
   ARRAY[]::TEXT[],
   ARRAY['Proceed to Sprint 3 as planned'],
   '2025-03-01 17:00:00'),
  ('InternalOps Dashboard', 'EMP008',
   'Initial health score tracking implemented. Data layer stable. No blockers. Internal project progressing smoothly.',
   'Healthy',
   'Strong start to internal initiative. No risks identified.',
   ARRAY[]::TEXT[],
   ARRAY['Maintain fortnightly demo cadence with PMO'],
   '2025-02-03 11:00:00')
) AS d(pname, ecode, thought, hstatus, ai_sum, risks, actions, ts)
JOIN projects p ON p.name = d.pname
JOIN employees e ON e.employee_code = d.ecode;


-- ----------------------------------------------------------------
-- VERIFICATION QUERIES
-- ----------------------------------------------------------------

-- 1. Project count per division
SELECT d.name AS division, COUNT(p.id) AS project_count
FROM divisions d
LEFT JOIN projects p ON p.division_id = d.id
GROUP BY d.name
ORDER BY project_count DESC;

-- 2. Projects by health status
SELECT
  CASE
    WHEN overall_health_score >= 85 THEN 'Healthy'
    WHEN overall_health_score >= 60 THEN 'Caution'
    ELSE 'At Risk'
  END AS health_status,
  COUNT(*) AS count
FROM projects
WHERE overall_health_score IS NOT NULL
GROUP BY 1
ORDER BY 1;

-- 3. Employees with most allocations
SELECT e.full_name, e.title, COUNT(pr.id) AS allocation_count
FROM employees e
LEFT JOIN project_resources pr ON pr.employee_id = e.id
GROUP BY e.id, e.full_name, e.title
ORDER BY allocation_count DESC;
