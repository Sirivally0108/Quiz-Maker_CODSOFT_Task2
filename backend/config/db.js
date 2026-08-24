const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Verify the connection as soon as the app starts so config problems
// fail fast instead of surfacing as confusing query errors later.
pool
  .connect()
  .then((client) => {
    console.log('PostgreSQL connected successfully.');
    client.release();
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err.message);
  });

module.exports = pool;
