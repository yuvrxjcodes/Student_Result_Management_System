module.exports = (req, res, next) => {
  console.log("🧠 Auth check - session user:", req.session.user);

  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
};
