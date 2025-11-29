import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file FIRST before reading environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pg;

// Trim password and remove any non-printable characters
const rawPassword = process.env.DB_PASSWORD || 'postgres';
const dbPassword = rawPassword
  .trim()
  .replace(/[\r\n\t]/g, '') // Remove carriage returns, newlines, tabs
  .replace(/[^\x20-\x7E]/g, ''); // Remove any non-printable ASCII characters

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'moyoclub',
  user: process.env.DB_USER || 'postgres',
  password: dbPassword,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
