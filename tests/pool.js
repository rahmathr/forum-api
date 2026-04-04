require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  database: process.env.PGDATABASE_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
});

module.exports = pool;
