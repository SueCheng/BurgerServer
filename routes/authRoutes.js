const passport = require("passport");
const User = require("../models/User");

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
  app.post("/auth/local", function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (!user) {
        return res.status(401).send({ success: false, info });
      }
      // ***********************************************************************
      // "Note that when using a custom callback, it becomes the application's
      // responsibility to establish a session (by calling req.login()) and send
      // a response."
      // Source: http://passportjs.org/docs
      // ***********************************************************************
      req.login(user, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.send({ success: true, info: req.user });
      });
    })(req, res, next);
  });

  /* client side is from browser req,server could redirect, if client side is xhr,server should just respond.send
  app.post(
    "/auth/local",
    passport.authenticate("local", { failureRedirect: "/auth/local" }),
    (req, res) => {
      res.redirect("/");
    }
  );*/

  //Log out,call passport's req.logout to clear the session and req.user

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.post("/auth/signup", (req, res) => {
    console.log("get signup request");
    User.findOne({ userName: req.body.userName }, (err, user) => {
      if (err) {
        console.log("signup finding user error", err);
        res.status(422).send({ success: false, info: err });
      } else if (user)
        res.send({
          success: false,
          info: "The username has already been used"
        });
      else {
        const newUser = new User();
        newUser.local.userName = req.body.userName;
        newUser.local.password = req.body.password; //by default, the set for vitual will be called to set the hashedpassword
        newUser.loginMethod = "local";
        newUser.save();
        req.login(newUser, function(err) {
          if (err) {
            console.log("req login error,didn't handle", err);
            return next(err);
          }
          res.send({
            success: true,
            info: req.user
          });
        });
      }
    });
  });

  app.get("/auth/current_user", (req, res) => {
    res.send(req.user);
  });
};
