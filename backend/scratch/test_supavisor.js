const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres.vxenqamcfnxmrccufyfm:Bantaisisop12@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Success with Supavisor:', res.rows[0]);
  } catch (err) {
    console.log('Failed with Supavisor:', err.message);
  } finally {
    await pool.end();
  }
}

test();
