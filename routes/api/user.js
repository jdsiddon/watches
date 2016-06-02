const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');


/* Logout user. */
router.post('/logout', function(req, res, next) {
  console.log('logging out');
  req.session.destroy(function (err) {
    if(err) {
      res.json({
        success: 'false',
        message: err
      });
    }

    res.json({
      success: 'true',
      message: 'Successfully Logged Out'
    });
  });
});

/* Login method. */
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res, next) {
    
    // User is authenticated, now create the new item.
    if(req.body.new_item) {
      next();
    } else {
      // Send success message, user isn't trying to create new item.
      res.json({
        success: 'true',
        message: 'Successfully Logged In'
      });
    }
  }
);

module.exports = router;
