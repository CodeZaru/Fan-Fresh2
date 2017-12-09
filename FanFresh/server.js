// Dependencies
// =============================================================
var express = require("express");
//var bodyParser = require("body-parser");
var path = require("path");
var exphbs = require("express-handlebars");



// Sets up the Express App
// =============================================================
var app = express();
var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').load();
var PORT = 3000;

// Set up the Express App to use the public folder
app.use(express.static('public'));


//app.use(express.favicon());

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
 
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions


// Set Handlebars as the default templating engine
// =============================================================
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Routes
// =============================================================
// Basic route that sends the user to the index page
app.get("/", function(req, res) {
    res.render("index");
});

// Route that sends the user to the top artists page
app.get("/top", function(req, res) {
  res.render("top");
});

// Route that sends the user to the main search page (this is where they will go after they log in)
app.get("/home", function(req, res) {
  res.render("home");
});

//////////////////////////////////////////////////////////////////
//heroku test
/*

*/
/////////////////////////////////

//Models
var models = require("./app/models");
 
//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});
////////////////////////////////////////////////////

//Routes
var authRoute = require('./routes/auth.js')(app,passport);
///////////////////

//load passport strategies
require('./config/passport/passport.js')(passport, models.user);

//////////////////////
var authRoute = require('./routes/auth.js')(app,passport);
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
