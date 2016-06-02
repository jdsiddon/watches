const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const User = mongoose.model('User');
const passwordHash = require('password-hash');

// Set up passport
passport.use(new Strategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if(err) { return done(err); }
      if(!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      if(!passwordHash.verify(password, user.password)) {    // Passwords don't match :(
        return done(null, false, { message: "Incorrect Password" });
      }
      console.log(username, password);
      return done(null, user);
    });
  }
));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
  console.log(user);
  cb(null, user.id);
});

//
passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
