const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ✅ Always use absolute path (avoids "MODULE_NOT_FOUND" or DB not found errors)
const dbPath = path.join(__dirname, "../db/database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// ✅ Create users table if it doesn’t exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )
`);

// ✅ Insert sample users if table is empty
db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
  if (err) {
    console.error("❌ Error checking users table:", err.message);
  } else if (row.count === 0) {
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ["teacher1", "pass", "teacher"]);
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ["student1", "pass", "student"]);
    console.log("✅ Sample users added to the database.");
  }
});

module.exports = db;
