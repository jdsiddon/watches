const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();
const Listing = mongoose.model('Listing');
const Site = mongoose.model('Site');

/* GET listings main page. */
router.get('/', function(req, res, next) {
  Listing
    .find()
    .populate('_site')
    .exec(function(err, listings) {
      console.log(listings);
      res.render('listings/index', {
        title: 'Your Current Listings',
        listings: listings
      });
    })
});


// New listing form
router.get('/new', function(req, res, next) {
  Site.find(function(err, sites) {
    res.render('listings/form', {
      title: 'Create Listing',
      listing: null,
      sites: sites
    });
  })
});


// Edit listing
router.get('/edit/:id', function(req, res, next) {
  Listing
    .findById(req.params.id)
    .populate('_site')
    .exec(function(err, listing) {
      Site.find(function(err, sites) {
        console.log(listing);
        res.render('listings/form', {
          title: 'Update',
          listing: listing,
          sites: sites
        });
      })
    });
});


// Create listing
router.post('/create', function(req, res, next) {
  Site.findById(req.body.site, function(err, site) {

    req.body._site = site._id;    // Connect the site to the listing.

    listing = Listing.create(req.body, function(err, listing) {
      if(err) {
        console.log(err);
        return next(err);
      }
      req.flash('success', 'New listing created');
      res.redirect('/listings');
    });
  })

});

module.exports = router;
