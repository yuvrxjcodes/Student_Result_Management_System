const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/database.sqlite");

// Create student table
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    class TEXT
  )
`);

// Sample student
db.get("SELECT COUNT(*) AS count FROM students", (err, row) => {
  if (row.count === 0) {
    db.run("INSERT INTO students (name, class) VALUES ('John Doe', '10A')");
  }
});

module.exports = db;

