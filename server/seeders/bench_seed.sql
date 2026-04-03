-- ─── Seed: Bench tables ───────────────────────────────────────────────────────
-- Run AFTER migration 006:
--   psql -U damco -d damcoworks -f server/seeders/bench_seed.sql
-- Safe to re-run — truncates before inserting.

-- ── bench_resources ───────────────────────────────────────────────────────────
TRUNCATE bench_resources RESTART IDENTITY CASCADE;

INSERT INTO bench_resources
  (name, emp_code, division, employee_type, primary_skill, bench_since,
   last_project, project_type, project_role, engagement_type, billing, billing_pct,
   resource_margin, allocation, dm, program_manager, project_start, project_end, project_duration,
   monthly_ctc, performance,
   hr_decision, remarks, timeline,
   date_of_joining, location, department, total_experience, damco_experience, email, phone)
VALUES
  -- 1. Rajesh Kumar Sharma
  ('Rajesh Kumar Sharma',  'EMP001', 'Technology Services', 'Employee',       'Microsoft Dev (Technology Services)',
   '2021-10-27',
   'Legacy Modernization Portal',   'Client Project', 'Team Member - Developer', 'T&M', 'Billed', 100,
   30,    100,  'Sanjay Mehta',  'Neha Kapoor',  '2021-01-15', '2021-10-27', '9 Month(s)',
   2095,  'NA',  NULL, '', NULL,
   '2017-06-12', 'Gurugram, Haryana',    'Application Development & Management', 8.8, 4.3, 'rajesh.sharma@damcogroup.com',  '9810123401'),

  -- 2. Ananya Krishnamurthy
  ('Ananya Krishnamurthy', 'EMP002', 'Insurance',           'Employee',       'Business Analysis (Insurance)',
   '2024-05-06',
   'Claims Automation System',      'Client Project', 'Business Analyst',        'FP',  'Billed', 100,
   18,    100,  'Rahul Desai',   'Priya Nair',   '2023-09-01', '2024-05-06', '8 Month(s)',
   1187,  'NA',  NULL, 'Processing her pending invoices. Strong BA profile.', NULL,
   '2019-03-18', 'Bengaluru, Karnataka', 'Business Analysis & Consulting',       6.0, 2.5, 'ananya.k@damcogroup.com',        '9845234502'),

  -- 3. Soumya Prakash Mondal
  ('Soumya Prakash Mondal','EMP003', 'ITES',                'Employee',       'Data Processing',
   '2025-08-25',
   NULL, NULL, NULL, NULL, NULL, NULL,
   NULL,  NULL, NULL, NULL, NULL, NULL, '0 Month(s)',
   833,   'NA',  NULL, '', NULL,
   '2022-07-04', 'Kolkata, West Bengal', 'Data Operations & ITeS',               3.7, 2.0, 'soumya.mondal@damcogroup.com',   '9433345603'),

  -- 4. Hitakshi Soma
  ('Hitakshi Soma',        'EMP004', 'Technology Services', 'Cons(T&M)',      'QA & Testing (Technology Services)',
   '2025-09-13',
   'E-Commerce QA Engagement',      'Client Project', 'QA Engineer',             'T&M', 'Not Billed', 0,
   5,     50,   'Vikram Singh',  'Meera Joshi',  '2025-03-01', '2025-09-13', '6 Month(s)',
   0,     'NA',  'Long Leave/Sabbatical', 'On extended personal leave. Return date TBD.', NULL,
   '2020-11-23', 'Noida, Uttar Pradesh', 'Quality Assurance',                    5.3, 1.8, 'hitakshi.soma@damcogroup.com',   '9711456704'),

  -- 5. Jaidev Bangar
  ('Jaidev Bangar',        'EMP005', 'Salesforce',          'Cons(Retainer)', 'Salesforce',
   '2025-10-27',
   'Salesforce CRM Implementation', 'Client Project', 'CRM Developer',           'BYT', 'Billed', 100,
   22,    100,  'Pooja Sharma',  'Arjun Verma',  '2025-04-01', '2025-10-27', '7 Month(s)',
   2500,  'NA',  NULL, 'First invoice is yet to come.', NULL,
   '2018-08-01', 'Pune, Maharashtra',   'CRM & Salesforce Practice',            7.6, 0.9, 'jaidev.bangar@damcogroup.com',   '9881567805'),

  -- 6. Mrutyunjay Sahu
  ('Mrutyunjay Sahu',      'EMP006', 'ITES',                'Employee',       'Data Engineering',
   '2025-12-01',
   'Data Pipeline Modernization',   'Damco IP',       'Data Engineer',           'FP',  'Not Billed', 0,
   NULL,  NULL, 'Anil Kumar',    'Sunita Rao',   '2025-06-01', '2025-12-01', '6 Month(s)',
   475,   'NA',  NULL, 'Maternity Leave', NULL,
   '2021-02-15', 'Bhubaneswar, Odisha', 'Data Engineering & Analytics',         4.6, 3.1, 'mrutyunjay.sahu@damcogroup.com', '9437678906'),

  -- 7. Aman Bhagirath
  ('Aman Bhagirath',       'EMP007', 'Technology Services', 'Employee',       'JAVA',
   '2026-02-16',
   'Microservices Refactor',        'Client Project', 'Team Member - Developer', 'T&M', 'Billed', 100,
   25,    100,  'Sanjay Mehta',  'Neha Kapoor',  '2024-08-01', '2026-02-16', '18 Month(s)',
   3200,  'NA',  'Project Identified/Yet to be started', 'New project starting end of April.', '2026-03-31',
   '2016-04-11', 'Hyderabad, Telangana','Application Development & Management', 9.9, 5.8, 'aman.bhagirath@damcogroup.com',  '9948789007'),

  -- 8. Divya Krishnaswamy
  ('Divya Krishnaswamy',   'EMP008', 'Insurance',           'Employee',       'QA & Testing (Insurance)',
   '2026-01-09',
   'Policy Management System',      'Client Project', 'QA Lead',                 'FP',  'Billed', 80,
   15,    80,   'Rahul Desai',   'Priya Nair',   '2025-07-01', '2026-01-09', '6 Month(s)',
   1500,  'NA',  'Extension Expected', 'Client may extend engagement by Q2.', NULL,
   '2020-06-22', 'Chennai, Tamil Nadu', 'Quality Assurance & Insurance',        5.8, 2.3, 'divya.k@damcogroup.com',          '9444890108'),

  -- 9. Manoj Gupta Bondada
  ('Manoj Gupta Bondada',  'EMP009', 'Insurance',           'Cons(Retainer)', 'Microsoft Dev (Insurance)',
   '2025-09-01',
   'InsureTech Portal Rebuild',     'Damco IP',       'Team Member - Developer', 'FP',  'Billed', 100,
   20,    100,  'Rahul Desai',   'Arjun Verma',  '2025-01-01', '2025-09-01', '8 Month(s)',
   1900,  'NA',  'Bench Resource', 'Processing his January amount this time. T&M Consultant.', NULL,
   '2019-09-30', 'Hyderabad, Telangana','Insurance Technology',                 6.4, 1.4, 'manoj.bondada@damcogroup.com',   '9849901209'),

  -- 10. Priya Sharma
  ('Priya Sharma',         'EMP010', 'Marketing Services',  'Employee',       'Digital Marketing',
   '2025-11-15',
   'Brand Refresh Campaign',        'Client Project', 'Marketing Analyst',       'FP',  'Billed', 100,
   12,    100,  'Pooja Sharma',  'Arjun Verma',  '2025-05-01', '2025-11-15', '6 Month(s)',
   980,   'NA',  NULL, '', NULL,
   '2021-08-10', 'Mumbai, Maharashtra', 'Marketing & Communications',           4.7, 2.1, 'priya.sharma@damcogroup.com',    '9820123410');

