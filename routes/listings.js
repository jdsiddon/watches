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
  console.log(req.isAuthenticated());
  console.log(req.user);

  Listing
    .find({ _user: req.user })           // Only return their own listings.
    .populate('_site')
    .populate('_user')
    .exec(function(err, listings) {
      // console.log(listings);
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
router.post('/create', upload.single('image'), function(req, res, next) {
  console.log(req.body);

  Site.findById(req.body.site, function(err, site) {

    var list = new Listing;

    list._site = site._id;
    list._user = req.user._id;
    list.price = req.body.price;
    list.date = req.body.date;
    list.url = req.body.url;
    list.type = req.body.type;
    list.state = req.body.state;
    list.img = "/" + req.file.destination.split("/")[1] + "/" + req.file.filename;                  // /uploads/[IMG_NAME]
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

module.exports = router;
