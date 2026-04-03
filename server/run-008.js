/**
 * One-off runner for migration 008 only.
 * Do NOT use migrate.js — it re-runs 007 which drops the projects table.
 *
 * Usage (from DW_Recreation root):
 *   node server/run-008.js
 */

import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
});

const migrationFile = path.join(__dirname, 'migrations', '008_add_missing_project_columns.sql');
const sql = fs.readFileSync(migrationFile, 'utf8');

try {
  await pool.query(sql);
  console.log('Migration 008 applied successfully.');
} catch (err) {
  console.error('Migration 008 failed:', err.message);
  process.exit(1);
} finally {
  await pool.end();
}