-- ── bench_skills ──────────────────────────────────────────────────────────────
TRUNCATE bench_skills RESTART IDENTITY CASCADE;

INSERT INTO bench_skills (skill, count, sort_order) VALUES
  ('AI/ML',                                     2,   1),
  ('Blockchain',                                1,   2),
  ('Business Analysis (Insurance)',             7,   3),
  ('Business Analysis (Technology Services)',   1,   4),
  ('Cloud Infrastructure and Security',         2,   5),
  ('Data Engineering',                          8,   6),
  ('Data Processing',                          63,   7),
  ('Data Visualization',                        9,   8),
  ('Database Admin',                            1,   9),
  ('Delivery Management',                       1,  10),
  ('IBM iSeries',                               2,  11),
  ('JAVA',                                      6,  12),
  ('Javascript',                               10,  13),
  ('Low Code Tools',                            1,  14),
  ('Microsoft Dev (Insurance)',                16,  15),
  ('Microsoft Dev (Technology Services)',      17,  16),
  ('Mobile',                                    6,  17),
  ('MS Business Apps',                          4,  18),
  ('Mule',                                      2,  19),
  ('Node',                                      1,  20),
  ('Outsystems',                                7,  21),
  ('PHP',                                       6,  22),
  ('Product Management (Insurance)',            1,  23),
  ('Python',                                    5,  24),
  ('QA & Testing (Insurance)',                  8,  25),
  ('QA & Testing (Technology Services)',       12,  26),
  ('Rapadit',                                   1,  27),
  ('RPA',                                       1,  28),
  ('Salesforce',                                9,  29);

