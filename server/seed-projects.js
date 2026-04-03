import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '../.env' });

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'damcoworks',
  user: process.env.DB_USER || 'damco',
  password: process.env.DB_PASSWORD || 'damco123',
});

// ---------- Reference data ----------

const DIVISIONS = [
  { name: 'Technology Services', count: 138, dmCount: 44 },
  { name: 'Insurance', count: 58, dmCount: 19 },
  { name: 'ITES', count: 27, dmCount: 7 },
  { name: 'Marketing Services', count: 16, dmCount: 6 },
  { name: 'Salesforce', count: 41, dmCount: 6 },
  { name: 'Staffing', count: 76, dmCount: 6 },
];

const PROJECT_TYPES = ['BYT/T&M', 'FP', 'Staffing'];
const TYPE_WEIGHTS = [0.33, 0.45, 0.22];
const ENGAGEMENT_MODELS = ['Fixed Price', 'Time & Material', 'Staffing', 'Managed Services'];
const CSAT_TRENDS = ['Up', 'Down', 'Stable'];

const OFFERINGS = [
  'ADI Low Codes', 'AI and Agents', 'Application Development and Integrations',
  'Cloud', 'Data and Visualisation', 'Enterprise Platforms', 'Healthcare',
  'Infra and Security', 'Insurance', 'Managed Services', 'Manufacturing and Logistics',
  'Marketing', 'Microsoft', 'Outsystems', 'Salesforce', 'Staffing', 'Testing', 'UX',
];

const GEOGRAPHIES = ['Africa', 'APAC', 'Canada', 'Caribbean', 'GCC', 'India', 'Mainland Europe', 'South America', 'UK', 'USA'];

const DOMAINS = [
  'Automotive', 'Digital Media and Advertising', 'Education', 'Energy and Utilities',
  'Financial Services', 'Health and Social Care', 'Hi-Tech', 'Human Resources and Recruitment',
  'Insurance', 'Manufacturing', 'Publishing and Media', 'Real Estate and Building Management',
  'Retail and Consumer Products', 'Telecom', 'Transportation and logistics', 'Travel and Hospitality',
];

const CURRENCIES = ['USD', 'INR', 'GBP', 'EUR', 'AED', 'AUD', 'CAD', 'ZAR'];

const DM_NAMES = [
  'Gaurav Singh', 'Ritu Agarwal', 'Rakesh Nanda', 'Swati Joshi', 'Pallavi Iyer',
  'Amit Verma', 'Nisha Kapoor', 'Sanjay Mehta', 'Priya Sharma', 'Rajat Gupta',
  'Ankit Saxena', 'Meera Reddy', 'Vikram Patel', 'Deepa Nair', 'Karthik Iyer',
  'Sunita Rao', 'Rohit Kumar', 'Kavita Nair', 'Mohit Gupta', 'Sneha Das',
  'Arvind Jain', 'Pooja Mishra', 'Arun Bhatia', 'Divya Pillai', 'Manish Tiwari',
  'Shweta Agarwal', 'Nitin Chopra', 'Asha Menon', 'Vivek Shukla', 'Neha Sinha',
  'Rajesh Pandey', 'Suresh Naik', 'Lakshmi Venkat', 'Ganesh Krishnan', 'Preeti Malhotra',
  'Harish Yadav', 'Jaya Prakash', 'Ramesh Babu', 'Sarita Devi', 'Usha Rajan',
  'Tarun Khanna', 'Bindu George', 'Ashok Pillai', 'Renuka Desai', 'Vijay Anand',
  'Smita Kulkarni', 'Naveen Reddy', 'Anjali Bhatt', 'Prakash Rao', 'Disha Sharma',
  'Varun Mishra', 'Siddharth Joshi', 'Komal Gupta', 'Alok Dixit', 'Ravi Shankar',
  'Madhuri Patel', 'Ashish Rawat', 'Sapna Agarwal', 'Hemant Chauhan', 'Poonam Verma',
];

const PDM_NAMES = [
  'Michael Chen', 'Laura Martinez', 'Jessica Williams', 'David Thompson', 'Sarah Anderson',
  'Vineet Kumar', 'Pradeep Sharma', 'Rahul Oberoi', 'Neelam Gupta', 'Saurabh Jain',
  'Varun Mishra', 'Aditya Bansal', 'Megha Tandon', 'Rohan Aggarwal', 'Simran Kaur',
];

