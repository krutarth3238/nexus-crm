const db = require('better-sqlite3')('./data/crm.db');

try {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@nexuscrm.dev');
  console.log('User found:', user);

  const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='tickets'").get();
  console.log('Ticket Schema:', schema.sql);
} catch (e) {
  console.error(e);
}
