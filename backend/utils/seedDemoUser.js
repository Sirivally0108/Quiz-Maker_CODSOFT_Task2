/**
 * One-time utility to create the demo user that owns the sample quizzes
 * in database/seed.sql. Passwords must never be stored in plain text, so
 * this script hashes the password with bcryptjs before inserting it.
 *
 * Usage (from the backend/ folder, after `npm install` and after running
 * database/schema.sql):
 *
 *     node utils/seedDemoUser.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const DEMO_NAME = 'Demo Creator';
const DEMO_EMAIL = 'demo@quizmaker.com';
const DEMO_PASSWORD = 'Demo@1234';

async function run() {
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [DEMO_EMAIL]);

    if (existing.rows.length > 0) {
      console.log(`Demo user already exists (id = ${existing.rows[0].id}). Nothing to do.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`,
      [DEMO_NAME, DEMO_EMAIL, hashedPassword]
    );

    console.log(`Demo user created with id = ${result.rows[0].id}`);
    console.log(`You can log in with email: ${DEMO_EMAIL}  password: ${DEMO_PASSWORD}`);
    console.log('Now run database/seed.sql to insert the sample quizzes.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed demo user:', err.message);
    process.exit(1);
  }
}

run();
