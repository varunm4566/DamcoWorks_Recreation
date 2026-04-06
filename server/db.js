import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '../.env' });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'damcoworks',
  user: process.env.DB_USER || 'damco',
  password: process.env.DB_PASSWORD || 'damco123',
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

export default pool;
