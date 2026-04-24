require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  try {
    console.log('Seeding initial data...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password', salt);

    // 1. Admin
    await pool.query(
      'INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
      ['admin', 'admin@skillswap.id', passwordHash]
    );

    // 2. Users
    await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name, bio) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
      ['dzakyahnaf', 'dzaky@skillswap.id', passwordHash, 'Dzaky Ahnaf', 'Frontend Enthusiast']
    );

    await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name, bio) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
      ['budisantoso', 'budi@skillswap.id', passwordHash, 'Budi Santoso', 'Backend Developer']
    );

    console.log('Seeding successful!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await pool.end();
  }
}

seed();
