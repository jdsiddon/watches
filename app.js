const express = require('express');
const flash = require('connect-flash');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const db = require('./db');       // Database connection information.

// Passport configs.
const auth = require('./auth/index');

const routes = require('./routes/index');
const users = require('./routes/users');
const watches = require('./routes/watches');
const listings = require('./routes/listings');

// API
const listingApi = require('./routes/api/listings');
const siteApi = require('./routes/api/sites');
const userApi = require('./routes/api/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));


// Initialize passport session.
app.use(passport.initialize());
app.use(passport.session());

// Set up flash messages.
app.use(flash());

app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));


// Get the user and their authentication status.
app.use(function(req, res, next) {
  if(req.user) {
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
  }
  next();
});

app.use('/', routes);             // Unprotected routes.

// Require Authorization to vist all routes from here on.
app.use(function(req, res, next) {
  if (req.isAuthenticated()
  || req.path === '/users/login'
  || req.path === '/users/new'
  || req.path === '/api/listings'
  || req.path === '/api/listings/new'
  || req.path === '/api/listings/delete'
  || req.path === '/api/listings/get'
  || req.path === '/api/listings/edit'
  || req.path === '/api/users/login') {
    console.log("First Path: " + req.path);
    next();

  } else {
    res.redirect("/users/login");
  }
});

app.use('/users', users);
app.use('/watches', watches);
app.use('/listings', listings);

// API Routes
app.use('/api/listings', listingApi);
app.use('/api/sites', siteApi);
app.use('/api/users', userApi);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
