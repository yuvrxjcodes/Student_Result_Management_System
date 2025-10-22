const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const app = express();

// ---------- Middleware ----------
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Session ----------
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.sqlite", dir: "./db" }),
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true only in HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Debug session middleware
app.use((req, res, next) => {
  console.log("🧩 Current Session:", req.session);
  next();
});

// ---------- Static Pages ----------
app.get("/", (req, res) => res.render("home"));
app.get("/faq", (req, res) => res.render("faq"));
app.get("/about", (req, res) => res.render("about"));

// ---------- Routes ----------
app.use("/", authRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);

// ---------- Server ----------
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at: http://localhost:${PORT}`)
);
