/**
 * One-off runner for migration 009 only.
 * Usage: node server/run-009.js
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  const sql = readFileSync(join(__dirname, 'migrations', '009_project_detail_tables.sql'), 'utf8');
  console.log('Running migration 009...');
  await pool.query(sql);
  console.log('Migration 009 complete.');
  await pool.end();
}

run().catch((err) => { console.error(err); process.exit(1); });
