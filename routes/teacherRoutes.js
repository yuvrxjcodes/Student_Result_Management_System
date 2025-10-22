const express = require("express");
const router = express.Router();
const marksDB = require("../models/marksModel");
const studentDB = require("../models/studentModel");
const ensureAuthenticated = require("../middlewares/authMiddleware");

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  studentDB.all("SELECT * FROM students", (err, students) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).send("Database error");
    }

    marksDB.all("SELECT * FROM marks", (err, marks) => {
      if (err) {
        console.error("Error fetching marks:", err);
        return res.status(500).send("Database error");
      }

      res.render("teacherDashboard", {
        user: req.session.user,
        students: students || [],
        marks: marks || [],
      });
    });
  });
});

router.post("/addMark", ensureAuthenticated, (req, res) => {
  const { student_name, subject, marks } = req.body;

  if (!student_name || !subject || !marks) {
    return res.status(400).send("All fields are required");
  }

  marksDB.run(
    "INSERT INTO marks (student_name, subject, marks) VALUES (?, ?, ?)",
    [student_name, subject, marks],
    (err) => {
      if (err) {
        console.error("Error inserting marks:", err);
        return res.status(500).send("Error adding marks");
      }
      res.redirect("/teacher/dashboard");
    }
  );
});

router.post("/delete/:id", ensureAuthenticated, (req, res) => {
  const { id } = req.params;

  marksDB.run("DELETE FROM marks WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("❌ Error deleting record:", err);
      return res.status(500).send("Error deleting record");
    }
    console.log(`🗑️ Deleted record with ID: ${id}`);
    res.redirect("/teacher/dashboard");
  });
});

module.exports = router;
