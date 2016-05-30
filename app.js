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


// Database
mongoose.connect('mongodb://localhost/watches');
const db = mongoose.connection;
const Schemas = require('./models')

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  // Connected!
  console.log('Connected!');
})

const User = mongoose.model('User');

// Set up passport
passport.use(new Strategy(
  function(username, password, cb) {
    console.log(username, password);

    User.find({ username: username }, function(err, user) {
      console.log(user);
      // if(err) {
      //   console.log(err);
      //   return cb(err);
      // }
      // if(!user) {
      //   console.log("null");
      //   return cb(null, false);
      // }
      // if(user.password != password) {
      //   console.log("bad pw");
      //   return cb(null, false);
      // }
      // console.log(user);
      // return cb(null, user);
    })
  }
));

// Configure Passport authenticated session persistence.
// passport.serializeUser(function(user, cb) {
//   cb(null, user.id);
// });
//
// passport.deserializeUser(function(id, cb) {
//   db.users.findById(id, function (err, user) {
//     if (err) { return cb(err); }
//     cb(null, user);
//   });
// });


const routes = require('./routes/index');
const users = require('./routes/users');
const watches = require('./routes/watches');
const listings = require('./routes/listings');
const api = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
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

app.use('/', routes);
app.use('/users', users);
app.use('/watches', watches);
app.use('/listings', listings);
app.use('/api', api);


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
