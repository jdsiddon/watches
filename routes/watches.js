const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Watch = mongoose.model('Watch');

/* GET watch main page. */
router.get('/', function(req, res, next) {
  Watch.find(function(err, watches) {
    res.render('watches/index', {
      title: 'Watches',
      watches: watches
    });
  })
});

// New watch form
router.get('/new', function(req, res, next) {
  res.render('watches/form', {
    title: 'Create New',
    watch: null
  });
});

// Edit watch
router.get('/edit/:id', function(req, res, next) {
  watch = Watch.findById(req.params.id, function(err, watch) {      // Find the watch.
    res.render('watches/form', {
      title: 'Update',
      watch: watch
    });
  });
});


// Create watch
router.post('/create', function(req, res, next) {

  // validate the input
  req.checkBody('brand', 'Brand is required').notEmpty();
  req.checkBody('model_name', 'Model is required').notEmpty();
  req.checkBody('price', 'Price is required').notEmpty();
  req.checkBody('state', 'State is required').notEmpty();

  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {   // Return to form with selected fields.
    res.render('watches/form', { flash: { type: 'alert-danger', messages: errors }, watch: req.body });
  }
  else {
    Watch.findById(req.body.id, function(err, watch) {
      if(!watch) {        // Create new watch.
        watch = Watch.create(req.body, function(err, watch) {
          if(err) return next(err);

          req.flash('success', 'New watch created');
          res.redirect('/watches');
        });

      } else {            // Update watch.
        watch.update(req.body, function(err, watch) {
          req.flash('success', 'Updated watch');
          res.redirect('/watches');
        });
      }
    })
  }

});

module.exports = router;
