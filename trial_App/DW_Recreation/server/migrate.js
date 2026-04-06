import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import pg from 'pg';
import fs from 'fs';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
});

const migrationsDir = path.join(__dirname, 'migrations');

const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

for (const file of files) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  try {
    await pool.query(sql);
    console.log(`Applied: ${file}`);
  } catch (err) {
    console.error(`Failed: ${file}\n${err.message}`);
    process.exit(1);
  }
}

await pool.end();
console.log('All migrations complete.');
