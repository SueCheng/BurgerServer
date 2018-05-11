const express = require("express");
const app = express();
const mongoose = require("mongoose");
const keys = require("./config/keys");
var fs = require("fs");
var path = require("path");
var https = require("https");
const passport = require("passport");
var session = require("express-session");
const bodyParser = require("body-parser");

//httpsServer
if (process.env.NODE_ENV === "development") {
  var privateKey = fs.readFileSync(
    path.join(__dirname, "./cert/private.pem"),
    "utf8"
  );
  var certificate = fs.readFileSync(
    path.join(__dirname, "./cert/file.crt"),
    "utf8"
  );
  var credentials = { key: privateKey, cert: certificate };

  var httpsServer = https.createServer(credentials, app);
}
//Mongo Connect
mongoose.connect(keys.mongoURI);

//middlewares
app.use(express.static("publuc"));
app.use(
  session({
    secret: "cats",
    name: "sue_burger_cookie",
    resave: true,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

//passport strategy configuration
require("./services/passport");

//routes
require("./routes/authRoutes")(app);

//start server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === "development")
  httpsServer.listen(PORT, function() {
    console.log("HTTPS Server is running on https://localhost:%s", PORT);
  });
else app.listen(PORT);
