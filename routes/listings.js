const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();
const Listing = mongoose.model('Listing');
const Site = mongoose.model('Site');
const fs = require('fs');
const multer = require('multer');

// Stores images attached in public folder.
var upload = multer({
  dest: 'public/uploads',
  limits: { fileSize: 1000000, files: 1 }
});


/* GET listings main page. */
router.get('/', function(req, res, next) {
  Listing
    .find({ _user: req.user })           // Only return their own listings.
    .populate('_site')
    .populate('_user')
    .exec(function(err, listings) {
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


// Get listing edit form.
router.get('/edit/:id', function(req, res, next) {
  Listing
    .findById(req.params.id)
    .populate('_site')
    .exec(function(err, listing) {
      Site.find(function(err, sites) {
        res.render('listings/form', {
          title: 'Update',
          listing: listing,
          sites: sites
        });
      })
    });
});


// Update listing.
router.post('/edit/:id', upload.single('image'), function(req, res, next) {
  console.log(req.body);

  listing = Listing.findById(req.params.id, function(err, listing) {      // Find the listing.
    if(err || !listing) {
      res.json({ success: 'false', failure: (err ? err : 'listing not found') });
    } else {

      if(req.body.site) {     // If user provided a site, link the site up.
        Site.findById(req.body.site, function(err, site) {
          listing._site = site._id;    // Connect the site to the listing.
        });
      }

      listing._user = req.user._id;
      listing.price = req.body.price;
      listing.url = req.body.url;
      listing.type = req.body.type;
      listing.state = req.body.state;
      if(req.file) {
        listing.img = "/" + req.file.destination.split("/")[1] + "/" + req.file.filename;                  // /uploads/[IMG_NAME]
      }
      listing.watch.brand = req.body.watch.brand;
      listing.watch.model_name = req.body.watch.model_name;

      listing.save(function (err, listing) {
        if (err) return console.error(err);

        req.flash('success', 'Updated listing');
        res.redirect('/listings');
      });
    }
  });
});


// Create listing
router.post('/create', upload.single('image'), function(req, res, next) {
  console.log(req.body);
  console.log(req.user);

  Site.findById(req.body.site, function(err, site) {

    var list = new Listing;

    list._site = site._id;
    list._user = req.user._id;
    list.price = req.body.price;
    list.url = req.body.url;
    list.type = req.body.type;
    list.state = req.body.state;
    if(req.file) {
      list.img = "/" + req.file.destination.split("/")[1] + "/" + req.file.filename;                  // /uploads/[IMG_NAME]
    }
    list.watch.brand = req.body.watch.brand;
    list.watch.model_name = req.body.watch.model_name;

    listing = Listing.create(list, function(err, listing) {
      if(err) {
        console.log(err);
        return next(err);
      }
      req.flash('success', 'New listing created');
      res.redirect('/listings');
    });
  })

});

/* Delete Listing */
router.delete('/:id', function(req, res, next) {
  Listing.findById(req.params.id, function(err, listing) {      // Find the listing.
    if(err || !listing) {
      res.json({ success: 'false', failure: (err ? err : 'listing not found') });
    } else {
      console.log(listing);
      listing.remove(function(err, result) {
        if(err) {
          res.json({
            success: 'false',
            message: err
          });
        }
        // res.render('/');
        res.json({
          success: 'true',
          message: 'Successfully Removed'
        });
      });
    }
  });
});

module.exports = router;
