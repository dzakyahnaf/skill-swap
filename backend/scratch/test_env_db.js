const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Success with Supavisor (ENV):', res.rows[0]);
  } catch (err) {
    console.log('Failed with Supavisor (ENV):', err.message);
  } finally {
    await pool.end();
  }
}

test();
