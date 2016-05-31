const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

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

/* Logout user. */
router.get('/logout', function(req, res, next) {
  console.log('logging out');
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});

/* Login form. */
router.get('/login', function(req, res, next) {
  res.render('users/login', {
    title: 'Login'
  });
});

/* Login method. */
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.session);
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.redirect('/');
  }
);

module.exports = router;
