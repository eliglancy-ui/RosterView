// Database configuration
//
// By default RosterView uses a built-in database (PGlite, PostgreSQL that runs
// inside Node), so `npm run dev` works with nothing else installed. It loads
// schema.sql and seed.sql on every start, so the sample data resets each time.
//
// To use a real PostgreSQL server instead, set DATABASE_URL in backend/.env,
// e.g. DATABASE_URL=postgres://postgres:postgres@localhost:5432/rosterview_dev
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const schemaFile = path.join(__dirname, '../db/schema.sql');
const seedFile = path.join(__dirname, '../db/seed.sql');

function createPostgresPool() {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
  pool.label = 'PostgreSQL (DATABASE_URL)';
  return pool;
}

function createBuiltInDatabase() {
  // Loaded lazily: PGlite is an ES module
  const ready = (async () => {
    const { PGlite } = await import('@electric-sql/pglite');
    const db = new PGlite();
    await db.exec(fs.readFileSync(schemaFile, 'utf8'));
    await db.exec(fs.readFileSync(seedFile, 'utf8'));
    console.log('Built-in database ready with sample data');
    return db;
  })();

  ready.catch((err) => {
    console.error('Failed to start built-in database:', err);
    process.exit(1);
  });

  // Same shape as pg's pool.query, so the models don't need to change
  return {
    label: 'built-in (sample data, resets on restart)',
    async query(text, params) {
      const db = await ready;
      return db.query(text, params);
    },
  };
}

const pool = process.env.DATABASE_URL ? createPostgresPool() : createBuiltInDatabase();

module.exports = pool;
