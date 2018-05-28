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
if (process.env.NODE_ENV !== "production") {
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
mongoose.connection
  .once("open", () => console.log("mongo connect success"))
  .on("error", error => {
    console.warn("Warning", error);
  });

//middlewares

app.use(
  session({
    secret: "cats",
    name: "sue_burger_cookie",
    resave: true,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

//passport strategy configuration
require("./services/passport");

//routes
require("./routes/authRoutes")(app);
require("./routes/dataRoutes")(app);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build")); //express serve assets like *.js *.css file
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//start server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production")
  httpsServer.listen(PORT, function() {
    console.log("HTTPS Server is running on https://localhost:%s", PORT);
  });
else app.listen(PORT);
