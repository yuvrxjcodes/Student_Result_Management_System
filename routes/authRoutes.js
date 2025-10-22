const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models/userModel");

// ---------- LOGIN PAGE ----------
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// ---------- REGISTER PAGE ----------
router.get("/register", (req, res) => {
  res.render("register", { error: null, success: null });
});

// ---------- REGISTER SUBMISSION ----------
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.render("register", {
      error: "⚠️ Please fill all fields.",
      success: null,
    });
  }

  // Check if user already exists
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) {
      console.error("Database error:", err);
      return res.render("register", {
        error: "⚠️ Server error. Try again.",
        success: null,
      });
    }

    if (user) {
      return res.render("register", {
        error: "⚠️ Username already exists.",
        success: null,
      });
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashedPassword, role],
        function (err) {
          if (err) {
            console.error("Insert error:", err);
            return res.render("register", {
              error: "⚠️ Failed to register.",
              success: null,
            });
          }

          console.log("✅ New user registered:", username);
          res.render("register", {
            error: null,
            success: "✅ Registration successful! You can now log in.",
          });
        }
      );
    } catch (err) {
      console.error("Hashing error:", err);
      res.render("register", {
        error: "⚠️ Something went wrong.",
        success: null,
      });
    }
  });
});

// ---------- LOGIN SUBMISSION ----------
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("login", { error: "⚠️ Please fill all fields." });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Database error:", err);
      return res.render("login", { error: "⚠️ Server error." });
    }

    if (!user) {
      return res.render("login", { error: "❌ Invalid username or password." });
    }

    // Compare password
    const isMatch =
      user.password.startsWith("$2b$") || user.password.startsWith("$2a$")
        ? bcrypt.compareSync(password, user.password)
        : password === user.password;

    if (!isMatch) {
      return res.render("login", { error: "❌ Invalid username or password." });
    }

    // ✅ Create session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    console.log("✅ Session after login:", req.session);

    req.session.save((err) => {
      if (err) console.error("❌ Session save error:", err);

      if (user.role === "student") {
        return res.redirect("/student/dashboard");
      } else if (user.role === "teacher") {
        return res.redirect("/teacher/dashboard");
      } else {
        return res.redirect("/login");
      }
    });
  });
});

// ---------- LOGOUT ----------
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
