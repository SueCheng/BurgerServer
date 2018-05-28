const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const keys = require("../config/keys");
const User = require("../models/User");
const _ = require("lodash");
//Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: "/auth/facebook/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log("Facebook access token", accessToken);
      //console.log("Facebook  profile", profile);

      User.findOneAndUpdate(
        { "facebook.facebookId": profile.id },
        { loginMethod: "facebook" },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            /*if (user.facebook.facebookId == undefined) {
            user.facebook.facebookId = profile.id;
          }
          user.loginMethod = "facebook";
         user.markModified("shoppingCart");
          user.save();*/
            return done(null, user);
          } else {
            let newUser = new User();
            newUser.facebook.facebookId = profile.id;
            newUser.loginMethod = "facebook";
            newUser.save(err => {
              if (err) {
                console.log(err);
                throw err;
              }
              return done(null, newUser);
            });
          }
        }
      );
    }
  )
);
//Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      //console.log("Google access token", accessToken);
      //console.log("Google profile", profile);

      User.findOneAndUpdate(
        { "google.googleId": profile.id },
        { loginMethod: "google" },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            /*if (user.google.googleId == undefined) {
            user.google.googleId = profile.id;
          }
          user.loginMethod = "google";
          user.save();*/
            return done(null, user);
          } else {
            let newUser = new User();
            newUser.google.googleId = profile.id;
            newUser.loginMethod = "google";
            newUser.save(err => {
              if (err) {
                console.log(err);
                throw err;
              }
              return done(null, newUser);
            });
          }
        }
      );
    }
  )
);

//Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "userName",
      passwordField: "password"
    },
    (username, password, done) => {
      //console.log("Google access token", accessToken);
      //console.log("Google profile", profile);

      User.findOne({ "local.userName": username })
        .select("+local.hashedPassword") //indicate to get hashedpassword
        .exec(
          //return mongoose document
          function(err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false, "Incorrect username");
            }
            if (!user.validPassword(password)) {
              return done(null, false, "Incorrect password");
            }

            user.set("loginMethod", "local");
            user.markModified("shoppingCart"); //otherwise mongo throw save -1 exception
            user.save(); //handle exception later on
            return done(null, user);
          }
        );
    }
  )
);
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  //safety consideration,may send hashed passwd back client,all the query should limit field
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
