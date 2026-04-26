const { Pool } = require('pg');

const passwords = ['postgres', 'password', 'skillswap', 'admin', 'root'];

async function testPasswords() {
  for (const pwd of passwords) {
    const pool = new Pool({
      connectionString: `postgresql://postgres:${pwd}@localhost:5433/postgres`,
    });
    try {
      await pool.query('SELECT 1');
      console.log(`Connection successful with password: ${pwd}`);
      return;
    } catch (err) {
      console.log(`Failed with password: ${pwd}`);
    } finally {
      await pool.end();
    }
  }
}

testPasswords();
