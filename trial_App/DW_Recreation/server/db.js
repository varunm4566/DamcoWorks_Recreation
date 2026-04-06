import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
// Load from project root (.env) — works regardless of which directory node was invoked from
config({ path: resolve(__dirname, '../.env') });
config({ path: resolve(__dirname, '.env') }); // fallback if .env is inside server/
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

export default pool;
