var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
const User = mongoose.model('User');

/* GET user login form. */
router.get('/', function(req, res, next) {
  res.render('users/login', {
    title: 'Login'
  });
});

/* New user form. */
router.get('/new', function(req, res, next) {
  res.render('users/new', {
    title: 'Create New Account'
  });
});

/* Create new user. */
router.post('/new', function(req, res, next) {
  console.log(req.body);
  user = User.create(req.body, function(err, user) {
    res.render('users/login', {
      title: 'Login'
    });
  })
});


// Login route
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

module.exports = router;
