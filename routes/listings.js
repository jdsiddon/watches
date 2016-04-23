const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();
const Listing = mongoose.model('Listing');

/* GET listings main page. */
router.get('/', function(req, res, next) {
  Listing.find(function(err, listings) {
    res.render('listings/index', {
      title: 'Your Current Listings',
      listings: listings
    });
  })
});

// New listing form
router.get('/new', function(req, res, next) {
  res.render('listings/form', {
    title: 'Create Listing',
    listing: null
  });
});

// Edit listing
router.get('/edit/:id', function(req, res, next) {
  listing = Listing.findById(req.params.id, function(err, listing) {      // Find the listing.

    // date = moment(listing.date);
    // listing.date = date.format("M/D/YYYY");
    //
    // console.log(date.format("M/D/YYYY"));

    res.render('listings/form', {
      title: 'Update',
      listing: listing
    });
  });
});


// Create listing
router.post('/create', function(req, res, next) {

  listing = Listing.create(req.body, function(err, listing) {
    if(err) {
      return next(err);
    }
    req.flash('success', 'New listing created');
    res.redirect('/listings');
  });

});

module.exports = router;
