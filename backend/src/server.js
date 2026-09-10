const fs = require('fs');
const path = require('path');
const db = require('./db/connection');
const app = require('./app');
const config = require('./config/env');

// Auto-run migrations on every startup (safe to run repeatedly — uses CREATE TABLE IF NOT EXISTS)
try {
  const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
  db.exec(schema);
  console.log('DB: schema applied.');
} catch (err) {
  console.error('DB: migration failed —', err.message);
}

// Auto-seed if DB is empty (seed.js already guards against duplicates)
try {
  require('./db/seed');
} catch (err) {
  console.error('DB: seed failed —', err.message);
}

app.listen(config.port, () => {
  console.log(`Nexus CRM backend listening on port ${config.port}`);
});