-- ── future_bench ──────────────────────────────────────────────────────────────
TRUNCATE future_bench RESTART IDENTITY CASCADE;

INSERT INTO future_bench
  (name_code, emp_code, skill, designation, current_project, delivery_manager, engagement_model, project_role, billed, roll_off_date)
VALUES
  ('Mohammed Khadeer 108627',    '108627', 'QA & Testing (Technology Services)', 'Test Engineer II',           'Xponance - AI-Enabled ODD System Implementation',        'Sanjay Mehta',   'FP',  'Team Member - Developer', TRUE,  '2026-03-31'),
  ('Gaurav Makwana 120110',      '120110', 'Business Analysis (Insurance)',       'Business Analyst I',         'InsurEdge-General-CARIB-Nafico-Implementation',          'Rahul Desai',    'FP',  'Business Analyst',        TRUE,  '2026-03-31'),
  ('Ankit Khanna 120236',        '120236', 'Delivery Management',                 'Project Lead',               'InsurEdge-General-CARIB-Nafico-Implementation',          'Rahul Desai',    'FP',  'Project Lead',            TRUE,  '2026-03-31'),
  ('Asad Raza 121091',           '121091', 'AI/ML',                               'Technical Lead',             'Xponance - AI-Enabled ODD System Implementation',        'Sanjay Mehta',   'FP',  'Technical Lead',          TRUE,  '2026-03-31'),
  ('Parag Jeevan Ingale 121371', '121371', 'Python',                              'Senior Software Engineer I', 'Xponance - AI-Enabled ODD System Implementation',        'Sanjay Mehta',   'FP',  'Team Member - Developer', TRUE,  '2026-03-31'),
  ('Adulapuram Shravan 121234',  '121234', 'AI/ML',                               'Senior Software Engineer II','Xponance - AI-Enabled ODD System Implementation',        'Sanjay Mehta',   'FP',  'Team Member - Developer', TRUE,  '2026-04-01'),
  ('Ayush Tripathi 121255',      '121255', 'AI/ML',                               'Software Engineer Trainee',  'UAIC - FNOL (First Notice of Loss) Automation',          'Vikram Singh',   'FP',  'Team Member - Developer', TRUE,  '2026-04-05'),
  ('Tetwar Neha Subhash 121248', '121248', 'Business Analysis (Insurance)',       'Senior Business Analyst I',  'BrokerEdge-CARIB-FF & Kong-Implementation',              'Rahul Desai',    'FP',  'Business Analyst',        TRUE,  '2026-04-07'),
  ('Rohit Kumar Gupta 121127',   '121127', 'IBM iSeries',                         'Senior Software Engineer',   'UAIC - Application Support',                             'Vikram Singh',   'T&M', 'Team Member - Developer', TRUE,  '2026-04-10'),
  ('Akshat Tyagi 121246',        '121246', 'Data Processing',                     'Trainee – ITeS',             'Cube - Web Monitoring of Rulebooks',                     'Pooja Sharma',   'T&M', 'Team Member',             TRUE,  '2026-04-12'),
  ('Priya Suresh 121312',        '121312', 'Microsoft Dev (Insurance)',            'Software Engineer II',       'InsurEdge-General-CARIB-Nafico-Implementation',          'Rahul Desai',    'FP',  'Team Member - Developer', FALSE, '2026-04-14'),
  ('Kiran Sharma 121088',        '121088', 'Outsystems',                          'Software Engineer I',        'DamcoWorks Platform Upgrade',                            'Anil Kumar',     'FP',  'Team Member - Developer', TRUE,  '2026-04-15'),
  ('Ramesh Iyer 120945',         '120945', 'JAVA',                                'Senior Software Engineer II','Legacy Migration Project',                               'Sanjay Mehta',   'T&M', 'Team Member - Developer', TRUE,  '2026-04-18'),
  ('Sneha Patil 121190',         '121190', 'QA & Testing (Insurance)',            'Test Engineer I',            'BrokerEdge-CARIB-FF & Kong-Implementation',              'Rahul Desai',    'FP',  'QA Engineer',             FALSE, '2026-04-20'),
  ('Vivek Nair 121445',          '121445', 'Data Engineering',                    'Senior Data Engineer',       'DataOps Modernization',                                  'Anil Kumar',     'FP',  'Lead Engineer',           TRUE,  '2026-04-22');
