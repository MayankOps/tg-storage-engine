const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db");

db.run(`
CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE,
  file_id TEXT,
  file_name TEXT,
  file_size INTEGER,
  downloads INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

module.exports = db;