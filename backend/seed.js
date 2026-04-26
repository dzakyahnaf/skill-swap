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

    // 1. Clear existing data (optional but recommended for a clean seed)
    await pool.query('TRUNCATE TABLE active_sessions, swap_requests, skills, reports, users, admins CASCADE');

    // 2. Admin
    await pool.query(
      'INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3)',
      ['admin', 'admin@skillswap.id', passwordHash]
    );

    // 3. Users
    const user1 = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name, bio) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['dzakyahnaf', 'dzaky@skillswap.id', passwordHash, 'Dzaky Ahnaf', 'Flutter & Backend Enthusiast']
    );

    const user2 = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name, bio) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['budisantoso', 'budi@skillswap.id', passwordHash, 'Budi Santoso', 'UI/UX Designer & Photographer']
    );

    const dzakyId = user1.rows[0].id;
    const budiId = user2.rows[0].id;

    // 4. Skills
    // Dzaky's skills
    await pool.query(
      'INSERT INTO skills (user_id, name, category, description, skill_type) VALUES ($1, $2, $3, $4, $5)',
      [dzakyId, 'Flutter Development', 'Programming', 'I can teach you how to build cross-platform apps.', 'offered']
    );
    await pool.query(
      'INSERT INTO skills (user_id, name, category, description, skill_type) VALUES ($1, $2, $3, $4, $5)',
      [dzakyId, 'UI Design', 'Design', 'I want to learn better UI design principles.', 'wanted']
    );

    // Budi's skills
    await pool.query(
      'INSERT INTO skills (user_id, name, category, description, skill_type) VALUES ($1, $2, $3, $4, $5)',
      [budiId, 'Adobe Photoshop', 'Design', 'Expert in photo editing and manipulation.', 'offered']
    );
    await pool.query(
      'INSERT INTO skills (user_id, name, category, description, skill_type) VALUES ($1, $2, $3, $4, $5)',
      [budiId, 'Mobile Development', 'Programming', 'Interested in learning Flutter.', 'wanted']
    );

    console.log('Seeding successful!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await pool.end();
  }
}

seed();

