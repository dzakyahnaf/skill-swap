const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:password@localhost:5433/postgres",
});

async function test() {
  try {
    await pool.query('SELECT 1');
    console.log('Success with password: password');
  } catch (err) {
    console.log('Failed');
  } finally {
    await pool.end();
  }
}

test();
