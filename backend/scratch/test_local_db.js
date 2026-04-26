const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5433/postgres",
});

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful to local 5433:', res.rows[0]);
    
    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', tables.rows.map(r => r.table_name));
    
  } catch (err) {
    console.error('Connection failed to local 5433:', err.message);
  } finally {
    await pool.end();
  }
}

test();
