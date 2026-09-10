const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const config = require('../config/env');

const dir = path.dirname(config.dbPath);

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(config.dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;