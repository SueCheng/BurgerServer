const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const keys = require("../config/keys");
const User = require("../models/User");
//Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: "https://localhost:5000/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log("Facebook access token", accessToken);
      //console.log("Facebook  profile", profile);

      User.findOne({ facebookId: profile.id }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          if (user.facebookId == undefined) {
            user.facebookId = profile.id;
            user.save();
          }
          return done(null, user);
        } else {
          let newUser = new User();
          newUser.facebookId = profile.id;
          newUser.save(err => {
            if (err) {
              console.log(err);
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    }
  )
);
//Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "https://localhost:5000/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      //console.log("Google access token", accessToken);
      //console.log("Google profile", profile);

      User.findOne({ googleId: profile.id }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          if (user.googleId == undefined) {
            user.googleId = profile.id;
            user.save();
          }
          return done(null, user);
        } else {
          let newUser = new User();
          newUser.googleId = profile.id;
          newUser.save(err => {
            if (err) {
              console.log(err);
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    }
  )
);

//Local Strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    //console.log("Google access token", accessToken);
    //console.log("Google profile", profile);

    User.findOne({ username: username }, "password", { lean: true }, function(
      err,
      user
    ) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
