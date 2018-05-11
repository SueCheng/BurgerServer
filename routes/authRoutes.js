const passport = require("passport");

module.exports = app => {
  //Facebook Login
  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/auth/facebook", passport.authenticate("facebook"));

  //Google acct Login
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  //Local acct Login

  app.get(
    "/auth/local",
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  //Log out,call passport's req.logout to clear the session and req.user

  app.get("/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  //for test
  app.get("/", (req, res) => {
    if (req.protocol === "https") res.status(200).send("hii https");
    else res.status(200).send("hi http");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.session);
  });
};