const SM_NAMES = [
  'Ajay Malhotra', 'Renu Bansal', 'Vikrant Singh', 'Sonal Kapoor', 'Deepak Arora',
  'Nidhi Verma', 'Pankaj Gupta', 'Ritika Sharma', 'Sameer Khan', 'Tanvi Joshi',
  'Anupam Srivastava', 'Bhavna Mehta', 'Chirag Patel', 'Dimple Agarwal', 'Eshaan Rao',
];

const PROJECT_PREFIXES = [
  'Digital Transformation', 'Cloud Migration', 'ERP Implementation', 'CRM Integration',
  'Data Analytics', 'Mobile App', 'Web Portal', 'API Gateway', 'DevOps Pipeline',
  'Security Audit', 'Testing Automation', 'UI/UX Redesign', 'Microservices',
  'Legacy Modernization', 'AI Chatbot', 'Payment Gateway', 'Invoice Processing',
  'Inventory System', 'HR Portal', 'Supply Chain', 'Customer Portal',
  'Policy Administration', 'Claims Management', 'Underwriting Platform', 'Risk Assessment',
  'Marketing Automation', 'Content Management', 'E-commerce Platform', 'Analytics Dashboard',
  'Staffing Portal', 'Resource Management', 'Talent Acquisition', 'Performance Tracker',
  'Document Management', 'Workflow Automation', 'Billing System', 'Reporting Suite',
  'Compliance Module', 'Training Platform', 'Knowledge Base', 'Notification Engine',
];

const CLIENT_NAMES = [
  'Acme Corp', 'TechNova Inc', 'Global Finance Ltd', 'HealthFirst Systems', 'RetailMax',
  'InsurePro Holdings', 'DataStream Solutions', 'CloudPeak Technologies', 'Meridian Networks',
  'Prime Manufacturing', 'Atlas Logistics', 'Beacon Infrastructure', 'Summit Consulting',
  'Nexus Financial', 'Pioneer Healthcare', 'Sterling Industries', 'Vertex Energy',
  'Pinnacle Retail', 'Spectrum Media', 'Quantum Analytics', 'Azure Telecom',
  'CrestWave Partners', 'Evergreen Solutions', 'Falcon Technologies', 'GoldBridge Corp',
  'HarborLight Systems', 'IronClad Security', 'JadePoint Software', 'Keystone Services',
  'LuminaTech', 'MapleCrest Holdings', 'NovaStar Inc', 'OceanView Capital',
  'PathFinder Digital', 'QuickSilver Labs', 'RedOak Consulting', 'SilverLine Solutions',
  'TridentTech', 'Unisource Global', 'VantagePoint Group', 'WestBridge Corp',
  'XcelRate Systems', 'YieldMax Finance', 'ZenithSoft', 'AmberWave Tech',
  'BlueHorizon Ltd', 'CoralTech Services', 'DawnStar Industries', 'EchoValley Corp',
];

const THOUGHT_TEMPLATES = [
  'Project is on track. All deliverables progressing as planned.',
  'Client has requested scope change for Phase 2. Impact analysis in progress.',
  'Sprint velocity has improved by 15% this month. Team stabilizing.',
  'Resource constraint identified. Need 2 additional developers by next sprint.',
  'UAT completed successfully. Moving to production deployment next week.',
  'Budget review completed. Project within 5% of planned cost.',
  'Risk mitigation plan activated for delayed vendor deliverables.',
  'Client escalation resolved. Communication cadence increased to daily.',
  'Performance testing revealed bottleneck in API layer. Optimization underway.',
  'New team member onboarding completed. Ramp-up period expected 2 weeks.',
  'Milestone 3 delivered on time. Client expressed satisfaction.',
  'Integration testing in progress. 3 critical defects identified and being fixed.',
  'Governance review scheduled for next week. All artifacts prepared.',
  'SPI improving after resource addition. Expected to stabilize by month end.',
  'Client stakeholder change. New POC introduced and relationship being built.',
  'Technical debt sprint completed. System stability improved significantly.',
  'Billing dispute resolved. Q3 invoices approved for processing.',
  'Architecture review completed. No major changes recommended.',
  'Team morale high after successful go-live. Celebration planned.',
  'Handover documentation in progress for transition to maintenance.',
];

const THOUGHT_AUTHORS = [
  'Gaurav Singh', 'Ritu Agarwal', 'Amit Verma', 'Priya Sharma', 'Rajat Gupta',
  'Vikram Patel', 'Deepa Nair', 'Rohit Kumar', 'Varun Mishra', 'Sneha Das',
];

