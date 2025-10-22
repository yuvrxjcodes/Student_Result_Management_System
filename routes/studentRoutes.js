const express = require("express");
const router = express.Router();
const marksDB = require("../models/marksModel");
const ensureAuthenticated = require("../middlewares/authMiddleware");

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const username = req.session.user.username;

  marksDB.all("SELECT * FROM marks WHERE student_name = ?", [username], (err, rows) => {
    if (err) {
      console.error("Error fetching marks:", err);
      return res.status(500).send("Database error");
    }

    res.render("studentDashboard", { user: req.session.user, marks: rows });
  });
});

module.exports = router;
