const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  database: 'postgres'
});

async function test() {
  try {
    const res = await pool.query('SELECT 1');
    console.log('Connected with trust auth!');
  } catch (err) {
    console.log('Failed:', err.message);
  } finally {
    await pool.end();
  }
}

test();