// ---------- Helpers ----------

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, min, max) {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function weightedPick(items, weights) {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return items[i];
  }
  return items[items.length - 1];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateTags(division) {
  const tags = [];
  // Offering (1-2)
  pickN(OFFERINGS, 1, 2).forEach((v) => tags.push({ category: 'Offering', value: v }));
  // Geography (1)
  tags.push({ category: 'Geography', value: pick(GEOGRAPHIES) });
  // Domain (1)
  tags.push({ category: 'Domain', value: pick(DOMAINS) });
  // Currency (1)
  tags.push({ category: 'Currency', value: pick(CURRENCIES) });
  // Status
  tags.push({ category: 'Status', value: 'Active' });
  return tags;
}

function generateHealthScore() {
  const r = Math.random();
  if (r < 0.60) return randInt(75, 100);
  if (r < 0.85) return randInt(50, 74);
  return randInt(20, 49);
}

function pastDate(maxDaysAgo) {
  const now = new Date();
  const daysAgo = randInt(1, maxDaysAgo);
  return new Date(now.getTime() - daysAgo * 86400000);
}

// ---------- Seed ----------

async function seed() {
  console.log('Seeding projects...');

  // Truncate existing data so this script is safe to re-run
  await pool.query('TRUNCATE project_milestones, project_delivery_thoughts, projects RESTART IDENTITY CASCADE');
  console.log('Existing project data cleared.');

  // Get existing customer IDs
  const customerResult = await pool.query('SELECT id, name FROM customers LIMIT 100');
  const customers = customerResult.rows;

  let projectId = 0;
  const projectRows = [];
  const thoughtRows = [];

  for (const div of DIVISIONS) {
    // Select DMs for this division
    const divDms = pickN(DM_NAMES, div.dmCount, div.dmCount);

    for (let i = 0; i < div.count; i++) {
      projectId++;
      const projectType = div.name === 'Staffing' ? 'Staffing' : weightedPick(['BYT/T&M', 'FP'], [0.42, 0.58]);
      const clientRef = customers.length > 0 ? pick(customers) : null;
      const healthScore = generateHealthScore();
      const isCritical = healthScore < 50 && Math.random() < 0.4;
      const revenueAtRisk = Math.random() < 0.08 ? randFloat(10000, 500000) : 0;
      const assessmentOverdue = Math.random() < 0.15;
      const severeOverburn = Math.random() < 0.08;
      const spiVal = randFloat(0.6, 1.4);
      const cpiVal = randFloat(-2, 3);
      const varianceVal = randFloat(-50, 300);

      const contractStart = pastDate(365 * 3);
      const contractEnd = new Date(contractStart.getTime() + randInt(180, 730) * 86400000);

      projectRows.push({
        name: `${pick(PROJECT_PREFIXES)} - ${div.name.substring(0, 4)}${projectId}`,
        client_name: clientRef ? clientRef.name : pick(CLIENT_NAMES),
        client_id: clientRef ? clientRef.id : null,
        division: div.name,
        project_type: projectType,
        engagement_model: projectType === 'Staffing' ? 'Staffing' : pick(ENGAGEMENT_MODELS.slice(0, 3)),
        status: Math.random() < 0.92 ? 'active' : 'inactive',
        tags: JSON.stringify(generateTags(div.name)),
        pdm_name: pick(PDM_NAMES),
        sm_name: pick(SM_NAMES),
        dm_name: pick(divDms),
        headcount: randInt(2, 25),
        fte: randFloat(0.5, 15.0, 1),
        health_score: healthScore,
        service_quality: healthScore >= 75 ? 'Healthy' : (healthScore >= 50 ? pick(['Healthy', 'At Risk']) : pick(['At Risk', 'N/A'])),
        financial_health: healthScore >= 70 ? 'Healthy' : (healthScore >= 40 ? pick(['Healthy', 'At Risk']) : pick(['At Risk', 'N/A'])),
        spi: spiVal,
        cpi: cpiVal,
        variance_percent: varianceVal,
        margin_percent: randFloat(-5, 35, 1),
        overburn_percent: severeOverburn ? randFloat(20, 80, 1) : randFloat(-10, 15, 1),
        assessment_overdue: assessmentOverdue,
        overdue_days: assessmentOverdue ? randInt(1, 60) : 0,
        severe_overburn: severeOverburn,
        revenue_at_risk: revenueAtRisk,
        is_critical_attention: isCritical,
        customer_confidence: randFloat(2.0, 5.0, 1),
        csat_trend: pick(CSAT_TRENDS),
        contract_start_date: contractStart.toISOString().split('T')[0],
        contract_end_date: contractEnd.toISOString().split('T')[0],
        contract_value: randFloat(50000, 5000000, 0),
      });

      // Generate 0-3 delivery thoughts
      const thoughtCount = randInt(0, 3);
      for (let t = 0; t < thoughtCount; t++) {
        thoughtRows.push({
          projectIndex: projectId - 1,
          note: pick(THOUGHT_TEMPLATES),
          author: pick(THOUGHT_AUTHORS),
          created_at: pastDate(90),
        });
      }
    }
  }

  // Bulk insert projects
  for (const p of projectRows) {
    const result = await pool.query(
      `INSERT INTO projects (
         name, client_name, client_id, division, project_type, engagement_model,
         status, tags, pdm_name, sm_name, dm_name, headcount, fte,
         health_score, service_quality, financial_health,
         spi, cpi, variance_percent, margin_percent, overburn_percent,
         assessment_overdue, overdue_days, severe_overburn,
         revenue_at_risk, is_critical_attention, customer_confidence, csat_trend,
         contract_start_date, contract_end_date, contract_value
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)
       RETURNING id`,
      [
        p.name, p.client_name, p.client_id, p.division, p.project_type, p.engagement_model,
        p.status, p.tags, p.pdm_name, p.sm_name, p.dm_name, p.headcount, p.fte,
        p.health_score, p.service_quality, p.financial_health,
        p.spi, p.cpi, p.variance_percent, p.margin_percent, p.overburn_percent,
        p.assessment_overdue, p.overdue_days, p.severe_overburn,
        p.revenue_at_risk, p.is_critical_attention, p.customer_confidence, p.csat_trend,
        p.contract_start_date, p.contract_end_date, p.contract_value,
      ]
    );
    p.dbId = result.rows[0].id;
  }

  console.log(`Inserted ${projectRows.length} projects`);

  // Insert delivery thoughts
  for (const t of thoughtRows) {
    const projectDbId = projectRows[t.projectIndex].dbId;
    await pool.query(
      `INSERT INTO project_delivery_thoughts (project_id, note, author, created_at) VALUES ($1, $2, $3, $4)`,
      [projectDbId, t.note, t.author, t.created_at]
    );
  }

  console.log(`Inserted ${thoughtRows.length} delivery thoughts`);

  // Insert milestones (2-4 per project, sampled from a subset for performance)
  const MILESTONE_NAMES = [
    'Requirements Finalized', 'Design Approval', 'Development Sprint 1',
    'Development Sprint 2', 'UAT Kick-off', 'UAT Sign-off',
    'Performance Testing', 'Go-Live', 'Post Go-Live Support', 'Project Closure',
  ];
  const MILESTONE_STATUSES = ['completed', 'in-progress', 'pending', 'at-risk'];
  const STATUS_WEIGHTS = [0.40, 0.25, 0.25, 0.10];

  let milestoneCount = 0;
  for (const p of projectRows) {
    if (!p.dbId) continue;
    const milestoneNames = pickN(MILESTONE_NAMES, 2, 4);
    for (const mName of milestoneNames) {
      const daysOffset = randInt(-60, 120);
      const dueDate = new Date(Date.now() + daysOffset * 86400000).toISOString().split('T')[0];
      const status = weightedPick(MILESTONE_STATUSES, STATUS_WEIGHTS);
      await pool.query(
        `INSERT INTO project_milestones (project_id, name, due_date, status) VALUES ($1, $2, $3, $4)`,
        [p.dbId, mName, dueDate, status]
      );
      milestoneCount++;
    }
  }
  console.log(`Inserted ${milestoneCount} milestones`);

  // Verify
  const divCounts = await pool.query('SELECT division, COUNT(*) as cnt FROM projects GROUP BY division ORDER BY cnt DESC');
  console.log('\nDivision counts:');
  divCounts.rows.forEach((r) => console.log(`  ${r.division}: ${r.cnt}`));

  const total = await pool.query('SELECT COUNT(*) as cnt FROM projects');
  console.log(`\nTotal projects: ${total.rows[0].cnt}`);

  await pool.end();
  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
