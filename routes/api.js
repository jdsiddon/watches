const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Listing = mongoose.model('Listing');

/* Get all current listings. */
router.get('/', function(req, res, next) {
  Listing.find(function(err, listings) {
    if(err) {
      res.json({
        success: 'false',
        message: err
      });
    }

    res.json({
      success: 'true',
      message: 'success',
      listings: listings
    });
  })
});


/* Create new listing. */
router.post('/create', function(req, res, next) {
  listing = Listing.create(req.body, function(err, listing) {
    if(err) {
      res.json({
        success: 'false',
        message: err
      });
    }
    res.json({
      success: 'true',
      message: 'success',
      listing: listing
    });
  });
});


/* Edit listing */
router.put('/update/:id', function(req, res, next) {
  listing = Listing.findById(req.params.id, function(err, listing) {      // Find the listing.
    if(err) {
      res.json({
        success: 'false',
        failure: err
      });
    }
    res.json({
      success: 'true',
      message: 'successfully updated listing',
      listing: listing
    });
  });
});

/* Edit listing */
router.delete('/delete/:id', function(req, res, next) {
  listing = Listing.findById(req.params.id, function(err, listing) {      // Find the listing.
    if(err) {
      res.json({
        success: 'false',
        message: err
      });
    }
    res.json({
      success: 'true',
      message: 'successfully deleted listing',
      success: listing
    });
  });
});

module.exports = router;
