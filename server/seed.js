import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'damcoworks',
  user: process.env.DB_USER || 'damco',
  password: process.env.DB_PASSWORD || 'damco123',
});

// --- Data pools ---
const INDUSTRIES = [
  'Insurance', 'Hi-Tech', 'Manufacturing', 'Transportation and Logistics',
  'Financial Services', 'Publishing and Media', 'Health and Social Care',
  'Business Consulting Services', 'Automotive', 'Energy and Utilities',
  'Retail', 'Telecommunications', 'Education', 'Real Estate',
];

const TIERS = [null, null, null, 'Red Carpet', 'Gold', 'Strategic'];

const SALES_OWNERS = [
  'Neha Panchal', 'Andrew M Spada', 'Rajesh Kumar', 'Priya Sharma',
  'Michael Chen', 'Sarah Johnson', 'Amit Patel', 'Jessica Williams',
  'Vikram Singh', 'Emily Davis', 'Rohit Gupta', 'Laura Martinez',
];

const CLIENT_PARTNERS = [
  'Mohit Gupta', 'Vineet Kumar', 'Anjali Desai', 'David Brown',
  'Sneha Reddy', 'James Wilson', 'Kavita Nair', 'Robert Taylor',
  'Deepak Mishra', 'Megan Thomas', '', '',
];

const DM_PRACTICES = [
  'ITeS', 'Technology Services', 'Salesforce', 'Digital', 'Cloud Services',
  'Data Analytics', 'ERP', 'Quality Engineering',
];

const DM_NAMES = [
  'Arun Sharma', 'Pooja Verma', 'Sanjay Mehta', 'Ritu Agarwal',
  'Manish Tiwari', 'Swati Joshi', 'Karan Kapoor', 'Nisha Gupta',
  'Suresh Rao', 'Divya Bhatia', 'Ankit Saxena', 'Meera Pillai',
  'Gaurav Singh', 'Pallavi Iyer', 'Rakesh Nanda', 'Sonali Das',
];

const COMPANY_PREFIXES = [
  'Cube', 'Apex', 'Global', 'Prime', 'Nova', 'Zenith', 'Vertex', 'Summit',
  'Stellar', 'Nexus', 'Orbit', 'Pinnacle', 'Quantum', 'Atlas', 'Vanguard',
  'Matrix', 'Horizon', 'Fusion', 'Titan', 'Crest', 'Meridian', 'Catalyst',
  'Elevate', 'Synergy', 'Axis', 'Beacon', 'Cipher', 'Delta', 'Echo',
  'Forge', 'Granite', 'Haven', 'Infra', 'Jade', 'Keystone', 'Lumen',
];

const COMPANY_SUFFIXES = [
  'Content Governance Global Limited', 'Technologies Inc', 'Solutions Pvt Ltd',
  'Systems Corporation', 'Digital Services', 'Enterprises LLC', 'Group International',
  'Financial Holdings', 'Insurance Corp', 'Media Partners', 'Healthcare Solutions',
  'Logistics Co', 'Energy Systems', 'Manufacturing Ltd', 'Consulting Group',
  'Software Inc', 'Analytics Corp', 'Networks Ltd', 'Infrastructure Pvt Ltd',
  'Innovations LLC',
];

const AVATAR_COLORS = [
  '#4F46E5', '#7C3AED', '#DB2777', '#DC2626', '#EA580C', '#D97706',
  '#65A30D', '#059669', '#0891B2', '#2563EB', '#4338CA', '#9333EA',
];

const POC_NAMES = [
  'Annabel Phillips', 'George Harrison', 'Maria Santos', 'Chen Wei',
  'Ravi Krishnan', 'Sophie Turner', 'Alex Morgan', 'Yuki Tanaka',
  'Omar Hassan', 'Lisa Muller', 'James O\'Brien', 'Fatima Khan',
];

const TESTIMONIALS = [
  'Excellent service delivery and proactive communication throughout the project.',
  'The team demonstrated strong technical expertise and met all deadlines.',
  'Great collaboration and problem-solving approach. Highly recommended.',
  'Consistent quality and responsive to our changing requirements.',
  'Outstanding support during our digital transformation journey.',
  'Professional team with deep domain knowledge.',
  'Exceeded expectations in both delivery and innovation.',
  '',
  '',
  '',
];

function hashColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDecimal(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateDmPdm() {
  const count = Math.random() < 0.3 ? randBetween(2, 7) : 1;
  const dms = [];
  const usedNames = new Set();
  for (let i = 0; i < count; i++) {
    let name;
    do { name = pick(DM_NAMES); } while (usedNames.has(name));
    usedNames.add(name);
    dms.push({ name, practice: pick(DM_PRACTICES) });
  }
  return JSON.stringify(dms);
}

function generateCustomers(count) {
  const customers = [];
  const usedNames = new Set();

  for (let i = 0; i < count; i++) {
    let name;
    do {
      name = `${pick(COMPANY_PREFIXES)} ${pick(COMPANY_SUFFIXES)}`;
    } while (usedNames.has(name));
    usedNames.add(name);

    const bookedUsd = randDecimal(5000, 500000);
    const revenueUsd = randDecimal(3000, 400000);
    const usdToInr = 83.5;
    const healthGreen = randBetween(0, 8);
    const healthOrange = randBetween(0, 3);
    const healthRed = randBetween(0, 2);
    const isAtRisk = healthRed > 0;
    const tier = pick(TIERS);
    const csatScore = Math.random() < 0.7 ? randDecimal(2, 5, 2) : null;
    const isNewLogo = Math.random() < 0.15;
    const salesOwner = pick(SALES_OWNERS);
    const clientPartner = pick(CLIENT_PARTNERS);

    customers.push({
      name,
      contact_person: `${pick(['John', 'Jane', 'Raj', 'Priya', 'Mike', 'Sara'])} ${pick(['Smith', 'Kumar', 'Lee', 'Patel', 'Brown', 'Garcia'])}`,
      email: `contact@${name.split(' ')[0].toLowerCase()}.com`,
      phone: `+1-${randBetween(200, 999)}-${randBetween(100, 999)}-${randBetween(1000, 9999)}`,
      address: `${randBetween(100, 9999)} Business Park, Suite ${randBetween(100, 500)}`,
      status: 'active',
      tier,
      csat_score: csatScore,
      sales_owner: salesOwner,
      client_partner: clientPartner,
      cp_ownership: Math.random() < 0.3,
      incentive_eligibility: Math.random() < 0.4,
      client_co_partner: Math.random() < 0.25 ? pick(CLIENT_PARTNERS.filter(Boolean)) : null,
      dm_pdm: generateDmPdm(),
      industry: pick(INDUSTRIES),
      referenceable: Math.random() < 0.35,
      booked_sales_usd: bookedUsd,
      booked_sales_inr: parseFloat((bookedUsd * usdToInr).toFixed(2)),
      revenue_usd: revenueUsd,
      revenue_inr: parseFloat((revenueUsd * usdToInr).toFixed(2)),
      project_health_green: healthGreen,
      project_health_orange: healthOrange,
      project_health_red: healthRed,
      at_risk: isAtRisk,
      is_new_logo: isNewLogo,
      avatar_color: hashColor(name),
    });
  }

  return customers;
}

function generateCsatSurveys(customerId, csatScore) {
  if (!csatScore) return [];
  const count = randBetween(1, 3);
  const surveys = [];
  for (let i = 0; i < count; i++) {
    const year = 2025;
    const month = randBetween(1, 12);
    const day = randBetween(1, 28);
    surveys.push({
      customer_id: customerId,
      score: randDecimal(Math.max(1, csatScore - 1), Math.min(5, csatScore + 0.5), 2),
      poc: pick(POC_NAMES),
      response_date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      testimonial: pick(TESTIMONIALS),
    });
  }
  return surveys;
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM csat_surveys');
    await client.query('DELETE FROM customers');
    await client.query('ALTER SEQUENCE customers_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE csat_surveys_id_seq RESTART WITH 1');

    const customers = generateCustomers(173);
    let csatSurveyCount = 0;

    for (const customer of customers) {
      const result = await client.query(
        `INSERT INTO customers (
          name, contact_person, email, phone, address, status,
          tier, csat_score, sales_owner, client_partner,
          cp_ownership, incentive_eligibility, client_co_partner,
          dm_pdm, industry, referenceable,
          booked_sales_usd, booked_sales_inr, revenue_usd, revenue_inr,
          project_health_green, project_health_orange, project_health_red,
          at_risk, is_new_logo, avatar_color
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13,
          $14, $15, $16,
          $17, $18, $19, $20,
          $21, $22, $23,
          $24, $25, $26
        ) RETURNING id`,
        [
          customer.name, customer.contact_person, customer.email, customer.phone,
          customer.address, customer.status, customer.tier, customer.csat_score,
          customer.sales_owner, customer.client_partner, customer.cp_ownership,
          customer.incentive_eligibility, customer.client_co_partner, customer.dm_pdm,
          customer.industry, customer.referenceable, customer.booked_sales_usd,
          customer.booked_sales_inr, customer.revenue_usd, customer.revenue_inr,
          customer.project_health_green, customer.project_health_orange,
          customer.project_health_red, customer.at_risk, customer.is_new_logo,
          customer.avatar_color,
        ]
      );

      const customerId = result.rows[0].id;
      const surveys = generateCsatSurveys(customerId, customer.csat_score);

      for (const survey of surveys) {
        await client.query(
          `INSERT INTO csat_surveys (customer_id, score, poc, response_date, testimonial)
           VALUES ($1, $2, $3, $4, $5)`,
          [survey.customer_id, survey.score, survey.poc, survey.response_date, survey.testimonial]
        );
        csatSurveyCount++;
      }
    }

    await client.query('COMMIT');
    console.log(`Seeded ${customers.length} customers and ${csatSurveyCount} CSAT surveys.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
